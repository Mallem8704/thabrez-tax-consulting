import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CaseStatus, ServiceType } from '@thabrez/db';

export class QueryCasesDto {
  @ApiPropertyOptional({ default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Filter by client CUID' })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiPropertyOptional({ enum: CaseStatus, description: 'Filter by status' })
  @IsOptional()
  @IsEnum(CaseStatus)
  status?: CaseStatus;

  @ApiPropertyOptional({ description: 'Filter by assigned staff user CUID' })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional({ enum: ServiceType, description: 'Filter by service type' })
  @IsOptional()
  @IsEnum(ServiceType)
  serviceType?: ServiceType;
}
