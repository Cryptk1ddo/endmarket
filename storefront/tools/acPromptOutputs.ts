import {
  acPromptCatalog,
  type AcPromptCatalogEntry,
} from "./acPromptCatalog.js";

export interface BentoCardCopy {
  value: string;
  label: string;
}

export interface RecommendedCopyPack {
  primaryHeadline: string;
  comfortHeadline: string;
  sleepHeadline?: string;
  smartHomeHeadline?: string;
  weatherHeadline: string;
  controlHeadline: string;
  editorialHeadline?: string;
  body: string;
  smartHomeBody?: string;
  shortTagline: string;
  productLabel: string[];
  bentoCards: BentoCardCopy[];
}

export interface AcCampaignPromptOutput {
  slug: string;
  name: string;
  output: {
    campaignDirection: {
      productClass: AcPromptCatalogEntry["productClass"];
      primaryIdea: string;
      secondaryIdea?: string;
      smartHomeIdea?: string;
      useCase: string;
    };
    recommendedCopy: RecommendedCopyPack;
    promptA: string;
    promptB: string;
    promptC: string;
    promptD: string;
    promptE: string | null;
    universalNegativePrompt: string;
    notesForBetterResults: string[];
  };
}

const UNIVERSAL_NEGATIVE_PROMPT =
  "Avoid distorted product geometry, incorrect number of fans, unreadable text, misspelled Cyrillic, random logos, extra buttons, cluttered layouts, cheap showroom look, heavy blur, fake sci-fi holograms, exaggerated airflow beams, icy blue effects, cartoon style, oversaturated colors, overexposed white product surfaces, unrealistic reflections, messy bento grid, inconsistent icon spacing, cramped typography, duplicate logos, bottom bars unless requested, and generic stock-photo appearance.";

function unique(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))];
}

function parseNumber(source: string): number {
  const match = source.replace(/,/g, ".").match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
}

function areaNumber(entry: AcPromptCatalogEntry): number {
  return parseNumber(entry.recommendedRoomSize);
}

function noiseNumber(entry: AcPromptCatalogEntry): number {
  return parseNumber(entry.noiseLevel);
}

function hasWinterHeating(entry: AcPromptCatalogEntry): boolean {
  return /−|-/u.test(entry.heatingPower) || entry.mainProductBenefits.some((item) => /winter|heating down to/i.test(item));
}

function isQuiet(entry: AcPromptCatalogEntry): boolean {
  return noiseNumber(entry) > 0 && noiseNumber(entry) <= 22;
}

function isCommercial(entry: AcPromptCatalogEntry): boolean {
  return entry.productClass === "ducted/cassette/commercial AC";
}

function isSmart(entry: AcPromptCatalogEntry): boolean {
  return entry.voiceAssistants.length > 0 || entry.compatibleEcosystems.length > 0 || !/Not specified/i.test(entry.wiFiAppControl);
}

function productCategoryLabel(entry: AcPromptCatalogEntry): string {
  if (/cassette/i.test(entry.productType)) return "Кассетная сплит-система";
  if (/ducted/i.test(entry.productType) || /concealed/i.test(entry.productType)) return "Канальная сплит-система";
  if (/floor-ceiling/i.test(entry.productType)) return "Напольно-потолочная сплит-система";
  return "Сплит-система";
}

function shortTagline(entry: AcPromptCatalogEntry): string {
  if (isCommercial(entry)) return "Контролируемый климат для требовательных пространств";
  if (isSmart(entry)) return "Точный климат, подключённый к вашему сценарию жизни";
  if (isQuiet(entry)) return "Тихий климат для спокойного ритма дома";
  return "Комфортный климат в сдержанной технологичной форме";
}

function assistantLabel(name: string): string {
  switch (name) {
    case "Alice":
      return "Алисой";
    case "Marusya":
      return "Марусей";
    case "Google Assistant":
      return "Google Assistant";
    case "Apple HomeKit":
      return "Apple HomeKit";
    case "HOMMYN":
      return "HOMMYN";
    default:
      return name;
  }
}

