import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attempt } from '../entities/attempt.entity';
import { AttemptStatus } from '../../../common/enum';
import { CreateAttemptDto } from '../dto/create-attempt.dto';
import { ExamsService } from '../../exams/exams.service';
import { ExamAttemptsPageDto } from '../dto/exam-attempts-page.dto';
import { SubmissionReviewPageDto } from '../dto/submission-review-page.dto';
import { GradeEssayDto } from '../dto/grade-essay.dto';
import { ExamLeaderboardPageDto } from '../dto/exam-leaderboard-page.dto';

@Injectable()
export class AdminAttemptsService {
  constructor(
    @InjectRepository(Attempt)
    private readonly attemptRepository: Repository<Attempt>,
    private readonly examsService: ExamsService,
  ) {}

  async create(createDto: CreateAttemptDto): Promise<Attempt> {
    const attempt = this.attemptRepository.create(createDto);
    return await this.attemptRepository.save(attempt);
  }

  async getExamAttempts(examId: string): Promise<ExamAttemptsPageDto> {
    // Verify exam exists
    const exam = await this.examsService.findOne(examId);

    // Get all attempts for this exam with user relations
    const attempts = await this.attemptRepository.find({
      where: { exam_id: examId },
      relations: ['user'],
    });

    // Calculate max score from exam questions
    const detailedExam = await this.examsService.getDetailedExam(examId);
    const maxScore = detailedExam.questions.reduce(
      (sum, q) => sum + (q.points || 0),
      0,
    );

    // Calculate statistics
    const totalAttempts = attempts.length;
    const gradedAttempts = attempts.filter(
      (a) => a.status === AttemptStatus.GRADED,
    ).length;
    const flaggedAttempts = attempts.filter((a) => a.cheated).length;

    // Map attempts to DTO format
    const attemptsDTO = attempts.map((attempt) => {
      const percentageScore =
        attempt.total_score != null && maxScore > 0
          ? (attempt.total_score / maxScore) * 100
          : undefined;

      return {
        attempt_id: attempt.attempt_id,
        student: {
          user_id: attempt.user.user_id,
          full_name: attempt.user.full_name,
          email: attempt.user.email,
        },
        submitted_at: attempt.submitted_at?.toISOString(),
        percentage_score: percentageScore,
        total_score: attempt.total_score,
        cheated: attempt.cheated,
        status: attempt.status,
      };
    });

    return {
      exam_id: exam.exam_id,
      title: exam.title,
      description: exam.description,
      max_score: maxScore,
      total_attempts: totalAttempts,
      graded_attempts: gradedAttempts,
      flagged_attempts: flaggedAttempts,
      attempts: attemptsDTO,
    };
  }

  async getSubmissionReview(
    attemptId: string,
  ): Promise<SubmissionReviewPageDto> {
    // Get attempt with all related data
    const attempt = await this.attemptRepository.findOne({
      where: { attempt_id: attemptId },
      relations: [
        'user',
        'exam',
        'answers',
        'answers.question',
        'answers.question.choices',
      ],
    });

    if (!attempt) {
      throw new NotFoundException(`Attempt with ID ${attemptId} not found`);
    }

    // Get detailed exam to calculate max score
    const detailedExam = await this.examsService.getDetailedExam(
      attempt.exam_id,
    );
    const maxScore = detailedExam.questions.reduce(
      (sum, q) => sum + (q.points || 0),
      0,
    );

    // Get flags for this user and exam
    const flags = await this.attemptRepository.query(
      `SELECT question_id FROM flags WHERE user_id = $1`,
      [attempt.user_id],
    );
    const flaggedQuestionIds = new Set(flags.map((f: any) => f.question_id));

    // Build questions array with answers
    const questions = await Promise.all(
      detailedExam.questions.map(async (question) => {
        // Find the answer for this question
        const answer = attempt.answers.find(
          (a) => a.question_id === question.question_id,
        );

        // Build choices with correctness indicator
        const choices = question.choices?.map((choice) => {
          const reviewChoice = Object.assign(
            Object.create(Object.getPrototypeOf(choice)),
            choice,
          );
          (reviewChoice as any).is_correct =
            question.correct_answer?.includes(choice.choice_id) ?? false;
          (reviewChoice as any).is_chosen =
            answer?.selected_choices?.includes(choice.choice_id) ?? false;
          return reviewChoice;
        });

        // Determine if answered correctly (for auto-gradable questions)
        let answeredCorrectly: boolean | undefined = undefined;
        if (
          answer &&
          (question.question_type === 'single_choice' ||
            question.question_type === 'multiple_choice')
        ) {
          const selectedSet = new Set(answer.selected_choices || []);
          const correctSet = new Set(question.correct_answer || []);
          answeredCorrectly =
            selectedSet.size === correctSet.size &&
            [...selectedSet].every((id) => correctSet.has(id));
        } else if (
          answer &&
          question.question_type === 'short_answer' &&
          question.correct_answer_text
        ) {
          answeredCorrectly = question.correct_answer_text.some(
            (correct) =>
              correct.toLowerCase().trim() ===
              answer.answer_text?.toLowerCase().trim(),
          );
        }

        return {
          question_id: question.question_id || '',
          exam_id: detailedExam.exam_id,
          question_text: question.question_text,
          title: question.title,
          order: question.order || 0,
          question_type: question.question_type as any,
          points: question.points || 0,
          correct_answer: question.correct_answer,
          correct_answer_text: question.correct_answer_text,
          coding_template: question.coding_template,
          programming_languages: question.programming_languages as any,
          answer_text: answer?.answer_text,
          selected_choices: answer?.selected_choices,
          score: answer?.score,
          choices,
          is_flagged: flaggedQuestionIds.has(question.question_id || ''),
          answered_correctly: answeredCorrectly,
        };
      }),
    );

    return {
      attempt_id: attempt.attempt_id,
      student: {
        user_id: attempt.user.user_id,
        full_name: attempt.user.full_name,
        email: attempt.user.email,
      },
      exam: {
        exam_id: attempt.exam.exam_id,
        title: attempt.exam.title,
        max_score: maxScore,
      },
      total_score: attempt.total_score,
      cheated: attempt.cheated,
      submitted_at: attempt.submitted_at?.toISOString(),
      questions,
    };
  }

