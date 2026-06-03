/**
 * Seed brands to Strapi via Content API
 * Run: node seed-brands.mjs
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337"
const TOKEN = process.env.STRAPI_ADMIN_TOKEN
if (!TOKEN) {
  console.error("Error: STRAPI_ADMIN_TOKEN env var required. Generate it in Strapi admin → Settings → API Tokens.")
  process.exit(1)
}

const brands = [
  {
    name: "Ballu",
    slug: "ballu",
    origin: "Россия / Китай",
    tagline: "Надёжность. Тишина. Точность.",
    description:
      "Ballu — ведущий российский бренд климатической техники. Инверторные сплит-системы с компрессорами Toshiba, класс A++, гарантия 3 года.",
    longDescription:
      "Ballu Industrial Group — один из крупнейших производителей климатической техники в России. Основанный в 1997 году, бренд выпускает полную линейку инверторных кондиционеров для жилых и коммерческих помещений. Компрессоры Toshiba, энергоэффективность класса A++, работа при −25°C снаружи. Ballu — выбор профессиональных инсталляторов.",
    featured: true,
    sortOrder: 1,
    websiteUrl: "https://www.ballu.ru",
    foundedYear: 1997,
    designPhilosophy: "Инженерная надёжность как основа комфорта",
  },
  {
    name: "Haier",
    slug: "haier",
    origin: "Китай",
    tagline: "Мировой лидер. Японские технологии.",
    description:
      "Haier — №1 в мире по производству бытовой техники. Серия Tibio: энергоэффективность A+++, встроенный Wi-Fi, работа при −30°C.",
    longDescription:
      "Haier Group — мировой лидер в производстве бытовой и климатической техники, основанный в 1984 году. Бренд представлен в более чем 100 странах. Серия сплит-систем Tibio сочетает скандинавскую эстетику с японскими инверторными технологиями: класс A+++, фильтр PM2.5, функция самодиагностики, управление через мобильное приложение. Официальный дистрибьютор в России — TENDMARKET.",
    featured: true,
    sortOrder: 2,
    websiteUrl: "https://www.haier.com/ru",
    foundedYear: 1984,
    designPhilosophy: "Глобальные технологии — локальный комфорт",
  },
  {
    name: "Hisense",
    slug: "hisense",
    origin: "Китай",
    tagline: "DC-инвертор. Тихо. Экономично.",
    description:
      "Hisense Energy Pro — DC-инверторные кондиционеры с ионизатором воздуха, фильтром HEPA и голосовым управлением через Алису.",
    longDescription:
      "Hisense основан в 1969 году в Циндао и входит в тройку крупнейших мировых производителей электроники. Серия Energy Pro использует DC-инверторную технологию нового поколения: снижение энергопотребления до 60%, уровень шума от 19 дБ, работа в режиме обогрева при −30°C. Встроенный ионизатор, фильтр HEPA и интеграция с экосистемой Яндекс — стандарт для российского рынка.",
    featured: true,
    sortOrder: 3,
    websiteUrl: "https://www.hisense.ru",
    foundedYear: 1969,
    designPhilosophy: "Технологии тишины: меньше шума, больше комфорта",
  },
]

async function seedBrands() {
  console.log("Seeding brands to Strapi...")

  // First check existing brands
  const existingRes = await fetch(`${STRAPI_URL}/api/brands?pagination[pageSize]=50`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  const existing = await existingRes.json()
  const existingSlugs = new Set((existing.data || []).map((b) => b.slug))
  console.log(`Found ${existingSlugs.size} existing brands:`, [...existingSlugs])

  for (const brand of brands) {
    if (existingSlugs.has(brand.slug)) {
      console.log(`  ✓ Skipping existing: ${brand.name}`)
      continue
    }

    const res = await fetch(`${STRAPI_URL}/api/brands`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          ...brand,
          publishedAt: new Date().toISOString(),
        },
      }),
    })

    const json = await res.json()
    if (res.ok) {
      console.log(`  ✓ Created: ${brand.name} (id: ${json.data?.id})`)
    } else {
      console.error(`  ✗ Failed: ${brand.name}`, JSON.stringify(json.error))
    }
  }

  console.log("Done.")
}

seedBrands().catch(console.error)
