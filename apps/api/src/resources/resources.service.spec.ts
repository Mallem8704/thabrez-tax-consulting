import { ResourceType } from '@thabrez/db';
import { ResourcesService } from './resources.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

describe('ResourcesService — Full-Text Search & Category Filtering', () => {
  let resourcesService: ResourcesService;
  let mockPrisma: any;
  let mockAuditService: { log: jest.Mock };

  const staffUser: AuthenticatedUser = {
    id: 'user_admin',
    email: 'admin@thabrez.com',
    phone: '9000000001',
    role: 'ADMIN',
    clientProfileId: null,
  };

  beforeEach(() => {
    mockAuditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    mockPrisma = {
      resource: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    resourcesService = new ResourcesService(
      mockPrisma as unknown as PrismaService,
      mockAuditService as unknown as AuditService,
    );
  });

  describe('Full-Text Search', () => {
    it('should split multi-term search query into AND conditions across fields', async () => {
      mockPrisma.resource.findMany.mockResolvedValue([
        {
          id: 'res_1',
          type: ResourceType.ACT,
          title: 'CGST Act 2017',
          category: 'GST',
        },
      ]);

      const results = await resourcesService.search('CGST 2017', ResourceType.ACT, 'GST');

      expect(results.length).toBe(1);
      expect(mockPrisma.resource.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            type: ResourceType.ACT,
            category: expect.objectContaining({ contains: 'GST' }),
            AND: expect.arrayContaining([
              expect.objectContaining({
                OR: expect.arrayContaining([
                  { title: { contains: 'CGST', mode: 'insensitive' } },
                ]),
              }),
              expect.objectContaining({
                OR: expect.arrayContaining([
                  { title: { contains: '2017', mode: 'insensitive' } },
                ]),
              }),
            ]),
          }),
        }),
      );
    });
  });

  describe('Create & Edit Resources', () => {
    it('should allow staff to create an Act resource and record audit log', async () => {
      mockPrisma.resource.create.mockImplementation(({ data }: any) => ({
        id: 'new_res_1',
        ...data,
      }));

      const res = await resourcesService.create(
        {
          type: ResourceType.ACT,
          title: 'Income Tax Act 1961',
          category: 'Income Tax',
          bodyOrFileUrl: 'Full Act text',
        },
        staffUser,
      );

      expect(res.title).toBe('Income Tax Act 1961');
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({
          action: 'RESOURCE_CREATED',
          entity: 'Resource',
          entityId: 'new_res_1',
        }),
      );
    });
  });
});
