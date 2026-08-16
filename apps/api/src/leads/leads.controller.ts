import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  Ip,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import type { Request } from 'express';
import { UserRole } from '@thabrez/db';

import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { QueryLeadsDto } from './dto/query-leads.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post()
  @ApiOperation({
    summary: 'Public lead / consultation request submission (Rate-limited & Turnstile CAPTCHA protected)',
  })
  @ApiResponse({ status: 201, description: 'Lead successfully captured and staff notified' })
  createPublicLead(
    @Body() dto: CreateLeadDto,
    @Ip() ip: string,
    @Req() req: Request,
  ) {
    const clientIp = (req.headers['x-forwarded-for'] as string) || ip;
    return this.leadsService.createPublicLead(dto, clientIp);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA, UserRole.ASSOCIATE, UserRole.FRONT_DESK)
  @ApiOperation({ summary: 'List and filter inbound consultation leads (Staff only)' })
  findAll(@Query() query: QueryLeadsDto) {
    return this.leadsService.findAll(query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA, UserRole.ASSOCIATE, UserRole.FRONT_DESK)
  @ApiOperation({ summary: 'Get consultation lead details by CUID (Staff only)' })
  @ApiParam({ name: 'id', description: 'Lead CUID' })
  findOne(@Param('id') id: string) {
    return this.leadsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA, UserRole.ASSOCIATE, UserRole.FRONT_DESK)
  @ApiOperation({ summary: 'Update lead lifecycle status and consultation notes (Staff only)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateLeadDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.leadsService.update(id, dto, user);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA)
  @ApiOperation({ summary: 'Delete a lead (Admin only)' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.leadsService.remove(id, user);
  }
}
