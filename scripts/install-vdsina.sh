#!/usr/bin/env bash
set -Eeuo pipefail

# VDSina VPS installer for:
# - Next.js storefront
# - Medusa backend + worker
# - PostgreSQL
# - Redis
# - Nginx reverse proxy
# - Let's Encrypt SSL
#
# Expected repo structure:
#   repo/
#   ├── backend/
#   ├── storefront/
#   └── scripts/install-vdsina.sh
#
# Usage:
#   bash scripts/install-vdsina.sh --domain example.com --api-domain api.example.com --admin-email admin@example.com
#
# Optional:
#   bash scripts/install-vdsina.sh --domain example.com --admin-email admin@example.com --skip-ssl
#   bash scripts/install-vdsina.sh --domain example.com --admin-email admin@example.com --overwrite
#
# Environment overrides:
#   BACKEND_DIR=backend
#   STOREFRONT_DIR=storefront
#   DB_PASSWORD=...
#   JWT_SECRET=...
#   COOKIE_SECRET=...
#   MEDUSA_ADMIN_PASSWORD=...
#   NODE_VERSION=20
#   POSTGRES_IMAGE=postgres:16-alpine
#   REDIS_IMAGE=redis:7-alpine

APP_NAME="commerce"
DOMAIN=""
API_DOMAIN=""
ADMIN_EMAIL=""
BACKEND_DIR="${BACKEND_DIR:-backend}"
STOREFRONT_DIR="${STOREFRONT_DIR:-storefront}"
NODE_VERSION="${NODE_VERSION:-20}"
POSTGRES_IMAGE="${POSTGRES_IMAGE:-postgres:16-alpine}"
REDIS_IMAGE="${REDIS_IMAGE:-redis:7-alpine}"
SKIP_SSL="false"
OVERWRITE="false"
CREATE_ADMIN="true"

usage() {
  cat <<EOF
Usage:
  bash scripts/install-vdsina.sh --domain example.com --admin-email admin@example.com [options]

Required:
  --domain DOMAIN             Storefront domain, e.g. example.com
  --admin-email EMAIL         Email for Let's Encrypt and Medusa admin user

Optional:
  --api-domain DOMAIN         API/Admin domain. Default: api.DOMAIN
  --backend-dir DIR           Backend directory. Default: backend
  --storefront-dir DIR        Storefront directory. Default: storefront
  --skip-ssl                  Configure Nginx without issuing SSL certificates
  --overwrite                 Overwrite generated files if they already exist
  --no-admin                  Do not create Medusa admin user
  -h, --help                  Show this help

Examples:
  bash scripts/install-vdsina.sh --domain mystore.ru --admin-email admin@mystore.ru
  bash scripts/install-vdsina.sh --domain mystore.ru --api-domain api.mystore.ru --admin-email admin@mystore.ru --overwrite
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --domain)
      DOMAIN="${2:-}"
      shift 2
      ;;
    --api-domain)
      API_DOMAIN="${2:-}"
      shift 2
      ;;
    --admin-email)
      ADMIN_EMAIL="${2:-}"
      shift 2
      ;;
    --backend-dir)
      BACKEND_DIR="${2:-}"
      shift 2
      ;;
    --storefront-dir)
      STOREFRONT_DIR="${2:-}"
      shift 2
      ;;
    --skip-ssl)
      SKIP_SSL="true"
      shift
      ;;
    --overwrite)
      OVERWRITE="true"
      shift
      ;;
    --no-admin)
      CREATE_ADMIN="false"
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$DOMAIN" || -z "$ADMIN_EMAIL" ]]; then
  echo "Error: --domain and --admin-email are required."
  usage
  exit 1
fi

if [[ -z "$API_DOMAIN" ]]; then
  API_DOMAIN="api.${DOMAIN}"
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

if [[ ! -d "$BACKEND_DIR" ]]; then
  echo "Error: backend directory '$BACKEND_DIR' not found."
  echo "Set it with --backend-dir or BACKEND_DIR=..."
  exit 1
fi

