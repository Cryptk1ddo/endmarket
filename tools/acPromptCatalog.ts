import { products, type Product } from "../src/lib/products.js";

export type PromptProductClass =
  | "split-system"
  | "ducted/cassette/commercial AC"
  | "smart-home climate product";

export type PromptTemplate =
  | "studio-hero"
  | "lifestyle-interior"
  | "exterior-weather"
  | "product-card-bento"
  | "smart-home";

export interface AcPromptCatalogEntry {
  slug: string;
  brand: Product["brand"];
  model: string;
  name: string;
  featured: boolean;
  productClass: PromptProductClass;
  productType: string;
  series: string;
  useCase: string;
  indoorUnitIncluded: boolean;
  outdoorUnitIncluded: boolean;
  visualDesign: string;
  mainProductBenefits: string[];
  coolingPower: string;
  heatingPower: string;
  recommendedRoomSize: string;
  noiseLevel: string;
  energyClass: string;
  refrigerant: string;
  wiFiAppControl: string;
  voiceAssistants: string[];
  compatibleEcosystems: string[];
  specialFunctions: string[];
  warrantyReliabilityClaims: string[];
  targetMarket: "Russia";
  languageForCopy: "Russian";
  preferredMood: string[];
  preferredEnvironment: string[];
  aspectRatio: "3:4";
  mustInclude: string[];
  mustAvoid: string[];
  recommendedTemplates: PromptTemplate[];
  campaignDirection: {
    primaryIdea: string;
    secondaryIdea?: string;
    smartHomeIdea?: string;
  };
  sourceUrl: string;
  referenceImages: string[];
  dataQualityNotes: string[];
}

interface SeriesProfile {
  series: string;
  productClass: PromptProductClass;
  productType: string;
  useCase: string;
  visualDesign: string;
  baseBenefits: string[];
  defaultSpecialFunctions: string[];
  defaultPreferredMood: string[];
  defaultPreferredEnvironment: string[];
  mustInclude: string[];
  mustAvoid: string[];
  defaultWiFi?: string;
  defaultVoiceAssistants?: string[];
  defaultEcosystems?: string[];
  notes?: string[];
}

const DEFAULT_TARGET_MARKET = "Russia" as const;
const DEFAULT_LANGUAGE = "Russian" as const;
const DEFAULT_ASPECT_RATIO = "3:4" as const;

const UNIVERSAL_MUST_AVOID = [
  "distorted product geometry",
  "wrong fan count or impossible vent layout",
  "duplicate logos",
  "misspelled Cyrillic",
  "fake icy airflow beams",
  "cheap showroom look",
  "overexposed white plastic",
  "floating indoor units",
  "cluttered UI overlays",
  "generic stock-photo styling",
  "sci-fi holograms",
];

