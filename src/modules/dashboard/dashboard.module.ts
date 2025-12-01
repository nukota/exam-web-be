import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Exam } from '../exams/entities/exam.entity';
import { User } from '../users/entities/user.entity';
import { Attempt } from '../attempts/entities/attempt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, User, Attempt])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
