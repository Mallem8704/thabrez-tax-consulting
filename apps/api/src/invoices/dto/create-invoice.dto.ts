import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LineItemDto {
  @ApiProperty({ example: 'Annual GST Return Filing (GSTR-9 & 9C)' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 1, default: 1 })
  @IsNumber()
  @IsPositive()
  quantity: number = 1;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @IsPositive()
  unitPrice!: number;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @IsPositive()
  amount!: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ description: 'Client CUID' })
  @IsString()
  @IsNotEmpty()
  clientId!: string;

  @ApiPropertyOptional({ description: 'Optional linked Case CUID' })
  @IsOptional()
  @IsString()
  caseId?: string;

  @ApiProperty({ example: 17700, description: 'Total invoice amount in INR including tax' })
  @IsNumber()
  @IsPositive()
  amount!: number;

  @ApiPropertyOptional({ example: 18, default: 18, description: 'GST rate percentage (e.g. 18)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxPercent?: number = 18;

  @ApiPropertyOptional({ example: '2026-09-15T00:00:00.000Z', description: 'Payment due date' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: 'Professional fees for FY 2024-25 GST audit' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: [LineItemDto], description: 'Itemized fee breakdown' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItemDto)
  lineItems!: LineItemDto[];
}
