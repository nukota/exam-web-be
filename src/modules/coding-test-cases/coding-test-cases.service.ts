import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCodingTestCaseDto } from './dto/create-coding-test-case.dto';
import { UpdateCodingTestCaseDto } from './dto/update-coding-test-case.dto';
import { CodingTestCase } from './entities/coding-test-case.entity';

@Injectable()
export class CodingTestCasesService {
  constructor(
    @InjectRepository(CodingTestCase)
    private readonly testCaseRepository: Repository<CodingTestCase>,
  ) {}

  async create(createDto: CreateCodingTestCaseDto): Promise<CodingTestCase> {
    const testCase = this.testCaseRepository.create(createDto);
    return await this.testCaseRepository.save(testCase);
  }

  async findAll(): Promise<CodingTestCase[]> {
    return await this.testCaseRepository.find();
  }

  async findOne(id: string): Promise<CodingTestCase> {
    const testCase = await this.testCaseRepository.findOne({ 
      where: { test_case_id: id } 
    });
    if (!testCase) {
      throw new NotFoundException(`Test case with ID ${id} not found`);
    }
    return testCase;
  }

  async findByQuestionId(questionId: string): Promise<CodingTestCase[]> {
    return await this.testCaseRepository.find({ 
      where: { question_id: questionId } 
    });
  }

  async update(id: string, updateDto: UpdateCodingTestCaseDto): Promise<CodingTestCase> {
    const testCase = await this.findOne(id);
    Object.assign(testCase, updateDto);
    return await this.testCaseRepository.save(testCase);
  }

  async remove(id: string): Promise<void> {
    const result = await this.testCaseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Test case with ID ${id} not found`);
    }
  }
}
