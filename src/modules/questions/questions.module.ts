import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { ChoicesModule } from '../choices/choices.module';
import { CodingTestCasesModule } from '../coding-test-cases/coding-test-cases.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question]),
    ChoicesModule,
    CodingTestCasesModule,
  ],
  controllers: [],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
