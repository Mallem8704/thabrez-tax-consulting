import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateLeadDto {
  @ApiProperty({ example: 'Vikram Malhotra', description: 'Full name of prospective client' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name!: string;

  @ApiProperty({ example: '+919876543210', description: 'Contact phone number' })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  @MinLength(8, { message: 'Phone number must be at least 8 digits' })
  phone!: string;

  @ApiPropertyOptional({ example: 'vikram@malhotralogistics.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiPropertyOptional({ example: 'GST_FILING', description: 'Service or advisory topic interested in' })
  @IsOptional()
  @IsString()
  serviceInterest?: string;

  @ApiPropertyOptional({ example: 'We are expanding to Maharashtra and need guidance on GST registration & ROC filings.' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ example: 'website_contact_form', default: 'contact_form' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiPropertyOptional({ description: 'Cloudflare Turnstile token from the marketing site' })
  @IsOptional()
  @IsString()
  turnstileToken?: string;
}
