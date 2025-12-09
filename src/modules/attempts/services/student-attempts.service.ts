import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attempt } from '../entities/attempt.entity';
import { Answer } from '../../answers/entities/answer.entity';
import { AttemptStatus } from '../../../common/enum';
import { ExamsService } from '../../exams/exams.service';
import { SubmitExamDto } from '../dto/submit-exam.dto';
import { ExamResultPageDto } from '../dto/exam-result-page.dto';
import { MyResultsPageDto } from '../dto/my-results-page.dto';
import { autoGradeAnswer } from '../../../common/utils/helpers';
import { Judge0Service } from '../../../common/services/judge0.service';

@Injectable()
export class StudentAttemptsService {
  constructor(
    @InjectRepository(Attempt)
    private readonly attemptRepository: Repository<Attempt>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
    private readonly examsService: ExamsService,
    private readonly judge0Service: Judge0Service,
  ) {}

  async joinExam(accessCode: string, userId: string): Promise<Attempt> {
    // Find exam by access code
    const exam = await this.examsService.findByAccessCode(accessCode);
    if (!exam) {
      throw new NotFoundException(
        `Exam with access code ${accessCode} not found`,
      );
    }

    // Check if student already has an attempt for this exam
    const existingAttempt = await this.attemptRepository.findOne({
      where: { exam_id: exam.exam_id, user_id: userId },
    });

    if (existingAttempt) {
      throw new BadRequestException('You have already joined this exam');
    }

    // Create new attempt
    const attempt = this.attemptRepository.create({
      exam_id: exam.exam_id,
      user_id: userId,
      status: AttemptStatus.NOT_STARTED,
    });

    return await this.attemptRepository.save(attempt);
  }

  async leaveExam(examId: string, userId: string): Promise<void> {
    const attempt = await this.attemptRepository.findOne({
      where: { exam_id: examId, user_id: userId },
    });

    if (!attempt) {
      throw new NotFoundException('You have not joined this exam');
    }

    // Only allow leaving if the attempt hasn't been submitted
    if (
      attempt.status === AttemptStatus.SUBMITTED ||
      attempt.status === AttemptStatus.GRADED
    ) {
      throw new BadRequestException('Cannot leave exam after submission');
    }

    await this.attemptRepository.remove(attempt);
  }

  async submitExam(
    examId: string,
    userId: string,
    submitExamDto: SubmitExamDto,
  ): Promise<Attempt> {
    // Get attempt with exam and questions
    console.log('Submitting exam for user:', userId, 'exam:', examId);
    const attempt = await this.attemptRepository.findOne({
      where: { exam_id: examId, user_id: userId },
      relations: ['exam'],
    });

    if (!attempt) {
      throw new NotFoundException(`Attempt for exam ${examId} not found`);
    }

    // Check if already submitted
    if (
      attempt.status === AttemptStatus.SUBMITTED ||
      attempt.status === AttemptStatus.GRADED
    ) {
      throw new BadRequestException('Exam has already been submitted');
    }

    // Check if exam time has ended
    const now = new Date();
    const isOverdue = attempt.exam.end_at < now;

    // Check if submission is within time limit (start time + duration)
    // let isWithinTimeLimit = true;
    // if (attempt.started_at && attempt.exam.duration_minutes) {
    //   const allowedEndTime = new Date(attempt.started_at);
    //   allowedEndTime.setMinutes(
    //     allowedEndTime.getMinutes() + attempt.exam.duration_minutes,
    //   );
    //   isWithinTimeLimit = now <= allowedEndTime;
    // }

    // Get detailed exam with questions
    const detailedExam = await this.examsService.getDetailedExam(
      attempt.exam_id,
    );

    // Create or update answers and auto-grade
    let totalScore = 0;
    let hasEssayQuestions = false;

    for (const answerSubmission of submitExamDto.answers) {
      const question = detailedExam.questions.find(
        (q) => q.question_id === answerSubmission.question_id,
      );

      if (!question) {
        throw new NotFoundException(
          `Question ${answerSubmission.question_id} not found in this exam`,
        );
      }

      // Check if answer already exists
      let answer = await this.answerRepository.findOne({
        where: {
          attempt_id: attempt.attempt_id,
          question_id: answerSubmission.question_id,
        },
      });

      if (!answer) {
        answer = this.answerRepository.create({
          attempt_id: attempt.attempt_id,
          question_id: answerSubmission.question_id,
        });
      }

      // Set answer data
      answer.answer_text = answerSubmission.answer_text;
      answer.selected_choices = answerSubmission.selected_choices;

      // Auto-grade based on question type
      const score = await autoGradeAnswer(
        question,
        answerSubmission,
        question.points || 0,
        this.judge0Service,
      );

      if (score !== null) {
        answer.score = score;
        totalScore += score;
      } else {
        // Only essay questions need manual grading
        // Coding questions that return null should still get a score of 0
        if (question.question_type === 'essay') {
          hasEssayQuestions = true;
          answer.score = undefined;
        } else {
          // For coding questions that fail auto-grading, assign 0
          answer.score = 0;
        }
      }

      await this.answerRepository.save(answer);
    }

    // Update attempt
    attempt.submitted_at = now;
    if (submitExamDto.started_at) {
      attempt.started_at = new Date(submitExamDto.started_at);
    }
    attempt.cheated = submitExamDto.cheated;
    attempt.total_score = totalScore;

    // Set status based on conditions
    if (isOverdue /* || !isWithinTimeLimit */) {
      attempt.status = AttemptStatus.OVERDUE;
    } else if (hasEssayQuestions) {
      attempt.status = AttemptStatus.SUBMITTED;
    } else {
      attempt.status = AttemptStatus.GRADED;
    }

    return await this.attemptRepository.save(attempt);
  }

