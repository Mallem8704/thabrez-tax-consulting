import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceType } from '@thabrez/db';

export class CreateCaseDto {
  @ApiProperty({ description: 'Client CUID' })
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @ApiProperty({ enum: ServiceType, example: ServiceType.GST_FILING })
  @IsEnum(ServiceType)
  @IsNotEmpty()
  serviceType!: ServiceType;

  @ApiPropertyOptional({ description: 'Staff user CUID assigned to work on this case' })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional({ example: '2025-07-31T23:59:59.000Z', description: 'Statutory or agreed filing deadline' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;
}
