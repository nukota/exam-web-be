import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  private questions: Question[] = [];

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const newQuestion: Question = {
      question_id: this.generateUUID(),
      points: createQuestionDto.points || 1,
      ...createQuestionDto,
    };
    this.questions.push(newQuestion);
    return newQuestion;
  }

  async findAll(): Promise<Question[]> {
    return this.questions;
  }

  async findOne(id: string): Promise<Question> {
    const question = this.questions.find(q => q.question_id === id);
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async findByExamId(examId: string): Promise<Question[]> {
    return this.questions.filter(q => q.exam_id === examId);
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const questionIndex = this.questions.findIndex(q => q.question_id === id);
    if (questionIndex === -1) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    this.questions[questionIndex] = { ...this.questions[questionIndex], ...updateQuestionDto };
    return this.questions[questionIndex];
  }

  async remove(id: string): Promise<void> {
    const questionIndex = this.questions.findIndex(q => q.question_id === id);
    if (questionIndex === -1) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    this.questions.splice(questionIndex, 1);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
