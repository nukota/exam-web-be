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
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { DetailedExamDto } from './dto/detailed-exam.dto';
import { Exam } from './entities/exam.entity';
import { AllExamsPageDto, AllExamsPageItemDto } from './dto/all-exams-page.dto';
import { GradingPageDto, GradingPageItemDto } from './dto/grading-page.dto';
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

  @Get('grading')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get exams with submission counts for grading',
  })
  @ApiResponse({
    status: 200,
    description: 'List of exams with submission and grading information',
    type: [GradingPageItemDto],
  })
  async getGradingPage(): Promise<GradingPageDto> {
    return this.examsService.getGradingPage();
  }

  @Get('all')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get all exams with question count and status (admin: all exams, student: only exams with attempts)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all exams with metadata',
    type: [AllExamsPageItemDto],
  })
  async getAllExamsPage(
    @CurrentUser('user_id') userId: string,
    @CurrentUser('role') userRole: string,
  ): Promise<AllExamsPageDto> {
    return this.examsService.getAllExamsPage(userId, userRole);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get detailed exam information with all questions, choices, and test cases',
  })
  @ApiParam({
    name: 'id',
    description: 'Exam UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Detailed exam information retrieved successfully',
    type: DetailedExamDto,
  })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  async getDetailedExam(@Param('id') id: string): Promise<DetailedExamDto> {
    return this.examsService.getDetailedExam(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an exam with questions and related data' })
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

  @Patch(':id/release-results')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Release results for an exam' })
  @ApiParam({
    name: 'id',
    description: 'Exam UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Results released successfully',
    type: Exam,
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Only the exam teacher can release results',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Cannot release results',
  })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  async releaseResults(
    @Param('id') id: string,
    @CurrentUser('user_id') userId: string,
  ): Promise<Exam> {
    const exam = await this.examsService.findOne(id);
    if (exam.teacher_id !== userId) {
      throw new ForbiddenException('Only the exam teacher can release results');
    }
    return this.examsService.releaseResults(id);
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
