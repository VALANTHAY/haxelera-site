// Carrusel curvo de proyectos: tarjetas de vidrio alrededor de un cilindro que gira con el scroll.
// Al moverse rápido las tarjetas se curvan y separan sus colores; la del frente se ilumina.
import * as THREE from 'three';
import * as S from './shaders.js';

const TAU = Math.PI * 2;
const IRIS = ['#dccbff', '#a9efff', '#ffe3c9', '#ffc9ef'];
const GLIFOS = ['[=◇⌃◇=]', '[-◆∧◆-]', '[=△◇△=]', '<◇=◇>', '[≡◆≡]', '{◇⌄◇}'];
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const suave = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };

function caja(x, X, Y, W, H, R) { x.beginPath(); x.roundRect(X, Y, W, H, R); }
function iris(x, x0, y0, x1, y1) {
  const g = x.createLinearGradient(x0, y0, x1, y1);
  IRIS.forEach((c, i) => g.addColorStop(i / (IRIS.length - 1), c));
  return g;
}
const F = (peso, px, fam = 'Manrope') => `${peso} ${px}px "${fam}", system-ui, sans-serif`;
const M = (px) => `500 ${px}px "JetBrains Mono", ui-monospace, monospace`;

// ---------------------------------------------------------------- ilustraciones por proyecto
const ILUSTRA = [
  // 0 · Plataformas de gestión: un panel administrativo
  (x) => {
    caja(x, 470, 70, 500, 330, 22); x.fillStyle = 'rgba(255,255,255,.05)'; x.fill();
    caja(x, 470, 70, 90, 330, 22); x.fillStyle = 'rgba(255,255,255,.06)'; x.fill();
    for (let i = 0; i < 5; i++) { x.beginPath(); x.arc(515, 110 + i * 52, 12, 0, TAU); x.fillStyle = i === 1 ? '#a9efff' : 'rgba(255,255,255,.25)'; x.fill(); }
    for (let i = 0; i < 3; i++) {
      caja(x, 580 + i * 128, 90, 116, 74, 14); x.fillStyle = 'rgba(255,255,255,.07)'; x.fill();
      caja(x, 596 + i * 128, 108, 48, 10, 5); x.fillStyle = 'rgba(255,255,255,.35)'; x.fill();
      caja(x, 596 + i * 128, 130, 78, 18, 6); x.fillStyle = IRIS[i]; x.fill();
    }
    x.beginPath();
    [0.7, 0.55, 0.62, 0.4, 0.46, 0.28, 0.33, 0.18].forEach((v, i) => { const px = 590 + i * 50, py = 190 + v * 120; i ? x.lineTo(px, py) : x.moveTo(px, py); });
    x.strokeStyle = iris(x, 590, 0, 940, 0); x.lineWidth = 5; x.lineJoin = 'round'; x.stroke();
    for (let i = 0; i < 3; i++) { caja(x, 590, 330 + i * 22, 340 - i * 60, 10, 5); x.fillStyle = 'rgba(255,255,255,.18)'; x.fill(); }
  },
  // 1 · Apps de campo: teléfono con mapa, ruta GPS y marco de escaneo
  (x) => {
    caja(x, 650, 50, 200, 380, 34); x.fillStyle = 'rgba(255,255,255,.06)'; x.fill(); x.strokeStyle = 'rgba(255,255,255,.4)'; x.lineWidth = 3; x.stroke();
    x.save(); caja(x, 662, 62, 176, 356, 26); x.clip();
    x.strokeStyle = 'rgba(169,239,255,.18)'; x.lineWidth = 2;
    for (let i = 0; i < 9; i++) { x.beginPath(); x.moveTo(640, 70 + i * 44); x.lineTo(860, 40 + i * 44); x.stroke(); }
    for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(660 + i * 40, 40); x.lineTo(690 + i * 40, 440); x.stroke(); }
    x.beginPath(); [[690, 380], [720, 300], [700, 240], [760, 190], [800, 120]].forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b)));
    x.strokeStyle = '#a9efff'; x.lineWidth = 5; x.setLineDash([12, 9]); x.stroke(); x.setLineDash([]);
    x.restore();
    [[690, 380], [800, 120]].forEach(([a, b], i) => { x.beginPath(); x.arc(a, b, 11, 0, TAU); x.fillStyle = i ? '#ffc9ef' : '#ffffff'; x.fill(); });
    x.strokeStyle = '#ffffff'; x.lineWidth = 4;
    [[480, 120, 1, 1], [600, 120, -1, 1], [480, 260, 1, -1], [600, 260, -1, -1]].forEach(([a, b, sx, sy]) => { x.beginPath(); x.moveTo(a, b + 30 * sy); x.lineTo(a, b); x.lineTo(a + 30 * sx, b); x.stroke(); });
    caja(x, 500, 150, 80, 80, 8); x.fillStyle = 'rgba(220,203,255,.25)'; x.fill();
    x.fillStyle = 'rgba(169,239,255,.8)'; x.fillRect(476, 188, 128, 3);
  },
  // 2 · Analítica y encuestas: barras y anillo
  (x) => {
    const alturas = [0.45, 0.7, 0.55, 0.9, 0.62, 0.8, 0.38];
    alturas.forEach((v, i) => { const h = v * 250; caja(x, 480 + i * 46, 360 - h, 30, h, 8); x.fillStyle = iris(x, 0, 360 - h, 0, 360); x.fill(); });
    x.strokeStyle = 'rgba(255,255,255,.15)'; x.lineWidth = 2; x.beginPath(); x.moveTo(470, 362); x.lineTo(800, 362); x.stroke();
    const seg = [0.42, 0.27, 0.19, 0.12]; let a0 = -Math.PI / 2;
    seg.forEach((v, i) => { x.beginPath(); x.arc(880, 210, 74, a0, a0 + v * TAU - 0.06); x.strokeStyle = IRIS[i]; x.lineWidth = 26; x.stroke(); a0 += v * TAU; });
  },
  // 3 · Experiencias web 3D: túnel de triángulos en perspectiva
  (x) => {
    const cx = 720, cy = 230;
    for (let i = 9; i >= 1; i--) {
      const r = i * 24;
      x.beginPath(); x.moveTo(cx, cy - r); x.lineTo(cx + r * 0.95, cy + r * 0.62); x.lineTo(cx - r * 0.95, cy + r * 0.62); x.closePath();
      x.strokeStyle = i % 3 === 0 ? IRIS[(i / 3) % 4] : `rgba(255,255,255,${0.1 + i * 0.03})`; x.lineWidth = i % 3 === 0 ? 4 : 2; x.stroke();
    }
    x.strokeStyle = 'rgba(169,239,255,.25)'; x.lineWidth = 1.5;
    [[0, -1], [0.95, 0.62], [-0.95, 0.62]].forEach(([a, b]) => { x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + a * 230, cy + b * 230); x.stroke(); });
  },
  // 4 · Nube y respaldos: servidores conectados
  (x) => {
    const nodos = [[560, 120], [860, 110], [710, 230], [560, 340], [860, 350]];
    x.strokeStyle = 'rgba(169,239,255,.45)'; x.lineWidth = 3; x.setLineDash([10, 8]);
    [[0, 2], [1, 2], [2, 3], [2, 4], [0, 1]].forEach(([a, b]) => { x.beginPath(); x.moveTo(...nodos[a]); x.lineTo(...nodos[b]); x.stroke(); });
    x.setLineDash([]);
    nodos.forEach(([a, b], i) => {
      caja(x, a - 58, b - 36, 116, 72, 14); x.fillStyle = i === 2 ? 'rgba(220,203,255,.22)' : 'rgba(255,255,255,.07)'; x.fill();
      x.strokeStyle = 'rgba(255,255,255,.3)'; x.lineWidth = 2; x.stroke();
      for (let k = 0; k < 2; k++) { caja(x, a - 40, b - 18 + k * 20, 60, 8, 4); x.fillStyle = 'rgba(255,255,255,.3)'; x.fill(); }
      x.beginPath(); x.arc(a + 36, b - 14, 6, 0, TAU); x.fillStyle = IRIS[i % 4]; x.fill();
    });
  },
  // 5 · Automatización con IA: onda de voz y conversación
  (x) => {
    for (let i = 0; i < 38; i++) {
      const v = Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)) * 0.9 + 0.08;
      const h = v * 160;
      caja(x, 480 + i * 13, 150 - h / 2, 7, h, 3.5); x.fillStyle = iris(x, 480, 0, 980, 0); x.fill();
    }
    caja(x, 500, 270, 300, 62, 22); x.fillStyle = 'rgba(255,255,255,.08)'; x.fill();
    caja(x, 526, 292, 210, 10, 5); x.fillStyle = 'rgba(255,255,255,.4)'; x.fill();
    caja(x, 650, 350, 300, 62, 22); x.fillStyle = 'rgba(169,239,255,.22)'; x.fill();
    caja(x, 676, 372, 180, 10, 5); x.fillStyle = 'rgba(255,255,255,.6)'; x.fill();
  },
];

