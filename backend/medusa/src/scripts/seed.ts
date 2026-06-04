/**
 * Medusa v2 seed script — idempotent, seeds ArtWater AC catalog (40 products)
 * Run: npm run seed (from backend/medusa)
 */
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import {
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createApiKeysWorkflow,
} from "@medusajs/core-flows"

type SeedLogger = {
  info: (message: string) => void
}

type ProductModuleService = {
  listProductCategories: (filters: unknown) => Promise<Array<{ id: string }>>
  listProducts: (...args: unknown[]) => Promise<Array<{ id: string; handle: string }>>
}

type RegionModuleService = {
  listRegions: (filters: unknown) => Promise<Array<{ id: string }>>
}

type SalesChannelModuleService = {
  listSalesChannels: (filters: unknown) => Promise<Array<{ id: string }>>
}

type ApiKeyModuleService = {
  listApiKeys: (filters: unknown) => Promise<Array<{ id: string }>>
}

type RemoteLinkService = {
  create: (data: unknown[]) => Promise<unknown>
}

// Price helper: RUB → kopecks
const rub = (n: number) => n * 100

const PRODUCTS = [
  // ── BALLU — настенные BSW ──────────────────────────────────────────────────
  {
    title: "Ballu BSW-07HN1",
    subtitle: "Настенный инверторный кондиционер, 7 BTU (20 м²)",
    handle: "ballu-bsw-07hn1",
    status: "published" as const,
    description: "Тихая работа от 19 дБ. Обогрев при −15 °C. Автоочистка испарителя.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(26900), currency_code: "rub" }] }],
    metadata: { brand: "Ballu", category: "nastennye", featured: "true", finish: "A+", material: "Инверторный компрессор" },
  },
  {
    title: "Ballu BSW-09HN1",
    subtitle: "Настенный инверторный кондиционер, 9 BTU (25 м²)",
    handle: "ballu-bsw-09hn1",
    status: "published" as const,
    description: "Оптимальный выбор для спальни и гостиной до 25 м².",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(31900), currency_code: "rub" }] }],
    metadata: { brand: "Ballu", category: "nastennye", featured: "true", finish: "A+", material: "Инверторный компрессор" },
  },
  {
    title: "Ballu BSW-12HN1",
    subtitle: "Настенный инверторный кондиционер, 12 BTU (35 м²)",
    handle: "ballu-bsw-12hn1",
    status: "published" as const,
    description: "Мощный инверторный агрегат для просторных помещений.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(38900), currency_code: "rub" }] }],
    metadata: { brand: "Ballu", category: "nastennye", featured: "false", finish: "A+", material: "Инверторный компрессор" },
  },
  {
    title: "Ballu BSW-18HN1",
    subtitle: "Настенный инверторный кондиционер, 18 BTU (50 м²)",
    handle: "ballu-bsw-18hn1",
    status: "published" as const,
    description: "Высокая производительность для больших открытых пространств.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(54900), currency_code: "rub" }] }],
    metadata: { brand: "Ballu", category: "nastennye", featured: "false", finish: "A", material: "Инверторный компрессор" },
  },
  // ── BALLU — настенные BSWI Ultra ──────────────────────────────────────────
  {
    title: "Ballu BSWI-09HN1",
    subtitle: "Настенный инвертор Ultra, 9 BTU (25 м²)",
    handle: "ballu-bswi-09hn1",
    status: "published" as const,
    description: "Серия Ultra с обогревом при −25 °C. Wi-Fi. Шум 20 дБ.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(49900), currency_code: "rub" }] }],
    metadata: { brand: "Ballu", category: "nastennye", featured: "false", finish: "A++", material: "Инверторный компрессор" },
  },
  {
    title: "Ballu BSWI-12HN1",
    subtitle: "Настенный инвертор Ultra, 12 BTU (35 м²)",
    handle: "ballu-bswi-12hn1",
    status: "published" as const,
    description: "Производительная модель с обогревом до −25 °C. Wi-Fi.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(58900), currency_code: "rub" }] }],
    metadata: { brand: "Ballu", category: "nastennye", featured: "false", finish: "A++", material: "Инверторный компрессор" },
  },
  {
    title: "Ballu BSWI-18HN1",
    subtitle: "Настенный инвертор Ultra, 18 BTU (50 м²)",
    handle: "ballu-bswi-18hn1",
    status: "published" as const,
    description: "Флагман серии Ultra для пространств до 50 м².",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(79900), currency_code: "rub" }] }],
    metadata: { brand: "Ballu", category: "nastennye", featured: "false", finish: "A++", material: "Инверторный компрессор" },
  },
  {
    title: "Ballu BSWI-24HN1",
    subtitle: "Настенный инвертор Ultra, 24 BTU (70 м²)",
    handle: "ballu-bswi-24hn1",
    status: "published" as const,
    description: "Максимальная мощность серии Ultra для зон до 70 м².",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(99900), currency_code: "rub" }] }],
    metadata: { brand: "Ballu", category: "nastennye", featured: "false", finish: "A+", material: "Инверторный компрессор" },
  },
  // ── BALLU — кассетные / канальные ─────────────────────────────────────────
  {
    title: "Ballu BLC-07HN1",
    subtitle: "Кассетный кондиционер, 7 BTU (20 м²)",
    handle: "ballu-blc-07hn1",
    status: "published" as const,
    description: "Потолочный кассетный блок для офисов и торговых залов.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(89900), currency_code: "rub" }] }],
    metadata: { brand: "Ballu", category: "kassetnye", featured: "false", finish: "A+", material: "Инверторный компрессор" },
  },
  {
    title: "Ballu BLD-09HN1",
    subtitle: "Канальный кондиционер, 9 BTU (25 м²)",
    handle: "ballu-bld-09hn1",
    status: "published" as const,
    description: "Скрытый канальный блок для межпотолочного пространства.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(84900), currency_code: "rub" }] }],
    metadata: { brand: "Ballu", category: "kanalnye", featured: "false", finish: "A+", material: "Инверторный компрессор" },
  },
  // ── HAIER — Tundra ────────────────────────────────────────────────────────
  {
    title: "Haier AS07TT4HRA",
    subtitle: "Haier Tundra, 7 BTU (20 м²)",
    handle: "haier-as07tt4hra",
    status: "published" as const,
    description: "Ультратонкий дизайн 172 мм. Самоочистка. Обогрев при −20 °C.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(33900), currency_code: "rub" }] }],
    metadata: { brand: "Haier", category: "nastennye", featured: "true", finish: "A++", material: "Инверторный компрессор DC" },
  },
  {
    title: "Haier AS09TT4HRA",
    subtitle: "Haier Tundra, 9 BTU (25 м²)",
    handle: "haier-as09tt4hra",
    status: "published" as const,
    description: "Наиболее продаваемая модель Tundra. Wi-Fi, голосовое управление.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(39900), currency_code: "rub" }] }],
    metadata: { brand: "Haier", category: "nastennye", featured: "true", finish: "A++", material: "Инверторный компрессор DC" },
  },
  {
    title: "Haier AS12TT4HRA",
    subtitle: "Haier Tundra, 12 BTU (35 м²)",
    handle: "haier-as12tt4hra",
    status: "published" as const,
    description: "Тихий и экономичный агрегат для гостиной или офиса до 35 м².",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(47900), currency_code: "rub" }] }],
    metadata: { brand: "Haier", category: "nastennye", featured: "false", finish: "A++", material: "Инверторный компрессор DC" },
  },
  {
    title: "Haier AS18TT4HRA",
    subtitle: "Haier Tundra, 18 BTU (50 м²)",
    handle: "haier-as18tt4hra",
    status: "published" as const,
    description: "Мощный агрегат для просторных зон с Wi-Fi управлением.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(67900), currency_code: "rub" }] }],
    metadata: { brand: "Haier", category: "nastennye", featured: "false", finish: "A+", material: "Инверторный компрессор DC" },
  },
  // ── HAIER — Expert Smart ──────────────────────────────────────────────────
  {
    title: "Haier AS07QM2HIA",
    subtitle: "Expert Smart, 7 BTU (20 м²)",
    handle: "haier-as07qm2hia",
    status: "published" as const,
    description: "Серия Expert Smart. A+++. Обогрев до −25 °C. Шум 16 дБ.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(52900), currency_code: "rub" }] }],
    metadata: { brand: "Haier", category: "nastennye", featured: "false", finish: "A+++", material: "Инверторный компрессор DC" },
  },
  {
    title: "Haier AS09QM2HIA",
    subtitle: "Expert Smart, 9 BTU (25 м²)",
    handle: "haier-as09qm2hia",
    status: "published" as const,
    description: "A+++, 16 дБ, датчики CO₂ и влажности. Haier Expert Smart.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(62900), currency_code: "rub" }] }],
    metadata: { brand: "Haier", category: "nastennye", featured: "false", finish: "A+++", material: "Инверторный компрессор DC" },
  },
  {
    title: "Haier AS12QM2HIA",
    subtitle: "Expert Smart, 12 BTU (35 м²)",
    handle: "haier-as12qm2hia",
    status: "published" as const,
    description: "Флагман Expert Smart для гостиных и офисов до 35 м².",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(74900), currency_code: "rub" }] }],
    metadata: { brand: "Haier", category: "nastennye", featured: "false", finish: "A+++", material: "Инверторный компрессор DC" },
  },
  {
    title: "Haier AS18QM2HIA",
    subtitle: "Expert Smart, 18 BTU (50 м²)",
    handle: "haier-as18qm2hia",
    status: "published" as const,
    description: "Максимальная мощность Expert Smart для пространств до 50 м².",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(94900), currency_code: "rub" }] }],
    metadata: { brand: "Haier", category: "nastennye", featured: "false", finish: "A+++", material: "Инверторный компрессор DC" },
  },
  // ── HAIER — кассетные / напольно-потолочные ───────────────────────────────
  {
    title: "Haier AB48S2SD1FA",
    subtitle: "Кассетный кондиционер, 48 BTU (140 м²)",
    handle: "haier-ab48s2sd1fa",
    status: "published" as const,
    description: "Мощный кассетный блок для торговых и представительских пространств.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(139900), currency_code: "rub" }] }],
    metadata: { brand: "Haier", category: "kassetnye", featured: "false", finish: "A", material: "Инверторный компрессор DC" },
  },
  {
    title: "Haier AC36CS1ERA",
    subtitle: "Напольно-потолочный кондиционер, 36 BTU (90 м²)",
    handle: "haier-ac36cs1era",
    status: "published" as const,
    description: "Мощная консольная система для торговых и офисных пространств.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(154900), currency_code: "rub" }] }],
    metadata: { brand: "Haier", category: "napolno-potolochnye", featured: "false", finish: "A", material: "Инверторный компрессор" },
  },
  // ── HISENSE — Hi-Comfort ───────────────────────────────────────────────────
  {
    title: "Hisense AS-07HR4SYDKG",
    subtitle: "Hi-Comfort, 7 BTU (20 м²)",
    handle: "hisense-as07hr4sydkg",
    status: "published" as const,
    description: "Надёжный бюджетный инвертор. Обогрев при −15 °C. Фильтр PM 2.5.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(28900), currency_code: "rub" }] }],
    metadata: { brand: "Hisense", category: "nastennye", featured: "true", finish: "A+", material: "Инверторный компрессор" },
  },
  {
    title: "Hisense AS-09HR4SYDKG",
    subtitle: "Hi-Comfort, 9 BTU (25 м²)",
    handle: "hisense-as09hr4sydkg",
    status: "published" as const,
    description: "Популярная модель с Wi-Fi. Самодиагностика системы.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(33900), currency_code: "rub" }] }],
    metadata: { brand: "Hisense", category: "nastennye", featured: "false", finish: "A+", material: "Инверторный компрессор" },
  },
  {
    title: "Hisense AS-12HR4SYDKG",
    subtitle: "Hi-Comfort, 12 BTU (35 м²)",
    handle: "hisense-as12hr4sydkg",
    status: "published" as const,
    description: "12 BTU с расширенным обогревом до −15 °C. Фильтр PM 2.5.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(40900), currency_code: "rub" }] }],
    metadata: { brand: "Hisense", category: "nastennye", featured: "false", finish: "A+", material: "Инверторный компрессор" },
  },
  {
    title: "Hisense AS-18HR4SYDKG",
    subtitle: "Hi-Comfort, 18 BTU (50 м²)",
    handle: "hisense-as18hr4sydkg",
    status: "published" as const,
    description: "Мощный агрегат для больших помещений. Автоочистка, Wi-Fi.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(56900), currency_code: "rub" }] }],
    metadata: { brand: "Hisense", category: "nastennye", featured: "false", finish: "A+", material: "Инверторный компрессор" },
  },
  // ── HISENSE — Expert ──────────────────────────────────────────────────────
  {
    title: "Hisense AS07QC4SVETG4",
    subtitle: "Expert, 7 BTU (20 м²)",
    handle: "hisense-as07qc4svetg4",
    status: "published" as const,
    description: "Серия Expert с обогревом при −25 °C. Wi-Fi, Air Sense.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(44900), currency_code: "rub" }] }],
    metadata: { brand: "Hisense", category: "nastennye", featured: "false", finish: "A++", material: "Инверторный компрессор DC" },
  },
  {
    title: "Hisense AS09QC4SVETG4",
    subtitle: "Expert, 9 BTU (25 м²)",
    handle: "hisense-as09qc4svetg4",
    status: "published" as const,
    description: "A++, 16 дБ, −25 °C. Hisense Expert.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(54900), currency_code: "rub" }] }],
    metadata: { brand: "Hisense", category: "nastennye", featured: "false", finish: "A++", material: "Инверторный компрессор DC" },
  },
  {
    title: "Hisense AS12QC4SVETG4",
    subtitle: "Expert, 12 BTU (35 м²)",
    handle: "hisense-as12qc4svetg4",
    status: "published" as const,
    description: "Флагман Expert для гостиных и офисов до 35 м².",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(64900), currency_code: "rub" }] }],
    metadata: { brand: "Hisense", category: "nastennye", featured: "false", finish: "A++", material: "Инверторный компрессор DC" },
  },
  {
    title: "Hisense AS18QC4SVETG4",
    subtitle: "Expert, 18 BTU (50 м²)",
    handle: "hisense-as18qc4svetg4",
    status: "published" as const,
    description: "Максимальная мощность Expert для пространств до 50 м².",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(79900), currency_code: "rub" }] }],
    metadata: { brand: "Hisense", category: "nastennye", featured: "false", finish: "A++", material: "Инверторный компрессор DC" },
  },
  // ── HISENSE — кассетные ───────────────────────────────────────────────────
  {
    title: "Hisense AS09UR4SXCDG",
    subtitle: "Кассетный кондиционер, 9 BTU (25 м²)",
    handle: "hisense-as09ur4sxcdg",
    status: "published" as const,
    description: "Кассетный блок для офисов и торговых зон с 4-сторонним обдувом.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(94900), currency_code: "rub" }] }],
    metadata: { brand: "Hisense", category: "kassetnye", featured: "false", finish: "A+", material: "Инверторный компрессор DC" },
  },
  {
    title: "Hisense AS12UR4SXCDG",
    subtitle: "Кассетный кондиционер, 12 BTU (35 м²)",
    handle: "hisense-as12ur4sxcdg",
    status: "published" as const,
    description: "Производительный кассет для помещений до 35 м².",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(109900), currency_code: "rub" }] }],
    metadata: { brand: "Hisense", category: "kassetnye", featured: "false", finish: "A+", material: "Инверторный компрессор DC" },
  },
  // ── DAIKIN — Sensira ──────────────────────────────────────────────────────
  {
    title: "Daikin FTXB20C",
    subtitle: "Sensira, 7 BTU (20 м²)",
    handle: "daikin-ftxb20c",
    status: "published" as const,
    description: "Японское качество в доступном формате. R-32. Обогрев при −15 °C.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(64900), currency_code: "rub" }] }],
    metadata: { brand: "Daikin", category: "nastennye", featured: "true", finish: "A+", material: "Инверторный компрессор Swing" },
  },
  {
    title: "Daikin FTXB25C",
    subtitle: "Sensira, 9 BTU (25 м²)",
    handle: "daikin-ftxb25c",
    status: "published" as const,
    description: "Оптимальная модель Sensira для спален и кабинетов.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(74900), currency_code: "rub" }] }],
    metadata: { brand: "Daikin", category: "nastennye", featured: "false", finish: "A+", material: "Инверторный компрессор Swing" },
  },
  {
    title: "Daikin FTXB35C",
    subtitle: "Sensira, 12 BTU (35 м²)",
    handle: "daikin-ftxb35c",
    status: "published" as const,
    description: "Производительная Sensira для гостиных и переговорных.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(89900), currency_code: "rub" }] }],
    metadata: { brand: "Daikin", category: "nastennye", featured: "false", finish: "A+", material: "Инверторный компрессор Swing" },
  },
  {
    title: "Daikin FTXB50C",
    subtitle: "Sensira, 18 BTU (50 м²)",
    handle: "daikin-ftxb50c",
    status: "published" as const,
    description: "Флагман Sensira для больших пространств до 50 м².",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(114900), currency_code: "rub" }] }],
    metadata: { brand: "Daikin", category: "nastennye", featured: "false", finish: "A+", material: "Инверторный компрессор Swing" },
  },
  // ── DAIKIN — Perfera ──────────────────────────────────────────────────────
  {
    title: "Daikin FTXF25D",
    subtitle: "Perfera, 9 BTU (25 м²)",
    handle: "daikin-ftxf25d",
    status: "published" as const,
    description: "Флагман Daikin. A+++, Flash Streamer, обогрев при −20 °C.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(129900), currency_code: "rub" }] }],
    metadata: { brand: "Daikin", category: "nastennye", featured: "true", finish: "A+++", material: "Инверторный компрессор Swing" },
  },
  {
    title: "Daikin FTXF35D",
    subtitle: "Perfera, 12 BTU (35 м²)",
    handle: "daikin-ftxf35d",
    status: "published" as const,
    description: "Perfera для гостиных и переговорных. A+++, Flash Streamer.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(149900), currency_code: "rub" }] }],
    metadata: { brand: "Daikin", category: "nastennye", featured: "false", finish: "A+++", material: "Инверторный компрессор Swing" },
  },
  {
    title: "Daikin FTXF50D",
    subtitle: "Perfera, 18 BTU (50 м²)",
    handle: "daikin-ftxf50d",
    status: "published" as const,
    description: "Флагман серии Perfera для больших пространств до 50 м².",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(174900), currency_code: "rub" }] }],
    metadata: { brand: "Daikin", category: "nastennye", featured: "false", finish: "A+++", material: "Инверторный компрессор Swing" },
  },
  // ── DAIKIN — Sky Air напольно-потолочные / кассетные / канальные ──────────
  {
    title: "Daikin FHA60A",
    subtitle: "Sky Air, напольно-потолочный, 21 BTU (60 м²)",
    handle: "daikin-fha60a",
    status: "published" as const,
    description: "Консольный блок Sky Air для больших пространств без подвесного потолка.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(119900), currency_code: "rub" }] }],
    metadata: { brand: "Daikin", category: "napolno-potolochnye", featured: "true", finish: "A+", material: "Инверторный компрессор" },
  },
  {
    title: "Daikin FBQ35D",
    subtitle: "Sky Air, кассетный, 12 BTU (35 м²)",
    handle: "daikin-fbq35d",
    status: "published" as const,
    description: "Кассетный блок Sky Air для офисов и торговых пространств.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(149900), currency_code: "rub" }] }],
    metadata: { brand: "Daikin", category: "kassetnye", featured: "false", finish: "A+", material: "Инверторный компрессор" },
  },
  {
    title: "Daikin FDXS25E",
    subtitle: "Sky Air, канальный, 9 BTU (25 м²)",
    handle: "daikin-fdxs25e",
    status: "published" as const,
    description: "Канальный блок Sky Air для скрытой установки в межпотолочном пространстве.",
    options: [{ title: "Комплектация", values: ["Стандарт"] }],
    variants: [{ title: "Стандарт", options: { "Комплектация": "Стандарт" }, prices: [{ amount: rub(129900), currency_code: "rub" }] }],
    metadata: { brand: "Daikin", category: "kanalnye", featured: "false", finish: "A+", material: "Инверторный компрессор" },
  },
]

