# 🌐 100% Free Hosting & Deployment Plans — Thabrez Tax Consulting

This guide outlines **3 proven, zero-cost (100% Free Forever)** deployment strategies to host the entire full-stack application:
* **Marketing Website & Client Portal** (`apps/web`)
* **Staff Admin Console** (`apps/admin`)
* **NestJS REST API** (`apps/api`)
* **PostgreSQL Database**
* **Redis Queue (BullMQ)**
* **Document Object Storage**
* **SSL Certificates & Custom Domain Routing**

---

## 🏆 Plan 1: Serverless Hybrid Stack (Recommended — Zero Server Maintenance)

This architecture gives you maximum performance, global CDN distribution, and automatic scaling with **$0 monthly cost**.

```mermaid
graph TD
    User([Clients / Public]) -->|https://thabreztaxconsulting.com| VercelWeb[Vercel: apps/web (Free Hobby)]
    AdminUser([Staff / CAs]) -->|https://admin.thabreztaxconsulting.com| VercelAdmin[Vercel: apps/admin (Free Hobby)]
    
    VercelWeb -->|REST API Calls| KoyebAPI[Koyeb / Render: apps/api (Free)]
    VercelAdmin -->|REST API Calls| KoyebAPI
    
    KoyebAPI --> SupabaseDB[(Supabase / Neon: PostgreSQL Free)]
    KoyebAPI --> UpstashRedis[(Upstash: Serverless Redis Free)]
    KoyebAPI --> CloudflareR2[(Cloudflare R2: 10GB S3 Free)]
```

### Component Free Providers:

| Layer | Provider | Free Tier Limits | Cost |
| :--- | :--- | :--- | :--- |
| **Web Portal** | **Vercel** | Unlimited deploys, 100GB bandwidth/mo, free SSL | **$0/mo** |
| **Admin Console** | **Vercel** | Unlimited deploys, free SSL, custom subdomains | **$0/mo** |
| **NestJS REST API** | **Koyeb** / **Render** | 512MB RAM, Global Edge, No sleeping (Koyeb Eco) | **$0/mo** |
| **PostgreSQL DB** | **Supabase** / **Neon** | 500MB storage, connection pooling, automated backups | **$0/mo** |
| **Redis Queue** | **Upstash** | 10,000 commands/day, BullMQ compatible | **$0/mo** |
| **Document Storage** | **Cloudflare R2** | 10 GB storage, $0 egress fees | **$0/mo** |
| **DNS & SSL** | **Cloudflare** | Global CDN, DDoS protection, universal SSL | **$0/mo** |

---

### Step-by-Step Setup for Plan 1:

#### 1. Setup Free Database (Supabase / Neon)
1. Go to [supabase.com](https://supabase.com) and create a free project.
2. Under **Project Settings -> Database**, copy the `URI` connection string:
   ```
   postgresql://postgres.[ref]:[password]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```
3. In your local terminal, push the database schema:
   ```bash
   DATABASE_URL="your-supabase-url" pnpm --filter @thabrez/db db:push
   DATABASE_URL="your-supabase-url" pnpm --filter @thabrez/db db:seed
   ```

#### 2. Setup Free Redis (Upstash)
1. Go to [upstash.com](https://upstash.com) and create a free Redis database.
2. Select region `ap-south-1` (Mumbai) or nearest.
3. Copy the `rediss://default:...@...upstash.io:6379` connection string.

#### 3. Deploy NestJS API (Koyeb or Render)
1. Sign up at [koyeb.com](https://koyeb.com) or [render.com](https://render.com).
2. Click **New Web Service** and connect your GitHub repository (`thabrez-tax-consulting`).
3. Set the configuration:
   * **Build Command**: `pnpm install --frozen-lockfile && pnpm --filter @thabrez/db db:generate && pnpm --filter @thabrez/api build`
   * **Start Command**: `node apps/api/dist/main.js`
   * **Environment Variables**:
     ```env
     PORT=4000
     NODE_ENV=production
     DATABASE_URL=your-supabase-url
     REDIS_URL=your-upstash-redis-url
     JWT_SECRET=your-32-char-random-jwt-secret
     CORS_ORIGINS=https://thabreztaxconsulting.com,https://admin.thabreztaxconsulting.com
     ```
4. Copy your live API URL (e.g. `https://thabrez-api.koyeb.app/api/v1`).

#### 4. Deploy Web App & Client Portal (Vercel)
1. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Select your repository `thabrez-tax-consulting`.
3. Set **Root Directory** to `apps/web`.
4. Add Environment Variables:
   ```env
   NEXTAUTH_URL=https://thabreztaxconsulting.com
   NEXTAUTH_SECRET=your-32-char-secret
   NEXT_PUBLIC_API_URL=https://thabrez-api.koyeb.app/api/v1
   ```
5. Click **Deploy**.

#### 5. Deploy Staff Admin Console (Vercel)
1. In Vercel, click **Add New Project** again on the same repository.
2. Set **Root Directory** to `apps/admin`.
3. Add Environment Variables:
   ```env
   NEXTAUTH_URL=https://admin.thabreztaxconsulting.com
   NEXTAUTH_SECRET=your-32-char-secret
   NEXT_PUBLIC_API_URL=https://thabrez-api.koyeb.app/api/v1
   ```
4. Click **Deploy**.

---

## 🛡️ Plan 2: Oracle Cloud Always Free VPS (All-In-One Docker)

Oracle Cloud offers the most generous free VPS in the industry:
* **4 ARM Cores (Ampere)**
* **24 GB RAM**
* **200 GB NVMe Storage**
* **100% Free Forever**

### Step-by-Step Deployment:
1. Create a free account at [oracle.com/cloud/free](https://www.oracle.com/cloud/free/).
2. Create an **Ubuntu 24.04 ARM VM** (select 4 OCPUs, 24 GB RAM).
3. Open ports `80` and `443` in the OCI Ingress Security Rules.
4. SSH into the VM:
   ```bash
   # Install Docker & Compose
   sudo apt update && sudo apt install -y docker.io docker-compose-v2 git
   sudo usermod -aG docker $USER

   # Clone your repository
   git clone https://github.com/Mallem8704/thabrez-tax-consulting.git
   cd thabrez-tax-consulting

   # Set environment configuration
   cp .env.production.example .env.production
   nano .env.production

   # Launch all 6 services with 1 command
   docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build

   # Run Prisma migrations & seed demo data
   docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
   docker compose -f docker-compose.prod.yml exec api npx prisma db seed
   ```

---

## ⚡ Plan 3: Railway / Fly.io Free Hobby Tier

If you prefer deploying the Docker Compose stack with zero Linux CLI management:
1. Sign up on [railway.app](https://railway.app) or [fly.io](https://fly.io).
2. Connect your GitHub repo.
3. Railway automatically detects `docker-compose.prod.yml` and provisions individual isolated containers with free SSL endpoints.

---

## 🔒 Free Domain & SSL Configuration Checklist

1. **Free Cloudflare DNS**: Point your domain `A` records to your Vercel / VPS IP.
2. **Free SSL**: Enabled automatically by Vercel and Cloudflare Universal SSL.
3. **Free Email Notifications**: Use [resend.com](https://resend.com) (3,000 free emails/month) for client invoice alerts & deadline reminders.
