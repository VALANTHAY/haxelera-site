// Objetos procedurales de cada estación. Ningún modelo externo: todo se arma con geometría y lienzos.
// Cada fábrica devuelve { grupo, actualizar(dt, t, cerca) }. El grupo exterior lo coloca la escena;
// cada objeto anima solo su grupo interior para no pelear con esa posición.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import * as S from './shaders.js';

const TAU = Math.PI * 2;
const IRIS = ['#dccbff', '#a9efff', '#ffe3c9', '#ffc9ef'];

export function materiales() {
  return {
    cromo: new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 1, roughness: 0.12,
      iridescence: 1, iridescenceIOR: 1.7, iridescenceThicknessRange: [200, 760],
      clearcoat: 0.8, clearcoatRoughness: 0.08,
    }),
    titanio: new THREE.MeshPhysicalMaterial({ color: 0x9da1ab, metalness: 1, roughness: 0.28, clearcoat: 0.5, clearcoatRoughness: 0.2 }),
  };
}

// Material que brilla por encima de 1.0 para que el bloom lo recoja.
const brillo = (hex, k = 3) => new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k) });

function lienzo(w, h, dibujar) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d');
  dibujar(x, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function degradadoIris(x, x0, y0, x1, y1) {
  const g = x.createLinearGradient(x0, y0, x1, y1);
  IRIS.forEach((c, i) => g.addColorStop(i / (IRIS.length - 1), c));
  return g;
}

function caja(x, X, Y, W, H, R) { x.beginPath(); x.roundRect(X, Y, W, H, R); }

const FUENTE = (peso, px, familia = 'Manrope') => `${peso} ${px}px "${familia}", system-ui, sans-serif`;
const MONO = (px) => `500 ${px}px "JetBrains Mono", ui-monospace, monospace`;

// =====================================================================
// 01 · Software a medida: núcleo de cristal con un enjambre de módulos
// =====================================================================
function nucleo(ctx) {
  const g = new THREE.Group();
  const n = new THREE.Group();
  g.add(n);

  const cristal = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 0), ctx.m.cromo);
  n.add(cristal);

  const anillos = [0xdccbff, 0xa9efff, 0xffe3c9].map((c, i) => {
    const a = new THREE.Mesh(new THREE.TorusGeometry(1.42 + i * 0.22, 0.007 + i * 0.002, 8, 180), brillo(c, 2.6));
    a.rotation.set(0.6 + i * 0.9, 0.3 + i * 1.3, 0);
    n.add(a);
    return a;
  });

  const jaula = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.6, 1)),
    new THREE.LineBasicMaterial({ color: 0xb8c4ff, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  n.add(jaula);

  const N = 110, NL = 24;
  const geoCaja = new THREE.BoxGeometry(0.13, 0.13, 0.13);
  const modulos = new THREE.InstancedMesh(geoCaja, ctx.m.cromo, N);
  const luces = new THREE.InstancedMesh(geoCaja, brillo(0xffffff, 2.2), NL);
  n.add(modulos, luces);
  const params = Array.from({ length: N + NL }, () => ({
    r: 1.85 + Math.random() * 1.0, a: Math.random() * TAU, w: 0.16 + Math.random() * 0.3,
    inc: (Math.random() - 0.5) * 0.9, fase: Math.random() * TAU, giro: Math.random() * TAU, s: 0.6 + Math.random() * 0.9,
  }));
  const o = new THREE.Object3D();
  const eje = new THREE.Euler(0.35, 0, 0.2);
  function colocar(malla, ini, cuantos, t) {
    for (let i = 0; i < cuantos; i++) {
      const p = params[ini + i];
      const a = p.a + t * p.w;
      o.position.set(Math.cos(a) * p.r, Math.sin(a * 2 + p.fase) * 0.25 + Math.sin(a) * p.inc * p.r * 0.5, Math.sin(a) * p.r).applyEuler(eje);
      o.rotation.set(p.giro + t * 0.6, p.giro * 2 + t * 0.4, 0);
      o.scale.setScalar(p.s);
      o.updateMatrix();
      malla.setMatrixAt(i, o.matrix);
    }
    malla.instanceMatrix.needsUpdate = true;
  }

  return {
    grupo: g,
    actualizar(dt, t) {
      cristal.rotation.y += dt * 0.35;
      cristal.rotation.x += dt * 0.12;
      anillos.forEach((a, i) => { a.rotation.x += dt * (0.2 + i * 0.07); a.rotation.y += dt * (0.13 - i * 0.05); });
      jaula.rotation.y -= dt * 0.05;
      colocar(modulos, 0, N, t);
      colocar(luces, N, NL, t);
      n.rotation.y = Math.sin(t * 0.2) * 0.2;
      n.position.y = Math.sin(t * 0.6) * 0.08;
    },
  };
}

// =====================================================================
// 02 · Apps móviles: teléfono de titanio con tarjetas flotando
// =====================================================================
function dibujarApp(x, w, h) {
  caja(x, 0, 0, w, h, 70);
  const fondo = x.createLinearGradient(0, 0, 0, h);
  fondo.addColorStop(0, '#101019'); fondo.addColorStop(1, '#17131f');
  x.fillStyle = fondo; x.fill();
  x.save(); x.clip();
  // isla y barra de estado
  caja(x, w / 2 - 70, 26, 140, 40, 20); x.fillStyle = '#000'; x.fill();
  x.fillStyle = '#fff'; x.font = FUENTE(600, 26); x.fillText('9:41', 50, 56);
  caja(x, w - 92, 38, 44, 20, 6); x.strokeStyle = 'rgba(255,255,255,.7)'; x.lineWidth = 2; x.stroke();
  caja(x, w - 89, 41, 32, 14, 4); x.fillStyle = '#fff'; x.fill();
  // encabezado
  x.fillStyle = '#9a9aa8'; x.font = FUENTE(500, 26); x.fillText('Hola de nuevo', 44, 150);
  x.fillStyle = '#fff'; x.font = FUENTE(600, 52, 'Unbounded'); x.fillText('Tu panel', 44, 214);
  // tarjeta principal con gráfica
  caja(x, 36, 250, w - 72, 300, 36); x.fillStyle = degradadoIris(x, 36, 250, w - 36, 550); x.fill();
  x.fillStyle = 'rgba(10,10,16,.85)'; x.font = FUENTE(600, 26); x.fillText('Actividad', 68, 300);
  x.beginPath();
  const pts = [0.62, 0.55, 0.66, 0.48, 0.52, 0.36, 0.42, 0.28, 0.3, 0.2];
  pts.forEach((v, i) => { const px = 68 + i * ((w - 136) / (pts.length - 1)); const py = 330 + v * 190; i ? x.lineTo(px, py) : x.moveTo(px, py); });
  x.strokeStyle = 'rgba(10,10,16,.85)'; x.lineWidth = 6; x.lineJoin = 'round'; x.stroke();
  // accesos
  ['#dccbff', '#a9efff', '#ffe3c9'].forEach((c, i) => {
    const bx = 36 + i * ((w - 72 - 32) / 3 + 16), bw = (w - 72 - 32) / 3;
    caja(x, bx, 580, bw, 130, 28); x.fillStyle = 'rgba(255,255,255,.06)'; x.fill();
    x.beginPath(); x.arc(bx + 40, 620, 18, 0, TAU); x.fillStyle = c; x.fill();
    caja(x, bx + 22, 668, bw - 44, 12, 6); x.fillStyle = 'rgba(255,255,255,.28)'; x.fill();
  });
  // lista
  for (let i = 0; i < 3; i++) {
    const y = 750 + i * 96;
    x.beginPath(); x.arc(72, y + 30, 28, 0, TAU); x.fillStyle = IRIS[(i + 1) % 4]; x.fill();
    caja(x, 120, y + 12, 250 - i * 40, 14, 7); x.fillStyle = 'rgba(255,255,255,.75)'; x.fill();
    caja(x, 120, y + 38, 180 + i * 20, 12, 6); x.fillStyle = 'rgba(255,255,255,.25)'; x.fill();
  }
  // barra inferior
  caja(x, w / 2 - 80, h - 34, 160, 8, 4); x.fillStyle = 'rgba(255,255,255,.6)'; x.fill();
  x.restore();
}

function icono(x, tipo, cx, cy) {
  x.save();
  x.strokeStyle = '#0b0b12'; x.fillStyle = '#0b0b12'; x.lineWidth = 6; x.lineCap = 'round'; x.lineJoin = 'round';
  x.beginPath();
  if (tipo === 'ok') { x.moveTo(cx - 16, cy); x.lineTo(cx - 4, cy + 12); x.lineTo(cx + 18, cy - 12); x.stroke(); }
  if (tipo === 'nube') { x.arc(cx - 10, cy + 4, 11, Math.PI * 0.5, Math.PI * 1.5); x.arc(cx + 2, cy - 6, 14, Math.PI, 0); x.arc(cx + 14, cy + 4, 10, Math.PI * 1.5, Math.PI * 0.5); x.closePath(); x.stroke(); }
  if (tipo === 'candado') { caja(x, cx - 15, cy - 4, 30, 24, 5); x.fill(); x.beginPath(); x.arc(cx, cy - 6, 10, Math.PI, 0); x.stroke(); }
  if (tipo === 'campana') { x.moveTo(cx - 15, cy + 10); x.quadraticCurveTo(cx - 13, cy - 18, cx, cy - 18); x.quadraticCurveTo(cx + 13, cy - 18, cx + 15, cy + 10); x.closePath(); x.fill(); x.beginPath(); x.arc(cx, cy + 14, 5, 0, TAU); x.fill(); }
  x.restore();
}

function dibujarTarjeta(x, w, h, d) {
  caja(x, 4, 4, w - 8, h - 8, 44);
  x.fillStyle = 'rgba(18,18,28,.86)'; x.fill();
  x.strokeStyle = 'rgba(255,255,255,.16)'; x.lineWidth = 3; x.stroke();
  x.beginPath(); x.arc(96, h / 2, 50, 0, TAU); x.fillStyle = degradadoIris(x, 46, 50, 146, 150); x.fill();
  icono(x, d.icono, 96, h / 2);
  x.fillStyle = '#fff'; x.font = FUENTE(600, 40); x.fillText(d.titulo, 176, h / 2 - 8);
  x.fillStyle = '#a9a9b6'; x.font = FUENTE(500, 28); x.fillText(d.sub, 176, h / 2 + 38);
}

function telefono(ctx) {
  const g = new THREE.Group();
  const n = new THREE.Group();
  g.add(n);
  const cuerpo = new THREE.Mesh(new RoundedBoxGeometry(1.6, 3.2, 0.16, 6, 0.2), ctx.m.titanio);
  n.add(cuerpo);
  const pantalla = new THREE.Mesh(
    new THREE.PlaneGeometry(1.46, 2.92),
    new THREE.MeshBasicMaterial({ map: lienzo(560, 1120, dibujarApp), transparent: true, toneMapped: false }),
  );
  pantalla.position.z = 0.081;
  n.add(pantalla);

  const datos = [
    { titulo: 'Sincronizado', sub: 'Al día en todos tus equipos', icono: 'ok', y: 1.05 },
    { titulo: 'Sin conexión', sub: 'La app sigue funcionando', icono: 'nube', y: 0.15 },
    { titulo: 'Pago aprobado', sub: 'Transacción cifrada', icono: 'candado', y: -0.55 },
    { titulo: 'Notificación', sub: 'Tu pedido va en camino', icono: 'campana', y: -1.2 },
  ];
  const tarjetas = datos.map((d, i) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(1.62, 0.506),
      new THREE.MeshBasicMaterial({ map: lienzo(640, 200, (x, w, h) => dibujarTarjeta(x, w, h, d)), transparent: true, depthWrite: false, toneMapped: false }),
    );
    m.renderOrder = 2;
    g.add(m);
    return { m, a: (i / datos.length) * TAU + 0.4, y: d.y, r: 1.75 + (i % 2) * 0.2 };
  });

  return {
    grupo: g,
    actualizar(dt, t) {
      n.rotation.y = Math.sin(t * 0.45) * 0.42;
      n.rotation.x = Math.sin(t * 0.3) * 0.06;
      n.position.y = Math.sin(t * 0.7) * 0.07;
      for (const c of tarjetas) {
        const a = c.a + t * 0.22;
        c.m.position.set(Math.cos(a) * c.r, c.y + Math.sin(t * 0.9 + c.a) * 0.06, Math.sin(a) * 0.9 + 0.2);
        c.m.material.opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(a));
      }
    },
  };
}

