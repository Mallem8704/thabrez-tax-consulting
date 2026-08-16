import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBlogPostDto {
  @ApiProperty({ example: 'Key Changes in Budget 2025 for MSMEs and Startups' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({ example: 'key-changes-budget-2025-msmes' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ example: '# Overview\n\nThe Union Budget introduced key tax exemptions...', description: 'Markdown body content' })
  @IsString()
  @IsNotEmpty()
  body!: string;

  @ApiPropertyOptional({ default: false, description: 'Publish immediately or save as draft' })
  @IsOptional()
  @IsBoolean()
  published?: boolean = false;
}
