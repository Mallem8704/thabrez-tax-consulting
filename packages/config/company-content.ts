export const companyInfo = {
  legalName: "Thabrez Tax Consulting Private Limited",
  registeredOffice: {
    line1: "No.1-618-3A, 1st Floor, Opposite Sangam Theatre",
    city: "Kadiri, Sri Satya Sai District",
    pincode: "515591",
  },
  branchOffice: {
    line1: "No.56, Ground Floor, 4th Cross, Sun Rise Colony, C N Halli",
    city: "Bengaluru",
    pincode: "560002",
  },
  phone: ["880-2222-422", "797-2222-422"], // confirmed current numbers from firm's own marketing material (Aug 2026)
  email: "ca.thabrez@thabreztaxconsulting.com", // confirmed current email from firm's own marketing material — supersedes info@ used on the old site
  website: "www.thabreztaxconsulting.com",
  hours: "Monday - Saturday: 10am to 7pm, Sunday: Closed",
  mapCoordinates: { lat: 28.654472249999998, lng: 77.1830131 }, // registered office
  socialLinks: {
    // TODO: replace with the firm's real profile URLs before launch —
    // the old site's links pointed to generic platform homepages, not
    // actual firm profiles
    facebook: "",
    twitter: "",
    linkedin: "",
    youtube: "",
  },
  aboutShort:
    "Thabrez Tax Consulting Private Limited is a consultancy firm specializing in Income Tax, GST, Audit, Accounting Services, and Financial Advisory. Our team of Chartered Accountants provides customized solutions to meet the unique needs of each client.",
  aboutExtended:
    "We offer a range of services including filing appeals, raising funds, and preparing project reports. We provide specialized services in Income Tax Laws and GST Laws, with a team experienced in handling appeals before the Appellate Authority and High Court.",
};

export const brandColors = {
  // NOTE: The raster logo assets (logo-lockup.png, logo-icon.png) are placeholder-quality
  // raster assets cropped from a compressed JPEG, pending a proper high-resolution vector (SVG)
  // logo file from the firm.
  //
  // Sampled from the firm's own logo and marketing material (Aug 2026).
  // The logo mark is a purple-to-magenta-to-orange gradient hexagon —
  // treat that gradient as the primary brand identity for the logo mark treatment only.
  // Navy #1B2A4A is used for headers/CTAs across both apps — don't apply the gradient
  // to large surfaces or body text.
  primaryGradient: ["#8B3FA8", "#C43D6B", "#E8823A"], // purple -> magenta -> orange, hexagon mark
  navy: "#1B2A4A",       // used for headers/CTAs across both apps
  accentOrange: "#E8823A",
  accentGreen: "#3C8C4A",
};

// Six core service pillars as the firm itself presents them (confirms and
// supersedes the old site's flatter list below — use these as the
// top-level services nav/homepage grid, with the old site's list as the
// detailed sub-services under each):
// Tax Consulting & Planning · Accounting & Book Keeping ·
// GST Compliances & Advisory · Business Setup & Registrations ·
// Audit & Assurance · Financial Advisory & Solutions

export const serviceCategories = [
  {
    category: "Start Up Business",
    slug: "startup-business",
    description: "End-to-end entity structuring, legal incorporation, and statutory setup for founders.",
    services: [
      { name: "Private Limited Company", slug: "private-limited-company" },
      { name: "Partnership Firm", slug: "partnership-firm" },
      { name: "One Person Company", slug: "one-person-company" },
      { name: "Limited Liability Partnership", slug: "limited-liability-partnership" },
      { name: "Proprietorship", slug: "proprietorship" },
    ],
  },
  {
    category: "Business Registration",
    slug: "business-registration",
    description: "Statutory labor, municipal, intellectual property, and government registrations.",
    services: [
      { name: "Professional Tax", slug: "professional-tax" },
      { name: "MSME Registration", slug: "msme-registration" },
      { name: "EPF & ESIC Registration", slug: "epf-esic-registration" },
      { name: "Digital Signature", slug: "digital-signature" },
      { name: "Trade Mark", slug: "trade-mark" },
    ],
  },
  {
    category: "Tax & Compliances",
    slug: "tax-and-compliances",
    description: "Strategic tax planning, monthly GST/TDS filings, annual audit, and ROC governance.",
    services: [
      { name: "Income Tax Filing", slug: "income-tax-filing" },
      { name: "GST Registration & Filing", slug: "gst-registration" },
      { name: "TDS Payment & Returns Compliance", slug: "tds-returns-compliance" },
      { name: "Company Annual Compliances", slug: "company-annual-compliances" },
      { name: "Bookkeeping Services", slug: "bookkeeping-services" },
    ],
  },
  {
    category: "Loan Services",
    slug: "loan-services",
    description: "Bank-compliant project reports, CMA data formulation, and capital syndication.",
    services: [
      { name: "Personal Loan", slug: "personal-loan" },
      { name: "Business Loan", slug: "business-loan" },
      { name: "Home Loan", slug: "home-loan" },
      { name: "Vehicle Loan", slug: "vehicle-loan" },
      { name: "Mortgage Loan", slug: "mortgage-loan" },
    ],
  },
];

export interface TeamMember {
  id: string;
  name: string;
  title: string;
  role: string;
  registrationNumber?: string;
  photoUrl: string;
  qualifications: string;
  bio: string;
  specialization: string[];
}

export const teamMembers: TeamMember[] = [
  {
    id: "ca-thabrez",
    name: "CA. Thabrez, FCA",
    title: "Managing Director & Senior Tax Partner",
    role: "Senior Partner",
    registrationNumber: "ICAI M.No: 238491",
    photoUrl: "/team/ca-thabrez.png",
    qualifications: "B.Com, FCA, DISA (ICAI), Certificate in International Taxation",
    bio: "Fellow Chartered Accountant with 15+ years of practice in direct taxation, corporate structuring, and High Court appellate advocacy. Specialized in resolving intricate search & seizure proceedings and cross-border transfer pricing.",
    specialization: ["Direct Tax Litigation", "Appellate Appeals (ITAT/HC)", "Corporate Structuring", "Project Financing"],
  },
  {
    id: "ca-ananya-reddy",
    name: "CA. Ananya Reddy, ACA",
    title: "Partner — Indirect Taxes & GST Compliance",
    role: "Partner",
    registrationNumber: "ICAI M.No: 289104",
    photoUrl: "/team/ca-ananya.png",
    qualifications: "B.Com, ACA, GST Certified Practitioner (ICAI)",
    bio: "Oversees the Indirect Tax practice assisting multinational manufacturing and e-commerce enterprises with GST audit defense, departmental summons, refunds, and supply chain tax optimization.",
    specialization: ["GST Advisory & Audit", "ITC Optimization", "Departmental Show Cause Defense", "Customs Advisory"],
  },
  {
    id: "cs-karthik-iyer",
    name: "CS. Karthik Iyer, ACS",
    title: "Head of Corporate Governance & Secretarial Practice",
    role: "Corporate Secretarial Lead",
    registrationNumber: "ICSI M.No: 41209",
    photoUrl: "/team/cs-karthik.png",
    qualifications: "B.A. LL.B (Hons), ACS",
    bio: "Leads MCA/ROC statutory compliances, cross-border FDI advisory, shareholder agreements, and NCLT corporate restructuring matters.",
    specialization: ["ROC Annual Filing", "Private Equity Secretarial Diligence", "FEMA & RBI Compliance", "NCLT Petitions"],
  },
  {
    id: "arun-kumar",
    name: "Arun Kumar, MBA (Finance)",
    title: "Head of Banking & Debt Syndication",
    role: "Banking & Loan Advisory Lead",
    registrationNumber: "AMFI Reg: 109283",
    photoUrl: "/team/arun-kumar.png",
    qualifications: "B.Tech, MBA (Finance, IIM Kozhikode)",
    bio: "Specializes in project report preparation, financial modeling, CMA data preparation, and institutional debt financing with leading public & private sector banks.",
    specialization: ["Bankable Project Reports", "CMA Data Preparation", "Working Capital Syndication", "Term Loan Structuring"],
  },
];

export interface DetailedService {
  slug: string;
  title: string;
  category: string;
  shortDesc: string;
  heroDesc: string;
  deliverables: string[];
  processSteps: { step: number; title: string; desc: string }[];
  requiredDocuments: string[];
  faq: { q: string; a: string }[];
  estimatedDays: string;
}

