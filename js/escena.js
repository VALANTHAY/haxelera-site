// Mundo 3D de Haxelera: un solo lienzo WebGL detrás de la página.
// La página manda la profundidad (zObjetivo) según el scroll; aquí la cámara la sigue con inercia.
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import * as S from './shaders.js';
import { RUTA, Z_FINAL } from './ruta.js';
import { FABRICAS, materiales, crearPuerta, CurvaPoligono } from './objetos.js';
import { Carrusel } from './carrusel.js';
import { Pantallas, crearPuesto } from './personas.js';
import { crearPasadizo, tubos } from './pasadizos.js';
import { Ecosistema, RT } from './dimensiones.js';
import { EMPRESAS } from './empresas.js';

const ANCHO_LOGO = 6.4;
const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (x) => Math.min(1, Math.max(0, x));
const suave = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
const espera = (ms) => new Promise(r => setTimeout(r, ms));
const miles = (n) => n.toLocaleString('es-DO');

const CALIDAD = {
  alta:  { dpr: 2,    polvo: 12000, rayos: 900, oceano: [170, 760], logoP: 26000, densidad: 1,    bloom: true,  msaa: 4, post: true },
  media: { dpr: 1.5,  polvo: 7000,  rayos: 500, oceano: [120, 480], logoP: 16000, densidad: 0.7,  bloom: true,  msaa: 0, post: true },
  baja:  { dpr: 1.25, polvo: 3500,  rayos: 250, oceano: [80, 300],  logoP: 9000,  densidad: 0.45, bloom: false, msaa: 0, post: false },
};

export class Mundo {
  constructor(canvas, { nivel = 'alta', reducido = false, proyectos = [] } = {}) {
    this.proyectos = proyectos;
    this.canvas = canvas;
    this.nivel = nivel;
    this.q = CALIDAD[nivel] || CALIDAD.alta;
    this.reducido = reducido;
    this.t = 0;
    this.camZ = 24;
    this.zObjetivo = 14;
    this.vel = 0;
    this.swayPrev = 0;
    this.alabeo = 0;
    this.puntero = new THREE.Vector2();
    this.punteroSuave = new THREE.Vector2();
    this.mira = new THREE.Vector3();
    this.rayo = new THREE.Raycaster();
    this.uTiempo = { value: 0 };
    this.uAparicion = { value: 0 };
    this.uEscala = { value: 1000 };
    this.estaciones = [];
    this.puertas = [];
    this.zHero = 14;
    this.heroX = 0; this.heroY = 0; this.heroOffX = 0; this.heroOffY = 0;
    this.portalCruzado = false;
    this.alCruzarPortal = null;
    this.punteroActivo = false;
    this.fps = 60;
  }

