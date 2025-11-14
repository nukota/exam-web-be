import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const question = this.questionRepository.create(createQuestionDto);
    return await this.questionRepository.save(question);
  }

  async findAll(): Promise<Question[]> {
    return await this.questionRepository.find();
  }

  async findOne(id: string): Promise<Question> {
    const question = await this.questionRepository.findOne({ 
      where: { question_id: id } 
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async findByExamId(examId: string): Promise<Question[]> {
    return await this.questionRepository.find({ 
      where: { exam_id: examId } 
    });
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto): Promise<Question> {
    const question = await this.findOne(id);
    Object.assign(question, updateQuestionDto);
    return await this.questionRepository.save(question);
  }

  async remove(id: string): Promise<void> {
    const result = await this.questionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
  }
}
