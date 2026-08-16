import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { StorageService } from './storage.service';
import { VirusScannerService } from './virus-scanner.service';
import { UserRole } from '@thabrez/db';

import { RequestUploadUrlDto } from './dto/request-upload-url.dto';
import { ConfirmUploadDto } from './dto/confirm-upload.dto';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly storageService: StorageService,
    private readonly virusScanner: VirusScannerService,
  ) {}

  /**
   * Generates a pre-signed S3 upload URL for direct-to-storage client upload.
   */
  async requestUploadUrl(dto: RequestUploadUrlDto, currentUser: AuthenticatedUser) {
    const c = await this.prisma.case.findUnique({
      where: { id: dto.caseId },
      include: { client: true },
    });

    if (!c) {
      throw new NotFoundException(`Case ${dto.caseId} not found`);
    }

    // Role-based scoping
    this.assertCaseAccess(c, currentUser, 'upload documents to');

    // Generate sanitized structured S3 key
    const sanitizedFilename = dto.filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const s3Key = `clients/${c.clientId}/cases/${dto.caseId}/${Date.now()}_${sanitizedFilename}`;

    const uploadUrl = await this.storageService.generateUploadUrl(
      s3Key,
      dto.contentType,
      900, // 15 minutes
    );

    return {
      uploadUrl,
      s3Key,
      expiresInSeconds: 900,
    };
  }

  /**
   * Confirms a completed direct S3 upload and records the Document row in the database.
   * Enforces automatic versioning: duplicate filenames in the same case increment the version number.
   */
  async confirmUpload(dto: ConfirmUploadDto, currentUser: AuthenticatedUser) {
    const c = await this.prisma.case.findUnique({
      where: { id: dto.caseId },
      include: { client: true },
    });

    if (!c) {
      throw new NotFoundException(`Case ${dto.caseId} not found`);
    }

    this.assertCaseAccess(c, currentUser, 'confirm document uploads for');

    // Pluggable Virus Scan Hook
    const isClean = await this.virusScanner.scanFile(dto.s3Key);
    if (!isClean) {
      throw new BadRequestException(
        'Document failed security anti-malware verification. Upload rejected.',
      );
    }

    // Automatic Document Versioning Logic
    const existingVersions = await this.prisma.document.findMany({
      where: {
        caseId: dto.caseId,
        filename: dto.filename,
      },
      orderBy: { version: 'desc' },
      take: 1,
    });

    const nextVersion = existingVersions.length > 0 ? (existingVersions[0]?.version ?? 0) + 1 : 1;

    const document = await this.prisma.document.create({
      data: {
        caseId: dto.caseId,
        uploadedById: currentUser.id,
        s3Key: dto.s3Key,
        filename: dto.filename,
        fileSize: dto.fileSize,
        version: nextVersion,
      },
      include: {
        uploadedBy: { select: { id: true, email: true, role: true } },
      },
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'DOCUMENT_UPLOADED',
      entity: 'Document',
      entityId: document.id,
      metadata: {
        caseId: dto.caseId,
        filename: dto.filename,
        version: nextVersion,
        fileSize: dto.fileSize,
      },
    });

    return document;
  }

  /**
   * Generates a pre-signed S3 download URL.
   * Scoped strictly: CLIENT can only download documents for their own cases.
   */
  async getDownloadUrl(id: string, currentUser: AuthenticatedUser) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: {
        case: {
          include: {
            client: true,
          },
        },
      },
    });

    if (!doc) {
      throw new NotFoundException(`Document ${id} not found`);
    }

    // Strict Authorization & Data Isolation Check
    if (currentUser.role === UserRole.CLIENT) {
      const isClientOwner =
        doc.case.clientId === currentUser.clientProfileId ||
        doc.case.client.userId === currentUser.id;

      if (!isClientOwner) {
        throw new ForbiddenException(
          'Access denied: You can only download documents belonging to your own cases.',
        );
      }
    } else if (currentUser.role === UserRole.ASSOCIATE) {
      const isAssignee = doc.case.assignedToId === currentUser.id;
      const isClientCa = doc.case.client.assignedCaId === currentUser.id;

      if (!isAssignee && !isClientCa) {
        throw new ForbiddenException(
          'Access denied: Associates can only download documents for assigned cases.',
        );
      }
    }

    const downloadUrl = await this.storageService.generateDownloadUrl(
      doc.s3Key,
      doc.filename,
      900,
    );

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'DOCUMENT_DOWNLOADED',
      entity: 'Document',
      entityId: doc.id,
      metadata: {
        caseId: doc.caseId,
        filename: doc.filename,
        version: doc.version,
      },
    });

    return {
      downloadUrl,
      filename: doc.filename,
      version: doc.version,
      expiresInSeconds: 900,
    };
  }

  /**
   * List all documents belonging to a specific case.
   */
  async findByCaseId(caseId: string, currentUser: AuthenticatedUser) {
    const c = await this.prisma.case.findUnique({
      where: { id: caseId },
      include: { client: true },
    });

    if (!c) {
      throw new NotFoundException(`Case ${caseId} not found`);
    }

    this.assertCaseAccess(c, currentUser, 'view documents for');

    return this.prisma.document.findMany({
      where: { caseId },
      include: {
        uploadedBy: { select: { id: true, email: true, role: true } },
      },
      orderBy: [{ filename: 'asc' }, { version: 'desc' }],
    });
  }

  /**
   * Delete a document.
   */
  async remove(id: string, currentUser: AuthenticatedUser) {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: { case: { include: { client: true } } },
    });

    if (!doc) {
      throw new NotFoundException(`Document ${id} not found`);
    }

    if (currentUser.role === UserRole.CLIENT) {
      throw new ForbiddenException('Clients cannot delete filed compliance documents.');
    }

    if (currentUser.role === UserRole.ASSOCIATE) {
      const isAssignee = doc.case.assignedToId === currentUser.id;
      const isClientCa = doc.case.client.assignedCaId === currentUser.id;
      if (!isAssignee && !isClientCa) {
        throw new ForbiddenException('Associates can only delete documents for assigned cases.');
      }
    }

    await this.prisma.document.delete({ where: { id } });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'DOCUMENT_DELETED',
      entity: 'Document',
      entityId: id,
      metadata: {
        filename: doc.filename,
        caseId: doc.caseId,
      },
    });

    return { success: true, message: `Document ${id} deleted` };
  }

  /**
   * Helper to verify if user has permission to access a case
   */
  private assertCaseAccess(
    c: { clientId: string; assignedToId?: string | null; client: { userId: string; assignedCaId?: string | null } },
    user: AuthenticatedUser,
    actionDesc: string,
  ): void {
    if (user.role === UserRole.CLIENT) {
      if (c.clientId !== user.clientProfileId && c.client.userId !== user.id) {
        throw new ForbiddenException(`Access denied: You cannot ${actionDesc} another client's case.`);
      }
    } else if (user.role === UserRole.ASSOCIATE) {
      const isAssignee = c.assignedToId === user.id;
      const isClientCa = c.client.assignedCaId === user.id;
      if (!isAssignee && !isClientCa) {
        throw new ForbiddenException(`Access denied: Associates cannot ${actionDesc} unassigned cases.`);
      }
    }
  }
}
