# TENDMARKET - Self-Hosted Deployment Guide

Recommended path: run the full stack on a VPS or VM you control with Docker Compose + Caddy.

This avoids the Vercel dependency entirely. It also keeps the frontend, Medusa, Strapi, Meilisearch, Postgres, and Redis portable across providers.

For a provider-specific walkthrough on VDSina, see `DEPLOY_VDSINA.md`.

Important: the current frontend copy and metadata still hardcode `endmarket.ru` in many app files. If your live domain will be different, replace those references before launch. The infrastructure examples below intentionally use placeholders and subdomain patterns rather than treating `tendmarket.ru` as canonical.

Providers to evaluate: Timeweb Cloud, Selectel, Yandex Cloud, VK Cloud, Hetzner, or any VPS provider that matches your legal, payment, and Russia-reachability requirements.

Stack: **Next.js 16** + **Medusa v2** + **Strapi v5** + **Meilisearch** + **PostgreSQL** + **Redis**

---

## Architecture Overview

```
Browser
  ├─→ tendmarket.ru         → Caddy → Next.js 16 frontend
  ├─→ www.tendmarket.ru     → Caddy → 301 redirect to tendmarket.ru
  ├─→ api.tendmarket.ru     → Caddy → Medusa v2
  ├─→ cms.tendmarket.ru     → Caddy → Strapi v5 admin + content API
  └─→ search.tendmarket.ru  → Caddy → Meilisearch

Next.js server-side routes:
  ├─→ /api/checkout
  ├─→ /api/webhooks/yookassa
  └─→ /api/newsletter

Shared private network inside Docker:
  ├─→ postgres
  ├─→ redis
  ├─→ medusa
  ├─→ strapi
  ├─→ meilisearch
  └─→ frontend
```

Important: the current frontend talks to Meilisearch directly from the browser with a search-only key, so `search.tendmarket.ru` must stay publicly reachable.

---

## Files Added For This Hosting Path

- `docker-compose.hosting.yml` - production stack for frontend + backends
- `docker/caddy/Caddyfile` - reverse proxy + automatic TLS
- `docker/postgres-init-production.sh` - creates separate Medusa and Strapi databases on first boot
- `.env.hosting.example` - production env template

---

## Prerequisites

- [ ] Linux VPS or VM with Docker support
- [ ] Recommended minimum: 2 vCPU / 4 GB RAM / 40+ GB SSD
- [ ] Docker Engine + Docker Compose plugin installed
- [ ] Domain DNS you control
- [ ] Ports `80` and `443` open in the firewall
- [ ] GitHub repo with this codebase
- [ ] YooKassa credentials when you move from dev checkout to real payments
- [ ] Resend credentials when you want real email delivery

---

## Phase 1 - Prepare The Server

### 1.1 Install Docker

On a fresh Ubuntu server:

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"
newgrp docker
docker --version
docker compose version
```

If your provider offers Docker preinstalled, verify the last two commands and skip the installer.

### 1.2 Clone The Repo

```bash
git clone <your-repo-url>
cd ArtWater
```

---

## Phase 2 - Point DNS To The Server

Create these records at your registrar or DNS provider:

| Type | Name | Value |
|---|---|---|
| `A` | `@` | `<server-public-ip>` |
| `A` | `www` | `<server-public-ip>` |
| `A` | `api` | `<server-public-ip>` |
| `A` | `cms` | `<server-public-ip>` |
| `A` | `search` | `<server-public-ip>` |

Wait until the records resolve before first boot so Caddy can issue TLS certificates.

---

## Phase 3 - Create Production Environment

Copy the template:

```bash
cp .env.hosting.example .env.hosting
```

Fill in real values in `.env.hosting`.

Generate secrets with:

```bash
openssl rand -base64 32
```

Set these first before the initial deploy:

- `PRIMARY_DOMAIN`
- `ACME_EMAIL`
- `POSTGRES_PASSWORD`
- `MEILI_MASTER_KEY`
- `MEDUSA_JWT_SECRET`
- `MEDUSA_COOKIE_SECRET`
- `STRAPI_APP_KEYS`
- `STRAPI_API_TOKEN_SALT`
- `STRAPI_ADMIN_JWT_SECRET`
- `STRAPI_JWT_SECRET`
- `REVALIDATION_SECRET`

These values are created later during one-time app setup, so placeholders are fine for the very first boot:

- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- `STRAPI_API_TOKEN`
- `NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY`

Optional integrations can stay blank until you need them:

- `YOOKASSA_SHOP_ID`
- `YOOKASSA_SECRET_KEY`
- `RESEND_API_KEY`
- `RESEND_AUDIENCE_ID`
- `EMAIL_FROM`
- `EMAIL_NOTIFY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_YANDEX_METRIKA_ID`
- `R2_*`

---

## Phase 4 - First Deploy

Start the full stack:

```bash
docker compose --env-file .env.hosting -f docker-compose.hosting.yml up -d --build
```

What this does:

- Starts Postgres, Redis, Meilisearch, Medusa, Strapi, Next.js, and Caddy
- Creates the Medusa and Strapi databases automatically on first Postgres boot
- Terminates TLS at Caddy for all public subdomains

Check container status:

```bash
docker compose --env-file .env.hosting -f docker-compose.hosting.yml ps
```

Watch logs if something stalls:

```bash
docker compose --env-file .env.hosting -f docker-compose.hosting.yml logs -f
```

---

## Phase 5 - One-Time App Initialization

### 5.1 Medusa Migrations + Seed

Run inside the deployed Medusa container:

```bash
docker compose --env-file .env.hosting -f docker-compose.hosting.yml exec medusa npm run db:migrate
docker compose --env-file .env.hosting -f docker-compose.hosting.yml exec medusa npm run seed
```

After `npm run seed`, copy the printed publishable key into:

```bash
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
```

inside `.env.hosting`.

### 5.2 Strapi Admin Setup

Open:

```text
https://cms.tendmarket.ru/admin
```

Then:

1. Create the admin account.
2. Go to **Settings -> API Tokens**.
3. Create a **Read-only** token for the frontend.
4. Put it into `.env.hosting` as `STRAPI_API_TOKEN`.

Create your content after login:

- Brands: Ballu, Haier, Hisense
- Homepage sections
- Editorial content if needed

### 5.3 Index Products In Meilisearch

Run the indexer from any machine that has the repo and Node installed:

```bash
NEXT_PUBLIC_MEILISEARCH_URL=https://search.tendmarket.ru \
MEILI_MASTER_KEY=<your-meili-master-key> \
npm run index-products
```

This will:

- create/update the `products` index
- load all 12 products
- print a search-only key

Copy that key into `.env.hosting`:

```bash
NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY=<search-only-key>
```

### 5.4 Rebuild Frontend With Real Keys

Once the three generated values are in `.env.hosting`, rebuild the frontend so the baked public env values are correct:

```bash
docker compose --env-file .env.hosting -f docker-compose.hosting.yml up -d --build frontend caddy
```

---

## Phase 6 - Post-Deployment Checklist

### Frontend

- [ ] Open `https://tendmarket.ru`
- [ ] Product catalog renders
- [ ] Product images load
- [ ] Search works for `ballu`
- [ ] Cart add/update/remove works
- [ ] Profile registration and login work

