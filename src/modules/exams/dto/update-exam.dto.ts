import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExamDto } from './create-exam.dto';
import { QuestionInputDto } from '../../questions/dto/question-input.dto';

export class UpdateExamDto extends PartialType(CreateExamDto) {
  @ApiProperty({
    description: 'Array of questions to update/create for this exam',
    required: false,
    type: () => [QuestionInputDto],
    example: [
      {
        question_id: null,
        question_text: 'What is the powerhouse of the cell?',
        title: 'Cell Biology Question',
        order: 1,
        question_type: 'single_choice',
        points: 10,
        correct_answer: ['temp_choice_001'],
        choices: [
          { choice_id: 'temp_choice_001', choice_text: 'Mitochondria' },
          { choice_id: 'temp_choice_002', choice_text: 'Nucleus' },
          { choice_id: 'temp_choice_003', choice_text: 'Ribosome' },
          {
            choice_id: 'temp_choice_004',
            choice_text: 'Endoplasmic Reticulum',
          },
        ],
      },
      {
        question_id: null,
        question_text: 'Write a function to reverse a string',
        title: 'String Manipulation',
        order: 2,
        question_type: 'coding',
        points: 20,
        programming_languages: ['python', 'javascript', 'c++'],
        coding_template: {
          python: 'def reverse_string(s):\n    # Your code here\n    pass',
          javascript: 'function reverseString(s) {\n    // Your code here\n}',
          'c++':
            '#include <string>\nusing namespace std;\n\nstring reverseString(string s) {\n    // Your code here\n}',
        },
        codingTestCases: [
          {
            test_case_id: 'temp_test_001',
            input_data: 'hello',
            expected_output: 'olleh',
            is_hidden: false,
          },
          {
            test_case_id: 'temp_test_002',
            input_data: 'world',
            expected_output: 'dlrow',
            is_hidden: true,
          },
        ],
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionInputDto)
  questions?: QuestionInputDto[];
}