function partirTitulo(x, texto, ancho) {
  const palabras = texto.split(' ');
  const lineas = [];
  let actual = '';
  for (const p of palabras) {
    const prueba = actual ? `${actual} ${p}` : p;
    if (x.measureText(prueba).width > ancho && actual) { lineas.push(actual); actual = p; } else actual = prueba;
  }
  if (actual) lineas.push(actual);
  return lineas;
}

function dibujarCaso(x, w, h, p, i, n) {
  const fondo = x.createLinearGradient(0, 0, w, h);
  fondo.addColorStop(0, '#0d0c16'); fondo.addColorStop(1, '#17132a');
  x.fillStyle = fondo; x.fillRect(0, 0, w, h);
  const brillo = x.createRadialGradient(w * 0.72, h * 0.3, 10, w * 0.72, h * 0.3, w * 0.55);
  brillo.addColorStop(0, 'rgba(220,203,255,.18)'); brillo.addColorStop(1, 'rgba(220,203,255,0)');
  x.fillStyle = brillo; x.fillRect(0, 0, w, h);
  x.strokeStyle = 'rgba(255,255,255,.035)'; x.lineWidth = 1;
  for (let k = 0; k < w; k += 32) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k, h); x.stroke(); }
  for (let k = 0; k < h; k += 32) { x.beginPath(); x.moveTo(0, k); x.lineTo(w, k); x.stroke(); }
  (ILUSTRA[i % ILUSTRA.length])(x, w, h);
  x.fillStyle = 'rgba(255,255,255,.55)'; x.font = M(22);
  x.fillText(`${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}`, 56, 74);
  x.fillStyle = 'rgba(169,239,255,.9)'; x.font = M(24);
  x.fillText(GLIFOS[i % GLIFOS.length], 56, 112);
  x.fillStyle = '#ffffff'; x.font = F(500, 58, 'Unbounded');
  const lineas = partirTitulo(x, p.titulo, 520);
  const y0 = h - 74 - (lineas.length - 1) * 64;
  lineas.forEach((l, k) => x.fillText(l, 56, y0 + k * 64 - 34));
  x.fillStyle = 'rgba(255,255,255,.5)'; x.font = M(20);
  x.fillText((p.tec || '').toUpperCase(), 56, h - 50);
}

