# Exam Update API - Questions with Choices & Coding Test Cases

## Overview

The exam update API now supports comprehensive question management including choices and coding test cases. It uses a **temp ID mapping** pattern to allow the frontend to create relationships between entities before they exist in the database.

## API Endpoint

```
PATCH /exams/:id
```

## Request Body Example

```json
{
  "title": "Updated Exam Title",
  "duration": 90,
  "questions": [
    {
      "question_id": null, // null = create new question
      "question_text": "What is 2+2?",
      "title": "Basic Math",
      "question_type": "multiple_choice",
      "points": 10,
      "order": 0,
      "correct_answer": ["temp_abc123"], // Reference temp choice ID
      "choices": [
        {
          "choice_id": "temp_abc123", // Temp ID for new choice
          "choice_text": "4"
        },
        {
          "choice_id": "temp_abc124",
          "choice_text": "5"
        }
      ]
    },
    {
      "question_id": "existing-uuid-here", // UUID = update existing
      "question_text": "Write a function to add two numbers",
      "question_type": "coding",
      "points": 20,
      "programming_languages": ["python", "javascript"],
      "coding_template": {
        "python": "def add(a, b):\n    # Your code here\n    pass"
      },
      "codingTestCases": [
        {
          "test_case_id": "temp_test1", // Temp ID for new test case
          "input_data": "2, 3",
          "expected_output": "5",
          "is_hidden": false
        },
        {
          "test_case_id": "existing-test-uuid", // Update existing test case
          "input_data": "10, 20",
          "expected_output": "30",
          "is_hidden": true
        }
      ],
      "choices": [
        {
          "choice_id": "existing-choice-uuid", // Keep and update existing choice
          "choice_text": "Updated choice text"
        }
        // Any existing choices not mentioned here will be deleted
      ]
    }
  ]
}
```

## How It Works

### 1. Temp ID Pattern

- **Format**: `temp_<uuid>` (e.g., `temp_abc123`, `temp_550e8400-e29b-41d4-a716-446655440000`)
- **Purpose**: Allows frontend to reference newly created entities before they exist in the database
- **Detection**: Any ID starting with `temp_` is treated as a temporary ID

### 2. Processing Flow

#### Questions

1. **Delete** any existing questions not mentioned in the request
2. For each question in the request:
   - If `question_id` is null → **Create** new question
   - If `question_id` exists → **Update** existing question

#### Choices (per question)

1. Fetch existing choices for the question
2. **Delete** choices not mentioned in the request
3. For each choice in the request:
   - If `choice_id` starts with `temp_` → **Create** new choice and map temp ID to real ID
   - If `choice_id` is a real UUID → **Update** existing choice

#### Coding Test Cases (per question)

1. Fetch existing test cases for the question
2. **Delete** test cases not mentioned in the request
3. For each test case in the request:
   - If `test_case_id` starts with `temp_` → **Create** new test case
   - If `test_case_id` is a real UUID → **Update** existing test case

#### Correct Answer Mapping

1. Build a map of `temp_id → real_id` from newly created choices
2. Map any temp IDs in `correct_answer` array to their real IDs
3. Update the question with mapped `correct_answer` array

### 3. Example Scenario

**Frontend creates a new question with choices:**

```javascript
const questionData = {
  question_id: null,
  question_text: 'What is the capital of France?',
  question_type: 'multiple_choice',
  correct_answer: ['temp_choice1'], // Reference temp ID
  choices: [
    { choice_id: 'temp_choice1', choice_text: 'Paris' },
    { choice_id: 'temp_choice2', choice_text: 'London' },
    { choice_id: 'temp_choice3', choice_text: 'Berlin' },
  ],
};
```

**Backend processing:**

1. Creates question with `question_id = "abc-123-def"`
2. Creates choices and maps:
   - `temp_choice1` → `"real-uuid-1"`
   - `temp_choice2` → `"real-uuid-2"`
   - `temp_choice3` → `"real-uuid-3"`
3. Updates `correct_answer` from `["temp_choice1"]` to `["real-uuid-1"]`
4. Saves question with real UUIDs

**Result:**

```json
{
  "question_id": "abc-123-def",
  "question_text": "What is the capital of France?",
  "correct_answer": ["real-uuid-1"], // Mapped to real ID
  "choices": [
    { "choice_id": "real-uuid-1", "choice_text": "Paris" },
    { "choice_id": "real-uuid-2", "choice_text": "London" },
    { "choice_id": "real-uuid-3", "choice_text": "Berlin" }
  ]
}
```

## Key Features

### ✅ Single API Call

Update exam metadata, questions, choices, and test cases in one request

### ✅ Temp ID Support

Create relationships between entities before they exist in the database

### ✅ Automatic Cleanup

Any questions/choices/test cases not mentioned in the request are automatically deleted

### ✅ Flexible Updates

- Create new questions by setting `question_id` to null
- Update existing questions by providing their UUID
- Mix create and update operations in the same request

### ✅ Correct Answer Mapping

Automatically maps temp choice IDs to real UUIDs in the `correct_answer` array

## Implementation Details

### Service Methods

**QuestionsService.updateQuestionsForExam()**

- Main orchestration method
- Handles question creation/update/deletion
- Calls `processChoicesAndTestCases()` for each question

**QuestionsService.processChoicesAndTestCases()**

- Private helper method
- Processes choices and test cases
- Builds temp ID mapping
- Updates `correct_answer` with real IDs

### Dependencies

- `QuestionsModule` imports `ChoicesModule` and `CodingTestCasesModule`
- `QuestionsService` injects `ChoicesService` and `CodingTestCasesService`

## Error Handling

- Invalid UUIDs will throw `NotFoundException`
- Missing required fields will return 400 Bad Request
- Cascade deletions ensure referential integrity
