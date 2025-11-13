import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Submission } from './entities/submission.entity';

@Injectable()
export class SubmissionsService {
  private submissions: Submission[] = [];

  async create(createDto: CreateSubmissionDto): Promise<Submission> {
    const newSubmission: Submission = {
      submission_id: this.generateUUID(),
      submitted_at: new Date(),
      total_score: createDto.total_score || 0,
      cheated: createDto.cheated || false,
      status: createDto.status || 'submitted',
      ...createDto,
    };
    this.submissions.push(newSubmission);
    return newSubmission;
  }

  async findAll(): Promise<Submission[]> {
    return this.submissions;
  }

  async findOne(id: string): Promise<Submission> {
    const submission = this.submissions.find(s => s.submission_id === id);
    if (!submission) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    return submission;
  }

  async findByExamId(examId: string): Promise<Submission[]> {
    return this.submissions.filter(s => s.exam_id === examId);
  }

  async findByUserId(userId: string): Promise<Submission[]> {
    return this.submissions.filter(s => s.user_id === userId);
  }

  async update(id: string, updateDto: UpdateSubmissionDto): Promise<Submission> {
    const submissionIndex = this.submissions.findIndex(s => s.submission_id === id);
    if (submissionIndex === -1) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    this.submissions[submissionIndex] = { ...this.submissions[submissionIndex], ...updateDto };
    return this.submissions[submissionIndex];
  }

  async remove(id: string): Promise<void> {
    const submissionIndex = this.submissions.findIndex(s => s.submission_id === id);
    if (submissionIndex === -1) {
      throw new NotFoundException(`Submission with ID ${id} not found`);
    }
    this.submissions.splice(submissionIndex, 1);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