function formatRussianList(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} и ${items[1]}`;

  return `${items.slice(0, -1).join(", ")} и ${items.at(-1)}`;
}

function smartControlPhrase(entry: AcPromptCatalogEntry): string {
  if (/Not specified/i.test(entry.wiFiAppControl)) return "по сценариям автоматизации";
  if (/Ballu Home/i.test(entry.wiFiAppControl)) return "через приложение Ballu Home";
  if (/hOn/i.test(entry.wiFiAppControl)) return "через приложение hOn";
  if (/Hi-Smart/i.test(entry.wiFiAppControl)) return "через приложение Hi-Smart";
  if (/optional|опцион/i.test(entry.wiFiAppControl)) return "через опциональный Wi-Fi модуль";
  if (/Wi-Fi|Встроенный/i.test(entry.wiFiAppControl)) return "по Wi-Fi";

  return entry.wiFiAppControl;
}

function headlinePack(entry: AcPromptCatalogEntry): Omit<RecommendedCopyPack, "body" | "smartHomeBody" | "shortTagline" | "productLabel" | "bentoCards"> {
  const comfortHeadline = hasWinterHeating(entry)
    ? "Комфорт внутри.\nВ любую погоду."
    : "Комфорт внутри.\nКаждый день.";

  const weatherHeadline = "Снаружи — погода.\nВнутри — ваш климат.";
  const controlHeadline = "Ваш климат.\nВаши правила.";
  const smartHomeHeadline = isSmart(entry) ? "Умный климат\nв вашей экосистеме" : undefined;
  const sleepHeadline = isQuiet(entry) ? "Тихий климат\nдля сна" : undefined;
  const editorialHeadline = entry.productClass === "smart-home climate product"
    ? "Климат, который\nработает незаметно"
    : isCommercial(entry)
      ? "Контролируемый климат\nдля больших пространств"
      : "Климат, который\nработает незаметно";

  let primaryHeadline = comfortHeadline;
  if (isCommercial(entry)) primaryHeadline = "Контролируемый климат\nдля больших пространств";
  else if (isSmart(entry) && smartHomeHeadline) primaryHeadline = smartHomeHeadline;
  else if (isQuiet(entry) && sleepHeadline) primaryHeadline = sleepHeadline;

  return {
    primaryHeadline,
    comfortHeadline,
    sleepHeadline,
    smartHomeHeadline,
    weatherHeadline,
    controlHeadline,
    editorialHeadline,
  };
}

function bodyCopy(entry: AcPromptCatalogEntry): string {
  const clauses = [
    `охлаждение ${entry.coolingPower}`,
    `обогрев ${entry.heatingPower}`,
    `${entry.noiseLevel} работы внутреннего блока`,
    `энергоэффективность ${entry.energyClass}`,
  ];

  if (entry.specialFunctions.some((item) => /i-Feel/i.test(item))) {
    clauses[3] = "точный контроль температуры с i-Feel";
  }
  if (isCommercial(entry)) {
    clauses[2] = `${entry.recommendedRoomSize} покрытия`;
    clauses[3] = entry.specialFunctions.find((item) => /4-|давление|BACnet|D-BACS/i.test(item)) ?? `энергоэффективность ${entry.energyClass}`;
  }

  return `${entry.brand} ${entry.model} ${entry.series} поддерживает комфортный климат: ${clauses.slice(0, 3).join(", ")} и ${clauses[3]}.`;
}

function smartHomeBody(entry: AcPromptCatalogEntry): string | undefined {
  if (!isSmart(entry)) return undefined;

  const systems = unique([
    ...entry.voiceAssistants.map(assistantLabel),
    ...entry.compatibleEcosystems,
  ]);

  const systemLabel = systems.length > 0 ? formatRussianList(systems) : "экосистемами умного дома";

  return `${entry.brand} ${entry.model} поддерживает управление ${smartControlPhrase(entry)} и совместим с ${systemLabel}. Настраивайте температуру голосом, со смартфона и по сценариям автоматизации.`;
}

function formatSpecValue(source: string): string {
  return source
    .replace(/^до\s+/i, "до ")
    .replace(/^от\s+/i, "от ");
}

function bentoCards(entry: AcPromptCatalogEntry): BentoCardCopy[] {
  const cards: BentoCardCopy[] = [
    { value: formatSpecValue(entry.noiseLevel), label: isCommercial(entry) ? "Шум блока" : "Тихая работа" },
    { value: formatSpecValue(entry.recommendedRoomSize), label: isCommercial(entry) ? "Площадь покрытия" : "Для комнаты" },
    { value: entry.coolingPower.split("(")[0].trim(), label: "Охлаждение" },
    { value: entry.heatingPower, label: "Обогрев" },
    { value: entry.energyClass, label: "Энергоэффективность" },
    { value: entry.refrigerant, label: "Хладагент" },
  ];

  if (isSmart(entry)) {
    cards.push({ value: /Not specified/i.test(entry.wiFiAppControl) ? "Smart" : "Wi-Fi", label: "Управление" });
  }

  const featureMap = entry.specialFunctions.find((item) => /i-Feel/i.test(item))
    ? { value: "i-Feel", label: "Точный контроль" }
    : entry.specialFunctions.find((item) => /Sleep/i.test(item))
      ? { value: "Sleep", label: "Комфортный сон" }
      : entry.specialFunctions.find((item) => /4-сторонний|4-way/i.test(item))
        ? { value: "4-way", label: "Равномерный обдув" }
        : entry.specialFunctions.find((item) => /Flash Streamer/i.test(item))
          ? { value: "Streamer", label: "Очистка воздуха" }
          : entry.specialFunctions.find((item) => /PM2.5|PM 2.5/i.test(item))
            ? { value: "PM2.5", label: "Фильтрация" }
            : undefined;

  if (featureMap) cards.push(featureMap);

  return cards.slice(0, 8);
}

function roomScene(entry: AcPromptCatalogEntry): string {
  if (isCommercial(entry)) {
    if (/floor-ceiling/i.test(entry.productType)) return "premium open-plan office or gallery interior";
    if (/cassette/i.test(entry.productType)) return "hotel lobby or premium retail interior";
    return "architectural commercial interior";
  }

  if (areaNumber(entry) <= 25 || isQuiet(entry)) return "bedroom";
  return "living room";
}

function outsideCondition(entry: AcPromptCatalogEntry): string {
  if (hasWinterHeating(entry)) return "cold winter dusk with snow and frost";
  if (isCommercial(entry)) return "humid summer evening after rain";
  return "summer city heat and humidity";
}

function backgroundStyle(entry: AcPromptCatalogEntry): string {
  if (isCommercial(entry)) return "charcoal architectural texture with refined technical lighting";
  if (isSmart(entry)) return "warm minimal smart-home room with matte beige and charcoal surfaces";
  return "dark studio wall with a restrained black-to-charcoal gradient";
}

function featureLine(entry: AcPromptCatalogEntry): string {
  return bentoCards(entry)
    .slice(0, 5)
    .map((card) => `${card.value} — ${card.label}`)
    .join("; ");
}

function commercialPromptNote(entry: AcPromptCatalogEntry): string {
  if (!isCommercial(entry)) return "";

  return "Match the installation logic to the actual AC type: ceiling cassette in a suspended grid, floor-ceiling console suspended along the ceiling line, or concealed ducted module with visible grilles only where appropriate.";
}

function promptA(entry: AcPromptCatalogEntry, copy: RecommendedCopyPack): string {
  return `Create a premium vertical product advertisement for ${entry.brand} ${entry.model}, a ${entry.productType}, in the style of a high-end HVAC technology campaign.

