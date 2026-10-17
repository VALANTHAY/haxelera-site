// Ecosistema Haxelera: cada empresa del grupo es una dimensión con su propio fondo animado
// (nebulosa, cristales, nubes, iones, ciudad de datos, laboratorio, prismas de luz, oro y un planeta conectado)
// y un portal triangular con su nombre en el centro. Al cruzar el portal se entra a su perfil,
// donde vive su columna vertebral con los trabajos.
import * as THREE from 'three';
import * as S from './shaders.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { crearPuerta, poligono } from './objetos.js';
import { TarjetaTrabajo } from './trabajos.js';

const TAU = Math.PI * 2;
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const suave = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
const azar = (a, b) => a + Math.random() * (b - a);
const V2 = (x, y) => new THREE.Vector2(x, y);
const col = (c, k = 1) => new THREE.Color(c).multiplyScalar(k);

function rectRedondo(w, h, r, pasos = 4) {
  const pts = [];
  const esquinas = [[w / 2 - r, h / 2 - r, 0], [-w / 2 + r, h / 2 - r, Math.PI / 2], [-w / 2 + r, -h / 2 + r, Math.PI], [w / 2 - r, -h / 2 + r, Math.PI * 1.5]];
  for (const [cx, cy, a0] of esquinas) for (let i = 0; i <= pasos; i++) { const a = a0 + (i / pasos) * Math.PI / 2; pts.push(V2(cx + Math.cos(a) * r, cy + Math.sin(a) * r)); }
  return pts;
}

// ---------------------------------------------------------------- sombreadores de las dimensiones
const VORTICE_V = /* glsl */ `
uniform float uTiempo, uEscala, uAct, uGiro, uDespeje;
uniform vec3 uC1, uC2;
attribute vec3 aDatos;
varying float vA;
varying vec3 vC;
void main(){
  float r = aDatos.x;
  float th = aDatos.y + uTiempo * uGiro / (0.4 + r * 0.25);
  vec3 p = vec3(cos(th) * r, sin(th) * r * 0.8, position.z);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float d = max(-mv.z, 0.01);
  gl_PointSize = clamp((0.02 + aDatos.z * 0.05) * uEscala / d, 1.0, 28.0);
  gl_Position = projectionMatrix * mv;
  vA = uAct * (0.3 + 0.7 * aDatos.z) * smoothstep(0.4, 2.5, d);
  vec2 q = gl_Position.xy / max(gl_Position.w, 0.001);
  vA *= 1.0 - uDespeje * (1.0 - smoothstep(0.12, 0.46, length(q * vec2(1.0, 1.55))));
  vC = mix(uC1, uC2, clamp(r / 8.0 + aDatos.z * 0.3, 0.0, 1.0));
}
`;
const SUBIDA_V = /* glsl */ `
uniform float uTiempo, uEscala, uAct, uAlto, uTam, uDespeje;
uniform vec3 uC1, uC2;
attribute vec3 aDatos;
varying float vA;
varying vec3 vC;
void main(){
  vec3 p = position;
  p.y = mod(p.y + uTiempo * (0.25 + aDatos.x * 0.6), uAlto) - uAlto * 0.5;
  p.x += sin(uTiempo * 0.4 + aDatos.y * 6.28) * 0.3;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float d = max(-mv.z, 0.01);
  gl_PointSize = clamp((uTam * (0.4 + aDatos.z)) * uEscala / d, 1.0, 90.0);
  gl_Position = projectionMatrix * mv;
  float bordes = 1.0 - smoothstep(uAlto * 0.3, uAlto * 0.5, abs(p.y));
  vA = uAct * (0.25 + 0.75 * aDatos.z) * bordes * smoothstep(0.4, 2.0, d);
  vec2 q = gl_Position.xy / max(gl_Position.w, 0.001);
  vA *= 1.0 - uDespeje * (1.0 - smoothstep(0.12, 0.46, length(q * vec2(1.0, 1.55))));
  vC = mix(uC1, uC2, aDatos.y);
}
`;
const BARRAS_V = /* glsl */ `
uniform float uTiempo, uAct, uPulso;
uniform vec3 uC1, uC2;
attribute vec3 aBase;
varying vec3 vC;
varying float vB;
${S.RUIDO}
void main(){
  float n = snoise(vec3(aBase.x * 0.22, aBase.y * 0.16 - uTiempo * 0.45, uTiempo * 0.12)) * 0.5 + 0.5;
  float h = (0.12 + n * n * 2.6) * (0.25 + 0.75 * uAct) * (1.0 + uPulso * (0.4 + n));
  vec3 p = position;
  float alto = (p.y + 0.5);
  p.y = alto * h * aBase.z;
  p.xz *= 0.36;
  vec3 w = vec3(aBase.x, aBase.z > 0.0 ? -2.7 : 2.9, aBase.y) + p;
  vC = mix(uC1, uC2, n);
  vB = uAct * (0.1 + alto * alto * (0.85 + uPulso * 1.2));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(w, 1.0);
}
`;
const BARRAS_F = /* glsl */ `
varying vec3 vC;
varying float vB;
void main(){ gl_FragColor = vec4(vC * vB, 1.0); }
`;
const TRAZO_V = /* glsl */ `
varying vec2 vUv;
varying vec2 vQ;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  vQ = gl_Position.xy / max(gl_Position.w, 0.001);
}
`;
const TRAZO_F = /* glsl */ `
uniform float uTiempo, uAct, uFase, uDespeje;
uniform vec3 uC1, uC2;
varying vec2 vUv;
varying vec2 vQ;
void main(){
  float pulso = pow(fract(vUv.x * 3.0 - uTiempo * 0.5 + uFase), 10.0) * 4.0;
  float limpio = 1.0 - uDespeje * (1.0 - smoothstep(0.12, 0.46, length(vQ * vec2(1.0, 1.55))));
  gl_FragColor = vec4(mix(uC1, uC2, vUv.x) * (0.25 + pulso) * uAct * limpio, 1.0);
}
`;

