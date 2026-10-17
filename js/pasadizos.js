// Pasadizos: portales que se cruzan entre una estación y la siguiente. Cada uno tiene otra forma y otro mundo:
// circuito (tubos de luz sobre paneles, como un corredor de datos), hexágono, pantallas, láser de seguridad,
// servidores y flujo de datos. Están apagados de lejos y se encienden cuando la cámara se acerca.
import * as THREE from 'three';
import * as S from './shaders.js';
import { crearPuerta, poligono } from './objetos.js';
import { crearPuesto } from './personas.js';

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const suave = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
const azar = (a, b) => a + Math.random() * (b - a);

// ---------------------------------------------------------------- texturas
let texCircuito = null;
function circuito() {
  if (texCircuito) return texCircuito;
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 512;
  const x = c.getContext('2d');
  x.fillStyle = '#000'; x.fillRect(0, 0, 1024, 512);
  x.lineCap = 'round';
  for (let i = 0; i < 110; i++) {
    let px = Math.random() * 1024, py = Math.random() * 512;
    x.beginPath(); x.moveTo(px, py);
    for (let k = 0; k < 4; k++) {
      const dir = Math.floor(Math.random() * 4);
      const l = azar(30, 160);
      if (dir === 0) px += l; else if (dir === 1) py += l; else if (dir === 2) { px += l * 0.7; py += l * 0.7; } else { px += l; py -= l * 0.7; }
      x.lineTo(px, py);
    }
    x.strokeStyle = `rgba(140,180,255,${azar(0.12, 0.4)})`; x.lineWidth = azar(1, 2.5); x.stroke();
    x.fillStyle = 'rgba(200,225,255,.55)'; x.fillRect(px - 3, py - 3, 6, 6);
  }
  for (let i = 0; i < 26; i++) {
    const w = azar(40, 120), h = azar(24, 70), px = Math.random() * 1024, py = Math.random() * 512;
    x.strokeStyle = 'rgba(160,200,255,.35)'; x.lineWidth = 1.5; x.strokeRect(px, py, w, h);
    for (let k = 4; k < w - 4; k += 8) { x.fillStyle = 'rgba(160,200,255,.3)'; x.fillRect(px + k, py - 5, 3, 5); x.fillRect(px + k, py + h, 3, 5); }
  }
  for (let i = 0; i < 380; i++) { x.fillStyle = `rgba(190,215,255,${azar(0.05, 0.3)})`; x.fillRect(Math.random() * 1024, Math.random() * 512, 2, 2); }
  texCircuito = new THREE.CanvasTexture(c);
  texCircuito.wrapS = texCircuito.wrapT = THREE.RepeatWrapping;
  texCircuito.colorSpace = THREE.SRGBColorSpace;
  texCircuito.anisotropy = 8;
  return texCircuito;
}

