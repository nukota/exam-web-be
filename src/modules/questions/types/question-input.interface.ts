import { ChoiceInput } from '../../choices/types/choice-input.interface';
import { CodingTestCaseInput } from '../../coding-test-cases/types/coding-test-case-input.interface';

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
  choices?: ChoiceInput[];
  codingTestCases?: CodingTestCaseInput[];
}
