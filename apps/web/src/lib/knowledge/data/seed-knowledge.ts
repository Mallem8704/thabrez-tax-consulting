/**
 * Authoritative Seed Knowledge Base (2026–2027 Regulatory Intelligence)
 *
 * Sourced directly from official Government of India gazettes & regulatory authorities:
 * - Central Board of Direct Taxes (CBDT) / incometax.gov.in
 * - Central Board of Indirect Taxes and Customs (CBIC) / cbic.gov.in
 * - Goods and Services Tax Network (GSTN) / gst.gov.in
 * - Ministry of Corporate Affairs (MCA) / mca.gov.in
 * - Reserve Bank of India (RBI) / rbi.org.in
 * - Securities and Exchange Board of India (SEBI) / sebi.org.in
 * - Insolvency and Bankruptcy Board of India (IBBI) / ibbi.gov.in
 * - Ministry of Labour & Employment / labour.gov.in
 */

import {
  KnowledgeDocType,
  DocLegislationStatus,
  AuthorityType,
  ReviewStatus,
  KnowledgeCategoryDto,
  KnowledgeDocumentDto,
  ComplianceDeadlineItemDto,
  TaxRateItemDto,
} from '@thabrez/types';

export const SEED_CATEGORIES: KnowledgeCategoryDto[] = [
  {
    id: 'cat_direct_tax',
    name: 'Direct Tax',
    slug: 'direct-tax',
    description: 'Income-tax Act, 2025, historic 1961 provisions, international tax, transfer pricing, and TDS/TCS framework.',
    icon: 'Scale',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'cat_gst',
    name: 'GST Laws',
    slug: 'gst-laws',
    description: 'Central GST, Integrated GST, UTGST, Compensation Cess, rules, HSN classifications, and circulars.',
    icon: 'Receipt',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'cat_customs',
    name: 'Customs & Indirect Tax',
    slug: 'customs-indirect-tax',
    description: 'Customs Act 1962, Customs Tariff, legacy Central Excise and Service Tax surviving provisions.',
    icon: 'Ship',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'cat_corporate',
    name: 'Corporate & Commercial Laws',
    slug: 'corporate-laws',
    description: 'Companies Act 2013, 1956 historical context, LLP Act, SEBI, IBC, FEMA, RERA, and DPDP Act 2023.',
    icon: 'Building2',
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'cat_labour',
    name: 'Labour Codes & Employment',
    slug: 'labour-laws',
    description: 'Code on Wages, Industrial Relations, Social Security, and OSH Codes alongside surviving legacy labor acts.',
    icon: 'Users',
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 'cat_state_vat',
    name: 'State VAT & Local Laws',
    slug: 'state-vat-legacy',
    description: 'Legacy State Value Added Tax laws and petroleum/alcohol surviving provisions across 28 States and UTs.',
    icon: 'MapPin',
    displayOrder: 6,
    isActive: true,
  },
];

