import { ApiProperty } from '@nestjs/swagger';

export class ChoiceInput {
  @ApiProperty()
  choice_id: string; // Temp ID for new (format: 'temp_<uuid>'), or real UUID for existing

  @ApiProperty()
  choice_text: string;
}