// =====================================================================
// 03 · Desarrollo web: capas de una página separándose en el espacio
// =====================================================================
function etiqueta(x, w, h, texto) {
  x.font = MONO(26); x.fillStyle = 'rgba(255,255,255,.85)';
  x.fillText(texto, 34, h - 30);
}

function dibujarEstructura(x, w, h, et) {
  x.strokeStyle = 'rgba(169,239,255,.8)'; x.lineWidth = 3; x.setLineDash([12, 10]);
  const cajas = [[40, 40, w - 80, 70], [40, 140, w - 80, 220], [40, 390, (w - 120) / 3, 150], [60 + (w - 120) / 3, 390, (w - 120) / 3, 150], [80 + 2 * (w - 120) / 3, 390, (w - 120) / 3, 150]];
  cajas.forEach(([X, Y, W, H]) => { caja(x, X, Y, W, H, 14); x.stroke(); });
  x.setLineDash([]);
  x.font = MONO(22); x.fillStyle = 'rgba(169,239,255,.9)';
  x.fillText('<header>', 58, 84); x.fillText('<main>', 58, 184); x.fillText('<section>', 58, 430);
  etiqueta(x, w, h, et);
}

function dibujarEstilo(x, w, h, et) {
  caja(x, 40, 40, w - 80, h - 80, 30);
  x.fillStyle = 'rgba(20,18,30,.55)'; x.fill();
  x.fillStyle = '#fff'; x.font = FUENTE(500, 150, 'Unbounded'); x.fillText('Aa', 80, 250);
  IRIS.forEach((c, i) => { x.beginPath(); x.arc(560 + i * 100, 170, 38, 0, TAU); x.fillStyle = c; x.fill(); });
  caja(x, 80, 320, w - 160, 120, 24); x.fillStyle = degradadoIris(x, 80, 320, w - 80, 440); x.fill();
  [0, 1, 2, 3, 4].forEach(i => { caja(x, 80 + i * 60, 480, 44, 44 - i * 6, 8); x.fillStyle = 'rgba(255,255,255,.35)'; x.fill(); });
  etiqueta(x, w, h, et);
}

