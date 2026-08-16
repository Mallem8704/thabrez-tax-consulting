import {
  Controller,
  Get,
  Post,
  Patch,
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
} from '@nestjs/swagger';
import { UserRole, type DeadlineStatus } from '@thabrez/db';

import { DeadlinesService } from './deadlines.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@ApiTags('deadlines')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('deadlines')
export class DeadlinesController {
  constructor(private readonly deadlinesService: DeadlinesService) {}

  @Get()
  @ApiOperation({ summary: 'List upcoming and past deadlines (Role-Scoped)' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query('clientId') clientId?: string,
    @Query('status') status?: DeadlineStatus,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.deadlinesService.findAll(user, { clientId, status, from, to });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deadline details by CUID' })
  @ApiParam({ name: 'id', description: 'Deadline CUID' })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deadlinesService.findOne(id, user);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA, UserRole.ASSOCIATE)
  @ApiOperation({ summary: 'Update deadline status' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: DeadlineStatus,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.deadlinesService.updateStatus(id, status, user);
  }

  @Post('trigger-scan')
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA)
  @ApiOperation({ summary: 'Manually trigger deadline scan and reminder queue' })
  triggerScan(@CurrentUser() user: AuthenticatedUser) {
    return this.deadlinesService.triggerScan(user);
  }
}
