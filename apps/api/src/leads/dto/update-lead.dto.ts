import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { LeadStatus } from '@thabrez/db';

export class UpdateLeadDto {
  @ApiPropertyOptional({ enum: LeadStatus, example: LeadStatus.CONTACTED })
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @ApiPropertyOptional({ example: 'Spoke with client on phone. Meeting scheduled for Friday.' })
  @IsOptional()
  @IsString()
  notes?: string;
}
