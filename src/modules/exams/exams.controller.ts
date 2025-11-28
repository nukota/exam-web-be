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
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { Exam } from './entities/exam.entity';
import { AllExamsPageDto, AllExamsPageItemDto } from './dto/all-exams-page.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('exams')
@Controller('exams')
@UseGuards(FirebaseAuthGuard)
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
  async create(
    @Body() createExamDto: CreateExamDto,
    @CurrentUser('user_id') teacherId: string,
  ): Promise<Exam> {
    return this.examsService.create(createExamDto, teacherId);
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

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an exam by ID' })
  @ApiParam({
    name: 'id',
    description: 'Exam UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 200, description: 'Exam found', type: Exam })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  async findOne(@Param('id') id: string): Promise<Exam> {
    return this.examsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an exam' })
  @ApiParam({
    name: 'id',
    description: 'Exam UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
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
  @ApiParam({
    name: 'id',
    description: 'Exam UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 204, description: 'Exam deleted successfully' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.examsService.remove(id);
  }
}

import { NotFoundException } from '@nestjs/common';
