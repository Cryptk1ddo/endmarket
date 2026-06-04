import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const QUEUE_PATH = path.join(ROOT, "public/generated/ac-campaigns/image-generation-queue.json");
const BATCH_DIR = path.join(ROOT, "public/generated/ac-campaigns/_batch");

const queue = JSON.parse(fs.readFileSync(QUEUE_PATH, "utf8"));
let copied = 0;
const missing = [];

for (const item of queue.items) {
  const source = path.join(BATCH_DIR, `${item.slug}__${item.variant}.png`);
  const destination = path.join(ROOT, "public", item.outputPath);

  if (!fs.existsSync(source)) {
    missing.push(path.relative(ROOT, source));
    continue;
  }

  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  copied += 1;
}

console.log(`Copied ${copied} generated campaign images into final public folders.`);

if (missing.length > 0) {
  console.log(`Missing ${missing.length} batch outputs:`);
  for (const file of missing) {
    console.log(`- ${file}`);
  }
  process.exitCode = 1;
}
