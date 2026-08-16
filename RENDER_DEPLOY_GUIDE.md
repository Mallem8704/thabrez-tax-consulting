# 🚀 1-Click Render Deployment Guide — Thabrez Tax Consulting

We have added official **Render Blueprint Support (`render.yaml`)** to this repository. This allows you to deploy the **entire full-stack infrastructure in 1 click** on [Render.com](https://render.com) for **100% Free**.

---

## 🏗️ What Render Will Automatically Create:

1. **`thabrez-postgres`**: Free Managed PostgreSQL Database
2. **`thabrez-redis`**: Free Managed Key-Value & Queue Store
3. **`thabrez-api`**: NestJS REST API Web Service (with auto-generated JWT secrets)
4. **`thabrez-web`**: Next.js 15 Marketing Site & Client Portal
5. **`thabrez-admin`**: Next.js 15 Staff CA Management Console

---

## 📋 Step-by-Step Instructions (Takes 3 Minutes):

### Step 1: Sign In to Render
1. Open [dashboard.render.com](https://dashboard.render.com).
2. Sign in with your **GitHub Account** (`Mallem8704`).

### Step 2: Create a Blueprint Instance
1. In the top navigation bar, click **"New +"** and select **"Blueprint"** (or go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)).
2. Under "Connect a repository", choose **`Mallem8704/thabrez-tax-consulting`**.
3. Render will automatically read `render.yaml` and display the **5 components** to be provisioned.
4. Click **"Apply"** (or **"Create Blueprint Instance"**).

---

### Step 3: Run Database Migrations (One-Time Setup)
Once the `thabrez-postgres` and `thabrez-api` services finish building:
1. In the Render Dashboard, click on your **`thabrez-api`** service.
2. Go to the **"Shell"** tab on the left sidebar.
3. Run the following command to create the database tables and seed demo accounts:
   ```bash
   pnpm --filter @thabrez/db db:push && pnpm --filter @thabrez/db db:seed
   ```

---

## 🌐 Your Live Production URLs:

| Service | Live Render URL |
| :--- | :--- |
| **Marketing Site & Client Portal** | `https://thabrez-web.onrender.com` |
| **Staff CA Admin Console** | `https://thabrez-admin.onrender.com` |
| **NestJS REST API** | `https://thabrez-api.onrender.com/api/v1` |
| **Interactive Swagger API Docs** | `https://thabrez-api.onrender.com/api/docs` |

---

## 🔄 Automatic Continuous Deployment (CI/CD)
Whenever you push new code to the `main` branch on GitHub, Render will **automatically rebuild and redeploy** the updated code with zero manual effort!