// ---------------------------------------------------------------- piezas comunes
function panel(ctx, ancho, alto, tinte, repetir) {
  return new THREE.Mesh(new THREE.PlaneGeometry(ancho, alto), new THREE.ShaderMaterial({
    uniforms: { uMapa: { value: circuito() }, uAct: ctx.uAct, uTiempo: ctx.uTiempo, uTinte: { value: new THREE.Color(tinte) }, uRepetir: { value: new THREE.Vector2(...repetir) } },
    vertexShader: S.TUNEL_V, fragmentShader: S.PANEL_F, side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
}

// Caja de paneles: paredes, piso y techo de un corredor rectangular de largo L (de z = 0 a z = −L).
function corredor(ctx, W, H, L, tinte) {
  const g = new THREE.Group();
  const rep = [L / 8, 1];
  const izq = panel(ctx, L, H, tinte, rep); izq.rotation.y = Math.PI / 2; izq.position.set(-W / 2, 0, -L / 2);
  const der = panel(ctx, L, H, tinte, rep); der.rotation.y = -Math.PI / 2; der.position.set(W / 2, 0, -L / 2);
  const piso = panel(ctx, W, L, tinte, [1, L / 8]); piso.rotation.x = -Math.PI / 2; piso.position.set(0, -H / 2, -L / 2);
  const techo = panel(ctx, W, L, tinte, [1, L / 8]); techo.rotation.x = Math.PI / 2; techo.position.set(0, H / 2, -L / 2);
  g.add(izq, der, piso, techo);
  return g;
}

// Tubos de luz instanciados. lista: [{ p: [x,y,z], s: [sx,sy,sz], c: [r,g,b] }]
export function tubos(ctx, lista) {
  const m = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.ShaderMaterial({
    uniforms: { uTiempo: ctx.uTiempo, uAct: ctx.uAct }, vertexShader: S.LUZ_V, fragmentShader: S.LUZ_F,
  }), lista.length);
  const fase = new Float32Array(lista.length), color = new Float32Array(lista.length * 3);
  const o = new THREE.Object3D();
  lista.forEach((t, i) => {
    o.position.set(...t.p); o.scale.set(...t.s); o.rotation.set(0, 0, t.r || 0); o.updateMatrix();
    m.setMatrixAt(i, o.matrix);
    fase[i] = Math.random();
    color.set(t.c, i * 3);
  });
  m.geometry.setAttribute('aFase', new THREE.InstancedBufferAttribute(fase, 1));
  m.geometry.setAttribute('aColor', new THREE.InstancedBufferAttribute(color, 3));
  m.frustumCulled = false;
  return m;
}

const FRIO = [2.2, 2.45, 2.7];

// ---------------------------------------------------------------- estilos
const ESTILOS = {
  // Corredor de datos: tubos de luz verticales y horizontales sobre paneles de circuito (el estilo del GIF).
  circuito(ctx, L, tinte = 0x8fb4ff, colorLuz = FRIO) {
    const W = 6, H = 4.4;
    const g = new THREE.Group();
    g.add(corredor(ctx, W, H, L, tinte));
    const lista = [];
    const c = (k = 1) => colorLuz.map(v => v * k);
    for (let z = -0.8; z > -L + 0.5; z -= azar(1.4, 2.6)) {
      for (const lado of [-1, 1]) {
        const x = lado * (W / 2 - 0.05);
        if (Math.random() < 0.55) {
          const y = azar(-1.1, 0.9), n = Math.random() < 0.5 ? 3 : 2;
          for (let k = 0; k < n; k++) lista.push({ p: [x, y, z - k * 0.28], s: [0.04, azar(0.7, 1.25), 0.04], c: c() });
        }
        if (Math.random() < 0.55) lista.push({ p: [x, azar(-1.6, 1.7), z - 1], s: [0.035, 0.035, azar(1.5, 3.2)], c: c(0.9) });
        for (let k = 0; k < 3; k++) lista.push({ p: [x, azar(-1.9, 1.9), z - azar(0, 1.5)], s: [0.03, 0.08, 0.08], c: c(1.2) });
      }
      if (Math.random() < 0.6) lista.push({ p: [azar(-2.1, 2.1), H / 2 - 0.05, z], s: [0.05, 0.03, azar(2, 3.8)], c: c() });
      if (Math.random() < 0.35) lista.push({ p: [0, H / 2 - 0.05, z], s: [azar(1.5, 3.8), 0.03, 0.05], c: c(0.8) });
      if (Math.random() < 0.3) lista.push({ p: [azar(-2.2, 2.2), -H / 2 + 0.04, z], s: [0.05, 0.02, azar(1, 2.5)], c: c(0.6) });
    }
    g.add(tubos(ctx, lista));
    const marco = crearPuerta(ctx, [new THREE.Vector2(-W / 2, -H / 2), new THREE.Vector2(W / 2, -H / 2), new THREE.Vector2(W / 2, H / 2), new THREE.Vector2(-W / 2, H / 2)], 0.1, 0.03, 0xdcecff);
    g.add(marco);
    return { grupo: g, marcos: [marco] };
  },

  // Túnel de marcos hexagonales que giran en espiral con pulsos que viajan hacia el fondo.
  hexagono(ctx, L) {
    const g = new THREE.Group();
    const marcos = [];
    const n = Math.floor(L / 1.25);
    for (let i = 0; i < n; i++) {
      const m = crearPuerta(ctx, poligono(6, 3.0, i * 0.09), i * 0.07, 0.024);
      m.position.z = -i * 1.25;
      g.add(m); marcos.push(m);
    }
    const pts = [];
    poligono(6, 3.0).forEach(v => { pts.push(new THREE.Vector3(v.x, v.y, 0), new THREE.Vector3(v.x, v.y, -L)); });
    g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: 0xb9a8ff, transparent: true, opacity: 0.25, blending: THREE.AdditiveBlending, depthWrite: false })));
    return {
      grupo: g, marcos,
      actualizar(dt, t, act) {
        marcos.forEach((m, i) => {
          const u = (((i * 0.11 - t * 0.6) % 1) + 1) % 1 - 0.5;
          const pulso = Math.exp(-(u * u) * 30);
          m.material.uniforms.uBrillo.value = act * (0.35 + pulso * 1.6);
          m.rotation.z = i * 0.09 + t * 0.05 * (i % 2 ? 1 : -1);
        });
      },
    };
  },

  // Galería de pantallas flotantes con código y tableros, con saltos de interferencia.
  pantallas(ctx, L) {
    const g = new THREE.Group();
    const texs = [...ctx.pantallas.codigo, ...ctx.pantallas.ciber].map(p => p.tex);
    const lista = [];
    for (let z = -1; z > -L + 1; z -= 2.1) {
      for (const lado of [-1, 1]) {
        for (let fila = 0; fila < 2; fila++) {
          const m = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.84), new THREE.MeshBasicMaterial({ map: texs[(lista.length * 7) % texs.length], transparent: true, depthWrite: false, opacity: 0 }));
          m.position.set(lado * azar(2.4, 2.75), fila ? 0.9 : -0.15, z - azar(0, 0.5));
          m.rotation.y = -lado * azar(0.7, 0.95);
          m.userData = { x: m.position.x, fase: Math.random() * 10 };
          g.add(m); lista.push(m);
        }
      }
    }
    const luces = [];
    for (let z = -0.5; z > -L; z -= 2.4) luces.push({ p: [0, 2.1, z], s: [4.2, 0.03, 0.06], c: [1.6, 1.9, 2.4] });
    g.add(tubos(ctx, luces));
    const marco = crearPuerta(ctx, [new THREE.Vector2(-3.1, -1.8), new THREE.Vector2(3.1, -1.8), new THREE.Vector2(3.1, 2.3), new THREE.Vector2(-3.1, 2.3)], 0.3, 0.025);
    g.add(marco);
    return {
      grupo: g, marcos: [marco],
      actualizar(dt, t, act) {
        if (act > 0.02) ctx.pantallas.activas = true;
        for (const m of lista) {
          const salto = Math.sin(t * 9 + m.userData.fase) > 0.985 ? 0.08 : 0;
          m.position.x = m.userData.x + salto;
          m.material.opacity = act * (0.75 + 0.25 * Math.sin(t * 3 + m.userData.fase)) * (salto ? 0.5 : 1);
        }
      },
    };
  },

  // Pasadizo de seguridad: marcos triangulares rojos, láseres que barren y analistas vigilando.
  laser(ctx, L) {
    const g = new THREE.Group();
    const marcos = [];
    const tri = [new THREE.Vector2(0, 2.9), new THREE.Vector2(-3.3, -1.9), new THREE.Vector2(3.3, -1.9)];
    for (let i = 0; i < 6; i++) {
      const m = crearPuerta(ctx, tri, i * 0.2, 0.026, 0xff4458);
      m.position.z = -i * (L / 5.4);
      g.add(m); marcos.push(m);
    }
    const haces = [];
    for (let i = 0; i < 7; i++) {
      const h = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.014, 0.014), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff3b4e).multiplyScalar(4), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
      h.position.z = -azar(1, L - 1);
      h.userData = { fase: Math.random() * 6, vel: azar(0.6, 1.4), amp: azar(0.8, 1.7), giro: azar(-0.4, 0.4) };
      g.add(h); haces.push(h);
    }
    const escaner = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 5.2), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff3b4e).multiplyScalar(0.5), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    g.add(escaner);
    const puestos = [-1, 1].map((lado, i) => {
      const p = crearPuesto(ctx, { tipo: 'ciber', semilla: 3 + i, densidad: ctx.densidad * 0.8 });
      p.grupo.scale.setScalar(1.5);
      p.grupo.position.set(lado * 3.4, -1.75, -L * 0.45 - i * 3);
      p.grupo.rotation.y = lado * 0.9;
      g.add(p.grupo);
      return p;
    });
    return {
      grupo: g, marcos,
      actualizar(dt, t, act) {
        marcos.forEach(m => { m.material.uniforms.uBrillo.value = act * 1.2; });
        haces.forEach(h => {
          const u = h.userData;
          h.position.y = Math.sin(t * u.vel + u.fase) * u.amp;
          h.rotation.z = u.giro + Math.sin(t * 0.5 + u.fase) * 0.15;
          h.material.opacity = act;
        });
        escaner.position.z = -((t * 4) % L);
        escaner.material.opacity = act * 0.35;
        puestos.forEach(p => p.actualizar(dt, t, act));
      },
    };
  },

  // Centro de datos: racks a ambos lados con luces que parpadean y piso de pasillo frío.
  servidores(ctx, L) {
    const g = new THREE.Group();
    const racks = [];
    for (let z = -1; z > -L + 0.5; z -= 1.05) for (const lado of [-1, 1]) racks.push([lado * 2.7, z]);
    const cuerpo = new THREE.InstancedMesh(new THREE.BoxGeometry(0.9, 3.2, 0.95), ctx.m.titanio, racks.length);
    const o = new THREE.Object3D();
    racks.forEach(([x, z], i) => { o.position.set(x, -0.5, z); o.updateMatrix(); cuerpo.setMatrixAt(i, o.matrix); });
    g.add(cuerpo);
    const leds = [];
    const colores = [[0.5, 2.6, 1.6], [1.8, 2.4, 2.8], [2.8, 2.0, 0.8], [2.4, 2.4, 2.4]];
    racks.forEach(([x, z]) => {
      for (let k = 0; k < 13; k++) leds.push({ p: [x - Math.sign(x) * 0.46, -1.9 + k * 0.22, z + azar(-0.35, 0.35)], s: [0.02, 0.025, 0.06], c: colores[Math.floor(Math.random() * colores.length)] });
    });
    g.add(tubos(ctx, leds));
    const piso = [];
    for (let z = -0.5; z > -L; z -= 0.9) piso.push({ p: [0, -2.1, z], s: [1.4, 0.02, 0.5], c: [0.4, 0.9, 1.8] });
    g.add(tubos(ctx, piso));
    const marco = crearPuerta(ctx, [new THREE.Vector2(-2.2, -2.1), new THREE.Vector2(2.2, -2.1), new THREE.Vector2(2.2, 1.2), new THREE.Vector2(0, 2.3), new THREE.Vector2(-2.2, 1.2)], 0.5, 0.025);
    g.add(marco);
    return { grupo: g, marcos: [marco] };
  },

  // Flujo de datos: el corredor de circuito en lila, con paquetes de luz corriendo por las paredes.
  datos(ctx, L) {
    const base = ESTILOS.circuito(ctx, L, 0xb39dff, [2.4, 2.1, 2.9]);
    const n = 60;
    const paquetes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.06, 0.6), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xdccbff).multiplyScalar(3) }), n);
    const est = Array.from({ length: n }, () => ({ x: (Math.random() < 0.5 ? -1 : 1) * 2.95, y: azar(-1.9, 1.9), z: -Math.random() * L, v: azar(4, 10) }));
    paquetes.frustumCulled = false;
    base.grupo.add(paquetes);
    const o = new THREE.Object3D();
    return {
      grupo: base.grupo, marcos: base.marcos,
      actualizar(dt, t, act) {
        est.forEach((p, i) => {
          p.z -= p.v * dt;
          if (p.z < -L) p.z = 0;
          o.position.set(p.x, p.y, p.z); o.scale.setScalar(act); o.updateMatrix();
          paquetes.setMatrixAt(i, o.matrix);
        });
        paquetes.instanceMatrix.needsUpdate = true;
      },
    };
  },
};

export function crearPasadizo(ctx, estilo, zIni, largo) {
  const uAct = { value: 0 };
  const c = { ...ctx, uAct };
  const e = (ESTILOS[estilo] || ESTILOS.circuito)(c, largo);
  e.grupo.position.z = zIni;
  return {
    grupo: e.grupo, zIni, zFin: zIni - largo,
    actualizar(dt, t, camZ) {
      const visible = camZ < zIni + 70 && camZ > zIni - largo - 3;
      e.grupo.visible = visible;
      if (!visible) return;
      // Se enciende al acercarse: de lejos queda casi apagado para no estorbar el texto.
      const act = 0.06 + 0.94 * suave((zIni + 9 - camZ) / 7);
      uAct.value = act;
      (e.marcos || []).forEach(m => { if (estilo !== 'hexagono' && estilo !== 'laser') m.material.uniforms.uBrillo.value = 0.3 + act * 1.1; });
      e.actualizar?.(dt, t, act);
    },
  };
}
