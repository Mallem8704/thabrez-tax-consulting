import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export interface InvoicePdfData {
  invoiceNumber: string;
  issuedAt: string;
  dueDate: string;
  status: string;
  clientName: string;
  companyName?: string | null;
  clientPan?: string | null;
  clientGstin?: string | null;
  lineItems: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }>;
  totalAmount: number;
  notes?: string | null;
}

@Injectable()
export class InvoicePdfService {
  /**
   * Generates a PDF Tax Invoice with Thabrez & Co. firm letterhead.
   */
  async generateInvoicePdf(data: InvoicePdfData): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions in points
    const { width, height } = page.getSize();

    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const primaryColor = rgb(0.04, 0.04, 0.05); // #09090b
    const textMuted = rgb(0.44, 0.44, 0.48); // #71717a
    const borderMuted = rgb(0.89, 0.89, 0.91); // #e4e4e7
    const accentBlue = rgb(0.15, 0.39, 0.92); // #2563eb

    // --- 1. FIRM LETTERHEAD ---
    // Top banner background
    page.drawRectangle({
      x: 0,
      y: height - 100,
      width: width,
      height: 100,
      color: primaryColor,
    });

    page.drawText('THABREZ & CO.', {
      x: 40,
      y: height - 45,
      size: 22,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText('CHARTERED ACCOUNTANTS & TAX CONSULTANCY', {
      x: 40,
      y: height - 62,
      size: 9,
      font: fontBold,
      color: rgb(0.8, 0.8, 0.8),
    });

    page.drawText('ICAI Reg: 123456W  |  GSTIN: 27AABCT1234F1Z5  |  PAN: AABCT1234F', {
      x: 40,
      y: height - 78,
      size: 8,
      font: fontRegular,
      color: rgb(0.65, 0.65, 0.7),
    });

    // Top Right Header: TAX INVOICE
    page.drawText('TAX INVOICE', {
      x: width - 160,
      y: height - 45,
      size: 16,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    page.drawText(`Status: ${data.status.toUpperCase()}`, {
      x: width - 160,
      y: height - 65,
      size: 10,
      font: fontBold,
      color: data.status === 'PAID' ? rgb(0.2, 0.8, 0.3) : rgb(0.9, 0.7, 0.2),
    });

    // --- 2. INVOICE & CLIENT METADATA ---
    const metaY = height - 135;

    // Left Column: Bill To
    page.drawText('BILLED TO:', {
      x: 40,
      y: metaY,
      size: 9,
      font: fontBold,
      color: textMuted,
    });

    page.drawText(data.companyName || data.clientName, {
      x: 40,
      y: metaY - 16,
      size: 12,
      font: fontBold,
      color: primaryColor,
    });

    if (data.clientName && data.companyName) {
      page.drawText(`Attn: ${data.clientName}`, {
        x: 40,
        y: metaY - 30,
        size: 9,
        font: fontRegular,
        color: textMuted,
      });
    }

    if (data.clientPan) {
      page.drawText(`PAN: ${data.clientPan}`, {
        x: 40,
        y: metaY - 44,
        size: 9,
        font: fontRegular,
        color: textMuted,
      });
    }

    if (data.clientGstin) {
      page.drawText(`GSTIN: ${data.clientGstin}`, {
        x: 40,
        y: metaY - 58,
        size: 9,
        font: fontRegular,
        color: textMuted,
      });
    }

    // Right Column: Invoice Details
    page.drawText(`Invoice No: ${data.invoiceNumber}`, {
      x: width - 200,
      y: metaY,
      size: 10,
      font: fontBold,
      color: primaryColor,
    });

    page.drawText(`Date of Issue: ${data.issuedAt}`, {
      x: width - 200,
      y: metaY - 16,
      size: 9,
      font: fontRegular,
      color: textMuted,
    });

    page.drawText(`Due Date: ${data.dueDate}`, {
      x: width - 200,
      y: metaY - 32,
      size: 9,
      font: fontRegular,
      color: textMuted,
    });

    // Divider
    page.drawLine({
      start: { x: 40, y: metaY - 75 },
      end: { x: width - 40, y: metaY - 75 },
      thickness: 1,
      color: borderMuted,
    });

    // --- 3. LINE ITEMS TABLE ---
    const tableHeaderY = metaY - 95;

    // Table Header Bar
    page.drawRectangle({
      x: 40,
      y: tableHeaderY - 5,
      width: width - 80,
      height: 22,
      color: rgb(0.96, 0.96, 0.96),
    });

    page.drawText('S.NO', { x: 50, y: tableHeaderY + 2, size: 8, font: fontBold, color: primaryColor });
    page.drawText('DESCRIPTION OF SERVICES', { x: 90, y: tableHeaderY + 2, size: 8, font: fontBold, color: primaryColor });
    page.drawText('QTY', { x: 370, y: tableHeaderY + 2, size: 8, font: fontBold, color: primaryColor });
    page.drawText('RATE (INR)', { x: 420, y: tableHeaderY + 2, size: 8, font: fontBold, color: primaryColor });
    page.drawText('AMOUNT (INR)', { x: 495, y: tableHeaderY + 2, size: 8, font: fontBold, color: primaryColor });

    let currentY = tableHeaderY - 25;
    const subtotal = data.lineItems.reduce((sum, item) => sum + item.amount, 0);

    data.lineItems.forEach((item, index) => {
      page.drawText(`${index + 1}`, { x: 55, y: currentY, size: 9, font: fontRegular, color: primaryColor });
      page.drawText(item.description.substring(0, 45), { x: 90, y: currentY, size: 9, font: fontRegular, color: primaryColor });
      page.drawText(`${item.quantity}`, { x: 375, y: currentY, size: 9, font: fontRegular, color: primaryColor });
      page.drawText(`INR ${item.unitPrice.toLocaleString('en-IN')}`, { x: 420, y: currentY, size: 9, font: fontRegular, color: primaryColor });
      page.drawText(`INR ${item.amount.toLocaleString('en-IN')}`, { x: 495, y: currentY, size: 9, font: fontBold, color: primaryColor });

      page.drawLine({
        start: { x: 40, y: currentY - 8 },
        end: { x: width - 40, y: currentY - 8 },
        thickness: 0.5,
        color: borderMuted,
      });

      currentY -= 22;
    });

    // --- 4. TOTALS & TAX BREAKDOWN ---
    const gstRate = 0.18;
    const isTaxIncluded = Math.round(subtotal * 1.18) === Math.round(data.totalAmount);
    const taxableBase = isTaxIncluded ? subtotal : data.totalAmount / 1.18;
    const cgst = taxableBase * 0.09;
    const sgst = taxableBase * 0.09;

    currentY -= 15;

    page.drawText('Subtotal:', { x: 380, y: currentY, size: 9, font: fontRegular, color: textMuted });
    page.drawText(`INR ${taxableBase.toFixed(2)}`, { x: 490, y: currentY, size: 9, font: fontRegular, color: primaryColor });

    currentY -= 16;
    page.drawText('CGST @ 9%:', { x: 380, y: currentY, size: 9, font: fontRegular, color: textMuted });
    page.drawText(`INR ${cgst.toFixed(2)}`, { x: 490, y: currentY, size: 9, font: fontRegular, color: primaryColor });

    currentY -= 16;
    page.drawText('SGST @ 9%:', { x: 380, y: currentY, size: 9, font: fontRegular, color: textMuted });
    page.drawText(`INR ${sgst.toFixed(2)}`, { x: 490, y: currentY, size: 9, font: fontRegular, color: primaryColor });

    currentY -= 22;
    page.drawRectangle({
      x: 370,
      y: currentY - 6,
      width: width - 410,
      height: 24,
      color: primaryColor,
    });

    page.drawText('GRAND TOTAL (INR):', { x: 380, y: currentY + 2, size: 9, font: fontBold, color: rgb(1, 1, 1) });
    page.drawText(`INR ${data.totalAmount.toLocaleString('en-IN')}`, {
      x: 485,
      y: currentY + 2,
      size: 11,
      font: fontBold,
      color: rgb(1, 1, 1),
    });

    // --- 5. BANK PAYMENT & SIGNATURE FOOTER ---
    const footerY = 120;

    page.drawRectangle({
      x: 40,
      y: footerY - 40,
      width: 250,
      height: 70,
      color: rgb(0.97, 0.97, 0.98),
      borderColor: borderMuted,
      borderWidth: 1,
    });

    page.drawText('BANK TRANSFER DETAILS:', { x: 50, y: footerY + 16, size: 8, font: fontBold, color: primaryColor });
    page.drawText('Bank: HDFC Bank Ltd. (Fort Branch)', { x: 50, y: footerY + 2, size: 8, font: fontRegular, color: textMuted });
    page.drawText('A/C No: 50200012345678', { x: 50, y: footerY - 10, size: 8, font: fontRegular, color: textMuted });
    page.drawText('IFSC Code: HDFC0000060  |  UPI: thabrez@hdfcbank', { x: 50, y: footerY - 22, size: 8, font: fontRegular, color: textMuted });

    // Right: Authorized Signatory
    page.drawText('For THABREZ & CO.', { x: width - 180, y: footerY + 16, size: 9, font: fontBold, color: primaryColor });
    page.drawText('[Digitally Signed via Client Portal]', { x: width - 180, y: footerY - 10, size: 8, font: fontRegular, color: textMuted });
    page.drawText('Authorised Signatory', { x: width - 180, y: footerY - 26, size: 8, font: fontBold, color: primaryColor });

    // Bottom note
    page.drawText('Thank you for your business. This is a computer-generated tax invoice valid under Rule 48 of CGST Rules 2017.', {
      x: 40,
      y: 35,
      size: 7.5,
      font: fontRegular,
      color: textMuted,
    });

    return pdfDoc.save();
  }
}