function dibujarInteraccion(x, w, h, et) {
  caja(x, 90, 110, 300, 84, 42); x.fillStyle = '#fff'; x.fill();
  x.fillStyle = '#0b0b12'; x.font = FUENTE(600, 32); x.fillText('Comenzar', 168, 163);
  caja(x, 420, 110, 260, 84, 42); x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 3; x.stroke();
  x.fillStyle = '#fff'; x.fillText('Ver más', 488, 163);
  caja(x, 90, 250, 140, 70, 35); x.fillStyle = degradadoIris(x, 90, 250, 230, 320); x.fill();
  x.beginPath(); x.arc(195, 285, 27, 0, TAU); x.fillStyle = '#fff'; x.fill();
  caja(x, 280, 278, 420, 12, 6); x.fillStyle = 'rgba(255,255,255,.2)'; x.fill();
  caja(x, 280, 278, 260, 12, 6); x.fillStyle = '#a9efff'; x.fill();
  x.beginPath(); x.arc(540, 284, 20, 0, TAU); x.fillStyle = '#fff'; x.fill();
  x.font = MONO(26); x.fillStyle = 'rgba(220,203,255,.95)';
  x.fillText('boton.onclick = () => animar()', 90, 410);
  // cursor
  x.beginPath(); x.moveTo(760, 380); x.lineTo(760, 470); x.lineTo(784, 446); x.lineTo(804, 490); x.lineTo(818, 483); x.lineTo(798, 440); x.lineTo(830, 440); x.closePath();
  x.fillStyle = '#fff'; x.fill();
  etiqueta(x, w, h, et);
}

