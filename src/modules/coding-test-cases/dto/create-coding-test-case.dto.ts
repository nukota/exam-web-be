import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreateCodingTestCaseDto {
  @ApiProperty({ description: 'Question ID this test case belongs to' })
  @IsUUID()
  question_id: string;

  @ApiProperty({ description: 'Input data for test case', required: false })
  @IsString()
  @IsOptional()
  input_data?: string;

  @ApiProperty({ description: 'Expected output', required: false })
  @IsString()
  @IsOptional()
  expected_output?: string;

  @ApiProperty({ description: 'Whether this is a hidden test case', default: false })
  @IsBoolean()
  @IsOptional()
  is_hidden?: boolean;
}
