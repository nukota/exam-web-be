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
} from '@nestjs/swagger';
import { AttemptsService } from './attempts.service';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { UpdateAttemptDto } from './dto/update-attempt.dto';
import { Attempt } from './entities/attempt.entity';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@ApiTags('attempts')
@Controller('attempts')
@UseGuards(FirebaseAuthGuard)
export class AttemptsController {
  constructor(private readonly attemptsService: AttemptsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new exam attempt' })
  @ApiResponse({
    status: 201,
    description: 'Attempt created successfully',
    type: Attempt,
  })
  async create(@Body() createDto: CreateAttemptDto): Promise<Attempt> {
    return this.attemptsService.create(createDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all exam attempts' })
  @ApiQuery({
    name: 'examId',
    required: false,
    description: 'Filter by exam ID',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all attempts',
    type: [Attempt],
  })
  async findAll(
    @Query('examId') examId?: string,
    @Query('userId') userId?: string,
  ): Promise<Attempt[]> {
    if (examId) {
      return this.attemptsService.findByExamId(examId);
    }
    if (userId) {
      return this.attemptsService.findByUserId(userId);
    }
    return this.attemptsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get an attempt by ID' })
  @ApiResponse({ status: 200, description: 'Attempt found', type: Attempt })
  @ApiResponse({ status: 404, description: 'Attempt not found' })
  async findOne(@Param('id') id: string): Promise<Attempt> {
    return this.attemptsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an attempt' })
  @ApiResponse({
    status: 200,
    description: 'Attempt updated successfully',
    type: Attempt,
  })
  @ApiResponse({ status: 404, description: 'Attempt not found' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAttemptDto,
  ): Promise<Attempt> {
    return this.attemptsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an attempt' })
  @ApiResponse({ status: 204, description: 'Attempt deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attempt not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.attemptsService.remove(id);
  }
}
