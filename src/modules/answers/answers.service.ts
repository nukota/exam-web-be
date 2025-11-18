import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async create(createDto: CreateAnswerDto): Promise<Answer> {
    const answer = this.answerRepository.create({
      ...createDto,
      graded_at: createDto.graded_by ? new Date() : undefined,
    });
    return await this.answerRepository.save(answer);
  }

  async findAll(): Promise<Answer[]> {
    return await this.answerRepository.find();
  }

  async findOne(id: string): Promise<Answer> {
    const answer = await this.answerRepository.findOne({
      where: { answer_id: id },
    });
    if (!answer) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }
    return answer;
  }

  async findByAttemptId(attemptId: string): Promise<Answer[]> {
    return await this.answerRepository.find({
      where: { attempt_id: attemptId },
    });
  }

  async findByQuestionId(questionId: string): Promise<Answer[]> {
    return await this.answerRepository.find({
      where: { question_id: questionId },
    });
  }

  async update(id: string, updateDto: UpdateAnswerDto): Promise<Answer> {
    const answer = await this.findOne(id);

    Object.assign(answer, updateDto);

    // Update graded_at if graded_by is being set
    if (updateDto.graded_by && !answer.graded_at) {
      answer.graded_at = new Date();
    }

    return await this.answerRepository.save(answer);
  }

  async remove(id: string): Promise<void> {
    const result = await this.answerRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }
  }
}
