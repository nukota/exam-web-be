import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChoiceInput } from './types/choice-input.interface';
import { Choice } from './entities/choice.entity';

@Injectable()
export class ChoicesService {
  constructor(
    @InjectRepository(Choice)
    private readonly choiceRepository: Repository<Choice>,
  ) {}

  async create(
    createChoiceDto: Omit<ChoiceInput, 'choice_id'> & { question_id: string },
  ): Promise<Choice> {
    const choice = this.choiceRepository.create(createChoiceDto);
    return await this.choiceRepository.save(choice);
  }

  async findOne(id: string): Promise<Choice> {
    const choice = await this.choiceRepository.findOne({
      where: { choice_id: id },
    });
    if (!choice) {
      throw new NotFoundException(`Choice with ID ${id} not found`);
    }
    return choice;
  }

  async findByQuestionId(questionId: string): Promise<Choice[]> {
    return await this.choiceRepository.find({
      where: { question_id: questionId },
    });
  }

  async update(
    id: string,
    updateData: Partial<
      Omit<ChoiceInput, 'choice_id'> & { question_id: string }
    >,
  ): Promise<Choice> {
    const choice = await this.findOne(id);
    Object.assign(choice, updateData);
    return await this.choiceRepository.save(choice);
  }

  async remove(id: string): Promise<void> {
    const result = await this.choiceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Choice with ID ${id} not found`);
    }
  }

  /**
   * Update choices for a question with temp ID mapping support
   * @param questionId - The question ID to update choices for
   * @param choicesInput - Array of choice data (can include temp IDs)
   * @returns Map of temp_id -> real_id for newly created choices
   */
  async updateChoicesForQuestion(
    questionId: string,
    choicesInput: ChoiceInput[],
  ): Promise<Map<string, string>> {
    const tempIdMap = new Map<string, string>();

    if (!choicesInput || choicesInput.length === 0) {
      // Delete all existing choices if none provided
      const existingChoices = await this.findByQuestionId(questionId);
      for (const choice of existingChoices) {
        await this.remove(choice.choice_id);
      }
      return tempIdMap;
    }

    // Get existing choices for this question
    const existingChoices = await this.findByQuestionId(questionId);

    // Extract choice IDs from input (excluding temp IDs)
    const inputChoiceIds = choicesInput
      .map((c) => c.choice_id)
      .filter((id) => !id.startsWith('temp_'));

    // Delete choices not in the input
    const choicesToDelete = existingChoices.filter(
      (c) => !inputChoiceIds.includes(c.choice_id),
    );

    for (const choice of choicesToDelete) {
      await this.remove(choice.choice_id);
    }

    // Process each choice (create or update)
    for (const choiceData of choicesInput) {
      if (choiceData.choice_id.startsWith('temp_')) {
        // Create new choice
        const newChoice = await this.create({
          question_id: questionId,
          choice_text: choiceData.choice_text,
        });
        tempIdMap.set(choiceData.choice_id, newChoice.choice_id);
      } else {
        // Update existing choice
        await this.update(choiceData.choice_id, {
          choice_text: choiceData.choice_text,
        });
      }
    }

    return tempIdMap;
  }
}
