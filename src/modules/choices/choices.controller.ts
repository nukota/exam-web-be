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
import { ChoicesService } from './choices.service';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';
import { Choice } from './entities/choice.entity';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@ApiTags('choices')
@Controller('choices')
@UseGuards(FirebaseAuthGuard)
export class ChoicesController {
  constructor(private readonly choicesService: ChoicesService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new choice' })
  @ApiResponse({
    status: 201,
    description: 'Choice created successfully',
    type: Choice,
  })
  async create(@Body() createChoiceDto: CreateChoiceDto): Promise<Choice> {
    return this.choicesService.create(createChoiceDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all choices' })
  @ApiQuery({
    name: 'questionId',
    required: false,
    description: 'Filter by question ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all choices',
    type: [Choice],
  })
  async findAll(@Query('questionId') questionId?: string): Promise<Choice[]> {
    if (questionId) {
      return this.choicesService.findByQuestionId(questionId);
    }
    return this.choicesService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a choice by ID' })
  @ApiResponse({ status: 200, description: 'Choice found', type: Choice })
  @ApiResponse({ status: 404, description: 'Choice not found' })
  async findOne(@Param('id') id: string): Promise<Choice> {
    return this.choicesService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a choice' })
  @ApiResponse({
    status: 200,
    description: 'Choice updated successfully',
    type: Choice,
  })
  @ApiResponse({ status: 404, description: 'Choice not found' })
  async update(
    @Param('id') id: string,
    @Body() updateChoiceDto: UpdateChoiceDto,
  ): Promise<Choice> {
    return this.choicesService.update(id, updateChoiceDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a choice' })
  @ApiResponse({ status: 204, description: 'Choice deleted successfully' })
  @ApiResponse({ status: 404, description: 'Choice not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.choicesService.remove(id);
  }
}