const CATEGORIES = [
  { name: "Настенные",           handle: "nastennye",           is_active: true, is_internal: false },
  { name: "Кассетные",           handle: "kassetnye",           is_active: true, is_internal: false },
  { name: "Канальные",           handle: "kanalnye",            is_active: true, is_internal: false },
  { name: "Напольно-потолочные", handle: "napolno-potolochnye", is_active: true, is_internal: false },
]

const HANDLE_TO_CATEGORY: Record<string, string> = {
  // Ballu
  "ballu-bsw-07hn1":   "nastennye",
  "ballu-bsw-09hn1":   "nastennye",
  "ballu-bsw-12hn1":   "nastennye",
  "ballu-bsw-18hn1":   "nastennye",
  "ballu-bswi-09hn1":  "nastennye",
  "ballu-bswi-12hn1":  "nastennye",
  "ballu-bswi-18hn1":  "nastennye",
  "ballu-bswi-24hn1":  "nastennye",
  "ballu-blc-07hn1":   "kassetnye",
  "ballu-bld-09hn1":   "kanalnye",
  // Haier
  "haier-as07tt4hra":  "nastennye",
  "haier-as09tt4hra":  "nastennye",
  "haier-as12tt4hra":  "nastennye",
  "haier-as18tt4hra":  "nastennye",
  "haier-as07qm2hia":  "nastennye",
  "haier-as09qm2hia":  "nastennye",
  "haier-as12qm2hia":  "nastennye",
  "haier-as18qm2hia":  "nastennye",
  "haier-ab48s2sd1fa": "kassetnye",
  "haier-ac36cs1era":  "napolno-potolochnye",
  // Hisense
  "hisense-as07hr4sydkg":   "nastennye",
  "hisense-as09hr4sydkg":   "nastennye",
  "hisense-as12hr4sydkg":   "nastennye",
  "hisense-as18hr4sydkg":   "nastennye",
  "hisense-as07qc4svetg4":  "nastennye",
  "hisense-as09qc4svetg4":  "nastennye",
  "hisense-as12qc4svetg4":  "nastennye",
  "hisense-as18qc4svetg4":  "nastennye",
  "hisense-as09ur4sxcdg":   "kassetnye",
  "hisense-as12ur4sxcdg":   "kassetnye",
  // Daikin
  "daikin-ftxb20c":  "nastennye",
  "daikin-ftxb25c":  "nastennye",
  "daikin-ftxb35c":  "nastennye",
  "daikin-ftxb50c":  "nastennye",
  "daikin-ftxf25d":  "nastennye",
  "daikin-ftxf35d":  "nastennye",
  "daikin-ftxf50d":  "nastennye",
  "daikin-fha60a":   "napolno-potolochnye",
  "daikin-fbq35d":   "kassetnye",
  "daikin-fdxs25e":  "kanalnye",
}