// Membrana del portal: un remolino con los colores de la dimensión que se atraviesa al entrar.
const MEMBRANA_F = /* glsl */ `
uniform float uTiempo, uAct;
uniform vec3 uC1, uC2;
varying vec2 vUv;
${S.RUIDO}
void main(){
  vec2 p = vUv / 9.0;
  float r = length(p);
  float n = snoise(vec3(p * 3.0, uTiempo * 0.3));
  float remolino = sin(atan(p.y, p.x) * 3.0 + r * 14.0 - uTiempo * 2.2 + n * 2.5) * 0.5 + 0.5;
  vec3 c = mix(uC1, uC2, remolino) * (0.12 + 0.4 * remolino) * (1.0 - smoothstep(0.15, 0.6, r) * 0.55);
  gl_FragColor = vec4(c * uAct, 1.0);
}
`;

function puntos(ctx, n, llenar, vert, extra = {}) {
  const pos = new Float32Array(n * 3), dat = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) llenar(i, pos, dat);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aDatos', new THREE.BufferAttribute(dat, 3));
  const p = new THREE.Points(g, new THREE.ShaderMaterial({
    uniforms: { uTiempo: ctx.uTiempo, uEscala: ctx.uEscala, uAct: ctx.uAct, uDespeje: ctx.uDespeje, uOpacidad: { value: 1 }, uC1: { value: col(ctx.c1) }, uC2: { value: col(ctx.c2) }, ...extra },
    vertexShader: vert, fragmentShader: S.PUNTO_F, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  p.frustumCulled = false;
  return p;
}

function trazo(ctx, curva, radio, fase) {
  return new THREE.Mesh(new THREE.TubeGeometry(curva, 200, radio, 5, false), new THREE.ShaderMaterial({
    uniforms: { uTiempo: ctx.uTiempo, uAct: ctx.uAct, uDespeje: ctx.uDespeje, uFase: { value: fase }, uC1: { value: col(ctx.c1, 1.6) }, uC2: { value: col(ctx.c2, 1.6) } },
    vertexShader: TRAZO_V, fragmentShader: TRAZO_F, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
}

// Cono despejado: visto desde la parada frente al portal, ningún objeto tapa el triángulo ni el nombre.
// Lo que queda más allá de la parada se aparta del eje en proporción a su distancia.
function despejar(v, ctx, margen = 1) {
  const d = (ctx.zParada ?? -13) - v.z;
  if (d <= 0) return v;
  const rmin = 0.36 * d + margen;
  const r = Math.hypot(v.x, v.y);
  if (r >= rmin) return v;
  const a = r > 1e-3 ? Math.atan2(v.y, v.x) : Math.random() * TAU;
  v.x = Math.cos(a) * rmin;
  v.y = Math.sin(a) * rmin;
  return v;
}

// ---------------------------------------------------------------- mundos
const MUNDOS = {
  // NEXORA · nebulosa en espiral que gira alrededor del camino
  nebulosa(ctx, L) {
    const g = new THREE.Group();
    const n = Math.round(9000 * ctx.densidad);
    g.add(puntos(ctx, n, (i, pos, dat) => {
      const r = 1.6 + Math.pow(Math.random(), 1.6) * 8;
      const brazo = (i % 3) * (TAU / 3);
      pos[i * 3 + 2] = -Math.random() * L;
      dat.set([r, brazo + r * 0.55 + azar(-0.35, 0.35) + pos[i * 3 + 2] * 0.08, Math.random()], i * 3);
    }, VORTICE_V, { uGiro: { value: 0.35 } }));
    return { grupo: g, portal: poligono(5, 4, Math.PI / 2) };
  },

  // HAXORA · campo de cristales de cromo iridiscente
  cristal(ctx, L) {
    const g = new THREE.Group();
    const n = Math.round(150 * ctx.densidad);
    const hielo = new THREE.MeshPhysicalMaterial({
      color: 0xeaf6ff, metalness: 0.85, roughness: 0.06, iridescence: 1, iridescenceIOR: 1.8, iridescenceThicknessRange: [250, 800],
      clearcoat: 1, clearcoatRoughness: 0.05, emissive: col(ctx.c2, 0.22),
    });
    const m = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.34, 0), hielo, n);
    const brillo = new THREE.InstancedMesh(new THREE.OctahedronGeometry(0.16, 0), new THREE.MeshBasicMaterial({ color: col(ctx.c2, 2.6) }), 60);
    g.add(puntos(ctx, Math.round(1600 * ctx.densidad), (i, pos, dat) => {
      pos[i * 3 + 2] = -Math.random() * L;
      dat.set([azar(1.2, 8), Math.random() * TAU, Math.random()], i * 3);
    }, VORTICE_V, { uGiro: { value: 0.08 } }));
    const est = Array.from({ length: n + 60 }, () => {
      const a = Math.random() * TAU, r = azar(2.2, 7);
      return { p: despejar(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * 0.75, -Math.random() * L), ctx, 0.6), e: new THREE.Euler(Math.random() * 3, Math.random() * 3, 0), s: azar(0.5, 1.8), w: azar(0.2, 0.9) };
    });
    m.frustumCulled = brillo.frustumCulled = false;
    g.add(m, brillo);
    const o = new THREE.Object3D();
    return {
      grupo: g, portal: poligono(3, 4.4, -Math.PI / 2),
      actualizar(dt, t, act) {
        est.forEach((e, i) => {
          o.position.copy(e.p); o.position.y += Math.sin(t * 0.6 + i) * 0.12;
          o.rotation.set(e.e.x + t * e.w, e.e.y + t * e.w * 0.7, 0);
          o.scale.setScalar(e.s * (0.6 + 0.4 * act)); o.updateMatrix();
          if (i < n) m.setMatrixAt(i, o.matrix); else brillo.setMatrixAt(i - n, o.matrix);
        });
        m.instanceMatrix.needsUpdate = true; brillo.instanceMatrix.needsUpdate = true;
      },
    };
  },

  // XELERA CLOUD · mar de nubes con servidores flotando
  nubes(ctx, L) {
    const g = new THREE.Group();
    const n = Math.round(1800 * ctx.densidad);
    g.add(puntos(ctx, n, (i, pos, dat) => {
      const arriba = Math.random() < 0.45;
      pos.set([azar(-9, 9), arriba ? azar(2, 3.6) : azar(-3.4, -1.6), -Math.random() * L], i * 3);
      dat.set([0, Math.random(), Math.random()], i * 3);
    }, SUBIDA_V.replace('p.y = mod(p.y + uTiempo * (0.25 + aDatos.x * 0.6), uAlto) - uAlto * 0.5;', 'p.x += sin(uTiempo * 0.15 + p.z) * 0.4;').replace('float bordes = 1.0 - smoothstep(uAlto * 0.3, uAlto * 0.5, abs(p.y));', 'float bordes = 0.22;'), { uAlto: { value: 1 }, uTam: { value: 0.75 } }));
    const servidores = [];
    for (let i = 0, ns = Math.round(14 * ctx.escalaL); i < ns; i++) {
      const s = new THREE.Group();
      const caja = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.22, 0.5), ctx.m.titanio);
      const led = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.01), new THREE.MeshBasicMaterial({ color: col(0xa9efff, 3) }));
      led.position.set(0, 0, 0.256);
      s.add(caja, led);
      const a = Math.random() * TAU, r = azar(2.4, 5.5);
      despejar(s.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.5, -azar(1, L - 1)), ctx, 0.8);
      s.userData = { y: s.position.y, f: Math.random() * 6 };
      g.add(s); servidores.push(s);
    }
    return {
      grupo: g, portal: rectRedondo(8.2, 5.6, 1.6),
      actualizar(dt, t) { servidores.forEach(s => { s.position.y = s.userData.y + Math.sin(t * 0.8 + s.userData.f) * 0.25; s.rotation.y = Math.sin(t * 0.3 + s.userData.f) * 0.4; }); },
    };
  },

  // HAXION · hélices de energía con pulsos que corren hacia el fondo
  iones(ctx, L) {
    const g = new THREE.Group();
    for (let k = 0; k < 14; k++) {
      const r = azar(2.2, 4.8), paso = azar(5, 9), a0 = (k / 14) * TAU, sentido = k % 2 ? 1 : -1;
      const pts = [];
      for (let i = 0; i <= 220; i++) { const z = -(i / 220) * L; const a = a0 + sentido * (z / paso) * TAU; pts.push(new THREE.Vector3(Math.cos(a) * r, Math.sin(a) * r * 0.8, z)); }
      g.add(trazo(ctx, new THREE.CatmullRomCurve3(pts), 0.014, k * 0.13));
    }
    g.add(puntos(ctx, Math.round(2500 * ctx.densidad), (i, pos, dat) => {
      pos[i * 3 + 2] = -Math.random() * L;
      dat.set([azar(1.5, 6), Math.random() * TAU, Math.random()], i * 3);
    }, VORTICE_V, { uGiro: { value: 1.6 } }));
    return { grupo: g, portal: poligono(6, 4, 0) };
  },

  // NEXEL DATA · ciudad de datos: barras que suben y bajan en el piso y el techo
  datos(ctx, L) {
    const g = new THREE.Group();
    const filas = [];
    for (let z = -0.5; z > -L; z -= 0.6) for (let x = -6; x <= 6; x += 0.6) { if (Math.abs(x) < 0.9) continue; filas.push([x, z, 1], [x, z, -1]); }
    const n = Math.round(filas.length * Math.min(1, ctx.densidad + 0.2));
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const m = new THREE.InstancedMesh(geo, new THREE.ShaderMaterial({
      uniforms: { uTiempo: ctx.uTiempo, uAct: ctx.uAct, uPulso: ctx.uPulso, uC1: { value: col(ctx.c1, 0.7) }, uC2: { value: col(ctx.c2, 1.15) } },
      vertexShader: BARRAS_V, fragmentShader: BARRAS_F,
    }), n);
    const base = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) base.set(filas[i], i * 3);
    m.geometry.setAttribute('aBase', new THREE.InstancedBufferAttribute(base, 3));
    m.frustumCulled = false;
    g.add(m);
    return { grupo: g, portal: poligono(4, 4.8, Math.PI / 4) };
  },

  // HAXELERA LABS · moléculas que flotan y giran sobre una red hexagonal
  laboratorio(ctx, L) {
    const g = new THREE.Group();
    const moleculas = [];
    const enlace = new THREE.MeshBasicMaterial({ color: col(0xffffff, 0.6) });
    for (let k = 0, nm = Math.round(11 * ctx.escalaL); k < nm; k++) {
      const mol = new THREE.Group();
      const atomos = [];
      const n = 3 + Math.floor(Math.random() * 5);
      for (let i = 0; i < n; i++) {
        const p = i === 0 ? new THREE.Vector3() : atomos[Math.floor(Math.random() * atomos.length)].clone().add(new THREE.Vector3().randomDirection().multiplyScalar(0.55));
        atomos.push(p);
        const e = new THREE.Mesh(new THREE.SphereGeometry(azar(0.1, 0.2), 16, 12), new THREE.MeshBasicMaterial({ color: col(i % 2 ? ctx.c1 : ctx.c2, 1.15) }));
        e.position.copy(p); mol.add(e);
        if (i > 0) {
          const a = atomos[Math.max(0, i - 1)];
          const largo = a.distanceTo(p);
          const b = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, largo, 6), enlace);
          b.position.copy(a).add(p).multiplyScalar(0.5);
          b.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p.clone().sub(a).normalize());
          mol.add(b);
        }
      }
      const ang = Math.random() * TAU, r = azar(2.4, 5);
      despejar(mol.position.set(Math.cos(ang) * r, Math.sin(ang) * r * 0.7, -azar(1, L - 1)), ctx, 0.9);
      mol.userData = { w: azar(0.2, 0.6), f: Math.random() * 6 };
      g.add(mol); moleculas.push(mol);
    }
    const hex = [];
    for (const lado of [-1, 1]) for (let z = 0; z > -L; z -= 1.2) for (let y = -3; y < 3.2; y += 1.04) {
      const off = (Math.round(y / 1.04) % 2) * 0.6;
      const h = poligono(6, 0.6, 0);
      for (let i = 0; i < 6; i++) { const a = h[i], b = h[(i + 1) % 6]; hex.push(new THREE.Vector3(lado * 6, y + a.y, z - off + a.x), new THREE.Vector3(lado * 6, y + b.y, z - off + b.x)); }
    }
    const red = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(hex), new THREE.LineBasicMaterial({ color: col(ctx.c1), transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }));
    g.add(red);
    return {
      grupo: g, portal: poligono(8, 4.1, Math.PI / 8),
      actualizar(dt, t, act) {
        moleculas.forEach(m => { m.rotation.set(t * m.userData.w, t * m.userData.w * 0.7, 0); m.scale.setScalar(0.6 + 0.4 * act); });
        red.material.opacity = 0.16 * act;
      },
    };
  },

  // XELORIS · prismas que descomponen haces de luz en todos los colores
  prisma(ctx, L) {
    const g = new THREE.Group();
    const prismas = [];
    for (let i = 0, np = Math.round(7 * ctx.escalaL); i < np; i++) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 1.35, 3), ctx.m.cromo);
      const a = Math.random() * TAU, r = azar(2.8, 5.2);
      despejar(p.position.set(Math.cos(a) * r, Math.sin(a) * r * 0.7, -azar(1, L - 1)), ctx, 1.4);
      p.userData = { w: azar(0.2, 0.5) };
      g.add(p); prismas.push(p);
    }
    const espectro = [0xff6b8a, 0xffb36b, 0xfff06b, 0x6bffb0, 0x6bd5ff, 0x9a7bff];
    const haces = [];
    for (let i = 0, nh = Math.round(18 * ctx.escalaL); i < nh; i++) {
      const h = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 7), new THREE.MeshBasicMaterial({ color: col(espectro[i % 6], 1.9), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      // Los haces van por las franjas de arriba y abajo, casi paralelos al camino, para no tapar el nombre.
      despejar(h.position.set(azar(-5, 5), (Math.random() < 0.5 ? -1 : 1) * azar(1.8, 3.6), -azar(2, L - 2)), ctx, 2.2);
      h.rotation.set(azar(-0.12, 0.12), azar(-0.22, 0.22), 0);
      h.userData = { f: Math.random() * 6, ry: h.rotation.y };
      g.add(h); haces.push(h);
    }
    return {
      grupo: g, portal: poligono(4, 4.6, Math.PI / 2, 0.72),
      actualizar(dt, t, act) {
        prismas.forEach(p => { p.rotation.set(t * p.userData.w, t * p.userData.w * 1.3, 0.3); });
        haces.forEach(h => { h.rotation.y = h.userData.ry + Math.sin(t * 0.3 + h.userData.f) * 0.08; h.material.opacity = act * (0.6 + 0.4 * Math.sin(t * 2 + h.userData.f)); });
      },
    };
  },

  // HAXELERA CAPITAL · columnas de oro que crecen y partículas doradas que suben
  oro(ctx, L) {
    const g = new THREE.Group();
    const oro = new THREE.MeshPhysicalMaterial({ color: 0xf4c430, metalness: 1, roughness: 0.22, clearcoat: 0.6 });
    const cols = [];
    for (const lado of [-1, 1]) for (let z = -1; z > -L + 1; z -= 1.3) {
      const h = azar(0.6, 1) * (1 + (-z / L) * 2.2);
      const c = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1, 0.5), oro);
      c.position.set(lado * Math.max(azar(3.2, 4.4), 0.3 * ((ctx.zParada ?? -13) - z) + 1.6), -2.8, z);
      c.userData = { h };
      g.add(c); cols.push(c);
    }
    const linea = [];
    for (let i = 0; i <= 40; i++) { const z = -(i / 40) * L; linea.push(new THREE.Vector3(Math.sin(i * 0.9) * 0.6 - 2.2, -1.8 + (i / 40) * 3.4 + Math.sin(i * 1.7) * 0.25, z)); }
    g.add(trazo(ctx, new THREE.CatmullRomCurve3(linea), 0.025, 0));
    g.add(puntos(ctx, Math.round(2200 * ctx.densidad), (i, pos, dat) => {
      pos.set([azar(-7, 7), azar(-3, 3), -Math.random() * L], i * 3);
      dat.set([Math.random(), Math.random(), Math.random()], i * 3);
    }, SUBIDA_V, { uAlto: { value: 7 }, uTam: { value: 0.035 } }));
    return {
      grupo: g, portal: [V2(-4.6, -2.6), V2(4.6, -2.6), V2(4.6, 2.9), V2(-4.6, 2.9)],
      actualizar(dt, t, act) { cols.forEach(c => { const h = c.userData.h * (0.05 + 0.95 * act); c.scale.y = h; c.position.y = -2.8 + h / 2; }); },
    };
  },

  // NEXORA GLOBAL · planeta de puntos con arcos de luz entre ciudades: su horizonte asoma bajo el portal
  globo(ctx, L) {
    const g = new THREE.Group();
    const R = 6.2, n = Math.round(5200 * ctx.densidad);
    const centro = new THREE.Group();
    centro.position.set(0, -(R + 3.4), -(ctx.paso || L * 0.5) - 8);
    g.add(centro);
    const pos = new Float32Array(n * 3), dat = new Float32Array(n * 3);
    const dirs = [];
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), a = i * 2.39996;
      const v = new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r);
      dirs.push(v);
      pos.set([v.x * R, v.y * R, v.z * R], i * 3);
      dat.set([Math.random(), Math.random(), Math.random()], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aDatos', new THREE.BufferAttribute(dat, 3));
    const nube = new THREE.Points(geo, new THREE.ShaderMaterial({
      uniforms: { uTiempo: ctx.uTiempo, uEscala: ctx.uEscala, uAct: ctx.uAct, uOpacidad: { value: 1 }, uC1: { value: col(ctx.c1) }, uC2: { value: col(ctx.c2) } },
      vertexShader: /* glsl */ `
        uniform float uEscala, uAct; uniform vec3 uC1, uC2;
        attribute vec3 aDatos; varying float vA; varying vec3 vC;
        void main(){
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          float d = max(-mv.z, 0.01);
          gl_PointSize = clamp((0.03 + aDatos.z * 0.035) * uEscala / d, 1.0, 12.0);
          gl_Position = projectionMatrix * mv;
          vA = uAct * (0.35 + 0.65 * aDatos.x) * smoothstep(0.3, 1.6, d);
          vC = mix(uC1, uC2, aDatos.y);
        }`,
      fragmentShader: S.PUNTO_F, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    nube.frustumCulled = false;
    centro.add(nube);
    for (let k = 0; k < 20; k++) {
      const a = dirs[Math.floor(Math.random() * n)], b = dirs[Math.floor(Math.random() * n)];
      const medio = a.clone().add(b).normalize().multiplyScalar(R * (1.25 + a.distanceTo(b) * 0.2));
      centro.add(trazo(ctx, new THREE.QuadraticBezierCurve3(a.clone().multiplyScalar(R), medio, b.clone().multiplyScalar(R)), 0.016, k * 0.21));
    }
    return {
      grupo: g, portal: poligono(3, 4.6, Math.PI / 2),
      actualizar(dt, t) { centro.rotation.y = t * 0.05; centro.rotation.x = 0.35; },
    };
  },
};

// ---------------------------------------------------------------- médula: la columna de cada empresa
let geoVertebra = null;
function vertebra() {
  if (geoVertebra) return geoVertebra;
  const V = (x, y) => new THREE.Vector2(x, y);
  const cuerpo = new THREE.LatheGeometry([V(0.001, -0.17), V(0.34, -0.16), V(0.46, -0.06), V(0.46, 0.06), V(0.34, 0.16), V(0.001, 0.17)], 28);
  const proceso = (lado) => {
    const g = new THREE.CapsuleGeometry(0.075, 0.42, 4, 10);
    g.rotateZ(Math.PI / 2); g.rotateY(lado * 0.35); g.translate(lado * 0.62, 0.02, -0.12);
    return g;
  };
  const espina = new THREE.ConeGeometry(0.11, 0.6, 12);
  espina.rotateX(-Math.PI / 2 - 0.4); espina.translate(0, -0.08, -0.55);
  const puntas = [-1, 1].map(lado => { const g = new THREE.SphereGeometry(0.1, 12, 8); g.translate(lado * 0.86, 0.02, -0.2); return g; });
  geoVertebra = mergeGeometries([cuerpo, proceso(-1), proceso(1), espina, ...puntas]);
  return geoVertebra;
}

function crearMedula(ctx, e) {
  const g = new THREE.Group();
  const N = 18, NC = 46;
  const hueso = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 1, roughness: 0.15, iridescence: 1, iridescenceIOR: 1.75, iridescenceThicknessRange: [200, 820],
    clearcoat: 0.8, clearcoatRoughness: 0.08, emissive: col(e.colores[0], 0.07),
  });
  const vertebras = new THREE.InstancedMesh(vertebra(), hueso, N);
  vertebras.frustumCulled = false;
  const cordon = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, N * 0.58 + 2, 8, 1, true), new THREE.MeshBasicMaterial({ color: col(e.colores[0], 2.4) }));
  const eslabon = new THREE.TorusGeometry(0.11, 0.028, 8, 20);
  eslabon.rotateY(Math.PI / 2);
  const cadena = new THREE.InstancedMesh(eslabon, new THREE.MeshPhysicalMaterial({ color: col(e.colores[1]), metalness: 1, roughness: 0.2, iridescence: 0.6 }), NC);
  cadena.frustumCulled = false;
  g.add(vertebras, cordon, cadena);
  const tarjetas = e.trabajos.map((tr, i) => {
    const lienzo = new TarjetaTrabajo(tr, e, i);
    const u = {
      uMapa: { value: lienzo.tex }, uTiempo: ctx.uTiempo, uCurva: { value: 0 }, uRGB: { value: 0 },
      uActivo: { value: 0 }, uHover: { value: 0 }, uAspecto: { value: 2.3 / 1.44 }, uOpacidad: { value: 0 },
    };
    const m = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.44, 24, 1), new THREE.ShaderMaterial({
      uniforms: u, vertexShader: S.CARTA_V, fragmentShader: S.CARTA_F, transparent: true, depthWrite: false, side: THREE.DoubleSide,
    }));
    g.add(m);
    return { m, u, lienzo };
  });
  return { grupo: g, vertebras, cadena, tarjetas, N, NC, reloj: 0 };
}

