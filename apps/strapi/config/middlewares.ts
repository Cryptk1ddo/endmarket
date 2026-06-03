export default [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      headers: ["Content-Type", "Authorization", "Origin", "Accept"],
      methods: ["GET", "HEAD", "OPTIONS"],
      origin: [
        "http://localhost:3000",
        "http://localhost:1337",
        ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
      ],
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
]
