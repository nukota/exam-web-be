import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { Attempt } from './entities/attempt.entity';
import { ExamAttemptsPageDto } from './dto/exam-attempts-page.dto';
import { SubmissionReviewPageDto } from './dto/submission-review-page.dto';
import { GradeEssayDto } from './dto/grade-essay.dto';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { ExamResultPageDto } from './dto/exam-result-page.dto';
import { MyResultsPageDto } from './dto/my-results-page.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { StudentAttemptsService } from './services/student-attempts.service';
import { AdminAttemptsService } from './services/admin-attempts.service';

@ApiTags('attempts')
@Controller('attempts')
@UseGuards(FirebaseAuthGuard)
export class AttemptsController {
  constructor(
    private readonly studentAttemptsService: StudentAttemptsService,
    private readonly adminAttemptsService: AdminAttemptsService,
  ) {}

  @Post('join/:accessCode')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Join an exam (create initial attempt for student)',
  })
  @ApiParam({
    name: 'accessCode',
    description: 'Exam access code to join',
    example: 'EXAM2025ABC',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully joined the exam',
    type: Attempt,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Already joined this exam',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Exam with access code not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing Firebase token',
  })
  async joinExam(
    @Param('accessCode') accessCode: string,
    @CurrentUser('user_id') userId: string,
  ): Promise<Attempt> {
    return this.studentAttemptsService.joinExam(accessCode, userId);
  }

  @Delete('leave/:examId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Leave an exam (delete attempt for student)' })
  @ApiParam({
    name: 'examId',
    description: 'Exam UUID to leave',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Successfully left the exam',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Cannot leave exam after submission',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - You have not joined this exam',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing Firebase token',
  })
  async leaveExam(
    @Param('examId') examId: string,
    @CurrentUser('user_id') userId: string,
  ): Promise<void> {
    return this.studentAttemptsService.leaveExam(examId, userId);
  }

  @Get('exam/:examId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all attempts for a specific exam with student information',
  })
  @ApiParam({
    name: 'examId',
    description: 'Exam UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Exam attempts retrieved successfully',
    type: ExamAttemptsPageDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Exam not found',
  })
  async getExamAttempts(
    @Param('examId') examId: string,
  ): Promise<ExamAttemptsPageDto> {
    return this.adminAttemptsService.getExamAttempts(examId);
  }

  @Get('review/:attemptId')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Get detailed submission review with questions, answers, and correctness',
  })
  @ApiParam({
    name: 'attemptId',
    description: 'Attempt UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Submission review retrieved successfully',
    type: SubmissionReviewPageDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Attempt not found',
  })
  async getSubmissionReview(
    @Param('attemptId') attemptId: string,
  ): Promise<SubmissionReviewPageDto> {
    return this.adminAttemptsService.getSubmissionReview(attemptId);
  }

  @Post('submit/:examId')
  @ApiBearerAuth()
  @ApiOperation({
    summary:
      'Submit exam answers with automatic grading for non-essay questions',
  })
  @ApiParam({
    name: 'examId',
    description: 'Exam UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Exam submitted and auto-graded successfully',
    type: Attempt,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Already submitted or invalid data',
  })
  @ApiResponse({ status: 404, description: 'Attempt not found' })
  async submitExam(
    @Param('examId') examId: string,
    @CurrentUser('user_id') userId: string,
    @Body() submitExamDto: SubmitExamDto,
  ): Promise<Attempt> {
    return this.studentAttemptsService.submitExam(
      examId,
      userId,
      submitExamDto,
    );
  }

  @Post('grade/:attemptId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Grade essay questions in an attempt' })
  @ApiParam({
    name: 'attemptId',
    description: 'Attempt UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Essay questions graded successfully',
    type: Attempt,
  })
  @ApiResponse({ status: 404, description: 'Attempt not found' })
  async gradeEssay(
    @Param('attemptId') attemptId: string,
    @Body() gradeEssayDto: GradeEssayDto,
  ): Promise<Attempt> {
    return this.adminAttemptsService.gradeEssay(attemptId, gradeEssayDto);
  }

  @Get('leaderboard/:examId')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get exam results with leaderboard for the current student',
  })
  @ApiParam({
    name: 'examId',
    description: 'Exam UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Exam results and leaderboard retrieved successfully',
    type: ExamResultPageDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Exam not found or student has not joined this exam',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing Firebase token',
  })
  async getExamLeaderboard(
    @Param('examId') examId: string,
    @CurrentUser('user_id') userId: string,
  ): Promise<ExamResultPageDto> {
    return this.studentAttemptsService.getExamLeaderboard(examId, userId);
  }

  @Get('result')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all attempt results for the current student',
  })
  @ApiResponse({
    status: 200,
    description: 'Student attempt results retrieved successfully',
    type: MyResultsPageDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing Firebase token',
  })
  async getMyResults(
    @CurrentUser('user_id') userId: string,
  ): Promise<MyResultsPageDto> {
    return this.studentAttemptsService.getMyResults(userId);
  }
}
