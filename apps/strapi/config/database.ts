import path from "path"

export default ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "localhost"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "artwater_strapi"),
      user: env("DATABASE_USERNAME", process.env.USER),
      password: env("DATABASE_PASSWORD", ""),
      ssl: env.bool("DATABASE_SSL", false),
    },
    debug: false,
  },
})
