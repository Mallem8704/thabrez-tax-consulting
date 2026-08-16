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

import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { QueryClientsDto } from './dto/query-clients.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({
    summary: 'List clients (Paginated & Role Scoped)',
    description:
      'CLIENT: sees own profile\nASSOCIATE: sees assigned clients only\nADMIN / SENIOR_CA / FRONT_DESK: sees all matching clients',
  })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryClientsDto,
  ) {
    return this.clientsService.findAll(user, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client details and recent cases by CUID' })
  @ApiParam({ name: 'id', description: 'Client CUID' })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.clientsService.findOne(id, user);
  }

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA)
  @ApiOperation({ summary: 'Create a new client and portal login (Admin / Senior CA only)' })
  @ApiResponse({ status: 201, description: 'Client successfully created' })
  create(
    @Body() dto: CreateClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientsService.create(dto, user);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA, UserRole.ASSOCIATE, UserRole.CLIENT)
  @ApiOperation({ summary: 'Update client details (Clients update contact details; Associates update assigned)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateClientDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientsService.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA)
  @ApiOperation({ summary: 'Delete a client profile (Admin / Senior CA only)' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.clientsService.remove(id, user);
  }

  @Patch(':id/assign-ca')
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA)
  @ApiOperation({ summary: 'Assign / reassign Chartered Accountant to a client' })
  assignCa(
    @Param('id') id: string,
    @Body('caId') caId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.clientsService.assignCa(id, caId, user);
  }
}
