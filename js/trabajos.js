// Tarjetas animadas de los trabajos de cada empresa del grupo. Cada familia dibuja una escena viva en un lienzo:
// servidores, código, encuestas, seguridad, tuberías de despliegue, mapa del mundo, etc.
import * as THREE from 'three';

const TAU = Math.PI * 2;
const W = 512, H = 320;
const M = (px) => `500 ${px}px "JetBrains Mono", ui-monospace, monospace`;
const F = (peso, px, fam = 'Manrope') => `${peso} ${px}px "${fam}", system-ui, sans-serif`;
function caja(x, X, Y, w, h, r) { x.beginPath(); x.roundRect(X, Y, w, h, r); }
// Índice siempre válido aunque el tiempo sea negativo.
const en = (lista, i) => lista[((i % lista.length) + lista.length) % lista.length];
const ruido = (i, t) => (Math.sin(i * 12.9898 + t * 1.3) * 0.5 + Math.sin(i * 4.1 + t * 0.7) * 0.5) * 0.5 + 0.5;

const LINEAS_CODIGO = [
  'export async function decidir(datos) {', '  const modelo = await cargar("v3");', '  const pred = modelo.predecir(datos);',
  '  return pred.filter(p => p.conf > 0.9);', '}', 'struct Panel: View { … }', 'const api = crearServidor({ seguro: true });',
  'api.post("/pedidos", validar, guardar);', 'await desplegar({ entorno: "produccion" });', '// pruebas: todas en verde',
];
const LOGS = ['[ok] acceso verificado · MFA', '[bloqueado] origen no confiable', '[ok] política zero trust aplicada', '[alerta] patrón inusual', '[ok] cifrado de extremo a extremo', '[bloqueado] escaneo de puertos'];