const SERIES_PROFILES: Record<string, SeriesProfile> = {
  "ballu-bsw": {
    series: "Olympio Legend",
    productClass: "smart-home climate product",
    productType: "wall-mounted split-system AC",
    useCase: "quiet apartment cooling and heating for bedrooms, living rooms, and studies",
    visualDesign:
      "Slim glossy white wall unit with a straight turquoise accent line along the top edge, hidden lower discharge flap, a small LED temperature readout on the right, and soft rounded side caps.",
    baseBenefits: [
      "quiet private-room climate control",
      "inverter cooling and heating",
      "winter-ready comfort",
      "precise local temperature control",
    ],
    defaultSpecialFunctions: [
      "i-Feel",
      "Sleep mode",
      "self-cleaning",
      "timer",
      "4 fan speeds",
    ],
    defaultPreferredMood: ["premium", "calm", "architectural", "sleep-focused"],
    defaultPreferredEnvironment: [
      "modern apartment bedroom",
      "minimal living room",
      "winter house exterior",
    ],
    mustInclude: [
      "indoor unit mounted naturally on a wall",
      "outdoor condenser in exterior weather scenes",
      "warm interior contrast for winter campaigns",
    ],
    mustAvoid: ["fake blue airflow", "overpacked smart-home dashboards"],
    defaultWiFi: "Optional Wi-Fi module shown in internal campaign assets",
    defaultVoiceAssistants: ["Alice", "Marusya"],
    defaultEcosystems: ["HOMMYN", "Yandex Alice", "VK Marusya"],
    notes: [
      "Internal Ballu campaign assets show smart-home control and Russian ecosystem badges, but repo specs do not list Wi-Fi on every BSW model.",
    ],
  },
  "ballu-bswi": {
    series: "Ultra",
    productClass: "smart-home climate product",
    productType: "wall-mounted split-system AC",
    useCase: "premium wall-mounted home climate system for stronger winter heating and smart control",
    visualDesign:
      "Glossy white sculpted wall unit with a tapered body, rounded wraparound side cap, minimal front face, concealed lower flap, and a small front temperature display.",
    baseBenefits: [
      "strong low-temperature heating",
      "built-in Wi-Fi control",
      "premium quiet performance",
      "anti-bacterial air care",
    ],
    defaultSpecialFunctions: ["Ballu Home app", "Smart Heat", "Turbo mode"],
    defaultPreferredMood: ["premium", "technical", "smart-home", "winter-capable"],
    defaultPreferredEnvironment: [
      "premium apartment interior",
      "cold-climate house exterior",
      "quiet home office",
    ],
    mustInclude: [
      "smartphone climate-control UI in connected-control scenes",
      "clean premium wall installation",
      "winter exterior contrast for heating campaigns",
    ],
    mustAvoid: ["generic budget-home styling"],
    defaultWiFi: "Built-in Wi-Fi via Ballu Home app",
    defaultEcosystems: ["Ballu Home"],
    notes: [
      "Current reference asset is labeled Ballu Discovery rather than Ultra; verify the exact fascia against the manufacturer page before final rendering.",
    ],
  },
  "ballu-blc": {
    series: "BLC cassette",
    productClass: "ducted/cassette/commercial AC",
    productType: "cassette split-system AC",
    useCase: "ceiling-integrated climate control for offices, retail, and hospitality interiors",
    visualDesign:
      "Square white four-way cassette panel with a central intake grille, four slim outlet vanes, rounded inner frame, and an exposed galvanized plenum above the panel.",
    baseBenefits: [
      "four-way airflow coverage",
      "clean suspended-ceiling integration",
      "compact commercial installation",
    ],
    defaultSpecialFunctions: ["4-way airflow"],
    defaultPreferredMood: ["technical", "architectural", "trustworthy", "commercial-premium"],
    defaultPreferredEnvironment: [
      "premium office lobby",
      "retail showroom",
      "hotel reception",
    ],
    mustInclude: [
      "realistic suspended ceiling installation",
      "visible four-way cassette geometry",
    ],
    mustAvoid: ["residential bedroom staging"],
  },
  "ballu-bld": {
    series: "BLD ducted",
    productClass: "ducted/cassette/commercial AC",
    productType: "concealed ducted split-system AC",
    useCase: "hidden ceiling climate system for restaurants, boutiques, and premium commercial interiors",
    visualDesign:
      "Low-profile black and galvanized concealed duct module with a rectangular front opening, visible blue evaporator coil, and industrial technical finish.",
    baseBenefits: [
      "hidden installation",
      "clean air distribution through ducts",
      "quiet premium-commercial climate control",
    ],
    defaultSpecialFunctions: ["concealed ceiling installation", "static pressure support"],
    defaultPreferredMood: ["technical", "engineered", "architectural"],
    defaultPreferredEnvironment: [
      "restaurant ceiling plenum reveal",
      "boutique ceiling installation",
      "technical product studio",
    ],
    mustInclude: [
      "concealed or semi-concealed ceiling context",
      "air grilles or duct openings in lifestyle scenes",
    ],
    mustAvoid: ["showing the unit as a wall-mounted indoor block"],
  },
  "haier-tundra": {
    series: "Tundra",
    productClass: "smart-home climate product",
    productType: "wall-mounted split-system AC",
    useCase: "quiet everyday wall-mounted comfort for apartments and compact private homes",
    visualDesign:
      "Flat ultra-slim white wall unit with a clean monolithic fascia, centered Haier wordmark, tiny status indicators on the right, and a discreet lower discharge flap.",
    baseBenefits: [
      "ultra-slim wall presence",
      "quiet day-and-night operation",
      "self-cleaning everyday comfort",
      "winter-ready heating",
    ],
    defaultSpecialFunctions: ["Self-Clean"],
    defaultPreferredMood: ["clean", "trustworthy", "quiet", "modern"],
    defaultPreferredEnvironment: [
      "modern apartment bedroom",
      "minimal living room",
      "winter city apartment exterior",
    ],
    mustInclude: [
      "slim wall integration",
      "large glazing or urban window for contrast scenes",
    ],
    mustAvoid: ["futuristic smart-home styling"],
    notes: [
      "Current image file is named haier-tibio.jpg while repo copy identifies the series as Tundra; verify the final fascia on the manufacturer page.",
    ],
  },
  "haier-expert": {
    series: "Expert Smart",
    productClass: "smart-home climate product",
    productType: "wall-mounted split-system AC",
    useCase: "premium connected wall-mounted climate system with air-quality and comfort automation",
    visualDesign:
      "Premium flat white monolithic wall unit with sharp top intake slots, a crisp lower seam, and restrained branding for a clean, minimal tech look.",
    baseBenefits: [
      "premium quiet comfort",
      "A+++ efficiency",
      "smart sensing and air-quality automation",
      "low-temperature heating",
    ],
    defaultSpecialFunctions: ["smart sensors", "Self-Clean", "Fresh Air"],
    defaultPreferredMood: ["premium", "editorial", "smart-home", "wellness-focused"],
    defaultPreferredEnvironment: [
      "premium apartment interior",
      "minimal executive office",
      "winter private house",
    ],
    mustInclude: [
      "premium smartphone UI when showing connected control",
      "soft evening lighting",
      "clean luxury materials",
    ],
    mustAvoid: ["cheap blue-tech styling", "overloaded control dashboards"],
    defaultWiFi: "Built-in Wi-Fi",
    notes: [
      "Current reference asset is labeled Coral ECO DC rather than Expert Smart; verify the exact fascia against the manufacturer product page.",
    ],
  },
  "haier-cassette": {
    series: "Commercial cassette",
    productClass: "ducted/cassette/commercial AC",
    productType: "cassette split-system AC",
    useCase: "large-format ceiling climate system for retail, hospitality, and lobby spaces",
    visualDesign:
      "Square white cassette unit with a recessed dark central intake, wide perimeter outlet vanes, and a suspended dark-gray metal body above the visible panel.",
    baseBenefits: [
      "high-capacity commercial coverage",
      "four-way airflow",
      "building-system integration",
    ],
    defaultSpecialFunctions: ["BACnet integration", "4-way airflow"],
    defaultPreferredMood: ["technical", "commercial", "architectural"],
    defaultPreferredEnvironment: [
      "hotel lobby",
      "high-end restaurant",
      "premium retail hall",
    ],
    mustInclude: ["suspended ceiling context", "large open-plan commercial interior"],
    mustAvoid: ["domestic bedroom furniture"],
  },
  "haier-console": {
    series: "Floor-ceiling",
    productClass: "smart-home climate product",
    productType: "floor-ceiling split-system AC",
    useCase: "powerful open-space climate control for retail, office, and hospitality spaces",
    visualDesign:
      "Tall rectangular white floor-ceiling console with a central horizontal grille band, a small control panel on the upper right, and a lower return grille.",
    baseBenefits: [
      "large-room coverage",
      "dual airflow delivery",
      "flexible installation",
      "app-based control",
    ],
    defaultSpecialFunctions: ["dual airflow", "hOn app"],
    defaultPreferredMood: ["technical", "spacious", "clean", "commercial-premium"],
    defaultPreferredEnvironment: [
      "open office",
      "restaurant dining room",
      "retail showroom",
    ],
    mustInclude: [
      "large open-plan interior",
      "clear floor-ceiling installation context",
    ],
    mustAvoid: ["small domestic bedroom scenes"],
    defaultWiFi: "Built-in control via hOn app",
    defaultEcosystems: ["hOn"],
  },
  "hisense-hicomfort": {
    series: "Hi-Comfort",
    productClass: "smart-home climate product",
    productType: "wall-mounted split-system AC",
    useCase: "accessible residential split-system comfort for bedrooms, living rooms, and compact apartments",
    visualDesign:
      "Clean white wall-mounted indoor unit with a simple flat fascia, hidden lower discharge flap, compact silhouette, and understated front branding.",
    baseBenefits: [
      "practical everyday comfort",
      "quiet night operation",
      "cleaner indoor air",
      "reliable winter heating",
    ],
    defaultSpecialFunctions: ["Night Comfort", "PM2.5 filtration"],
    defaultPreferredMood: ["clean", "trustworthy", "practical", "calm"],
    defaultPreferredEnvironment: [
      "apartment bedroom",
      "compact living room",
      "budget-friendly modern home interior",
    ],
    mustInclude: ["simple uncluttered residential setting"],
    mustAvoid: ["luxury editorial excess"],
    notes: [
      "Current repo image is a placeholder card rather than a real product photo; verify the exact fascia on the manufacturer page before image generation.",
    ],
  },
  "hisense-expert": {
    series: "Expert",
    productClass: "smart-home climate product",
    productType: "wall-mounted split-system AC",
    useCase: "premium connected residential climate system with winter heating and quiet sleep focus",
    visualDesign:
      "Slim white wall unit with a flatter premium fascia, concealed display, hidden discharge seam, and understated branding.",
    baseBenefits: [
      "quiet premium comfort",
      "winter-ready heating",
      "smart connected control",
      "air-quality and hygiene focus",
    ],
    defaultSpecialFunctions: ["Air Sense", "Self-Clean", "Gold Fin"],
    defaultPreferredMood: ["premium", "technical", "smart-home", "winter-capable"],
    defaultPreferredEnvironment: [
      "premium apartment bedroom",
      "minimal living room",
      "snowy private house exterior",
    ],
    mustInclude: ["phone control UI in connected scenes", "clear winter contrast in exterior scenes"],
    mustAvoid: ["sci-fi UI", "over-bright blue effects"],
    defaultWiFi: "Built-in Wi-Fi",
    notes: [
      "Current repo image is a placeholder card rather than a real product photo; verify the exact fascia on the manufacturer page before image generation.",
    ],
  },
  "hisense-cassette": {
    series: "Cassette",
    productClass: "ducted/cassette/commercial AC",
    productType: "cassette split-system AC",
    useCase: "compact commercial cassette climate system for offices and hospitality interiors",
    visualDesign:
      "Square ceiling cassette panel with a central intake grille and four-way outlet geometry sized for suspended ceilings.",
    baseBenefits: [
      "ceiling-integrated coverage",
      "four-way airflow",
      "clean commercial installation",
    ],
    defaultSpecialFunctions: ["4-way airflow", "Hi-Smart control"],
    defaultPreferredMood: ["technical", "clean", "commercial"],
    defaultPreferredEnvironment: [
      "office meeting room",
      "restaurant dining area",
      "hotel corridor or lounge",
    ],
    mustInclude: ["suspended ceiling setting", "ceiling cassette panel clearly visible"],
    mustAvoid: ["wall-mounted product staging"],
    notes: [
      "Current repo image is a placeholder card rather than a real product photo; verify the exact panel design on the manufacturer page before image generation.",
    ],
  },
  "daikin-sensira": {
    series: "Sensira",
    productClass: "split-system",
    productType: "wall-mounted split-system AC",
    useCase: "quiet reliable Japanese-engineered residential climate system for bedrooms and living spaces",
    visualDesign:
      "Understated white wall unit with a gently curved lower lip, a small display-control block on the right, a sharp bottom outlet line, and a discrete Daikin logo on the left.",
    baseBenefits: [
      "quiet precise home comfort",
      "reliable swing-compressor engineering",
      "efficient R-32 operation",
      "draft-reducing airflow control",
    ],
    defaultSpecialFunctions: ["Coanda airflow", "weekly timer"],
    defaultPreferredMood: ["engineered", "minimal", "trustworthy", "calm"],
    defaultPreferredEnvironment: [
      "minimal apartment interior",
      "quiet home office",
      "winter private house exterior",
    ],
    mustInclude: ["natural shadows on white plastic", "restrained Japanese-tech aesthetic"],
    mustAvoid: ["flashy consumer-electronics styling"],
  },
  "daikin-perfera": {
    series: "Perfera",
    productClass: "smart-home climate product",
    productType: "wall-mounted split-system AC",
    useCase: "premium connected residential climate and air-purification system",
    visualDesign:
      "Refined white wall unit with a softly convex front panel, sculpted side caps, concealed lower outlet, and restrained Daikin branding for a premium engineered look.",
    baseBenefits: [
      "premium quiet comfort",
      "air-purification focus",
      "A+++ efficiency",
      "connected smart control",
    ],
    defaultSpecialFunctions: ["Flash Streamer", "Intelligent Eye"],
    defaultPreferredMood: ["premium", "editorial", "engineered", "wellness-focused"],
    defaultPreferredEnvironment: [
      "high-end apartment interior",
      "architectural bedroom",
      "winter villa exterior",
    ],
    mustInclude: ["premium editorial negative space", "wellness-oriented interior materials"],
    mustAvoid: ["cheap gadget look"],
    defaultWiFi: "Built-in Wi-Fi",
  },
  "daikin-fha": {
    series: "Sky Air FHA",
    productClass: "ducted/cassette/commercial AC",
    productType: "floor-ceiling split-system AC",
    useCase: "commercial floor-ceiling climate system for open spaces without suspended ceilings",
    visualDesign:
      "Long white ceiling-suspended console with a continuous wide discharge slot, vented underside, crisp commercial geometry, and rounded end caps.",
    baseBenefits: [
      "large-room coverage",
      "even three-stage airflow",
      "commercial flexibility where cassette install is impossible",
    ],
    defaultSpecialFunctions: ["3-stage airflow", "optional remote app module"],
    defaultPreferredMood: ["technical", "architectural", "commercial-premium"],
    defaultPreferredEnvironment: [
      "gallery-like retail hall",
      "open office",
      "restaurant dining room",
    ],
    mustInclude: ["ceiling-suspended installation", "open-plan commercial context"],
    mustAvoid: ["small apartment bedroom scenes"],
  },
  "daikin-fbq": {
    series: "Sky Air FBQ",
    productClass: "ducted/cassette/commercial AC",
    productType: "commercial ceiling-integrated AC",
    useCase: "commercial ceiling-integrated climate system for office and retail environments",
    visualDesign:
      "Rectangular concealed commercial ceiling unit in gray sheet metal with a dark front opening, exposed technical fittings, and a low-profile install-ready body.",
    baseBenefits: [
      "commercial ceiling integration",
      "centralized building control",
      "engineered office and retail performance",
    ],
    defaultSpecialFunctions: ["Daikin D-BACS centralized control"],
    defaultPreferredMood: ["technical", "engineered", "architectural"],
    defaultPreferredEnvironment: [
      "office ceiling integration",
      "retail back-of-ceiling reveal",
      "technical product studio",
    ],
    mustInclude: ["ceiling-integrated commercial context", "engineered installation details"],
    mustAvoid: ["showing the unit as a wall-mounted residential product"],
    notes: [
      "Repo copy labels FBQ35D as cassette, but the current asset is a concealed ceiling unit; verify the exact product family on the manufacturer page before generation.",
    ],
  },
  "daikin-fdxs": {
    series: "Sky Air FDXS-E",
    productClass: "ducted/cassette/commercial AC",
    productType: "concealed ducted split-system AC",
    useCase: "fully hidden ceiling ducted climate system for premium multi-room installations",
    visualDesign:
      "Slim concealed duct module in galvanized sheet metal with a dark internal coil cavity and low-profile technical construction for hidden ceiling installation.",
    baseBenefits: [
      "fully concealed installation",
      "multi-room air distribution",
      "quiet engineered climate control",
    ],
    defaultSpecialFunctions: ["G4 filter", "static pressure support"],
    defaultPreferredMood: ["technical", "quiet-luxury", "engineered"],
    defaultPreferredEnvironment: [
      "architectural villa ceiling system",
      "premium apartment concealed HVAC install",
      "technical studio product shot",
    ],
    mustInclude: ["hidden ceiling installation logic", "grilles or duct context in lifestyle scenes"],
    mustAvoid: ["visible wall-mounted styling"],
    notes: [
      "Current repo image is a placeholder card rather than a real product photo; replace with a manufacturer visual before final prompt generation.",
    ],
  },
};