Use a dark black-to-charcoal gradient studio background with subtle smoky lighting, soft shadows, and a cinematic spotlight behind the product. The composition should feel sleek, modern, minimal, technical, and trustworthy.

Place the product on the right side of the image, sitting on a low dark platform or integrated into a premium architectural wall. Render it photorealistically with sharp edges, realistic materials, soft reflections, and natural shadows. The product should not be overexposed or floating unnaturally.

Show the product design accurately:
${entry.visualDesign}

Top-left:
${entry.brand} logo only once.

Headline:
${copy.primaryHeadline}

Body copy:
${copy.body}

Feature icons:
${featureLine(entry)}

Bottom label:
${entry.model}
${productCategoryLabel(entry)}
${entry.series}

Use clean spacing, precise alignment, premium typography, and a luxury technology aesthetic.

Aspect ratio: ${entry.aspectRatio}
Quality: photorealistic, ultra-detailed, premium commercial image, 8K quality look.`;
}

function promptB(entry: AcPromptCatalogEntry, copy: RecommendedCopyPack): string {
  return `Create a premium lifestyle advertising image for ${entry.brand} ${entry.model}, built around the idea of ${entry.campaignDirection.primaryIdea}.

The image should communicate:
Outside: discomfort, heat, humidity, city pressure, or bad weather.
Inside: silence, comfort, rest, control.

