import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ChoiceInputDto {
  @ApiProperty({
    description:
      'Temp ID for new (format: temp_<uuid>) or real UUID for existing',
    example: 'temp_550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  choice_id: string;

  @ApiProperty({
    description: 'Choice text',
    example: 'Mitochondria',
  })
  @IsString()
  choice_text: string;
}
