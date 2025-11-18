import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFlagDto } from './dto/create-flag.dto';
import { UpdateFlagDto } from './dto/update-flag.dto';
import { Flag } from './entities/flag.entity';

@Injectable()
export class FlagsService {
  constructor(
    @InjectRepository(Flag)
    private readonly flagRepository: Repository<Flag>,
  ) {}

  async create(createDto: CreateFlagDto): Promise<Flag> {
    const flag = this.flagRepository.create(createDto);
    return await this.flagRepository.save(flag);
  }

  async findAll(): Promise<Flag[]> {
    return await this.flagRepository.find();
  }

  async findOne(id: string): Promise<Flag> {
    const flag = await this.flagRepository.findOne({
      where: { flag_id: id },
    });
    if (!flag) {
      throw new NotFoundException(`Flag with ID ${id} not found`);
    }
    return flag;
  }

  async findByUserId(userId: string): Promise<Flag[]> {
    return await this.flagRepository.find({
      where: { user_id: userId },
    });
  }

  async findByAttemptId(attemptId: string): Promise<Flag[]> {
    return await this.flagRepository.find({
      where: { attempt_id: attemptId },
    });
  }

  async findByQuestionId(questionId: string): Promise<Flag[]> {
    return await this.flagRepository.find({
      where: { question_id: questionId },
    });
  }

  async update(id: string, updateDto: UpdateFlagDto): Promise<Flag> {
    const flag = await this.findOne(id);
    Object.assign(flag, updateDto);
    return await this.flagRepository.save(flag);
  }

  async remove(id: string): Promise<void> {
    const result = await this.flagRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Flag with ID ${id} not found`);
    }
  }
}
