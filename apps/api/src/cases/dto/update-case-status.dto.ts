import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CaseStatus } from '@thabrez/db';

export class UpdateCaseStatusDto {
  @ApiProperty({ enum: CaseStatus, example: CaseStatus.IN_REVIEW })
  @IsEnum(CaseStatus)
  @IsNotEmpty()
  status!: CaseStatus;
}
