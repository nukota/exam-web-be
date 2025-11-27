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
import { AttemptsService } from './attempts.service';
import { Attempt } from './entities/attempt.entity';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';
import { CurrentUser } from '../auth/decorators/user.decorator';

@ApiTags('attempts')
@Controller('attempts')
@UseGuards(FirebaseAuthGuard)
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

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
    return this.attemptsService.joinExam(accessCode, userId);
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
    return this.attemptsService.leaveExam(examId, userId);
  }
}
