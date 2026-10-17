// Puestos de trabajo con personas holográficas: programadores y analistas de ciberseguridad.
// La persona es una nube de puntos con una silueta oscura dentro (así se ve sólida) y escribe en el teclado.
// Las pantallas comparten unas pocas texturas vivas: código que se escribe solo y un tablero de seguridad.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import * as S from './shaders.js';

const TAU = Math.PI * 2;

// ---------------------------------------------------------------- pantallas vivas
const CODIGO = [
  ['// Haxelera · plataforma de gestión', 'c'],
  ["import { crearServidor } from './nucleo';", ''],
  ["import { cifrar, verificarToken } from './seguridad';", ''],
  ['', ''],
  ['export async function registrar(usuario) {', ''],
  ['  const token = await verificarToken(usuario.sesion);', ''],
  ["  if (!token.valido) throw new Error('Sesión vencida');", ''],
  ['  const datos = cifrar(usuario.perfil, token.clave);', ''],
  ["  return db.insertar('perfiles', { ...datos, creado: Date.now() });", ''],
  ['}', ''],
  ['', ''],
  ['struct Panel: View {', ''],
  ['  @State private var metricas: [Metrica] = []', ''],
  ['  var body: some View {', ''],
  ['    Grafica(datos: metricas).animation(.spring, value: metricas)', ''],
  ['  }', ''],
  ['}', ''],
  ['', ''],
  ['def ponderar(muestra, universo):', ''],
  ['    pesos = universo / muestra.sum(axis=0)', ''],
  ['    return muestra * pesos  # raking por celdas', ''],
  ['', ''],
  ['const tunel = new Mundo(lienzo, { calidad: "alta" });', ''],
  ['await tunel.preparar((paso) => registro.push(paso));', ''],
  ['renderizar(escena, camara, { bloom: 0.62, grano: 0.045 });', ''],
  ['', ''],
  ['// pruebas: 128 pasaron · 0 fallaron', 'c'],
];
const PALABRAS = /\b(import|from|export|async|await|function|const|let|if|throw|new|return|struct|var|some|private|def|for|in)\b/g;
const LOGS = [
  ['ok', 'firewall · regla 204 aplicada'],
  ['bloqueado', 'intento de acceso · puerto 22'],
  ['ok', 'certificado TLS renovado'],
  ['alerta', 'patrón inusual · cuenta de prueba'],
  ['ok', 'respaldo cifrado completado'],
  ['bloqueado', 'inyección SQL · formulario de contacto'],
  ['ok', 'parche de seguridad desplegado'],
  ['ok', 'escaneo de puertos · sin hallazgos'],
  ['bloqueado', 'fuerza bruta · 40 intentos'],
];

function lineaCodigo(x, texto, px, py, tipo) {
  if (tipo === 'c') { x.fillStyle = '#6f7a8c'; x.fillText(texto, px, py); return; }
  // Resaltado simple: palabras clave, cadenas y números.
  const piezas = [];
  let ultimo = 0;
  const re = /('[^']*'|"[^"]*"|\b\d+\b|#.*$)/g;
  let m;
  while ((m = re.exec(texto))) { piezas.push([texto.slice(ultimo, m.index), '']); piezas.push([m[0], m[0][0] === '#' ? 'c' : /\d/.test(m[0][0]) ? 'n' : 's']); ultimo = m.index + m[0].length; }
  piezas.push([texto.slice(ultimo), '']);
  let cx = px;
  for (const [t, k] of piezas) {
    if (!t) continue;
    if (k) {
      x.fillStyle = k === 's' ? '#ffd2b0' : k === 'n' ? '#a9efff' : '#6f7a8c';
      x.fillText(t, cx, py); cx += x.measureText(t).width; continue;
    }
    let u = 0;
    t.replace(PALABRAS, (pal, _g, idx) => {
      const antes = t.slice(u, idx);
      x.fillStyle = '#d6dbe6'; x.fillText(antes, cx, py); cx += x.measureText(antes).width;
      x.fillStyle = '#c9b2ff'; x.fillText(pal, cx, py); cx += x.measureText(pal).width;
      u = idx + pal.length;
      return pal;
    });
    const resto = t.slice(u);
    x.fillStyle = '#d6dbe6'; x.fillText(resto, cx, py); cx += x.measureText(resto).width;
  }
}

