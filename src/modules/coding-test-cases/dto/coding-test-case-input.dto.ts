import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export class CodingTestCaseInputDto {
  @ApiProperty({
    description:
      'Temp ID for new (format: temp_<uuid>) or real UUID for existing',
    example: 'temp_550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  test_case_id: string;

  @ApiProperty({
    description: 'Input data for test case',
    example: 'hello',
  })
  @IsString()
  input_data: string;

  @ApiProperty({
    description: 'Expected output',
    example: 'olleh',
  })
  @IsString()
  expected_output: string;

  @ApiProperty({
    description: 'Whether this is a hidden test case',
    example: false,
  })
  @IsBoolean()
  is_hidden: boolean;
}
