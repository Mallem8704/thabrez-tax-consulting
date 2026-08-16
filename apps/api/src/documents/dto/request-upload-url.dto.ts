import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  Matches,
  Max,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export class RequestUploadUrlDto {
  @ApiProperty({ description: 'Case CUID this document is being uploaded to' })
  @IsString()
  @IsNotEmpty()
  caseId!: string;

  @ApiProperty({
    example: 'Form16_AY2024.pdf',
    description: 'Document filename with extension (.pdf, .jpg, .png, .docx, .xlsx only)',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/\.(pdf|jpg|jpeg|png|docx|xlsx)$/i, {
    message: 'Unsupported file type. Only PDF, JPG, PNG, DOCX, and XLSX files are permitted.',
  })
  filename!: string;

  @ApiProperty({
    example: 'application/pdf',
    description: 'MIME content type of the file',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(application\/pdf|image\/jpeg|image\/png|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document|application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet)$/i,
    {
      message:
        'Invalid MIME type. Must be application/pdf, image/jpeg, image/png, or Office OpenXML document/spreadsheet.',
    },
  )
  contentType!: string;

  @ApiProperty({
    example: 1048576,
    description: 'File size in bytes (maximum 20MB = 20,971,520 bytes)',
  })
  @IsInt()
  @IsPositive()
  @Max(MAX_FILE_SIZE_BYTES, {
    message: 'File size exceeds maximum allowed limit of 20MB (20,971,520 bytes)',
  })
  fileSize!: number;
}