class PantallaCodigo {
  constructor(semilla) {
    this.c = document.createElement('canvas');
    this.c.width = 512; this.c.height = 288;
    this.x = this.c.getContext('2d');
    this.inicio = semilla * 7;
    this.letras = 0;
    this.tex = new THREE.CanvasTexture(this.c);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.dibujar();
  }
  paso() {
    this.letras += 2 + Math.floor(Math.random() * 3);
    const actual = CODIGO[(this.inicio + 13) % CODIGO.length][0];
    if (this.letras > actual.length + 6) { this.letras = 0; this.inicio++; }
    this.dibujar();
  }
  dibujar() {
    const x = this.x, W = 512, H = 288;
    x.fillStyle = '#0c0c14'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#14141f'; x.fillRect(0, 0, W, 22);
    ['#ff6b6b', '#ffd36b', '#6bffb0'].forEach((c, i) => { x.beginPath(); x.arc(12 + i * 14, 11, 4, 0, TAU); x.fillStyle = c; x.fill(); });
    x.font = '500 11px "JetBrains Mono", monospace'; x.fillStyle = '#8b8ba0'; x.fillText('nucleo.ts — haxelera', 64, 15);
    x.font = '500 13px "JetBrains Mono", monospace';
    for (let i = 0; i < 13; i++) {
      const [t, k] = CODIGO[(this.inicio + i) % CODIGO.length];
      const y = 42 + i * 18;
      x.fillStyle = '#3d3d52'; x.fillText(String(((this.inicio + i) % 99) + 1).padStart(2, ' '), 8, y);
      const texto = i === 13 - 0 ? t : t;
      if (i === 12) {
        const parcial = t.slice(0, this.letras);
        lineaCodigo(x, parcial, 36, y, k);
        if (Math.floor(performance.now() / 400) % 2) { x.fillStyle = '#a9efff'; x.fillRect(36 + x.measureText(parcial).width + 1, y - 11, 7, 14); }
      } else lineaCodigo(x, texto, 36, y, k);
    }
    this.tex.needsUpdate = true;
  }
}