function dibujarNavegador(x, w, h, et) {
  caja(x, 6, 6, w - 12, h - 12, 34);
  x.strokeStyle = 'rgba(255,255,255,.55)'; x.lineWidth = 4; x.stroke();
  x.save(); x.clip();
  x.fillStyle = 'rgba(255,255,255,.06)'; x.fillRect(0, 0, w, 76);
  ['#ff6b6b', '#ffd36b', '#6bffb0'].forEach((c, i) => { x.beginPath(); x.arc(46 + i * 34, 38, 10, 0, TAU); x.fillStyle = c; x.fill(); });
  caja(x, 200, 20, w - 400, 36, 18); x.fillStyle = 'rgba(255,255,255,.1)'; x.fill();
  x.fillStyle = '#e6e6ee'; x.font = MONO(20); x.textAlign = 'center'; x.fillText('haxeleragroup.com', w / 2, 45); x.textAlign = 'left';
  const r = x.createRadialGradient(w / 2, h * 0.62, 10, w / 2, h * 0.62, w * 0.5);
  r.addColorStop(0, 'rgba(220,203,255,.22)'); r.addColorStop(1, 'rgba(220,203,255,0)');
  x.fillStyle = r; x.fillRect(0, 76, w, h);
  x.restore();
  etiqueta(x, w, h, et);
}

