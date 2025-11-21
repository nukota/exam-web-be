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

  async findOne(attemptId: string, questionId: string): Promise<Answer> {
    const answer = await this.answerRepository.findOne({
      where: { attempt_id: attemptId, question_id: questionId },
    });
    if (!answer) {
      throw new NotFoundException(
        `Answer not found for attempt ${attemptId} and question ${questionId}`,
      );
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

  async update(
    attemptId: string,
    questionId: string,
    updateDto: UpdateAnswerDto,
  ): Promise<Answer> {
    const answer = await this.findOne(attemptId, questionId);

    Object.assign(answer, updateDto);

    // Update graded_at if graded_by is being set
    if (updateDto.graded_by && !answer.graded_at) {
      answer.graded_at = new Date();
    }

    return await this.answerRepository.save(answer);
  }

  async remove(attemptId: string, questionId: string): Promise<void> {
    const result = await this.answerRepository.delete({
      attempt_id: attemptId,
      question_id: questionId,
    });
    if (result.affected === 0) {
      throw new NotFoundException(
        `Answer not found for attempt ${attemptId} and question ${questionId}`,
      );
    }
  }
}
