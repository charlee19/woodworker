import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) {
    console.log(`[Standalone Asset Copy] Source directory does not exist: ${src}`);
    return;
  }
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('[Standalone Asset Copy] Initiating static directory sync...');
  
  // 1. Copy public directory to standalone/public
  const publicSrc = path.join(rootDir, 'public');
  const publicDest = path.join(rootDir, '.next', 'standalone', 'public');
  copyDirRecursive(publicSrc, publicDest);
  console.log('[Standalone Asset Copy] Sync completed: public/ -> .next/standalone/public/');

  // 2. Copy .next/static directory to standalone/.next/static
  const staticSrc = path.join(rootDir, '.next', 'static');
  const staticDest = path.join(rootDir, '.next', 'standalone', '.next', 'static');
  copyDirRecursive(staticSrc, staticDest);
  console.log('[Standalone Asset Copy] Sync completed: .next/static/ -> .next/standalone/.next/static/');

  console.log('[Standalone Asset Copy] Asset sync finished beautifully.');
} catch (error) {
  console.error('[Standalone Asset Copy] Failed to sync assets:', error);
  process.exit(1);
}
