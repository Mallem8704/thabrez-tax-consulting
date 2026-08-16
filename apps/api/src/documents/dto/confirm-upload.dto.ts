import { IsInt, IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmUploadDto {
  @ApiProperty({ description: 'Case CUID this document belongs to' })
  @IsString()
  @IsNotEmpty()
  caseId!: string;

  @ApiProperty({
    example: 'clients/cl_123/cases/cs_456/uuid-form16.pdf',
    description: 'S3 storage object key where file was uploaded',
  })
  @IsString()
  @IsNotEmpty()
  s3Key!: string;

  @ApiProperty({ example: 'Form16_AY2024.pdf', description: 'Original filename' })
  @IsString()
  @IsNotEmpty()
  filename!: string;

  @ApiProperty({ example: 1048576, description: 'File size in bytes' })
  @IsInt()
  @IsPositive()
  fileSize!: number;
}
