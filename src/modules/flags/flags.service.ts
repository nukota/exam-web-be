import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFlagDto } from './dto/create-flag.dto';
import { UpdateFlagDto } from './dto/update-flag.dto';
import { Flag } from './entities/flag.entity';

@Injectable()
export class FlagsService {
  private flags: Flag[] = [];

  async create(createDto: CreateFlagDto): Promise<Flag> {
    const newFlag: Flag = {
      flag_id: this.generateUUID(),
      ...createDto,
      flagged_at: new Date(),
    };
    this.flags.push(newFlag);
    return newFlag;
  }

  async findAll(): Promise<Flag[]> {
    return this.flags;
  }

  async findOne(id: string): Promise<Flag> {
    const flag = this.flags.find(f => f.flag_id === id);
    if (!flag) {
      throw new NotFoundException(`Flag with ID ${id} not found`);
    }
    return flag;
  }

  async findByUserId(userId: string): Promise<Flag[]> {
    return this.flags.filter(f => f.user_id === userId);
  }

  async findBySubmissionId(submissionId: string): Promise<Flag[]> {
    return this.flags.filter(f => f.submission_id === submissionId);
  }

  async findByQuestionId(questionId: string): Promise<Flag[]> {
    return this.flags.filter(f => f.question_id === questionId);
  }

  async update(id: string, updateDto: UpdateFlagDto): Promise<Flag> {
    const flagIndex = this.flags.findIndex(f => f.flag_id === id);
    if (flagIndex === -1) {
      throw new NotFoundException(`Flag with ID ${id} not found`);
    }
    this.flags[flagIndex] = { ...this.flags[flagIndex], ...updateDto };
    return this.flags[flagIndex];
  }

  async remove(id: string): Promise<void> {
    const flagIndex = this.flags.findIndex(f => f.flag_id === id);
    if (flagIndex === -1) {
      throw new NotFoundException(`Flag with ID ${id} not found`);
    }
    this.flags.splice(flagIndex, 1);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
