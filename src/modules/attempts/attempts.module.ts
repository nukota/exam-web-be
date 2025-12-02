import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttemptsController } from './attempts.controller';
import { Attempt } from './entities/attempt.entity';
import { Answer } from '../answers/entities/answer.entity';
import { ExamsModule } from '../exams/exams.module';
import { StudentAttemptsService } from './services/student-attempts.service';
import { AdminAttemptsService } from './services/admin-attempts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attempt, Answer]), ExamsModule],
  controllers: [AttemptsController],
  providers: [StudentAttemptsService, AdminAttemptsService],
  exports: [StudentAttemptsService, AdminAttemptsService],
})
export class AttemptsModule {}
