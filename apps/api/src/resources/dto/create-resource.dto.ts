import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResourceType } from '@thabrez/db';

export class CreateResourceDto {
  @ApiProperty({ enum: ResourceType, example: ResourceType.ACT })
  @IsEnum(ResourceType)
  @IsNotEmpty()
  type!: ResourceType;

  @ApiProperty({ example: 'The Central Goods and Services Tax (CGST) Act, 2017' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'GST', description: 'Category (e.g. Income Tax, GST, Companies Act, FEMA)' })
  @IsString()
  @IsNotEmpty()
  category!: string;

  @ApiPropertyOptional({ example: 'https://s3.amazonaws.com/bucket/acts/cgst-act-2017.pdf or markdown text', description: 'Markdown content or S3 PDF URL' })
  @IsOptional()
  @IsString()
  bodyOrFileUrl?: string;
}
