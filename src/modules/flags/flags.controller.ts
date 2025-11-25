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
import { FlagsService } from './flags.service';
import { CreateFlagDto } from './dto/create-flag.dto';
import { UpdateFlagDto } from './dto/update-flag.dto';
import { Flag } from './entities/flag.entity';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@ApiTags('flags')
@Controller('flags')
@UseGuards(FirebaseAuthGuard)
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new flag' })
  @ApiResponse({
    status: 201,
    description: 'Flag created successfully',
    type: Flag,
  })
  async create(@Body() createDto: CreateFlagDto): Promise<Flag> {
    return this.flagsService.create(createDto);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all flags' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Filter by user ID',
  })
  @ApiQuery({
    name: 'questionId',
    required: false,
    description: 'Filter by question ID',
  })
  @ApiResponse({ status: 200, description: 'List of all flags', type: [Flag] })
  async findAll(
    @Query('userId') userId?: string,
    @Query('questionId') questionId?: string,
  ): Promise<Flag[]> {
    if (userId) {
      return this.flagsService.findByUserId(userId);
    }
    if (questionId) {
      return this.flagsService.findByQuestionId(questionId);
    }
    return this.flagsService.findAll();
  }

  @Get(':userId/:questionId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a flag by user ID and question ID' })
  @ApiResponse({ status: 200, description: 'Flag found', type: Flag })
  @ApiResponse({ status: 404, description: 'Flag not found' })
  async findOne(
    @Param('userId') userId: string,
    @Param('questionId') questionId: string,
  ): Promise<Flag> {
    return this.flagsService.findOne(userId, questionId);
  }

  @Patch(':userId/:questionId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a flag' })
  @ApiResponse({
    status: 200,
    description: 'Flag updated successfully',
    type: Flag,
  })
  @ApiResponse({ status: 404, description: 'Flag not found' })
  async update(
    @Param('userId') userId: string,
    @Param('questionId') questionId: string,
    @Body() updateDto: UpdateFlagDto,
  ): Promise<Flag> {
    return this.flagsService.update(userId, questionId, updateDto);
  }

  @Delete(':userId/:questionId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a flag' })
  @ApiResponse({ status: 204, description: 'Flag deleted successfully' })
  @ApiResponse({ status: 404, description: 'Flag not found' })
  async remove(
    @Param('userId') userId: string,
    @Param('questionId') questionId: string,
  ): Promise<void> {
    return this.flagsService.remove(userId, questionId);
  }
}