function capas(ctx, lado) {
  const g = new THREE.Group();
  const n = new THREE.Group();
  g.add(n);
  const W = 3.3, H = 2.06;
  const fabricas = [dibujarEstructura, dibujarEstilo, dibujarInteraccion, dibujarNavegador];
  const nombres = ['HTML', 'CSS', 'JS', 'WEBGL'];
  const bordeGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-W / 2, -H / 2, 0), new THREE.Vector3(W / 2, -H / 2, 0), new THREE.Vector3(W / 2, H / 2, 0), new THREE.Vector3(-W / 2, H / 2, 0),
  ]);
  const planos = fabricas.map((f, i) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(W, H),
      new THREE.MeshBasicMaterial({ color: 0xbdbdc6, map: lienzo(1024, 640, (x, w, h) => f(x, w, h, nombres[i])), transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }),
    );
    const borde = new THREE.LineLoop(bordeGeo, new THREE.LineBasicMaterial({ color: new THREE.Color(IRIS[i]).multiplyScalar(1.6), transparent: true, opacity: 0.7 }));
    m.add(borde);
    m.renderOrder = i;
    n.add(m);
    return m;
  });
  n.rotation.set(-0.12, -lado * 0.85, 0.02);
  n.scale.setScalar(0.84);

  return {
    grupo: g,
    actualizar(dt, t, cerca) {
      const abre = 0.45 + 0.4 * (0.5 + 0.5 * Math.sin(t * 0.55)) * (0.4 + 0.6 * cerca);
      planos.forEach((p, i) => { p.position.z = (i - 1.5) * abre; p.position.y = (i - 1.5) * 0.12 + Math.sin(t * 0.8 + i) * 0.04; });
      n.rotation.y = -lado * 0.85 + Math.sin(t * 0.3) * 0.1;
      n.position.y = Math.sin(t * 0.6) * 0.06;
    },
  };
}

// =====================================================================
// 04 · Ciberseguridad: candado dentro de un escudo que desvía ataques
// =====================================================================
function crearCandado(mat) {
  const gr = new THREE.Group();
  const w = 0.9, h = 0.72, r = 0.12;
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2); s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r); s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2); s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r); s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  // ojo de la cerradura: círculo arriba y ranura abajo, en un solo contorno
  const ojo = new THREE.Path();
  ojo.moveTo(-0.04, -0.2);
  ojo.lineTo(-0.04, -0.0206);
  ojo.absarc(0, 0.06, 0.09, 4.2516, -1.1100, true);
  ojo.lineTo(0.04, -0.2);
  ojo.lineTo(-0.04, -0.2);
  s.holes.push(ojo);
  const cuerpo = new THREE.Mesh(new THREE.ExtrudeGeometry(s, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 4, curveSegments: 24 }), mat);
  cuerpo.geometry.center();
  gr.add(cuerpo);
  const arco = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.065, 20, 48, Math.PI), mat);
  arco.position.y = h / 2 + 0.16;
  gr.add(arco);
  [-0.27, 0.27].forEach(px => {
    const pata = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.18, 20), mat);
    pata.position.set(px, h / 2 + 0.07, 0);
    gr.add(pata);
  });
  gr.position.y = -0.12;
  return gr;
}

