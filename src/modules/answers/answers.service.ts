import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answer } from './entities/answer.entity';

@Injectable()
export class AnswersService {
  private answers: Answer[] = [];

  async create(createDto: CreateAnswerDto): Promise<Answer> {
    const newAnswer: Answer = {
      answer_id: this.generateUUID(),
      ...createDto,
      graded_at: createDto.graded_by ? new Date() : undefined,
    };
    this.answers.push(newAnswer);
    return newAnswer;
  }

  async findAll(): Promise<Answer[]> {
    return this.answers;
  }

  async findOne(id: string): Promise<Answer> {
    const answer = this.answers.find(a => a.answer_id === id);
    if (!answer) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }
    return answer;
  }

  async findBySubmissionId(submissionId: string): Promise<Answer[]> {
    return this.answers.filter(a => a.submission_id === submissionId);
  }

  async findByQuestionId(questionId: string): Promise<Answer[]> {
    return this.answers.filter(a => a.question_id === questionId);
  }

  async update(id: string, updateDto: UpdateAnswerDto): Promise<Answer> {
    const answerIndex = this.answers.findIndex(a => a.answer_id === id);
    if (answerIndex === -1) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }
    
    const updatedAnswer = { 
      ...this.answers[answerIndex], 
      ...updateDto,
      graded_at: updateDto.graded_by ? new Date() : this.answers[answerIndex].graded_at,
    };
    
    this.answers[answerIndex] = updatedAnswer;
    return this.answers[answerIndex];
  }

  async remove(id: string): Promise<void> {
    const answerIndex = this.answers.findIndex(a => a.answer_id === id);
    if (answerIndex === -1) {
      throw new NotFoundException(`Answer with ID ${id} not found`);
    }
    this.answers.splice(answerIndex, 1);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
