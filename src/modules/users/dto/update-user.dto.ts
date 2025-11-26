import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Date of birth in ISO 8601 format (student only)',
    example: '2000-01-15',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dob?: string;

  @ApiProperty({
    description: 'Class name (student only)',
    example: '10A - Science Stream',
    required: false,
  })
  @IsString()
  @IsOptional()
  class_name?: string;

  @ApiProperty({
    description: 'School name',
    example: 'Springfield High School',
    required: false,
  })
  @IsString()
  @IsOptional()
  school_name?: string;
}