Scene:
Show a luxury modern ${roomScene(entry)} in the evening or at night. The atmosphere should feel calm, exclusive, cinematic, and controlled. The room should look like a refuge from the outside world.

Mount the ${entry.name} naturally in the scene as part of the interior. It should be visible, elegant, and integrated into the composition, not oversized, but clearly responsible for the room’s comfort.

Through a large window, show ${outsideCondition(entry)}. Inside, everything is serene, balanced, and comfortable.

Interior:
Use refined materials: dark wood, soft stone, matte surfaces, elegant textiles, premium seating or bedding, subtle ambient lighting, restrained decor, clean composition.

Human presence:
Optional: include one relaxed person only, not posing. They may be sleeping, reading, working calmly, or resting.

Air cues:
Suggest airflow subtly with a curtain or light fabric moving slightly. Do not use fake icy beams or exaggerated wind graphics.

Headline:
${copy.sleepHeadline ?? copy.comfortHeadline}

Body:
${copy.body}

Product label:
${entry.model}
${productCategoryLabel(entry)}
${entry.series}

Aspect ratio: ${entry.aspectRatio}
Style: photorealistic, premium advertising photography, editorial composition, realistic materials, high detail.`;
}

function promptC(entry: AcPromptCatalogEntry, copy: RecommendedCopyPack): string {
  return `Create a premium exterior lifestyle advertisement for ${entry.brand} ${entry.model}, inspired by a calm architectural weather-contrast scene.

Show a modern private house or premium apartment façade with large panoramic glass windows, dark architectural lines, and refined minimalist design. ${isCommercial(entry) ? "For commercial systems, the façade can belong to a boutique office, hotel, or hospitality venue." : ""}

The exterior should show ${outsideCondition(entry)}. The interior behind the glass should look warm, peaceful, and protected.

Place the outdoor unit outside near the façade, naturally installed close to the wall, on a small base or low platform. It should feel durable, realistic, and subtly branded. ${isCommercial(entry) ? commercialPromptNote(entry) : ""}

Through the glass windows, show cozy interior cues: warm ambient lighting, wood or textile textures, calm furniture silhouettes, and a protected indoor climate.

Core message:
Outside: weather.
Inside: your climate.

Headline:
${copy.weatherHeadline}

Body:
${copy.body}

Product label:
${entry.model}
${productCategoryLabel(entry)}
${entry.series}

Visual style:
Premium architectural lifestyle campaign, cinematic dusk lighting, soft natural shadows, warm interior glow, cool exterior tones.

Aspect ratio: ${entry.aspectRatio}
Quality: photorealistic, ultra-detailed, high-end HVAC campaign.`;
}

function promptD(entry: AcPromptCatalogEntry, copy: RecommendedCopyPack): string {
  const cards = copy.bentoCards.map((card) => `${card.value}\n${card.label}`).join("\n\n");

  return `Create a premium vertical product card advertisement for ${entry.brand} ${entry.model}, using a refined bento-grid layout.

Main concept:
A clean product-card layout with a large hero image of the ${entry.productType}, surrounded by a precise bento grid of feature cards.

The design should feel premium, calm, architectural, technically trustworthy, and easy to understand.

Background:
Use ${backgroundStyle(entry)}.

Hero product:
Show the product photorealistically and accurately. ${entry.visualDesign} Add natural shadows so it does not pop unnaturally. Avoid overexposed white surfaces.

Layout:
Top section:
Small ${entry.brand} logo once.
Short product title.
Very short tagline: ${copy.shortTagline}

Middle section:
Large hero product image.

Bottom section:
Bento grid with ${copy.bentoCards.length} rounded rectangular cards. Cards should be matte charcoal or frosted dark glass with subtle borders.

Bento cards:
${cards}

Typography:
Clean modern sans-serif. White text on dark cards. Large numbers for specs. Small supporting labels. Consistent spacing and alignment.

