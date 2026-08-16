import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignCaseDto {
  @ApiProperty({ description: 'Staff user CUID to assign this case to' })
  @IsString()
  @IsNotEmpty()
  assignedToId!: string;
}
