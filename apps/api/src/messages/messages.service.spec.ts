import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@thabrez/db';
import { MessagesService } from './messages.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

describe('MessagesService — Case-Scoped Messaging & RBAC Isolation', () => {
  let messagesService: MessagesService;
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

  const associateUser: AuthenticatedUser = {
    id: 'user_associate_1',
    email: 'associate@thabrez.com',
    phone: '9000000010',
    role: UserRole.ASSOCIATE,
    clientProfileId: null,
  };

  beforeEach(() => {
    mockAuditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    mockPrisma = {
      case: {
        findUnique: jest.fn(),
      },
      message: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        delete: jest.fn(),
      },
    };

    messagesService = new MessagesService(
      mockPrisma as unknown as PrismaService,
      mockAuditService as unknown as AuditService,
    );
  });

  describe('Post Case Message', () => {
    it('should ALLOW the client owner to post a message to their case', async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_100',
        clientId: 'client_profile_1',
        client: { userId: 'user_client_1' },
      });

      mockPrisma.message.create.mockImplementation(({ data }: any) => ({
        id: 'msg_1',
        ...data,
      }));

      const res = await messagesService.create(
        {
          caseId: 'case_100',
          body: 'Hello CA, please find my updated turnover figures.',
        },
        clientUser1,
      );

      expect(res.id).toBe('msg_1');
      expect(res.body).toBe('Hello CA, please find my updated turnover figures.');
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'MESSAGE_SENT' }),
      );
    });

    it("should REJECT a CLIENT trying to post a message in another client's case", async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_200',
        clientId: 'client_profile_2',
        client: { userId: 'user_client_2' },
      });

      await expect(
        messagesService.create(
          {
            caseId: 'case_200',
            body: 'Trying to intrude on someone else case.',
          },
          clientUser1,
        ),
      ).rejects.toThrow(ForbiddenException);

      expect(mockPrisma.message.create).not.toHaveBeenCalled();
    });
  });

  describe('View Case Messages', () => {
    it("should REJECT a CLIENT trying to view another client's case messages", async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_200',
        clientId: 'client_profile_2',
        client: { userId: 'user_client_2' },
      });

      await expect(
        messagesService.findByCaseId('case_200', clientUser1),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should ALLOW assigned ASSOCIATE to view case messages', async () => {
      mockPrisma.case.findUnique.mockResolvedValue({
        id: 'case_200',
        clientId: 'client_profile_2',
        assignedToId: 'user_associate_1',
        client: { userId: 'user_client_2', assignedCaId: 'user_associate_1' },
      });

      mockPrisma.message.findMany.mockResolvedValue([
        { id: 'm1', body: 'First message', senderId: 'user_client_2' },
      ]);

      const messages = await messagesService.findByCaseId('case_200', associateUser);
      expect(messages.length).toBe(1);
    });
  });
});
