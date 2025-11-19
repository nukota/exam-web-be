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

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private readonly examRepository: Repository<Exam>,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const exam = this.examRepository.create(createExamDto);
    return await this.examRepository.save(exam);
  }

  async findAll(): Promise<Exam[]> {
    return await this.examRepository.find();
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

  async findByTeacherId(teacherId: string): Promise<Exam[]> {
    return await this.examRepository.find({
      where: { teacher_id: teacherId },
    });
  }

  async findByAccessCode(accessCode: string): Promise<Exam | null> {
    return await this.examRepository.findOne({
      where: { access_code: accessCode },
    });
  }

  async update(id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.findOne(id);
    Object.assign(exam, updateExamDto);
    return await this.examRepository.save(exam);
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
    if (!exam.end_at) {
      return {
        canRelease: false,
        reason: 'Exam has no end time set',
        totalAttempts: exam.attempts.length,
        gradedAttempts: 0,
      };
    }

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
}