  // ---------------------------------------------------------------- arranque
  async preparar(reportar = () => {}) {
    const r = this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas, antialias: !this.q.post, powerPreference: 'high-performance', alpha: false, stencil: false,
    });
    if (!r.capabilities.isWebGL2) throw new Error('Se necesita WebGL 2');
    r.setClearColor(0x000000, 1);
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.0;
    r.outputColorSpace = THREE.SRGBColorSpace;
    this.dpr = Math.min(window.devicePixelRatio || 1, this.q.dpr);
    this.escena = new THREE.Scene();
    this.escena.fog = new THREE.FogExp2(0x000000, 0.022);
    this.camara = new THREE.PerspectiveCamera(40, 1, 0.05, 1100);
    this.m = materiales();
    reportar('render', `WebGL 2 · calidad ${this.nivel}`);

    await Promise.race([
      Promise.all([
        document.fonts.load('500 84px "JetBrains Mono"'),
        document.fonts.load('600 40px "Manrope"'),
        document.fonts.load('500 40px "Unbounded"'),
      ]),
      espera(3000),
    ]);
    reportar('fuentes', 'Unbounded · Manrope · JetBrains Mono');

    this.escena.environment = this.crearEntorno();
    reportar('entorno', 'reflejos iridiscentes generados');

    const contornos = await this.crearLogo();
    reportar('logo', `${contornos} contornos extruidos en cromo`);

    this.crearPolvo();
    this.crearRayos();
    this.crearTunel();
    this.crearOceano();
    this.crearAura();
    this.crearEstaciones();
    this.pantallas = new Pantallas();
    this.uDespeje = { value: 0 };
    this.ctx = { m: this.m, uTiempo: this.uTiempo, uEscala: this.uEscala, uDespeje: this.uDespeje, pantallas: this.pantallas, densidad: this.q.densidad };
    this.crearEcosistema();
    this.crearLaboratorio();
    this.crearPasadizos();
    this.crearLogoParticulas();
    this.crearCarrusel();
    const [nx, nz] = this.q.oceano;
    reportar('mundo', `${EMPRESAS.length} dimensiones · ${this.pasadizos.length} pasadizos · ${this.estaciones.length} estaciones · ${miles(this.q.polvo + nx * nz + this.q.logoP)} partículas`);

    this.redimensionar();
    this.crearPost();
    this.camZ = this.zHero + 9;
    this.actualizarCamara(0.016);
    await r.compileAsync(this.escena, this.camara);
    this.renderizar();
    reportar('sombreadores', `${r.info.programs.length} programas compilados`);
  }

  crearEntorno() {
    const sc = new THREE.Scene();
    sc.add(new THREE.Mesh(
      new THREE.SphereGeometry(40, 64, 32),
      new THREE.ShaderMaterial({ side: THREE.BackSide, vertexShader: S.ENTORNO_V, fragmentShader: S.ENTORNO_F, depthWrite: false }),
    ));
    const panel = (w, h, color, k, x, y, z) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
      m.position.set(x, y, z);
      m.lookAt(0, 0, 0);
      sc.add(m);
    };
    panel(16, 3, 0xffffff, 2.4, 0, 14, 22);    // tira principal arriba, detrás de la cámara
    panel(4, 18, 0xdccbff, 2.4, -24, 2, 10);   // lila a la izquierda
    panel(4, 18, 0xa9efff, 2.4, 24, 0, 8);     // aqua a la derecha
    panel(20, 2, 0xffe3c9, 1.8, 0, -10, 20);   // cálida abajo
    panel(10, 10, 0xffffff, 1.2, 0, 0, -30);   // contraluz
    const pm = new THREE.PMREMGenerator(this.renderer);
    const rt = pm.fromScene(sc, 0.025);
    pm.dispose();
    return rt.texture;
  }

  // Disolución con borde luminoso para que el logo se materialice al entrar.
  inyectarAparicion(mat) {
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uAparicion = this.uAparicion;
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vPosL;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvPosL = position;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', `#include <common>\nvarying vec3 vPosL;\nuniform float uAparicion;\n${S.RUIDO}`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          float nAp = snoise(vPosL * 1.4) * 0.5 + 0.5;
          float vAp = nAp * 0.38 + clamp((vPosL.x + 3.4) / 6.8, 0.0, 1.0) * 0.62;
          float uAp = uAparicion * 1.3 - 0.15;
          if (vAp > uAp) discard;
          float bAp = 1.0 - smoothstep(0.0, 0.045, uAp - vAp);
          totalEmissiveRadiance += bAp * vec3(0.75, 0.88, 1.0) * 7.0;`);
    };
    mat.customProgramCacheKey = () => 'aparicion-haxelera';
  }

  async crearLogo() {
    const [txt, datos] = await Promise.all([
      fetch('assets/logo-haxelera.svg').then(r => r.text()),
      fetch('assets/logo-datos.json').then(r => r.json()),
    ]);
    const svg = new SVGLoader().parse(txt);
    const formas = svg.paths.flatMap(p => SVGLoader.createShapes(p));
    this.formasLogo = formas;
    // La escala sale del ancho real del dibujo, así sirve cualquier versión del logo.
    const plano = new THREE.ShapeGeometry(formas);
    plano.computeBoundingBox();
    this.anchoSVG = plano.boundingBox.max.x - plano.boundingBox.min.x;
    plano.dispose();
    const s = ANCHO_LOGO / this.anchoSVG;
    // Grosor y bisel en unidades del mundo, convertidos a unidades del SVG.
    const geo = new THREE.ExtrudeGeometry(formas, {
      depth: 0.42 / s, bevelEnabled: true, bevelThickness: 0.029 / s, bevelSize: 0.011 / s, bevelOffset: -0.0055 / s, bevelSegments: 3, curveSegments: 2,
    });
    // Voltear y y z a la vez equivale a girar 180° sobre x: el SVG queda derecho sin invertir las caras.
    geo.scale(s, -s, -s);
    geo.computeBoundingBox();
    const c = new THREE.Vector3();
    geo.boundingBox.getCenter(c);
    geo.translate(-c.x, -c.y, -c.z);
    geo.computeBoundingBox();
    this.altoLogo = geo.boundingBox.max.y - geo.boundingBox.min.y;
    const aLocal = (x, y) => new THREE.Vector2(x * s - c.x, -y * s - c.y);

    const cara = new THREE.MeshPhysicalMaterial({
      color: 0xffffff, metalness: 1, roughness: 0.07,
      iridescence: 1, iridescenceIOR: 1.75, iridescenceThicknessRange: [180, 820],
      clearcoat: 0.5, clearcoatRoughness: 0.04, envMapIntensity: 1.2,
    });
    const lado = new THREE.MeshPhysicalMaterial({
      color: 0xc7cad3, metalness: 1, roughness: 0.22,
      iridescence: 0.7, iridescenceIOR: 1.5, iridescenceThicknessRange: [300, 700],
    });
    this.inyectarAparicion(cara);
    this.inyectarAparicion(lado);
    cara.fog = lado.fog = false;

    const grupo = this.logo = new THREE.Group();
    grupo.add(new THREE.Mesh(geo, [cara, lado]));

    // El hueco del «A» es la puerta: un tubo de energía recorre su borde.
    const pc = aLocal(datos.centroPortal[0], datos.centroPortal[1]);
    const zFrente = geo.boundingBox.max.z + 0.004;
    const curva = new CurvaPoligono(datos.portal.map(([x, y]) => { const v = aLocal(x, y); return new THREE.Vector3(v.x, v.y, zFrente); }));
    this.uIgnicion = { value: 0.35 };
    grupo.add(new THREE.Mesh(
      new THREE.TubeGeometry(curva, 420, 0.011, 6, true),
      new THREE.ShaderMaterial({
        uniforms: { uTiempo: this.uTiempo, uIgnicion: this.uIgnicion, uAparicion: this.uAparicion },
        vertexShader: S.UV_V, fragmentShader: S.PORTAL_F, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
      }),
    ));
    // El centro del portal queda en el eje del viaje (x = 0, y = 0).
    grupo.position.set(-pc.x, -pc.y, 0);
    this.heroX = -pc.x;
    this.heroY = -pc.y;
    // Triángulo del portal en coordenadas del eje: túnel y puertas repiten esta forma, más grande.
    const [ix, iy] = datos.centroPortal;
    this.triangulo = (datos.triangulo || datos.portal).map(([x, y]) => new THREE.Vector2((x - ix) * s, -(y - iy) * s));
    this.radioPortal = (datos.radioPortal || 80) * s;
    this.escena.add(grupo);
    return svg.paths.reduce((n, p) => n + p.subPaths.length, 0);
  }

  // Cielo estrellado HDR (desactivado desde el 17 oct 2026: el inicio va sobre negro puro y cada
  // dimensión trae su propio fondo). Para volver a usarlo, llamar crearEstrellas() en preparar()
  // y copiar la posición de la cámara a this.estrellas en cada cuadro.
  crearEstrellas() {
    this.estrellas = new THREE.Group();
    const capa = (n, tam, brillo, rayos) => {
      const pos = new Float32Array(n * 3), dat = new Float32Array(n * 4), v = new THREE.Vector3();
      for (let i = 0; i < n; i++) {
        v.randomDirection().multiplyScalar(420);
        pos.set([v.x, v.y, v.z], i * 3);
        const b = Math.random();
        dat.set([tam[0] + Math.pow(b, 3) * (tam[1] - tam[0]), brillo[0] + Math.pow(b, 4) * (brillo[1] - brillo[0]), Math.random(), Math.random()], i * 4);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      g.setAttribute('aDatos', new THREE.BufferAttribute(dat, 4));
      const p = new THREE.Points(g, new THREE.ShaderMaterial({
        uniforms: { uTiempo: this.uTiempo, uPR: this.uPR || (this.uPR = { value: 1 }), uRayos: { value: rayos } },
        vertexShader: S.ESTRELLAS_V, fragmentShader: S.ESTRELLAS_F, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      }));
      p.frustumCulled = false;
      this.estrellas.add(p);
    };
    const n = { alta: 6500, media: 4000, baja: 2200 }[this.nivel] || 4000;
    capa(n, [1.1, 2.8], [0.25, 1.6], 0);
    capa(Math.round(n * 0.02), [16, 34], [1.2, 3.2], 1);
    this.escena.add(this.estrellas);
  }

  crearPolvo() {
    const n = this.q.polvo;
    const pos = new Float32Array(n * 3), rnd = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() * 2 - 1) * 26;
      pos[i * 3 + 1] = (Math.random() * 2 - 1) * 12;
      pos[i * 3 + 2] = 26 - Math.random() * (26 - Z_FINAL);
      for (let k = 0; k < 4; k++) rnd[i * 4 + k] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 4));
    this.polvo = new THREE.Points(g, new THREE.ShaderMaterial({
      uniforms: { uTiempo: this.uTiempo, uEscala: this.uEscala, uOpacidad: { value: 1 } },
      vertexShader: S.POLVO_V, fragmentShader: S.PUNTO_F, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.polvo.frustumCulled = false;
    this.escena.add(this.polvo);
  }

  crearRayos() {
    const n = this.q.rayos;
    const pos = new Float32Array(n * 6), fin = new Float32Array(n * 2), rnd = new Float32Array(n * 2);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, rad = 3.8 + Math.random() * 13;
      const x = Math.cos(a) * rad, y = Math.sin(a) * rad * 0.7, z = 24 - Math.random() * (24 - Z_FINAL + 10);
      pos.set([x, y, z, x, y, z], i * 6);
      fin[i * 2 + 1] = 1;
      rnd[i * 2] = rnd[i * 2 + 1] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aFin', new THREE.BufferAttribute(fin, 1));
    g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));
    this.uRayos = { value: 0 };
    this.uLargo = { value: 0 };
    this.rayos = new THREE.LineSegments(g, new THREE.ShaderMaterial({
      uniforms: { uRayos: this.uRayos, uLargo: this.uLargo },
      vertexShader: S.RAYOS_V, fragmentShader: S.RAYOS_F, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.rayos.frustumCulled = false;
    this.escena.add(this.rayos);
  }

  atlasGlifos() {
    const c = document.createElement('canvas');
    c.width = c.height = 1024;
    const x = c.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, 1024, 1024);
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = '500 84px "JetBrains Mono", ui-monospace, monospace';
    const G = [...'01{}[]<>/\\;:=+-*#$%&@?!|~^ABCDEFHKXZ0123456789λΣΔΩπ∞≠≡→←↑↓◆◇○●'];
    for (let k = 0; k < 64; k++) x.fillText(G[k % G.length], (k % 8) * 128 + 64, Math.floor(k / 8) * 128 + 68);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.NoColorSpace;
    t.anisotropy = 8;
    return t;
  }

  // Triángulo del portal escalado para que su círculo inscrito mida «radio».
  trianguloA(radio) {
    const k = radio / this.radioPortal;
    return this.triangulo.map(v => v.clone().multiplyScalar(k));
  }

  // El túnel es un prisma con la forma exacta del triángulo del logo: sus anillos salen triangulares.
  crearTunel() {
    const z0 = -1.6, z1 = -50, L = z0 - z1;
    const V = this.trianguloA(2.6);
    const lados = V.map((v, i) => v.distanceTo(V[(i + 1) % 3]));
    const P = lados.reduce((a, b) => a + b, 0);
    const pos = [], uv = [], idx = [];
    let acum = 0;
    for (let i = 0; i < 3; i++) {
      const a = V[i], b = V[(i + 1) % 3];
      const u0 = acum / P, u1 = (acum + lados[i]) / P;
      acum += lados[i];
      const base = pos.length / 3;
      pos.push(a.x, a.y, z0, b.x, b.y, z0, a.x, a.y, z1, b.x, b.y, z1);
      uv.push(u0, 0, u1, 0, u0, 1, u1, 1);
      idx.push(base, base + 1, base + 2, base + 1, base + 3, base + 2);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx);
    this.tunel = new THREE.Mesh(g, new THREE.ShaderMaterial({
      uniforms: {
        uGlifos: { value: this.atlasGlifos() }, uTiempo: this.uTiempo, uRevelar: { value: 0 },
        uZ0: { value: z0 }, uZ1: { value: z1 }, uCamZ: { value: 0 }, uLargo: { value: L },
      },
      vertexShader: S.TUNEL_V, fragmentShader: S.TUNEL_F,
      side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.tunel.frustumCulled = false;
    this.escena.add(this.tunel);
    this.puertaSalida = crearPuerta(this, V, 0.2, 0.03);
    this.puertaSalida.position.z = z1 - 0.6;
    this.escena.add(this.puertaSalida);
  }

  crearOceano() {
    const [nx, nz] = this.q.oceano;
    const ancho = 90, z0 = -36, z1 = Z_FINAL + 20;
    const n = nx * nz;
    const pos = new Float32Array(n * 3), rnd = new Float32Array(n);
    let k = 0;
    for (let j = 0; j < nz; j++) {
      for (let i = 0; i < nx; i++) {
        pos[k * 3] = (i / (nx - 1) - 0.5) * ancho + (Math.random() - 0.5) * 0.2;
        pos[k * 3 + 1] = -4.2;
        pos[k * 3 + 2] = lerp(z0, z1, j / (nz - 1));
        rnd[k] = Math.random();
        k++;
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 1));
    this.uOceano = { value: 0 };
    this.oceano = new THREE.Points(g, new THREE.ShaderMaterial({
      uniforms: { uTiempo: this.uTiempo, uEscala: this.uEscala, uRevelar: this.uOceano, uOpacidad: { value: 1 } },
      vertexShader: S.OCEANO_V, fragmentShader: S.PUNTO_F, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.oceano.frustumCulled = false;
    this.escena.add(this.oceano);
  }

  crearAura() {
    this.uAura = { value: 0.3 };
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1150, 384), new THREE.ShaderMaterial({
      uniforms: { uTiempo: this.uTiempo, uRevelar: this.uAura },
      vertexShader: S.UV_V, fragmentShader: S.AURA_F, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    m.position.set(0, -4.2, Z_FINAL - 170);
    this.escena.add(m);
  }

  crearEstaciones() {
    const ctx = { m: this.m, uTiempo: this.uTiempo };
    for (const t of RUTA) {
      if (!t.objeto) continue;
      const obj = FABRICAS[t.objeto](ctx, t.lado);
      this.escena.add(obj.grupo);
      this.estaciones.push({ id: t.id, lado: t.lado, zReposo: (t.z0 + t.z1) / 2, obj });
    }
    const tri = this.trianguloA(2.2);
    for (let i = 0; i < 5; i++) {
      const p = crearPuerta(this, tri, i * 0.17);
      p.visible = false;
      this.escena.add(p);
      this.puertas.push(p);
    }
    const c = RUTA[RUTA.length - 1];
    this.zContacto = (c.z0 + c.z1) / 2;
    this.zProceso = RUTA.find(r => r.id === 'proceso').z0;
  }

  colocarPuertas(zs) {
    zs.forEach((z, i) => { if (this.puertas[i]) { this.puertas[i].position.set(0, 0, z); this.puertas[i].visible = true; } });
  }

  crearLogoParticulas() {
    const s = 4.7 / this.anchoSVG;
    const geo = new THREE.ShapeGeometry(this.formasLogo, 2);
    geo.scale(s, -s, 1);
    geo.computeBoundingBox();
    const c = new THREE.Vector3();
    geo.boundingBox.getCenter(c);
    geo.translate(-c.x, -c.y, 0);
    const P = geo.attributes.position.array;
    const I = geo.index ? geo.index.array : null;
    const tri = I ? I.length / 3 : P.length / 9;
    const v = (k) => (I ? I[k] : k) * 3;
    const acum = new Float32Array(tri);
    let total = 0;
    for (let t = 0; t < tri; t++) {
      const a = v(t * 3), b = v(t * 3 + 1), d = v(t * 3 + 2);
      total += Math.abs((P[b] - P[a]) * (P[d + 1] - P[a + 1]) - (P[d] - P[a]) * (P[b + 1] - P[a + 1])) / 2;
      acum[t] = total;
    }
    const n = this.q.logoP;
    const pos = new Float32Array(n * 3), ini = new Float32Array(n * 3), rnd = new Float32Array(n * 4);
    const dir = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      const r = Math.random() * total;
      let lo = 0, hi = tri - 1;
      while (lo < hi) { const mid = (lo + hi) >> 1; if (acum[mid] < r) lo = mid + 1; else hi = mid; }
      const a = v(lo * 3), b = v(lo * 3 + 1), d = v(lo * 3 + 2);
      let u = Math.random(), w = Math.random();
      if (u + w > 1) { u = 1 - u; w = 1 - w; }
      pos[i * 3] = P[a] + (P[b] - P[a]) * u + (P[d] - P[a]) * w;
      pos[i * 3 + 1] = P[a + 1] + (P[b + 1] - P[a + 1]) * u + (P[d + 1] - P[a + 1]) * w;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
      dir.randomDirection().multiplyScalar(4 + Math.random() * 9);
      ini[i * 3] = dir.x * 1.3; ini[i * 3 + 1] = dir.y * 0.8; ini[i * 3 + 2] = dir.z - 4;
      for (let k = 0; k < 4; k++) rnd[i * 4 + k] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aInicio', new THREE.BufferAttribute(ini, 3));
    g.setAttribute('aRand', new THREE.BufferAttribute(rnd, 4));
    this.uMorph = { value: 0 };
    this.uPuntero = { value: new THREE.Vector3(99, 99, 0) };
    this.logoP = new THREE.Points(g, new THREE.ShaderMaterial({
      uniforms: { uTiempo: this.uTiempo, uEscala: this.uEscala, uMorph: this.uMorph, uPuntero: this.uPuntero, uOpacidad: { value: 1 } },
      vertexShader: S.LOGOP_V, fragmentShader: S.PUNTO_F, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    this.logoP.frustumCulled = false;
    this.escena.add(this.logoP);
  }

  // Ecosistema: las nueve empresas del grupo, una dimensión cada una.
  crearEcosistema() {
    const t = RUTA.find(r => r.id === 'ecosistema');
    if (!t) return;
    const e = t.entrada || 6;
    const zA = t.z0 - e, zB = t.z1 + e;
    // Una parada frente a cada portal, de zA a zB (main.js frena el scroll en cada una).
    this.ecosistema = new Ecosistema(this.ctx, EMPRESAS, zA, (zA - zB) / (EMPRESAS.length - 1));
    this.escena.add(this.ecosistema.grupo);
    this.dimActual = -1;
    this.perfil = null;
    this.perfilVis = 0;
    this.espina = { k: -1, c: 0, vis: 0 };
  }

  // Laboratorio del equipo: programadores a la izquierda, analistas de seguridad a la derecha.
  crearLaboratorio() {
    const t = RUTA.find(r => r.id === 'equipo');
    if (!t) return;
    const g = this.laboratorio = new THREE.Group();
    this.uLab = { value: 0 };
    this.zLab = [t.z0, t.z1];
    this.puestos = [];
    [-10, -18, -26, -34].forEach((dz, i) => {
      for (const lado of [-1, 1]) {
        const p = crearPuesto(this.ctx, { tipo: lado < 0 ? 'codigo' : 'ciber', semilla: i * 2 + (lado > 0 ? 1 : 0), densidad: this.q.densidad });
        p.grupo.scale.setScalar(1.5);
        p.grupo.position.set(lado * 2.7, -1.5, t.z0 + dz - (lado > 0 ? 4 : 0));
        p.grupo.rotation.y = -lado * 0.78;
        g.add(p.grupo);
        this.puestos.push(p);
      }
    });
    const largo = t.z0 - t.z1;
    const piso = new THREE.Mesh(new THREE.PlaneGeometry(13, largo + 6), new THREE.ShaderMaterial({
      uniforms: { uTiempo: this.uTiempo, uAct: this.uLab }, vertexShader: S.TUNEL_V, fragmentShader: S.PISO_F,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    piso.rotation.x = -Math.PI / 2;
    piso.position.set(0, -2.22, (t.z0 + t.z1) / 2);
    g.add(piso);
    const luces = [];
    for (let z = t.z0 - 2; z > t.z1; z -= 3.2) for (const x of [-2.6, 0, 2.6]) luces.push({ p: [x, 3, z], s: [0.06, 0.03, 2.2], c: [1.8, 2.1, 2.6] });
    g.add(tubos({ uTiempo: this.uTiempo, uAct: this.uLab }, luces));
    this.escena.add(g);
  }

  // Pasadizos entre estaciones: cada uno con otra forma de portal y otro mundo adentro.
  crearPasadizos() {
    this.pasadizos = [];
    RUTA.forEach((t, i) => {
      if (!t.pasadizo) return;
      const reposo = (t.z0 + t.z1) / 2;
      const sig = RUTA[i + 1];
      const reposoSig = (sig.z0 + sig.z1) / 2;
      // Empieza detrás del objeto de esta estación y termina antes de la siguiente.
      const zIni = t.objeto ? reposo - 10.5 : t.z1;
      const largo = zIni - (reposoSig + 5.5);
      const p = crearPasadizo(this.ctx, t.pasadizo, zIni, largo);
      this.escena.add(p.grupo);
      this.pasadizos.push(p);
    });
  }

  crearCarrusel() {
    if (!this.proyectos.length) return;
    this.carrusel = new Carrusel({ uTiempo: this.uTiempo }, this.proyectos);
    const t = RUTA.find(r => r.id === 'proyectos');
    this.zProyectos = (t.z0 + t.z1) / 2;
    this.escena.add(this.carrusel.grupo);
  }

  crearPost() {
    if (!this.q.post) return;
    const r = this.renderer;
    const msaa = r.extensions.has('EXT_color_buffer_float') ? this.q.msaa : 0;
    const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: msaa });
    const c = this.composer = new EffectComposer(r, rt);
    c.setPixelRatio(this.dpr);
    c.setSize(this.ancho, this.alto);
    c.addPass(new RenderPass(this.escena, this.camara));
    if (this.q.bloom) {
      this.bloom = new UnrealBloomPass(new THREE.Vector2(this.ancho, this.alto), 0.62, 0.55, 0.92);
      c.addPass(this.bloom);
    }
    c.addPass(new OutputPass());
    this.final = new ShaderPass(S.FINAL);
    c.addPass(this.final);
    this.final.uniforms.uRes.value.set(this.ancho * this.dpr, this.alto * this.dpr);
    if (this.reducido) this.final.uniforms.uGrano.value = 0.03;
  }

  // ---------------------------------------------------------------- disposición
  distribuir() {
    const aspecto = this.ancho / this.alto;
    const movil = this.movil = window.matchMedia('(max-aspect-ratio: 4/5), (max-width: 640px)').matches;
    this.fovBase = movil ? 56 : 40;
    const tan = Math.tan(THREE.MathUtils.degToRad(this.fovBase / 2));
    // Distancia del inicio para que el logo quepa con aire alrededor del texto.
    // Inicio: solo el logo, centrado en la pantalla.
    const zAncho = (ANCHO_LOGO * (movil ? 1.2 : 1.5)) / (2 * tan * aspecto);
    const zAlto = (this.altoLogo || 5.9) / ((movil ? 0.44 : 0.62) * 2 * tan);
    this.zHero = Math.max(zAncho, zAlto, 9);
    const visH = 2 * this.zHero * tan;
    this.heroOffY = visH * 0.015;
    this.heroOffX = 0;
    this.dObj = movil ? 10.5 : 7.4;
    for (const e of this.estaciones) {
      e.obj.grupo.position.set(movil ? 0 : e.lado * 3.3, movil ? 1.3 : 0.05, e.zReposo - this.dObj);
    }
    this.carrusel?.colocar({ movil, zReposo: this.zProyectos });
    // Distancia de cada parada a su portal: el triángulo ocupa ~70 % del alto (o casi todo el ancho en el celular).
    if (this.ecosistema) {
      const alto = (1.5 * RT) / ((movil ? 0.4 : 0.7) * 2 * tan);
      const ancho = (Math.sqrt(3) * RT) / ((movil ? 0.86 : 0.6) * 2 * tan * aspecto);
      this.ecosistema.colocar(movil, Math.min(20, Math.max(alto, ancho, 9)));
    }
    this.logoP.position.set(movil ? 0 : -4.1, movil ? 2.65 : 0.15, this.zContacto - (movil ? 12 : 9.5));
  }

  redimensionar() {
    const w = this.ancho = window.innerWidth;
    const h = this.alto = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.setSize(w, h, false);
    this.camara.aspect = w / h;
    this.distribuir();
    this.camara.fov = this.fovBase;
    this.camara.updateProjectionMatrix();
    this.actualizarEscala();
    if (this.uPR) this.uPR.value = this.dpr;
    if (this.composer) {
      this.composer.setPixelRatio(this.dpr);
      this.composer.setSize(w, h);
      this.final.uniforms.uRes.value.set(w * this.dpr, h * this.dpr);
    }
  }

  actualizarEscala() {
    this.uEscala.value = (this.alto * this.dpr) / (2 * Math.tan(THREE.MathUtils.degToRad(this.camara.fov / 2)));
  }

  // Golpe de pasadizo al abrir una minipágina: distorsión, aberración y destello por un instante.
  saltoDimensional() { this.salto = 1; }

  entrar() {
    this.inicioAparicion = this.t;
    this.entrando = true;
  }

  // ---------------------------------------------------------------- cámara
  actualizarCamara(dt) {
    const cam = this.camara;
    const prev = this.camZ;
    if (this.reducido && (this.perfil || this.perfilVis > 0.01) && Math.abs(this.zObjetivo - this.camZ) > 2) this.camZ = this.zObjetivo;
    else this.camZ += (this.zObjetivo - this.camZ) * (1 - Math.exp(-dt * 5));
    const v = (this.camZ - prev) / Math.max(dt, 1e-3);
    this.vel += (v - this.vel) * (1 - Math.exp(-dt * 10));
    const z = this.camZ;

    // Al pasar junto a una estación la cámara se aparta y gira hacia el objeto.
    let sway = 0;
    if (!this.movil) {
      for (const e of this.estaciones) { const d = z - e.zReposo; sway += e.lado * Math.exp(-(d * d) / 160); }
      const dc = z - this.zContacto;
      sway -= Math.exp(-(dc * dc) / 160);
    }
    const dsw = (sway - this.swayPrev) / Math.max(dt, 1e-3);
    this.swayPrev = sway;
    const alabeo = this.reducido ? 0 : Math.max(-0.07, Math.min(0.07, -dsw * 0.05));
    this.alabeo += (alabeo - this.alabeo) * (1 - Math.exp(-dt * 4));

    const ps = this.punteroSuave;
    ps.lerp(this.puntero, 1 - Math.exp(-dt * 4));
    // Entre z = 3 y z = −3 la cámara queda exacta en el centro del triángulo, mirando de frente:
    // sin desplazamiento del inicio ni del puntero, así el túnel se ve justo en medio.
    const h = suave((z - 3) / 8);
    const cerca = suave((Math.abs(z) - 3) / 6);
    const px = ps.x * cerca, py = ps.y * cerca;
    const hx = this.heroX - this.heroOffX, hy = this.heroY - this.heroOffY;
    cam.position.set(
      lerp(-sway * 0.55 + px * 0.35, hx + px * 0.25, h),
      lerp(py * 0.22, hy + py * 0.18, h),
      z,
    );
    this.mira.set(lerp(sway * 1.25, hx, h) + px * 0.1, lerp(0, hy, h) + py * 0.06, z - 10);
    cam.lookAt(this.mira);
    cam.rotateZ(this.alabeo);

    const rapidez = Math.min(Math.abs(this.vel) / 45, 1);
    const fov = this.fovBase + (this.reducido ? 0 : rapidez * 12);
    if (Math.abs(fov - cam.fov) > 0.01) { cam.fov = fov; cam.updateProjectionMatrix(); this.actualizarEscala(); }
  }

  // ---------------------------------------------------------------- cuadro
  cuadro(dt) {
    this.t += dt;
    this.uTiempo.value = this.t;
    if (this.entrando) {
      const k = clamp01((this.t - this.inicioAparicion) / 2.6);
      this.uAparicion.value = 1 - Math.pow(1 - k, 3);
      if (k >= 1) this.entrando = false;
    }
    this.actualizarCamara(dt);
    const z = this.camZ;
    const ps = this.punteroSuave;

    // Logo cromado del inicio
    this.logo.visible = z > -4;
    if (this.logo.visible) {
      // La inclinación se suaviza aparte y se multiplica por f: al llegar al portal el logo queda
      // exactamente de frente, sin importar qué tan rápido se haga scroll.
      const f = suave((z - 4) / 8) * (this.reducido ? 0.4 : 1);
      const k = 1 - Math.exp(-dt * 5);
      this.inclinacionY = lerp(this.inclinacionY || 0, ps.x * 0.38 + Math.sin(this.t * 0.35) * 0.08, k);
      this.inclinacionX = lerp(this.inclinacionX || 0, -ps.y * 0.22 + Math.sin(this.t * 0.27) * 0.04, k);
      this.logo.rotation.set(this.inclinacionX * f, this.inclinacionY * f, 0);
      this.uIgnicion.value = 0.35 + (1 - suave((z - 1) / 10)) * 1.6;
    }
    this.escena.environmentRotation.set(ps.y * 0.2, this.t * 0.04 + ps.x * 0.5, 0);

    if (!this.portalCruzado && z < 0) { this.portalCruzado = true; this.alCruzarPortal?.(); }
    if (this.portalCruzado && z > 3) this.portalCruzado = false;

    // Túnel, océano y horizonte
    const ut = this.tunel.material.uniforms;
    ut.uRevelar.value = 1 - suave((z - 2) / 9);
    ut.uCamZ.value = z;
    this.tunel.visible = z > -64 && z < 12;
    this.puertaSalida.visible = z > -80 && z < 2;
    // Dentro del ecosistema cada dimensión trae su propio mundo: el océano y el horizonte se apagan.
    const eco = this.ecosistema;
    const enEco = eco ? suave((eco.zA + 8 - z) / 6) * suave((z - eco.zB + 8) / 6) : 0;
    const reino = suave((-42 - z) / 16) * (1 - enEco);
    this.uOceano.value = reino;
    this.oceano.visible = reino > 0.001;
    this.uAura.value = reino * (1 - 0.5 * suave((this.zProceso - z) / 60));

    const rapidez = Math.min(Math.abs(this.vel) / 40, 1);
    this.uRayos.value = this.reducido ? 0 : rapidez * 0.9;
    this.uLargo.value = Math.min(Math.abs(this.vel) * 0.1, 9);

    // Estaciones: solo se animan las cercanas
    for (const e of this.estaciones) {
      const d = z - e.zReposo;
      const vis = d > -this.dObj - 3 && d < 80;
      e.obj.grupo.visible = vis;
      if (vis) e.obj.actualizar(dt, this.t, Math.exp(-(d * d) / 200));
    }
    for (const p of this.puertas) p.material.uniforms.uBrillo.value = 1 - suave((z - p.position.z - 30) / 20);

    // Ecosistema, laboratorio y pasadizos
    let destelloDim = 0;
    if (eco) {
      // Perfil abierto: la cámara cruza el portal y la columna sube; al cerrar, todo vuelve al recorrido.
      // Al cerrar, la cámara vuelve a cruzar el portal hacia atrás: hasta salir, sigue viéndose ese mundo.
      const ek = this.espina.k;
      const volviendo = !this.perfil && ek >= 0 && this.camZ < eco.dimensiones[ek].zP + 0.5 && this.zObjetivo > eco.dimensiones[ek].zP;
      const pk = this.perfil ? this.perfil.k : volviendo ? ek : -1;
      this.perfilVis += ((this.perfil ? 1 : 0) - this.perfilVis) * (1 - Math.exp(-dt * (this.perfil ? 2.6 : 4)));
      if (this.perfil) Object.assign(this.espina, { k: this.perfil.k, c: this.perfil.c });
      else if (!volviendo && this.perfilVis < 0.01) this.espina.k = -1;
      this.espina.vis = this.perfilVis;
      eco.actualizar(dt, this.t, z, this.vel, pk, this.espina.k >= 0 ? this.espina : null);
      // En el recorrido, el centro de la pantalla queda limpio de partículas para leer el nombre.
      this.uDespeje.value = pk >= 0 ? 0 : 1 - this.perfilVis;
      const k = eco.indice(z);
      if (k !== this.dimActual) {
        if (this.dimActual >= 0 && (k >= 0 || z < eco.zB)) { this.cruceDim = 1; if (k >= 0) this.alCruzarDimension?.(k); }
        this.dimActual = k;
        this.alCambiarDimension?.(k);
      }
      this.cruceDim = Math.max(0, (this.cruceDim || 0) - dt * 2.2);
      destelloDim = Math.max(this.cruceDim, this.salto || 0);
      this.salto = Math.max(0, (this.salto || 0) - dt * 1.4);
      // Tarjetas de la columna (solo dentro del perfil): se pueden señalar y abrir.
      eco.hoverK = pk;
      if (pk >= 0 && this.punteroActivo) {
        this.rayo.setFromCamera(this.puntero, this.camara);
        eco.hover = eco.tarjetaBajo(this.rayo, pk);
      } else eco.hover = -1;
      if (k >= 0) this.colorFuga = eco.dimensiones[k].color;
    }
    if (this.laboratorio) {
      const [z0, z1] = this.zLab;
      // No se asoma detrás del último portal del ecosistema: aparece al cruzarlo.
      const vis = z < Math.min(z0 + 40, eco ? eco.zB + 0.5 : Infinity) && z > z1 - 6;
      this.laboratorio.visible = vis;
      if (vis) {
        this.uLab.value = 0.1 + 0.9 * suave((z0 + 10 - z) / 10);
        for (const p of this.puestos) {
          const d = z - p.grupo.position.z;
          p.actualizar(dt, this.t, suave(1 - Math.abs(d - 6) / 18));
        }
      }
    }
    for (const p of this.pasadizos) p.actualizar(dt, this.t, z);
    this.pantallas.actualizar(dt);

    // Logo de partículas: se arma al acercarse al contacto
    this.uMorph.value = suave((this.zContacto + 22 - z) / 20);
    this.logoP.visible = z < this.zContacto + 70;
    if (this.carrusel) {
      this.rayo.setFromCamera(this.puntero, this.camara);
      this.carrusel.actualizar(dt, z, this.punteroActivo ? this.rayo : null);
    }
    if (this.logoP.visible) {
      this.rayo.setFromCamera(ps, this.camara);
      const o = this.rayo.ray.origin, d = this.rayo.ray.direction;
      const tt = (this.logoP.position.z - o.z) / d.z;
      this.uPuntero.value.set(o.x + d.x * tt - this.logoP.position.x, o.y + d.y * tt - this.logoP.position.y, 0);
    }

    // Postproceso
    const portal = Math.exp(-(z * z) / 3);
    const red = this.reducido ? 0 : 1;
    if (this.final) {
      const u = this.final.uniforms;
      u.uTiempo.value = this.t;
      u.uAberracion.value = 0.0012 + red * (rapidez * 0.006 + portal * 0.018 + destelloDim * 0.01);
      u.uWarp.value = red * (portal * 0.9 + rapidez * 0.25 + destelloDim * 0.5);
      u.uDestello.value = red * (Math.pow(portal, 3) * (0.25 + 0.5 * Math.min(Math.abs(this.vel) / 8, 1)) + Math.pow(destelloDim, 3) * 0.22);
      u.uFugas.value = 0.12 + reino * 0.45 + portal * 1.5 + rapidez * 0.5 + enEco * 1.4;
      if (this.colorFuga) u.uColorFuga.value.lerp(this.colorFuga, 1 - Math.exp(-dt * 3));
      u.uMezclaFuga.value += (enEco - u.uMezclaFuga.value) * (1 - Math.exp(-dt * 3));
    } else {
      this.destello = red * Math.pow(portal, 3) * 0.5;
    }

    this.renderizar();
    this.vigilarRendimiento(dt);
  }

  renderizar() {
    if (this.composer) this.composer.render();
    else this.renderer.render(this.escena, this.camara);
  }

  // Si el equipo no llega a ~46 cuadros por segundo, baja la resolución interna.
  vigilarRendimiento(dt) {
    if (this.t < 3) return;
    this.acumulado = (this.acumulado || 0) + dt;
    this.cuadros = (this.cuadros || 0) + 1;
    if (this.acumulado < 2) return;
    this.fps = this.cuadros / this.acumulado;
    this.acumulado = 0;
    this.cuadros = 0;
    if (this.fps < 46 && this.dpr > 1) {
      this.dpr = Math.max(1, Math.round((this.dpr - 0.25) * 100) / 100);
      this.redimensionar();
    }
  }
}