function escudo(ctx, lado) {
  const g = new THREE.Group();
  const n = new THREE.Group();
  g.add(n);
  const candado = crearCandado(ctx.m.cromo);
  candado.scale.setScalar(1.15);
  g.add(candado);

  const R = 1.95;
  const impactos = Array.from({ length: 6 }, () => new THREE.Vector4(0, 0, 1, -100));
  const esfera = new THREE.Mesh(
    new THREE.IcosahedronGeometry(R, 5),
    new THREE.ShaderMaterial({
      uniforms: { uImp: { value: impactos }, uTiempo: ctx.uTiempo, uActivo: { value: 1 } },
      vertexShader: S.ESCUDO_V, fragmentShader: S.ESCUDO_F,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    }),
  );
  n.add(esfera);
  const malla = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(R * 1.004, 2), 1),
    new THREE.LineBasicMaterial({ color: 0xbfd0ff, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending, depthWrite: false }),
  );
  n.add(malla);

  const NA = 16;
  const geoA = new THREE.OctahedronGeometry(0.055, 0);
  geoA.scale(1, 1, 5);
  const ataques = new THREE.InstancedMesh(geoA, brillo(0xff3b4e, 4.5), NA);
  n.add(ataques);
  const estado = Array.from({ length: NA }, () => ({ p: new THREE.Vector3(), v: new THREE.Vector3(), espera: Math.random() * 2.5, vivo: false }));
  const o = new THREE.Object3D();
  const centro = new THREE.Vector3();
  const dir = new THREE.Vector3();
  let siguiente = 0;

  function nacer(a) {
    dir.randomDirection();
    dir.z += 0.7; dir.x -= lado * 0.4;
    dir.normalize();
    a.p.copy(dir).multiplyScalar(7 + Math.random() * 3);
    a.v.copy(dir).multiplyScalar(-(3.2 + Math.random() * 2.2));
    a.vivo = true;
  }

  return {
    grupo: g,
    actualizar(dt, t, cerca) {
      n.rotation.y += dt * 0.1;
      candado.rotation.y = -lado * 0.35 + Math.sin(t * 0.6) * 0.3;
      candado.position.y = Math.sin(t * 0.8) * 0.06;
      for (let i = 0; i < NA; i++) {
        const a = estado[i];
        o.scale.setScalar(0);
        if (!a.vivo) {
          a.espera -= dt;
          if (a.espera <= 0 && cerca > 0.05) nacer(a);
        } else {
          a.p.addScaledVector(a.v, dt);
          if (a.p.length() < R) {
            // Impacto: el escudo dibuja una onda donde pegó y el ataque desaparece.
            dir.copy(a.p).normalize();
            impactos[siguiente].set(dir.x, dir.y, dir.z, t);
            siguiente = (siguiente + 1) % impactos.length;
            a.vivo = false;
            a.espera = 0.15 + Math.random() * 1.6;
          } else {
            o.position.copy(a.p);
            o.lookAt(centro);
            o.scale.setScalar(1);
          }
        }
        o.updateMatrix();
        ataques.setMatrixAt(i, o.matrix);
      }
      ataques.instanceMatrix.needsUpdate = true;
    },
  };
}

// =====================================================================
// 05 · Cloud y DevOps: el ciclo infinito con paquetes viajando
// =====================================================================
function textoMono(x, w, h, texto) {
  x.font = MONO(40); x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillStyle = 'rgba(255,255,255,.9)';
  x.fillText(texto, w / 2, h / 2);
}

