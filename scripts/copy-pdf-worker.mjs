import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const packageRoot = dirname(require.resolve('pdfjs-dist/package.json'));
const candidates = [
  join(packageRoot, 'build', 'pdf.worker.min.mjs'),
  join(packageRoot, 'build', 'pdf.worker.min.js'),
];
const source = candidates.find(existsSync);

if (!source) {
  throw new Error(`Unable to locate a PDF.js worker in ${packageRoot}`);
}

const extension = source.endsWith('.mjs') ? '.mjs' : '.js';
const publicDirectory = join(root, 'public');
const destination = join(publicDirectory, `pdf.worker.min${extension}`);
mkdirSync(publicDirectory, { recursive: true });
copyFileSync(source, destination);

if (extension !== '.mjs') {
  copyFileSync(source, join(publicDirectory, 'pdf.worker.min.mjs'));
}

console.log(`Copied ${source} to ${destination}`);
