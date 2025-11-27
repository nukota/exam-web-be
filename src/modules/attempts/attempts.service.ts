import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attempt } from './entities/attempt.entity';
import { AttemptStatus } from '../../common/enum';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { ExamsService } from '../exams/exams.service';

@Injectable()
export class AttemptsService {
  constructor(
    @InjectRepository(Attempt)
    private readonly attemptRepository: Repository<Attempt>,
    private readonly examsService: ExamsService,
  ) {}

  async create(createDto: CreateAttemptDto): Promise<Attempt> {
    const attempt = this.attemptRepository.create(createDto);
    return await this.attemptRepository.save(attempt);
  }

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
}