function infinito(ctx, lado) {
  const g = new THREE.Group();
  const n = new THREE.Group();
  g.add(n);
  const pts = [];
  for (let i = 0; i < 200; i++) {
    const t = (i / 200) * TAU;
    const den = 1 + Math.sin(t) ** 2;
    pts.push(new THREE.Vector3((2.15 * Math.cos(t)) / den, ((2.15 * Math.sin(t) * Math.cos(t)) / den) * 1.3, 0.55 * Math.sin(t)));
  }
  const curva = new THREE.CatmullRomCurve3(pts, true);
  n.add(new THREE.Mesh(new THREE.TubeGeometry(curva, 360, 0.07, 16, true), ctx.m.cromo));

  n.scale.setScalar(0.8);
  const NP = 26;
  const paquetes = new THREE.InstancedMesh(new THREE.SphereGeometry(0.095, 14, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }), NP);
  const col = new THREE.Color();
  for (let i = 0; i < NP; i++) paquetes.setColorAt(i, col.set(IRIS[i % 4]).multiplyScalar(2.4));
  n.add(paquetes);
  const fases = Array.from({ length: NP }, (_, i) => i / NP);

  ['CÓDIGO', 'PRUEBAS', 'DESPLIEGUE', 'MONITOREO'].forEach((txt, i) => {
    const p = curva.getPointAt([0.1, 0.4, 0.6, 0.9][i]);
    const nodo = new THREE.Mesh(new RoundedBoxGeometry(0.34, 0.22, 0.34, 3, 0.05), ctx.m.titanio);
    nodo.position.copy(p);
    const led = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.025), brillo(0xa9efff, 4));
    led.position.z = 0.172;
    nodo.add(led);
    n.add(nodo);
    const rotulo = new THREE.Sprite(new THREE.SpriteMaterial({ map: lienzo(512, 96, (x, w, h) => textoMono(x, w, h, txt)), transparent: true, depthWrite: false, toneMapped: false }));
    rotulo.scale.set(1.25, 0.234, 1);
    rotulo.position.copy(p).add(new THREE.Vector3(0, 0.36, 0));
    n.add(rotulo);
  });

  const orbitas = [0, 1].map(i => {
    const o = new THREE.Mesh(new THREE.TorusGeometry(2.5 + i * 0.25, 0.006, 6, 200), brillo(i ? 0xa9efff : 0xdccbff, 1.4));
    o.rotation.set(1.2 + i * 0.5, 0.3 - i * 0.6, 0);
    n.add(o);
    return o;
  });

  const tmp = new THREE.Vector3();
  const m4 = new THREE.Matrix4();
  return {
    grupo: g,
    actualizar(dt, t) {
      n.rotation.y = -lado * 0.35 + Math.sin(t * 0.25) * 0.3;
      n.rotation.x = 0.22 + Math.sin(t * 0.2) * 0.08;
      n.position.y = Math.sin(t * 0.6) * 0.06;
      for (let i = 0; i < NP; i++) {
        curva.getPointAt((fases[i] + t * 0.06) % 1, tmp);
        m4.makeTranslation(tmp.x, tmp.y, tmp.z);
        paquetes.setMatrixAt(i, m4);
      }
      paquetes.instanceMatrix.needsUpdate = true;
      orbitas.forEach((o, i) => { o.rotation.z += dt * (0.1 + i * 0.05); });
    },
  };
}

// =====================================================================
// 06 · Datos e IA: red neuronal con señales que se propagan
// =====================================================================
function red(ctx, lado) {
  const g = new THREE.Group();
  const n = new THREE.Group();
  g.add(n);
  n.scale.setScalar(0.8);
  const capasN = [4, 7, 7, 3];
  const nodos = [];
  capasN.forEach((k, c) => {
    const x = (c - 1.5) * 1.35;
    for (let i = 0; i < k; i++) nodos.push({ p: new THREE.Vector3(x, (i - (k - 1) / 2) * 0.55, (Math.random() - 0.5) * 0.6), capa: c, luz: 0 });
  });
  const porCapa = capasN.map((_, c) => nodos.map((nd, i) => (nd.capa === c ? i : -1)).filter(i => i >= 0));

  const esferas = new THREE.InstancedMesh(new THREE.SphereGeometry(0.085, 20, 14), new THREE.MeshBasicMaterial({ color: 0xffffff }), nodos.length);
  const aros = new THREE.InstancedMesh(new THREE.TorusGeometry(0.16, 0.012, 8, 40), ctx.m.cromo, nodos.length);
  const o = new THREE.Object3D();
  const col = new THREE.Color();
  nodos.forEach((nd, i) => {
    o.position.copy(nd.p); o.rotation.set(0, 0, 0); o.updateMatrix();
    esferas.setMatrixAt(i, o.matrix);
    o.rotation.set(Math.random() * 3, Math.random() * 3, 0); o.updateMatrix();
    aros.setMatrixAt(i, o.matrix);
    esferas.setColorAt(i, col.setScalar(1.2));
  });
  n.add(esferas, aros);

  const lineasPos = [];
  for (let c = 0; c < capasN.length - 1; c++) {
    for (const a of porCapa[c]) for (const b of porCapa[c + 1]) lineasPos.push(nodos[a].p, nodos[b].p);
  }
  n.add(new THREE.LineSegments(
    new THREE.BufferGeometry().setFromPoints(lineasPos),
    new THREE.LineBasicMaterial({ color: 0xaab6ff, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false }),
  ));

  const NS = 30;
  const senales = new THREE.InstancedMesh(new THREE.SphereGeometry(0.04, 10, 8), brillo(0xffffff, 2.4), NS);
  n.add(senales);
  const est = Array.from({ length: NS }, () => ({ de: -1, a: 0, k: 0, vel: 1, espera: Math.random() * 2 }));
  function seguir(s, desde) {
    const c = nodos[desde].capa;
    if (c >= capasN.length - 1) { s.de = -1; s.espera = Math.random() * 0.8; return; }
    const sig = porCapa[c + 1];
    s.de = desde; s.a = sig[(Math.random() * sig.length) | 0]; s.k = 0; s.vel = 1.1 + Math.random() * 1.2;
  }
  const tmp = new THREE.Vector3();

  return {
    grupo: g,
    actualizar(dt, t, cerca) {
      for (let i = 0; i < NS; i++) {
        const s = est[i];
        if (s.de < 0) {
          s.espera -= dt;
          if (s.espera <= 0 && cerca > 0.05) seguir(s, porCapa[0][(Math.random() * porCapa[0].length) | 0]);
          o.scale.setScalar(0);
        } else {
          s.k += dt * s.vel;
          if (s.k >= 1) { nodos[s.a].luz = 1; seguir(s, s.a); }
          if (s.de >= 0) { tmp.lerpVectors(nodos[s.de].p, nodos[s.a].p, Math.min(s.k, 1)); o.position.copy(tmp); o.scale.setScalar(1); }
          else o.scale.setScalar(0);
        }
        o.rotation.set(0, 0, 0);
        o.updateMatrix();
        senales.setMatrixAt(i, o.matrix);
      }
      senales.instanceMatrix.needsUpdate = true;
      nodos.forEach((nd, i) => {
        nd.luz *= Math.exp(-dt * 3);
        esferas.setColorAt(i, col.set(IRIS[nd.capa]).multiplyScalar(0.9 + nd.luz * 2.2));
      });
      esferas.instanceColor.needsUpdate = true;
      n.rotation.y = -lado * 0.45 + Math.sin(t * 0.2) * 0.25;
      n.position.y = Math.sin(t * 0.6) * 0.06;
    },
  };
}