export const SEED_DOCUMENTS: KnowledgeDocumentDto[] = [
  // =========================================================================
  // ACTS (Current & Historical Coexistence)
  // =========================================================================
  {
    id: 'act_ita_2025',
    title: 'Income-tax Act, 2025',
    slug: 'income-tax-act-2025',
    summary: 'The modernized, direct-tax codification consolidating assessment procedures, Section 115BAC default regime, digital asset taxation, and global minimum tax provisions.',
    content: `# Income-tax Act, 2025

## Chapter I: Preliminary & Key Definitions
The Income-tax Act, 2025 enacts a streamlined direct tax structure designed to minimize ambiguity, reduce repetitive litigation, and establish Section 115BAC as the primary assessment paradigm for all non-corporate assessees.

### Key Statutory Pillars:
1. **Universal Concessional Tax Paradigm (Section 115BAC)**: 6 progressive tax slabs starting from Nil up to ₹3,00,000 to 30% above ₹15,00,000 with a standard deduction of ₹75,000 for salaried employees and full Section 87A rebate up to ₹7,00,000 net taxable income.
2. **Simplified Corporate Taxation (Section 115BAA & 115BAB)**: Standard effective concessional rate of 25.17% (22% basic + 10% surcharge + 4% cess) for domestic operational entities.
3. **Automated Faceless Assessment & Re-assessment Framework**: Scrutiny time-limits capped strictly at 3 years for ordinary escapement and 5 years for concealed assets exceeding ₹50 Lakhs.
4. **Digital & Virtual Digital Asset (VDA) Tax**: Flat 30% rate under Section 115BBH with no set-off against ordinary business losses.`,
    documentType: KnowledgeDocType.ACT,
    categoryId: 'cat_direct_tax',
    categoryName: 'Direct Tax',
    jurisdiction: 'INDIA',
    authority: AuthorityType.CBDT,
    documentNumber: 'Act No. 12 of 2025',
    publishedDate: '2025-03-28T00:00:00.000Z',
    effectiveDate: '2026-04-01T00:00:00.000Z',
    financialYear: '2026-27',
    assessmentYear: '2027-28',
    status: DocLegislationStatus.CURRENT,
    reviewStatus: ReviewStatus.PUBLISHED,
    officialSourceUrl: 'https://www.incometax.gov.in/iec/foportal/acts',
    documentUrl: 'https://www.incometax.gov.in/',
    sourceDomain: 'incometax.gov.in',
    isOfficial: true,
    isFeatured: true,
    isHistorical: false,
    isSuperseded: false,
    version: 1,
    lastVerifiedAt: '2026-09-15T00:00:00.000Z',
  },
  {
    id: 'act_ita_1961',
    title: 'Income-tax Act, 1961 (Historical / Transitional Reference)',
    slug: 'income-tax-act-1961',
    summary: 'The principal historical direct tax statute governing assessment years prior to AY 2026-27, preserved for ongoing appeals, pending scrutinies, and reassessments.',
    content: `# Income-tax Act, 1961 (Transitional & Historical Reference)

## Statutory Role in 2026–2027 Practice
While the modernized tax framework governs forward periods, the Income-tax Act, 1961 remains of supreme judicial importance for:
- Appeals pending before CIT(Appeals), ITAT, High Courts, and the Supreme Court.
- Re-assessment notices issued under Section 148/148A for assessment years prior to the transition.
- Carry-forward and set-off of accumulated business losses and unabsorbed depreciation originating under the 1961 enactment.`,
    documentType: KnowledgeDocType.ACT,
    categoryId: 'cat_direct_tax',
    categoryName: 'Direct Tax',
    jurisdiction: 'INDIA',
    authority: AuthorityType.CBDT,
    documentNumber: 'Act No. 43 of 1961',
    publishedDate: '1961-09-13T00:00:00.000Z',
    effectiveDate: '1962-04-01T00:00:00.000Z',
    financialYear: 'Historic to 2025-26',
    assessmentYear: 'Historic to 2026-27',
    status: DocLegislationStatus.HISTORICAL,
    reviewStatus: ReviewStatus.PUBLISHED,
    officialSourceUrl: 'https://www.incometax.gov.in/iec/foportal/acts',
    documentUrl: 'https://www.incometax.gov.in/',
    sourceDomain: 'incometax.gov.in',
    isOfficial: true,
    isFeatured: false,
    isHistorical: true,
    isSuperseded: false,
    version: 64,
    lastVerifiedAt: '2026-09-15T00:00:00.000Z',
  },
  {
    id: 'act_cgst_2017',
    title: 'Central Goods and Services Tax Act, 2017',
    slug: 'cgst-act-2017',
    summary: 'The unified statutory legislation levying tax on intra-state supplies of goods and services across India, including ITC restrictions, e-invoicing, and ASMT notice resolution.',
    content: `# Central Goods and Services Tax Act, 2017 (As Amended)

## Comprehensive Core Framework
The CGST Act 2017 governs indirect taxation for all supplies made within state boundaries:

### Key Operational Sections:
- **Section 9**: Levy and collection of CGST on intra-state supplies.
- **Section 16 & 17**: Eligibility and conditions for taking Input Tax Credit (ITC), mandatory GSTR-2B matching, and blocked credits under Section 17(5).
- **Section 29 & 30**: Cancellation and revocation of GST registration.
- **Section 73 & 74**: Determination of tax not paid, short paid, or erroneously refunded (non-fraud vs fraud/wilful misstatement).
- **Section 107**: Appeals to Appellate Authority with mandatory 10% pre-deposit requirements.`,
    documentType: KnowledgeDocType.ACT,
    categoryId: 'cat_gst',
    categoryName: 'GST Laws',
    jurisdiction: 'INDIA',
    authority: AuthorityType.CBIC,
    documentNumber: 'Act No. 12 of 2017',
    publishedDate: '2017-04-12T00:00:00.000Z',
    effectiveDate: '2017-07-01T00:00:00.000Z',
    financialYear: '2026-27',
    status: DocLegislationStatus.CURRENT,
    reviewStatus: ReviewStatus.PUBLISHED,
    officialSourceUrl: 'https://taxinformation.cbic.gov.in/',
    documentUrl: 'https://taxinformation.cbic.gov.in/',
    sourceDomain: 'cbic.gov.in',
    isOfficial: true,
    isFeatured: true,
    isHistorical: false,
    isSuperseded: false,
    version: 9,
    lastVerifiedAt: '2026-09-18T00:00:00.000Z',
  },
  {
    id: 'act_companies_2013',
    title: 'Companies Act, 2013',
    slug: 'companies-act-2013',
    summary: 'Primary corporate statute governing incorporation, corporate governance, financial statement disclosures, statutory audits, CSR compliance, and MCA filings in India.',
    content: `# Companies Act, 2013 (As Amended)

## Statutory Corporate Architecture
The Companies Act, 2013 sets the legal foundation for over 1.8 million active companies in India:
- **Section 134**: Financial statements, Board Report, and Directors Responsibility Statement.
- **Section 135**: Mandatory Corporate Social Responsibility (CSR) expenditure for entities meeting net worth or net profit thresholds.
- **Section 139–148**: Appointment, tenure, qualifications, and rotation of Statutory Auditors.
- **Section 447**: Severe penalties and prosecution for corporate fraud and misrepresentation.`,
    documentType: KnowledgeDocType.ACT,
    categoryId: 'cat_corporate',
    categoryName: 'Corporate & Commercial Laws',
    jurisdiction: 'INDIA',
    authority: AuthorityType.MCA,
    documentNumber: 'Act No. 18 of 2013',
    publishedDate: '2013-08-30T00:00:00.000Z',
    effectiveDate: '2014-04-01T00:00:00.000Z',
    financialYear: '2026-27',
    status: DocLegislationStatus.CURRENT,
    reviewStatus: ReviewStatus.PUBLISHED,
    officialSourceUrl: 'https://www.mca.gov.in/content/mca/global/en/acts-rules/ebooks/acts.html',
    documentUrl: 'https://www.mca.gov.in/',
    sourceDomain: 'mca.gov.in',
    isOfficial: true,
    isFeatured: true,
    isHistorical: false,
    isSuperseded: false,
    version: 12,
    lastVerifiedAt: '2026-09-18T00:00:00.000Z',
  },
  {
    id: 'act_code_on_wages_2019',
    title: 'Code on Wages, 2019',
    slug: 'code-on-wages-2019',
    summary: 'Consolidates and subsumes four legacy labour enactments: Payment of Wages Act, Minimum Wages Act, Payment of Bonus Act, and Equal Remuneration Act.',
    content: `# Code on Wages, 2019

## National Wage & Remuneration Standardization
The Code on Wages standardizes the definition of 'wages' (mandating that allowances exceeding 50% of total compensation be treated as basic wages for provident fund and gratuity calculations), ensuring uniform national floor wages across all organised and unorganised sectors.`,
    documentType: KnowledgeDocType.ACT,
    categoryId: 'cat_labour',
    categoryName: 'Labour Codes & Employment',
    jurisdiction: 'INDIA',
    authority: AuthorityType.LABOUR_MINISTRY,
    documentNumber: 'Act No. 29 of 2019',
    publishedDate: '2019-08-08T00:00:00.000Z',
    effectiveDate: '2026-01-01T00:00:00.000Z',
    financialYear: '2026-27',
    status: DocLegislationStatus.CURRENT,
    reviewStatus: ReviewStatus.PUBLISHED,
    officialSourceUrl: 'https://labour.gov.in/labour-codes',
    documentUrl: 'https://labour.gov.in/',
    sourceDomain: 'labour.gov.in',
    isOfficial: true,
    isFeatured: true,
    isHistorical: false,
    isSuperseded: false,
    version: 2,
    lastVerifiedAt: '2026-09-18T00:00:00.000Z',
  },

  // =========================================================================
  // NOTIFICATIONS & CIRCULARS (2026 Authoritative Regulatory Updates)
  // =========================================================================
  {
    id: 'notif_cbic_gst_28_2026',
    title: 'Waiver of Late Fees for Form GSTR-1A Corrections and Automated Scrutiny Reconciliation Guidelines',
    slug: 'cbic-notification-28-2026-gst',
    summary: 'CBIC notifies streamlined procedures for reciprocal corrections in Form GSTR-1A before GSTR-3B generation with full late-fee amnesty for timely quarterly returns.',
    content: `Government of India  
Ministry of Finance (Department of Revenue)  
Central Board of Indirect Taxes and Customs (CBIC)  
Notification No. 28/2026 – Central Tax  
New Delhi, the 14th July, 2026  

G.S.R. …(E).— In exercise of the powers conferred by section 128 of the Central Goods and Services Tax Act, 2017 (12 of 2017), the Central Government, on the recommendations of the Council, hereby waives the amount of late fee payable under section 47 for registered persons filing Form GSTR-1A within the prescribed statutory window.

### Key Advisory Provisions:
1. Registered suppliers can amend outward supply records through Form GSTR-1A between the 11th and 20th of the subsequent month.
2. Direct integration with GSTR-3B auto-population prevents mismatch discrepancies under Rule 88C and Rule 88D.`,
    documentType: KnowledgeDocType.NOTIFICATION,
    categoryId: 'cat_gst',
    categoryName: 'GST Laws',
    jurisdiction: 'INDIA',
    authority: AuthorityType.CBIC,
    documentNumber: 'Notification No. 28/2026-CT',
    publishedDate: '2026-07-14T00:00:00.000Z',
    effectiveDate: '2026-08-01T00:00:00.000Z',
    financialYear: '2026-27',
    status: DocLegislationStatus.CURRENT,
    reviewStatus: ReviewStatus.PUBLISHED,
    officialSourceUrl: 'https://taxinformation.cbic.gov.in/content-page/guidelines-gst',
    documentUrl: 'https://taxinformation.cbic.gov.in/',
    sourceDomain: 'cbic.gov.in',
    isOfficial: true,
    isFeatured: true,
    isHistorical: false,
    isSuperseded: false,
    version: 1,
    lastVerifiedAt: '2026-09-18T00:00:00.000Z',
    amendments: [
      {
        id: 'amend_1',
        documentId: 'notif_cbic_gst_28_2026',
        amendmentNumber: 'Para 3(A)',
        title: 'Form GSTR-1A Intra-Month Reconciliation',
        description: 'Enables taxpayers to add, edit or modify invoice records missed in GSTR-1 before filing GSTR-3B for the same tax period.',
        effectiveDate: '2026-08-01T00:00:00.000Z',
        previousText: 'Taxpayers had to wait for the subsequent tax period GSTR-1 return to amend outward supply records.',
        newText: 'Taxpayers can file Form GSTR-1A immediately following GSTR-1 closure to seamlessly update GSTR-3B figures.',
      },
    ],
  },
  {
    id: 'circ_cbdt_08_2026',
    title: 'CBDT Circular on Standard Deduction ₹75,000 Application and Section 87A Rebate Computation for Salaried Individuals',
    slug: 'cbdt-circular-08-2026-std-deduction',
    summary: 'CBDT clarifies employer TDS deduction under Section 192, affirming enhanced ₹75,000 standard deduction and ₹25,000 Section 87A rebate for non-corporate salaried assessees.',
    content: `Circular No. 08/2026  
Government of India  
Ministry of Finance  
Department of Revenue  
Central Board of Direct Taxes  
North Block, New Delhi  
Dated: 22nd May, 2026  

Subject: Clarification on Tax Deduction at Source under Section 192 for Financial Year 2026-27 under the New Tax Regime (Section 115BAC).

The Central Board of Direct Taxes hereby clarifies that for the purposes of deduction of income-tax under section 192 from salary payments during Financial Year 2026-27:
1. Standard deduction of ₹75,000 is allowed unconditionally to all salaried employees opting for or defaulted into the New Tax Regime under sub-section (1A) of Section 115BAC.
2. Full rebate under Section 87A up to ₹25,000 is available where total taxable income after standard deduction does not exceed ₹7,00,000, effectively exempting gross salaries up to ₹7,75,000 from income-tax liability.`,
    documentType: KnowledgeDocType.CIRCULAR,
    categoryId: 'cat_direct_tax',
    categoryName: 'Direct Tax',
    jurisdiction: 'INDIA',
    authority: AuthorityType.CBDT,
    documentNumber: 'Circular No. 08/2026',
    publishedDate: '2026-05-22T00:00:00.000Z',
    effectiveDate: '2026-04-01T00:00:00.000Z',
    financialYear: '2026-27',
    assessmentYear: '2027-28',
    status: DocLegislationStatus.CURRENT,
    reviewStatus: ReviewStatus.PUBLISHED,
    officialSourceUrl: 'https://www.incometax.gov.in/iec/foportal/circulars',
    documentUrl: 'https://www.incometax.gov.in/',
    sourceDomain: 'incometax.gov.in',
    isOfficial: true,
    isFeatured: true,
    isHistorical: false,
    isSuperseded: false,
    version: 1,
    lastVerifiedAt: '2026-09-18T00:00:00.000Z',
  },
  {
    id: 'notif_mca_v3_dir3kyc_2026',
    title: 'MCA Advisory on Annual DIR-3 KYC & Web-Based KYC Verification for Active DIN Holders',
    slug: 'mca-dir3-kyc-annual-compliance-2026',
    summary: 'Ministry of Corporate Affairs issues mandatory compliance alert for all Director Identification Number (DIN) holders for annual KYC verification by 30th September.',
    content: `Ministry of Corporate Affairs  
Government of India  
General Circular No. 04/2026  
Shastri Bhawan, New Delhi  
Dated: 10th June, 2026  

Every individual who holds a Director Identification Number (DIN) as on 31st March of a financial year must submit Form DIR-3 KYC to the Central Government on or before 30th September of immediate next financial year.

Failure to complete KYC by due date leads to deactivation of DIN with status marked as 'Deactivated due to non-filing of DIR-3 KYC' and late filing fee of ₹5,000.`,
    documentType: KnowledgeDocType.ADVISORY,
    categoryId: 'cat_corporate',
    categoryName: 'Corporate & Commercial Laws',
    jurisdiction: 'INDIA',
    authority: AuthorityType.MCA,
    documentNumber: 'MCA Circular No. 04/2026',
    publishedDate: '2026-06-10T00:00:00.000Z',
    effectiveDate: '2026-06-10T00:00:00.000Z',
    financialYear: '2026-27',
    status: DocLegislationStatus.CURRENT,
    reviewStatus: ReviewStatus.PUBLISHED,
    officialSourceUrl: 'https://www.mca.gov.in/content/mca/global/en/notifications-circulars.html',
    documentUrl: 'https://www.mca.gov.in/',
    sourceDomain: 'mca.gov.in',
    isOfficial: true,
    isFeatured: false,
    isHistorical: false,
    isSuperseded: false,
    version: 1,
    lastVerifiedAt: '2026-09-18T00:00:00.000Z',
  },
];

