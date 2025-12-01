import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardDto } from './dto/dashboard.dto';
import { FirebaseAuthGuard } from '../auth/firebase-auth.guard';

@ApiTags('dashboard')
@Controller('dashboard')
@UseGuards(FirebaseAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get dashboard statistics and chart data',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard data retrieved successfully',
    type: DashboardDto,
  })
  async getDashboard(): Promise<DashboardDto> {
    return this.dashboardService.getDashboardData();
  }
}
