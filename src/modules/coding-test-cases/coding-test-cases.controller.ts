import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CodingTestCasesService } from './coding-test-cases.service';
import { CreateCodingTestCaseDto } from './dto/create-coding-test-case.dto';
import { UpdateCodingTestCaseDto } from './dto/update-coding-test-case.dto';
import { CodingTestCase } from './entities/coding-test-case.entity';

@ApiTags('coding-test-cases')
@Controller('coding-test-cases')
export class CodingTestCasesController {
  constructor(private readonly codingTestCasesService: CodingTestCasesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new test case' })
  @ApiResponse({ status: 201, description: 'Test case created successfully', type: CodingTestCase })
  async create(@Body() createDto: CreateCodingTestCaseDto): Promise<CodingTestCase> {
    return this.codingTestCasesService.create(createDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all test cases' })
  @ApiQuery({ name: 'questionId', required: false, description: 'Filter by question ID' })
  @ApiResponse({ status: 200, description: 'List of all test cases', type: [CodingTestCase] })
  async findAll(@Query('questionId') questionId?: string): Promise<CodingTestCase[]> {
    if (questionId) {
      return this.codingTestCasesService.findByQuestionId(questionId);
    }
    return this.codingTestCasesService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a test case by ID' })
  @ApiResponse({ status: 200, description: 'Test case found', type: CodingTestCase })
  @ApiResponse({ status: 404, description: 'Test case not found' })
  async findOne(@Param('id') id: string): Promise<CodingTestCase> {
    return this.codingTestCasesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a test case' })
  @ApiResponse({ status: 200, description: 'Test case updated successfully', type: CodingTestCase })
  @ApiResponse({ status: 404, description: 'Test case not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateCodingTestCaseDto): Promise<CodingTestCase> {
    return this.codingTestCasesService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a test case' })
  @ApiResponse({ status: 204, description: 'Test case deleted successfully' })
  @ApiResponse({ status: 404, description: 'Test case not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.codingTestCasesService.remove(id);
  }
}
