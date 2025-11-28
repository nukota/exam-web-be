import { ApiProperty } from '@nestjs/swagger';

export class CodingTestCaseInput {
  @ApiProperty()
  test_case_id: string; // Temp ID for new (format: 'temp_<uuid>'), or real UUID for existing

  @ApiProperty()
  input_data: string;

  @ApiProperty()
  expected_output: string;

  @ApiProperty()
  is_hidden: boolean;
}
