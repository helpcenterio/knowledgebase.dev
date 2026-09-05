import { readFile, mkdir, writeFile, rm } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildFiles } from "../lib/template.mjs";
const config = JSON.parse(
  await readFile(new URL("../config.json", import.meta.url)),
);
const target = resolve(fileURLToPath(new URL("../dist/", import.meta.url)));
await rm(target, { recursive: true, force: true });
for (const [file, content] of Object.entries(buildFiles(config))) {
  const path = resolve(target, file);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}
console.log(
  "Compass built in dist/. Open dist/index.html or publish the dist folder.",
);
