import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DashboardDto } from './dto/dashboard.dto';
import { Exam } from '../exams/entities/exam.entity';
import { User } from '../users/entities/user.entity';
import { Attempt } from '../attempts/entities/attempt.entity';
import { AttemptStatus, UserRole } from '../../common/enum';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Attempt)
    private readonly attemptRepository: Repository<Attempt>,
  ) {}

  async getDashboardData(): Promise<DashboardDto> {
    // Get total exams
    const totalExams = await this.examRepository.count();

    // Get total students (users with role 'student')
    const totalStudents = await this.userRepository.count({
      where: { role: UserRole.STUDENT },
    });

    // Get pending grading count
    const examsWithEssay = await this.examRepository.find({
      relations: ['questions', 'attempts', 'attempts.answers'],
    });

    let pendingGrading = 0;
    for (const exam of examsWithEssay) {
      const hasEssayQuestions = exam.questions.some(
        (q) => q.question_type === 'essay',
      );
      if (hasEssayQuestions) {
        const essayQuestionIds = exam.questions
          .filter((q) => q.question_type === 'essay')
          .map((q) => q.question_id);
        pendingGrading += exam.attempts.filter((attempt) => {
          if (
            attempt.status !== AttemptStatus.SUBMITTED &&
            attempt.status !== AttemptStatus.OVERDUE
          ) {
            return false;
          }
          return attempt.answers.some(
            (answer) =>
              essayQuestionIds.includes(answer.question_id) &&
              answer.score === null,
          );
        }).length;
      }
    }

    // Get average score
    const gradedAttempts = await this.attemptRepository.find({
      where: { status: AttemptStatus.GRADED },
    });
    const avgScore =
      gradedAttempts.length > 0
        ? (
            gradedAttempts.reduce((sum, a) => sum + (a.total_score || 0), 0) /
            gradedAttempts.length
          ).toFixed(2)
        : '0.00';

    // Get exam scores data (last 30 days with 3-day intervals)
    const examScoresData = await this.getExamScoresData();

    // Get exam type distribution
    const examTypeData = await this.getExamTypeData();

    // Get top exams by submission count
    const topExamsData = await this.getTopExamsData();

    // Get student activity data (last 30 days with 3-day intervals)
    const studentActivityData = await this.getStudentActivityData();

    return {
      total_exams: totalExams,
      total_students: totalStudents,
      pending_grading: pendingGrading,
      avg_score: avgScore,
      exam_scores_data: examScoresData,
      exam_type_data: examTypeData,
      top_exams_data: topExamsData,
      student_activity_data: studentActivityData,
    };
  }

  private async getExamScoresData(): Promise<
    { date?: string; avg_score?: number }[]
  > {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const attempts = await this.attemptRepository.find({
      where: { status: AttemptStatus.GRADED },
      relations: ['exam'],
    });

    // Filter attempts from last 30 days
    const recentAttempts = attempts.filter(
      (a) => a.submitted_at && a.submitted_at >= thirtyDaysAgo,
    );

    // Group by 3-day intervals
    const groupedData: { [key: string]: { total: number; count: number } } = {};
    for (const attempt of recentAttempts) {
      if (!attempt.submitted_at) continue;

      const date = new Date(attempt.submitted_at);
      const intervalStart = new Date(date);
      intervalStart.setDate(
        intervalStart.getDate() - (intervalStart.getDate() % 3),
      );
      const key = intervalStart.toISOString().split('T')[0];

      if (!groupedData[key]) {
        groupedData[key] = { total: 0, count: 0 };
      }
      groupedData[key].total += attempt.total_score || 0;
      groupedData[key].count++;
    }

    return Object.entries(groupedData)
      .map(([date, data]) => ({
        date,
        avg_score:
          data.count > 0 ? parseFloat((data.total / data.count).toFixed(1)) : 0,
      }))
      .sort((a, b) => (a.date! > b.date! ? 1 : -1));
  }

  private async getExamTypeData(): Promise<
    { name?: string; value?: number }[]
  > {
    const exams = await this.examRepository.find();

    const typeCount: { [key: string]: number } = {};
    for (const exam of exams) {
      const type = exam.type || 'Unknown';
      typeCount[type] = (typeCount[type] || 0) + 1;
    }

    return Object.entries(typeCount).map(([name, value]) => ({ name, value }));
  }

  private async getTopExamsData(): Promise<
    { exam?: string; submissions?: number }[]
  > {
    const exams = await this.examRepository.find({
      relations: ['attempts'],
    });

    const examSubmissions = exams.map((exam) => ({
      exam: exam.title,
      submissions: exam.attempts.filter(
        (a) =>
          a.status === AttemptStatus.SUBMITTED ||
          a.status === AttemptStatus.GRADED,
      ).length,
    }));

    return examSubmissions
      .sort((a, b) => b.submissions - a.submissions)
      .slice(0, 10);
  }

  private async getStudentActivityData(): Promise<
    { date?: string; students?: number }[]
  > {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const attempts = await this.attemptRepository.find({
      where: {},
    });

    // Filter attempts from last 7 days
    const recentAttempts = attempts.filter(
      (a) =>
        a.submitted_at &&
        new Date(a.submitted_at) >= sevenDaysAgo &&
        (a.status === AttemptStatus.SUBMITTED ||
          a.status === AttemptStatus.GRADED ||
          a.status === AttemptStatus.IN_PROGRESS),
    );

    // Group by day and count unique students
    const groupedData: { [key: string]: Set<string> } = {};
    for (const attempt of recentAttempts) {
      if (!attempt.submitted_at) continue;

      const date = new Date(attempt.submitted_at);
      const key = date.toISOString().split('T')[0];

      if (!groupedData[key]) {
        groupedData[key] = new Set();
      }
      groupedData[key].add(attempt.user_id);
    }

    return Object.entries(groupedData)
      .map(([date, students]) => ({
        date,
        students: students.size,
      }))
      .sort((a, b) => (a.date! > b.date! ? 1 : -1));
  }
}
