import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ExamsModule } from './modules/exams/exams.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { ChoicesModule } from './modules/choices/choices.module';
import { CodingTestCasesModule } from './modules/coding-test-cases/coding-test-cases.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { AnswersModule } from './modules/answers/answers.module';
import { FlagsModule } from './modules/flags/flags.module';

@Module({
  imports: [
    // Configuration module - load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Feature modules
    UsersModule,
    ExamsModule,
    QuestionsModule,
    ChoicesModule,
    CodingTestCasesModule,
    SubmissionsModule,
    AnswersModule,
    FlagsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
