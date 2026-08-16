import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
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

import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Get()
  @ApiOperation({ summary: 'List published blog articles (Public endpoint)' })
  findPublished(@Query() query: QueryBlogDto) {
    return this.blogService.findPublished(query);
  }

  @Get('admin')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA, UserRole.ASSOCIATE)
  @ApiOperation({ summary: 'List all blog articles including drafts (Staff only)' })
  findAllStaff(@Query() query: QueryBlogDto) {
    return this.blogService.findAllStaff(query);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Read published blog post by slug (Public endpoint)' })
  @ApiParam({ name: 'slug', description: 'Article URL slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA, UserRole.ASSOCIATE)
  @ApiOperation({ summary: 'Create a new blog article or draft (Staff only)' })
  @ApiResponse({ status: 201, description: 'Blog post created' })
  create(
    @Body() dto: CreateBlogPostDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.blogService.create(dto, user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA, UserRole.ASSOCIATE)
  @ApiOperation({ summary: 'Update a blog post (Staff only)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBlogPostDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.blogService.update(id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA)
  @ApiOperation({ summary: 'Delete a blog post (Admin / Senior CA only)' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.blogService.remove(id, user);
  }
}
