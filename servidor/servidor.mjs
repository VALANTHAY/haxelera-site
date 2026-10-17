// Servidor de Haxelera: sirve el sitio y las experiencias en vivo de la fase 2.
// Node 18+ sin dependencias.  Uso:  node servidor/servidor.mjs   (puerto 8090 por defecto)
//
// Variables de entorno (opcionales):
//   PUERTO              puerto HTTP (8090)
//   ANTHROPIC_API_KEY   activa las respuestas con IA de Alyxia; sin ella responde en modo local
//   AGENTE_MODELO       modelo de Claude para Alyxia (claude-haiku-5-5)
//   REGION              nombre de la región que se muestra en «Estado en vivo» (local)
//   ORIGENES            orígenes permitidos para la API, separados por coma (vacío = solo el mismo sitio)
import http from 'node:http';
import { createHash, randomUUID } from 'node:crypto';
import { readFile, writeFile, mkdir, rename, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize, resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { instruccionesSistema, responderLocal, DESTINOS } from '../js/conocimiento.js';
import { ENCUESTA } from '../js/config.js';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, '..');
const DATOS = join(AQUI, 'datos');
const PUERTO = Number(process.env.PUERTO || 8090);
const CLAVE = process.env.ANTHROPIC_API_KEY || '';
const MODELO = process.env.AGENTE_MODELO || 'claude-haiku-5-5';
const REGION = process.env.REGION || 'local';
const ORIGENES = (process.env.ORIGENES || '').split(',').map(s => s.trim()).filter(Boolean);
const INICIO = Date.now();
let peticiones = 0;

const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.md': 'text/plain; charset=utf-8',
};
const PROHIBIDO = [/^\/servidor(\/|$)/, /^\/\./, /\.md$/i];

// ---------------------------------------------------------------- cabeceras de seguridad
let politicaCSP = '';
async function prepararCSP() {
  // Los scripts en línea del index (importmap y clase con-js) se permiten por su huella, no con 'unsafe-inline'.
  const html = await readFile(join(RAIZ, 'index.html'), 'utf8');
  const huellas = [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)]
    .map(m => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`);
  politicaCSP = [
    "default-src 'self'",
    `script-src 'self' https://cdn.jsdelivr.net ${huellas.join(' ')}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://cdn.jsdelivr.net",
    "media-src 'self' blob:",
    "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
  ].join('; ');
}
function cabecerasSeguras(req, res) {
  res.setHeader('Content-Security-Policy', politicaCSP);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'microphone=(self), camera=(), geolocation=(), payment=()');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  // HSTS solo cuando el sitio llega por HTTPS (detrás del balanceador o CDN); en local no se envía.
  if (req.headers['x-forwarded-proto'] === 'https' || req.socket.encrypted) res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
}

