import { ApiProperty } from '@nestjs/swagger';

export class CodingTestCase {
  @ApiProperty({ description: 'Test case unique identifier' })
  test_case_id: string;

  @ApiProperty({ description: 'Question ID this test case belongs to' })
  question_id: string;

  @ApiProperty({ description: 'Input data for test case', required: false })
  input_data?: string;

  @ApiProperty({ description: 'Expected output', required: false })
  expected_output?: string;

  @ApiProperty({ description: 'Whether this is a hidden test case', default: false })
  is_hidden: boolean;
}