const o3 = new THREE.Object3D();
const pa = new THREE.Vector3(), pb = new THREE.Vector3();
// giro: ángulo de las tarjetas alrededor de la columna (la tarjeta j queda de frente cuando giro = −j·τ/3).
function moverMedula(md, dt, t, f, giro, vel, movil) {
  md.grupo.visible = f > 0.002;
  if (!md.grupo.visible) return -1;
  for (let i = 0; i < md.N; i++) {
    const y = (i - (md.N - 1) / 2) * 0.58;
    o3.position.set(Math.sin(i * 0.5 + t * 0.7) * 0.08, y, Math.cos(i * 0.4 + t * 0.5) * 0.05);
    o3.rotation.set(Math.sin(t * 0.4 + i) * 0.05, i * 0.12 + t * 0.15 + giro * 0.5, Math.sin(i * 0.3 + t * 0.6) * 0.06);
    o3.scale.setScalar((1 - Math.abs(y) * 0.025) * (0.4 + 0.6 * f));
    o3.updateMatrix();
    md.vertebras.setMatrixAt(i, o3.matrix);
  }
  md.vertebras.instanceMatrix.needsUpdate = true;
  const helice = (j, out) => { const a = j * 0.168 + t * 0.25 + giro * 0.8; return out.set(Math.cos(a) * 0.95, (j - md.NC / 2) * 0.12, Math.sin(a) * 0.95); };
  for (let j = 0; j < md.NC; j++) {
    helice(j, pa); helice(j + 1, pb);
    o3.position.copy(pa); o3.scale.setScalar(1); o3.lookAt(pb);
    if (j % 2) o3.rotateZ(Math.PI / 2);
    o3.updateMatrix();
    md.cadena.setMatrixAt(j, o3.matrix);
  }
  md.cadena.instanceMatrix.needsUpdate = true;
  // Las tarjetas giran alrededor de la columna con el scroll del perfil; la del frente se ilumina.
  const R = movil ? 1.7 : 1.95;
  let mejor = -1, frente = -2;
  md.tarjetas.forEach((c, i) => {
    const th = giro + (i * TAU) / md.tarjetas.length;
    c.m.position.set(Math.sin(th) * R, ALTURAS[i], Math.cos(th) * R);
    c.m.rotation.set(0, th, 0);
    c.m.scale.setScalar(movil ? 0.78 : 0.92);
    const cos = Math.cos(th);
    if (cos > frente) { frente = cos; mejor = i; }
    c.u.uActivo.value = suave((cos - 0.25) / 0.75);
    c.u.uOpacidad.value = f * (0.2 + 0.8 * suave((cos + 0.35) / 1.3));
    c.u.uCurva.value = Math.max(-0.6, Math.min(0.6, vel * 0.02));
    c.u.uRGB.value = Math.max(-0.006, Math.min(0.006, vel * 0.0002));
  });
  md.reloj += dt;
  if (md.reloj > 0.09) { md.reloj = 0; md.tarjetas.forEach(c => c.lienzo.dibujar(t)); }
  return mejor;
}
// Altura de cada tarjeta sobre la columna: al recorrerlas, la cámara sube por la columna.
const ALTURAS = [-1.2, 0.3, 1.75];
function alturaEn(c) {
  const x = Math.min(ALTURAS.length - 1, Math.max(0, c)), i = Math.min(ALTURAS.length - 2, Math.floor(x));
  const u = x - i;
  return ALTURAS[i] + (ALTURAS[i + 1] - ALTURAS[i]) * (u * u * (3 - 2 * u));
}

