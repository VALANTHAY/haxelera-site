// Genera customHttp.yml: las cabeceras de seguridad del sitio en Amplify Hosting (las mismas que manda
// servidor.mjs). La CSP permite los scripts en línea del index por su huella: si cambian, hay que
// volver a correr este archivo antes de publicar.
//   node servidor/cabeceras-amplify.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = await readFile(join(RAIZ, 'index.html'), 'utf8');
const huellas = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)]
  .map(m => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
const csp = [
  "default-src 'self'",
  `script-src 'self' https://cdn.jsdelivr.net ${huellas.join(' ')}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob:",
  "connect-src 'self' https://cdn.jsdelivr.net",
  "media-src 'self' blob:",
  "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
].join('; ');
const cabeceras = {
  'Content-Security-Policy': csp,
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'microphone=(self), camera=(), geolocation=(), payment=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};
const yml = `# Generado por servidor/cabeceras-amplify.mjs: no editar a mano.
customHeaders:
  - pattern: '**/*'
    headers:
${Object.entries(cabeceras).map(([k, v]) => `      - key: '${k}'\n        value: "${v}"`).join('\n')}
`;
await writeFile(join(RAIZ, 'customHttp.yml'), yml);
console.log(`customHttp.yml listo · ${huellas.length} scripts en línea con huella`);
