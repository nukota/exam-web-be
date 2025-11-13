import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';
import { Choice } from './entities/choice.entity';

@Injectable()
export class ChoicesService {
  private choices: Choice[] = [];

  async create(createChoiceDto: CreateChoiceDto): Promise<Choice> {
    const newChoice: Choice = {
      choice_id: this.generateUUID(),
      is_correct: createChoiceDto.is_correct || false,
      ...createChoiceDto,
    };
    this.choices.push(newChoice);
    return newChoice;
  }

  async findAll(): Promise<Choice[]> {
    return this.choices;
  }

  async findOne(id: string): Promise<Choice> {
    const choice = this.choices.find(c => c.choice_id === id);
    if (!choice) {
      throw new NotFoundException(`Choice with ID ${id} not found`);
    }
    return choice;
  }

  async findByQuestionId(questionId: string): Promise<Choice[]> {
    return this.choices.filter(c => c.question_id === questionId);
  }

  async update(id: string, updateChoiceDto: UpdateChoiceDto): Promise<Choice> {
    const choiceIndex = this.choices.findIndex(c => c.choice_id === id);
    if (choiceIndex === -1) {
      throw new NotFoundException(`Choice with ID ${id} not found`);
    }
    this.choices[choiceIndex] = { ...this.choices[choiceIndex], ...updateChoiceDto };
    return this.choices[choiceIndex];
  }

  async remove(id: string): Promise<void> {
    const choiceIndex = this.choices.findIndex(c => c.choice_id === id);
    if (choiceIndex === -1) {
      throw new NotFoundException(`Choice with ID ${id} not found`);
    }
    this.choices.splice(choiceIndex, 1);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