class PantallaCiber {
  constructor(semilla) {
    this.c = document.createElement('canvas');
    this.c.width = 512; this.c.height = 288;
    this.x = this.c.getContext('2d');
    this.semilla = semilla;
    this.log = LOGS.slice(semilla % LOGS.length).concat(LOGS.slice(0, semilla % LOGS.length));
    this.trafico = Array.from({ length: 48 }, () => Math.random());
    this.alerta = 0;
    this.puntos = Array.from({ length: 70 }, () => [Math.random(), Math.random()]);
    this.tex = new THREE.CanvasTexture(this.c);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.dibujar();
  }
  impacto() { this.alerta = 1; }
  paso() {
    if (Math.random() < 0.18) { this.log.push(this.log.shift()); if (this.log[this.log.length - 1][0] === 'bloqueado') this.alerta = 1; }
    this.trafico.shift(); this.trafico.push(Math.random() * (this.alerta > 0.5 ? 1 : 0.6));
    this.alerta = Math.max(0, this.alerta - 0.12);
    this.dibujar();
  }
  dibujar() {
    const x = this.x, W = 512, H = 288, t = performance.now() / 1000;
    x.fillStyle = '#0b0a12'; x.fillRect(0, 0, W, H);
    x.font = '500 11px "JetBrains Mono", monospace';
    x.fillStyle = '#14131f'; x.fillRect(0, 0, W, 24);
    x.fillStyle = '#d6dbe6'; x.fillText('SOC · MONITOREO EN VIVO', 12, 16);
    x.beginPath(); x.arc(W - 16, 12, 5, 0, TAU); x.fillStyle = this.alerta > 0.3 ? '#ff4458' : '#5cf2a6'; x.fill();
    // mapa de amenazas
    x.strokeStyle = 'rgba(169,239,255,.12)'; x.strokeRect(10, 34, 230, 140);
    for (const [px, py] of this.puntos) { x.fillStyle = 'rgba(169,239,255,.35)'; x.fillRect(14 + px * 222, 38 + py * 132, 2, 2); }
    for (let i = 0; i < 4; i++) {
      const [px, py] = this.puntos[(i * 13 + this.semilla) % this.puntos.length];
      const r = 4 + ((t * 1.4 + i * 0.37) % 1) * 14;
      x.beginPath(); x.arc(14 + px * 222, 38 + py * 132, r, 0, TAU); x.strokeStyle = `rgba(255,68,88,${1 - ((t * 1.4 + i * 0.37) % 1)})`; x.stroke();
    }
    // registro
    x.font = '500 11px "JetBrains Mono", monospace';
    this.log.slice(0, 8).forEach(([nivel, msg], i) => {
      const y = 46 + i * 17;
      x.fillStyle = nivel === 'ok' ? '#5cf2a6' : nivel === 'alerta' ? '#ffd36b' : '#ff6b7d';
      x.fillText(`[${nivel}]`, 252, y);
      x.fillStyle = '#b9b9c8'; x.fillText(msg.slice(0, 26), 252 + x.measureText(`[${nivel}] `).width, y);
    });
    // tráfico
    x.beginPath();
    this.trafico.forEach((v, i) => { const px = 10 + i * (492 / 47), py = 268 - v * 70; i ? x.lineTo(px, py) : x.moveTo(px, py); });
    x.strokeStyle = '#a9efff'; x.lineWidth = 2; x.stroke(); x.lineWidth = 1;
    x.fillStyle = '#6f6f86'; x.fillText('TRÁFICO · ÚLTIMOS 60 s', 12, 194);
    if (this.alerta > 0.05) {
      x.fillStyle = `rgba(255,68,88,${0.22 * this.alerta})`; x.fillRect(0, 0, W, H);
      x.fillStyle = `rgba(255,68,88,${this.alerta})`; x.fillRect(0, 126, W, 34);
      x.fillStyle = '#ffffff'; x.font = '600 15px "JetBrains Mono", monospace'; x.fillText('INTENTO BLOQUEADO', 172, 149);
    }
    this.tex.needsUpdate = true;
  }
}

// Texturas compartidas por todos los monitores (se actualizan solo cuando hay alguno cerca).
export class Pantallas {
  constructor() {
    this.codigo = [0, 1, 2].map(i => new PantallaCodigo(i));
    this.ciber = [0, 1, 2].map(i => new PantallaCiber(i));
    this.reloj = 0;
    this.activas = false;
  }
  actualizar(dt) {
    if (!this.activas) return;
    this.activas = false;
    this.reloj += dt;
    if (this.reloj < 0.11) return;
    this.reloj = 0;
    for (const p of this.codigo) p.paso();
    for (const p of this.ciber) p.paso();
  }
  impacto() { this.ciber.forEach(p => p.impacto()); }
}

// ---------------------------------------------------------------- persona
function capsula(r, largo, desde, hasta) {
  const g = new THREE.CapsuleGeometry(r, largo, 4, 10);
  const a = new THREE.Vector3(...desde), b = new THREE.Vector3(...hasta);
  const dir = b.clone().sub(a);
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  g.applyQuaternion(q);
  const m = a.clone().add(b).multiplyScalar(0.5);
  g.translate(m.x, m.y, m.z);
  return g;
}
function esfera(r, c) { const g = new THREE.SphereGeometry(r, 14, 10); g.translate(...c); return g; }

