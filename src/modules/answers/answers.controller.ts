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
import { AnswersService } from './answers.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { Answer } from './entities/answer.entity';

@ApiTags('answers')
@Controller('answers')
export class AnswersController {
  constructor(private readonly answersService: AnswersService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new answer' })
  @ApiResponse({
    status: 201,
    description: 'Answer created successfully',
    type: Answer,
  })
  async create(@Body() createDto: CreateAnswerDto): Promise<Answer> {
    return this.answersService.create(createDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all answers' })
  @ApiQuery({
    name: 'attemptId',
    required: false,
    description: 'Filter by attempt ID',
  })
  @ApiQuery({
    name: 'questionId',
    required: false,
    description: 'Filter by question ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all answers',
    type: [Answer],
  })
  async findAll(
    @Query('attemptId') attemptId?: string,
    @Query('questionId') questionId?: string,
  ): Promise<Answer[]> {
    if (attemptId) {
      return this.answersService.findByAttemptId(attemptId);
    }
    if (questionId) {
      return this.answersService.findByQuestionId(questionId);
    }
    return this.answersService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an answer by ID' })
  @ApiResponse({ status: 200, description: 'Answer found', type: Answer })
  @ApiResponse({ status: 404, description: 'Answer not found' })
  async findOne(@Param('id') id: string): Promise<Answer> {
    return this.answersService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an answer (for grading)' })
  @ApiResponse({
    status: 200,
    description: 'Answer updated successfully',
    type: Answer,
  })
  @ApiResponse({ status: 404, description: 'Answer not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAnswerDto,
  ): Promise<Answer> {
    return this.answersService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an answer' })
  @ApiResponse({ status: 204, description: 'Answer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Answer not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.answersService.remove(id);
  }
}
