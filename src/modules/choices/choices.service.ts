import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChoiceDto } from './dto/create-choice.dto';
import { UpdateChoiceDto } from './dto/update-choice.dto';
import { Choice } from './entities/choice.entity';

@Injectable()
export class ChoicesService {
  constructor(
    @InjectRepository(Choice)
    private readonly choiceRepository: Repository<Choice>,
  ) {}

  async create(createChoiceDto: CreateChoiceDto): Promise<Choice> {
    const choice = this.choiceRepository.create(createChoiceDto);
    return await this.choiceRepository.save(choice);
  }

  async findAll(): Promise<Choice[]> {
    return await this.choiceRepository.find();
  }

  async findOne(id: string): Promise<Choice> {
    const choice = await this.choiceRepository.findOne({ 
      where: { choice_id: id } 
    });
    if (!choice) {
      throw new NotFoundException(`Choice with ID ${id} not found`);
    }
    return choice;
  }

  async findByQuestionId(questionId: string): Promise<Choice[]> {
    return await this.choiceRepository.find({ 
      where: { question_id: questionId } 
    });
  }

  async update(id: string, updateChoiceDto: UpdateChoiceDto): Promise<Choice> {
    const choice = await this.findOne(id);
    Object.assign(choice, updateChoiceDto);
    return await this.choiceRepository.save(choice);
  }

  async remove(id: string): Promise<void> {
    const result = await this.choiceRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Choice with ID ${id} not found`);
    }
  }
}