// ---------------------------------------------------------------- utilidades
function json(res, codigo, datos) {
  res.writeHead(codigo, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(datos));
}
function ipDe(req) { return (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '?'; }
async function leerCuerpo(req, max = 8192) {
  let tam = 0; const partes = [];
  for await (const p of req) { tam += p.length; if (tam > max) throw Object.assign(new Error('demasiado grande'), { codigo: 413 }); partes.push(p); }
  try { return JSON.parse(Buffer.concat(partes).toString('utf8') || '{}'); } catch { throw Object.assign(new Error('JSON inválido'), { codigo: 400 }); }
}
// Límite de uso en memoria por IP: n peticiones por ventana (ms). Las IP no se guardan en disco.
const cubos = new Map();
function permitido(clave, n, ventana) {
  const ahora = Date.now();
  const c = cubos.get(clave) || { inicio: ahora, cuenta: 0 };
  if (ahora - c.inicio > ventana) { c.inicio = ahora; c.cuenta = 0; }
  c.cuenta++;
  cubos.set(clave, c);
  return c.cuenta <= n;
}
setInterval(() => { const ahora = Date.now(); for (const [k, c] of cubos) if (ahora - c.inicio > 3600_000) cubos.delete(k); }, 600_000).unref();

// ---------------------------------------------------------------- encuesta viva
const archivoEncuesta = join(DATOS, `encuesta-${ENCUESTA.id}.json`);
let encuesta = null;
async function cargarEncuesta() {
  await mkdir(DATOS, { recursive: true });
  try { encuesta = JSON.parse(await readFile(archivoEncuesta, 'utf8')); }
  catch { encuesta = { id: ENCUESTA.id, votos: ENCUESTA.opciones.map(() => 0), votantes: [] }; }
  if (encuesta.votos.length !== ENCUESTA.opciones.length) encuesta.votos = ENCUESTA.opciones.map((_, i) => encuesta.votos[i] || 0);
}
let guardando = Promise.resolve();
function guardarEncuesta() {
  // Escritura atómica: archivo temporal y luego renombrar.
  guardando = guardando.then(async () => {
    const tmp = `${archivoEncuesta}.${randomUUID()}.tmp`;
    await writeFile(tmp, JSON.stringify(encuesta));
    await rename(tmp, archivoEncuesta);
  }).catch(e => console.error('No se pudo guardar la encuesta:', e.message));
}
const publico = () => ({ id: ENCUESTA.id, pregunta: ENCUESTA.pregunta, opciones: ENCUESTA.opciones, votos: encuesta.votos, total: encuesta.votos.reduce((a, b) => a + b, 0) });
const oyentes = new Set();
function emitir(evento, datos) {
  const linea = `event: ${evento}\ndata: ${JSON.stringify(datos)}\n\n`;
  for (const r of oyentes) r.write(linea);
}
setInterval(() => { for (const r of oyentes) r.write(': latido\n\n'); }, 25_000).unref();
// El visitante se identifica con un código aleatorio de su navegador; se guarda solo su huella.
const huellaVisitante = (v) => createHash('sha256').update(`haxelera:${ENCUESTA.id}:${v}`).digest('hex').slice(0, 32);

// ---------------------------------------------------------------- Alyxia (asistente de IA)
async function preguntarModelo(mensaje, historial) {
  const mensajes = [];
  for (const h of historial.slice(-8)) {
    if (!h || typeof h.texto !== 'string') continue;
    mensajes.push({ role: h.rol === 'agente' ? 'assistant' : 'user', content: h.texto.slice(0, 600) });
  }
  mensajes.push({ role: 'user', content: mensaje });
  while (mensajes.length && mensajes[0].role !== 'user') mensajes.shift();
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'x-api-key': CLAVE, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
    body: JSON.stringify({ model: MODELO, max_tokens: 400, system: instruccionesSistema(), messages: mensajes }),
    signal: AbortSignal.timeout(15_000),
  });
  if (!r.ok) throw new Error(`modelo ${r.status}`);
  const datos = await r.json();
  const texto = (datos.content || []).map(c => c.text || '').join('').trim();
  const m = texto.match(/\{[\s\S]*\}/);
  let salida = { respuesta: texto, destino: null };
  if (m) { try { salida = JSON.parse(m[0]); } catch { /* se usa el texto tal cual */ } }
  const destino = DESTINOS.includes(salida.destino) ? salida.destino : null;
  return { respuesta: String(salida.respuesta || '').slice(0, 900), destino };
}