export const FAMILIAS = {
  // Servidores con luces de actividad
  servidores(x, t, c) {
    for (let r = 0; r < 4; r++) {
      const X = 40 + r * 112;
      caja(x, X, 70, 96, 200, 8); x.fillStyle = 'rgba(255,255,255,.05)'; x.fill(); x.strokeStyle = 'rgba(255,255,255,.15)'; x.stroke();
      for (let k = 0; k < 9; k++) {
        caja(x, X + 8, 80 + k * 20, 80, 14, 3); x.fillStyle = 'rgba(255,255,255,.06)'; x.fill();
        for (let l = 0; l < 4; l++) {
          const on = ruido(r * 40 + k * 4 + l, t * 6) > 0.55;
          x.fillStyle = on ? (l === 3 ? '#ffd36b' : c) : 'rgba(255,255,255,.12)';
          x.fillRect(X + 14 + l * 9, 85 + k * 20, 5, 4);
        }
      }
    }
  },
  // Editor de código que se escribe solo
  codigo(x, t, c) {
    caja(x, 30, 60, 452, 230, 10); x.fillStyle = 'rgba(10,10,18,.8)'; x.fill();
    x.font = M(13);
    const base = Math.floor(t * 0.8);
    for (let i = 0; i < 9; i++) {
      const linea = en(LINEAS_CODIGO, base + i);
      const visible = i === 8 ? linea.slice(0, Math.floor((t * 22) % (linea.length + 8))) : linea;
      x.fillStyle = '#3d3d52'; x.fillText(String(base + i + 1).padStart(2, ' '), 42, 88 + i * 22);
      x.fillStyle = linea.startsWith('//') ? '#6f7a8c' : i % 3 === 0 ? c : '#d6dbe6';
      x.fillText(visible, 72, 88 + i * 22);
    }
    if (Math.floor(t * 2.5) % 2) { x.fillStyle = c; x.fillRect(72 + x.measureText(en(LINEAS_CODIGO, base + 8).slice(0, Math.max(0, Math.floor((t * 22) % 40)))).width, 264, 8, 15); }
  },
  // Análisis de encuestas: barras con intervalos y un anillo de muestra
  barras(x, t, c) {
    const v = [0.42, 0.31, 0.12, 0.09, 0.06];
    v.forEach((p, i) => {
      const h = (p + Math.sin(t * 0.8 + i) * 0.02) * 380;
      caja(x, 50 + i * 62, 280 - h, 40, h, 6); x.fillStyle = i === 0 ? c : 'rgba(255,255,255,.28)'; x.fill();
      x.strokeStyle = 'rgba(255,255,255,.6)'; x.beginPath(); x.moveTo(70 + i * 62, 280 - h - 14); x.lineTo(70 + i * 62, 280 - h + 14); x.stroke();
    });
    const prog = (t * 0.15) % 1;
    x.beginPath(); x.arc(420, 160, 52, -Math.PI / 2, -Math.PI / 2 + prog * TAU); x.strokeStyle = c; x.lineWidth = 12; x.stroke(); x.lineWidth = 1;
    x.fillStyle = '#fff'; x.font = M(14); x.textAlign = 'center'; x.fillText('MUESTRA', 420, 166); x.textAlign = 'left';
  },
  // Línea que crece: disponibilidad, tiempo real, crecimiento
  linea(x, t, c) {
    x.strokeStyle = 'rgba(255,255,255,.08)';
    for (let k = 0; k < 5; k++) { x.beginPath(); x.moveTo(40, 90 + k * 45); x.lineTo(480, 90 + k * 45); x.stroke(); }
    x.beginPath();
    for (let i = 0; i <= 60; i++) { const px = 40 + i * 7.3, py = 250 - (i / 60) * 130 - Math.sin(i * 0.5 + t * 2) * 14 - ruido(i, t) * 18; i ? x.lineTo(px, py) : x.moveTo(px, py); }
    x.strokeStyle = c; x.lineWidth = 4; x.lineJoin = 'round'; x.stroke(); x.lineWidth = 1;
    const px = 40 + ((t * 40) % 438);
    x.fillStyle = 'rgba(255,255,255,.12)'; x.fillRect(px, 70, 2, 200);
  },
  // Barras de progreso: respaldos, migraciones
  progreso(x, t, c) {
    ['base de datos', 'archivos', 'configuración', 'registros'].forEach((n, i) => {
      const p = (t * (0.12 + i * 0.05) + i * 0.3) % 1;
      x.fillStyle = '#b9b9c8'; x.font = M(13); x.fillText(n.toUpperCase(), 48, 92 + i * 52);
      caja(x, 48, 102 + i * 52, 416, 10, 5); x.fillStyle = 'rgba(255,255,255,.08)'; x.fill();
      caja(x, 48, 102 + i * 52, 416 * p, 10, 5); x.fillStyle = c; x.fill();
      x.fillStyle = '#fff'; x.fillText(`${Math.round(p * 100)}%`, 430, 92 + i * 52);
    });
  },
  // Zero Trust: candado con anillos de verificación
  escudo(x, t, c) {
    for (let i = 0; i < 4; i++) {
      const r = 40 + ((t * 30 + i * 35) % 140);
      x.beginPath(); x.arc(256, 175, r, 0, TAU); x.strokeStyle = `rgba(255,255,255,${0.35 * (1 - r / 180)})`; x.lineWidth = 2; x.stroke();
    }
    x.lineWidth = 1;
    caja(x, 216, 160, 80, 66, 12); x.fillStyle = c; x.fill();
    x.beginPath(); x.arc(256, 160, 26, Math.PI, 0); x.strokeStyle = c; x.lineWidth = 10; x.stroke(); x.lineWidth = 1;
    x.fillStyle = '#0b0b12'; x.beginPath(); x.arc(256, 186, 8, 0, TAU); x.fill(); x.fillRect(253, 188, 6, 18);
  },
  // Centro de monitoreo: mapa de amenazas y registro
  soc(x, t, c) {
    caja(x, 30, 64, 200, 210, 8); x.strokeStyle = 'rgba(255,255,255,.15)'; x.stroke();
    for (let i = 0; i < 40; i++) { x.fillStyle = 'rgba(169,239,255,.35)'; x.fillRect(40 + ruido(i, 0) * 180, 74 + ruido(i + 99, 0) * 190, 2, 2); }
    for (let i = 0; i < 3; i++) {
      const f = (t * 0.9 + i * 0.33) % 1;
      x.beginPath(); x.arc(60 + i * 60, 120 + i * 50, 4 + f * 18, 0, TAU); x.strokeStyle = `rgba(255,68,88,${1 - f})`; x.stroke();
    }
    x.font = M(12);
    const base = Math.floor(t * 0.7);
    for (let i = 0; i < 8; i++) {
      const l = en(LOGS, base + i);
      x.fillStyle = l.includes('bloqueado') ? '#ff6b7d' : l.includes('alerta') ? '#ffd36b' : c;
      x.fillText(l, 246, 90 + i * 24);
    }
  },
  // Terminal de pruebas de intrusión autorizadas
  terminal(x, t, c) {
    caja(x, 30, 60, 452, 230, 10); x.fillStyle = 'rgba(5,5,10,.9)'; x.fill();
    const pasos = ['$ escaneo --alcance autorizado', '  3 servicios expuestos', '$ auditoria --tls', '  cifrado fuerte · ok', '$ prueba --credenciales', '  política de claves · ok', '$ reporte --entregar', '  hallazgos documentados'];
    x.font = M(13);
    const n = Math.floor(t * 1.4) % (pasos.length + 3);
    pasos.slice(0, Math.min(n, pasos.length)).forEach((p, i) => { x.fillStyle = p.startsWith('$') ? c : '#b9b9c8'; x.fillText(p, 48, 90 + i * 24); });
  },
  // Dona de participación
  dona(x, t, c) {
    const partes = [0.38, 0.24, 0.2, 0.18];
    const col = [c, 'rgba(255,255,255,.55)', 'rgba(255,255,255,.3)', 'rgba(255,255,255,.15)'];
    let a = -Math.PI / 2 + t * 0.2;
    partes.forEach((p, i) => { x.beginPath(); x.arc(170, 175, 88, a, a + p * TAU - 0.04); x.strokeStyle = col[i]; x.lineWidth = 26; x.stroke(); a += p * TAU; });
    x.lineWidth = 1;
    partes.forEach((p, i) => { caja(x, 300, 110 + i * 34, 14, 14, 4); x.fillStyle = col[i]; x.fill(); caja(x, 324, 113 + i * 34, 120 * p * 2.2, 8, 4); x.fillStyle = 'rgba(255,255,255,.25)'; x.fill(); });
  },
  // Red de nodos con paquetes viajando: modelos, integraciones, alianzas
  red(x, t, c) {
    const nodos = [[90, 120], [90, 230], [220, 90], [220, 175], [220, 260], [350, 130], [350, 225], [450, 175]];
    const aristas = [[0, 2], [0, 3], [1, 3], [1, 4], [2, 5], [3, 5], [3, 6], [4, 6], [5, 7], [6, 7]];
    aristas.forEach(([a, b], i) => {
      x.strokeStyle = 'rgba(255,255,255,.18)'; x.beginPath(); x.moveTo(...nodos[a]); x.lineTo(...nodos[b]); x.stroke();
      const f = (t * 0.6 + i * 0.17) % 1;
      x.fillStyle = c; x.beginPath(); x.arc(nodos[a][0] + (nodos[b][0] - nodos[a][0]) * f, nodos[a][1] + (nodos[b][1] - nodos[a][1]) * f, 4, 0, TAU); x.fill();
    });
    nodos.forEach(([a, b], i) => { x.beginPath(); x.arc(a, b, 12, 0, TAU); x.fillStyle = i === 7 ? c : 'rgba(255,255,255,.85)'; x.fill(); });
  },
  // Onda de voz de un agente de IA
  onda(x, t, c) {
    for (let i = 0; i < 46; i++) {
      const v = (Math.abs(Math.sin(i * 0.45 + t * 3) * Math.cos(i * 0.2 - t * 1.7)) * 0.9 + 0.08);
      const h = v * 150;
      caja(x, 36 + i * 9.8, 175 - h / 2, 5, h, 2.5); x.fillStyle = i % 5 === 0 ? '#fff' : c; x.fill();
    }
    caja(x, 40, 262, 220, 34, 12); x.fillStyle = 'rgba(255,255,255,.08)'; x.fill();
    x.fillStyle = '#d6dbe6'; x.font = M(12); x.fillText('agente: ¿en qué te ayudo?', 54, 284);
  },
  // Visión artificial: marco de escaneo sobre una pieza
  escaneo(x, t, c) {
    caja(x, 156, 90, 200, 170, 14); x.fillStyle = 'rgba(255,255,255,.06)'; x.fill();
    const y = 90 + ((t * 70) % 170);
    x.fillStyle = c; x.fillRect(150, y, 212, 3);
    x.strokeStyle = '#fff'; x.lineWidth = 4;
    [[140, 80, 1, 1], [372, 80, -1, 1], [140, 270, 1, -1], [372, 270, -1, -1]].forEach(([a, b, sx, sy]) => { x.beginPath(); x.moveTo(a, b + 28 * sy); x.lineTo(a, b); x.lineTo(a + 28 * sx, b); x.stroke(); });
    x.lineWidth = 1;
    x.font = M(12); x.fillStyle = c; x.fillText(`objeto detectado · ${(0.9 + Math.sin(t) * 0.05).toFixed(2)}`, 160, 296);
  },
  // Panel de gestión con indicadores
  panel(x, t, c) {
    caja(x, 30, 60, 70, 230, 10); x.fillStyle = 'rgba(255,255,255,.06)'; x.fill();
    for (let i = 0; i < 5; i++) { x.beginPath(); x.arc(65, 90 + i * 40, 9, 0, TAU); x.fillStyle = i === 1 ? c : 'rgba(255,255,255,.25)'; x.fill(); }
    for (let i = 0; i < 3; i++) {
      caja(x, 116 + i * 124, 60, 112, 70, 10); x.fillStyle = 'rgba(255,255,255,.07)'; x.fill();
      caja(x, 130 + i * 124, 96, 50 + Math.sin(t + i) * 20 + 20, 14, 5); x.fillStyle = i === 0 ? c : 'rgba(255,255,255,.4)'; x.fill();
    }
    x.beginPath();
    for (let i = 0; i <= 20; i++) { const px = 120 + i * 18, py = 250 - ruido(i, t * 0.5) * 80 - i * 2; i ? x.lineTo(px, py) : x.moveTo(px, py); }
    x.strokeStyle = c; x.lineWidth = 3; x.stroke(); x.lineWidth = 1;
  },
  // Prototipos: una interfaz que se arma por bloques
  wireframe(x, t, c) {
    const bloques = [[40, 60, 432, 40], [40, 112, 210, 120], [262, 112, 210, 56], [262, 176, 100, 56], [372, 176, 100, 56], [40, 244, 432, 40]];
    const n = Math.floor(t * 1.6) % (bloques.length + 3);
    bloques.forEach(([a, b, w, h], i) => {
      caja(x, a, b, w, h, 8);
      if (i < n) { x.fillStyle = i === 1 ? c : 'rgba(255,255,255,.12)'; x.fill(); } else { x.setLineDash([6, 6]); x.strokeStyle = 'rgba(255,255,255,.3)'; x.stroke(); x.setLineDash([]); }
    });
  },
  // Tubería de despliegue: código → pruebas → despliegue → monitoreo
  tuberia(x, t, c) {
    const etapas = ['CÓDIGO', 'PRUEBAS', 'BUILD', 'DESPLIEGUE'];
    const activa = Math.floor(t * 0.9) % (etapas.length + 1);
    etapas.forEach((e, i) => {
      const X = 30 + i * 120;
      caja(x, X, 140, 100, 60, 12); x.fillStyle = i < activa ? c : i === activa ? 'rgba(255,255,255,.25)' : 'rgba(255,255,255,.07)'; x.fill();
      x.fillStyle = i < activa ? '#0b0b12' : '#fff'; x.font = M(11); x.textAlign = 'center'; x.fillText(e, X + 50, 175); x.textAlign = 'left';
      if (i < 3) { x.strokeStyle = 'rgba(255,255,255,.3)'; x.beginPath(); x.moveTo(X + 104, 170); x.lineTo(X + 116, 170); x.stroke(); }
    });
    x.font = M(12); x.fillStyle = '#b9b9c8'; x.fillText(activa >= etapas.length ? '✓ en producción' : 'ejecutando…', 30, 250);
  },
  // Flujo automático: tareas conectadas con paquetes que pasan
  flujo(x, t, c) {
    const cajas = [[40, 80], [200, 80], [360, 80], [120, 210], [280, 210]];
    const lazos = [[0, 1], [1, 2], [1, 3], [3, 4], [4, 2]];
    lazos.forEach(([a, b], i) => {
      const [ax, ay] = cajas[a], [bx, by] = cajas[b];
      x.strokeStyle = 'rgba(255,255,255,.2)'; x.beginPath(); x.moveTo(ax + 56, ay + 26); x.lineTo(bx + 56, by + 26); x.stroke();
      const f = (t * 0.7 + i * 0.2) % 1;
      caja(x, ax + 50 + (bx - ax) * f, ay + 20 + (by - ay) * f, 12, 12, 3); x.fillStyle = c; x.fill();
    });
    cajas.forEach(([a, b], i) => { caja(x, a, b, 112, 52, 10); x.fillStyle = 'rgba(255,255,255,.08)'; x.fill(); x.strokeStyle = i === 2 ? c : 'rgba(255,255,255,.25)'; x.stroke(); });
  },
  // Mapa del mundo de puntos con arcos de conexión
  mapa(x, t, c) {
    for (let i = 0; i < 260; i++) {
      const px = 40 + ruido(i, 0) * 430, py = 80 + ruido(i + 300, 0) * 190;
      x.fillStyle = 'rgba(255,255,255,.28)'; x.fillRect(px, py, 2.5, 2.5);
    }
    const ciudades = [[110, 150], [180, 210], [270, 120], [360, 170], [430, 230]];
    for (let i = 0; i < ciudades.length - 1; i++) {
      const [a, b] = ciudades[i], [cX, d] = ciudades[(i + 2) % ciudades.length];
      x.beginPath(); x.moveTo(a, b); x.quadraticCurveTo((a + cX) / 2, Math.min(b, d) - 60, cX, d); x.strokeStyle = 'rgba(255,255,255,.25)'; x.stroke();
      const f = (t * 0.4 + i * 0.25) % 1;
      const qx = (1 - f) ** 2 * a + 2 * (1 - f) * f * ((a + cX) / 2) + f * f * cX, qy = (1 - f) ** 2 * b + 2 * (1 - f) * f * (Math.min(b, d) - 60) + f * f * d;
      x.beginPath(); x.arc(qx, qy, 4, 0, TAU); x.fillStyle = c; x.fill();
    }
    ciudades.forEach(([a, b]) => { x.beginPath(); x.arc(a, b, 6, 0, TAU); x.fillStyle = c; x.fill(); });
  },
};