export const detailedServices: Record<string, DetailedService> = {
  "private-limited-company": {
    slug: "private-limited-company",
    title: "Private Limited Company Registration",
    category: "Start Up Business",
    shortDesc: "Incorporate your Pvt Ltd company in India with complete MCA SPICe+ approval, DIN, PAN, TAN, and bank account setup.",
    heroDesc: "Fast-track legal entity incorporation for startups and growing enterprises with limited liability protection and foreign direct investment eligibility.",
    deliverables: [
      "Certificate of Incorporation (COI) from MCA",
      "Company PAN & TAN Allotment",
      "Digital Signature Certificates (Class 3 DSC) for 2 Directors",
      "Director Identification Numbers (DIN)",
      "Drafting of Memorandum of Association (MOA) & Articles of Association (AOA)",
      "Assistance with Zero-Balance Bank Account Opening",
      "First Board Resolutions & Share Certificates",
    ],
    processSteps: [
      { step: 1, title: "Name Approval (RUN)", desc: "We file for trademark-cleared company name reservation on MCA V3 portal." },
      { step: 2, title: "DSC & Document Verification", desc: "Issuing Class-3 digital signatures and verifying KYC credentials of directors." },
      { step: 3, title: "SPICe+ Part B Filing", desc: "Submitting integrated application for incorporation, PAN, TAN, EPFO, ESIC, and Professional Tax." },
      { step: 4, title: "Certificate of Incorporation", desc: "Receiving official CIN and COI from Registrar of Companies." },
    ],
    requiredDocuments: [
      "PAN Card copy of all Directors & Shareholders",
      "Aadhaar Card / Passport / Voter ID as Identity Proof",
      "Bank Statement / Electricity Bill / Telephone Bill as Address Proof (within 2 months)",
      "Passport size photographs of Directors",
      "Registered Office proof: Electricity bill + Rent agreement + NOC from landlord",
    ],
    faq: [
      { q: "How many directors are required for a Private Limited Company?", a: "A minimum of 2 directors (at least one Indian resident) and 2 shareholders are required." },
      { q: "Is physical presence required in ROC office?", a: "No, the entire process is 100% digital and paperless under MCA V3 system." },
      { q: "Can a salaried person become a director in a Pvt Ltd?", a: "Yes, provided their employment contract allows holding directorship in an external commercial company." },
    ],
    estimatedDays: "5 to 7 Business Days",
  },
  "partnership-firm": {
    slug: "partnership-firm",
    title: "Partnership Firm Registration",
    category: "Start Up Business",
    shortDesc: "Drafting of legal Partnership Deed, Registrar of Firms (ROF) registration, and firm PAN card allotment.",
    heroDesc: "Traditional business structure ideal for small co-owned ventures requiring minimal statutory compliance burdens.",
    deliverables: [
      "Customized Partnership Deed drafting on Stamp Paper",
      "Notarization & ROF Application Submission",
      "Partnership Firm PAN Card",
      "Form A & Form C certificate from Registrar of Firms",
      "Bank Account opening advisory",
    ],
    processSteps: [
      { step: 1, title: "Deed Formulation", desc: "Drafting profit sharing, capital contribution, and operational powers." },
      { step: 2, title: "Stamp Duty & Notary", desc: "Executing deed on state-prescribed non-judicial stamp paper." },
      { step: 3, title: "ROF Filing & PAN", desc: "Applying for firm registration and dedicated NSDL PAN card." },
    ],
    requiredDocuments: [
      "PAN Card & Aadhaar Card of all Partners",
      "Electricity Bill / Rent Agreement of Place of Business",
      "NOC from Property Owner",
      "Photographs of all Partners",
    ],
    faq: [
      { q: "Is registration with Registrar of Firms compulsory?", a: "While optional, an unregistered partnership cannot file a lawsuit against third parties in court, so ROF registration is strongly recommended." },
    ],
    estimatedDays: "3 to 5 Business Days",
  },
  "one-person-company": {
    slug: "one-person-company",
    title: "One Person Company (OPC) Registration",
    category: "Start Up Business",
    shortDesc: "Single-founder corporate entity offering limited liability and sole ownership advantages under the Companies Act.",
    heroDesc: "Incorporate a solo startup with corporate status, separate legal identity, and complete autonomy.",
    deliverables: [
      "Certificate of Incorporation (COI)",
      "Nominee Director Consent & Documentation",
      "Director DIN & Class 3 DSC",
      "MOA, AOA & Company PAN/TAN",
    ],
    processSteps: [
      { step: 1, title: "Name Reservation", desc: "Applying for unique single-founder corporate title on MCA portal." },
      { step: 2, title: "Nominee Consent (INC-3)", desc: "Securing formal nominee consent in case of founder incapacity." },
      { step: 3, title: "Incorporation Approval", desc: "Approval and issuance of Certificate of Incorporation with PAN/TAN." },
    ],
    requiredDocuments: [
      "Founder & Nominee PAN and Aadhaar Card",
      "Bank Statement showing address",
      "Office Premises Electricity Bill & Rent Agreement",
    ],
    faq: [
      { q: "Can an NRI form an OPC?", a: "Yes, as per updated Companies Act amendments, non-resident Indians are permitted to incorporate an OPC in India." },
    ],
    estimatedDays: "5 to 7 Business Days",
  },
  "limited-liability-partnership": {
    slug: "limited-liability-partnership",
    title: "Limited Liability Partnership (LLP) Registration",
    category: "Start Up Business",
    shortDesc: "Hybrid entity combining corporate limited liability with partnership operational flexibility.",
    heroDesc: "Ideal structure for professional service firms, consultants, and tech agencies seeking limited liability with minimal compliance costs.",
    deliverables: [
      "LLP Certificate of Incorporation (Form FiLLiP)",
      "Designated Partner Identification Numbers (DPIN)",
      "Drafting & Filing of LLP Agreement (Form 3)",
      "LLP PAN & TAN Card",
    ],
    processSteps: [
      { step: 1, title: "Name Reservation (RUN-LLP)", desc: "Reserving your LLP name with MCA." },
      { step: 2, title: "FiLLiP Filing", desc: "Submitting digital incorporation documents and DPIN applications." },
      { step: 3, title: "Form 3 Agreement Filing", desc: "Drafting, stamping, and filing official LLP Agreement within 30 days." },
    ],
    requiredDocuments: [
      "PAN Card & Aadhaar of all Designated Partners",
      "Bank Statement / Utility Bill of Partners",
      "Registered Office utility bill and NOC",
    ],
    faq: [
      { q: "Is audit mandatory for LLPs every year?", a: "No, audit is mandatory only if annual turnover exceeds ₹40 Lakhs or capital contribution exceeds ₹25 Lakhs." },
    ],
    estimatedDays: "6 to 8 Business Days",
  },
  "proprietorship": {
    slug: "proprietorship",
    title: "Sole Proprietorship Registration",
    category: "Start Up Business",
    shortDesc: "Get your single-owner business legally recognized via GST, MSME/Udyam, and Shop & Establishment registrations.",
    heroDesc: "The quickest, most cost-effective method to start an individual commercial enterprise and open a current bank account.",
    deliverables: [
      "MSME Udyam Registration Certificate",
      "GST Registration Certificate (Form REG-06)",
      "Shop & Establishment Certificate (where applicable)",
      "Official CA Bank Account Opening Recommendation Kit",
    ],
    processSteps: [
      { step: 1, title: "Udyam & Labor Filing", desc: "Registering government MSME enterprise identity." },
      { step: 2, title: "GST Allotment", desc: "Obtaining state GSTIN linked to your PAN." },
      { step: 3, title: "Current Account Ready", desc: "Delivering government certificates for instant bank account activation." },
    ],
    requiredDocuments: [
      "Applicant PAN Card & Aadhaar Card",
      "Business address electricity bill",
      "Canceled cheque / bank passbook",
    ],
    faq: [
      { q: "Is there a separate PAN card for Proprietorship?", a: "No, the proprietor's individual PAN is used for all tax filings and business operations." },
    ],
    estimatedDays: "2 to 4 Business Days",
  },
  "gst-registration": {
    slug: "gst-registration",
    title: "GST Registration & Monthly Filing Services",
    category: "Tax & Compliances",
    shortDesc: "New GSTIN registration, amendment, GSTR-1, GSTR-3B monthly filing, and ITC reconciliation.",
    heroDesc: "Guaranteed error-free GST compliance, input tax credit optimization, and seamless department response management.",
    deliverables: [
      "New GSTIN Allotment Certificate (Form REG-06)",
      "Monthly GSTR-1 & GSTR-3B filing with verified challans",
      "2A / 2B Input Tax Credit reconciliation preventing tax leakages",
      "LUT (Letter of Undertaking) filing for zero-rated exporters",
      "Annual GSTR-9 and GSTR-9C reconciliation returns",
    ],
    processSteps: [
      { step: 1, title: "Application Submission", desc: "Drafting and filing Form GST REG-01 with Aadhaar OTP authentication." },
      { step: 2, title: "Clarification Handling", desc: "Responding to officer queries or Site Verification notices." },
      { step: 3, title: "Certificate Grant", desc: "Receiving 15-digit GSTIN and configuring monthly filing schedule." },
    ],
    requiredDocuments: [
      "PAN Card & Aadhaar of Business Owner / Directors",
      "Business Registration Proof (COI / Deed / Udyam)",
      "Electricity Bill and Rent Agreement of Business Location",
      "Canceled Cheque showing Bank Account Number and IFSC",
    ],
    faq: [
      { q: "What is the threshold for mandatory GST registration?", a: "₹40 Lakhs annual turnover for goods (₹20 Lakhs in special states) and ₹20 Lakhs for services, or immediate registration for e-commerce/interstate sellers." },
    ],
    estimatedDays: "3 to 5 Business Days",
  },
  "income-tax-filing": {
    slug: "income-tax-filing",
    title: "Income Tax Return (ITR) Filing & Tax Advisory",
    category: "Tax & Compliances",
    shortDesc: "Strategic direct tax computation, ITR-1 to ITR-7 filing, capital gains optimization, and refund tracking.",
    heroDesc: "Maximize statutory exemptions under Section 80C, 80D, 54EC, and navigate direct tax compliance with certified CAs.",
    deliverables: [
      "Form 26AS, AIS, and TIS detailed reconciliation",
      "Computation of Total Income & Tax Liability",
      "ITR Electronic Verification (e-Verification) Acknowledgment",
      "Capital gains computation across shares, mutual funds, and real estate",
      "Response drafting for CPC notices (Section 139(9), 143(1), 148)",
    ],
    processSteps: [
      { step: 1, title: "Data Gathering & Analysis", desc: "Consolidating Form 16, bank statements, capital gains sheets, and AIS." },
      { step: 2, title: "Tax Computation", desc: "Evaluating Old vs New Tax Regime for lowest legitimate tax payout." },
      { step: 3, title: "E-Filing & Acknowledgment", desc: "Submitting ITR on Income Tax portal and issuing computation sheet." },
    ],
    requiredDocuments: [
      "PAN & Aadhaar Card",
      "Form 16 / Form 16A from employer/deductors",
      "Bank statements for entire financial year",
      "Trading / Demat statements for Capital Gains",
    ],
    faq: [
      { q: "Can I switch between Old and New Tax Regimes?", a: "Salaried individuals can choose every year, while business owners can switch once during the lifetime of the business." },
    ],
    estimatedDays: "1 to 2 Business Days",
  },
  "company-annual-compliances": {
    slug: "company-annual-compliances",
    title: "Company Annual Compliances & Secretarial Audit",
    category: "Tax & Compliances",
    shortDesc: "AOC-4, MGT-7/7A, DIR-3 KYC, Statutory Audit, and Annual General Meeting governance.",
    heroDesc: "Avoid severe MCA late penalties of ₹100/day by ensuring compliant annual secretarial maintenance for your company.",
    deliverables: [
      "Financial Statements preparation in Schedule III format",
      "Filing of Form AOC-4 (Financial Statements)",
      "Filing of Form MGT-7 / MGT-7A (Annual Return)",
      "Director DIR-3 KYC verification for all directors",
      "Drafting of Board Report, Notices, and AGM Minutes",
      "Maintenance of Statutory Registers",
    ],
    processSteps: [
      { step: 1, title: "Statutory Book Audit", desc: "Audit of accounts by independent Chartered Accountant." },
      { step: 2, title: "AGM & Board Approval", desc: "Formal approval of audited balance sheet by shareholders." },
      { step: 3, title: "MCA E-Filing", desc: "Uploading digitally signed AOC-4 and MGT-7 before statutory deadlines." },
    ],
    requiredDocuments: [
      "Audited Balance Sheet & Profit and Loss Account",
      "Bank statements of company",
      "Director Digital Signatures (Class 3 DSC)",
    ],
    faq: [
      { q: "What is the penalty for not filing AOC-4 on time?", a: "MCA levies a penalty of ₹100 per day of delay without upper limit, plus penalties on officers in default." },
    ],
    estimatedDays: "5 to 10 Business Days",
  },
  "tds-returns-compliance": {
    slug: "tds-returns-compliance",
    title: "TDS Payment & Quarterly Returns Compliance",
    category: "Tax & Compliances",
    shortDesc: "Monthly TDS payments, quarterly Form 24Q, 26Q, 27Q filing, and Form 16/16A generation.",
    heroDesc: "Ensure accurate deduction, challan payments (Challan 281), and TRACES return processing.",
    deliverables: [
      "Monthly TDS calculation and Challan 281 payment facilitation",
      "Quarterly Form 24Q (Salaries) & Form 26Q (Non-Salaries) return e-filing",
      "Form 16 (Part A & B) and Form 16A generation from TRACES portal",
      "Correction return filing for PAN mismatches or short deduction notices",
    ],
    processSteps: [
      { step: 1, title: "Challan Reconciliation", desc: "Matching deductor challans with deductee PAN entries." },
      { step: 2, title: "FVU File Validation", desc: "Generating and validating text file using NSDL RPU/FVU utility." },
      { step: 3, title: "E-Filing & Form 16", desc: "Uploading on Income Tax portal and generating TRACES certificates." },
    ],
    requiredDocuments: [
      "TAN Number of Deductor",
      "Challan details (BSR code, date, challan number)",
      "Deductee sheet with PAN, payment amount, TDS deducted",
    ],
    faq: [
      { q: "When is the monthly TDS payment due?", a: "TDS deducted in a month must be paid to the central government by the 7th of the following month (30th April for March)." },
    ],
    estimatedDays: "2 to 3 Business Days",
  },
  "bookkeeping-services": {
    slug: "bookkeeping-services",
    title: "Accounting & Professional Bookkeeping",
    category: "Tax & Compliances",
    shortDesc: "Cloud bookkeeping on Tally, Zoho Books, or QuickBooks with monthly P&L and balance sheets.",
    heroDesc: "Real-time ledger maintenance, bank reconciliation, accounts payable/receivable management, and MIS reporting.",
    deliverables: [
      "Monthly / Weekly ledger entry on Tally Prime / Zoho Books",
      "Bank & Credit Card statement reconciliations",
      "Monthly Profit & Loss Account, Balance Sheet, and Trial Balance",
      "Accounts Receivable (Aging) and Accounts Payable tracking",
      "Depreciation and inventory valuation schedules",
    ],
    processSteps: [
      { step: 1, title: "Document Pipeline Setup", desc: "Configuring secure shared cloud folder for invoices and vouchers." },
      { step: 2, title: "Ledger Posting", desc: "Recording sales, purchases, expenses, and banking transactions." },
      { step: 3, title: "Monthly MIS Delivery", desc: "Delivering executive financial overview to business leadership." },
    ],
    requiredDocuments: [
      "Sales invoices and Purchase bills",
      "Monthly Bank Statements in Excel / PDF",
      "Expense vouchers and petty cash records",
    ],
    faq: [
      { q: "Can we use our existing accounting software?", a: "Yes, we support Tally Prime, Zoho Books, QuickBooks, Busy, and SAP Business One." },
    ],
    estimatedDays: "Ongoing Monthly",
  },
  "msme-registration": {
    slug: "msme-registration",
    title: "MSME / Udyam Registration",
    category: "Business Registration",
    shortDesc: "Official Government of India Udyam Certificate for priority sector bank lending and subsidies.",
    heroDesc: "Unlock government tender preferences, collateral-free CGTMSE bank loans, and 45-day payment protection under MSMED Act.",
    deliverables: [
      "Lifetime valid Udyam Registration Certificate with QR Code",
      "NIC (National Industrial Classification) activity code classification",
      "Access to Samadhaan delayed payment grievance portal",
    ],
    processSteps: [
      { step: 1, title: "Aadhaar & PAN Verification", desc: "Digital verification with Ministry of MSME portal." },
      { step: 2, title: "Plant & Machinery Declaration", desc: "Entering investment and turnover metrics." },
      { step: 3, title: "Certificate Generation", desc: "Instant issuance of official Udyam certificate." },
    ],
    requiredDocuments: [
      "Proprietor / Director Aadhaar Card linked with Mobile",
      "Business PAN Card",
      "Business Address Proof",
    ],
    faq: [
      { q: "Is there any government renewal fee for Udyam?", a: "No, Udyam registration is lifetime valid with zero recurring government renewal fees." },
    ],
    estimatedDays: "1 to 2 Business Days",
  },
  "trade-mark": {
    slug: "trade-mark",
    title: "Trademark Registration & IP Protection",
    category: "Business Registration",
    shortDesc: "Brand name, logo, and slogan protection across 45 trademark classes with legal search report.",
    heroDesc: "Safeguard your brand identity, acquire the exclusive ® symbol, and prevent competitors from copying your goodwill.",
    deliverables: [
      "Comprehensive Trademark Availability Search Report",
      "Class Selection & Strategy consultation (Classes 1 to 45)",
      "Form TM-A drafting and filing with Trademark Registry",
      "Official TM application number for instant ™ usage",
      "Hearing representation & reply to examination reports (Section 9/11)",
    ],
    processSteps: [
      { step: 1, title: "Search & Clearance", desc: "Checking IP India database for identical or phonetically similar marks." },
      { step: 2, title: "Filing TM-A", desc: "Submitting application and paying statutory government fees." },
      { step: 3, title: "Examination & Journal", desc: "Guiding through examination report response and journal publication." },
    ],
    requiredDocuments: [
      "Logo image in high-resolution PNG / JPEG",
      "Applicant Identity & Address Proof",
      "User Affidavit (if trademark is already in prior commercial use)",
      "Signed Power of Attorney (Form TM-48)",
    ],
    faq: [
      { q: "When can I start using the ™ symbol?", a: "You can start using the ™ symbol immediately upon receiving the official application acknowledgement within 24 hours of filing." },
    ],
    estimatedDays: "1 to 2 Days for Filing",
  },
  "business-loan": {
    slug: "business-loan",
    title: "Business Loan Advisory & CMA Preparation",
    category: "Loan Services",
    shortDesc: "Bankable project reports, CMA data formulation, working capital limits, and term loan syndication.",
    heroDesc: "Secure business funding from nationalized and private banks with institutional-grade financial modeling and documentation.",
    deliverables: [
      "Comprehensive Credit Monitoring Arrangement (CMA) Data preparation",
      "Detailed Project Report (DPR) with DSCR, BEP, and IRR metrics",
      "Bank sanction advisory across Cash Credit (CC), Overdraft (OD), and Term Loans",
      "Assistance with CGTMSE collateral-free loan applications",
    ],
    processSteps: [
      { step: 1, title: "Financial Feasibility", desc: "Analyzing historical financials, cash flows, and credit profile." },
      { step: 2, title: "CMA Modeling", desc: "Preparing multi-year projected balance sheets and operating statements." },
      { step: 3, title: "Bank Submission", desc: "Interfacing with bank credit managers until formal sanction letter." },
    ],
    requiredDocuments: [
      "Last 3 years Audited Financial Statements and ITRs",
      "Last 12 months primary Bank Statements",
      "KYC of promoters and property collateral documents (if applicable)",
      "Quotation / Invoices for machinery/capex expansion",
    ],
    faq: [
      { q: "What is CMA Data in bank loans?", a: "CMA (Credit Monitoring Arrangement) is a standard bank format that presents past performance and future projected financial viability to credit underwriters." },
    ],
    estimatedDays: "3 to 5 Business Days",
  },
};

