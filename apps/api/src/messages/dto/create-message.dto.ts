import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({ description: 'Case CUID to scope this message to' })
  @IsString()
  @IsNotEmpty()
  caseId!: string;

  @ApiProperty({ example: 'I have uploaded the bank statement for Q3. Please review.', maxLength: 5000 })
  @IsString()
  @IsNotEmpty({ message: 'Message body cannot be empty' })
  @MaxLength(5000, { message: 'Message exceeds maximum length of 5000 characters' })
  body!: string;
}
