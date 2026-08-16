import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRole } from '@thabrez/db';
import { BlogService } from './blog.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

describe('BlogService — Public Read & Staff Publishing Tests', () => {
  let blogService: BlogService;
  let mockPrisma: any;
  let mockAuditService: { log: jest.Mock };

  const staffUser: AuthenticatedUser = {
    id: 'user_ca_1',
    email: 'ca@thabrez.com',
    phone: '9000000010',
    role: UserRole.SENIOR_CA,
    clientProfileId: null,
  };

  beforeEach(() => {
    mockAuditService = {
      log: jest.fn().mockResolvedValue(undefined),
    };

    mockPrisma = {
      blogPost: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn().mockResolvedValue(1),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    blogService = new BlogService(
      mockPrisma as unknown as PrismaService,
      mockAuditService as unknown as AuditService,
    );
  });

  describe('Public Blog Reading', () => {
    it('should list only PUBLISHED articles in public query', async () => {
      mockPrisma.blogPost.findMany.mockResolvedValue([]);

      await blogService.findPublished({});

      expect(mockPrisma.blogPost.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            published: true,
          }),
        }),
      );
    });

    it('should REJECT public access to an unpublished draft article with NotFoundException', async () => {
      mockPrisma.blogPost.findUnique.mockResolvedValue({
        id: 'post_draft_1',
        title: 'Draft Post',
        slug: 'draft-post',
        published: false,
      });

      await expect(blogService.findBySlug('draft-post')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should ALLOW public access to a published article by slug', async () => {
      mockPrisma.blogPost.findUnique.mockResolvedValue({
        id: 'post_pub_1',
        title: 'GST Guide 2025',
        slug: 'gst-guide-2025',
        published: true,
        body: 'Full GST guide text...',
      });

      const post = await blogService.findBySlug('gst-guide-2025');
      expect(post.slug).toBe('gst-guide-2025');
      expect(post.published).toBe(true);
    });
  });

  describe('Staff Blog Publishing', () => {
    it('should auto-generate slug and publish date when creating published article', async () => {
      mockPrisma.blogPost.findUnique.mockResolvedValue(null);
      mockPrisma.blogPost.create.mockImplementation(({ data }: any) => ({
        id: 'post_new_1',
        ...data,
      }));

      const res = await blogService.create(
        {
          title: 'Understanding Section 80C Tax Deductions for FY 2024-25',
          body: '# Section 80C Overview',
          published: true,
        },
        staffUser,
      );

      expect(res.slug).toBe('understanding-section-80c-tax-deductions-for-fy-2024-25');
      expect(res.published).toBe(true);
      expect(res.publishedAt).toBeInstanceOf(Date);
      expect(mockAuditService.log).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'BLOG_POST_CREATED' }),
      );
    });
  });
});