// ---------------------------------------------------------------- portal triangular de cada empresa
export const RT = 3.9;   // radio del triángulo (del centro a cada vértice)
const triangulo = (r) => poligono(3, r, Math.PI / 2);

// Chispas que corren por el borde del triángulo.
const CHISPAS_V = /* glsl */ `
uniform float uTiempo, uEscala, uAct, uRapidez, uR;
uniform vec3 uC1, uC2;
attribute vec3 aDatos;
varying float vA;
varying vec3 vC;
vec2 borde(float s){
  vec2 A = vec2(0.0, uR), B = vec2(-0.8660254 * uR, -0.5 * uR), C = vec2(0.8660254 * uR, -0.5 * uR);
  float t = fract(s) * 3.0;
  if (t < 1.0) return mix(A, B, t);
  if (t < 2.0) return mix(B, C, t - 1.0);
  return mix(C, A, t - 2.0);
}
void main(){
  float s = aDatos.x + uTiempo * (0.012 + aDatos.y * 0.035) * (1.0 + uRapidez * 2.5) * (aDatos.y > 0.5 ? 1.0 : -1.0);
  vec2 p = borde(s);
  p += normalize(p) * position.x;
  vec4 mv = modelViewMatrix * vec4(p, position.y, 1.0);
  float d = max(-mv.z, 0.01);
  gl_PointSize = clamp((0.022 + aDatos.z * 0.05) * uEscala / d, 1.0, 18.0);
  gl_Position = projectionMatrix * mv;
  vA = uAct * (0.2 + 0.8 * aDatos.z * aDatos.z);
  vC = mix(uC1, uC2, aDatos.z);
}
`;