function lienzo(w, h, dibujar) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  dibujar(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export class Carrusel {
  constructor(ctx, proyectos) {
    this.grupo = new THREE.Group();
    this.n = proyectos.length;
    this.paso = TAU / Math.max(this.n, 6);
    this.rot = 0;
    this.objetivo = 0;
    this.vel = 0;
    this.hover = -1;
    this.uCurva = { value: 0 };
    this.uRGB = { value: 0 };
    this.uOpacidad = { value: 0 };
    this.W = 3.3;
    this.H = 2.06;
    this.escala = 1;
    const geo = new THREE.PlaneGeometry(this.W, this.H, 32, 1);
    this.tarjetas = proyectos.map((p, i) => {
      const u = {
        uMapa: { value: lienzo(1024, 640, (x, w, h) => dibujarCaso(x, w, h, p, i, this.n)) },
        uTiempo: ctx.uTiempo, uCurva: this.uCurva, uRGB: this.uRGB, uOpacidad: this.uOpacidad,
        uActivo: { value: 0 }, uHover: { value: 0 }, uAspecto: { value: this.W / this.H },
      };
      const m = new THREE.Mesh(geo, new THREE.ShaderMaterial({
        uniforms: u, vertexShader: S.CARTA_V, fragmentShader: S.CARTA_F,
        transparent: true, depthWrite: false, side: THREE.DoubleSide,
      }));
      m.userData.i = i;
      this.grupo.add(m);
      return m;
    });
  }

  colocar({ movil, zReposo }) {
    this.zReposo = zReposo;
    this.radio = movil ? 3.6 : 4.6;
    const distancia = movil ? 7.4 : 6.6;
    this.escala = movil ? 0.78 : 1;
    this.grupo.position.set(0, movil ? 0.35 : -0.15, zReposo - distancia - this.radio);
  }

  // Rectángulo de la tarjeta en pantalla (px), para que la vista del caso se abra desde ahí.
  rectPantalla(i, camara, W, H) {
    const t = this.tarjetas[i];
    t.updateMatrixWorld(true);
    let l = Infinity, r = -Infinity, a = Infinity, b = -Infinity;
    const v = new THREE.Vector3();
    for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
      v.set((x * this.W) / 2, (y * this.H) / 2, 0).applyMatrix4(t.matrixWorld).project(camara);
      const px = (v.x * 0.5 + 0.5) * W, py = (-v.y * 0.5 + 0.5) * H;
      l = Math.min(l, px); r = Math.max(r, px); a = Math.min(a, py); b = Math.max(b, py);
    }
    return { l: Math.max(0, l), r: Math.min(W, r), t: Math.max(0, a), b: Math.min(H, b) };
  }

  imagen(i) { return this.tarjetas[i].material.uniforms.uMapa.value.image.toDataURL('image/jpeg', 0.9); }

  // k: progreso 0..1 del recorrido por los proyectos.
  irA(k) { this.objetivo = k * (this.n - 1) * this.paso; }

  actualizar(dt, z, rayo) {
    const cerca = suave(1 - Math.abs(z - this.zReposo) / 16);
    this.grupo.visible = cerca > 0.001;
    if (!this.grupo.visible) return;
    this.uOpacidad.value = cerca;
    const prev = this.rot;
    this.rot += (this.objetivo - this.rot) * (1 - Math.exp(-dt * 6));
    const v = (this.rot - prev) / Math.max(dt, 1e-3);
    this.vel += (v - this.vel) * (1 - Math.exp(-dt * 8));
    this.uCurva.value = Math.max(-1.3, Math.min(1.3, this.vel * 0.55));
    this.uRGB.value = Math.max(-0.012, Math.min(0.012, this.vel * 0.006));

    // Tarjeta bajo el puntero
    let bajo = -1;
    if (rayo) {
      const hit = rayo.intersectObjects(this.tarjetas.filter(t => t.visible), false)[0];
      if (hit && hit.object.material.uniforms.uActivo.value > 0.15) bajo = hit.object.userData.i;
    }
    this.hover = bajo;

    const entrada = (1 - cerca) * 1.8;
    for (const t of this.tarjetas) {
      const i = t.userData.i;
      let th = i * this.paso - this.rot;
      th = Math.atan2(Math.sin(th), Math.cos(th));
      t.visible = Math.abs(th) < 1.95;
      if (!t.visible) continue;
      t.position.set(Math.sin(th) * this.radio, -entrada * (0.6 + i * 0.15), Math.cos(th) * this.radio);
      t.rotation.set(0, th, 0);
      const u = t.material.uniforms;
      u.uActivo.value = Math.exp(-(th * th) / 0.22);
      u.uHover.value += ((i === bajo ? 1 : 0) - u.uHover.value) * (1 - Math.exp(-dt * 10));
      t.scale.setScalar(this.escala * (1 + 0.035 * u.uHover.value));
    }
  }
}
