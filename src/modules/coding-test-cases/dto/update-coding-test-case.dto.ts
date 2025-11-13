import { PartialType } from '@nestjs/swagger';
import { CreateCodingTestCaseDto } from './create-coding-test-case.dto';

export class UpdateCodingTestCaseDto extends PartialType(CreateCodingTestCaseDto) {}
