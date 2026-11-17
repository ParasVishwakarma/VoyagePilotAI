# VoyagePilot AI — Production Deployment Guide

This guide details best practices and deployment workflows for hosting **VoyagePilot AI** in production environments.

---

## 1. Architecture Overview

In a typical production deployment:
1. **Frontend:** React SPA built into optimized static assets served via an Nginx edge container, Cloudflare Pages, Netlify, or AWS S3 + CloudFront.
2. **Backend:** Spring Boot 3.4 executable JAR running inside a hardened, unprivileged container (JRE 21 Alpine) behind a reverse proxy (Nginx, Traefik, or AWS ALB).
3. **Database:** Managed MySQL 8.0 cluster (AWS RDS, Google Cloud SQL, or DigitalOcean Managed Databases) with automated daily snapshots and replicas.
4. **AI Gateway:** Secure outbound TLS connection to Google Gemini API (`https://generativelanguage.googleapis.com`).

```
                    Internet
                       │
             ┌─────────┴─────────┐
             │  Cloudflare / SSL │
             └─────────┬─────────┘
                       │
       ┌───────────────┴───────────────┐
       ▼                               ▼
┌──────────────┐              ┌────────────────┐
│ Frontend SPA │ (Port 80)    │ Backend API    │ (Port 8080)
│ Nginx Edge   │              │ Spring Boot 21 │
└──────────────┘              └───────┬────────┘
                                      │
                         ┌────────────┴────────────┐
                         ▼                         ▼
               ┌──────────────────┐      ┌──────────────────┐
               │ MySQL 8.0 Engine │      │ Google Gemini AI │
               └──────────────────┘      └──────────────────┘
```

---

## 2. Docker Compose Production Deployment

The root `docker-compose.yml` provides a production-ready, 3-tier container stack.

### Step 1: Prepare Environment File
Create a `.env` file at the root of the project:

```bash
# Database Secrets
MYSQL_DATABASE=voyagepilot_prod
MYSQL_USER=voyage_prod_user
MYSQL_PASSWORD=SuperComplexPassword_987654!
MYSQL_ROOT_PASSWORD=RootAdminSuperPassword_321!

# Backend Secrets
JWT_SECRET=production_hex_or_base64_jwt_secret_key_minimum_256_bits_for_hmac_sha256
CORS_ALLOWED_ORIGINS=https://app.yourdomain.com
GEMINI_API_KEY=your_production_google_gemini_api_key

# Frontend Arguments
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Step 2: Build and Launch Containers
```bash
docker compose up -d --build
```

### Step 3: Verify Status and Health
```bash
docker compose ps
docker compose logs -f backend
```

Test the container health check:
```bash
curl -I http://localhost:8080/actuator/health
# HTTP/1.1 200 OK
# {"status":"UP"}
```

---

## 3. Cloud Platform Deployment

### Option A: Railway / Render (Fastest Managed Cloud)

#### 1. Backend Service
- Connect your GitHub repository to Railway or Render.
- Set root directory to `/backend`.
- Choose **Docker** build mode (uses `backend/Dockerfile`).
- Add the required environment variables:
  - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<db-host>:<port>/<db-name>?useSSL=true&serverTimezone=UTC`
  - `SPRING_DATASOURCE_USERNAME`: `<db-user>`
  - `SPRING_DATASOURCE_PASSWORD`: `<db-password>`
  - `JWT_SECRET`: `<generated-32-byte-secret>`
  - `CORS_ALLOWED_ORIGINS`: `https://your-frontend-domain.com`
  - `GEMINI_API_KEY`: `<your-gemini-key>`

#### 2. Frontend Service
- Create a new static site or web service pointing to `/frontend`.
- Build Command: `npm install && npm run build`
- Publish Directory: `dist`
- Environment Variables:
  - `VITE_API_BASE_URL`: `https://your-backend-domain.com/api`

---

### Option B: AWS Infrastructure (Enterprise Architecture)

1. **Database:** AWS RDS MySQL 8.0 instance deployed across multi-AZ.
2. **Backend:** AWS ECS (Elastic Container Service) with Fargate task definition:
   - Push backend image to AWS ECR (`aws ecr get-login-password ...`).
   - Store database password, JWT secret, and Gemini API key in **AWS Secrets Manager**.
   - Attach Application Load Balancer (ALB) with ACM TLS certificate.
3. **Frontend:**
   - Run `npm run build` in `frontend/`.
   - Upload `dist/` directory to an Amazon S3 bucket configured for static hosting.
   - Point an Amazon CloudFront distribution to the S3 bucket with an OAC (Origin Access Control) and error routing rule (`/index.html` for HTTP 404).

---

## 4. Production Security Hardening Checklist

- [ ] **JWT Key Strength:** Verify `JWT_SECRET` is at least 32 alphanumeric bytes (256 bits). Never leave default placeholders in production.
- [ ] **Database Credentials:** Ensure database user has minimum required privileges. Avoid connecting using `root`.
- [ ] **HTTPS / TLS:** Enforce TLS 1.3 across all endpoints.
- [ ] **CORS Restrictions:** Set `app.cors.allowed-origins` strictly to your production frontend domains (do not use `*`).
- [ ] **Sensitive Endpoint Protection:** Actuator `/actuator/health` and `/actuator/info` are public for load balancers; all other actuator metrics are restricted.
- [ ] **Database Backups:** Configure automated daily backups with minimum 14-day retention.
- [ ] **Rate Limiting:** Implement rate limiting at your reverse proxy (Nginx or Cloudflare WAF) to protect authentication endpoints (`/api/auth/login`, `/api/auth/register`, `/api/auth/forgot-password`).
