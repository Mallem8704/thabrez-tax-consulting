/**
 * packages/db/prisma/seed.ts
 *
 * Seeds the local development database with:
 *  - 1 ADMIN user
 *  - 1 SENIOR_CA user
 *  - 3 CLIENT users with linked Client profiles, Cases, Deadlines, and Invoices
 *
 * Run via: pnpm db:seed   (from repo root)
 *       or: pnpm --filter @thabrez/db db:seed
 */

import { PrismaClient, UserRole, EntityType, ServiceType, CaseStatus, DeadlineType, DeadlineStatus, InvoiceStatus, LeadStatus, ResourceType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient({ log: ['warn', 'error'] });

const SALT_ROUNDS = 10;

async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function main(): Promise<void> {
  console.log('🌱 Starting seed…');

  // ─── 1. ADMIN ──────────────────────────────────────────────────────────────
  const adminUser = await db.user.upsert({
    where: { email: 'admin@thabrez.com' },
    update: {},
    create: {
      email: 'admin@thabrez.com',
      phone: '9000000001',
      passwordHash: await hash('Admin@1234'),
      role: UserRole.ADMIN,
      mfaEnabled: false,
    },
  });
  console.log(`  ✓ Admin user: ${adminUser.email}`);

  // ─── 2. SENIOR CA ──────────────────────────────────────────────────────────
  const caUser = await db.user.upsert({
    where: { email: 'priya.ca@thabrez.com' },
    update: {},
    create: {
      email: 'priya.ca@thabrez.com',
      phone: '9000000002',
      passwordHash: await hash('CA@1234'),
      role: UserRole.SENIOR_CA,
      mfaEnabled: false,
    },
  });
  console.log(`  ✓ Senior CA: ${caUser.email}`);

  // ─── 3. CLIENT 1 — Rajan Mehta (Individual, ITR + TDS) ────────────────────
  const client1User = await db.user.upsert({
    where: { email: 'rajan.mehta@example.com' },
    update: {},
    create: {
      email: 'rajan.mehta@example.com',
      phone: '9876543210',
      passwordHash: await hash('Client@1234'),
      role: UserRole.CLIENT,
    },
  });

  const client1 = await db.client.upsert({
    where: { userId: client1User.id },
    update: {},
    create: {
      userId: client1User.id,
      pan: 'ABCPM1234F',
      entityType: EntityType.INDIVIDUAL,
      assignedCaId: caUser.id,
    },
  });
  console.log(`  ✓ Client 1: Rajan Mehta (${client1.id})`);

  const case1a = await db.case.create({
    data: {
      clientId: client1.id,
      serviceType: ServiceType.ITR_FILING,
      status: CaseStatus.IN_REVIEW,
      assignedToId: caUser.id,
      dueDate: new Date('2025-07-31'),
    },
  });

  const case1b = await db.case.create({
    data: {
      clientId: client1.id,
      serviceType: ServiceType.TDS_FILING,
      status: CaseStatus.RECEIVED,
      assignedToId: caUser.id,
      dueDate: new Date('2025-07-15'),
    },
  });

  // Deadlines for client 1
  await db.deadline.createMany({
    data: [
      {
        clientId: client1.id,
        caseId: case1a.id,
        type: DeadlineType.ITR_FILING,
        dueDate: new Date('2025-07-31'),
        status: DeadlineStatus.PENDING,
      },
      {
        clientId: client1.id,
        caseId: case1b.id,
        type: DeadlineType.TDS_FILING,
        dueDate: new Date('2025-07-15'),
        status: DeadlineStatus.REMINDED,
        reminderSentAt: new Date(),
      },
    ],
  });

  // Invoice for client 1
  await db.invoice.create({
    data: {
      clientId: client1.id,
      caseId: case1a.id,
      amount: 5000.00,
      status: InvoiceStatus.SENT,
      issuedAt: new Date(),
    },
  });

  // ─── 4. CLIENT 2 — Patel Enterprises (Partnership, GST + Bookkeeping) ──────
  const client2User = await db.user.upsert({
    where: { email: 'accounts@patelenterprises.example.com' },
    update: {},
    create: {
      email: 'accounts@patelenterprises.example.com',
      phone: '9876543211',
      passwordHash: await hash('Client@1234'),
      role: UserRole.CLIENT,
    },
  });

  const client2 = await db.client.upsert({
    where: { userId: client2User.id },
    update: {},
    create: {
      userId: client2User.id,
      companyName: 'Patel Enterprises',
      pan: 'AABFP5362F',
      gstin: '24AABFP5362F1ZQ',
      entityType: EntityType.PARTNERSHIP,
      assignedCaId: caUser.id,
    },
  });
  console.log(`  ✓ Client 2: Patel Enterprises (${client2.id})`);

  const case2a = await db.case.create({
    data: {
      clientId: client2.id,
      serviceType: ServiceType.GST_FILING,
      status: CaseStatus.FILED,
      assignedToId: caUser.id,
      dueDate: new Date('2025-08-20'),
    },
  });

  const case2b = await db.case.create({
    data: {
      clientId: client2.id,
      serviceType: ServiceType.BOOKKEEPING,
      status: CaseStatus.IN_REVIEW,
      assignedToId: caUser.id,
    },
  });

  await db.deadline.create({
    data: {
      clientId: client2.id,
      caseId: case2a.id,
      type: DeadlineType.GST_FILING,
      dueDate: new Date('2025-08-20'),
      status: DeadlineStatus.COMPLETED,
    },
  });

  await db.invoice.create({
    data: {
      clientId: client2.id,
      caseId: case2a.id,
      amount: 3000.00,
      status: InvoiceStatus.PAID,
      issuedAt: new Date('2025-08-01'),
      paidAt: new Date('2025-08-05'),
    },
  });

  await db.invoice.create({
    data: {
      clientId: client2.id,
      caseId: case2b.id,
      amount: 8000.00,
      status: InvoiceStatus.DRAFT,
    },
  });

  // ─── 5. CLIENT 3 — TechStart Pvt Ltd (ROC + TDS) ──────────────────────────
  const client3User = await db.user.upsert({
    where: { email: 'cfo@techstart.example.com' },
    update: {},
    create: {
      email: 'cfo@techstart.example.com',
      phone: '9876543212',
      passwordHash: await hash('Client@1234'),
      role: UserRole.CLIENT,
    },
  });

  const client3 = await db.client.upsert({
    where: { userId: client3User.id },
    update: {},
    create: {
      userId: client3User.id,
      companyName: 'TechStart Private Limited',
      pan: 'AACTS1234D',
      gstin: '29AACTS1234D1ZK',
      entityType: EntityType.PVT_LTD,
      assignedCaId: caUser.id,
    },
  });
  console.log(`  ✓ Client 3: TechStart Private Limited (${client3.id})`);

  const case3a = await db.case.create({
    data: {
      clientId: client3.id,
      serviceType: ServiceType.ROC_ANNUAL_COMPLIANCE,
      status: CaseStatus.RECEIVED,
      assignedToId: caUser.id,
      dueDate: new Date('2025-09-30'),
    },
  });

  const case3b = await db.case.create({
    data: {
      clientId: client3.id,
      serviceType: ServiceType.TDS_FILING,
      status: CaseStatus.IN_REVIEW,
      assignedToId: caUser.id,
      dueDate: new Date('2025-07-15'),
    },
  });

  await db.deadline.createMany({
    data: [
      {
        clientId: client3.id,
        caseId: case3a.id,
        type: DeadlineType.ROC_ANNUAL_COMPLIANCE,
        dueDate: new Date('2025-09-30'),
        status: DeadlineStatus.PENDING,
      },
      {
        clientId: client3.id,
        caseId: case3b.id,
        type: DeadlineType.TDS_FILING,
        dueDate: new Date('2025-07-15'),
        status: DeadlineStatus.OVERDUE,
      },
    ],
  });

  await db.invoice.create({
    data: {
      clientId: client3.id,
      caseId: case3a.id,
      amount: 15000.00,
      status: InvoiceStatus.SENT,
      issuedAt: new Date(),
    },
  });

  // ─── 6. Seed messages on case 1a ───────────────────────────────────────────
  await db.message.createMany({
    data: [
      {
        caseId: case1a.id,
        senderId: caUser.id,
        body: 'Hello Rajan, we have received your ITR documents. Please share your Form 16 as well.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        caseId: case1a.id,
        senderId: client1User.id,
        body: 'Sure, I will email the Form 16 today. Thanks!',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      },
    ],
  });

  // ─── 7. Sample leads ───────────────────────────────────────────────────────
  await db.lead.createMany({
    data: [
      {
        name: 'Arjun Sharma',
        phone: '9123456780',
        email: 'arjun.sharma@example.com',
        serviceInterest: 'GST_FILING',
        source: 'contact_form',
        status: LeadStatus.NEW,
      },
      {
        name: 'Sunita Agarwal',
        phone: '9123456781',
        serviceInterest: 'COMPANY_REGISTRATION',
        source: 'google_ads',
        status: LeadStatus.CONTACTED,
      },
    ],
  });

  // ─── 8. Sample resources ───────────────────────────────────────────────────
  await db.resource.createMany({
    data: [
      {
        type: ResourceType.ACT,
        title: 'Income Tax Act, 1961',
        category: 'Income Tax',
        bodyOrFileUrl: 'https://www.incometaxindia.gov.in/pages/acts/income-tax-act.aspx',
      },
      {
        type: ResourceType.FORM,
        title: 'ITR-1 (Sahaj) — AY 2024-25',
        category: 'Income Tax',
        bodyOrFileUrl: 'https://www.incometaxindia.gov.in/Forms/income-tax%20rules/ITR1_AY2024-25.pdf',
      },
      {
        type: ResourceType.CIRCULAR,
        title: 'GST Circular No. 207/2023 — Clarification on ITC',
        category: 'GST',
        bodyOrFileUrl: null,
      },
    ],
  });

  // ─── 9. Audit log entries ──────────────────────────────────────────────────
  await db.auditLog.createMany({
    data: [
      {
        actorId: adminUser.id,
        action: 'USER_CREATED',
        entity: 'User',
        entityId: caUser.id,
        metadata: { role: 'SENIOR_CA', createdBy: 'seed' },
      },
      {
        actorId: caUser.id,
        action: 'CASE_STATUS_CHANGE',
        entity: 'Case',
        entityId: case1a.id,
        metadata: { from: 'RECEIVED', to: 'IN_REVIEW' },
      },
    ],
  });

  console.log('\n✅ Seed complete.');
  console.log('\n📋 Login credentials (development only):');
  console.log('   Admin  → admin@thabrez.com       / Admin@1234');
  console.log('   CA     → priya.ca@thabrez.com    / CA@1234');
  console.log('   Client → rajan.mehta@example.com / Client@1234');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
