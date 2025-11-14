import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      where: { exam_id: id } 
    });
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
    return exam;
  }

  async findByTeacherId(teacherId: string): Promise<Exam[]> {
    return await this.examRepository.find({ 
      where: { teacher_id: teacherId } 
    });
  }

  async findByAccessCode(accessCode: string): Promise<Exam | null> {
    return await this.examRepository.findOne({ 
      where: { access_code: accessCode } 
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
}
