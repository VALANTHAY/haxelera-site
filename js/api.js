// Cliente de la API de las experiencias en vivo. Si el servidor no está (por ejemplo, en un hosting estático),
// cada experiencia sigue funcionando en su modo sin conexión.
import { CONFIG } from './config.js';

const BASE = CONFIG.api || '';
const conTiempo = (ms) => AbortSignal.timeout ? AbortSignal.timeout(ms) : undefined;

async function pedir(ruta, opciones = {}, ms = 6000) {
  const r = await fetch(`${BASE}${ruta}`, { cache: 'no-store', signal: conTiempo(ms), ...opciones });
  // En un hosting estático, una ruta desconocida puede responder 200 con la página (index.html):
  // si no llega JSON, no hay servidor de experiencias y todo pasa a su modo sin conexión.
  if (!(r.headers.get('content-type') || '').includes('application/json')) throw Object.assign(new Error('Sin servidor de experiencias'), { codigo: 0 });
  const datos = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(datos.error || `Error ${r.status}`), { codigo: r.status, datos });
  return datos;
}

// Código aleatorio del navegador para no contar dos veces el mismo voto. No identifica a la persona.
export function visitante() {
  try {
    let v = localStorage.getItem('hx-visitante');
    if (!v) { v = (crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`).replace(/[^a-z0-9-]/gi, ''); localStorage.setItem('hx-visitante', v); }
    return v;
  } catch { return `temporal-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`; }
}

export const api = {
  disponible: null,
  async comprobar() {
    if (this.disponible !== null) return this.disponible;
    try { const e = await pedir('/api/estado', {}, 1800); this.disponible = true; this.ia = Boolean(e.ia); }
    catch { this.disponible = false; this.ia = false; }
    return this.disponible;
  },
  // Mide la latencia real hasta el servidor (ida y vuelta).
  async estado() {
    const t0 = performance.now();
    const datos = await pedir('/api/estado', {}, 4000);
    return { ...datos, latenciaMs: performance.now() - t0 };
  },
  agente(mensaje, historial) {
    return pedir('/api/agente', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ mensaje, historial }) }, 20000);
  },
  encuesta() { return pedir('/api/encuesta'); },
  votar(opcion) {
    return pedir('/api/encuesta/voto', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ opcion, visitante: visitante() }) });
  },
  // Votos en tiempo real (Server-Sent Events). Devuelve una función para desconectarse.
  escucharEncuesta(alCambiar) {
    if (!('EventSource' in window)) return () => {};
    const fuente = new EventSource(`${BASE}/api/encuesta/eventos`);
    fuente.addEventListener('estado', (e) => alCambiar(JSON.parse(e.data), null));
    fuente.addEventListener('voto', (e) => { const d = JSON.parse(e.data); alCambiar(d, d.opcion); });
    return () => fuente.close();
  },
};
