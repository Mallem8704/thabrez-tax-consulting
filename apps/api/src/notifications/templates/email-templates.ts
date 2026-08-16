export interface DeadlineReminderEmailParams {
  to: string;
  clientName: string;
  serviceType: string;
  dueDate: string;
  daysRemaining: number;
  portalUrl: string;
}

export interface CaseStatusChangedEmailParams {
  to: string;
  clientName: string;
  caseId: string;
  serviceType: string;
  oldStatus: string;
  newStatus: string;
  portalUrl: string;
}

export interface InvoiceIssuedEmailParams {
  to: string;
  clientName: string;
  invoiceId: string;
  amount: string;
  dueDate: string;
  paymentUrl: string;
}

export interface WelcomeClientEmailParams {
  to: string;
  clientName: string;
  loginUrl: string;
}

/**
 * Responsive HTML and Plaintext email templates for Thabrez Tax Consulting
 */
export const EmailTemplates = {
  deadlineReminder(params: DeadlineReminderEmailParams): { subject: string; html: string; text: string } {
    const urgencyColor = params.daysRemaining <= 1 ? '#dc2626' : params.daysRemaining <= 3 ? '#ea580c' : '#2563eb';
    const urgencyLabel = params.daysRemaining <= 1 ? 'URGENT: 1 Day Left' : `${params.daysRemaining} Days Remaining`;

    const subject = `[Action Required] Compliance Filing Deadline: ${params.serviceType} (${urgencyLabel})`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 24px;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e4e4e7; overflow: hidden;">
          <tr style="background-color: #09090b; color: #ffffff;">
            <td style="padding: 24px 32px;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">THABREZ & CO.</h1>
              <p style="margin: 4px 0 0 0; font-size: 13px; color: #a1a1aa;">Chartered Accountants & Tax Consultants</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="font-size: 15px; color: #3f3f46; margin: 0 0 16px 0;">Dear <strong>${params.clientName}</strong>,</p>
              <p style="font-size: 15px; color: #3f3f46; line-height: 1.5; margin: 0 0 24px 0;">
                This is a scheduled compliance notification regarding your upcoming statutory tax deadline for <strong>${params.serviceType}</strong>.
              </p>
              
              <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-left: 4px solid ${urgencyColor}; border-radius: 6px; padding: 16px 20px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-size: 13px; color: #71717a; text-transform: uppercase; font-weight: 600;">Obligation</span>
                  <strong style="font-size: 14px; color: #09090b;">${params.serviceType}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="font-size: 13px; color: #71717a; text-transform: uppercase; font-weight: 600;">Statutory Due Date</span>
                  <strong style="font-size: 14px; color: ${urgencyColor};">${params.dueDate}</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="font-size: 13px; color: #71717a; text-transform: uppercase; font-weight: 600;">Status</span>
                  <span style="font-size: 12px; font-weight: 700; color: #ffffff; background-color: ${urgencyColor}; padding: 2px 8px; border-radius: 4px;">${urgencyLabel}</span>
                </div>
              </div>

              <p style="font-size: 14px; color: #52525b; line-height: 1.5; margin: 0 0 24px 0;">
                To ensure timely filing and prevent late fees or interest penalties, please log in to your Client Portal and confirm all requested documents are uploaded.
              </p>

              <div style="text-align: center; margin: 32px 0;">
                <a href="${params.portalUrl}" style="background-color: #09090b; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 6px; font-size: 14px; font-weight: 600; display: inline-block;">View Filing in Client Portal</a>
              </div>

              <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 24px 0;" />
              <p style="font-size: 12px; color: #a1a1aa; margin: 0; line-height: 1.4;">
                Need assistance? Reply directly to this email or message your assigned Chartered Accountant inside the portal.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    const text = `
THABREZ & CO. — COMPLIANCE DEADLINE REMINDER
--------------------------------------------
Dear ${params.clientName},

This is an automated compliance notification for ${params.serviceType}.

- Service: ${params.serviceType}
- Statutory Due Date: ${params.dueDate}
- Time Remaining: ${urgencyLabel}

Please review your filing status and upload any pending documents at:
${params.portalUrl}

Thank you,
Thabrez & Co. Chartered Accountants
    `.trim();

    return { subject, html, text };
  },

  caseStatusChanged(params: CaseStatusChangedEmailParams): { subject: string; html: string; text: string } {
    const subject = `Update on your case: ${params.serviceType} is now ${params.newStatus}`;

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background-color: #f4f4f5; margin: 0; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 32px; border: 1px solid #e4e4e7;">
    <h2 style="margin-top: 0; color: #09090b;">Filing Status Updated</h2>
    <p>Dear <strong>${params.clientName}</strong>,</p>
    <p>Your case for <strong>${params.serviceType}</strong> has been updated:</p>
    <p style="background: #f4f4f5; padding: 12px; border-radius: 6px; font-size: 15px;">
      Status: <strike style="color: #71717a;">${params.oldStatus}</strike> &rarr; <strong style="color: #16a34a;">${params.newStatus}</strong>
    </p>
    <p><a href="${params.portalUrl}" style="display: inline-block; background: #09090b; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 600;">Open Case Details</a></p>
  </div>
</body>
</html>
    `.trim();

    const text = `
Dear ${params.clientName},
Your case for ${params.serviceType} has changed status from ${params.oldStatus} to ${params.newStatus}.
View details at: ${params.portalUrl}
    `.trim();

    return { subject, html, text };
  },

  invoiceIssued(params: InvoiceIssuedEmailParams): { subject: string; html: string; text: string } {
    const subject = `New Invoice Issued: INR ${params.amount} (Due: ${params.dueDate})`;

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background-color: #f4f4f5; margin: 0; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 32px; border: 1px solid #e4e4e7;">
    <h2 style="margin-top: 0; color: #09090b;">Invoice Issued</h2>
    <p>Dear <strong>${params.clientName}</strong>,</p>
    <p>A new tax consultation / filing invoice has been generated for your account.</p>
    <p><strong>Amount:</strong> ₹${params.amount}<br><strong>Due Date:</strong> ${params.dueDate}</p>
    <p><a href="${params.paymentUrl}" style="display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Pay Invoice Online (Razorpay)</a></p>
  </div>
</body>
</html>
    `.trim();

    const text = `
Dear ${params.clientName},
A new invoice of INR ${params.amount} has been generated, due by ${params.dueDate}.
Pay online securely at: ${params.paymentUrl}
    `.trim();

    return { subject, html, text };
  },

  welcomeClient(params: WelcomeClientEmailParams): { subject: string; html: string; text: string } {
    const subject = `Welcome to Thabrez & Co. Tax Consultancy — Client Portal Access`;

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family: sans-serif; background-color: #f4f4f5; margin: 0; padding: 24px;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 32px; border: 1px solid #e4e4e7;">
    <h2 style="margin-top: 0; color: #09090b;">Welcome to Thabrez & Co.</h2>
    <p>Dear <strong>${params.clientName}</strong>,</p>
    <p>Your client portal account is ready. You can securely upload financial documents, monitor case filings, and track statutory deadlines.</p>
    <p><a href="${params.loginUrl}" style="display: inline-block; background: #09090b; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Log In to Client Portal</a></p>
  </div>
</body>
</html>
    `.trim();

    const text = `
Dear ${params.clientName},
Welcome to Thabrez & Co.! Your client portal account is active.
Log in at: ${params.loginUrl}
    `.trim();

    return { subject, html, text };
  },
};
