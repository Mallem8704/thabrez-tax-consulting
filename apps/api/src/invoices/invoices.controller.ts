import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Headers,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { UserRole } from '@thabrez/db';

import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { QueryInvoicesDto } from './dto/query-invoices.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, type AuthenticatedUser } from '../auth/decorators/current-user.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'List invoices (Role-Scoped & Paginated)' })
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryInvoicesDto,
  ) {
    return this.invoicesService.findAll(user, query);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get invoice details' })
  @ApiParam({ name: 'id', description: 'Invoice CUID' })
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.invoicesService.findOne(id, user);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA, UserRole.ASSOCIATE)
  @ApiOperation({ summary: 'Create a draft invoice with itemized line items' })
  @ApiResponse({ status: 201, description: 'Draft invoice created' })
  create(
    @Body() dto: CreateInvoiceDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.invoicesService.create(dto, user);
  }

  @Post(':id/send')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SENIOR_CA, UserRole.ASSOCIATE)
  @ApiOperation({ summary: 'Transition invoice from DRAFT to SENT and email client payment link' })
  sendInvoice(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.invoicesService.sendInvoice(id, user);
  }

  @Post(':id/razorpay-order')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create Razorpay order for online checkout' })
  createRazorpayOrder(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.invoicesService.createRazorpayOrder(id, user);
  }

  @Post('webhook/razorpay')
  @SkipThrottle() // Razorpay may burst-send webhook events; protected by HMAC-SHA256 instead
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Razorpay Webhook listener (Verifies HMAC SHA-256 signature)' })
  async handleRazorpayWebhook(
    @Headers('x-razorpay-signature') signature: string,
    @Req() req: Request,
    @Body() body: unknown,
  ) {
    const rawBody = typeof body === 'string' ? body : JSON.stringify(body);
    return this.invoicesService.handleRazorpayWebhook(rawBody, signature);
  }

  @Get(':id/pdf')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Download PDF Tax Invoice with firm letterhead' })
  async downloadInvoicePdf(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Res() res: Response,
  ) {
    const pdfBytes = await this.invoicesService.getInvoicePdf(id, user);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Invoice_${id.substring(0, 8)}.pdf"`,
    );
    res.setHeader('Content-Length', pdfBytes.length);
    res.end(Buffer.from(pdfBytes));
  }
}