const PRODUCT_NOTES: Partial<Record<string, string[]>> = {
  "haier-as09tt4hra": [
    "Repo text explicitly mentions hOn app, Alice, and Google Assistant support.",
  ],
  "hisense-as12qc4svetg4": [
    "Repo text explicitly mentions Apple HomeKit support via Hi-Smart.",
  ],
  "hisense-as18hr4sydkg": [
    "Repo text explicitly mentions Alice voice control support.",
  ],
  "ballu-bsw-09hn1": [
    "Internal Ballu campaign assets include Alice, Marusya, and HOMMYN badges for this model.",
  ],
};

function unique(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))];
}

function spec(product: Product, label: string): string {
  return product.specs.find((item) => item.label === label)?.value ?? "";
}

function modelFromName(product: Product): string {
  return product.name.replace(`${product.brand} `, "").trim();
}

function areaNumber(product: Product): number {
  const match = spec(product, "Площадь помещения").match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function noiseNumber(product: Product): number {
  const match = spec(product, "Шум (внутр. блок)").match(/(\d+)/);
  return match ? Number(match[1]) : 99;
}

function hasWiFi(product: Product, profile: SeriesProfile): boolean {
  return Boolean(spec(product, "Wi-Fi") || profile.defaultWiFi);
}

function getSeriesKey(product: Product): string {
  if (product.slug.startsWith("ballu-bswi-")) return "ballu-bswi";
  if (product.slug.startsWith("ballu-bsw-")) return "ballu-bsw";
  if (product.slug.startsWith("ballu-blc-")) return "ballu-blc";
  if (product.slug.startsWith("ballu-bld-")) return "ballu-bld";
  if (product.slug.startsWith("haier-as") && product.slug.includes("tt4hra")) return "haier-tundra";
  if (product.slug.startsWith("haier-as") && product.slug.includes("qm2hia")) return "haier-expert";
  if (product.slug === "haier-ab48s2sd1fa") return "haier-cassette";
  if (product.slug === "haier-ac36cs1era") return "haier-console";
  if (product.slug.includes("hr4sydkg")) return "hisense-hicomfort";
  if (product.slug.includes("qc4svetg4")) return "hisense-expert";
  if (product.slug.includes("ur4sxcdg")) return "hisense-cassette";
  if (product.slug.startsWith("daikin-ftxb")) return "daikin-sensira";
  if (product.slug.startsWith("daikin-ftxf")) return "daikin-perfera";
  if (product.slug === "daikin-fha60a") return "daikin-fha";
  if (product.slug === "daikin-fbq35d") return "daikin-fbq";
  if (product.slug === "daikin-fdxs25e") return "daikin-fdxs";

  return "daikin-sensira";
}

function detectVoiceAssistants(product: Product, profile: SeriesProfile): string[] {
  const text = `${product.description} ${product.longDescription}`;
  const assistants = [...(profile.defaultVoiceAssistants ?? [])];

  if (/Alice|Алис/i.test(text)) assistants.push("Alice");
  if (/Marusya|Марус/i.test(text)) assistants.push("Marusya");
  if (/Google Assistant/i.test(text)) assistants.push("Google Assistant");
  if (/HomeKit/i.test(text)) assistants.push("Apple HomeKit");
  if (/HOMMYN/i.test(text)) assistants.push("HOMMYN");

  return unique(assistants);
}

function detectEcosystems(product: Product, profile: SeriesProfile): string[] {
  const text = `${product.description} ${product.longDescription}`;
  const ecosystems = [...(profile.defaultEcosystems ?? [])];

  if (/Ballu Home/i.test(text)) ecosystems.push("Ballu Home");
  if (/hOn/i.test(text)) ecosystems.push("hOn");
  if (/Hi-Smart/i.test(text)) ecosystems.push("Hi-Smart");
  if (/BACnet/i.test(text)) ecosystems.push("BACnet");
  if (/D-BACS/i.test(text)) ecosystems.push("Daikin D-BACS");

  return unique(ecosystems);
}

function detectSpecialFunctions(product: Product, profile: SeriesProfile): string[] {
  const text = `${product.description} ${product.longDescription}`;
  const functions = [...profile.defaultSpecialFunctions];

  const patterns = [
    [/i[- ]?Feel/i, "i-Feel"],
    [/Sleep|Night Comfort|комфортный сон|режим сна/i, "Sleep mode"],
    [/самоочист|Self[- ]?Clean|Auto[- ]?Clean/i, "Self-Clean"],
    [/таймер|timer/i, "Timer"],
    [/Turbo/i, "Turbo mode"],
    [/Smart Heat/i, "Smart Heat"],
    [/CO2|CO₂/i, "CO2 sensor"],
    [/влажност/i, "Humidity sensor"],
    [/Fresh Air/i, "Fresh Air"],
    [/3D Airflow/i, "3D Airflow"],
    [/Air Sense/i, "Air Sense"],
    [/TurboFrost/i, "TurboFrost"],
    [/Gold Fin/i, "Gold Fin coating"],
    [/Flash Streamer/i, "Flash Streamer"],
    [/Intelligent Eye/i, "Intelligent Eye"],
    [/Demand Control/i, "Demand Control"],
    [/Coanda/i, "Coanda airflow"],
    [/PM 2\.5/i, "PM2.5 filtration"],
    [/HEPA/i, "HEPA filtration"],
    [/G4/i, "G4 filter"],
    [/самодиагност/i, "Self-diagnostics"],
    [/обезвлаж/i, "Dry mode"],
    [/Auto Louver/i, "Auto Louver"],
    [/Hi-Smart/i, "Hi-Smart app"],
    [/hOn/i, "hOn app"],
    [/Ballu Home/i, "Ballu Home app"],
  ] as const;

  for (const [pattern, label] of patterns) {
    if (pattern.test(text)) functions.push(label);
  }

  const airflow = spec(product, "Обдув");
  if (airflow) functions.push(airflow);

  const staticPressure = spec(product, "Статическое давление");
  if (staticPressure) functions.push(`Static pressure ${staticPressure}`);

  const filter = spec(product, "Фильтр");
  if (filter) functions.push(filter);

  const sensors = spec(product, "Датчики");
  if (sensors) functions.push(sensors);

  return unique(functions);
}

function deriveBenefits(product: Product, profile: SeriesProfile): string[] {
  const benefits = [...profile.baseBenefits];
  const noise = spec(product, "Шум (внутр. блок)");
  const heatingLimit = spec(product, "Обогрев до");
  const area = spec(product, "Площадь помещения");
  const wifi = spec(product, "Wi-Fi");
  const energy = spec(product, "Класс энергоэфф.");

  if (noise) benefits.push(`quiet operation ${noise}`);
  if (heatingLimit) benefits.push(`heating down to ${heatingLimit}`);
  if (area) benefits.push(`designed for ${area}`);
  if (wifi) benefits.push(`connected control ${wifi.toLowerCase()}`);
  if (energy) benefits.push(`energy class ${energy}`);

  return unique(benefits).slice(0, 8);
}

function deriveReliabilityClaims(product: Product): string[] {
  const text = `${product.description} ${product.longDescription}`;
  const claims = [product.material, product.finish.replace("Класс энергоэффективности ", "Energy class ")];

  if (/Япония \/ Чехия/i.test(text) || /Япония/i.test(text)) {
    claims.push("Daikin swing-compressor engineering, Japan/Czech production note in repo");
  }
  if (/самодиагност/i.test(text)) claims.push("self-diagnostics");
  if (/бактер/i.test(text)) claims.push("anti-bacterial hygiene positioning");
  if (/антикорроз/i.test(text)) claims.push("anti-corrosion coating");

  const heatingLimit = spec(product, "Обогрев до");
  if (heatingLimit) claims.push(`winter operation ${heatingLimit}`);

  return unique(claims);
}

function resolveWiFi(product: Product, profile: SeriesProfile): string {
  return spec(product, "Wi-Fi") || profile.defaultWiFi || "Not specified in repo";
}

function preferredEnvironment(product: Product, profile: SeriesProfile): string[] {
  const environments = [...profile.defaultPreferredEnvironment];

  if (product.collection === "Настенные") {
    environments.push("home office");
  }
  if (product.collection === "Кассетные") {
    environments.push("premium commercial ceiling interior");
  }
  if (product.collection === "Канальные") {
    environments.push("concealed ceiling installation detail");
  }
  if (spec(product, "Обогрев до")) {
    environments.push("snowy or cold-weather exterior contrast");
  }

  return unique(environments);
}

function mustInclude(product: Product, profile: SeriesProfile, smartEnabled: boolean): string[] {
  const items = [...profile.mustInclude];

  if (smartEnabled) {
    items.push("clean smartphone climate-control app UI");
  }
  if (product.collection === "Настенные") {
    items.push("interior wall-mounted placement scaled realistically");
  }
  if (product.collection === "Настенные") {
    items.push("subtle airflow cue via curtain or fabric movement");
  }
  if (product.collection !== "Настенные") {
    items.push("realistic installation context for the specific commercial AC type");
  }

  return unique(items);
}

function recommendedTemplates(
  product: Product,
  smartEnabled: boolean,
  productClass: PromptProductClass,
): PromptTemplate[] {
  const templates: PromptTemplate[] = ["studio-hero", "product-card-bento"];

  if (productClass === "split-system" || product.collection === "Настенные") {
    templates.push("lifestyle-interior", "exterior-weather");
  } else {
    templates.push("lifestyle-interior");
  }

  if (product.collection !== "Канальные") {
    templates.push("exterior-weather");
  }

  if (smartEnabled || productClass === "smart-home climate product") {
    templates.push("smart-home");
  }

  return unique(templates) as PromptTemplate[];
}

function campaignDirection(
  product: Product,
  smartEnabled: boolean,
  productClass: PromptProductClass,
): AcPromptCatalogEntry["campaignDirection"] {
  const quiet = noiseNumber(product) <= 22;
  const winter = Boolean(spec(product, "Обогрев до"));
  const powerful = areaNumber(product) >= 50 || productClass === "ducted/cassette/commercial AC";

  return {
    primaryIdea: quiet
      ? "private climate sanctuary"
      : powerful
        ? "controlled performance in a premium technical system"
        : "clean everyday climate control",
    secondaryIdea: winter ? "comfort inside, whatever the weather" : undefined,
    smartHomeIdea: smartEnabled ? "smart climate inside your ecosystem" : undefined,
  };
}

function sourceUrl(product: Product): string {
  const model = modelFromName(product);

  switch (product.brand) {
    case "Ballu": {
      const path =
        product.collection === "Настенные"
          ? "nastennye"
          : product.collection === "Кассетные"
            ? "kassetnye"
            : "kanalnye";

      return `https://ballu.ru/catalog/split_systems/${path}/${product.slug.replace("ballu-", "")}/`;
    }
    case "Haier": {
      if (product.slug === "haier-ab48s2sd1fa") {
        return "https://www.haier.com/ru/air-conditioners/cassette/";
      }
      if (product.slug === "haier-ac36cs1era") {
        return "https://www.haier.com/ru/air-conditioners/floor-ceiling/";
      }
      return `https://www.haier.com/ru/air-conditioners/split-system/${product.slug.replace("haier-", "")}/`;
    }
    case "Hisense": {
      if (product.collection === "Кассетные") {
        return "https://hisense.ru/conditioning/air-conditioners/cassette/";
      }
      const upperModel = model.toUpperCase();
      const code = upperModel.startsWith("AS-")
        ? upperModel
        : upperModel.replace(/^AS/, "AS-");
      return `https://hisense.ru/conditioning/air-conditioners/${code}/`;
    }
    case "Daikin":
      return `https://www.daikin.eu/en_us/products/${model}.html`;
  }
}

function dataQualityNotes(product: Product, profile: SeriesProfile): string[] {
  return unique([...(profile.notes ?? []), ...(PRODUCT_NOTES[product.slug] ?? [])]);
}

function buildEntry(product: Product): AcPromptCatalogEntry {
  const profile = SERIES_PROFILES[getSeriesKey(product)];
  const assistants = detectVoiceAssistants(product, profile);
  const ecosystems = detectEcosystems(product, profile);
  const wiFi = resolveWiFi(product, profile);
  const smartEnabled = wiFi !== "Not specified in repo" || assistants.length > 0 || ecosystems.length > 0;
  const productClass = smartEnabled && profile.productClass === "split-system"
    ? "smart-home climate product"
    : profile.productClass;

  return {
    slug: product.slug,
    brand: product.brand,
    model: modelFromName(product),
    name: product.name,
    featured: product.featured,
    productClass,
    productType: profile.productType,
    series: profile.series,
    useCase: profile.useCase,
    indoorUnitIncluded: true,
    outdoorUnitIncluded: true,
    visualDesign: profile.visualDesign,
    mainProductBenefits: deriveBenefits(product, profile),
    coolingPower: spec(product, "Мощность охлаждения"),
    heatingPower: spec(product, "Мощность обогрева"),
    recommendedRoomSize: spec(product, "Площадь помещения"),
    noiseLevel: spec(product, "Шум (внутр. блок)"),
    energyClass: spec(product, "Класс энергоэфф."),
    refrigerant: spec(product, "Хладагент"),
    wiFiAppControl: wiFi,
    voiceAssistants: assistants,
    compatibleEcosystems: ecosystems,
    specialFunctions: detectSpecialFunctions(product, profile),
    warrantyReliabilityClaims: deriveReliabilityClaims(product),
    targetMarket: DEFAULT_TARGET_MARKET,
    languageForCopy: DEFAULT_LANGUAGE,
    preferredMood: unique(profile.defaultPreferredMood),
    preferredEnvironment: preferredEnvironment(product, profile),
    aspectRatio: DEFAULT_ASPECT_RATIO,
    mustInclude: mustInclude(product, profile, smartEnabled),
    mustAvoid: unique([...UNIVERSAL_MUST_AVOID, ...profile.mustAvoid]),
    recommendedTemplates: recommendedTemplates(product, smartEnabled, productClass),
    campaignDirection: campaignDirection(product, smartEnabled, productClass),
    sourceUrl: sourceUrl(product),
    referenceImages: product.images,
    dataQualityNotes: dataQualityNotes(product, profile),
  };
}

export const acPromptCatalog = products.map(buildEntry);

export const acPromptCatalogBySlug = Object.fromEntries(
  acPromptCatalog.map((entry) => [entry.slug, entry]),
) as Record<string, AcPromptCatalogEntry>;

export function getAcPromptCatalogEntry(slug: string): AcPromptCatalogEntry | undefined {
  return acPromptCatalogBySlug[slug];
}

export function formatAcPromptInput(entry: AcPromptCatalogEntry): string {
  return [
    `Brand: ${entry.brand}`,
    `Model: ${entry.model}`,
    `Product type: ${entry.productType}`,
    `Series: ${entry.series}`,
    `Indoor unit included? ${entry.indoorUnitIncluded ? "yes" : "no"}`,
    `Outdoor unit included? ${entry.outdoorUnitIncluded ? "yes" : "no"}`,
    "",
    `Main product benefits: ${entry.mainProductBenefits.join(", ")}`,
    `Cooling power: ${entry.coolingPower}`,
    `Heating power: ${entry.heatingPower}`,
    `Recommended room size: ${entry.recommendedRoomSize}`,
    `Noise level: ${entry.noiseLevel}`,
    `Energy class: ${entry.energyClass}`,
    `Refrigerant: ${entry.refrigerant}`,
    `Wi-Fi / app control: ${entry.wiFiAppControl}`,
    `Voice assistants / smart home systems: ${unique([
      ...entry.voiceAssistants,
      ...entry.compatibleEcosystems,
    ]).join(", ") || "Not specified in repo"}`,
    `Special functions: ${entry.specialFunctions.join(", ")}`,
    `Warranty / reliability claims: ${entry.warrantyReliabilityClaims.join(", ")}`,
    "",
    `Target market: ${entry.targetMarket}`,
    `Language for copy: ${entry.languageForCopy}`,
    `Preferred mood: ${entry.preferredMood.join(", ")}`,
    `Preferred environment: ${entry.preferredEnvironment.join(", ")}`,
    `Aspect ratio: ${entry.aspectRatio}`,
    `Must include: ${entry.mustInclude.join(", ")}`,
    `Must avoid: ${entry.mustAvoid.join(", ")}`,
  ].join("\n");
}

export const acPromptCatalogNotes = [
  "Ballu BSW internal assets contain richer smart-home cues than the raw repo specs; those cues are carried into the normalized prompt input with a data-quality note.",
  "Ballu BSWI, Haier Tundra, and Haier Expert Smart have image/reference naming mismatches; verify the exact fascia on manufacturer pages before final image generation.",
  "Hisense reference images in the repo are placeholders, so visual descriptions are intentionally generic and flagged for verification.",
  "Daikin FBQ35D is likely misclassified in the repo text versus the current asset; the catalog flags it as a ceiling-integrated commercial system that should be verified before rendering.",
  "Daikin FDXS25E currently relies on a placeholder reference image and should be updated from the manufacturer source page before prompt generation.",
];