// ---------------------------------------------------------------- rutas de la API
async function api(req, res, url) {
  const origen = req.headers.origin;
  if (origen && ORIGENES.includes(origen)) { res.setHeader('Access-Control-Allow-Origin', origen); res.setHeader('Vary', 'Origin'); }
  if (req.method === 'OPTIONS') { res.setHeader('Access-Control-Allow-Methods', 'GET, POST'); res.setHeader('Access-Control-Allow-Headers', 'content-type'); res.writeHead(204); return res.end(); }
  const ip = ipDe(req);

  if (url.pathname === '/api/estado' && req.method === 'GET') {
    const t0 = process.hrtime.bigint();
    const mem = process.memoryUsage();
    return json(res, 200, {
      region: REGION, iniciado: INICIO, activoSegundos: Math.round((Date.now() - INICIO) / 1000), peticiones,
      memoriaMB: Math.round(mem.rss / 1048576), node: process.version, ia: Boolean(CLAVE),
      oyentesEncuesta: oyentes.size, respuestaMs: Number(process.hrtime.bigint() - t0) / 1e6, hora: Date.now(),
    });
  }

  if (url.pathname === '/api/agente' && req.method === 'POST') {
    if (!permitido(`agente:${ip}`, 20, 60_000)) return json(res, 429, { error: 'Demasiadas preguntas seguidas. Espera un momento.' });
    const cuerpo = await leerCuerpo(req);
    const mensaje = String(cuerpo.mensaje || '').trim().slice(0, 600);
    if (!mensaje) return json(res, 400, { error: 'Mensaje vacío' });
    const historial = Array.isArray(cuerpo.historial) ? cuerpo.historial : [];
    if (CLAVE) {
      try { return json(res, 200, { ...(await preguntarModelo(mensaje, historial)), modo: 'ia' }); }
      catch (e) { console.error('Alyxia: el modelo no respondió, se usa el modo local.', e.message); }
    }
    return json(res, 200, { ...responderLocal(mensaje), modo: 'local' });
  }

  if (url.pathname === '/api/encuesta' && req.method === 'GET') return json(res, 200, publico());

  if (url.pathname === '/api/encuesta/voto' && req.method === 'POST') {
    if (!permitido(`voto:${ip}`, 12, 3600_000)) return json(res, 429, { error: 'Demasiados votos desde esta conexión.' });
    const cuerpo = await leerCuerpo(req, 1024);
    const opcion = Number(cuerpo.opcion);
    const visitante = String(cuerpo.visitante || '');
    if (!Number.isInteger(opcion) || opcion < 0 || opcion >= ENCUESTA.opciones.length) return json(res, 400, { error: 'Opción inválida' });
    if (!/^[a-z0-9-]{16,64}$/i.test(visitante)) return json(res, 400, { error: 'Visitante inválido' });
    const h = huellaVisitante(visitante);
    if (encuesta.votantes.includes(h)) return json(res, 409, { error: 'Ya votaste en esta encuesta.', ...publico() });
    encuesta.votos[opcion]++;
    encuesta.votantes.push(h);
    guardarEncuesta();
    const datos = publico();
    emitir('voto', { ...datos, opcion });
    return json(res, 200, datos);
  }

  if (url.pathname === '/api/encuesta/eventos' && req.method === 'GET') {
    if (oyentes.size > 500) return json(res, 503, { error: 'Demasiadas conexiones' });
    res.writeHead(200, { 'Content-Type': 'text/event-stream; charset=utf-8', 'Cache-Control': 'no-store', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.write(`event: estado\ndata: ${JSON.stringify(publico())}\n\n`);
    oyentes.add(res);
    req.on('close', () => oyentes.delete(res));
    return;
  }

  return json(res, 404, { error: 'No existe' });
}

// ---------------------------------------------------------------- archivos del sitio
async function estatico(req, res, url) {
  let ruta = decodeURIComponent(url.pathname);
  if (ruta.endsWith('/')) ruta += 'index.html';
  if (PROHIBIDO.some(r => r.test(ruta))) { res.writeHead(404); return res.end('No existe'); }
  const archivo = normalize(join(RAIZ, ruta));
  if (archivo !== RAIZ && !archivo.startsWith(RAIZ + sep)) { res.writeHead(403); return res.end(); }
  try {
    const info = await stat(archivo);
    if (!info.isFile()) throw new Error('no es archivo');
    const tipo = TIPOS[extname(archivo).toLowerCase()] || 'application/octet-stream';
    // Código y páginas se revalidan siempre (ETag); imágenes y fuentes se guardan un día.
    const etiqueta = `"${info.size.toString(36)}-${Math.floor(info.mtimeMs).toString(36)}"`;
    const codigo = /^(text\/|application\/json|application\/manifest)/.test(tipo);
    const cab = { 'Content-Type': tipo, ETag: etiqueta, 'Cache-Control': codigo ? 'no-cache' : 'public, max-age=86400' };
    if (req.headers['if-none-match'] === etiqueta) { res.writeHead(304, cab); return res.end(); }
    res.writeHead(200, cab);
    if (req.method === 'HEAD') return res.end();
    res.end(await readFile(archivo));
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No existe');
  }
}

const servidor = http.createServer(async (req, res) => {
  peticiones++;
  cabecerasSeguras(req, res);
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  try {
    if (url.pathname.startsWith('/api/')) await api(req, res, url);
    else if (req.method === 'GET' || req.method === 'HEAD') await estatico(req, res, url);
    else { res.writeHead(405); res.end(); }
  } catch (e) {
    if (!res.headersSent) json(res, e.codigo || 500, { error: e.codigo ? e.message : 'Error del servidor' });
    if (!e.codigo) console.error(e);
  }
});

await prepararCSP();
await cargarEncuesta();
servidor.listen(PUERTO, () => {
  console.log(`Haxelera en http://localhost:${PUERTO}`);
  console.log(CLAVE ? `Alyxia: IA activa (${MODELO})` : 'Alyxia: modo local (sin ANTHROPIC_API_KEY)');
  console.log(`Encuesta «${ENCUESTA.id}»: ${encuesta.votos.reduce((a, b) => a + b, 0)} votos guardados en ${existsSync(archivoEncuesta) ? archivoEncuesta : 'memoria (aún sin votos)'}`);
});
