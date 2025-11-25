import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flag } from './entities/flag.entity';

@Injectable()
export class FlagsService {
  constructor(
    @InjectRepository(Flag)
    private readonly flagRepository: Repository<Flag>,
  ) {}

  async createBulk(userId: string, questionIds: string[]): Promise<Flag[]> {
    const flags = questionIds.map((question_id) => ({
      user_id: userId,
      question_id: question_id,
    }));

    const flagEntities = this.flagRepository.create(flags);
    return await this.flagRepository.save(flagEntities);
  }

  async findByUserAndExamId(userId: string, examId: string): Promise<Flag[]> {
    return await this.flagRepository.find({
      where: {
        user_id: userId,
        question: { exam_id: examId },
      },
      relations: ['question'],
    });
  }
}