export interface JobOpening {
  id: string;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
}

export const jobOpenings: JobOpening[] = [
  {
    id: "art-trainee",
    slug: "article-assistant-ca-trainee",
    title: "Article Assistant / CA Trainee (ICAI)",
    department: "Audit & Direct Taxation",
    location: "Kadiri & Bengaluru (Hybrid)",
    type: "Full-Time Traineeship",
    experience: "Passed CA Inter (Both/Either Group)",
    description: "Hands-on articleship experience covering statutory audit, bank audit, direct tax scrutiny submissions, and GST audit for mid-market corporate clients.",
    responsibilities: [
      "Participating in statutory and internal audits of corporate clients",
      "Preparing computation of total income and filing ITR-1 to ITR-6",
      "Drafting replies for departmental notices and assessment proceedings",
      "Reconciling GSTR-2B with purchase registers and computing net ITC",
    ],
    requirements: [
      "ICAI CA Intermediate passed candidate looking for 2-year articleship",
      "Strong understanding of accounting principles and AS/Ind AS standards",
      "Working proficiency in MS Excel, Tally Prime, and tax software",
      "High integrity, analytical orientation, and eager to learn",
    ],
  },
  {
    id: "senior-tax-associate",
    slug: "senior-tax-associate",
    title: "Senior Tax & GST Associate",
    department: "Indirect Taxation & Litigation",
    location: "Bengaluru (C N Halli Branch)",
    type: "Full-Time Permanent",
    experience: "3 - 5 Years in CA Firm",
    description: "Lead GST compliance engagements, handle departmental audit representations, and oversee monthly compliance workflows for corporate retainers.",
    responsibilities: [
      "Managing monthly GST compliance cycles for 50+ business retainers",
      "Representing clients before GST Superintendent / Assistant Commissioner",
      "Conducting due diligence audits and identifying input tax leakages",
      "Mentoring junior associates and CA trainees",
    ],
    requirements: [
      "Semi-qualified CA / B.Com / M.Com with extensive CA firm background",
      "Deep expertise in GST Act, Rules, Notifications, and portal procedures",
      "Excellent client communication and written English advocacy skills",
    ],
  },
  {
    id: "accountant-lead",
    slug: "senior-accountant-tally-zoho",
    title: "Senior Accountant (Tally & Zoho Books)",
    department: "Accounting & Outsourcing",
    location: "Kadiri (Registered Office)",
    type: "Full-Time Permanent",
    experience: "2 - 4 Years",
    description: "Maintain end-to-end accounting ledgers, payroll processing, TDS deduction, and generate management financial reports for enterprise clients.",
    responsibilities: [
      "Maintaining day-to-day accounts on Tally Prime and Zoho Books",
      "Monthly bank reconciliation, debtor/creditor ledger scrutiny",
      "Processing monthly payroll, TDS, PF, and ESI challans",
      "Assisting senior CAs during statutory year-end audit closures",
    ],
    requirements: [
      "B.Com / M.Com degree with solid accounting fundamentals",
      "Mastery of Tally Prime, Excel formulas (VLOOKUP, Pivot Tables, SUMIFS)",
      "Punctual, detail-oriented, and capable of working to strict deadlines",
    ],
  },
];