Aspect ratio: ${entry.aspectRatio}
Quality: photorealistic, ultra-detailed, premium product infographic, clean commercial layout.`;
}

function promptE(entry: AcPromptCatalogEntry, copy: RecommendedCopyPack): string | null {
  if (!isSmart(entry)) return null;

  const compatibility = unique([
    ...entry.voiceAssistants,
    ...entry.compatibleEcosystems,
  ]).join(", ") || "smart-home ecosystems";

  const smartList = unique([
    entry.specialFunctions.find((item) => /app|Wi-Fi|Smart/i.test(item)) || "управление со смартфона",
    entry.specialFunctions.find((item) => /Sleep/i.test(item)) || "режим сна",
    entry.specialFunctions.find((item) => /i-Feel|Air Sense|Intelligent Eye/i.test(item)) || "точный контроль температуры",
  ]).join("\n");

  return `Create a premium editorial advertising image for ${entry.brand} ${entry.model}, focused on smart-home compatibility and connected climate control.

Aspect ratio: ${entry.aspectRatio}.

Core idea:
The AC system is a smart connected climate device that works inside a modern smart home.

Message:
Control the climate by voice, smartphone, and automation scenarios.

Scene:
Show a modern premium apartment interior in the evening. Use warm ambient lighting, matte walls, soft shadows, minimal furniture, and a calm luxury smart-home atmosphere.

Mount the ${entry.name} naturally on the wall. It should be elegant, realistic, and integrated into the interior.

Include:
- smartphone on a table or in hand showing climate-control app UI
- Alice/Yandex or relevant smart speaker placed naturally in the environment
- subtle floating UI panel near the AC with temperature and modes
- small clean compatibility badges for ${compatibility}
- minimal voice-wave cue, not too bright or sci-fi

Important:
Use generous negative space.
Keep the layout editorial, not cluttered.
Use the brand logo only once at the top.
No bottom bar.
No excessive icons.
No overpacked UI.

Headline:
${copy.smartHomeHeadline ?? copy.controlHeadline}

Short body:
${copy.smartHomeBody ?? copy.body}

Small feature list:
${smartList}

UI details:
Temperature: 23°C
Modes: cooling, heating, sleep, auto.
Controls: fan speed, timer, schedule, i-Feel.

Visual style:
Premium, clean, modern, photorealistic, soft evening light, warm beige, charcoal, matte black, subtle blue UI accents.

