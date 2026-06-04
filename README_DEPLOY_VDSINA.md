# TENDMARKET - VDSina Deployment Runbook

This runbook applies the self-hosted stack in `DEPLOY.md` to VDSina specifically.

Use this when you want the same frontend + backend setup on `vdsina.ru` instead of Vercel.

Important: the current frontend brand/content is mostly `ENDMARKET` and hardcodes `endmarket.ru` in many app files. If that is your live domain, use it consistently in VDSina DNS and `.env.hosting`. If not, replace those hardcoded references before launch.

---

## Recommended Shape

For VDSina's standard VPS line, start with one of these:

- Minimum practical: `2 vCPU / 4 GB RAM / 100 GB NVMe / 1 IPv4`
- Safer production start: `4 vCPU / 8 GB RAM / 150 GB NVMe / 1 IPv4`

Why:

- Next.js, Medusa, Strapi, Meilisearch, Postgres, and Redis are all running on one host
- Meilisearch and Strapi can spike RAM during indexing and admin operations
- 100 GB is workable, but 150 GB leaves more room for images, logs, and backups

For Russia-first reachability, choose the `Moscow` datacenter unless you have a specific reason to keep the app outside Russia.

---

## What VDSina Gives You That Matters Here

Relevant platform details from VDSina's public docs and pricing pages:

- Standard VPS can be ordered with a clean Linux image
- Ubuntu `24.04`, `22.04`, `20.04` are available
- SSH-key based installation is supported for compatible templates
- Moscow and Amsterdam locations are available
- 1 Gbit/s network is standard on this line
- VDSina has its own DNS service and API, but neither is required for this deployment
- Backups and auto-prolongation are available in the panel

For this project, choose a clean Ubuntu image, not a preinstalled control panel image.

---

## Phase 1 - Order The Server In VDSina

In the VDSina panel:

1. Open the standard VPS/VDS product line.
2. Choose the `Moscow` datacenter.
3. Choose `Ubuntu 24.04`.
   If you want the most conservative path, `Ubuntu 22.04` is also fine.
4. Add `1 IPv4`.
5. Use an SSH key during provisioning if the template offers it.
6. Enable auto-prolongation.
7. Complete the order and wait until the server status is active.

After creation, note these values:

- server public IPv4
- root login method: SSH key or generated password
- hostname if you set one in the panel

If you ordered with a password instead of a key, change it after first login.

---

## Phase 2 - First Login And Base Hardening

SSH into the server:

```bash
ssh root@<server-ip>
```

Update the system:

```bash
apt update && apt upgrade -y
timedatectl set-timezone Europe/Moscow
```

Optional but recommended: create a non-root sudo user.

```bash
adduser deploy
usermod -aG sudo deploy
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys
```

If you use `ufw`, open the only ports needed for this stack:

