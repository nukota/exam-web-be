/**
 * Common utility functions for the application
 */

/**
 * Generate a random string of specified length
 * @param length - Length of the random string
 * @returns Random string
 */
export function generateRandomString(length: number): string {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Format date to ISO string
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date): string {
  return date.toISOString();
}

/**
 * Check if a value is a valid UUID
 * @param value - Value to check
 * @returns True if valid UUID, false otherwise
 */
export function isValidUUID(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Sanitize string by removing special characters
 * @param value - String to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(value: string): string {
  return value.replace(/[^a-zA-Z0-9\s-_]/g, '');
}

/**
 * Auto-grade an answer based on question type
 * @param question - Question object with type and correct answers
 * @param answerSubmission - User's answer submission
 * @param maxPoints - Maximum points for the question
 * @param judge0Service - Judge0 service for grading coding questions (optional)
 * @returns Score (number) or null if manual grading required
 */
export async function autoGradeAnswer(
  question: any,
  answerSubmission: any,
  maxPoints: number,
  judge0Service?: any,
): Promise<number | null> {
  const questionType = question.question_type;

  // Essay questions require manual grading
  if (questionType === 'essay') {
    return null;
  }

  // Single choice questions
  if (questionType === 'single_choice') {
    if (
      !answerSubmission.selected_choices ||
      answerSubmission.selected_choices.length === 0
    ) {
      return 0;
    }

    const selectedChoice = answerSubmission.selected_choices[0];
    const correctAnswers = question.correct_answer || [];

    // Check if the selected choice is correct and it's the only correct answer
    if (correctAnswers.length === 1 && correctAnswers[0] === selectedChoice) {
      return maxPoints;
    }
    return 0;
  }

  // Multiple choice questions
  if (questionType === 'multiple_choice') {
    if (
      !answerSubmission.selected_choices ||
      answerSubmission.selected_choices.length === 0
    ) {
      return 0;
    }

    const selectedSet = new Set(answerSubmission.selected_choices);
    const correctSet = new Set(question.correct_answer || []);

    // Must select exactly the correct answers (no more, no less)
    if (selectedSet.size !== correctSet.size) {
      return 0;
    }

    for (const selected of selectedSet) {
      if (!correctSet.has(selected)) {
        return 0;
      }
    }

    return maxPoints;
  }

  // Short answer questions
  if (questionType === 'short_answer') {
    if (!answerSubmission.answer_text) {
      return 0;
    }

    const correctAnswers = question.correct_answer_text || [];
    const studentAnswer = answerSubmission.answer_text.toLowerCase().trim();

    // Check if answer matches any of the correct answers
    for (const correctAnswer of correctAnswers) {
      if (correctAnswer.toLowerCase().trim() === studentAnswer) {
        return maxPoints;
      }
    }

    return 0;
  }

  // Coding questions - auto-grade using Judge0 if available
  if (questionType === 'coding') {
    if (!judge0Service || !answerSubmission.answer_text) {
      return null; // Requires manual grading if Judge0 not available or no code submitted
    }

    try {
      // Get code and language from answer submission
      // Frontend sends: { answer_text: "code", programming_language: "cpp" }
      const code = answerSubmission.answer_text;
      const language =
        answerSubmission.programming_language ||
        question.programming_languages?.[0]?.toLowerCase() ||
        'javascript';

      if (!code) {
        return 0;
      }

      // Get test cases from question (check both camelCase and snake_case)
      const testCases = question.coding_test_cases || [];
      console.log('Processing coding question:', question.question_id);
      console.log('Test cases found:', testCases.length);
      console.log('Language:', language);

      if (testCases.length === 0) {
        console.log('No test cases - requires manual grading');
        return null; // No test cases, requires manual grading
      }

      // Format test cases for Judge0
      const formattedTestCases = testCases.map((tc: any) => ({
        input: tc.input_data || '',
        expected_output: tc.expected_output || '',
      }));

      // Execute code with test cases
      const results = await judge0Service.executeCodeWithTestCases(
        code,
        language,
        formattedTestCases,
      );

      // Calculate score based on passed test cases
      const passedCount = results.filter((r: any) => r.passed).length;
      const totalCount = results.length;

      console.log(`Test results: ${passedCount}/${totalCount} passed`);

      if (totalCount === 0) {
        return null;
      }

      // Proportional scoring
      const score = (passedCount / totalCount) * maxPoints;
      console.log(`Calculated score: ${score} out of ${maxPoints}`);
      return Math.round(score * 100) / 100; // Round to 2 decimal places
    } catch (error) {
      console.error('Error grading coding question:', error);
      return null; // Fall back to manual grading on error
    }
  }

  return 0;
}