Negative:
Avoid cluttered UI, too many floating elements, distorted Cyrillic, fake holograms, messy composition, cheap tech style, over-bright blue effects, exaggerated airflow beams.`;
}

function notesForBetterResults(entry: AcPromptCatalogEntry): string[] {
  const notes = [
    `Verify the exact product fascia and installation details against ${entry.sourceUrl} before final image generation.`,
    ...entry.dataQualityNotes,
  ];

  if (isCommercial(entry)) {
    notes.push("Commercial models should be shown in realistic ceiling, hospitality, office, or retail installations rather than residential bedrooms.");
  }
  if (entry.productType.includes("wall-mounted")) {
    notes.push("Keep wall-mounted units proportionate to the room and avoid floating them away from the wall plane.");
  }
  if (isSmart(entry)) {
    notes.push("Smart-home scenes should keep UI sparse and editorial; use one phone, one assistant device, and a restrained floating overlay only.");
  }

  return unique(notes);
}

export function generateAcCampaignPromptOutput(entry: AcPromptCatalogEntry): AcCampaignPromptOutput {
  const copy: RecommendedCopyPack = {
    ...headlinePack(entry),
    body: bodyCopy(entry),
    smartHomeBody: smartHomeBody(entry),
    shortTagline: shortTagline(entry),
    productLabel: [entry.model, productCategoryLabel(entry), entry.series],
    bentoCards: bentoCards(entry),
  };

  return {
    slug: entry.slug,
    name: entry.name,
    output: {
      campaignDirection: {
        productClass: entry.productClass,
        primaryIdea: entry.campaignDirection.primaryIdea,
        secondaryIdea: entry.campaignDirection.secondaryIdea,
        smartHomeIdea: entry.campaignDirection.smartHomeIdea,
        useCase: entry.useCase,
      },
      recommendedCopy: copy,
      promptA: promptA(entry, copy),
      promptB: promptB(entry, copy),
      promptC: promptC(entry, copy),
      promptD: promptD(entry, copy),
      promptE: promptE(entry, copy),
      universalNegativePrompt: `${UNIVERSAL_NEGATIVE_PROMPT} Also avoid: ${entry.mustAvoid.join(", ")}.`,
      notesForBetterResults: notesForBetterResults(entry),
    },
  };
}

export function formatAcCampaignPromptOutput(campaign: AcCampaignPromptOutput): string {
  const { output } = campaign;
  const bento = output.recommendedCopy.bentoCards
    .map((card) => `${card.value}\n${card.label}`)
    .join("\n\n");
  const notes = output.notesForBetterResults.map((note) => `- ${note}`).join("\n");

  return [
    "PRODUCT IMAGE PROMPT SYSTEM OUTPUT",
    "",
    "1. Campaign Direction",
    `Primary idea: ${output.campaignDirection.primaryIdea}`,
    output.campaignDirection.secondaryIdea ? `Secondary idea: ${output.campaignDirection.secondaryIdea}` : null,
    output.campaignDirection.smartHomeIdea ? `Smart-home idea: ${output.campaignDirection.smartHomeIdea}` : null,
    `Use case: ${output.campaignDirection.useCase}`,
    "",
    "2. Recommended Copy",
    `Primary headline: ${output.recommendedCopy.primaryHeadline}`,
    `Comfort headline: ${output.recommendedCopy.comfortHeadline}`,
    output.recommendedCopy.sleepHeadline ? `Sleep headline: ${output.recommendedCopy.sleepHeadline}` : null,
    output.recommendedCopy.smartHomeHeadline ? `Smart-home headline: ${output.recommendedCopy.smartHomeHeadline}` : null,
    `Weather headline: ${output.recommendedCopy.weatherHeadline}`,
    `Control headline: ${output.recommendedCopy.controlHeadline}`,
    output.recommendedCopy.editorialHeadline ? `Editorial headline: ${output.recommendedCopy.editorialHeadline}` : null,
    `Body copy: ${output.recommendedCopy.body}`,
    output.recommendedCopy.smartHomeBody ? `Smart-home body: ${output.recommendedCopy.smartHomeBody}` : null,
    `Short tagline: ${output.recommendedCopy.shortTagline}`,
    `Product label: ${output.recommendedCopy.productLabel.join(" | ")}`,
    "Bento cards:",
    bento,
    "",
    "3. Prompt A — Studio Product Hero",
    output.promptA,
    "",
    "4. Prompt B — Lifestyle Interior Comfort",
    output.promptB,
    "",
    "5. Prompt C — Exterior Weather Contrast",
    output.promptC,
    "",
    "6. Prompt D — Product Card + Bento Grid",
    output.promptD,
    "",
    "7. Prompt E — Smart Home Compatibility",
    output.promptE ?? "Not recommended for this product without verified smart-home support.",
    "",
    "8. Universal Negative Prompt",
    output.universalNegativePrompt,
    "",
    "9. Notes for Better Results",
    notes,
  ]
    .filter(Boolean)
    .join("\n");
}

export const featuredAcCampaignPromptOutputs = acPromptCatalog
  .filter((entry) => entry.featured)
  .map(generateAcCampaignPromptOutput);

export const allAcCampaignPromptOutputs = acPromptCatalog
  .map(generateAcCampaignPromptOutput);

export const allAcCampaignPromptOutputsBySlug = Object.fromEntries(
  allAcCampaignPromptOutputs.map((campaign) => [campaign.slug, campaign]),
) as Record<string, AcCampaignPromptOutput>;

export const formattedAllAcCampaignPromptOutputs = Object.fromEntries(
  allAcCampaignPromptOutputs.map((campaign) => [campaign.slug, formatAcCampaignPromptOutput(campaign)]),
) as Record<string, string>;

export const featuredAcCampaignPromptOutputsBySlug = Object.fromEntries(
  featuredAcCampaignPromptOutputs.map((campaign) => [campaign.slug, campaign]),
) as Record<string, AcCampaignPromptOutput>;

export const formattedFeaturedAcCampaignPromptOutputs = Object.fromEntries(
  featuredAcCampaignPromptOutputs.map((campaign) => [campaign.slug, formatAcCampaignPromptOutput(campaign)]),
) as Record<string, string>;