export interface BlogPostItem {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  readTime: string;
  author: { name: string; role: string };
  tags: string[];
  bodyMarkdown: string;
}

export const seedBlogPosts: BlogPostItem[] = [
  {
    slug: "union-budget-2025-msme-tax-changes",
    title: "Union Budget 2025: Major Tax Exemptions and Compliance Reforms for MSMEs & Startups",
    summary: "A comprehensive breakdown of the latest fiscal incentives, enhanced turnover thresholds for presumptive taxation under Section 44AD, and updated corporate tax guidelines.",
    publishedAt: "2026-08-10",
    readTime: "6 min read",
    author: { name: "CA. Thabrez, FCA", role: "Senior Partner" },
    tags: ["Budget 2025", "MSME", "Corporate Tax", "Income Tax"],
    bodyMarkdown: `
# Union Budget 2025: Key Takeaways for MSMEs and Founders

The Union Budget 2025-26 introduces significant relief measures tailored for Indian micro, small, and medium enterprises (MSMEs). This article summarizes the core provisions and actionable compliance strategies.

## 1. Expansion of Presumptive Taxation (Section 44AD / 44ADA)
The presumptive taxation limits for small businesses and eligible professionals have received crucial clarifications:
- **Eligible Business Turnover**: Threshold maintained at ₹3 Crores (subject to minimum 95% digital receipts).
- **Professionals (Section 44ADA)**: Presumptive threshold at ₹75 Lakhs with simplified 50% deemed profit calculation.

## 2. Startup Tax Holiday (Section 80-IAC)
DPIIT-recognized startups incorporated before the updated deadline can claim 100% tax exemption on profits for 3 consecutive assessment years out of the first 10 years of incorporation.

## 3. GST Input Tax Credit (ITC) Safeguards
New verification mechanisms link supplier GSTR-1 filings with recipient GSTR-2B in real time. Businesses must enforce strict vendor reconciliation before claiming quarterly ITC.

## Practical Next Steps for CFOs:
1. Conduct vendor tax compliance ratings to avoid blocked input credit.
2. Review eligibility under the new simplified corporate tax rate (Section 115BAA).
3. Ensure all MSME vendor payments are settled within statutory 45 days under Section 43B(h).
    `,
  },
  {
    slug: "demystifying-section-43b-h-msme-payments",
    title: "Demystifying Section 43B(h): Strict 45-Day Payment Rule to MSME Suppliers",
    summary: "How to avoid disallowance of buyer business expenses and ensure seamless compliance with the MSMED Act 45-day vendor payment mandate.",
    publishedAt: "2026-08-02",
    readTime: "5 min read",
    author: { name: "CA. Ananya Reddy, ACA", role: "Indirect Tax Partner" },
    tags: ["Section 43B(h)", "MSME", "Income Tax", "Cash Flow"],
    bodyMarkdown: `
# Understanding Section 43B(h) of the Income Tax Act

Section 43B(h) was enacted to ensure timely payments to Micro and Small enterprises. Non-compliance results in severe income tax disallowance of business expenditure.

## The Rule in Simple Terms
Any sum payable by a buyer to a micro or small enterprise beyond the time limit specified in Section 15 of the MSMED Act, 2006 will only be allowed as a deduction in the financial year in which the amount is actually paid.

### Statutory Time Limits:
- **With Written Agreement**: Maximum **45 days** from date of delivery of goods/services.
- **Without Written Agreement**: Within **15 days** from date of acceptance.

## Action Plan for Businesses:
1. **Collect Udyam Certificates**: Request active Udyam certificates from all vendor suppliers.
2. **Classify Vendors**: Identify which vendors qualify as Micro (<₹1 Cr capital, <₹5 Cr turnover) or Small (<₹10 Cr capital, <₹50 Cr turnover). Medium enterprises are exempt from Section 43B(h).
3. **ERP Alert Setup**: Configure aged accounts payable alerts at day 30 to clear dues before 45-day deadline.
    `,
  },
  {
    slug: "gst-annual-return-gstr-9-reconciliation-guide",
    title: "Complete Guide to GSTR-9 and GSTR-9C Annual Filing for FY 2024-25",
    summary: "Essential checklist for reconciling GSTR-1, GSTR-3B, and financial ledgers without inviting departmental scrutiny notices.",
    publishedAt: "2026-07-25",
    readTime: "7 min read",
    author: { name: "CA. Ananya Reddy, ACA", role: "Indirect Tax Partner" },
    tags: ["GSTR-9", "GST Audit", "Reconciliation", "Tax Filing"],
    bodyMarkdown: `
# Step-by-Step Guide to Filing GSTR-9 & GSTR-9C

Annual GST return filing requires deep reconciliation between financial books, filed monthly returns, and departmental electronic ledgers.

## Key Focus Tables in GSTR-9:
- **Table 4**: Details of advances, inward and outward supplies on which tax is payable.
- **Table 6 & 8**: Total ITC availed during the financial year vs ITC reflected in GSTR-2A/2B.
- **Table 9**: Tax paid as declared in returns filed during the financial year.

## Common Red Flags to Avoid:
- Discrepancy between turnover reported in Audited Balance Sheet and GSTR-9.
- Claiming ineligible input tax credit on blocked categories under Section 17(5).
- Unpaid reverse charge liability (RCM) on legal services or goods transport.
    `,
  },
];

