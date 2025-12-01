import { ChoiceInputDto } from '../../choices/dto/choice-input.dto';
import { CodingTestCaseInputDto } from '../../coding-test-cases/dto/coding-test-case-input.dto';

export interface QuestionInput {
  question_id?: string | null;
  question_text: string;
  title?: string;
  order?: number;
  question_type: string;
  points?: number;
  correct_answer?: string[];
  correct_answer_text?: string[];
  coding_template?: Record<string, string>;
  programming_languages?: string[];
  choices?: ChoiceInputDto[];
  codingTestCases?: CodingTestCaseInputDto[];
}

export class QuestionDTO {
  question_id: string;
  question_text: string;
  title?: string;
  order: number;
  question_type: string;
  points: number;
  correct_answer?: string[];
  correct_answer_text?: string[];
  coding_template?: Record<string, string>;
  programming_languages?: string[];
  choices?: ChoiceInputDto[];
  codingTestCases?: CodingTestCaseInputDto[];
}
