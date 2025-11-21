import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './entities/exam.entity';
import { AllExamsPageDto, AllExamsPageItemDto } from './dto/all-exams-page.dto';

@ApiTags('exams')
@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new exam' })
  @ApiResponse({
    status: 201,
    description: 'Exam created successfully',
    type: Exam,
  })
  async create(@Body() createExamDto: CreateExamDto): Promise<Exam> {
    return this.examsService.create(createExamDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all exams' })
  @ApiQuery({
    name: 'teacherId',
    required: false,
    description: 'Filter by teacher ID',
  })
  @ApiResponse({ status: 200, description: 'List of all exams', type: [Exam] })
  async findAll(@Query('teacherId') teacherId?: string): Promise<Exam[]> {
    if (teacherId) {
      return this.examsService.findByTeacherId(teacherId);
    }
    return this.examsService.findAll();
  }

  @Get('all-exams')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all exams with question count and status' })
  @ApiResponse({
    status: 200,
    description: 'List of all exams with metadata',
    type: [AllExamsPageItemDto],
  })
  async getAllExamsPage(): Promise<AllExamsPageDto> {
    return this.examsService.getAllExamsPage();
  }

  @Get('access-code/:code')
  @ApiOperation({ summary: 'Get exam by access code' })
  @ApiResponse({ status: 200, description: 'Exam found', type: Exam })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  async findByAccessCode(@Param('code') code: string): Promise<Exam> {
    const exam = await this.examsService.findByAccessCode(code);
    if (!exam) {
      throw new NotFoundException(`Exam with access code ${code} not found`);
    }
    return exam;
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an exam by ID' })
  @ApiResponse({ status: 200, description: 'Exam found', type: Exam })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  async findOne(@Param('id') id: string): Promise<Exam> {
    return this.examsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an exam' })
  @ApiResponse({
    status: 200,
    description: 'Exam updated successfully',
    type: Exam,
  })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  async update(
    @Param('id') id: string,
    @Body() updateExamDto: UpdateExamDto,
  ): Promise<Exam> {
    return this.examsService.update(id, updateExamDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an exam' })
  @ApiResponse({ status: 204, description: 'Exam deleted successfully' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.examsService.remove(id);
  }
}

import { NotFoundException } from '@nestjs/common';