if [[ ! -d "$STOREFRONT_DIR" ]]; then
  echo "Error: storefront directory '$STOREFRONT_DIR' not found."
  echo "Set it with --storefront-dir or STOREFRONT_DIR=..."
  exit 1
fi

if [[ "$(id -u)" -eq 0 ]]; then
  SUDO=""
else
  SUDO="sudo"
fi

need_cmd() {
  command -v "$1" >/dev/null 2>&1
}

rand_secret() {
  if need_cmd openssl; then
    openssl rand -base64 48 | tr -d '\n'
  else
    head -c 48 /dev/urandom | base64 | tr -d '\n'
  fi
}

write_file() {
  local path="$1"
  local content="$2"

  if [[ -f "$path" && "$OVERWRITE" != "true" ]]; then
    echo "Keeping existing $path"
    return
  fi

  if [[ -f "$path" && "$OVERWRITE" == "true" ]]; then
    cp "$path" "${path}.bak.$(date +%Y%m%d%H%M%S)"
    echo "Backed up existing $path"
  fi

  mkdir -p "$(dirname "$path")"
  printf "%s" "$content" > "$path"
  echo "Wrote $path"
}

echo "==> Installing system packages"
$SUDO apt update
$SUDO apt install -y ca-certificates curl gnupg git nginx ufw snapd openssl

echo "==> Installing Docker if missing"
if ! need_cmd docker; then
  $SUDO install -m 0755 -d /etc/apt/keyrings

  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    $SUDO tee /etc/apt/keyrings/docker.asc > /dev/null

  $SUDO chmod a+r /etc/apt/keyrings/docker.asc

  echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
    $SUDO tee /etc/apt/sources.list.d/docker.list > /dev/null

  $SUDO apt update
  $SUDO apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
else
  echo "Docker already installed"
fi

if [[ "$(id -u)" -ne 0 ]]; then
  $SUDO usermod -aG docker "$USER" || true
fi

echo "==> Configuring firewall"
$SUDO ufw allow OpenSSH || true
$SUDO ufw allow 80/tcp || true
$SUDO ufw allow 443/tcp || true
$SUDO ufw --force enable || true

DB_PASSWORD="${DB_PASSWORD:-$(rand_secret)}"
JWT_SECRET="${JWT_SECRET:-$(rand_secret)}"
COOKIE_SECRET="${COOKIE_SECRET:-$(rand_secret)}"
MEDUSA_ADMIN_PASSWORD="${MEDUSA_ADMIN_PASSWORD:-$(rand_secret)}"

echo "==> Generating environment files"

BACKEND_ENV_CONTENT=$(cat <<EOF
NODE_ENV=production
PORT=9000

DATABASE_URL=postgres://medusa:${DB_PASSWORD}@postgres:5432/medusa
REDIS_URL=redis://redis:6379

JWT_SECRET=${JWT_SECRET}
COOKIE_SECRET=${COOKIE_SECRET}

STORE_CORS=https://${DOMAIN},https://www.${DOMAIN}
ADMIN_CORS=https://${API_DOMAIN}
AUTH_CORS=https://${DOMAIN},https://www.${DOMAIN},https://${API_DOMAIN}

MEDUSA_BACKEND_URL=https://${API_DOMAIN}
EOF
)

FRONTEND_ENV_CONTENT=$(cat <<EOF
NODE_ENV=production
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://${API_DOMAIN}
NEXT_PUBLIC_BASE_URL=https://${DOMAIN}
EOF
)

write_file ".env.backend" "$BACKEND_ENV_CONTENT"
write_file ".env.frontend" "$FRONTEND_ENV_CONTENT"

echo "==> Generating Docker Compose file"

