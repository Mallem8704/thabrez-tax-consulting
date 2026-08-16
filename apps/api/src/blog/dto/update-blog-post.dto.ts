import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateBlogPostDto {
  @ApiPropertyOptional({ example: 'Updated Title on Budget 2025' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ example: 'updated-title-budget-2025' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ description: 'Markdown body content' })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({ description: 'Publish/unpublish toggle' })
  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