function crearPortal(ctx, e, k) {
  const g = new THREE.Group();
  const c1 = new THREE.Color(e.colores[0]), c2 = new THREE.Color(e.colores[1]);
  const marco = crearPuerta(ctx, triangulo(RT), k * 0.11, 0.05, c1);
  // Dos triángulos interiores se mecen en 3D como un giroscopio; nunca giran de canto para no tapar el nombre.
  const interior = crearPuerta(ctx, triangulo(RT * 0.84), k * 0.11 + 0.5, 0.012, c2);
  const exterior = crearPuerta(ctx, triangulo(RT * 1.12), k * 0.11 + 0.25, 0.009, c1);
  // Ondas: copias del marco que salen hacia afuera, como un latido.
  const ondas = [0, 1, 2].map(i => crearPuerta(ctx, triangulo(RT), i * 0.33, 0.016, i % 2 ? c2 : c1));
  const uMem = { value: 0 };
  const membrana = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(triangulo(RT * 0.99))), new THREE.ShaderMaterial({
    uniforms: { uTiempo: ctx.uTiempo, uAct: uMem, uC1: { value: c1 }, uC2: { value: c2 } },
    vertexShader: S.UV_V, fragmentShader: MEMBRANA_F, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
  }));
  membrana.position.z = -0.05;
  const n = Math.round(900 * Math.min(1, ctx.densidad + 0.3));
  const pos = new Float32Array(n * 3), dat = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const lejos = Math.random() < 0.25;
    pos.set([(Math.random() - 0.3) * (lejos ? 0.9 : 0.12), (Math.random() - 0.5) * (lejos ? 0.8 : 0.1), 0], i * 3);
    dat.set([Math.random(), Math.random(), Math.random()], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aDatos', new THREE.BufferAttribute(dat, 3));
  const uChispas = { uTiempo: ctx.uTiempo, uEscala: ctx.uEscala, uAct: { value: 0 }, uRapidez: { value: 0 }, uR: { value: RT }, uOpacidad: { value: 1 }, uC1: { value: col(e.colores[0], 1.6) }, uC2: { value: col(e.colores[1], 1.6) } };
  const chispas = new THREE.Points(geo, new THREE.ShaderMaterial({ uniforms: uChispas, vertexShader: CHISPAS_V, fragmentShader: S.PUNTO_F, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  chispas.frustumCulled = false;
  g.add(membrana, marco, interior, exterior, ...ondas, chispas);
  return { grupo: g, marco, interior, exterior, ondas, uMem, uChispas };
}

export class Ecosistema {
  // zA: parada frente al primer portal; paso: distancia entre una parada y la siguiente.
  constructor(ctx, empresas, zA, paso) {
    this.grupo = new THREE.Group();
    this.zA = zA;
    this.paso = paso;
    this.N = empresas.length;
    // Cada mundo empieza en el portal anterior y sigue detrás del suyo: ahí adentro vive el perfil.
    const L = paso + 26;
    this.dimensiones = empresas.map((e, k) => {
      const uAct = { value: 0 }, uPulso = { value: 0 };
      // zParada: dónde queda la parada frente al portal, medido desde el inicio del mundo.
      const c = { ...ctx, uAct, uPulso, c1: e.colores[0], c2: e.colores[1], paso, zParada: -(paso - 12.5), densidad: ctx.densidad * L / 24, escalaL: L / 24 };
      const mundo = MUNDOS[e.mundo](c, L);
      const puerta = crearPortal(ctx, e, k);
      const medula = crearMedula(ctx, e);
      this.grupo.add(puerta.grupo, mundo.grupo, medula.grupo);
      return { grupo: mundo.grupo, actualizar: mundo.actualizar, puerta, medula, uAct, uPulso, color: new THREE.Color(e.colores[0]), zR: zA - k * paso, zP: 0, dibujo: 0, encima: 0, entrar: 0, giro: 0, alto: 0 };
    });
    this.perfilK = -1;
    this.hoverK = -1;
    this.hover = -1;
    this.encima = -1;
    this.trabajoActivo = -1;
    this.colocar(false, 11.5);
  }

  // R: distancia de la parada al portal, para que el triángulo llene la pantalla con aire.
  colocar(movil, R) {
    this.movil = movil;
    this.R = R;
    for (const d of this.dimensiones) {
      d.zP = d.zR - R;
      d.puerta.grupo.position.z = d.zP;
      d.grupo.position.z = d.zP + this.paso;
    }
    this.zB = this.dimensiones[this.N - 1].zP;
  }

  // Donde queda la cámara dentro del perfil de una empresa (al otro lado de su portal).
  zPerfil(k) { return this.dimensiones[k].zP - 7; }

  // Un voto real en la encuesta viva hace crecer la ciudad de datos de esa dimensión.
  pulso(k) { const d = this.dimensiones[k]; if (d) d.uPulso.value = 1; }

  // Dimensión actual: la del primer portal que aún no se cruza (−1 fuera del ecosistema).
  indice(z) {
    if (this.perfilK >= 0) return this.perfilK;
    if (z > this.zA + 16) return -1;
    for (let k = 0; k < this.N; k++) if (z > this.dimensiones[k].zP) return k;
    return -1;
  }

  // Tarjeta de la columna bajo el puntero (solo las que se ven bien de frente).
  tarjetaBajo(rayo, k) {
    const d = this.dimensiones[k];
    if (!d || !d.medula.grupo.visible) return -1;
    const visibles = d.medula.tarjetas.filter(c => c.u.uOpacidad.value > 0.35).map(c => c.m);
    const hit = rayo.intersectObjects(visibles, false)[0];
    return hit ? d.medula.tarjetas.findIndex(c => c.m === hit.object) : -1;
  }

  // Dónde cae el centro del triángulo en pantalla y a qué escala, para pegarle encima el nombre.
  proyectar(k, cam, W, H, fovBase) {
    const d = this.dimensiones[k];
    if (!d) return null;
    pa.set(0, 0, d.zP).project(cam);
    pb.set(0, RT, d.zP).project(cam);
    const x = (pa.x * 0.5 + 0.5) * W, y = (-pa.y * 0.5 + 0.5) * H;
    const r = Math.abs((pa.y - pb.y) * 0.5 * H);
    const r0 = (RT / (2 * this.R * Math.tan(THREE.MathUtils.degToRad(fovBase / 2)))) * H;
    const dist = cam.position.z - d.zP;
    const a = dist <= 0.4 || pa.z > 1 ? 0 : suave((this.R + 13 - dist) / 7) * suave((dist - 1.2) / (this.R * 0.45));
    return { x, y, s: r / r0, r0, a: a * d.dibujo };
  }

  // perfil: empresa abierta (−1 en el recorrido). espina: { k, c, vis } para la columna del perfil.
  actualizar(dt, t, z, vel = 0, perfil = -1, espina = null) {
    this.perfilK = perfil;
    const actual = this.indice(z);
    this.trabajoActivo = -1;
    const k1 = 1 - Math.exp(-dt * 6);
    this.dimensiones.forEach((d, k) => {
      d.uPulso.value *= Math.exp(-dt * 1.2);
      // Fondo: en el recorrido se ve desde que se cruza el portal anterior hasta cruzar el suyo;
      // dentro de un perfil solo se ve el de esa empresa.
      let vis, act;
      if (perfil >= 0) { vis = k === perfil; act = 1; }
      else {
        const zIni = k === 0 ? this.zA + 16 : this.dimensiones[k - 1].zP;
        vis = z <= zIni && z > d.zP;
        act = k === 0 ? suave((zIni - z) / 10) : suave((zIni - z) / 4);
      }
      d.grupo.visible = vis;
      if (vis) { d.uAct.value += (act - d.uAct.value) * k1; d.actualizar?.(dt, t, d.uAct.value); }
      else d.uAct.value = 0;

      // Portal: solo el de la dimensión actual, que se dibuja solo al aparecer.
      const p = d.puerta;
      const conPortal = perfil < 0 && k === actual && z > d.zP - 0.5;
      p.grupo.visible = conPortal || (perfil < 0 && d.dibujo > 0.01 && z > d.zP - 0.5 && z < d.zP + this.paso + 2);
      d.dibujo = conPortal ? Math.min(1, d.dibujo + dt / 1.5) : Math.max(0, d.dibujo - dt * 3);
      d.encima += ((this.encima === k ? 1 : 0) - d.encima) * (1 - Math.exp(-dt * 8));
      d.entrar = Math.max(0, d.entrar - dt * 1.2);
      if (p.grupo.visible) {
        const dib = d.dibujo * d.dibujo * (3 - 2 * d.dibujo);
        const cerca = suave((d.zP + this.R + 10 - z) / 10);
        p.marco.material.uniforms.uDibujo.value = dib;
        p.marco.material.uniforms.uBrillo.value = (0.55 + cerca * 0.9 + d.encima * 1.1 + d.entrar * 2) * (1 + 0.08 * Math.sin(t * 1.6));
        for (const m of [p.interior, p.exterior]) {
          m.material.uniforms.uDibujo.value = suave((d.dibujo - 0.25) / 0.75);
          m.material.uniforms.uBrillo.value = 0.35 + d.encima * 0.6;
        }
        p.interior.rotation.set(Math.cos(t * 0.31 + k) * 0.16, Math.sin(t * 0.43 + k) * 0.5, 0);
        p.exterior.rotation.set(Math.sin(t * 0.37 + k * 2) * 0.42, Math.cos(t * 0.29) * 0.12, 0);
        p.interior.scale.setScalar(1 + Math.sin(t * 1.3) * 0.012 - d.encima * 0.04);
        p.ondas.forEach((o, i) => {
          const f = (t * (0.28 + d.encima * 0.25) + i / 3) % 1;
          o.scale.setScalar(1 + f * (0.5 + d.encima * 0.3));
          o.material.uniforms.uBrillo.value = (1 - f) * (1 - f) * 0.7 * dib;
          o.position.z = -f * 1.5;
        });
        p.uMem.value = (0.16 + d.encima * 0.42 + d.entrar * 0.9) * dib;
        p.uChispas.uAct.value = dib * (0.75 + d.encima * 0.8 + d.entrar);
        p.uChispas.uRapidez.value = d.encima + d.entrar * 2;
      }

      // Columna vertebral: solo dentro del perfil de la empresa.
      const md = d.medula;
      const f = espina && espina.k === k ? espina.vis : 0;
      if (f > 0.002) {
        d.giro += (-espina.c * TAU / 3 - d.giro) * (1 - Math.exp(-dt * 5));
        d.alto += (alturaEn(espina.c) - d.alto) * (1 - Math.exp(-dt * 5));
        md.grupo.position.set(this.movil ? 0 : 2.6, (this.movil ? 0.6 : 0) - d.alto - (1 - f) * 6, z - (this.movil ? 10.5 : 9.6));
      }
      const activo = moverMedula(md, dt, t, f, d.giro, vel, this.movil);
      md.tarjetas.forEach((c, j) => { c.u.uHover.value += ((this.hoverK === k && this.hover === j ? 1 : 0) - c.u.uHover.value) * (1 - Math.exp(-dt * 10)); });
      if (f > 0.5) this.trabajoActivo = activo;
    });
  }

  // Golpe de luz en el portal al entrar a una empresa.
  entrar(k) { const d = this.dimensiones[k]; if (d) d.entrar = 1; }
}