COMPOSE_CONTENT=$(cat <<EOF
services:
  postgres:
    image: ${POSTGRES_IMAGE}
    container_name: medusa-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: medusa
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: medusa
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - commerce
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U medusa -d medusa"]
      interval: 10s
      timeout: 5s
      retries: 10

  redis:
    image: ${REDIS_IMAGE}
    container_name: medusa-redis
    restart: unless-stopped
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - redis_data:/data
    networks:
      - commerce
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 10

  medusa-server:
    build:
      context: ./${BACKEND_DIR}
    container_name: medusa-server
    restart: unless-stopped
    env_file:
      - .env.backend
    environment:
      MEDUSA_WORKER_MODE: server
      DISABLE_MEDUSA_ADMIN: "false"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    ports:
      - "127.0.0.1:9000:9000"
    networks:
      - commerce

  medusa-worker:
    build:
      context: ./${BACKEND_DIR}
    container_name: medusa-worker
    restart: unless-stopped
    env_file:
      - .env.backend
    environment:
      MEDUSA_WORKER_MODE: worker
      DISABLE_MEDUSA_ADMIN: "true"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - commerce

  storefront:
    build:
      context: ./${STOREFRONT_DIR}
    container_name: storefront
    restart: unless-stopped
    env_file:
      - .env.frontend
    depends_on:
      - medusa-server
    ports:
      - "127.0.0.1:3000:3000"
    networks:
      - commerce

volumes:
  postgres_data:
  redis_data:

networks:
  commerce:
    driver: bridge
EOF
)

write_file "docker-compose.prod.yml" "$COMPOSE_CONTENT"

echo "==> Generating backend Dockerfile if needed"

BACKEND_DOCKERFILE=$(cat <<EOF
FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.medusa/server ./

RUN npm install --omit=dev

EXPOSE 9000

CMD ["sh", "-c", "npm run predeploy && npm run start"]
EOF
)

write_file "${BACKEND_DIR}/Dockerfile" "$BACKEND_DOCKERFILE"

echo "==> Generating storefront Dockerfile if needed"

STOREFRONT_DOCKERFILE=$(cat <<EOF
FROM node:${NODE_VERSION}-alpine AS deps

WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:${NODE_VERSION}-alpine AS builder

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:${NODE_VERSION}-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
EOF
)

write_file "${STOREFRONT_DIR}/Dockerfile" "$STOREFRONT_DOCKERFILE"

echo "==> Checking Next.js standalone output config"
NEXT_CONFIG_FOUND="false"
for cfg in "${STOREFRONT_DIR}/next.config.js" "${STOREFRONT_DIR}/next.config.mjs" "${STOREFRONT_DIR}/next.config.ts"; do
  if [[ -f "$cfg" ]]; then
    NEXT_CONFIG_FOUND="true"
    if ! grep -q "output.*standalone" "$cfg"; then
      echo "WARNING: $cfg exists but does not appear to contain: output: 'standalone'"
      echo "         Add output: 'standalone' to make the generated Dockerfile work."
    fi
  fi
done

if [[ "$NEXT_CONFIG_FOUND" == "false" ]]; then
  write_file "${STOREFRONT_DIR}/next.config.js" "const nextConfig = {
  output: 'standalone',
}

module.exports = nextConfig
"
fi

echo "==> Checking Medusa package scripts"
if [[ -f "${BACKEND_DIR}/package.json" ]]; then
  if ! grep -q '"predeploy"' "${BACKEND_DIR}/package.json"; then
    echo "WARNING: ${BACKEND_DIR}/package.json does not appear to contain a predeploy script."
    echo "Add this to scripts:"
    echo '  "predeploy": "medusa db:migrate"'
  fi
fi

echo "==> Generating Nginx config"

NGINX_CONTENT=$(cat <<EOF
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}

