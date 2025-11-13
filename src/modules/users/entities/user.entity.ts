import { ApiProperty } from '@nestjs/swagger';

export class User {
  @ApiProperty({
    description: 'User unique identifier',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  user_id: string;

  @ApiProperty({
    description: 'Username',
    example: 'johndoe',
  })
  username: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false,
  })
  full_name?: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'User role',
    enum: ['student', 'teacher', 'admin'],
    example: 'student',
  })
  role: string;

  @ApiProperty({
    description: 'Date of birth (student only)',
    example: '2000-01-01',
    required: false,
  })
  dob?: string;

  @ApiProperty({
    description: 'Class name (student only)',
    example: 'Class 10A',
    required: false,
  })
  class_name?: string;

  @ApiProperty({
    description: 'School name',
    example: 'Springfield High School',
    required: false,
  })
  school_name?: string;

  @ApiProperty({
    description: 'Account creation timestamp',
    example: '2024-01-01T00:00:00Z',
  })
  created_at: Date;
}
