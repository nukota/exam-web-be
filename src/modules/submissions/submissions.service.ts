import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Submission } from './entities/submission.entity';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission)
    private readonly submissionRepository: Repository<Submission>,
  ) {}

  async create(createDto: CreateSubmissionDto): Promise<Submission> {
    const submission = this.submissionRepository.create(createDto);
    return await this.submissionRepository.save(submission);
  }

  async findAll(): Promise<Submission[]> {
    return await this.submissionRepository.find();
  }

  async findOne(id: string): Promise<Submission> {
    const submission = await this.submissionRepository.findOne({ 
      where: { submission_id: id } 
    });
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    return submission;
  }

  async findByExamId(examId: string): Promise<Submission[]> {
    return await this.submissionRepository.find({ 
      where: { exam_id: examId } 
    });
  }

  async findByUserId(userId: string): Promise<Submission[]> {
    return await this.submissionRepository.find({ 
      where: { user_id: userId } 
    });
  }

  async update(id: string, updateDto: UpdateSubmissionDto): Promise<Submission> {
    const submission = await this.findOne(id);
    Object.assign(submission, updateDto);
    return await this.submissionRepository.save(submission);
  }

  async remove(id: string): Promise<void> {
    const result = await this.submissionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
  }
}
