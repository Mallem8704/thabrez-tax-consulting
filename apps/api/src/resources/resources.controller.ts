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
import { UserRole, type ResourceType } from '@thabrez/db';

import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { QueryResourceDto } from './dto/query-resource.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@ApiTags('resources')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get()
  @ApiOperation({ summary: 'List knowledge resources (Public endpoint, filterable by type/category)' })
  findAll(@Query() query: QueryResourceDto) {
    return this.resourcesService.findAll(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Full-text search across Acts, Rules, Forms & Bulletins (Public endpoint)' })
  search(
    @Query('q') q: string,
    @Query('type') type?: ResourceType,
    @Query('category') category?: string,
  ) {
    return this.resourcesService.search(q || '', type, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get resource details by CUID (Public endpoint)' })
  @ApiParam({ name: 'id', description: 'Resource CUID' })
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA)
  @ApiOperation({ summary: 'Create a knowledge bank item (Admin / Senior CA only)' })
  @ApiResponse({ status: 201, description: 'Resource created' })
  create(
    @Body() dto: CreateResourceDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.resourcesService.create(dto, user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA)
  @ApiOperation({ summary: 'Update a knowledge bank item (Admin / Senior CA only)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateResourceDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.resourcesService.update(id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA)
  @ApiOperation({ summary: 'Delete a knowledge bank item (Admin / Senior CA only)' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.resourcesService.remove(id, user);
  }
}
