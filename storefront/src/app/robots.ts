import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/api/", "/profile"],
      },
      // OpenAI — ChatGPT, SearchGPT
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      // Anthropic — Claude
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      // Perplexity
      { userAgent: "PerplexityBot", allow: "/" },
      // Google — Gemini, AI Overviews
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      // Microsoft — Copilot, Bing AI
      { userAgent: "Bingbot", allow: "/" },
      { userAgent: "BingPreview", allow: "/" },
      // Meta — Llama, Meta AI
      { userAgent: "FacebookBot", allow: "/" },
      // Apple — Siri, Spotlight
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      // Cohere, AI21, Mistral
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "AI2Bot", allow: "/" },
      // Common research crawlers
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "DataForSeoBot", allow: "/" },
    ],
    sitemap: "https://endmarket.ru/sitemap.xml",
    host: "https://endmarket.ru",
  };
}
