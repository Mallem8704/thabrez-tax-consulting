import { ForbiddenException, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRole, EntityType } from '@thabrez/db';
import { ClientsService } from './clients.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

describe('ClientsService — Full CRUD & RBAC Tests', () => {
  let clientsService: ClientsService;
  let mockPrisma: any;
  let mockAuditService: { log: jest.Mock };

  const clientUser: AuthenticatedUser = {
    id: 'user_client_1',
    email: 'client1@example.com',
    phone: '9876543210',
    role: UserRole.CLIENT,
    clientProfileId: 'client_profile_1',
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
      client: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
      $transaction: jest.fn().mockImplementation(async (cb: any) => cb(mockPrisma)),
    };

    clientsService = new ClientsService(
      mockPrisma as unknown as PrismaService,
      mockAuditService as unknown as AuditService,
    );
  });

  describe('Clients Listing (findAll)', () => {
    it('should restrict CLIENT to their own profile by userId', async () => {
      mockPrisma.client.findMany.mockResolvedValue([]);

      await clientsService.findAll(clientUser, {});

      expect(mockPrisma.client.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            userId: 'user_client_1',
          }),
        }),
      );
    });

    it('should restrict ASSOCIATE to viewing only their assigned clients', async () => {
      mockPrisma.client.findMany.mockResolvedValue([]);

      await clientsService.findAll(associate1, {});

      expect(mockPrisma.client.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            assignedCaId: 'user_associate_1',
          }),
        }),
      );
    });

    it('should allow ADMIN and SENIOR_CA to view all clients', async () => {
      mockPrisma.client.findMany.mockResolvedValue([]);

      await clientsService.findAll(admin, {});

      expect(mockPrisma.client.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        }),
      );
    });
  });

  describe('Client Creation (create)', () => {
    it('should create User and Client in a transaction and emit AuditLog', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.client.findUnique.mockResolvedValue(null);

      mockPrisma.user.create.mockResolvedValue({
        id: 'new_user_1',
        email: 'newclient@example.com',
        role: UserRole.CLIENT,
      });

      mockPrisma.client.create.mockResolvedValue({
        id: 'new_client_1',
        userId: 'new_user_1',
        companyName: 'New Horizon Corp',
        pan: 'ABCDE1234F',
        user: { email: 'newclient@example.com' },
      });

      const result = await clientsService.create(
        {
          email: 'newclient@example.com',
          companyName: 'New Horizon Corp',
          pan: 'ABCDE1234F',
          entityType: EntityType.PVT_LTD,
        },
        seniorCa,
      );

      expect(result.id).toBe('new_client_1');
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CLIENT_CREATED',
          entity: 'Client',
          entityId: 'new_client_1',
        }),
      );
    });

    it('should reject creation if email already exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing_user' });

      await expect(
        clientsService.create(
          {
            email: 'duplicate@example.com',
          },
          admin,
        ),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('Client Update & CA Reassignment', () => {
    it('should allow ASSOCIATE to update details of an assigned client', async () => {
      mockPrisma.client.findUnique.mockResolvedValue({
        id: 'client_10',
        assignedCaId: 'user_associate_1',
      });

      mockPrisma.client.update.mockResolvedValue({
        id: 'client_10',
        companyName: 'Updated Name',
      });

      const res = await clientsService.update(
        'client_10',
        { companyName: 'Updated Name' },
        associate1,
      );

      expect(res.id).toBe('client_10');
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CLIENT_UPDATED',
        }),
      );
    });

    it('should REJECT ASSOCIATE attempting to reassign CA on a client', async () => {
      mockPrisma.client.findUnique.mockResolvedValue({
        id: 'client_10',
        assignedCaId: 'user_associate_1',
      });

      await expect(
        clientsService.update(
          'client_10',
          { assignedCaId: 'user_associate_99' },
          associate1,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should REJECT CLIENT role from modifying PAN or GSTIN directly', async () => {
      mockPrisma.client.findUnique.mockResolvedValue({
        id: 'client_profile_1',
        userId: 'user_client_1',
      });

      await expect(
        clientsService.update(
          'client_profile_1',
          { pan: 'NEWPAN1234F' },
          clientUser,
        ),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should allow CLIENT role to update their own contact details', async () => {
      mockPrisma.client.findUnique.mockResolvedValue({
        id: 'client_profile_1',
        userId: 'user_client_1',
      });

      mockPrisma.client.update.mockResolvedValue({
        id: 'client_profile_1',
        companyName: 'Updated Client Org',
      });
      mockPrisma.user.update = jest.fn().mockResolvedValue({});

      const res = await clientsService.update(
        'client_profile_1',
        { companyName: 'Updated Client Org', phone: '9988776655' },
        clientUser,
      );

      expect(res.id).toBe('client_profile_1');
    });
  });

  describe('Client Removal (remove)', () => {
    it('should delete client and write AuditLog', async () => {
      mockPrisma.client.findUnique.mockResolvedValue({
        id: 'client_delete',
        companyName: 'Delete Corp',
        userId: 'user_del',
      });

      mockPrisma.client.delete.mockResolvedValue({});

      const res = await clientsService.remove('client_delete', admin);
      expect(res.success).toBe(true);

      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'CLIENT_DELETED',
          entity: 'Client',
          entityId: 'client_delete',
        }),
      );
    });
  });
});
