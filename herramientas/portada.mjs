// Genera la imagen para compartir el sitio (assets/og.jpg, 1200×630) con el mismo motor 3D del sitio.
// Abre herramientas/portada.html en Chrome sin ventana, a doble resolución, y guarda la captura.
//   node herramientas/portada.mjs   → herramientas/portada-2x.png (2400×1260) y assets/og.jpg (1200×630)
// Se puede afinar la toma con parámetros de la página: node herramientas/portada.mjs "?z=12&x=-3.4"
import http from 'node:http';
import { spawn, spawnSync } from 'node:child_process';
import { readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SALIDA = join(RAIZ, 'herramientas', 'portada-2x.png');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PARAMETROS = process.argv[2] || '';
const espera = (ms) => new Promise(r => setTimeout(r, ms));
const TIPOS = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };

// Servidor local mínimo (sin CSP: la página del generador tiene su propio script en línea).
const servidor = http.createServer(async (req, res) => {
  const ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const archivo = normalize(join(RAIZ, ruta));
  if (!archivo.startsWith(RAIZ + sep)) { res.writeHead(403); return res.end(); }
  try { const datos = await readFile(archivo); res.writeHead(200, { 'Content-Type': TIPOS[extname(archivo)] || 'application/octet-stream' }); res.end(datos); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const puerto = servidor.address().port;

const perfil = await mkdtemp(join(tmpdir(), 'portada-chrome-'));
const chrome = spawn(CHROME, [
  '--headless=new', '--remote-debugging-port=0', `--user-data-dir=${perfil}`, '--hide-scrollbars',
  '--window-size=1200,630', '--use-angle=metal', '--enable-unsafe-swiftshader', '--no-first-run', '--no-default-browser-check', 'about:blank',
], { stdio: 'ignore' });

try {
  const archivoPuerto = join(perfil, 'DevToolsActivePort');
  for (let i = 0; i < 100 && !existsSync(archivoPuerto); i++) await espera(100);
  const [puertoCdp] = (await readFile(archivoPuerto, 'utf8')).split('\n');
  const pagina = (await (await fetch(`http://127.0.0.1:${puertoCdp}/json/list`)).json()).find(t => t.type === 'page');
  const ws = new WebSocket(pagina.webSocketDebuggerUrl);
  await new Promise((ok, mal) => { ws.onopen = ok; ws.onerror = mal; });
  let id = 0;
  const pendientes = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pendientes.has(d.id)) { pendientes.get(d.id)(d); pendientes.delete(d.id); } };
  const cdp = (method, params = {}) => new Promise(r => { const n = ++id; pendientes.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });

  await cdp('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 2, mobile: false });
  await cdp('Page.enable');
  await cdp('Page.navigate', { url: `http://127.0.0.1:${puerto}/herramientas/portada.html${PARAMETROS}` });
  let lista = false;
  for (let i = 0; i < 240 && !lista; i++) {
    await espera(500);
    const r = await cdp('Runtime.evaluate', { expression: 'window.portadaLista === true && document.fonts.status === "loaded"', returnByValue: true });
    lista = r.result?.result?.value === true;
  }
  if (!lista) throw new Error('La escena no terminó de cargar a tiempo');
  const webgl = await cdp('Runtime.evaluate', { expression: '(() => { const g = document.createElement("canvas").getContext("webgl2"); const i = g && g.getExtension("WEBGL_debug_renderer_info"); return i ? g.getParameter(i.UNMASKED_RENDERER_WEBGL) : "desconocido"; })()', returnByValue: true });
  await espera(600);
  const foto = await cdp('Page.captureScreenshot', { format: 'png' });
  await writeFile(SALIDA, Buffer.from(foto.result.data, 'base64'));
  // Se reduce a 1200×630 en JPEG con sips (viene con macOS): liviana para WhatsApp y nítida.
  const og = join(RAIZ, 'assets', 'og.jpg');
  const r = spawnSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '88', '-z', '630', '1200', SALIDA, '--out', og], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`sips no pudo reducir la imagen: ${r.stderr}`);
  console.log(`Listo: ${og} · render ${webgl.result?.result?.value}`);
  ws.close();
} finally {
  chrome.kill();
  servidor.close();
  await espera(300);
  await rm(perfil, { recursive: true, force: true });
}