export default async function seed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER) as SeedLogger
  const productModule = container.resolve(Modules.PRODUCT) as ProductModuleService
  const regionModule = container.resolve(Modules.REGION) as RegionModuleService
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL) as SalesChannelModuleService

  logger.info("TENDMARKET seed starting...")

  // ── Sales channel (idempotent) ──────────────────────────────────────────────
  const existingChannels = await salesChannelModule.listSalesChannels({ name: ["TENDMARKET Store"] })
  let salesChannelId: string
  if (existingChannels.length > 0) {
    salesChannelId = existingChannels[0].id
    logger.info(`Sales channel exists: ${salesChannelId}`)
  } else {
    const { result: scResult } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "TENDMARKET Store", description: "Main storefront" }] },
    })
    salesChannelId = scResult[0].id
    logger.info(`Created sales channel: ${salesChannelId}`)
  }

  // ── RUB region (idempotent) ─────────────────────────────────────────────────
  const existingRegions = await regionModule.listRegions({ name: ["Russia (RUB)"] })
  if (existingRegions.length === 0) {
    await createRegionsWorkflow(container).run({
      input: {
        regions: [{
          name: "Russia (RUB)",
          currency_code: "rub",
          countries: ["ru"],
        }],
      },
    })
    logger.info("Created RUB region")
  } else {
    logger.info("RUB region exists")
  }

  // ── Publishable API key (idempotent) ────────────────────────────────────────
  const apiKeyModule = container.resolve(Modules.API_KEY) as ApiKeyModuleService
  const existingKeys = await apiKeyModule.listApiKeys({ title: ["TENDMARKET Storefront"] })
  let apiKeyId: string
  if (existingKeys.length === 0) {
    const { result: keyResult } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [{
          title: "TENDMARKET Storefront",
          type: "publishable",
          created_by: "seed",
        }],
      },
    })
    apiKeyId = keyResult[0].id
    logger.info(`PUBLISHABLE_API_KEY=${keyResult[0].token}`)
    logger.info("^^ Add this to .env as NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY")
  } else {
    apiKeyId = existingKeys[0].id
    logger.info("Publishable API key exists (token only shown on first creation)")
  }

  // ── Link publishable key → sales channel ────────────────────────────────────
  try {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK) as RemoteLinkService
    await remoteLink.create([{
      [Modules.API_KEY]: { api_key_id: apiKeyId },
      [Modules.SALES_CHANNEL]: { sales_channel_id: salesChannelId },
    }])
    logger.info("Linked publishable key to sales channel")
  } catch (err: any) {
    logger.info(`Sales channel link note: ${err?.message ?? "already linked or skipped"}`)
  }

  // ── Categories (idempotent per-category) ────────────────────────────────────
  let categoryMap: Record<string, string> = {}
  for (const cat of CATEGORIES) {
    try {
      const { result: catResult } = await createProductCategoriesWorkflow(container).run({
        input: { product_categories: [cat] },
      })
      categoryMap[cat.handle] = catResult[0].id
      logger.info(`Created category: ${cat.handle}`)
    } catch (err: any) {
      if (err?.message?.includes("already exists")) {
        // fetch existing
        const existing = await productModule.listProductCategories({ handle: [cat.handle] } as any)
        if (existing.length > 0) {
          categoryMap[cat.handle] = existing[0].id
          logger.info(`Category exists: ${cat.handle} (${existing[0].id})`)
        }
      } else {
        throw err
      }
    }
  }

  // ── Products (skip existing handles) ───────────────────────────────────────
  const existingProducts = await productModule.listProducts({}, { select: ["id", "handle"] })
  const existingHandles = new Set(existingProducts.map((p) => p.handle))
  const newProducts = PRODUCTS.filter((p) => !existingHandles.has(p.handle))

  if (newProducts.length === 0) {
    logger.info("All products already seeded")
  } else {
    const productsWithCategories = newProducts.map((product) => {
      const categoryHandle = HANDLE_TO_CATEGORY[product.handle]
      return {
        ...product,
        categories: categoryHandle && categoryMap[categoryHandle]
          ? [{ id: categoryMap[categoryHandle] }]
          : [],
        sales_channels: [{ id: salesChannelId }],
      }
    })

    const { result: productResult } = await createProductsWorkflow(container).run({
      input: { products: productsWithCategories },
    })
    logger.info(`Created ${productResult.length} new products`)
  }

  logger.info("Seed complete ✓")
}
