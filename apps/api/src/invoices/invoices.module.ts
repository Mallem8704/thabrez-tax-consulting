import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { RazorpayService } from './razorpay.service';
import { InvoicePdfService } from './invoice-pdf.service';

@Module({
  controllers: [InvoicesController],
  providers: [InvoicesService, RazorpayService, InvoicePdfService],
  exports: [InvoicesService, RazorpayService, InvoicePdfService],
})
export class InvoicesModule {}
