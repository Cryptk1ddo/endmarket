import { defineConfig, loadEnv } from "@medusajs/framework/utils"

loadEnv(process.env.NODE_ENV || "development", process.cwd())

function requireSecret(name: string, fallback: string): string {
  const value = process.env[name]

  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`${name} is required in production`)
  }

  return value || fallback
}

export default defineConfig({
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
      storeCors:
        process.env.STORE_CORS ||
        "https://endmarket.ru,https://www.endmarket.ru,http://localhost:3000",
      adminCors:
        process.env.ADMIN_CORS ||
        "https://api.endmarket.ru,http://localhost:7000,http://localhost:7001",
      authCors:
        process.env.AUTH_CORS ||
        "https://api.endmarket.ru,https://endmarket.ru,https://www.endmarket.ru,http://localhost:3000,http://localhost:7000,http://localhost:7001",
      jwtSecret: requireSecret("JWT_SECRET", "dev-jwt-secret-change-in-prod"),
      cookieSecret: requireSecret(
        "COOKIE_SECRET",
        "dev-cookie-secret-change-in-prod"
      ),
    },
  },

  modules: [
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/file-s3",
            id: "s3",
            options: {
              file_url: process.env.S3_FILE_URL,
              access_key_id: process.env.S3_ACCESS_KEY_ID,
              secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
              region: process.env.S3_REGION || "auto",
              bucket: process.env.S3_BUCKET,
              endpoint: process.env.S3_ENDPOINT,
              additional_client_config: {
                forcePathStyle: true,
              },
            },
          },
        ],
      },
    },
  ],

  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    path: process.env.MEDUSA_ADMIN_PATH || "/dashboard",
    backendUrl: process.env.MEDUSA_BACKEND_URL || "https://api.endmarket.ru",
    storefrontUrl: process.env.MEDUSA_STOREFRONT_URL || "https://endmarket.ru",
  },
})
