import { spawnSync } from "node:child_process";
import { copyFile, mkdir, readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "..");
const assets = JSON.parse(await readFile(resolve(root, "src/data/image-assets.json"), "utf8"));
const sources = [...new Set(Object.values(assets).map(image => image.src)), ...["rose-climber", "garden-shoot", "meadow-trail"].map(name => `/images/decor/${name}.webp`)];
const widths = [128, 256, 384, 640, 750, 1080, 1200, 1536, 1920];
for (const src of sources) {
  const input = resolve(root, `public${src}`);
  const original = await stat(input);
  for (const width of widths) {
    const output = resolve(root, `public${src.replace("/images/", "/images/static/").replace(".webp", `-${width}.webp`)}`);
    const existing = await stat(output).catch(() => undefined);
    if (existing && existing.mtimeMs >= original.mtimeMs) continue;
    await mkdir(dirname(output), { recursive: true });
    await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 75 }).toFile(output);
  }
}
console.log(`Pages: подготовлено ${sources.length * widths.length} адаптивных изображений.`);
const result = spawnSync(process.execPath, [resolve(root, "node_modules/next/dist/bin/next"), "build"], {
  cwd: root, stdio: "inherit", env: { ...process.env, STATIC_EXPORT: "1" },
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
// Next 16.3.8's Windows export leaves backslashes in segment filenames,
// producing folders instead of the dot-separated files requested by its router.
// Linux (including GitHub Actions) already writes the correct filenames.
async function normalizeWindowsSegments(directory, segmentRoot, parts = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (segmentRoot) {
      const nextParts = [...parts, entry.name];
      if (entry.isDirectory()) await normalizeWindowsSegments(file, segmentRoot, nextParts);
      else await copyFile(file, join(dirname(segmentRoot), [segmentRoot.split(/[\\/]/).pop(), ...nextParts].join(".")));
    } else if (entry.isDirectory()) {
      await normalizeWindowsSegments(file, entry.name.startsWith("__next.") ? file : undefined);
    }
  }
}
if (process.platform === "win32") await normalizeWindowsSegments(resolve(root, "out"));
await writeFile(resolve(root, "out/.nojekyll"), "");