### Medusa

- [ ] `https://api.tendmarket.ru/health` returns healthy
- [ ] `GET /store/products` returns catalog data
- [ ] Russia region and RUB are present
- [ ] Publishable key works from the frontend

### Strapi

- [ ] `https://cms.tendmarket.ru/_health` responds
- [ ] `https://cms.tendmarket.ru/api/brands` returns data
- [ ] Brand logos and homepage sections are present

### Checkout

```text
1. Add product to cart
2. Go to /checkout
3. Fill in Russian address + phone
4. Submit the order
   -> dev mode: success redirect without payment
   -> prod mode: YooKassa hosted payment page
```

---

## Phase 7 - Activating YooKassa

1. Register at [yookassa.ru](https://yookassa.ru).
2. Get the live `Shop ID` and `Secret Key`.
3. Put them into `.env.hosting`:
   - `YOOKASSA_SHOP_ID`
   - `YOOKASSA_SECRET_KEY`
4. Add this webhook URL in YooKassa:
   - `https://tendmarket.ru/api/webhooks/yookassa`
5. Enable the events:
   - `payment.succeeded`
   - `payment.canceled`
6. Rebuild the frontend:

```bash
docker compose --env-file .env.hosting -f docker-compose.hosting.yml up -d --build frontend caddy
```

---

## Phase 8 - Local Development Setup

For developing on this machine:

```bash
# 1. Start infrastructure
docker compose up -d postgres redis meilisearch

# 2. Start Medusa
cd apps/medusa && npm run develop

# 3. Start Strapi
cd apps/strapi && npm run develop

# 4. Start Next.js
cd ../..
npm run dev
```

First time only:

```bash
cd apps/medusa
npm run db:migrate
npm run seed
cd ../..
npm run index-products
```

---

## Environment Variables Quick Reference

### Self-Hosted Production

Use `.env.hosting.example` as the source of truth for production.

Public URLs in this deployment model are fixed to these subdomains:

```bash
https://tendmarket.ru
https://api.tendmarket.ru
https://cms.tendmarket.ru
https://search.tendmarket.ru
```

### Local Development

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_MEILISEARCH_URL=http://localhost:7700
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

---

## Useful Commands

```bash
# Start or refresh the production stack
docker compose --env-file .env.hosting -f docker-compose.hosting.yml up -d --build

# Tail logs
docker compose --env-file .env.hosting -f docker-compose.hosting.yml logs -f

# Restart one service
docker compose --env-file .env.hosting -f docker-compose.hosting.yml restart frontend

# Check Medusa health
curl https://api.tendmarket.ru/health

# Check Strapi health
curl https://cms.tendmarket.ru/_health

# View products via Medusa API
curl https://api.tendmarket.ru/store/products \
  -H "x-publishable-api-key: pk_..."

# Re-index Meilisearch
NEXT_PUBLIC_MEILISEARCH_URL=https://search.tendmarket.ru \
MEILI_MASTER_KEY=<key> \
npm run index-products
```

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `tendmarket.ru` does not open over HTTPS | DNS not propagated or ports `80/443` closed | Verify DNS, firewall, and `docker compose ... logs caddy` |
| Frontend loads but catalog is empty | Missing Medusa publishable key | Update `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, rebuild frontend |
| Search returns nothing | Products not indexed or search-only key missing | Run `npm run index-products`, update `NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY`, rebuild frontend |
| Strapi requests return 401 | `STRAPI_API_TOKEN` missing or wrong | Regenerate token in Strapi admin, rebuild frontend |
| Medusa fails on boot | `MEDUSA_JWT_SECRET` or `MEDUSA_COOKIE_SECRET` missing | Set both in `.env.hosting`, restart Medusa |
| Strapi fails on boot | Strapi secrets missing or invalid | Check `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `JWT_SECRET` |
| Checkout stays in dev mode | YooKassa env vars still blank | Fill `YOOKASSA_*` and rebuild frontend |
| CORS errors from frontend to Medusa | Wrong domain in `STORE_CORS` or `AUTH_CORS` | Ensure `PRIMARY_DOMAIN` is correct, restart Medusa |
