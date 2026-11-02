import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.resolve(__dirname, '..', '..', 'docs');

const idx = path.join(docsDir, 'index.html');
if (fs.existsSync(idx)) {
  fs.copyFileSync(idx, path.join(docsDir, '404.html'));
}
fs.writeFileSync(path.join(docsDir, '.nojekyll'), '');
console.log('[postbuild] Created docs/404.html & verified docs/.nojekyll for GitHub Pages.');