export interface ComplianceDeadlineItem {
  id: string;
  title: string;
  category: 'GST' | 'INCOME_TAX' | 'TDS' | 'ROC_MCA' | 'LABOUR_LAW';
  categoryLabel: string;
  dueDate: string;
  frequency: 'Monthly' | 'Quarterly' | 'Annual' | 'Bi-Annual';
  applicableTo: string;
  statutoryAct: string;
  formOrChallan: string;
  penalties: string;
  urgency: 'HIGH' | 'MEDIUM' | 'STANDARD';
  description: string;
}

export const statutoryComplianceCalendar: ComplianceDeadlineItem[] = [
  // Monthly Deadlines
  {
    id: 'tds-challan-281-monthly',
    title: 'TDS / TCS Monthly Tax Deposit',
    category: 'TDS',
    categoryLabel: 'Income Tax (TDS)',
    dueDate: '7th of every month',
    frequency: 'Monthly',
    applicableTo: 'All corporate and non-corporate entities deducting TDS under Chapter XVII-B',
    statutoryAct: 'Income Tax Act, 1961 — Section 200(1) / Rule 30',
    formOrChallan: 'Challan ITNS 281',
    penalties: 'Interest @ 1.5% per month or part of month under Section 201(1A) from deduction date',
    urgency: 'HIGH',
    description: 'Statutory deadline to deposit all tax deducted at source during the preceding calendar month to the central government account.',
  },
  {
    id: 'gstr-1-monthly-filing',
    title: 'GSTR-1 Monthly Outward Supplies',
    category: 'GST',
    categoryLabel: 'Goods & Services Tax',
    dueDate: '11th of every month',
    frequency: 'Monthly',
    applicableTo: 'Regular taxpayers with turnover > ₹5 Crore or businesses not opting for QRMP scheme',
    statutoryAct: 'CGST Act, 2017 — Section 37 / Rule 59',
    formOrChallan: 'Form GSTR-1',
    penalties: 'Late fee of ₹50/day (₹20/day for Nil return) up to maximum ₹10,000 per return',
    urgency: 'HIGH',
    description: 'Statement of outward supplies of goods or services containing invoice-wise details, debit/credit notes, and B2B/B2C summaries.',
  },
  {
    id: 'gstr-iff-qrmp-filing',
    title: 'Invoice Furnishing Facility (IFF) for QRMP',
    category: 'GST',
    categoryLabel: 'Goods & Services Tax',
    dueDate: '13th of month following M1/M2 of quarter',
    frequency: 'Monthly',
    applicableTo: 'Quarterly filers opting for QRMP scheme to pass B2B input tax credit to buyers',
    statutoryAct: 'CGST Rules, 2017 — Rule 59(2)',
    formOrChallan: 'IFF (Invoice Furnishing Facility)',
    penalties: 'Inability for buyer to claim ITC in GSTR-2B for the corresponding month',
    urgency: 'MEDIUM',
    description: 'Optional facility allowing quarterly filers to upload B2B outward invoices up to ₹50 Lakhs per month to reflect in buyer GSTR-2B.',
  },
  {
    id: 'epf-esic-monthly-remittance',
    title: 'EPF & ESIC Monthly Contribution Deposit',
    category: 'LABOUR_LAW',
    categoryLabel: 'Labour Laws / Payroll',
    dueDate: '15th of every month',
    frequency: 'Monthly',
    applicableTo: 'Establishments with 20+ employees (EPF) and 10+ employees with wages up to ₹21,000 (ESIC)',
    statutoryAct: 'EPF & MP Act, 1952 / ESI Act, 1948',
    formOrChallan: 'ECR (Electronic Challan cum Return)',
    penalties: 'Damages from 5% to 25% p.a. under Sec 14B + penal interest @ 12% p.a. under Sec 7Q',
    urgency: 'HIGH',
    description: 'Mandatory electronic remittance of employee and employer statutory PF (12%) and ESI (0.75% + 3.25%) wage deductions.',
  },
  {
    id: 'gstr-3b-monthly-filing',
    title: 'GSTR-3B Monthly Summary Return & Tax Payment',
    category: 'GST',
    categoryLabel: 'Goods & Services Tax',
    dueDate: '20th of every month',
    frequency: 'Monthly',
    applicableTo: 'All regular registered GST taxpayers with turnover > ₹5 Crore and monthly filers',
    statutoryAct: 'CGST Act, 2017 — Section 39 / Rule 61',
    formOrChallan: 'Form GSTR-3B',
    penalties: 'Late fee ₹50/day (₹20 for Nil) + 18% p.a. interest on net cash tax liability under Sec 50',
    urgency: 'HIGH',
    description: 'Self-assessed monthly summary return declaring outward taxable supplies, eligible input tax credit (ITC), and discharging net tax liability.',
  },
  {
    id: 'professional-tax-monthly',
    title: 'Professional Tax (PT) Monthly Return & Remittance',
    category: 'LABOUR_LAW',
    categoryLabel: 'State Statutory Tax',
    dueDate: '20th / 21st of every month',
    frequency: 'Monthly',
    applicableTo: 'Employers in Karnataka, Andhra Pradesh, Maharashtra, and other PT-enacted states',
    statutoryAct: 'State Professional Tax Acts (e.g. KPT Act, 1976 / APPT Act, 1987)',
    formOrChallan: 'Form 5 / Form 5A',
    penalties: 'Penalty up to 250/month + interest @ 1.25% - 2% per month on unpaid tax',
    urgency: 'MEDIUM',
    description: 'Remittance of professional tax deducted from employee salaries based on state government salary slab thresholds.',
  },

  // Quarterly Deadlines
  {
    id: 'advance-tax-q1',
    title: 'Advance Tax — 1st Installment (15%)',
    category: 'INCOME_TAX',
    categoryLabel: 'Income Tax',
    dueDate: '15th June',
    frequency: 'Quarterly',
    applicableTo: 'All individuals, corporate taxpayers, and firms whose estimated annual tax liability exceeds ₹10,000',
    statutoryAct: 'Income Tax Act, 1961 — Section 208 & 211(1)(a)',
    formOrChallan: 'Challan ITNS 280 (Code 100)',
    penalties: 'Simple interest @ 1% per month under Section 234C on shortfall from 15%',
    urgency: 'HIGH',
    description: 'Payment of minimum 15% of estimated net annual tax liability for the ongoing financial year.',
  },
  {
    id: 'tds-return-q1',
    title: 'Quarterly TDS Return Filing — Q1 (April - June)',
    category: 'TDS',
    categoryLabel: 'Income Tax (TDS)',
    dueDate: '31st July',
    frequency: 'Quarterly',
    applicableTo: 'All deductors of TDS (Salary: Form 24Q, Non-Salary: Form 26Q, Non-Resident: Form 27Q)',
    statutoryAct: 'Income Tax Act, 1961 — Section 200(3) / Rule 31A',
    formOrChallan: 'Form 24Q / 26Q / 27Q',
    penalties: 'Mandatory late filing fee of ₹200/day under Section 234E + penalty up to ₹1,00,000 under Sec 271H',
    urgency: 'HIGH',
    description: 'Quarterly statement containing PAN-wise details of all tax deducted, rate applied, and challan mapping for the first financial quarter.',
  },
  {
    id: 'advance-tax-q2',
    title: 'Advance Tax — 2nd Installment (45% Cumulative)',
    category: 'INCOME_TAX',
    categoryLabel: 'Income Tax',
    dueDate: '15th September',
    frequency: 'Quarterly',
    applicableTo: 'All taxpayers with estimated annual tax liability of ₹10,000 or more',
    statutoryAct: 'Income Tax Act, 1961 — Section 211(1)(b)',
    formOrChallan: 'Challan ITNS 280 (Code 100)',
    penalties: 'Interest @ 1% per month under Section 234C on shortfall from 45%',
    urgency: 'HIGH',
    description: 'Cumulative payment of 45% of estimated annual tax liability for the second quarter.',
  },
  {
    id: 'tds-return-q2',
    title: 'Quarterly TDS Return Filing — Q2 (July - Sept)',
    category: 'TDS',
    categoryLabel: 'Income Tax (TDS)',
    dueDate: '31st October',
    frequency: 'Quarterly',
    applicableTo: 'All deductors of TDS on salaries, contractors, rent, and professional fees',
    statutoryAct: 'Income Tax Act, 1961 — Section 200(3)',
    formOrChallan: 'Form 24Q / 26Q / 27Q',
    penalties: 'Fee ₹200/day under Sec 234E until return is filed',
    urgency: 'HIGH',
    description: 'Quarterly return detailing tax deductions for the second quarter to update payee Form 26AS & AIS.',
  },
  {
    id: 'advance-tax-q3',
    title: 'Advance Tax — 3rd Installment (75% Cumulative)',
    category: 'INCOME_TAX',
    categoryLabel: 'Income Tax',
    dueDate: '15th December',
    frequency: 'Quarterly',
    applicableTo: 'All individuals and corporate entities liable to advance tax',
    statutoryAct: 'Income Tax Act, 1961 — Section 211(1)(c)',
    formOrChallan: 'Challan ITNS 280 (Code 100)',
    penalties: 'Interest @ 1% per month under Section 234C on shortfall from 75%',
    urgency: 'HIGH',
    description: 'Cumulative payment of 75% of estimated net annual income tax.',
  },
  {
    id: 'tds-return-q3',
    title: 'Quarterly TDS Return Filing — Q3 (Oct - Dec)',
    category: 'TDS',
    categoryLabel: 'Income Tax (TDS)',
    dueDate: '31st January',
    frequency: 'Quarterly',
    applicableTo: 'All statutory TDS deductors',
    statutoryAct: 'Income Tax Act, 1961 — Section 200(3)',
    formOrChallan: 'Form 24Q / 26Q / 27Q',
    penalties: 'Fee ₹200/day under Sec 234E',
    urgency: 'HIGH',
    description: 'Quarterly TDS statement for deductions made between October and December.',
  },
  {
    id: 'advance-tax-q4',
    title: 'Advance Tax — 4th Installment (100% Final)',
    category: 'INCOME_TAX',
    categoryLabel: 'Income Tax',
    dueDate: '15th March',
    frequency: 'Quarterly',
    applicableTo: 'All taxpayers including businesses opting for Section 44AD / 44ADA presumptive taxation (100% due on 15 March)',
    statutoryAct: 'Income Tax Act, 1961 — Section 211(1)(d)',
    formOrChallan: 'Challan ITNS 280 (Code 100)',
    penalties: 'Interest @ 1% per month under Section 234B (shortfall > 10%) and Section 234C',
    urgency: 'HIGH',
    description: 'Final installment discharging 100% of estimated annual tax liability before financial year-end.',
  },
  {
    id: 'tds-return-q4',
    title: 'Quarterly TDS Return Filing — Q4 (Jan - March)',
    category: 'TDS',
    categoryLabel: 'Income Tax (TDS)',
    dueDate: '31st May',
    frequency: 'Quarterly',
    applicableTo: 'All statutory TDS deductors',
    statutoryAct: 'Income Tax Act, 1961 — Section 200(3)',
    formOrChallan: 'Form 24Q / 26Q / 27Q',
    penalties: 'Fee ₹200/day under Sec 234E + delay in Form 16 / 16A generation',
    urgency: 'HIGH',
    description: 'Final quarter TDS return enabling generation of annual Form 16 for employees and Form 16A for vendors.',
  },

  // Annual Deadlines
  {
    id: 'itr-filing-non-audit',
    title: 'Income Tax Return (ITR) — Non-Audit Assessees',
    category: 'INCOME_TAX',
    categoryLabel: 'Income Tax',
    dueDate: '31st July',
    frequency: 'Annual',
    applicableTo: 'Salaried individuals, HUFs, and non-audit partnership firms / sole proprietors',
    statutoryAct: 'Income Tax Act, 1961 — Section 139(1)',
    formOrChallan: 'ITR-1 (Sahaj), ITR-2, ITR-3, ITR-4 (Sugam)',
    penalties: 'Late filing fee up to ₹5,000 under Section 234F + 1% interest/month under Sec 234A + loss of carry-forward benefits',
    urgency: 'HIGH',
    description: 'Annual statutory tax return for individuals and businesses not subjected to statutory tax audit.',
  },
  {
    id: 'tax-audit-report-3cd',
    title: 'Tax Audit Report (Form 3CA / 3CB - 3CD) Filing',
    category: 'INCOME_TAX',
    categoryLabel: 'Income Tax & Audit',
    dueDate: '30th September',
    frequency: 'Annual',
    applicableTo: 'Businesses with turnover > ₹1 Crore (₹10 Cr if cash transactions < 5%) and professionals with receipts > ₹50 Lakhs (₹75L if cash < 5%)',
    statutoryAct: 'Income Tax Act, 1961 — Section 44AB',
    formOrChallan: 'Form 3CA/3CB and Form 3CD',
    penalties: 'Penalty of 0.5% of total turnover or ₹1,50,000 (whichever is lower) under Section 271B',
    urgency: 'HIGH',
    description: 'Statutory audit of financial books by an independent practicing Chartered Accountant with Form 3CD particulars.',
  },
  {
    id: 'dir-3-kyc-annual',
    title: 'DIN KYC Annual Compliance (DIR-3 KYC)',
    category: 'ROC_MCA',
    categoryLabel: 'MCA & ROC Governance',
    dueDate: '30th September',
    frequency: 'Annual',
    applicableTo: 'All individuals holding a Director Identification Number (DIN) approved on or before 31st March',
    statutoryAct: 'Companies (Appointment and Qualification of Directors) Rules, 2014 — Rule 12A',
    formOrChallan: 'DIR-3 KYC Web / e-Form DIR-3 KYC',
    penalties: 'Deactivation of DIN mark + mandatory late filing penalty of ₹5,000 per director',
    urgency: 'HIGH',
    description: 'Annual identity and address re-verification of all company directors registered on the MCA portal.',
  },
  {
    id: 'itr-filing-audit-corporate',
    title: 'Income Tax Return (ITR) — Audit Cases & Companies',
    category: 'INCOME_TAX',
    categoryLabel: 'Income Tax',
    dueDate: '31st October',
    frequency: 'Annual',
    applicableTo: 'All Private Limited Companies, Public Companies, and businesses/partnerships liable to Tax Audit under Section 44AB',
    statutoryAct: 'Income Tax Act, 1961 — Section 139(1)',
    formOrChallan: 'ITR-5 (Firms/LLPs), ITR-6 (Companies)',
    penalties: 'Late fee ₹5,000 under Sec 234F + 1% interest/month under Sec 234A',
    urgency: 'HIGH',
    description: 'Annual corporate and audited business tax return submission along with financial disclosures.',
  },
  {
    id: 'roc-aoc-4-financials',
    title: 'ROC Filing of Audited Financial Statements (AOC-4)',
    category: 'ROC_MCA',
    categoryLabel: 'MCA & ROC Governance',
    dueDate: '30 days from AGM (Typically 30th October)',
    frequency: 'Annual',
    applicableTo: 'All registered Private Limited, Public, Section 8, and OPC companies',
    statutoryAct: 'Companies Act, 2013 — Section 137 / Rule 12',
    formOrChallan: 'Form AOC-4 / AOC-4 XBRL',
    penalties: 'Late fee ₹100 per day without upper ceiling on company + directors penalty under Sec 450',
    urgency: 'HIGH',
    description: 'Submission of Balance Sheet, Profit & Loss Account, Directors Report, and Auditor Report to the Registrar of Companies (ROC).',
  },
  {
    id: 'roc-mgt-7-annual-return',
    title: 'ROC Filing of Annual Return (MGT-7 / MGT-7A)',
    category: 'ROC_MCA',
    categoryLabel: 'MCA & ROC Governance',
    dueDate: '60 days from AGM (Typically 29th November)',
    frequency: 'Annual',
    applicableTo: 'All registered companies (MGT-7 for standard companies, MGT-7A for OPC & Small Companies)',
    statutoryAct: 'Companies Act, 2013 — Section 92 / Rule 11',
    formOrChallan: 'Form MGT-7 / MGT-7A',
    penalties: 'Late fee ₹100 per day without ceiling + risk of strike-off & disqualification of directors',
    urgency: 'HIGH',
    description: 'Comprehensive statement of shareholding structure, directorship changes, board meetings, and statutory disclosures.',
  },
  {
    id: 'gst-annual-return-gstr9',
    title: 'GST Annual Return & Reconciliation (GSTR-9 & 9C)',
    category: 'GST',
    categoryLabel: 'Goods & Services Tax',
    dueDate: '31st December',
    frequency: 'Annual',
    applicableTo: 'All regular taxpayers (GSTR-9 mandatory for turnover > ₹2 Crore; GSTR-9C reconciliation for turnover > ₹5 Crore)',
    statutoryAct: 'CGST Act, 2017 — Section 44 / Rule 80',
    formOrChallan: 'Form GSTR-9 & GSTR-9C',
    penalties: 'Late fee of ₹200/day (₹100 CGST + ₹100 SGST) capped at 0.5% of turnover in state',
    urgency: 'HIGH',
    description: 'Consolidated annual reconciliation of all monthly returns, eligible ITC, tax paid, and book adjustments.',
  },
];