  async getExamLeaderboard(
    examId: string,
    userId: string,
  ): Promise<ExamResultPageDto> {
    // Verify exam exists and get detailed exam info
    const detailedExam = await this.examsService.getDetailedExam(examId);

    // Calculate max score from exam questions
    const maxScore = detailedExam.questions.reduce(
      (sum, q) => sum + (q.points || 0),
      0,
    );

    // Get current student's attempt
    const studentAttempt = await this.attemptRepository.findOne({
      where: { exam_id: examId, user_id: userId },
      relations: ['user'],
    });

    if (!studentAttempt) {
      throw new NotFoundException('You have not joined or submitted this exam');
    }

    // Get all submitted attempts for this exam with user relations
    const submittedAttempts = await this.attemptRepository.find({
      where: { exam_id: examId },
      relations: ['user'],
    });

    // Filter only graded attempts with scores
    const gradedAttempts = submittedAttempts.filter(
      (attempt) =>
        attempt.status === AttemptStatus.GRADED &&
        attempt.total_score != null &&
        attempt.submitted_at != null,
    );

    // Sort by score (descending) and then by submission time (ascending - earlier is better)
    const sortedAttempts = gradedAttempts.sort((a, b) => {
      if (b.total_score !== a.total_score) {
        return (b.total_score || 0) - (a.total_score || 0);
      }
      // If scores are equal, earlier submission ranks higher
      return (
        (a.submitted_at?.getTime() || 0) - (b.submitted_at?.getTime() || 0)
      );
    });

    // Calculate ranks and build leaderboard
    const leaderboard = sortedAttempts.map((attempt, index) => ({
      rank: index + 1,
      name: attempt.user.full_name,
      score: attempt.total_score,
      submitted_at: attempt.submitted_at?.toISOString(),
    }));

    // Find current student's rank
    const studentRankIndex = sortedAttempts.findIndex(
      (attempt) => attempt.user_id === userId,
    );
    const studentRank =
      studentRankIndex !== -1 ? studentRankIndex + 1 : undefined;

    // Calculate percentage score
    const percentageScore =
      studentAttempt.total_score != null && maxScore > 0
        ? (studentAttempt.total_score / maxScore) * 100
        : undefined;

    return {
      attempt_id: studentAttempt.attempt_id,
      exam: {
        exam_id: detailedExam.exam_id,
        title: detailedExam.title,
        description: detailedExam.description,
        max_score: maxScore,
      },
      submitted_at: studentAttempt.submitted_at?.toISOString(),
      percentage_score: percentageScore,
      total_score: studentAttempt.total_score ?? undefined,
      cheated: studentAttempt.cheated,
      status: studentAttempt.status,
      rank: studentRank,
      total_participants: gradedAttempts.length,
      leaderboard: leaderboard,
    };
  }

  async getMyResults(userId: string): Promise<MyResultsPageDto> {
    // Get all attempts for the student
    const attempts = await this.attemptRepository.find({
      where: { user_id: userId },
      relations: ['exam'],
      order: { submitted_at: 'DESC' },
    });

    // Check and update overdue attempts
    const now = new Date();
    for (const attempt of attempts) {
      if (
        attempt.status === AttemptStatus.NOT_STARTED &&
        attempt.exam.end_at < now
      ) {
        attempt.status = AttemptStatus.OVERDUE;
        await this.attemptRepository.save(attempt);
      }
    }

    // Map attempts to DTO format
    const results = await Promise.all(
      attempts.map(async (attempt) => {
        // Get detailed exam to calculate max score
        const detailedExam = await this.examsService.getDetailedExam(
          attempt.exam_id,
        );
        const maxScore = detailedExam.questions.reduce(
          (sum, q) => sum + (q.points || 0),
          0,
        );

        // Calculate percentage score
        const percentageScore =
          attempt.total_score != null && maxScore > 0
            ? (attempt.total_score / maxScore) * 100
            : undefined;

        // If results are not released, hide scores
        const finalPercentageScore = detailedExam.results_released
          ? percentageScore
          : undefined;
        const finalTotalScore = detailedExam.results_released
          ? (attempt.total_score ?? undefined)
          : undefined;

        return {
          attempt_id: attempt.attempt_id,
          exam: {
            exam_id: attempt.exam.exam_id,
            title: attempt.exam.title,
            description: attempt.exam.description,
            max_score: maxScore,
          },
          submitted_at: attempt.submitted_at?.toISOString(),
          percentage_score: finalPercentageScore,
          total_score: finalTotalScore,
          cheated: attempt.cheated,
          status: attempt.status,
        };
      }),
    );

    return { results };
  }
}
