import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodingTestCasesService } from './coding-test-cases.service';
import { CodingTestCase } from './entities/coding-test-case.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CodingTestCase])],
  providers: [CodingTestCasesService],
  exports: [CodingTestCasesService],
})
export class CodingTestCasesModule {}
