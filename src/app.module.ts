import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
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

    // TypeORM configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'examweb'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production', // Auto-sync in development
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // Auth module
    AuthModule,

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