// Partes del cuerpo sentado (origen en el asiento, mirando hacia −z). k encoge la silueta interior.
function cuerpo(k = 1) {
  return [
    capsula(0.16 * k, 0.34, [0, 0.16, 0.04], [0, 0.58, -0.04]),        // torso
    capsula(0.045 * k, 0.06, [0, 0.66, -0.05], [0, 0.74, -0.06]),      // cuello
    capsula(0.075 * k, 0.3, [-0.1, 0.03, 0.02], [-0.1, 0.03, -0.38]),  // muslos
    capsula(0.075 * k, 0.3, [0.1, 0.03, 0.02], [0.1, 0.03, -0.38]),
    capsula(0.06 * k, 0.32, [-0.1, -0.02, -0.42], [-0.1, -0.42, -0.44]), // piernas
    capsula(0.06 * k, 0.32, [0.1, -0.02, -0.42], [0.1, -0.42, -0.44]),
    capsula(0.052 * k, 0.2, [-0.22, 0.56, -0.04], [-0.24, 0.32, -0.2]), // brazos
    capsula(0.052 * k, 0.2, [0.22, 0.56, -0.04], [0.24, 0.32, -0.2]),
  ];
}
const CODO_I = new THREE.Vector3(-0.24, 0.32, -0.2), CODO_D = new THREE.Vector3(0.24, 0.32, -0.2), CUELLO = new THREE.Vector3(0, 0.72, -0.05);
function antebrazo(lado, k = 1) {
  const c = lado < 0 ? CODO_I : CODO_D;
  const muneca = [lado * 0.15, 0.335, -0.47];
  const g = mergeGeometries([capsula(0.046 * k, 0.2, [c.x, c.y, c.z], muneca), esfera(0.046 * k, muneca)]);
  g.translate(-c.x, -c.y, -c.z);
  return g;
}
function cabeza(k = 1) {
  const g = esfera(0.118 * k, [0, 0.86, -0.08]);
  g.translate(-CUELLO.x, -CUELLO.y, -CUELLO.z);
  return g;
}

function muestrear(geo, n) {
  const sampler = new MeshSurfaceSampler(new THREE.Mesh(geo)).build();
  const pos = new Float32Array(n * 3), rnd = new Float32Array(n), v = new THREE.Vector3();
  for (let i = 0; i < n; i++) { sampler.sample(v); pos.set([v.x, v.y, v.z], i * 3); rnd[i] = Math.random(); }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));
  return g;
}

function crearPersona(ctx, colores, densidad) {
  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTiempo: ctx.uTiempo, uEscala: ctx.uEscala, uActivo: { value: 1 }, uOpacidad: { value: 1 },
      uColorA: { value: new THREE.Color(colores[0]) }, uColorB: { value: new THREE.Color(colores[1]) },
    },
    vertexShader: S.PERSONA_V, fragmentShader: S.PUNTO_F, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const sombra = new THREE.MeshBasicMaterial({ color: 0x06060b });
  const g = new THREE.Group();
  const nubes = (geoPuntos, geoSombra, padre) => {
    const p = new THREE.Points(geoPuntos, mat);
    p.frustumCulled = false;
    padre.add(p, new THREE.Mesh(geoSombra, sombra));
  };
  nubes(muestrear(mergeGeometries(cuerpo()), Math.round(3800 * densidad)), mergeGeometries(cuerpo(0.9)), g);
  const ejeCabeza = new THREE.Group(); ejeCabeza.position.copy(CUELLO); g.add(ejeCabeza);
  nubes(muestrear(cabeza(), Math.round(900 * densidad)), cabeza(0.9), ejeCabeza);
  const brazos = [-1, 1].map(lado => {
    const eje = new THREE.Group(); eje.position.copy(lado < 0 ? CODO_I : CODO_D); g.add(eje);
    nubes(muestrear(antebrazo(lado), Math.round(520 * densidad)), antebrazo(lado, 0.88), eje);
    return eje;
  });
  return { grupo: g, mat, ejeCabeza, brazos };
}

