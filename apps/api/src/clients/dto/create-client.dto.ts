import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EntityType } from '@thabrez/db';

export class CreateClientDto {
  @ApiProperty({ example: 'client@example.com', description: 'Primary contact email for portal access' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email!: string;

  @ApiPropertyOptional({ example: '+919876543210', description: 'Contact phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'Initial@123', description: 'Optional initial password for client portal' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ example: 'Mehta & Sons Enterprises', description: 'Company or trade name' })
  @IsOptional()
  @IsString()
  companyName?: string;

  @ApiPropertyOptional({
    example: 'ABCDE1234F',
    description: '10-character Permanent Account Number (PAN)',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, {
    message: 'Invalid PAN format. Must be 5 uppercase letters, 4 digits, 1 uppercase letter (e.g. ABCDE1234F)',
  })
  pan?: string;

  @ApiPropertyOptional({
    example: '27ABCDE1234F1Z5',
    description: '15-character Goods and Services Tax Identification Number (GSTIN)',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, {
    message: 'Invalid GSTIN format. Must be 15 alphanumeric characters (e.g. 27ABCDE1234F1Z5)',
  })
  gstin?: string;

  @ApiPropertyOptional({
    enum: EntityType,
    default: EntityType.INDIVIDUAL,
    description: 'Business entity constitution',
  })
  @IsOptional()
  @IsEnum(EntityType)
  entityType?: EntityType;

  @ApiPropertyOptional({ description: 'CUID of the assigned Chartered Accountant (staff user)' })
  @IsOptional()
  @IsString()
  assignedCaId?: string;
}
