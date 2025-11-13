import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionDto } from './dto/update-submission.dto';
import { Submission } from './entities/submission.entity';

@ApiTags('submissions')
@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new submission' })
  @ApiResponse({ status: 201, description: 'Submission created successfully', type: Submission })
  async create(@Body() createDto: CreateSubmissionDto): Promise<Submission> {
    return this.submissionsService.create(createDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all submissions' })
  @ApiQuery({ name: 'examId', required: false, description: 'Filter by exam ID' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiResponse({ status: 200, description: 'List of all submissions', type: [Submission] })
  async findAll(
    @Query('examId') examId?: string,
    @Query('userId') userId?: string,
  ): Promise<Submission[]> {
    if (examId) {
      return this.submissionsService.findByExamId(examId);
    }
    if (userId) {
      return this.submissionsService.findByUserId(userId);
    }
    return this.submissionsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a submission by ID' })
  @ApiResponse({ status: 200, description: 'Submission found', type: Submission })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  async findOne(@Param('id') id: string): Promise<Submission> {
    return this.submissionsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a submission' })
  @ApiResponse({ status: 200, description: 'Submission updated successfully', type: Submission })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateSubmissionDto): Promise<Submission> {
    return this.submissionsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a submission' })
  @ApiResponse({ status: 204, description: 'Submission deleted successfully' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.submissionsService.remove(id);
  }
}