export interface KnowledgeResourceItem {
  id: string;
  slug: string;
  type: 'ACT' | 'RULE' | 'FORM' | 'BULLETIN' | 'CIRCULAR';
  typeLabel: string;
  category: string;
  title: string;
  statutoryReference: string;
  lastUpdated: string;
  fileSizeOrFormat: string;
  summary: string;
  bodyMarkdown: string;
}

export const knowledgeResourcesLibrary: KnowledgeResourceItem[] = [
  {
    id: 'res-act-it-1961',
    slug: 'income-tax-act-1961-bare-act',
    type: 'ACT',
    typeLabel: 'Bare Act',
    category: 'Income Tax',
    title: 'Income-tax Act, 1961 (Updated with Finance Act 2024 & 2025)',
    statutoryReference: 'Act No. 43 of 1961',
    lastUpdated: 'August 2026',
    fileSizeOrFormat: 'Statutory Bare Act Reference',
    summary: 'The primary legislation governing taxation of individuals, corporate entities, partnerships, LLPs, and trusts in India.',
    bodyMarkdown: `
# Income-tax Act, 1961

The Income-tax Act, 1961 is the comprehensive charging statute for direct taxation across India. It encompasses 298 sections and XIV schedules governing classification of income, allowable deductions, assessment procedures, and appellate remedies.

## Key Charging Heads of Income (Section 14):
1. **Salaries** (Sections 15 - 17)
2. **Income from House Property** (Sections 22 - 27)
3. **Profits and Gains of Business or Profession** (Sections 28 - 44DB)
4. **Capital Gains** (Sections 45 - 55A)
5. **Income from Other Sources** (Sections 56 - 59)

## Landmark Direct Tax Sections:
- **Section 115BAC**: Concessional New Tax Regime with reduced tax brackets.
- **Section 43B(h)**: Timely payment mandate for goods/services purchased from Micro & Small Enterprises.
- **Section 44AD / 44ADA**: Presumptive taxation scheme for small businesses and eligible professionals.
- **Section 194J & 194C**: Tax Deducted at Source (TDS) on professional fees and contractor payments.
    `,
  },
  {
    id: 'res-act-cgst-2017',
    slug: 'cgst-act-2017-bare-act',
    type: 'ACT',
    typeLabel: 'Bare Act',
    category: 'GST',
    title: 'Central Goods and Services Tax (CGST) Act, 2017',
    statutoryReference: 'Act No. 12 of 2017',
    lastUpdated: 'August 2026',
    fileSizeOrFormat: 'Statutory Bare Act Reference',
    summary: 'The principal indirect tax act levying tax on intra-state supplies of goods and services across India.',
    bodyMarkdown: `
# Central Goods and Services Tax (CGST) Act, 2017

The CGST Act, 2017 consolidated multiple erstwhile central indirect taxes including Central Excise Duty, Service Tax, and Countervailing Duty into a unified destination-based tax system.

## Crucial Statutory Sections:
- **Section 7**: Scope of taxable supply (sales, transfers, barters, licenses, and leases).
- **Section 9**: Levy and collection of CGST and Reverse Charge Mechanism (RCM).
- **Section 16**: Eligibility and mandatory conditions for availing Input Tax Credit (ITC).
- **Section 37 & 39**: Furnishing of outward supplies (GSTR-1) and monthly summary returns (GSTR-3B).
- **Section 129 & 130**: Detention, seizure, and confiscation of goods and conveyances in transit.
    `,
  },
  {
    id: 'res-act-companies-2013',
    slug: 'companies-act-2013-reference',
    type: 'ACT',
    typeLabel: 'Bare Act',
    category: 'Corporate Governance',
    title: 'Companies Act, 2013 (As Amended by MCA 2024)',
    statutoryReference: 'Act No. 18 of 2013',
    lastUpdated: 'July 2026',
    fileSizeOrFormat: 'Statutory Reference',
    summary: 'Governs corporate incorporation, management responsibilities, board meetings, statutory audit, and winding up.',
    bodyMarkdown: `
# Companies Act, 2013

The Companies Act, 2013 regulates corporate structures, corporate social responsibility, director responsibilities, and ROC disclosures.

## Vital Corporate Compliances:
- **Section 134**: Approval and signing of Financial Statements and Directors' Board Report.
- **Section 135**: Corporate Social Responsibility (CSR) policy formulation and statutory spending.
- **Section 137**: Mandatory filing of copy of financial statements (Form AOC-4) with ROC.
- **Section 92**: Annual Return preparation and electronic filing (Form MGT-7).
- **Section 185 & 186**: Strict statutory restrictions on loans to directors and corporate investments.
    `,
  },
  {
    id: 'res-rule-income-tax-1962',
    slug: 'income-tax-rules-1962-handbook',
    type: 'RULE',
    typeLabel: 'Rules & Regulations',
    category: 'Income Tax',
    title: 'Income-tax Rules, 1962 (Updated Valuation & Procedures)',
    statutoryReference: 'Notification No. S.O. 969 / 1962',
    lastUpdated: 'June 2026',
    fileSizeOrFormat: 'Procedural Rules Reference',
    summary: 'Prescribes detailed computational rules, perquisite valuations, HRA formulas (Rule 2A), and Form 16 timelines.',
    bodyMarkdown: `
# Income-tax Rules, 1962

The Income-tax Rules, 1962 prescribe the operational mechanics, valuation methods, and statutory forms required under the Income-tax Act, 1961.

## Important Operational Rules:
- **Rule 2A**: Limits and computation method for House Rent Allowance (HRA) exemption under Section 10(13A).
- **Rule 3**: Valuation of perquisites including company accommodation, motor cars, and interest-free loans.
- **Rule 31**: Time limit and statutory format for issuing TDS Certificates (Form 16 / Form 16A).
- **Rule 114**: PAN allotment procedure and mandatory Aadhaar-PAN linking rules.
    `,
  },
  {
    id: 'res-rule-cgst-2017',
    slug: 'cgst-rules-2017-handbook',
    type: 'RULE',
    typeLabel: 'Rules & Regulations',
    category: 'GST',
    title: 'Central Goods and Services Tax Rules, 2017',
    statutoryReference: 'Notification No. 3/2017 - Central Tax',
    lastUpdated: 'July 2026',
    fileSizeOrFormat: 'Procedural Rules Reference',
    summary: 'Procedural rules governing GST invoices, e-way bills (Rule 138), input tax credit reversals (Rule 42/43), and refund claims.',
    bodyMarkdown: `
# CGST Rules, 2017

These rules prescribe the compliance framework for GST administration, electronic ledgers, invoice validation, and refund processing.

## Crucial Operating Rules:
- **Rule 36(4)**: Input tax credit availability strictly limited to invoices reflected in GSTR-2B.
- **Rule 86B**: Restriction on utilization of electronic credit ledger (mandatory 1% cash payment for turnover > ₹50 Lakhs/month).
- **Rule 138**: Electronic Way Bill (E-Way Bill) generation for consignment movement exceeding ₹50,000.
    `,
  },
  {
    id: 'res-form-16-16a-guide',
    slug: 'form-16-form-16a-tds-certificates-guide',
    type: 'FORM',
    typeLabel: 'Statutory Form & Guide',
    category: 'Income Tax',
    title: 'Form 16 & Form 16A TDS Certificate Guide & TRACES Format',
    statutoryReference: 'Income Tax Rules, 1962 — Rule 31',
    lastUpdated: 'July 2026',
    fileSizeOrFormat: 'TRACES Utility & Sample Format',
    summary: 'Comprehensive structure of Part A (TRACES authenticated) and Part B (salary breakdown) TDS certificates.',
    bodyMarkdown: `
# Form 16 and Form 16A Statutory Guide

Form 16 and Form 16A are the certificates issued under Section 203 of the Income-tax Act, 1961 for tax deducted at source.

## Component Breakdown:
- **Form 16 (Part A)**: Downloaded directly from TRACES portal with government watermark, tax deposit challan numbers, BSR code, and CIN.
- **Form 16 (Part B)**: Prepared by employer detailing gross salary, Chapter VI-A deductions, standard deduction, and net tax computation.
- **Form 16A**: Issued quarterly for non-salary payments (professional fees under 194J, contractor under 194C, rent under 194I).
    `,
  },
  {
    id: 'res-form-tax-audit-3cd',
    slug: 'form-3ca-3cb-3cd-tax-audit-schema',
    type: 'FORM',
    typeLabel: 'Statutory Form & Guide',
    category: 'Income Tax & Audit',
    title: 'Tax Audit Report Form 3CA / 3CB & Form 3CD Particulars',
    statutoryReference: 'Income Tax Rules, 1962 — Rule 6G',
    lastUpdated: 'June 2026',
    fileSizeOrFormat: 'ICAI Audit Format Schema',
    summary: 'Standardized 44-clause statement of particulars required to be certified by a Chartered Accountant under Section 44AB.',
    bodyMarkdown: `
# Form 3CA, 3CB and Form 3CD Framework

Tax audit reporting requires comprehensive verification of accounting methods, valuation of inventories, depreciation schedules, and related party transactions.

## High-Risk Clauses in Form 3CD:
- **Clause 21(a)**: Amounts debited to P&L being capital, personal, or advertisement in nature.
- **Clause 21(b)**: Disallowance under Section 40(a)(ia) for non-deduction or non-payment of TDS (30% disallowance).
- **Clause 22**: Interest inadmissible under Micro, Small and Medium Enterprises Development Act, 2006.
- **Clause 26**: Sums referred to in Section 43B including Section 43B(h) MSME payments.
- **Clause 34**: Complete reconciliation of TDS compliance and interest liability.
    `,
  },
  {
    id: 'res-bulletin-union-budget-2025',
    slug: 'union-budget-2025-statutory-bulletin',
    type: 'BULLETIN',
    typeLabel: 'Practice Bulletin',
    category: 'Direct & Indirect Tax',
    title: 'Union Budget 2025: Key Tax Amendments, Slab Revisions & Business Impact',
    statutoryReference: 'Finance Act, 2025',
    lastUpdated: 'August 2026',
    fileSizeOrFormat: 'CA Technical Advisory Bulletin',
    summary: 'In-depth analysis of enhanced standard deduction (₹75,000), revised New Tax Regime brackets, and MSME concessions.',
    bodyMarkdown: `
# Technical Bulletin: Union Budget 2025 Analysis

This advisory bulletin outlines key amendments made by the Union Budget 2025 impacting individual taxpayers, startups, and MSME corporations.

## Key Direct Tax Changes:
1. **Standard Deduction**: Increased to **₹75,000** for salaried taxpayers under the New Tax Regime (Section 115BAC).
2. **Tax Slabs under 115BAC**:
   - 0 to ₹3,00,000 : Nil
   - ₹3,00,001 to ₹7,00,000 : 5% (Sec 87A rebate ensures zero tax up to ₹7 Lakhs taxable income / ₹7.75 Lakhs gross)
   - ₹7,00,001 to ₹10,00,000 : 10%
   - ₹10,00,001 to ₹12,00,000 : 15%
   - ₹12,00,001 to ₹15,00,000 : 20%
   - Above ₹15,00,000 : 30%
3. **Corporate Tax for Foreign Companies**: Reduced from 40% to 35% to boost FDI.
    `,
  },
  {
    id: 'res-circular-section-43bh',
    slug: 'cbdt-circular-section-43bh-msme-guidelines',
    type: 'CIRCULAR',
    typeLabel: 'Departmental Circular',
    category: 'Income Tax',
    title: 'CBDT Circular: Practical Guidelines on Section 43B(h) MSME Disallowance',
    statutoryReference: 'CBDT Circular No. 04/2024',
    lastUpdated: 'July 2026',
    fileSizeOrFormat: 'Official Circular Analysis',
    summary: 'Clarification regarding applicability of 45-day payment rule strictly to Micro and Small enterprises, excluding Medium enterprises and traders.',
    bodyMarkdown: `
# Practical Implementation of Section 43B(h)

The Central Board of Direct Taxes (CBDT) issued operational clarifications regarding payments made to enterprises registered under the MSMED Act, 2006.

## Critical Compliance Rules:
1. **Beneficiary Category**: Section 43B(h) applies **only to Micro and Small manufacturing/service enterprises**. Medium enterprises are explicitly excluded.
2. **Traders / Retailers**: Wholesale and retail traders holding Udyam registration solely for Priority Sector Lending (PSL) do not fall under Section 15 of MSMED Act.
3. **Year-End Accruals**: Deductions are disallowed in the current financial year if payments are delayed beyond 45 days (with agreement) or 15 days (without agreement), and are allowed only in the year of actual payment.
    `,
  },
];