  async getExamLeaderboard(examId: string): Promise<ExamLeaderboardPageDto> {
    // Verify exam exists
    const exam = await this.examsService.findOne(examId);

    // Get detailed exam to calculate max score
    const detailedExam = await this.examsService.getDetailedExam(examId);
    const maxScore = detailedExam.questions.reduce(
      (sum, q) => sum + (q.points || 0),
      0,
    );

    // Get all submitted attempts for this exam with user relations
    const submittedAttempts = await this.attemptRepository.find({
      where: { exam_id: examId },
      relations: ['user'],
    });

    // Check and update overdue attempts
    const now = new Date();
    for (const attempt of submittedAttempts) {
      if (attempt.status === AttemptStatus.NOT_STARTED && exam.end_at < now) {
        attempt.status = AttemptStatus.OVERDUE;
        await this.attemptRepository.save(attempt);
      }
    }

    // Include all attempts for this exam (no status filtering)
    const validAttempts = submittedAttempts;

    // Sort by score descending, nulls last
    const sortedAttempts = validAttempts.sort((a, b) => {
      // If both have scores, sort by score desc
      if (a.total_score != null && b.total_score != null) {
        return b.total_score - a.total_score;
      }
      // If a has score and b doesn't, a comes first
      if (a.total_score != null && b.total_score == null) {
        return -1;
      }
      // If b has score and a doesn't, b comes first
      if (a.total_score == null && b.total_score != null) {
        return 1;
      }
      // Both null, sort by submission time (earlier first)
      return (
        (a.submitted_at?.getTime() || 0) - (b.submitted_at?.getTime() || 0)
      );
    });

    // Build leaderboard with ranks
    const leaderboard = sortedAttempts.map((attempt, index) => ({
      rank: index + 1,
      student: {
        user_id: attempt.user.user_id,
        full_name: attempt.user.full_name,
        email: attempt.user.email,
      },
      score: attempt.total_score ?? undefined,
      submitted_at: attempt.submitted_at?.toISOString(),
      attempt_id: attempt.attempt_id,
      status: attempt.status,
    }));

    return {
      exam: {
        exam_id: exam.exam_id,
        title: exam.title,
        max_score: maxScore,
      },
      leaderboard,
    };
  }

  async findAll(): Promise<Attempt[]> {
    return await this.attemptRepository.find();
  }

  async findOne(id: string): Promise<Attempt> {
    const attempt = await this.attemptRepository.findOne({
      where: { attempt_id: id },
    });
    if (!attempt) {
      throw new NotFoundException(`Attempt with ID ${id} not found`);
    }
    return attempt;
  }

  async remove(id: string): Promise<void> {
    const result = await this.attemptRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Attempt with ID ${id} not found`);
    }
  }

  async gradeEssay(
    attemptId: string,
    gradeEssayDto: GradeEssayDto,
  ): Promise<Attempt> {
    const attempt = await this.attemptRepository.findOne({
      where: { attempt_id: attemptId },
      relations: ['answers', 'answers.question'],
    });

    if (!attempt) {
      throw new NotFoundException(`Attempt with ID ${attemptId} not found`);
    }

    // Update scores for each question grade
    for (const grade of gradeEssayDto.question_grades) {
      const answer = attempt.answers.find(
        (a) => a.question_id === grade.question_id,
      );

      if (!answer) {
        throw new NotFoundException(
          `Answer for question ${grade.question_id} not found in this attempt`,
        );
      }

      // Validate score doesn't exceed question points
      if (grade.score > answer.question.points) {
        throw new BadRequestException(
          `Score ${grade.score} exceeds maximum points ${answer.question.points} for question ${grade.question_id}`,
        );
      }

      // Update answer score
      answer.score = grade.score;
      await this.attemptRepository.manager.save(answer);
    }

    // Recalculate total score
    const totalScore = attempt.answers.reduce(
      (sum, answer) => sum + (answer.score || 0),
      0,
    );
    attempt.total_score = totalScore;

    // Update attempt status to graded
    attempt.status = AttemptStatus.GRADED;

    return await this.attemptRepository.save(attempt);
  }
}
