
# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim AS builder

WORKDIR /app

ENV NODE_ENV=development

ENV npm_config_audit=false

ENV npm_config_fund=false

ENV MEDUSA_TELEMETRY_DISABLED=true

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \

    npm ci --no-audit --no-fund

COPY . .

RUN npm run build

FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

ENV npm_config_audit=false

ENV npm_config_fund=false

ENV MEDUSA_TELEMETRY_DISABLED=true

COPY package*.json ./

RUN --mount=type=cache,target=/root/.npm \

    npm ci --include=dev --no-audit --no-fund

COPY --from=builder /app/dist ./dist

COPY --from=builder /app/.medusa ./.medusa

COPY --from=builder /app/src ./src

COPY --from=builder /app/medusa-config.ts ./medusa-config.ts

COPY --from=builder /app/medusa-config.js ./medusa-config.js

COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 9000

CMD ["npm", "run", "start"]

