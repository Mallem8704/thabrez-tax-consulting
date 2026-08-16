import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole, ServiceType, CaseStatus } from '@thabrez/db';
import { CasesService } from './cases.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

describe('CasesService — RBAC & Compliance Deadline Tests', () => {
  let casesService: CasesService;
  let mockPrisma: any;
  let mockAuditService: { log: jest.Mock };

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

  const associate1: AuthenticatedUser = {
    id: 'user_associate_1',
    email: 'associate1@thabrez.com',
    phone: '9000000010',
    role: UserRole.ASSOCIATE,
    clientProfileId: null,
  };

  const seniorCa: AuthenticatedUser = {
    id: 'user_senior_ca_1',
    email: 'seniorca@thabrez.com',
    phone: '9000000020',
    role: UserRole.SENIOR_CA,
    clientProfileId: null,
  };

  const admin: AuthenticatedUser = {
    id: 'user_admin_1',
    email: 'admin@thabrez.com',
    phone: '9000000030',
    role: UserRole.ADMIN,
    clientProfileId: null,
  };

  beforeEach(() => {
    mockAuditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    mockPrisma = {
      case: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn(),
        update: jest.fn(),
      },
      client: {
        findUnique: jest.fn(),
      },
      deadline: {
        create: jest.fn(),
        updateMany: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn().mockImplementation(async (cb: any) => cb(mockPrisma)),
    };

    casesService = new CasesService(
      mockPrisma as unknown as PrismaService,
      mockAuditService as unknown as AuditService,
    );
  });

  describe('Cases Listing (findAll) — Strict Scoping', () => {
    it("should restrict CLIENT role to strictly listing only their own client cases", async () => {
      mockPrisma.case.findMany.mockResolvedValue([]);

      await casesService.findAll(clientUser1, {});

      expect(mockPrisma.case.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            clientId: 'client_profile_1',
          }),
        }),
      );
    });

    it("should ignore query.clientId parameter if a CLIENT tries to supply another client's id", async () => {
      mockPrisma.case.findMany.mockResolvedValue([]);

      // Client 1 attempts to pass Client 2's ID in query filter
      await casesService.findAll(clientUser1, { clientId: 'client_profile_2' });

      // Must be scoped strictly to Client 1's profile
      expect(mockPrisma.case.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            clientId: 'client_profile_1',
          }),
        }),
      );
    });

    it('should restrict ASSOCIATE role to only seeing cases assigned to them or their assigned clients', async () => {
      mockPrisma.case.findMany.mockResolvedValue([]);

      await casesService.findAll(associate1, {});

      expect(mockPrisma.case.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [
              { assignedToId: 'user_associate_1' },
              { client: { assignedCaId: 'user_associate_1' } },
            ],
          }),
        }),
      );
    });

    it('should allow SENIOR_CA and ADMIN to see all cases across all clients', async () => {
      mockPrisma.case.findMany.mockResolvedValue([]);

      await casesService.findAll(seniorCa, {});
      expect(mockPrisma.case.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        }),
      );

      await casesService.findAll(admin, { serviceType: ServiceType.GST_FILING });
      expect(mockPrisma.case.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            serviceType: ServiceType.GST_FILING,
          }),
        }),
      );
    });
  });

  describe('Case Details (findOne) — Authorization Checks', () => {
    it("should REJECT a CLIENT role trying to view another client's case with ForbiddenException", async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_xyz',
        clientId: 'client_profile_2', // Belongs to Client 2
        client: { userId: 'user_client_2' },
        assignedTo: { id: 'user_associate_1', email: 'ca@thabrez.com', role: 'ASSOCIATE' },
      });

      await expect(casesService.findOne('case_xyz', clientUser1)).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("should ALLOW a CLIENT role to view their own case", async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_own',
        clientId: 'client_profile_1',
        client: { userId: 'user_client_1' },
        assignedTo: { id: 'user_associate_1' },
      });

      const res = await casesService.findOne('case_own', clientUser1);
      expect(res.id).toBe('case_own');
    });

    it('should REJECT an ASSOCIATE trying to view a case not assigned to them with ForbiddenException', async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_other_associate',
        clientId: 'client_profile_99',
        client: { userId: 'user_client_99', assignedCaId: 'user_associate_99' },
        assignedToId: 'user_associate_99',
      });

      await expect(
        casesService.findOne('case_other_associate', associate1),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should ALLOW SENIOR_CA and ADMIN to view any case', async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_any',
        clientId: 'client_profile_99',
        client: { userId: 'user_client_99', assignedCaId: 'user_associate_99' },
        assignedToId: 'user_associate_99',
      });

      const res = await casesService.findOne('case_any', seniorCa);
      expect(res.id).toBe('case_any');
    });
  });

  describe('Case Creation & Statutory Deadline Auto-Generation', () => {
    it('should auto-generate a monthly recurring Deadline record when creating a GST_FILING case', async () => {
      mockPrisma.client.findUnique.mockResolvedValue({
        id: 'client_profile_1',
        userId: 'user_client_1',
        assignedCaId: 'user_senior_ca_1',
      });

      mockPrisma.case.create.mockResolvedValue({
        id: 'case_gst_100',
        clientId: 'client_profile_1',
        serviceType: ServiceType.GST_FILING,
        assignedToId: 'user_senior_ca_1',
      });

      mockPrisma.deadline.create.mockResolvedValue({
        id: 'deadline_gst_100',
      });

      const created = await casesService.create(
        {
          clientId: 'client_profile_1',
          serviceType: ServiceType.GST_FILING,
        },
        seniorCa,
      );

      expect(created.id).toBe('case_gst_100');

      // Verify Deadline record was created in the transaction
      expect(mockPrisma.deadline.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            clientId: 'client_profile_1',
            caseId: 'case_gst_100',
            type: ServiceType.GST_FILING,
            status: 'PENDING',
          }),
        }),
      );

      // Verify AuditLog emission
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CASE_CREATED',
          entity: 'Case',
          entityId: 'case_gst_100',
        }),
      );
    });
  });

  describe('Case Status Update & Immutable AuditLog Entry', () => {
    it('should update status and record CASE_STATUS_CHANGE in AuditLog with previous and new status', async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_to_update',
        status: CaseStatus.RECEIVED,
        serviceType: ServiceType.ITR_FILING,
        clientId: 'client_profile_1',
        assignedToId: 'user_senior_ca_1',
        client: { assignedCaId: 'user_senior_ca_1' },
      });

      mockPrisma.case.update.mockResolvedValue({
        id: 'case_to_update',
        status: CaseStatus.IN_REVIEW,
      });

      await casesService.updateStatus(
        'case_to_update',
        { status: CaseStatus.IN_REVIEW },
        seniorCa,
      );

      expect(mockPrisma.case.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'case_to_update' },
          data: { status: CaseStatus.IN_REVIEW },
        }),
      );

      // Verify AuditLog entry
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CASE_STATUS_CHANGE',
          entity: 'Case',
          entityId: 'case_to_update',
          metadata: expect.objectContaining({
            fromStatus: CaseStatus.RECEIVED,
            toStatus: CaseStatus.IN_REVIEW,
          }),
        }),
      );
    });

    it('should REJECT a CLIENT attempting to modify case status with ForbiddenException', async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_to_update',
        status: CaseStatus.RECEIVED,
        client: { userId: 'user_client_1' },
      });

      await expect(
        casesService.updateStatus(
          'case_to_update',
          { status: CaseStatus.FILED },
          clientUser1,
        ),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