```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

Do not expose `3000`, `9000`, `1337`, `5432`, `6379`, or `7700` publicly. Caddy handles public ingress on `80/443`.

---

## Phase 3 - Install Docker

If you already cloned this repo onto the server, you can run the bundled installer:

```bash
scripts/install-vdsina.sh
```

To also configure `ufw` for SSH, HTTP, and HTTPS:

```bash
ENABLE_UFW=1 scripts/install-vdsina.sh
```

Or install Docker manually:

On the VDSina server:

```bash
curl -fsSL https://get.docker.com | sh
usermod -aG docker deploy
systemctl enable docker
systemctl start docker
docker --version
docker compose version
```

Then reconnect as your deployment user if you created one:

```bash
su - deploy
```

---

## Phase 4 - Upload The Project

Clone the repo on the server:

```bash
git clone <your-repo-url>
cd ArtWater
```

Create the hosting env file:

```bash
cp .env.hosting.example .env.hosting
```

Fill in the required values in `.env.hosting`.

Generate secrets with:

```bash
openssl rand -base64 32
```

Required before first boot:

- `PRIMARY_DOMAIN=<your-domain>`
- `ACME_EMAIL=<your email>`
- `POSTGRES_PASSWORD`
- `MEILI_MASTER_KEY`
- `MEDUSA_JWT_SECRET`
- `MEDUSA_COOKIE_SECRET`
- `STRAPI_APP_KEYS`
- `STRAPI_API_TOKEN_SALT`
- `STRAPI_ADMIN_JWT_SECRET`
- `STRAPI_JWT_SECRET`
- `REVALIDATION_SECRET`

These can stay as placeholders until after initialization:

- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- `STRAPI_API_TOKEN`
- `NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY`

---

## Phase 5 - DNS On VDSina Or Your Registrar

Point these records to the VDSina server IPv4:

| Type | Host | Value |
|---|---|---|
| `A` | `@` | `<server-ip>` |
| `A` | `www` | `<server-ip>` |
| `A` | `api` | `<server-ip>` |
| `A` | `cms` | `<server-ip>` |
| `A` | `search` | `<server-ip>` |

You have two workable options:

- keep DNS at your current registrar and add those records there
- use VDSina DNS service and create the same records in their panel

VDSina's DNS docs indicate a default update interval of 600 seconds, so do not expect certificate issuance to work instantly after record changes.

Before first deploy, confirm these hosts resolve to the VDSina server:

```bash
dig +short tendmarket.ru
dig +short api.tendmarket.ru
dig +short cms.tendmarket.ru
dig +short search.tendmarket.ru
```

---

## Phase 6 - First Boot On VDSina

From the project directory on the server:

```bash
docker compose --env-file .env.hosting -f docker-compose.hosting.yml up -d --build
```

Then verify:

```bash
docker compose --env-file .env.hosting -f docker-compose.hosting.yml ps
docker compose --env-file .env.hosting -f docker-compose.hosting.yml logs -f
```

What to expect:

- Postgres creates the Medusa and Strapi databases on first boot
- Caddy waits for working DNS and open `80/443` before certificates succeed
- frontend, Medusa, and Strapi may restart once during the initial build/start cycle

If `caddy` cannot issue certificates, the usual causes on VDSina are:

- DNS still points elsewhere
- `80` or `443` blocked in the OS firewall
- another process is already using `80` or `443`

---

## Phase 7 - Initialize The Apps

### 7.1 Medusa

```bash
docker compose --env-file .env.hosting -f docker-compose.hosting.yml exec medusa npm run db:migrate
docker compose --env-file .env.hosting -f docker-compose.hosting.yml exec medusa npm run seed
```

Copy the printed publishable key into `.env.hosting`:

```bash
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
```

Create the Medusa admin user (the seed does not create one):

```bash
docker compose --env-file .env.hosting -f docker-compose.hosting.yml exec medusa \
  npx medusa user --email you@yourdomain.com --password 'a-strong-password'
```

Then open the dashboard, served by Medusa at `/app` via Caddy:

```text
https://api.<your-domain>/app
```

### 7.2 Strapi

Open:

```text
https://cms.tendmarket.ru/admin
```

Then:

1. Create the admin account.
2. Create a read-only API token.
3. Put that token into `.env.hosting` as `STRAPI_API_TOKEN`.

### 7.3 Meilisearch

Run the indexer from the server or any machine with the repo:

```bash
NEXT_PUBLIC_MEILISEARCH_URL=https://search.tendmarket.ru \
MEILI_MASTER_KEY=<your-meili-master-key> \
npm --prefix storefront run index-products
```

Copy the printed search-only key into `.env.hosting`:

```bash
NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY=<search-only-key>
```

### 7.4 Rebuild The Frontend

The frontend bakes its public env values at build time, so rebuild it after the generated keys are in place:

```bash
docker compose --env-file .env.hosting -f docker-compose.hosting.yml up -d --build frontend caddy
```

---

## Phase 8 - VDSina-Specific Operations

### Reboot The VPS

You can reboot from the VDSina panel or by SSH:

```bash
reboot
```

### Reinstall The OS

VDSina supports reinstalling the server with another OS template. If you do that, all local Docker data is gone unless restored from backup.

### Resize The VPS

If usage grows, VDSina allows tariff upgrades. After a disk increase, confirm the filesystem has actually expanded inside Ubuntu.

### Backups

Use at least one of these:

- VDSina backup schedule for server-level recovery
- off-server database dumps and uploaded media backups

At minimum, take a VDSina backup before major upgrades.

### Billing

Keep auto-prolongation enabled and maintain balance in the account. A billing interruption is a full outage risk.

---

## Quick Verification

Run these after the final rebuild:

```bash
curl -I https://tendmarket.ru
curl https://api.tendmarket.ru/health
curl https://cms.tendmarket.ru/_health
```

Then check in the browser:

- homepage loads
- catalog loads
- `ballu` search works
- cart works
- checkout reaches the correct flow

---

## Fastest Safe Path On VDSina

If you want the shortest sequence with the fewest decisions:

1. Order `4 vCPU / 8 GB / 150 GB / Ubuntu 24.04 / Moscow / 1 IPv4`.
2. Point `@`, `www`, `api`, `cms`, `search` to that IP.
3. Clone repo, fill `.env.hosting`, and run the production compose file.
4. Run Medusa migrate/seed.
5. Create Strapi token.
6. Index Meilisearch.
7. Rebuild frontend.

That is the cleanest VDSina deployment path for this repo as it stands.
