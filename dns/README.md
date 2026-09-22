# DNS Configuration Presets for thabreztaxconsulting.com

This folder contains pre-configured DNS files to link your custom domain to **Vercel** while keeping **Google Workspace Emails** active.

## Files Available:
1. `thabreztaxconsulting.com.zone` — Standard BIND / RFC 1035 Zone file (supported by Google Cloud DNS, Cloudflare, Route53, and BIND DNS servers).
2. `dns-records.csv` — CSV format for bulk DNS imports.
3. `dns-records.json` — JSON structure of all DNS records.

---

## Quick Reference Summary of Records:

| Record Type | Host / Name | Value / Destination | Priority | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | - | 4 hrs (14400) | Vercel Apex Website |
| **CNAME** | `www` | `e4751a288723d372.vercel-dns-017.com` | - | 4 hrs (14400) | Vercel WWW Website |
| **CNAME** | `qlnarm3lp5cm` | `gv-qrzdaxgh37jdg3.dv.googlehosted.com` | - | 4 hrs (14400) | Google Verification |
| **CNAME** | `r3fxk7c5jyce` | `gv-ytqgyikkbpc2vi.dv.googlehosted.com` | - | 4 hrs (14400) | Google Verification |
| **CNAME** | `z52j5jd6ldrf` | `gv-zug42rehq7r7wp.dv.googlehosted.com` | - | 4 hrs (14400) | Google Verification |
| **MX** | `@` | `aspmx.l.google.com` | 1 | 4 hrs (14400) | Google Workspace Email |
| **MX** | `@` | `alt1.aspmx.l.google.com` | 5 | 4 hrs (14400) | Google Workspace Email |
| **MX** | `@` | `alt2.aspmx.l.google.com` | 5 | 4 hrs (14400) | Google Workspace Email |
| **MX** | `@` | `alt3.aspmx.l.google.com` | 10 | 4 hrs (14400) | Google Workspace Email |
| **MX** | `@` | `alt4.aspmx.l.google.com` | 10 | 4 hrs (14400) | Google Workspace Email |
| **TXT** | `@` | `v=spf1 include:_spf.google.com ~all` | - | 4 hrs (14400) | Email SPF Anti-Spam |
