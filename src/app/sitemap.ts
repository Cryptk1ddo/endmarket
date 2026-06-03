import type { MetadataRoute } from "next";
import { products } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://endmarket.ru";
  const now = new Date();

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/collection`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/brands`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/installation`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    { url: `${base}/delivery`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/guarantee`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/showroom`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/designers`, lastModified: now, changeFrequency: "monthly", priority: 0.55 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    ...productUrls,
  ];
}
