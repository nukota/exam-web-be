import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttemptsService } from './attempts.service';
import { AttemptsController } from './attempts.controller';
import { Attempt } from './entities/attempt.entity';
import { ExamsModule } from '../exams/exams.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attempt]), ExamsModule],
  controllers: [AttemptsController],
  providers: [AttemptsService],
  exports: [AttemptsService],
})
export class AttemptsModule {}
