import { ApiProperty } from '@nestjs/swagger';
import { MyResultsPageItemDto } from './exam-result-page.dto';

export class MyResultsPageDto {
  @ApiProperty({
    description: 'List of student attempt results',
    type: [MyResultsPageItemDto],
  })
  results: MyResultsPageItemDto[];
}
