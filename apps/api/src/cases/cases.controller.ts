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
  ApiResponse,
} from '@nestjs/swagger';
import { UserRole } from '@thabrez/db';

import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseStatusDto } from './dto/update-case-status.dto';
import { AssignCaseDto } from './dto/assign-case.dto';
import { QueryCasesDto } from './dto/query-cases.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@ApiTags('cases')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('cases')
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  @ApiOperation({
    summary: 'List filing cases (Paginated & Role Scoped)',
    description:
      'CLIENT: strictly limited to own client cases\nASSOCIATE: limited to cases assigned to them or their assigned clients\nADMIN / SENIOR_CA / FRONT_DESK: all cases matching filter criteria',
  })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryCasesDto,
  ) {
    return this.casesService.findAll(user, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get filing case details by CUID' })
  @ApiParam({ name: 'id', description: 'Case CUID' })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.casesService.findOne(id, user);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new filing case (Auto-generates compliance deadline record)',
  })
  @ApiResponse({ status: 201, description: 'Case created and statutory deadline scheduled' })
  create(
    @Body() dto: CreateCaseDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.casesService.create(dto, user);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA, UserRole.ASSOCIATE, UserRole.FRONT_DESK)
  @ApiOperation({
    summary: 'Update case filing status (Emits an immutable AuditLog entry)',
  })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateCaseStatusDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.casesService.updateStatus(id, dto, user);
  }

  @Patch(':id/assign')
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA)
  @ApiOperation({ summary: 'Assign or reassign filing case to staff member' })
  assignTo(
    @Param('id') id: string,
    @Body() dto: AssignCaseDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.casesService.assignTo(id, dto, user);
  }
}
