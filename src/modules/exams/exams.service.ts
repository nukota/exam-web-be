import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttemptStatus } from '../../common/enum';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './entities/exam.entity';
import {
  AllExamsPageDto,
  AllExamsPageItemDto,
  ExamStatus,
} from './dto/all-exams-page.dto';
import { DetailedExamDto } from './dto/detailed-exam.dto';
import { QuestionsService } from '../questions/questions.service';
import { GradingPageDto, GradingPageItemDto } from './dto/grading-page.dto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    private readonly questionsService: QuestionsService,
  ) {}

  private generateAccessCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    return result;
  }

  async create(createExamDto: CreateExamDto, teacherId: string): Promise<Exam> {
    const examData = {
      ...createExamDto,
      teacher_id: teacherId,
      access_code: this.generateAccessCode(),
    };
    const exam = this.examRepository.create(examData);
    return await this.examRepository.save(exam);
  }

  async findOne(id: string): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { exam_id: id },
    });
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
    return exam;
  }

  async findByAccessCode(accessCode: string): Promise<Exam | null> {
    return await this.examRepository.findOne({
      where: { access_code: accessCode },
    });
  }

  async update(id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.findOne(id);

    // Extract questions from the DTO
    const { questions, ...examData } = updateExamDto;

    // Update exam data
    Object.assign(exam, examData);
    const updatedExam = await this.examRepository.save(exam);

    // Update questions if provided
    if (questions) {
      await this.questionsService.updateQuestionsForExam(id, questions);
    }

    return updatedExam;
  }

  async remove(id: string): Promise<void> {
    const result = await this.examRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
  }

  async canReleaseResults(examId: string): Promise<{
    canRelease: boolean;
    reason?: string;
    totalAttempts: number;
    gradedAttempts: number;
  }> {
    const exam = await this.examRepository.findOne({
      where: { exam_id: examId },
      relations: ['attempts'],
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${examId} not found`);
    }

    // Check if exam has ended
    const now = new Date();
    if (exam.end_at > now) {
      return {
        canRelease: false,
        reason: 'Exam has not ended yet',
        totalAttempts: exam.attempts.length,
        gradedAttempts: 0,
      };
    }

    // Check if all attempts are graded
    const totalAttempts = exam.attempts.length;
    const submittedOrOverdueAttempts = exam.attempts.filter(
      (attempt) =>
        attempt.status === AttemptStatus.SUBMITTED ||
        attempt.status === AttemptStatus.OVERDUE,
    );
    const gradedAttempts = exam.attempts.filter(
      (attempt) => attempt.status === AttemptStatus.GRADED,
    ).length;

    if (submittedOrOverdueAttempts.length > 0) {
      return {
        canRelease: false,
        reason: `${submittedOrOverdueAttempts.length} attempt(s) still need to be graded`,
        totalAttempts,
        gradedAttempts,
      };
    }

    return {
      canRelease: true,
      totalAttempts,
      gradedAttempts,
    };
  }

  async releaseResults(examId: string): Promise<Exam> {
    const checkResult = await this.canReleaseResults(examId);

    if (!checkResult.canRelease) {
      throw new BadRequestException(
        `Cannot release results: ${checkResult.reason}`,
      );
    }

    const exam = await this.findOne(examId);
    exam.results_released = true;
    return await this.examRepository.save(exam);
  }

  async getDetailedExam(examId: string): Promise<DetailedExamDto> {
    const exam = await this.examRepository.findOne({
      where: { exam_id: examId },
    });

    if (!exam) {
      throw new NotFoundException(`Exam with ID ${examId} not found`);
    }

    // Get detailed questions with choices and test cases from QuestionsService
    const detailedQuestions =
      await this.questionsService.getDetailedQuestionsForExam(examId);

    // Build and return detailed exam DTO
    return {
      exam_id: exam.exam_id,
      teacher_id: exam.teacher_id,
      title: exam.title,
      description: exam.description,
      type: exam.type,
      access_code: exam.access_code,
      start_at: exam.start_at?.toISOString(),
      end_at: exam.end_at.toISOString(),
      created_at: exam.created_at.toISOString(),
      duration_minutes: exam.duration_minutes,
      results_released: exam.results_released,
      questions: detailedQuestions,
    };
  }

  async getAllExamsPage(
    userId: string,
    userRole: string,
  ): Promise<AllExamsPageDto> {
    let exams = await this.examRepository.find({
      relations: ['questions', 'attempts'],
    });

    // Filter exams based on user role
    if (userRole === 'student') {
      // Only return exams where the student has an attempt
      exams = exams.filter((exam) =>
        exam.attempts.some((attempt) => attempt.user_id === userId),
      );
    }
    // For admin role, return all exams (no filtering needed)

    const now = new Date();

    return exams.map((exam) => {
      const questionAmount = exam.questions.length;
      let status: ExamStatus;

      // Determine exam status
      if (exam.results_released) {
        status = 'released';
      } else if (exam.end_at < now) {
        // Exam has ended, check if all attempts are graded
        const submittedOrOverdueAttempts = exam.attempts.filter(
          (attempt) =>
            attempt.status === AttemptStatus.SUBMITTED ||
            attempt.status === AttemptStatus.OVERDUE,
        );
        status = submittedOrOverdueAttempts.length === 0 ? 'graded' : 'ended';
      } else if (exam.start_at && exam.start_at <= now) {
        status = 'started';
      } else {
        status = 'not started';
      }

      return {
        exam_id: exam.exam_id,
        teacher_id: exam.teacher_id,
        title: exam.title,
        description: exam.description,
        type: exam.type,
        access_code: exam.access_code,
        start_at: exam.start_at?.toISOString(),
        end_at: exam.end_at.toISOString(),
        created_at: exam.created_at.toISOString(),
        duration_minutes: exam.duration_minutes,
        results_released: exam.results_released,
        question_amount: questionAmount,
        status,
      } as AllExamsPageItemDto;
    });
  }

  async getGradingPage(): Promise<GradingPageDto> {
    const exams = await this.examRepository.find({
      relations: ['teacher', 'attempts', 'attempts.answers', 'questions'],
    });

    return exams.map((exam) => {
      // Count total submissions (submitted or overdue)
      const totalSubmissions = exam.attempts.filter(
        (attempt) =>
          attempt.status === AttemptStatus.SUBMITTED ||
          attempt.status === AttemptStatus.OVERDUE,
      ).length;

      // Count pending submissions (need grading for essay questions)
      // Check if exam has essay questions
      const hasEssayQuestions = exam.questions.some(
        (q) => q.question_type === 'essay',
      );

      let pendingSubmissions = 0;
      if (hasEssayQuestions) {
        pendingSubmissions = exam.attempts.filter((attempt) => {
          if (
            attempt.status !== AttemptStatus.SUBMITTED &&
            attempt.status !== AttemptStatus.OVERDUE
          ) {
            return false;
          }
          // Check if any essay answers are not graded (score is null)
          const essayQuestionIds = exam.questions
            .filter((q) => q.question_type === 'essay')
            .map((q) => q.question_id);
          const hasUngradedEssay = attempt.answers.some(
            (answer) =>
              essayQuestionIds.includes(answer.question_id) &&
              answer.score === null,
          );
          return hasUngradedEssay;
        }).length;
      }

      return {
        exam_id: exam.exam_id,
        title: exam.title,
        description: exam.description,
        end_at: exam.end_at.toISOString(),
        total_submissions: totalSubmissions,
        pending_submissions: pendingSubmissions,
        teacher: {
          teacher_id: exam.teacher.user_id,
          full_name: exam.teacher.full_name,
          email: exam.teacher.email,
        },
      } as GradingPageItemDto;
    });
  }
}
