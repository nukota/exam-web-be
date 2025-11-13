import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './entities/exam.entity';

@Injectable()
export class ExamsService {
  // TODO: Replace with actual database connection
  private exams: Exam[] = [];

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const newExam: Exam = {
      exam_id: this.generateUUID(),
      ...createExamDto,
      start_at: createExamDto.start_at ? new Date(createExamDto.start_at) : undefined,
      end_at: createExamDto.end_at ? new Date(createExamDto.end_at) : undefined,
      created_at: new Date(),
    };
    this.exams.push(newExam);
    return newExam;
  }

  async findAll(): Promise<Exam[]> {
    return this.exams;
  }

  async findOne(id: string): Promise<Exam> {
    const exam = this.exams.find(e => e.exam_id === id);
    if (!exam) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
    return exam;
  }

  async findByTeacherId(teacherId: string): Promise<Exam[]> {
    return this.exams.filter(e => e.teacher_id === teacherId);
  }

  async findByAccessCode(accessCode: string): Promise<Exam | null> {
    const exam = this.exams.find(e => e.access_code === accessCode);
    return exam || null;
  }

  async update(id: string, updateExamDto: UpdateExamDto): Promise<Exam> {
    const examIndex = this.exams.findIndex(e => e.exam_id === id);
    if (examIndex === -1) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
    
    this.exams[examIndex] = {
      ...this.exams[examIndex],
      ...updateExamDto,
      start_at: updateExamDto.start_at ? new Date(updateExamDto.start_at) : this.exams[examIndex].start_at,
      end_at: updateExamDto.end_at ? new Date(updateExamDto.end_at) : this.exams[examIndex].end_at,
    };
    
    return this.exams[examIndex];
  }

  async remove(id: string): Promise<void> {
    const examIndex = this.exams.findIndex(e => e.exam_id === id);
    if (examIndex === -1) {
      throw new NotFoundException(`Exam with ID ${id} not found`);
    }
    this.exams.splice(examIndex, 1);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
