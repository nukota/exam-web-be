import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Judge0 Language IDs
const JUDGE0_LANGUAGE_IDS: Record<string, number> = {
  javascript: 63, // Node.js
  python: 71, // Python 3
  cpp: 54, // C++ (GCC 9.2.0)
  java: 62, // Java (OpenJDK 13.0.1)
};

export interface CodeExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  compilationError?: string;
  runtimeError?: string;
}

@Injectable()
export class Judge0Service {
  private readonly logger = new Logger(Judge0Service.name);
  private readonly rapidApiKey: string;
  private readonly judge0BaseUrl =
    'https://judge0-ce.p.rapidapi.com/submissions';

  constructor(private readonly configService: ConfigService) {
    this.rapidApiKey = this.configService.get<string>('RAPIDAPI_KEY') || '';
    if (!this.rapidApiKey) {
      this.logger.warn(
        'RAPIDAPI_KEY not configured. Judge0 service will not work properly.',
      );
    }
  }

  /**
   * Execute code using Judge0 API
   * @param code - Source code to execute
   * @param lang - Programming language (javascript, python, cpp, java)
   * @param input - Standard input for the program
   * @returns Execution result
   */
  async executeCode(
    code: string,
    lang: string,
    input: string,
  ): Promise<CodeExecutionResult> {
    try {
      const languageId = JUDGE0_LANGUAGE_IDS[lang.toLowerCase()];
      if (!languageId) {
        return {
          success: false,
          error: `Language ${lang} is not supported. Supported languages: ${Object.keys(JUDGE0_LANGUAGE_IDS).join(', ')}`,
        };
      }

      if (!this.rapidApiKey) {
        return {
          success: false,
          error: 'Judge0 API key is not configured',
        };
      }

      // Create submission
      const response = await fetch(
        `${this.judge0BaseUrl}?base64_encoded=false&wait=true`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': this.rapidApiKey,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          },
          body: JSON.stringify({
            language_id: languageId,
            source_code: code,
            stdin: input,
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(
          `Judge0 API error (${response.status}): ${errorText}`,
        );
        return {
          success: false,
          error: `Failed to submit code (HTTP ${response.status})`,
        };
      }

      const result = await response.json();

      // Log the full response for debugging
      console.log('Judge0 API Response:', JSON.stringify(result, null, 2));

      // Check for compilation errors
      if (result.compile_output) {
        return {
          success: false,
          compilationError: result.compile_output,
        };
      }

      // Check for runtime errors
      if (result.stderr) {
        return {
          success: false,
          runtimeError: result.stderr,
        };
      }

      // Successful execution
      return {
        success: true,
        output: result.stdout || 'Code executed successfully (no output)',
      };
    } catch (error: any) {
      this.logger.error(
        `Judge0 execution error: ${error.message}`,
        error.stack,
      );
      return {
        success: false,
        error: `Execution error: ${error.message}`,
      };
    }
  }

  /**
   * Execute code against multiple test cases
   * @param code - Source code to execute
   * @param lang - Programming language
   * @param testCases - Array of test cases with input and expected output
   * @returns Array of test results
   */
  async executeCodeWithTestCases(
    code: string,
    lang: string,
    testCases: Array<{ input: string; expected_output: string }>,
  ): Promise<
    Array<{
      passed: boolean;
      input: string;
      expectedOutput: string;
      actualOutput?: string;
      error?: string;
    }>
  > {
    const results: Array<{
      passed: boolean;
      input: string;
      expectedOutput: string;
      actualOutput?: string;
      error?: string;
    }> = [];

    for (const testCase of testCases) {
      const executionResult = await this.executeCode(
        code,
        lang,
        testCase.input,
      );

      console.log(
        `Test case execution result for input "${testCase.input}":`,
        executionResult,
      );

      if (!executionResult.success) {
        results.push({
          passed: false,
          input: testCase.input,
          expectedOutput: testCase.expected_output,
          error:
            executionResult.error ||
            executionResult.compilationError ||
            executionResult.runtimeError,
        });
      } else {
        const actualOutput = (executionResult.output || '').trim();
        const expectedOutput = testCase.expected_output.trim();
        const passed = actualOutput === expectedOutput;

        results.push({
          passed,
          input: testCase.input,
          expectedOutput: testCase.expected_output,
          actualOutput: executionResult.output,
        });
      }
    }

    console.log('All test case results:', results);
    return results;
  }

  /**
   * Get supported programming languages
   * @returns Array of supported language names
   */
  getSupportedLanguages(): string[] {
    return Object.keys(JUDGE0_LANGUAGE_IDS);
  }
}