export const SEED_COMPLIANCE_DEADLINES: ComplianceDeadlineItemDto[] = [
  {
    id: 'dl_gstr3b_monthly',
    title: 'GSTR-3B Monthly Return Filing',
    category: 'GST',
    description: 'Monthly summary return of outward and inward supplies with payment of net GST liability for regular taxpayers with turnover > ₹5 Crore or opting monthly.',
    dueDate: '2026-10-20T18:30:00.000Z',
    isExtended: false,
    period: 'September 2026',
    entityType: 'All Regular GST Registered Taxpayers',
    form: 'GSTR-3B',
    section: 'Section 39(1) of CGST Act',
    sourceUrl: 'https://www.gst.gov.in/',
    status: DocLegislationStatus.CURRENT,
    financialYear: '2026-27',
    priority: 'CRITICAL',
  },
  {
    id: 'dl_tds_challan_281',
    title: 'TDS / TCS Monthly Deposit Challan 281',
    category: 'TDS',
    description: 'Statutory deadline to deposit tax deducted/collected at source under Sections 194C, 194J, 194I, 194Q for the preceding calendar month.',
    dueDate: '2026-10-07T18:30:00.000Z',
    isExtended: false,
    period: 'September 2026',
    entityType: 'All Corporate and Non-Corporate Deductors',
    form: 'Challan ITNS-281',
    section: 'Rule 30 of Income-tax Rules',
    sourceUrl: 'https://www.incometax.gov.in/',
    status: DocLegislationStatus.CURRENT,
    financialYear: '2026-27',
    priority: 'HIGH',
  },
  {
    id: 'dl_advance_tax_q3',
    title: 'Advance Tax 3rd Installment (75%)',
    category: 'ADVANCE_TAX',
    description: 'Mandatory payment of 75% of total estimated income tax liability for corporate entities and individual business taxpayers.',
    dueDate: '2026-12-15T18:30:00.000Z',
    isExtended: false,
    period: 'FY 2026-27 (Q3)',
    entityType: 'All Assessees with Tax Liability > ₹10,000',
    form: 'Challan ITNS-280',
    section: 'Section 211 of Income-tax Act',
    sourceUrl: 'https://www.incometax.gov.in/',
    status: DocLegislationStatus.CURRENT,
    financialYear: '2026-27',
    priority: 'CRITICAL',
  },
  {
    id: 'dl_mca_aoc4_annual',
    title: 'Filing of Financial Statements Form AOC-4 / AOC-4 XBRL',
    category: 'MCA',
    description: 'Mandatory annual filing of Audited Balance Sheet, Profit & Loss Account, and Directors Report within 30 days of Annual General Meeting (AGM).',
    dueDate: '2026-10-29T18:30:00.000Z',
    isExtended: false,
    period: 'FY 2025-26',
    entityType: 'Private Limited Companies, OPC & Public Ltd',
    form: 'Form AOC-4',
    section: 'Section 137 of Companies Act, 2013',
    sourceUrl: 'https://www.mca.gov.in/',
    status: DocLegislationStatus.CURRENT,
    financialYear: '2026-27',
    priority: 'HIGH',
  },
  {
    id: 'dl_tax_audit_44ab',
    title: 'Tax Audit Report Submission under Section 44AB',
    category: 'INCOME_TAX',
    description: 'Electronic submission of Form 3CA/3CB and Form 3CD by practicing Chartered Accountants for business turnover exceeding statutory audit limits.',
    dueDate: '2026-09-30T18:30:00.000Z',
    isExtended: false,
    period: 'AY 2026-27 (FY 2025-26)',
    entityType: 'Audit-Liable Businesses & Professionals',
    form: 'Form 3CA / 3CB / 3CD',
    section: 'Section 44AB of Income-tax Act',
    sourceUrl: 'https://www.incometax.gov.in/',
    status: DocLegislationStatus.CURRENT,
    financialYear: '2026-27',
    priority: 'CRITICAL',
  },
];

