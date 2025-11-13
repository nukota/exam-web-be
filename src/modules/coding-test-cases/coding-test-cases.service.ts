import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCodingTestCaseDto } from './dto/create-coding-test-case.dto';
import { UpdateCodingTestCaseDto } from './dto/update-coding-test-case.dto';
import { CodingTestCase } from './entities/coding-test-case.entity';

@Injectable()
export class CodingTestCasesService {
  private testCases: CodingTestCase[] = [];

  async create(createDto: CreateCodingTestCaseDto): Promise<CodingTestCase> {
    const newTestCase: CodingTestCase = {
      test_case_id: this.generateUUID(),
      is_hidden: createDto.is_hidden || false,
      ...createDto,
    };
    this.testCases.push(newTestCase);
    return newTestCase;
  }

  async findAll(): Promise<CodingTestCase[]> {
    return this.testCases;
  }

  async findOne(id: string): Promise<CodingTestCase> {
    const testCase = this.testCases.find(tc => tc.test_case_id === id);
    if (!testCase) {
      throw new NotFoundException(`Test case with ID ${id} not found`);
    }
    return testCase;
  }

  async findByQuestionId(questionId: string): Promise<CodingTestCase[]> {
    return this.testCases.filter(tc => tc.question_id === questionId);
  }

  async update(id: string, updateDto: UpdateCodingTestCaseDto): Promise<CodingTestCase> {
    const testCaseIndex = this.testCases.findIndex(tc => tc.test_case_id === id);
    if (testCaseIndex === -1) {
      throw new NotFoundException(`Test case with ID ${id} not found`);
    }
    this.testCases[testCaseIndex] = { ...this.testCases[testCaseIndex], ...updateDto };
    return this.testCases[testCaseIndex];
  }

  async remove(id: string): Promise<void> {
    const testCaseIndex = this.testCases.findIndex(tc => tc.test_case_id === id);
    if (testCaseIndex === -1) {
      throw new NotFoundException(`Test case with ID ${id} not found`);
    }
    this.testCases.splice(testCaseIndex, 1);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
