import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';

@ApiTags('messages')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @ApiOperation({ summary: 'Post a case-scoped message (Client owner or assigned staff only)' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  create(
    @Body() dto: CreateMessageDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.messagesService.create(dto, user);
  }

  @Get('case/:caseId')
  @ApiOperation({ summary: 'List threaded messages for a case' })
  @ApiParam({ name: 'caseId', description: 'Case CUID' })
  findByCaseId(
    @Param('caseId') caseId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.messagesService.findByCaseId(caseId, user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a message (Sender or Admin only)' })
  @ApiParam({ name: 'id', description: 'Message CUID' })
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.messagesService.remove(id, user);
  }
}
