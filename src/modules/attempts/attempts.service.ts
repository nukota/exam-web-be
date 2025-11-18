import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { UpdateAttemptDto } from './dto/update-attempt.dto';
import { Attempt } from './entities/attempt.entity';

@Injectable()
export class AttemptsService {
  constructor(
    @InjectRepository(Attempt)
    private readonly attemptRepository: Repository<Attempt>,
  ) {}

  async create(createDto: CreateAttemptDto): Promise<Attempt> {
    const attempt = this.attemptRepository.create(createDto);
    return await this.attemptRepository.save(attempt);
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

  async findByExamId(examId: string): Promise<Attempt[]> {
    return await this.attemptRepository.find({
      where: { exam_id: examId },
    });
  }

  async findByUserId(userId: string): Promise<Attempt[]> {
    return await this.attemptRepository.find({
      where: { user_id: userId },
    });
  }

  async update(id: string, updateDto: UpdateAttemptDto): Promise<Attempt> {
    const attempt = await this.findOne(id);
    Object.assign(attempt, updateDto);
    return await this.attemptRepository.save(attempt);
  }

  async remove(id: string): Promise<void> {
    const result = await this.attemptRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Attempt with ID ${id} not found`);
    }
  }
}
