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
 * @returns Score (number) or null if manual grading required
 */
export function autoGradeAnswer(
  question: any,
  answerSubmission: any,
  maxPoints: number,
): number | null {
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

  // Coding questions require manual grading or external judge system
  if (questionType === 'coding') {
    return null;
  }

  return 0;
}
