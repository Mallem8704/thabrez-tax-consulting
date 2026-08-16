import { ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@thabrez/db';
import { DocumentsService } from './documents.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { StorageService } from './storage.service';
import { VirusScannerService } from './virus-scanner.service';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

describe('DocumentsService — S3 Presigned URLs, Versioning & RBAC Isolation', () => {
  let documentsService: DocumentsService;
  let mockPrisma: any;
  let mockAuditService: { log: jest.Mock };
  let mockStorageService: { generateUploadUrl: jest.Mock; generateDownloadUrl: jest.Mock };
  let mockVirusScanner: { scanFile: jest.Mock };

  const clientUser1: AuthenticatedUser = {
    id: 'user_client_1',
    email: 'client1@example.com',
    phone: '9876543210',
    role: UserRole.CLIENT,
    clientProfileId: 'client_profile_1',
  };

  const clientUser2: AuthenticatedUser = {
    id: 'user_client_2',
    email: 'client2@example.com',
    phone: '9876543211',
    role: UserRole.CLIENT,
    clientProfileId: 'client_profile_2',
  };

  const associateUser: AuthenticatedUser = {
    id: 'user_associate_1',
    email: 'associate@thabrez.com',
    phone: '9000000010',
    role: UserRole.ASSOCIATE,
    clientProfileId: null,
  };

  const seniorCaUser: AuthenticatedUser = {
    id: 'user_senior_ca',
    email: 'seniorca@thabrez.com',
    phone: '9000000020',
    role: UserRole.SENIOR_CA,
    clientProfileId: null,
  };

  beforeEach(() => {
    mockAuditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    mockStorageService = {
      generateUploadUrl: jest
        .fn()
        .mockResolvedValue('https://s3.amazonaws.com/bucket/upload-presigned-url'),
      generateDownloadUrl: jest
        .fn()
        .mockResolvedValue('https://s3.amazonaws.com/bucket/download-presigned-url'),
    };

    mockVirusScanner = {
      scanFile: jest.fn().mockResolvedValue(true),
    };

    mockPrisma = {
      case: {
        findUnique: jest.fn(),
      },
      document: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };

    documentsService = new DocumentsService(
      mockPrisma as unknown as PrismaService,
      mockAuditService as unknown as AuditService,
      mockStorageService as unknown as StorageService,
      mockVirusScanner as unknown as VirusScannerService,
    );
  });

  describe('Download URL Generation (getDownloadUrl) — Strict Client Isolation', () => {
    it("should REJECT a CLIENT attempting to download another client's document with ForbiddenException", async () => {
      // Document belongs to Client 2
      mockPrisma.document.findUnique.mockResolvedValue({
        id: 'doc_client_2_pan',
        caseId: 'case_client_2',
        filename: 'PAN_Card.pdf',
        s3Key: 'clients/client_profile_2/cases/case_client_2/pan.pdf',
        version: 1,
        case: {
          clientId: 'client_profile_2',
          client: {
            userId: 'user_client_2',
            assignedCaId: 'user_associate_1',
          },
        },
      });

      // Client 1 tries to generate download URL
      await expect(
        documentsService.getDownloadUrl('doc_client_2_pan', clientUser1),
      ).rejects.toThrow(ForbiddenException);

      expect(mockStorageService.generateDownloadUrl).not.toHaveBeenCalled();
    });

    it('should ALLOW a CLIENT to download documents belonging to their own case', async () => {
      // Document belongs to Client 1
      mockPrisma.document.findUnique.mockResolvedValue({
        id: 'doc_client_1_pan',
        caseId: 'case_client_1',
        filename: 'Client1_PAN.pdf',
        s3Key: 'clients/client_profile_1/cases/case_client_1/pan.pdf',
        version: 1,
        case: {
          clientId: 'client_profile_1',
          client: {
            userId: 'user_client_1',
            assignedCaId: 'user_associate_1',
          },
        },
      });

      const res = await documentsService.getDownloadUrl('doc_client_1_pan', clientUser1);

      expect(res.downloadUrl).toBe('https://s3.amazonaws.com/bucket/download-presigned-url');
      expect(res.filename).toBe('Client1_PAN.pdf');
      expect(mockStorageService.generateDownloadUrl).toHaveBeenCalledWith(
        'clients/client_profile_1/cases/case_client_1/pan.pdf',
        'Client1_PAN.pdf',
        900,
      );

      // Verify AuditLog
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'DOCUMENT_DOWNLOADED',
          entity: 'Document',
          entityId: 'doc_client_1_pan',
        }),
      );
    });

    it('should REJECT an ASSOCIATE attempting to download documents for unassigned cases', async () => {
      mockPrisma.document.findUnique.mockResolvedValue({
        id: 'doc_unassigned',
        caseId: 'case_other',
        filename: 'Audit_Report.pdf',
        s3Key: 'clients/client_profile_99/cases/case_other/audit.pdf',
        version: 1,
        case: {
          clientId: 'client_profile_99',
          assignedToId: 'user_other_associate',
          client: {
            userId: 'user_client_99',
            assignedCaId: 'user_other_associate',
          },
        },
      });

      await expect(
        documentsService.getDownloadUrl('doc_unassigned', associateUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should ALLOW SENIOR_CA and ADMIN to download any document', async () => {
      mockPrisma.document.findUnique.mockResolvedValue({
        id: 'doc_any',
        caseId: 'case_any',
        filename: 'GSTR_Report.xlsx',
        s3Key: 'clients/client_profile_99/cases/case_any/gstr.xlsx',
        version: 1,
        case: {
          clientId: 'client_profile_99',
          client: {
            userId: 'user_client_99',
          },
        },
      });

      const res = await documentsService.getDownloadUrl('doc_any', seniorCaUser);
      expect(res.downloadUrl).toBeDefined();
    });
  });

  describe('Upload URL Generation (requestUploadUrl)', () => {
    it('should generate pre-signed upload URL and structured S3 key for authorized case', async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_client_1',
        clientId: 'client_profile_1',
        client: { userId: 'user_client_1' },
      });

      const res = await documentsService.requestUploadUrl(
        {
          caseId: 'case_client_1',
          filename: 'Form16_2024.pdf',
          contentType: 'application/pdf',
          fileSize: 2048576,
        },
        clientUser1,
      );

      expect(res.uploadUrl).toBe('https://s3.amazonaws.com/bucket/upload-presigned-url');
      expect(res.s3Key).toContain('clients/client_profile_1/cases/case_client_1/');
      expect(res.s3Key).toContain('Form16_2024.pdf');
    });

    it("should REJECT upload URL request if CLIENT targets another client's case", async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_client_2',
        clientId: 'client_profile_2',
        client: { userId: 'user_client_2' },
      });

      await expect(
        documentsService.requestUploadUrl(
          {
            caseId: 'case_client_2',
            filename: 'Form16.pdf',
            contentType: 'application/pdf',
            fileSize: 1024,
          },
          clientUser1,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('Confirm Upload & Document Versioning', () => {
    it('should assign version 1 when uploading a new filename to a case', async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_client_1',
        clientId: 'client_profile_1',
        client: { userId: 'user_client_1' },
      });

      // No prior documents with this filename
      mockPrisma.document.findMany.mockResolvedValue([]);

      mockPrisma.document.create.mockImplementation(({ data }: any) => ({
        id: 'doc_v1',
        ...data,
      }));

      const res = await documentsService.confirmUpload(
        {
          caseId: 'case_client_1',
          s3Key: 'clients/client_profile_1/cases/case_client_1/123_Form16.pdf',
          filename: 'Form16.pdf',
          fileSize: 1048576,
        },
        clientUser1,
      );

      expect(res.version).toBe(1);
      expect(mockVirusScanner.scanFile).toHaveBeenCalledWith(
        'clients/client_profile_1/cases/case_client_1/123_Form16.pdf',
      );
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'DOCUMENT_UPLOADED',
          metadata: expect.objectContaining({ version: 1 }),
        }),
      );
    });

    it('should increment to version 2 when uploading a file with identical filename to same case', async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_client_1',
        clientId: 'client_profile_1',
        client: { userId: 'user_client_1' },
      });

      // Existing document with version 1
      mockPrisma.document.findMany.mockResolvedValue([{ version: 1 }]);

      mockPrisma.document.create.mockImplementation(({ data }: any) => ({
        id: 'doc_v2',
        ...data,
      }));

      const res = await documentsService.confirmUpload(
        {
          caseId: 'case_client_1',
          s3Key: 'clients/client_profile_1/cases/case_client_1/456_Form16.pdf',
          filename: 'Form16.pdf',
          fileSize: 1048576,
        },
        clientUser1,
      );

      expect(res.version).toBe(2);
    });

    it('should REJECT document confirmation if virus scanner detects malware', async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_client_1',
        clientId: 'client_profile_1',
        client: { userId: 'user_client_1' },
      });

      // Simulate virus scanner finding malware
      mockVirusScanner.scanFile.mockResolvedValue(false);

      await expect(
        documentsService.confirmUpload(
          {
            caseId: 'case_client_1',
            s3Key: 'clients/client_profile_1/cases/case_client_1/virus_file.pdf',
            filename: 'virus_file.pdf',
            fileSize: 1048576,
          },
          clientUser1,
        ),
      ).rejects.toThrow(BadRequestException);

      expect(mockPrisma.document.create).not.toHaveBeenCalled();
    });
  });
});