// Recorre un polígono cerrado a velocidad constante (bordes del portal y puertas triangulares).
export class CurvaPoligono extends THREE.Curve {
  constructor(pts) {
    super();
    this.pts = pts;
    this.acum = [0];
    let L = 0;
    for (let i = 0; i < pts.length; i++) { L += pts[i].distanceTo(pts[(i + 1) % pts.length]); this.acum.push(L); }
    this.L = L;
  }
  getPoint(t, out = new THREE.Vector3()) {
    const d = (((t % 1) + 1) % 1) * this.L;
    let i = 0;
    while (i < this.pts.length - 1 && this.acum[i + 1] < d) i++;
    const seg = this.acum[i + 1] - this.acum[i];
    return out.copy(this.pts[i]).lerp(this.pts[(i + 1) % this.pts.length], seg > 0 ? (d - this.acum[i]) / seg : 0);
  }
}

// =====================================================================
// Puerta de luz triangular (la forma del portal) con un barrido que la recorre
// =====================================================================
export function crearPuerta(ctx, puntos, fase, grosor = 0.022, tinte = null) {
  const curva = new CurvaPoligono(puntos.map(p => new THREE.Vector3(p.x, p.y, 0)));
  return new THREE.Mesh(
    new THREE.TubeGeometry(curva, 360, grosor, 8, true),
    new THREE.ShaderMaterial({
      uniforms: {
        uTiempo: ctx.uTiempo, uFase: { value: fase }, uBrillo: { value: 1 }, uDibujo: { value: 1 },
        uTinte: { value: new THREE.Color(tinte ?? 0xffffff) }, uMezcla: { value: tinte === null ? 0 : 0.85 },
      },
      vertexShader: S.UV_V, fragmentShader: S.PUERTA_F,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }),
  );
}

// Polígono regular de n lados (radio al vértice), con un giro inicial.
export function poligono(n, radio, giro = 0, escalaY = 1) {
  return Array.from({ length: n }, (_, i) => {
    const a = giro + (i / n) * Math.PI * 2;
    return new THREE.Vector2(Math.cos(a) * radio, Math.sin(a) * radio * escalaY);
  });
}

export const FABRICAS = { nucleo, telefono, capas, escudo, infinito, red };
