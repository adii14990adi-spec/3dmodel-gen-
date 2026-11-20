import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../..');
const unityExportSrc = path.join(repoRoot, 'Unity_Export');
const publicDir = path.resolve(__dirname, '../public');
const unityExportDst = path.join(publicDir, 'Unity_Export');

if (!fs.existsSync(unityExportSrc)) {
  console.error('Unity_Export directory not found at:', unityExportSrc);
  process.exit(1);
}

fs.mkdirSync(publicDir, { recursive: true });
fs.cpSync(unityExportSrc, unityExportDst, { recursive: true, force: true });

const reportsDir = path.join(unityExportSrc, 'Reports');
const assets = [];

if (fs.existsSync(reportsDir)) {
  const files = fs.readdirSync(reportsDir).filter((f) => f.endsWith('.assetproj')).sort();
  for (const file of files) {
    const raw = fs.readFileSync(path.join(reportsDir, file), 'utf8');
    const proj = JSON.parse(raw);

    const formats = [];
    if (proj.exports?.glb && fs.existsSync(path.join(repoRoot, proj.exports.glb))) {
      formats.push('GLB');
    }
    if (proj.exports?.fbx && fs.existsSync(path.join(repoRoot, proj.exports.fbx))) {
      formats.push('FBX');
    }

    const glbSize = proj.exports?.glb && fs.existsSync(path.join(repoRoot, proj.exports.glb))
      ? fs.statSync(path.join(repoRoot, proj.exports.glb)).size
      : 0;
    const fbxSize = proj.exports?.fbx && fs.existsSync(path.join(repoRoot, proj.exports.fbx))
      ? fs.statSync(path.join(repoRoot, proj.exports.fbx)).size
      : 0;

    assets.push({
      id: proj.asset_name,
      name: proj.asset_name,
      category: proj.category,
      version: proj.version || '1.0.0',
      targetEngine: proj.target_engine || 'Unity 6',
      formats,
      previewPath: proj.exports?.glb ? `./${proj.exports.glb}` : '',
      fbxPath: proj.exports?.fbx ? `./${proj.exports.fbx}` : '',
      glbPath: proj.exports?.glb ? `./${proj.exports.glb}` : '',
      projectPath: `./Unity_Export/Reports/${file}`,
      glbSizeBytes: glbSize,
      fbxSizeBytes: fbxSize,
      parameters: proj.parameters || {},
      components: proj.components || [],
      materials: proj.materials || [],
      validation: proj.validation || null,
    });
  }
}

const manifest = {
  generatedAt: new Date().toISOString(),
  totalAssets: assets.length,
  assets,
};

fs.writeFileSync(path.join(publicDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Generated manifest.json with ${assets.length} assets.`);
