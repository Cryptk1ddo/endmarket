import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

// Build CSP: tighten in prod (no unsafe-eval), keep localhost connect-src in dev
const csp = [
  "default-src 'self'",
  // Next.js inline scripts for hydration + Framer Motion + Yandex Metrica
  "script-src 'self' 'unsafe-inline' https://mc.yandex.ru" + (isProd ? "" : " 'unsafe-eval'"),
  "style-src 'self' 'unsafe-inline'",
  // Image sources: own domain + future R2 bucket + Metrica noscript pixel
  [
    "img-src 'self' data: blob: https://api.endmarket.ru https://media.endmarket.ru https://endmarket.ru https://www.endmarket.ru http://localhost:9000 https://localhost:9000 http://127.0.0.1:9000 https://127.0.0.1:9000 https://mc.yandex.ru",
    "https://mc.yandex.ru",
    isProd && process.env.R2_PUBLIC_URL ? process.env.R2_PUBLIC_URL : "",
    // Medusa/Strapi hosted images
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "",
    process.env.NEXT_PUBLIC_STRAPI_URL || "",
  ].filter(Boolean).join(" "),
  "font-src 'self' data:",
  // API connections: add prod URLs via env
  [
    "connect-src 'self' https://api.endmarket.ru https://endmarket.ru https://www.endmarket.ru https://media.endmarket.ru https://mc.yandex.ru",
    !isProd ? "http://localhost:9000 http://localhost:1337 http://localhost:7700 ws://localhost:3000 ws://localhost:*" : "",
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "",
    process.env.NEXT_PUBLIC_STRAPI_URL || "",
    process.env.NEXT_PUBLIC_MEILISEARCH_URL || "",
    "https://mc.yandex.ru",
  ].filter(Boolean).join(" "),
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Content-Security-Policy", value: csp },
  ...(isProd
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

// Parse hostname safely from an env URL; returns null if unset/invalid
function envHostname(key: string): string | null {
  const val = process.env[key];
  if (!val) return null;
  try { return new URL(val).hostname; } catch { return null; }
}

const nextConfig: NextConfig = {
  // Required for Docker standalone deployment
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // Medusa SDK runs server-side only — keep it out of the client bundle
  serverExternalPackages: ["@medusajs/js-sdk"],
  images: {
    unoptimized: true,
    remotePatterns: [
      // Medusa backend images (localhost in dev, prod URL in prod)
      { protocol: "http", hostname: "localhost", port: "9000" },
      // Strapi CMS images
      { protocol: "http", hostname: "localhost", port: "1337" },
      // Prod Medusa / Strapi (Railway)
      ...(envHostname("NEXT_PUBLIC_MEDUSA_BACKEND_URL")
        ? [{ protocol: "https" as const, hostname: envHostname("NEXT_PUBLIC_MEDUSA_BACKEND_URL")! }]
        : []),
      ...(envHostname("NEXT_PUBLIC_STRAPI_URL")
        ? [{ protocol: "https" as const, hostname: envHostname("NEXT_PUBLIC_STRAPI_URL")! }]
        : []),
      // Prod: R2/CDN bucket for product images
      ...(process.env.R2_PUBLIC_URL
        ? [{ protocol: "https" as const, hostname: new URL(process.env.R2_PUBLIC_URL).hostname }]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
