import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsEnum, IsDateString, MinLength } from 'class-validator';
import { UserRole } from '../../../common/enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePassword123!',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  full_name?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    example: 'student',
  })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({
    description: 'Date of birth (student only)',
    example: '2000-01-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  dob?: string;

  @ApiProperty({
    description: 'Class name (student only)',
    example: 'Class 10A',
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
