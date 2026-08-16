import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import type { Prisma } from '@thabrez/db';

import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import type { PaginatedResult } from '../clients/clients.service';
import { sanitizeHtmlContent } from '../common/utils/sanitizer.util';

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  /**
   * Public: List published blog articles with pagination and search.
   */
  async findPublished(query: QueryBlogDto): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.BlogPostWhereInput = {
      published: true,
    };

    if (query.search) {
      const term = query.search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { body: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.blogPost.count({ where }),
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: { select: { id: true, email: true, role: true } },
        },
        orderBy: { publishedAt: 'desc' },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Public: Get published blog article by slug.
   */
  async findBySlug(slug: string) {
    const post = await this.prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, email: true, role: true } },
      },
    });

    if (!post || !post.published) {
      throw new NotFoundException(`Blog post '${slug}' not found`);
    }

    return post;
  }

  /**
   * Staff: List all blog posts including drafts.
   */
  async findAllStaff(query: QueryBlogDto): Promise<PaginatedResult<unknown>> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(50, Math.max(1, query.limit || 10));
    const skip = (page - 1) * limit;

    const where: Prisma.BlogPostWhereInput = {};

    if (query.search) {
      const term = query.search.trim();
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { slug: { contains: term, mode: 'insensitive' } },
      ];
    }

    const [total, data] = await Promise.all([
      this.prisma.blogPost.count({ where }),
      this.prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        include: {
          author: { select: { id: true, email: true, role: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  /**
   * Staff: Create a blog post or draft.
   */
  async create(dto: CreateBlogPostDto, currentUser: AuthenticatedUser) {
    const slug = dto.slug
      ? this.slugify(dto.slug)
      : this.slugify(dto.title);

    const existingSlug = await this.prisma.blogPost.findUnique({ where: { slug } });
    if (existingSlug) {
      throw new BadRequestException(`Slug '${slug}' is already in use. Please choose a different title or slug.`);
    }

    const publishedAt = dto.published ? new Date() : null;

    const post = await this.prisma.blogPost.create({
      data: {
        title: dto.title.trim(),
        slug,
        body: sanitizeHtmlContent(dto.body),
        published: dto.published ?? false,
        publishedAt,
        authorId: currentUser.id,
      },
      include: {
        author: { select: { id: true, email: true, role: true } },
      },
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'BLOG_POST_CREATED',
      entity: 'BlogPost',
      entityId: post.id,
      metadata: { title: post.title, slug: post.slug, published: post.published },
    });

    return post;
  }

  /**
   * Staff: Update a blog post.
   */
  async update(id: string, dto: UpdateBlogPostDto, currentUser: AuthenticatedUser) {
    const existing = await this.prisma.blogPost.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Blog post ${id} not found`);
    }

    let slug = existing.slug;
    if (dto.slug && dto.slug !== existing.slug) {
      slug = this.slugify(dto.slug);
      const slugConflict = await this.prisma.blogPost.findUnique({ where: { slug } });
      if (slugConflict && slugConflict.id !== id) {
        throw new BadRequestException(`Slug '${slug}' is already in use.`);
      }
    }

    let publishedAt = existing.publishedAt;
    if (dto.published === true && !existing.published) {
      publishedAt = new Date();
    } else if (dto.published === false) {
      publishedAt = null;
    }

    const updated = await this.prisma.blogPost.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title.trim() }),
        slug,
        ...(dto.body !== undefined && { body: sanitizeHtmlContent(dto.body) }),
        ...(dto.published !== undefined && { published: dto.published }),
        publishedAt,
      },
      include: {
        author: { select: { id: true, email: true, role: true } },
      },
    });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'BLOG_POST_UPDATED',
      entity: 'BlogPost',
      entityId: id,
      metadata: { published: updated.published, slug: updated.slug },
    });

    return updated;
  }

  /**
   * Staff: Delete a blog post.
   */
  async remove(id: string, currentUser: AuthenticatedUser) {
    await this.prisma.blogPost.delete({ where: { id } });

    await this.auditService.log({
      actorId: currentUser.id,
      action: 'BLOG_POST_DELETED',
      entity: 'BlogPost',
      entityId: id,
    });

    return { success: true, message: `Blog post ${id} deleted` };
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