// Lienzo animado de una tarjeta de trabajo.
export class TarjetaTrabajo {
  constructor(trabajo, empresa, i) {
    this.c = document.createElement('canvas');
    this.c.width = W; this.c.height = H;
    this.x = this.c.getContext('2d');
    this.trabajo = trabajo;
    this.empresa = empresa;
    this.i = i;
    this.color = empresa.colores[0];
    this.tex = new THREE.CanvasTexture(this.c);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.anisotropy = 8;
    this.dibujar(0);
  }
  dibujar(t) {
    const x = this.x;
    const fondo = x.createLinearGradient(0, 0, W, H);
    fondo.addColorStop(0, '#07070c'); fondo.addColorStop(1, '#0f0d18');
    x.fillStyle = fondo; x.fillRect(0, 0, W, H);
    x.strokeStyle = 'rgba(255,255,255,.035)';
    for (let k = 0; k < W; k += 32) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k, H); x.stroke(); }
    (FAMILIAS[this.trabajo.tipo] || FAMILIAS.linea)(x, t, this.color);
    x.fillStyle = 'rgba(255,255,255,.5)'; x.font = M(11);
    x.fillText(`${this.empresa.nombre.toUpperCase()} · ${String(this.i + 1).padStart(2, '0')} / 03`, 30, 24);
    x.fillStyle = '#ffffff'; x.font = F(500, 18, 'Unbounded');
    x.fillText(this.trabajo.titulo, 30, 49);
    this.tex.needsUpdate = true;
  }
}
