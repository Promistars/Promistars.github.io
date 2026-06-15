import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const publicDir = join(repoRoot, "public");

const targets = [
  "index.html",
  "about/index.html",
  "intro/index.html",
  "resume/index.html",
  "css/site.css",
  "js/site.js",
  "images/hero-science.png"
];

await mkdir(join(repoRoot, "css"), { recursive: true });
await mkdir(join(repoRoot, "js"), { recursive: true });
await mkdir(join(repoRoot, "images"), { recursive: true });

for (const target of targets) {
  await mkdir(dirname(join(repoRoot, target)), { recursive: true });
  await rm(join(repoRoot, target), { force: true });
  await cp(join(publicDir, target), join(repoRoot, target));
}
