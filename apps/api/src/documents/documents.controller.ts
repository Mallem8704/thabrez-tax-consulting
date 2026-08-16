import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UserRole } from '@thabrez/db';

import { DocumentsService } from './documents.service';
import { RequestUploadUrlDto } from './dto/request-upload-url.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@ApiTags('documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload-url')
  @ApiOperation({
    summary: 'Request a pre-signed S3/R2 upload URL (Direct upload, 20MB max, PDF/JPG/PNG/DOCX/XLSX)',
  })
  @ApiResponse({
    status: 201,
    description: 'Pre-signed S3 upload URL generated with 15-minute expiration',
  })
  requestUploadUrl(
    @Body() dto: RequestUploadUrlDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.documentsService.requestUploadUrl(dto, user);
  }

  @Post('confirm')
  @ApiOperation({
    summary: 'Confirm completed direct upload (Runs virus scan and creates versioned Document record)',
  })
  @ApiResponse({ status: 201, description: 'Document record stored and version assigned' })
  confirmUpload(
    @Body() dto: ConfirmUploadDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.documentsService.confirmUpload(dto, user);
  }

  @Get(':id/download-url')
  @ApiOperation({
    summary: 'Generate pre-signed S3 download URL (Strictly scoped to client case ownership)',
  })
  @ApiParam({ name: 'id', description: 'Document CUID' })
  getDownloadUrl(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.documentsService.getDownloadUrl(id, user);
  }

  @Get('case/:caseId')
  @ApiOperation({ summary: 'List all documents and versions for a case' })
  @ApiParam({ name: 'caseId', description: 'Case CUID' })
  findByCaseId(
    @Param('caseId') caseId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.documentsService.findByCaseId(caseId, user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA, UserRole.ASSOCIATE)
  @ApiOperation({ summary: 'Delete a document' })
  @ApiParam({ name: 'id', description: 'Document CUID' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.documentsService.remove(id, user);
  }
}