// ---------------------------------------------------------------- puesto completo
export function crearPuesto(ctx, { tipo = 'codigo', semilla = 0, densidad = 1 } = {}) {
  const g = new THREE.Group();
  const titanio = ctx.m.titanio;
  const oscuro = new THREE.MeshStandardMaterial({ color: 0x15151d, metalness: 0.6, roughness: 0.45 });
  const acento = new THREE.MeshBasicMaterial({ color: new THREE.Color(tipo === 'ciber' ? 0xff6b7d : 0xa9efff).multiplyScalar(2.4) });

  // Escritorio, borde de luz, silla y torre
  const mesa = new THREE.Mesh(new RoundedBoxGeometry(1.7, 0.05, 0.72, 2, 0.02), oscuro);
  mesa.position.set(0, 0.28, -0.64);
  const borde = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.012, 0.012), acento);
  borde.position.set(0, 0.258, -0.28);
  [-0.78, 0.78].forEach(px => { const pata = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.74, 0.6), oscuro); pata.position.set(px, -0.1, -0.64); g.add(pata); });
  const asiento = new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.07, 0.44, 2, 0.03), oscuro);
  asiento.position.set(0, -0.04, 0.02);
  const respaldo = new THREE.Mesh(new RoundedBoxGeometry(0.44, 0.34, 0.06, 2, 0.03), oscuro);
  respaldo.position.set(0, 0.2, 0.26); respaldo.rotation.x = 0.12;
  const poste = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.4), titanio);
  poste.position.set(0, -0.26, 0.02);
  const torre = new THREE.Mesh(new RoundedBoxGeometry(0.2, 0.46, 0.44, 2, 0.02), titanio);
  torre.position.set(0.62, -0.25, -0.68);
  const rgb = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.38, 0.012), acento);
  rgb.position.set(0.51, -0.25, -0.47);
  g.add(mesa, borde, asiento, respaldo, poste, torre, rgb);

  // Teclado con teclas encendidas
  const teclas = document.createElement('canvas'); teclas.width = 256; teclas.height = 80;
  const tx = teclas.getContext('2d'); tx.fillStyle = '#0d0d14'; tx.fillRect(0, 0, 256, 80);
  for (let f = 0; f < 4; f++) for (let c = 0; c < 15; c++) { tx.fillStyle = 'rgba(169,239,255,.55)'; tx.fillRect(6 + c * 16.4, 6 + f * 18, 13, 14); }
  const texTeclas = new THREE.CanvasTexture(teclas); texTeclas.colorSpace = THREE.SRGBColorSpace;
  const teclado = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.02, 0.18), [oscuro, oscuro, new THREE.MeshBasicMaterial({ map: texTeclas }), oscuro, oscuro, oscuro]);
  teclado.position.set(0, 0.315, -0.47);
  g.add(teclado);

  // Monitores: dos para programar, tres en arco para el analista
  const n = tipo === 'ciber' ? 3 : 2;
  const lista = tipo === 'ciber' ? ctx.pantallas.ciber : ctx.pantallas.codigo;
  for (let i = 0; i < n; i++) {
    const m = new THREE.Group();
    const marco = new THREE.Mesh(new RoundedBoxGeometry(0.74, 0.44, 0.03, 2, 0.012), titanio);
    const pantalla = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.394), new THREE.MeshBasicMaterial({ map: lista[(semilla + i) % lista.length].tex, color: new THREE.Color(1.25, 1.25, 1.25) }));
    pantalla.position.z = 0.0155;
    const soporte = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.24, 0.02), titanio);
    soporte.position.set(0, -0.3, -0.02);
    m.add(marco, pantalla, soporte);
    const desfase = n === 3 ? (i - 1) : (i - 0.5);
    m.position.set(desfase * 0.74, 0.66, -0.88 + Math.abs(desfase) * 0.12);
    m.rotation.y = -desfase * (n === 3 ? 0.42 : 0.18);
    g.add(m);
  }

  // Persona
  const colores = tipo === 'ciber' ? ['#ffc9d2', '#a9efff'] : ['#dccbff', '#a9efff'];
  const p = crearPersona(ctx, colores, densidad);
  g.add(p.grupo);
  const fase = semilla * 1.7;

  return {
    grupo: g,
    actualizar(dt, t, cerca) {
      if (cerca > 0.02) ctx.pantallas.activas = true;
      p.mat.uniforms.uActivo.value = 0.25 + 0.75 * cerca;
      // Escribe a ráfagas, con pausas para pensar.
      const rafaga = Math.sin(t * 0.9 + fase) > -0.2 ? 1 : 0;
      p.brazos.forEach((b, i) => {
        b.rotation.x = Math.sin(t * 17 + fase + i * 1.9) * 0.07 * rafaga;
        b.rotation.z = Math.sin(t * 11 + fase * 2 + i) * 0.03 * rafaga;
      });
      const giro = tipo === 'ciber' ? Math.sin(t * 0.3 + fase) * 0.42 : Math.sin(t * 0.25 + fase) * 0.12;
      p.ejeCabeza.rotation.set(0.12 + Math.sin(t * 0.7 + fase) * 0.03, giro, 0);
      p.grupo.position.y = Math.sin(t * 1.4 + fase) * 0.004;
    },
  };
}