server {
    listen 80;
    server_name ${API_DOMAIN};

    client_max_body_size 50M;

    location / {
        proxy_pass http://127.0.0.1:9000;
        proxy_http_version 1.1;

        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF
)

TMP_NGINX="/tmp/${APP_NAME}.nginx"
printf "%s" "$NGINX_CONTENT" > "$TMP_NGINX"
$SUDO cp "$TMP_NGINX" "/etc/nginx/sites-available/${APP_NAME}"
$SUDO ln -sf "/etc/nginx/sites-available/${APP_NAME}" "/etc/nginx/sites-enabled/${APP_NAME}"
$SUDO rm -f /etc/nginx/sites-enabled/default

$SUDO nginx -t
$SUDO systemctl reload nginx

echo "==> Building and starting Docker containers"
docker compose -f docker-compose.prod.yml up -d --build --remove-orphans

echo "==> Waiting for Medusa health endpoint"
set +e
for i in {1..40}; do
  HEALTH="$(curl -fsS http://127.0.0.1:9000/health 2>/dev/null || true)"
  if [[ "$HEALTH" == "OK" ]]; then
    echo "Medusa health check OK"
    break
  fi
  sleep 3
done
set -e

if [[ "${HEALTH:-}" != "OK" ]]; then
  echo "WARNING: Medusa did not return OK at /health yet."
  echo "Check logs with:"
  echo "  docker compose -f docker-compose.prod.yml logs -f medusa-server"
fi

if [[ "$SKIP_SSL" != "true" ]]; then
  echo "==> Installing Certbot and issuing SSL certificates"
  if ! need_cmd certbot; then
    $SUDO snap install --classic certbot
    $SUDO ln -sf /snap/bin/certbot /usr/local/bin/certbot
  fi

  $SUDO certbot --nginx \
    -d "$DOMAIN" \
    -d "www.${DOMAIN}" \
    -d "$API_DOMAIN" \
    --non-interactive \
    --agree-tos \
    -m "$ADMIN_EMAIL" \
    --redirect || {
      echo "WARNING: Certbot failed."
      echo "Most common causes:"
      echo "1. DNS A records do not point to this VPS yet."
      echo "2. Ports 80/443 are blocked."
      echo "3. Domain has not propagated."
      echo "You can retry later:"
      echo "  sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} -d ${API_DOMAIN}"
    }

  $SUDO systemctl reload nginx || true
else
  echo "Skipping SSL because --skip-ssl was provided."
fi

if [[ "$CREATE_ADMIN" == "true" ]]; then
  echo "==> Creating Medusa admin user"
  set +e
  docker compose -f docker-compose.prod.yml exec -T medusa-server npx medusa user -e "$ADMIN_EMAIL" -p "$MEDUSA_ADMIN_PASSWORD"
  ADMIN_CREATE_EXIT=$?
  set -e

  if [[ "$ADMIN_CREATE_EXIT" -ne 0 ]]; then
    echo "WARNING: Could not create Medusa admin user automatically."
    echo "You can run manually:"
    echo "  docker compose -f docker-compose.prod.yml exec medusa-server npx medusa user -e ${ADMIN_EMAIL} -p 'YOUR_PASSWORD'"
  fi
fi

echo "==> Creating backup helper scripts"
mkdir -p scripts

BACKUP_SCRIPT=$(cat <<'EOF'
#!/usr/bin/env bash
set -Eeuo pipefail
mkdir -p /opt/backups/postgres
docker exec medusa-postgres pg_dump -U medusa medusa > "/opt/backups/postgres/medusa_$(date +%F_%H-%M).sql"
find /opt/backups/postgres -name "medusa_*.sql" -type f -mtime +14 -delete
EOF
)

write_file "scripts/backup-postgres.sh" "$BACKUP_SCRIPT"
chmod +x scripts/backup-postgres.sh

echo "==> Install finished"
echo ""
echo "Storefront: https://${DOMAIN}"
echo "API health: https://${API_DOMAIN}/health"
echo "Admin:      https://${API_DOMAIN}/app"
echo ""
if [[ "$CREATE_ADMIN" == "true" ]]; then
  echo "Medusa admin email:    ${ADMIN_EMAIL}"
  echo "Medusa admin password: ${MEDUSA_ADMIN_PASSWORD}"
  echo ""
  echo "SAVE THIS PASSWORD NOW. It will not be printed again."
fi
echo ""
echo "Useful commands:"
echo "  docker compose -f docker-compose.prod.yml ps"
echo "  docker compose -f docker-compose.prod.yml logs -f medusa-server"
echo "  docker compose -f docker-compose.prod.yml logs -f storefront"
echo "  bash scripts/backup-postgres.sh"
echo ""
echo "Recommended cron for daily DB backups:"
echo "  0 3 * * * cd ${REPO_ROOT} && bash scripts/backup-postgres.sh"
echo ""
echo "If Docker permission fails, log out and back in, then rerun the script."
