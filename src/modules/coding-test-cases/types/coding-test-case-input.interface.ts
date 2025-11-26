export interface CodingTestCaseInput {
  test_case_id: string; // Temp ID for new (format: 'temp_<uuid>'), or real UUID for existing
  input_data: string;
  expected_output: string;
  is_hidden: boolean;
}
