import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedsController } from './seeds.controller';
import { SeedsService } from './seeds.service';
import { User } from '../users/entities/user.entity';
import { Exam } from '../exams/entities/exam.entity';
import { Question } from '../questions/entities/question.entity';
import { Attempt } from '../attempts/entities/attempt.entity';
import { Answer } from '../answers/entities/answer.entity';
import { Choice } from '../choices/entities/choice.entity';
import { CodingTestCase } from '../coding-test-cases/entities/coding-test-case.entity';
import { Flag } from '../flags/entities/flag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Exam,
      Question,
      Attempt,
      Answer,
      Choice,
      CodingTestCase,
      Flag,
    ]),
  ],
  controllers: [SeedsController],
  providers: [SeedsService],
})
export class SeedsModule {}
