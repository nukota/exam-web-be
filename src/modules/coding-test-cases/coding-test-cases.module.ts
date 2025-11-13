import { Module } from '@nestjs/common';
import { CodingTestCasesService } from './coding-test-cases.service';
import { CodingTestCasesController } from './coding-test-cases.controller';

@Module({
  controllers: [CodingTestCasesController],
  providers: [CodingTestCasesService],
  exports: [CodingTestCasesService],
})
export class CodingTestCasesModule {}
