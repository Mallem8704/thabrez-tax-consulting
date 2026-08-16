# 🚀 Production Deployment Guide — Thabrez Tax Consulting

This document provides a turnkey guide for deploying the complete full-stack infrastructure:
* **Web Portal & Marketing Site** (Next.js 15 Standalone)
* **Staff Admin Console** (Next.js 15 Standalone)
* **REST API & Background Workers** (NestJS 11 + BullMQ)
* **PostgreSQL 16 Database** (Prisma ORM)
* **Redis 7 Cache & Queue Engine**
* **Nginx High-Performance Gateway / Reverse Proxy** (SSL, Gzip, Security Headers)

---

## 🛠️ Option 1: 1-Click Docker Compose Deployment (Recommended)

### Prerequisites:
* Any Linux VPS (Ubuntu 22.04/24.04 on AWS EC2, DigitalOcean, Hetzner, or Linode)
* Docker & Docker Compose installed (`sudo apt install docker.io docker-compose-v2 -y`)

### Step 1: Clone Repository & Configure Environment
```bash
git clone https://github.com/Mallem8704/thabrez-tax-consulting.git
cd thabrez-tax-consulting

# Create production environment
cp .env.production.example .env.production
# Edit credentials with your strong passwords / keys
nano .env.production
```

### Step 2: Build & Start All Services
```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

### Step 3: Run Database Migrations & Seeds
```bash
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
docker compose -f docker-compose.prod.yml exec api npx prisma db seed
```

### Step 4: Verify Health
```bash
docker compose -f docker-compose.prod.yml ps
curl -I http://localhost/api/v1/health
```

---

## 🔒 Automated SSL / HTTPS with Let's Encrypt / Certbot

To enable HTTPS with free auto-renewing SSL certificates:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d thabreztaxconsulting.com -d www.thabreztaxconsulting.com -d admin.thabreztaxconsulting.com
```

---

## ☁️ Option 2: Cloud / PaaS Deployment

### 1. Web & Admin (Vercel)
* Connect repository to Vercel.
* **Root Directory**: `apps/web` (for main site) and `apps/admin` (for staff console).
* Add Environment Variables: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_API_URL`.

### 2. NestJS API (Render / Railway / Fly.io / AWS ECS)
* Build Command: `pnpm --filter @thabrez/api build`
* Start Command: `node apps/api/dist/main.js`
* Connect managed PostgreSQL and Redis instances.

---

## 📊 Operational Commands & Maintenance

```bash
# View live service logs
docker compose -f docker-compose.prod.yml logs -f web
docker compose -f docker-compose.prod.yml logs -f api

# Database backup
docker exec -t thabrez_postgres_prod pg_dump -U thabrez thabrez_db > backup_$(date +%Y%m%d).sql

# Stop stack
docker compose -f docker-compose.prod.yml down
```
