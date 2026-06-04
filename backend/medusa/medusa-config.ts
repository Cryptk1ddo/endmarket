import { loadEnv, defineConfig } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

const isProd = process.env.NODE_ENV === "production"

function requireSecret(name: string, fallback: string): string {
  const val = process.env[name]
  if (!val) {
    if (isProd) throw new Error(`Missing required secret: ${name}`)
    return fallback
  }
  if (isProd && ["supersecret", "secret", "changeme"].includes(val.toLowerCase())) {
    throw new Error(`Insecure default for ${name} in production`)
  }
  return val
}

module.exports = defineConfig({
  admin: {
    disable: true,
    path: "/dashboard",
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: {
      pool: {
        min: 0,
        max: 50,
        acquireTimeoutMillis: 120000,
        createTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
      },
    },
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:3000,http://localhost:7001",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:7001",
      jwtSecret: requireSecret("JWT_SECRET", "dev-jwt-secret-change-in-prod"),
      cookieSecret: requireSecret("COOKIE_SECRET", "dev-cookie-secret-change-in-prod"),
    },
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  },
})
