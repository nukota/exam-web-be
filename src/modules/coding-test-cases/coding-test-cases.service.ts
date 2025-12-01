import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CodingTestCaseInputDto } from './dto/coding-test-case-input.dto';
import { CodingTestCase } from './entities/coding-test-case.entity';

@Injectable()
export class CodingTestCasesService {
  constructor(
    @InjectRepository(CodingTestCase)
    private readonly testCaseRepository: Repository<CodingTestCase>,
  ) {}

  async create(
    createDto: Omit<CodingTestCaseInputDto, 'test_case_id'> & {
      question_id: string;
    },
  ): Promise<CodingTestCase> {
    const testCase = this.testCaseRepository.create(createDto);
    return await this.testCaseRepository.save(testCase);
  }

  async findOne(id: string): Promise<CodingTestCase> {
    const testCase = await this.testCaseRepository.findOne({
      where: { test_case_id: id },
    });
    if (!testCase) {
      throw new NotFoundException(`Test case with ID ${id} not found`);
    }
    return testCase;
  }

  async findByQuestionId(questionId: string): Promise<CodingTestCase[]> {
    return await this.testCaseRepository.find({
      where: { question_id: questionId },
    });
  }

  async update(
    id: string,
    updateData: Partial<
      Omit<CodingTestCaseInputDto, 'test_case_id'> & { question_id: string }
    >,
  ): Promise<CodingTestCase> {
    const testCase = await this.findOne(id);
    Object.assign(testCase, updateData);
    return await this.testCaseRepository.save(testCase);
  }

  async remove(id: string): Promise<void> {
    const result = await this.testCaseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Test case with ID ${id} not found`);
    }
  }

  /**
   * Update test cases for a question with temp ID mapping support
   * @param questionId - The question ID to update test cases for
   * @param testCasesInput - Array of test case data (can include temp IDs)
   * @returns Map of temp_id -> real_id for newly created test cases
   */
  async updateTestCasesForQuestion(
    questionId: string,
    testCasesInput: CodingTestCaseInputDto[],
  ): Promise<Map<string, string>> {
    const tempIdMap = new Map<string, string>();

    if (!testCasesInput || testCasesInput.length === 0) {
      // Delete all existing test cases if none provided
      const existingTestCases = await this.findByQuestionId(questionId);
      for (const testCase of existingTestCases) {
        await this.remove(testCase.test_case_id);
      }
      return tempIdMap;
    }

    // Get existing test cases for this question
    const existingTestCases = await this.findByQuestionId(questionId);

    // Extract test case IDs from input (excluding temp IDs)
    const inputTestCaseIds = testCasesInput
      .map((tc) => tc.test_case_id)
      .filter((id) => !id.startsWith('temp_'));

    // Delete test cases not in the input
    const testCasesToDelete = existingTestCases.filter(
      (tc) => !inputTestCaseIds.includes(tc.test_case_id),
    );

    for (const testCase of testCasesToDelete) {
      await this.remove(testCase.test_case_id);
    }

    // Process each test case (create or update)
    for (const testCaseData of testCasesInput) {
      if (testCaseData.test_case_id.startsWith('temp_')) {
        // Create new test case
        const newTestCase = await this.create({
          question_id: questionId,
          input_data: testCaseData.input_data,
          expected_output: testCaseData.expected_output,
          is_hidden: testCaseData.is_hidden,
        });
        tempIdMap.set(testCaseData.test_case_id, newTestCase.test_case_id);
      } else {
        // Update existing test case
        await this.update(testCaseData.test_case_id, {
          input_data: testCaseData.input_data,
          expected_output: testCaseData.expected_output,
          is_hidden: testCaseData.is_hidden,
        });
      }
    }

    return tempIdMap;
  }
}
