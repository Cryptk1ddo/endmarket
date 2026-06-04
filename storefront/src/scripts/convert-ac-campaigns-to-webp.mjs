import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const QUEUE_PATH = path.join(ROOT, "public/generated/ac-campaigns/image-generation-queue.json");
const MANIFEST_PATH = path.join(ROOT, "public/generated/ac-campaigns/webp-manifest.json");
const QUALITY = Number(process.env.AC_WEBP_QUALITY ?? 84);

function bytes(filePath) {
  return fs.statSync(filePath).size;
}

function formatMib(value) {
  return `${(value / 1024 / 1024).toFixed(1)} MiB`;
}

const cwebpCheck = spawnSync("cwebp", ["-version"], { encoding: "utf8" });
if (cwebpCheck.error || cwebpCheck.status !== 0) {
  console.error("cwebp is required but was not found on PATH.");
  process.exit(1);
}

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));
const converted = [];
const missing = [];
let sourceBytes = 0;
let webpBytes = 0;

for (const item of queue.items) {
  const source = path.join(ROOT, "public", item.outputPath);
  const webpOutputPath = item.outputPath.replace(/\.png$/i, ".webp");
  const destination = path.join(ROOT, "public", webpOutputPath);

  if (!fs.existsSync(source)) {
    missing.push(item.outputPath);
    continue;
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });

  const result = spawnSync(
    "cwebp",
    ["-quiet", "-q", String(QUALITY), source, "-o", destination],
    { encoding: "utf8" },
  );

  if (result.error || result.status !== 0) {
    console.error(`Failed to convert ${item.outputPath}`);
    if (result.stderr) console.error(result.stderr);
    process.exit(result.status || 1);
  }

  const sourceSize = bytes(source);
  const webpSize = bytes(destination);
  sourceBytes += sourceSize;
  webpBytes += webpSize;

  converted.push({
    productName: item.productName,
    slug: item.slug,
    variant: item.variant,
    sourcePath: item.outputPath,
    webpPath: webpOutputPath,
    sourceBytes: sourceSize,
    webpBytes: webpSize,
  });
}

fs.writeFileSync(
  MANIFEST_PATH,
  `${JSON.stringify({
    source: "public/generated/ac-campaigns/image-generation-queue.json",
    generatedAt: new Date().toISOString(),
    quality: QUALITY,
    count: converted.length,
    sourceTotalBytes: sourceBytes,
    webpTotalBytes: webpBytes,
    sourceTotalReadable: formatMib(sourceBytes),
    webpTotalReadable: formatMib(webpBytes),
    items: converted,
    missing,
  }, null, 2)}\n`,
);

console.log(`Converted ${converted.length} PNG files to WebP at q=${QUALITY}.`);
console.log(`PNG total:  ${formatMib(sourceBytes)}`);
console.log(`WebP total: ${formatMib(webpBytes)}`);

if (missing.length > 0) {
  console.log(`Missing ${missing.length} source PNG files:`);
  for (const file of missing) console.log(`- ${file}`);
  process.exitCode = 1;
}
