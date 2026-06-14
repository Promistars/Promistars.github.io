import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const publicDir = join(repoRoot, "public");

const targets = [
  "index.html",
  "css/site.css",
  "js/site.js"
];

await mkdir(join(repoRoot, "css"), { recursive: true });
await mkdir(join(repoRoot, "js"), { recursive: true });

for (const target of targets) {
  await rm(join(repoRoot, target), { force: true });
  await cp(join(publicDir, target), join(repoRoot, target));
}
