import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { QuestionInput, QuestionDTO } from './types/question.interface';
import { ChoicesService } from '../choices/choices.service';
import { CodingTestCasesService } from '../coding-test-cases/coding-test-cases.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
    private readonly choicesService: ChoicesService,
    private readonly codingTestCasesService: CodingTestCasesService,
  ) {}

  async findByExamId(examId: string): Promise<Question[]> {
    return await this.questionRepository.find({
      where: { exam_id: examId },
      order: { order: 'ASC' },
    });
  }

  async getDetailedQuestionsForExam(examId: string): Promise<QuestionDTO[]> {
    const questions = await this.findByExamId(examId);

    // Build detailed questions with choices and test cases
    const detailedQuestions: QuestionDTO[] = await Promise.all(
      questions.map(async (question) => {
        const questionDto: QuestionDTO = {
          question_id: question.question_id,
          question_text: question.question_text,
          title: question.title,
          order: question.order,
          question_type: question.question_type,
          points: question.points,
          correct_answer: question.correct_answer,
          correct_answer_text: question.correct_answer_text,
          coding_template: question.coding_template,
          programming_languages: question.programming_languages,
        };

        // Get choices if question has them
        const choices = await this.choicesService.findByQuestionId(
          question.question_id,
        );
        if (choices.length > 0) {
          questionDto.choices = choices.map((choice) => ({
            choice_id: choice.choice_id,
            choice_text: choice.choice_text || '',
          }));
        }

        // Get coding test cases if question has them
        const testCases = await this.codingTestCasesService.findByQuestionId(
          question.question_id,
        );
        if (testCases.length > 0) {
          questionDto.codingTestCases = testCases.map((tc) => ({
            test_case_id: tc.test_case_id,
            input_data: tc.input_data || '',
            expected_output: tc.expected_output || '',
            is_hidden: tc.is_hidden,
          }));
        }

        return questionDto;
      }),
    );

    return detailedQuestions;
  }

  async updateQuestionsForExam(
    examId: string,
    questions: QuestionInput[],
  ): Promise<Question[]> {
    // Get all existing questions for this exam
    const existingQuestions = await this.findByExamId(examId);

    // Extract question IDs from the input (filter out null/undefined)
    const inputQuestionIds = questions
      .map((q) => q.question_id)
      .filter((id): id is string => id != null && id !== '');

    // Find questions to delete (existing questions not in the input list)
    const questionsToDelete = existingQuestions.filter(
      (q) => !inputQuestionIds.includes(q.question_id),
    );

    // Delete questions that are not in the input
    if (questionsToDelete.length > 0) {
      await this.questionRepository.delete(
        questionsToDelete.map((q) => q.question_id),
      );
    }

    // Process each question (update or create)
    const savedQuestions: Question[] = [];

    for (let i = 0; i < questions.length; i++) {
      const questionData = questions[i];
      const orderValue = questionData.order ?? i;

      // Extract choices and coding test cases from question data
      const { choices, codingTestCases, ...questionFields } = questionData;

      let savedQuestion: Question;

      if (questionData.question_id) {
        // Update existing question
        const existingQuestion = existingQuestions.find(
          (q) => q.question_id === questionData.question_id,
        );

        if (existingQuestion) {
          // Don't update correct_answer yet (will be updated after processing choices)
          const { correct_answer, ...fieldsWithoutCorrectAnswer } =
            questionFields;

          Object.assign(existingQuestion, {
            ...fieldsWithoutCorrectAnswer,
            order: orderValue,
            exam_id: examId,
          });
          savedQuestion = (await this.questionRepository.save(
            existingQuestion,
          )) as unknown as Question;

          // Process choices and coding test cases for existing question
          await this.processChoicesAndTestCases(
            savedQuestion.question_id,
            choices,
            codingTestCases,
            correct_answer,
          );

          // Reload question to get updated correct_answer
          savedQuestion = (await this.questionRepository.findOne({
            where: { question_id: savedQuestion.question_id },
          })) as Question;
        } else {
          continue;
        }
      } else {
        // Create new question
        const { question_id, correct_answer, ...questionDataWithoutId } =
          questionFields;
        const newQuestion = this.questionRepository.create({
          ...questionDataWithoutId,
          exam_id: examId,
          order: orderValue,
        } as any);
        savedQuestion = (await this.questionRepository.save(
          newQuestion,
        )) as unknown as Question;

        // Process choices and coding test cases for new question
        await this.processChoicesAndTestCases(
          savedQuestion.question_id,
          choices,
          codingTestCases,
          correct_answer,
        );

        // Reload question to get updated correct_answer
        savedQuestion = (await this.questionRepository.findOne({
          where: { question_id: savedQuestion.question_id },
        })) as Question;
      }

      savedQuestions.push(savedQuestion);
    }

    return savedQuestions;
  }

  private async processChoicesAndTestCases(
    questionId: string,
    choices?: any[],
    codingTestCases?: any[],
    correctAnswerIds?: string[],
  ): Promise<void> {
    const tempIdMap = new Map<string, string>(); // temp_id -> real_id

    // Process choices if provided
    if (choices !== undefined) {
      const choiceIdMap = await this.choicesService.updateChoicesForQuestion(
        questionId,
        choices,
      );
      // Merge choice temp ID mappings
      choiceIdMap.forEach((realId, tempId) => tempIdMap.set(tempId, realId));
    }

    // Process coding test cases if provided
    if (codingTestCases !== undefined) {
      const testCaseIdMap =
        await this.codingTestCasesService.updateTestCasesForQuestion(
          questionId,
          codingTestCases,
        );
      // Merge test case temp ID mappings
      testCaseIdMap.forEach((realId, tempId) => tempIdMap.set(tempId, realId));
    }

    // Map temp IDs to real IDs in correct_answer
    if (correctAnswerIds && correctAnswerIds.length > 0) {
      const mappedCorrectAnswers = correctAnswerIds.map(
        (id) => tempIdMap.get(id) || id, // Use mapped ID if temp, otherwise keep original
      );

      // Update question with mapped correct_answer IDs
      await this.questionRepository.update(questionId, {
        correct_answer: mappedCorrectAnswers,
      });
    }
  }
}
