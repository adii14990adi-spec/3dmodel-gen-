import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const docsDir = path.resolve(projectRoot, '..', 'docs');

// 1. Copy local Three.js Draco WASM/JS decoder into public/draco (zero external CDN needed)
const srcDraco = path.resolve(projectRoot, 'node_modules/three/examples/jsm/libs/draco/gltf');
const dstDraco = path.resolve(projectRoot, 'public/draco');
fs.mkdirSync(dstDraco, { recursive: true });
for (const file of ['draco_decoder.js', 'draco_decoder.wasm', 'draco_wasm_wrapper.js']) {
  const s = path.join(srcDraco, file);
  if (fs.existsSync(s)) {
    fs.copyFileSync(s, path.join(dstDraco, file));
  }
}

// 2. Ensure .nojekyll exists in public/ so GitHub Pages serves all static files untouched
fs.writeFileSync(path.resolve(projectRoot, 'public/.nojekyll'), '');

// 3. Clean stale JS/CSS bundles in ../docs/assets while preserving ../docs/models & ../docs/previews
const docsAssets = path.join(docsDir, 'assets');
if (fs.existsSync(docsAssets)) {
  fs.rmSync(docsAssets, { recursive: true, force: true });
}
console.log('[sync-static] Synced local Draco WASM decoder & .nojekyll for GitHub Pages.');
