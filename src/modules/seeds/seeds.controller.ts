import { Controller, Post, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedsService } from './seeds.service';

@ApiTags('seeds')
@Controller('seeds')
export class SeedsController {
  constructor(private readonly seedsService: SeedsService) {}

  @Post('seed')
  @ApiOperation({ summary: 'Seed database with initial data' })
  @ApiResponse({ status: 201, description: 'Database seeded successfully' })
  async seedDatabase() {
    return this.seedsService.seedDatabase();
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear all data from database' })
  @ApiResponse({ status: 200, description: 'Database cleared successfully' })
  async clearDatabase() {
    return this.seedsService.clearDatabase();
  }

  @Post('reset')
  @ApiOperation({ summary: 'Reset database (clear + seed)' })
  @ApiResponse({ status: 201, description: 'Database reset successfully' })
  async resetDatabase() {
    return this.seedsService.resetDatabase();
  }
}