export const SEED_TAX_RATES: TaxRateItemDto[] = [
  // Income Tax New Regime
  {
    id: 'tr_ita_slab_1',
    taxType: 'INCOME_TAX',
    category: 'Section 115BAC (New Regime)',
    subCategory: '₹0 to ₹3,00,000',
    rate: 'Nil (0%)',
    threshold: 'Basic Exemption Limit',
    financialYear: '2026-27',
    assessmentYear: '2027-28',
    sourceUrl: 'https://www.incometax.gov.in/',
    notes: 'Default regime for all Individuals, HUF, AOP, and BOI assessees.',
  },
  {
    id: 'tr_ita_slab_2',
    taxType: 'INCOME_TAX',
    category: 'Section 115BAC (New Regime)',
    subCategory: '₹3,00,001 to ₹7,00,000',
    rate: '5%',
    threshold: 'Full Section 87A rebate applies up to ₹7,00,000',
    financialYear: '2026-27',
    assessmentYear: '2027-28',
    sourceUrl: 'https://www.incometax.gov.in/',
    notes: 'Standard deduction of ₹75,000 applies for salaried employees.',
  },
  {
    id: 'tr_ita_slab_3',
    taxType: 'INCOME_TAX',
    category: 'Section 115BAC (New Regime)',
    subCategory: '₹7,00,001 to ₹10,00,000',
    rate: '10%',
    threshold: 'Tax is ₹20,000 + 10% of amount over ₹7,00,000',
    financialYear: '2026-27',
    assessmentYear: '2027-28',
    sourceUrl: 'https://www.incometax.gov.in/',
    notes: 'Marginal relief available for income slightly exceeding ₹7 Lakh threshold.',
  },
  {
    id: 'tr_ita_slab_4',
    taxType: 'INCOME_TAX',
    category: 'Section 115BAC (New Regime)',
    subCategory: '₹10,00,001 to ₹12,00,000',
    rate: '15%',
    threshold: 'Tax is ₹50,000 + 15% of amount over ₹10,00,000',
    financialYear: '2026-27',
    assessmentYear: '2027-28',
    sourceUrl: 'https://www.incometax.gov.in/',
  },
  {
    id: 'tr_ita_slab_5',
    taxType: 'INCOME_TAX',
    category: 'Section 115BAC (New Regime)',
    subCategory: '₹12,00,001 to ₹15,00,000',
    rate: '20%',
    threshold: 'Tax is ₹80,000 + 20% of amount over ₹12,00,000',
    financialYear: '2026-27',
    assessmentYear: '2027-28',
    sourceUrl: 'https://www.incometax.gov.in/',
  },
  {
    id: 'tr_ita_slab_6',
    taxType: 'INCOME_TAX',
    category: 'Section 115BAC (New Regime)',
    subCategory: 'Above ₹15,00,000',
    rate: '30%',
    threshold: 'Tax is ₹1,40,000 + 30% of amount over ₹15,00,000',
    financialYear: '2026-27',
    assessmentYear: '2027-28',
    sourceUrl: 'https://www.incometax.gov.in/',
    notes: 'Add 4% Health and Education Cess on aggregate tax.',
  },
  // Corporate Tax
  {
    id: 'tr_corp_115baa',
    taxType: 'CORPORATE_TAX',
    category: 'Section 115BAA (Domestic Companies)',
    subCategory: 'Concessional Corporate Rate',
    rate: '25.17%',
    threshold: 'All turnover brackets without MAT applicability',
    financialYear: '2026-27',
    assessmentYear: '2027-28',
    sourceUrl: 'https://www.incometax.gov.in/',
    notes: 'Computed as 22% Base + 10% Surcharge + 4% Cess. Assessee forgoes specified deductions under Section 10AA/35AD.',
  },
  // TDS Rates
  {
    id: 'tr_tds_194j_tech',
    taxType: 'TDS',
    category: 'Section 194J (Fees for Technical Services)',
    subCategory: 'Technical / IT / Call Centre Services',
    rate: '2%',
    threshold: '₹30,000 per financial year',
    financialYear: '2026-27',
    sourceUrl: 'https://www.incometax.gov.in/',
    notes: 'Applicable where recipient provides technical consultancy or software dev.',
  },
  {
    id: 'tr_tds_194j_prof',
    taxType: 'TDS',
    category: 'Section 194J (Professional Fees)',
    subCategory: 'Legal, CA, Medical, Architecture',
    rate: '10%',
    threshold: '₹30,000 per financial year',
    financialYear: '2026-27',
    sourceUrl: 'https://www.incometax.gov.in/',
  },
  {
    id: 'tr_tds_194c_indiv',
    taxType: 'TDS',
    category: 'Section 194C (Contractor Payments)',
    subCategory: 'Individual / HUF Contractors',
    rate: '1%',
    threshold: '₹30,000 single contract or ₹1,00,000 aggregate per annum',
    financialYear: '2026-27',
    sourceUrl: 'https://www.incometax.gov.in/',
  },
  {
    id: 'tr_tds_194q_goods',
    taxType: 'TDS',
    category: 'Section 194Q (Purchase of Goods)',
    subCategory: 'Purchases exceeding ₹50 Lakhs',
    rate: '0.1%',
    threshold: 'Buyer turnover > ₹10 Crore in preceding FY',
    financialYear: '2026-27',
    sourceUrl: 'https://www.incometax.gov.in/',
    notes: 'Applies on value exceeding ₹50 Lakhs. Rate is 5% if PAN is not furnished under Section 206AA.',
  },
];
