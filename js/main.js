// Arranque y orquestación: cargador, scroll → cámara, interfaz, cursor y sonido.
import { RUTA } from './ruta.js';
import { CONFIG } from './config.js';
import { EMPRESAS } from './empresas.js';
import { Sonido } from './audio.js';
import { prepararRevelados, revolver, partirLetras, degradarLetras } from './texto.js';
import { Minisitio } from './minisitio.js';
import { Agente } from './agente.js';
import { EXPERIENCIAS } from './experiencias.js';
import { Perfil } from './perfil.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const esc = (s) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// Curvas de avance de cada tramo: p (0..1, centro de pantalla dentro de la sección) → fracción del recorrido.
const CURVAS = {
  lineal: (p) => p,
  meseta: (p) => p + (0.8 * Math.sin(2 * Math.PI * p)) / (2 * Math.PI),
  // Casi quieta mientras el contenido está fijo; entra y sale con suavidad.
  pausa: (p, t) => {
    if (p < t.pA) return 0.45 * (1 - (1 - p / t.pA) ** 2);
    if (p > t.pB) return 0.55 + 0.45 * ((p - t.pB) / (1 - t.pB)) ** 2;
    return 0.45 + 0.1 * (p - t.pA) / (t.pB - t.pA);
  },
  // Avanza mientras está fija. Con «pasos», frena en cada parada (frente a cada portal) y vuela entre una y otra:
  // cada dimensión ocupa el mismo scroll.
  fijada: (p, t) => {
    const e = t.e;
    if (p < t.pA) return (p / t.pA) * e;
    if (p > t.pB) return 1 - e + ((p - t.pB) / (1 - t.pB)) * e;
    let g = (p - t.pA) / (t.pB - t.pA);
    if (t.pasos > 1) {
      const n = t.pasos - 1, x = g * n, i = Math.min(Math.floor(x), n - 1), u = x - i;
      g = (i + u - (0.84 * Math.sin(2 * Math.PI * u)) / (2 * Math.PI)) / n;
    }
    return e + g * (1 - 2 * e);
  },
};

const raiz = document.documentElement;
const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
const hashInicial = location.hash;
window.scrollTo(0, 0);

function detectarNivel() {
  const nucleos = navigator.hardwareConcurrency || 4;
  const memoria = navigator.deviceMemory || 4;
  const tactil = !window.matchMedia('(pointer: fine)').matches;
  if (tactil) return memoria <= 3 || nucleos <= 4 ? 'baja' : 'media';
  return nucleos <= 4 || memoria <= 4 ? 'media' : 'alta';
}
const pedido = new URLSearchParams(location.search).get('calidad');
const nivel = ['alta', 'media', 'baja'].includes(pedido) ? pedido : detectarNivel();
raiz.classList.add('calidad-' + nivel);

const sonido = new Sonido();
let mundo = null;
let tramos = [];
let entrado = false;

// Proyectos: el contenido real vive en el HTML; el carrusel 3D lo lee de ahí.
const casos = $$('.caso').map(a => ({
  titulo: a.querySelector('h3').textContent.trim(),
  texto: a.querySelector('p').textContent.trim(),
  tec: a.querySelector('.tec').textContent.trim(),
}));

// ------------------------------------------------------------------ cargador
const cg = { log: $('.cg-log'), barra: $('.cg-barra i'), pct: $('.cg-pct'), entrar: $('.cg-entrar'), logo: $('.cg-logo') };
let progreso = 0, progresoVisto = 0, cargando = true;
const PASOS = { modulos: 0.3, render: 0.38, fuentes: 0.5, entorno: 0.62, logo: 0.76, mundo: 0.88, sombreadores: 1 };
const NOMBRES = {
  render: 'Núcleo de render', fuentes: 'Tipografías', entorno: 'Entorno', logo: 'Logotipo',
  mundo: 'Mundo procedural', sombreadores: 'Sombreadores',
};
const MARCAS = { ok: '[ ok ]', cmd: '&gt;', warn: '[ !! ]', info: '[ .. ]' };

function linea(texto, tipo = 'ok') {
  const li = document.createElement('li');
  li.className = tipo;
  li.innerHTML = `<span class="et">${MARCAS[tipo]}</span>${esc(texto)}`;
  cg.log.append(li);
  while (cg.log.children.length > 9) cg.log.firstElementChild.remove();
}

function animarPct() {
  progresoVisto += (progreso - progresoVisto) * 0.12;
  if (progreso - progresoVisto < 0.002) progresoVisto = progreso;
  cg.pct.textContent = String(Math.round(progresoVisto * 100)).padStart(3, '0');
  cg.barra.style.transform = `scaleX(${progresoVisto})`;
  cg.logo.style.setProperty('--p', progresoVisto.toFixed(4));
  if (progresoVisto >= 1) cg.logo.classList.add('completo');
  if (cargando) requestAnimationFrame(animarPct);
}

async function cargar() {
  linea('haxelera://iniciar --dimension=2', 'cmd');
  requestAnimationFrame(animarPct);
  try {
    const { Mundo } = await import('./escena.js');
    progreso = PASOS.modulos;
    linea('Módulos 3D · three.js r169');
    mundo = new Mundo($('#mundo'), { nivel, reducido, proyectos: casos });
    await mundo.preparar((paso, detalle) => {
      progreso = PASOS[paso] ?? progreso;
      linea(`${NOMBRES[paso] || paso} · ${detalle}`);
    });
    mundo.alCruzarPortal = () => sonido.portal();
    mundo.alCruzarDimension = (k) => sonido.dimension(k);
    mundo.alCambiarDimension = mostrarDimension;
    raiz.classList.add('con-3d', 'antes-portal');
  } catch (e) {
    console.error(e);
    mundo = null;
    raiz.classList.add('sin-webgl');
    linea('Modo ligero · el 3D no está disponible en este equipo', 'warn');
  }
  const seguro = location.protocol === 'https:';
  linea(seguro ? 'Canal seguro · TLS activo' : 'Canal local · entorno de desarrollo', seguro ? 'ok' : 'info');
  progreso = 1;
  // Sin 3D, el ecosistema muestra la primera empresa y se navega con la barra de triángulos.
  if (!mundo) mostrarDimension(0);
  medir();
  linea('Listo. Elige cómo entrar.', 'cmd');
  // ?depurar: expone el mundo en la consola y entra directo (solo para pruebas).
  if (new URLSearchParams(location.search).has('depurar')) {
    window.haxelera = {
      mundo, medir, posicion,
      ir(id) { irA(tramos.find(x => x.id === id), 0.5); },
      irDim(k) { irDimension(k); },
      abrirPerfil(k) { abrirPerfil(k); },
      cerrarPerfil() { perfil.cerrar(); },
      perfil: () => perfil,
      irCaso(k) { irCaso(k); },
      abrirTrabajo(k, j) { abrirTrabajo(k, j); },
      abrirExperiencia(k) { abrirExperiencia(k); },
      agente: () => agente,
      cerrarTrabajo() { minisitio.cerrar(); },
    };
    entrar(false);
    return;
  }
  setTimeout(() => {
    cg.entrar.hidden = false;
    cg.entrar.querySelector('button').focus({ preventScroll: true });
  }, 350);
}

$$('.cg-entrar button').forEach(b => b.addEventListener('click', () => entrar(b.dataset.sonido === '1')));

function entrar(conSonido) {
  if (entrado) return;
  entrado = true;
  if (conSonido) { try { sonido.encender(); } catch (e) { console.warn('Sonido no disponible', e); } }
  actualizarSonidoUI();
  const cargador = $('#cargador');
  cargador.classList.add('saliendo');
  document.body.classList.remove('cargando');
  raiz.classList.add('listo');
  mundo?.entrar();
  ultimo = performance.now();
  requestAnimationFrame(cuadro);
  setTimeout(() => { cargador.hidden = true; cargando = false; }, 1200);
  medir();
  if (hashInicial && hashInicial !== '#inicio') {
    setTimeout(() => $(hashInicial)?.scrollIntoView({ behavior: reducido ? 'auto' : 'smooth' }), 900);
  }
}

// ------------------------------------------------------------------ scroll → profundidad
function ventanaFija(t, vh) {
  t.pA = clamp(vh / 2 / t.h, 0, 0.5);
  t.pB = clamp(1 - vh / 2 / t.h, 0.5, 1);
}

// Al cambiar el ancho (girar el celular, redimensionar la ventana) el recorrido cambia de largo:
// se guarda el punto del viaje y se vuelve a él para que la cámara no salte a otra dimensión.
// Los cambios pequeños de alto (la barra del navegador del celular) no cuentan.
let ancla = null, anclaPrevia = null, anchoMedido = window.innerWidth, altoMedido = window.innerHeight;
function medir() {
  const previa = anclaPrevia;
  anclaPrevia = null;
  const reanclar = previa && tramos.length && (window.innerWidth !== anchoMedido || Math.abs(window.innerHeight - altoMedido) > 150);
  anchoMedido = window.innerWidth;
  altoMedido = window.innerHeight;
  const y = window.scrollY;
  const vh = window.innerHeight;
  tramos = RUTA.map(t => {
    const el = document.getElementById(t.id);
    const r = el.getBoundingClientRect();
    return { ...t, el, top: r.top + y, h: Math.max(r.height, 1) };
  });
  if (mundo) tramos[0].z0 = 2 * mundo.zHero - tramos[0].z1;
  for (const t of tramos) {
    if (t.curva === 'pausa' || t.curva === 'fijada' || t.id === 'proceso') ventanaFija(t, vh);
    if (t.curva === 'fijada') t.e = (t.entrada || 6) / Math.abs(t.z0 - t.z1);
  }
  // Proceso: los cinco pasos se reparten mientras su contenedor está fijo en pantalla.
  const pr = tramos.find(t => t.id === 'proceso');
  mundo?.colocarPuertas([0, 1, 2, 3, 4].map(k => lerp(pr.z0, pr.z1, lerp(pr.pA, pr.pB, (k + 0.62) / 5))));
  if (reanclar) irA(tramos[previa.i], previa.p);
}

function posicion() {
  const c = window.scrollY + window.innerHeight / 2;
  let i = 0;
  for (let k = 0; k < tramos.length; k++) if (c >= tramos[k].top) i = k;
  const t = tramos[i];
  const p = clamp((c - t.top) / t.h, 0, 1);
  return { z: lerp(t.z0, t.z1, CURVAS[t.curva](p, t)), i, p };
}

function irA(t, p, suave = false, moverCamara = true) {
  if (!t) return;
  window.scrollTo({ top: t.top + p * t.h - window.innerHeight / 2, behavior: suave && !reducido ? 'smooth' : 'instant' });
  if (!suave && moverCamara && mundo) { const { z } = posicion(); mundo.zObjetivo = mundo.camZ = z; }
}

let medirPendiente = 0;
function pedirMedida() {
  cancelAnimationFrame(medirPendiente);
  medirPendiente = requestAnimationFrame(medir);
}
window.addEventListener('resize', () => { anclaPrevia ??= ancla; mundo?.redimensionar(); pedirMedida(); requestAnimationFrame(pintarDegradados); });
new ResizeObserver(pedirMedida).observe($('main'));
document.fonts?.ready.then(() => { pedirMedida(); pintarDegradados(); });

// ------------------------------------------------------------------ letras que aparecen
// Si una palabra no cabe en el panel, el nombre se achica hasta caber.
function ajustarNombre(el) {
  el.style.fontSize = '';
  const libre = el.clientWidth;
  if (el.scrollWidth > libre + 1) el.style.fontSize = `${(parseFloat(getComputedStyle(el).fontSize) * libre / el.scrollWidth) * 0.97}px`;
}
function pintarDegradados() {
  $$('.pt-iris').forEach(l => degradarLetras(l, '.pt-letra'));
  ajustarNombre($('.eco-nombre'));
  degradarLetras($('.eco-nombre'), '.el', !reducido);
}

const total = partirLetras($$('.pt-linea'), 'pt-letra');
(() => {
  const p = $('.pt-texto');
  const palabras = p.textContent.trim().split(/\s+/);
  p.innerHTML = palabras.map((w, i) => `<span class="pt-palabra" style="--k:${i}">${esc(w)}</span>`).join(' ');
  void total;
})();

// ------------------------------------------------------------------ glifos tipo Active Theory
const SIMBOLOS = '◇◆△▲▽=⌃⌄<>[]{}≡∧∨/\\';
function glifar(el, final) {
  let n = 0;
  const base = final || el.textContent;
  const id = setInterval(() => {
    n++;
    if (n > 9) { clearInterval(id); el.textContent = base; return; }
    el.textContent = [...base].map(c => (c === '[' || c === ']' || Math.random() < n / 10) ? c : SIMBOLOS[(Math.random() * SIMBOLOS.length) | 0]).join('');
  }, 70);
}
const PATRONES = ['[=◇⌃◇=]', '[-◆∧◆-]', '[=△◇△=]', '[≡◆≡◆≡]', '[<◇=◇>]', '[=▽◆▽=]', '[◇⌄◇⌄◇]', '[=◆=◆=]', '[△=◇=△]'];

// ------------------------------------------------------------------ ecosistema
// En el recorrido, cada empresa es un portal triangular con su nombre en el centro. Al entrar se abre su perfil.
const eco = {
  escena: $('.eco-escena'), portal: $('.eco-portal'), num: $('.eco-num span'), nombre: $('.eco-nombre'), area: $('.eco-area'),
  glifo: $('.eco-num .glifos'), entrar: $('.eco-entrar'), entrarT: $('.eco-entrar span'), botones: $$('.eco-ir'),
};
let dimMostrada = -2, r0Escena = 0;
function mostrarDimension(k) {
  if (k === dimMostrada) return;
  dimMostrada = k;
  eco.botones.forEach((b, i) => b.setAttribute('aria-current', i === k ? 'true' : 'false'));
  eco.nombre.classList.remove('dentro');
  eco.escena.classList.toggle('vacia', k < 0);
  if (k < 0) return;
  const e = EMPRESAS[k];
  eco.escena.style.setProperty('--c1', e.colores[0]);
  eco.escena.style.setProperty('--c2', e.colores[1]);
  $('.eco-lista').style.setProperty('--c1', e.colores[0]);
  eco.num.textContent = String(k + 1).padStart(2, '0');
  eco.nombre.textContent = e.nombre;
  eco.nombre.classList.toggle('dos', /\s/.test(e.nombre));
  partirLetras([eco.nombre], 'el', 0, !reducido);
  ajustarNombre(eco.nombre);
  degradarLetras(eco.nombre, '.el', !reducido);
  void eco.nombre.offsetWidth;
  eco.nombre.classList.add('dentro');
  eco.area.textContent = e.area || '';
  delete eco.area.dataset.revuelto;
  revolver(eco.area, reducido);
  eco.entrarT.textContent = `Entrar a ${e.nombre}`;
  eco.portal.setAttribute('aria-label', `Entrar a ${e.nombre}: ${e.area}`);
  glifar(eco.glifo, PATRONES[k % PATRONES.length]);
}
// El nombre va pegado al triángulo 3D: misma posición, misma escala; al cruzarlo, crece y se desvanece.
function actualizarEscena() {
  const E = mundo?.ecosistema;
  if (!E || dimMostrada < 0 || perfil.abierto) { eco.escena.style.opacity = '0'; eco.escena.classList.remove('activa'); return; }
  const pr = E.proyectar(dimMostrada, mundo.camara, mundo.ancho, mundo.alto, mundo.fovBase);
  if (!pr) return;
  if (Math.abs(pr.r0 - r0Escena) > 0.5) {
    r0Escena = pr.r0;
    eco.escena.style.setProperty('--r0', `${pr.r0.toFixed(1)}px`);
    requestAnimationFrame(() => { ajustarNombre(eco.nombre); degradarLetras(eco.nombre, '.el', !reducido); });
  }
  eco.escena.style.transform = `translate3d(${pr.x.toFixed(1)}px, ${pr.y.toFixed(1)}px, 0) scale(${pr.s.toFixed(4)})`;
  eco.escena.style.opacity = pr.a.toFixed(3);
  eco.escena.classList.toggle('activa', pr.a > 0.6 && pr.s < 1.6);
}
function encima(si) {
  eco.escena.classList.toggle('encima', si);
  if (mundo?.ecosistema) mundo.ecosistema.encima = si ? dimMostrada : -1;
}
for (const b of [eco.portal, eco.entrar]) {
  b.addEventListener('pointerenter', () => encima(true));
  b.addEventListener('pointerleave', () => encima(false));
  b.addEventListener('focus', () => encima(true));
  b.addEventListener('blur', () => encima(false));
  b.addEventListener('click', () => { if (dimMostrada >= 0) abrirPerfil(dimMostrada); });
}

// Minipáginas de los trabajos: se abren desde el perfil (la lista o la tarjeta de la columna).
const minisitio = new Minisitio({
  sonido,
  alAbrir: () => mundo?.saltoDimensional(),
  alCerrar: (alContacto) => { if (alContacto) irAContacto(); },
});
// Experiencias en vivo. La de Nexora abre a Alyxia, la asistente; las demás se abren en el pasadizo.
minisitio.alVoto = (k) => mundo?.ecosistema?.pulso(k);
function abrirExperiencia(k) {
  const e = EMPRESAS[k];
  if (!e?.experiencia) return;
  if (e.experiencia.id === 'agente') { agente.abrir(); return; }
  const montar = EXPERIENCIAS[e.experiencia.id];
  if (montar) minisitio.abrirExperiencia(e, k, montar, e.experiencia.etiqueta);
}
function abrirTrabajo(k, j) {
  const e = EMPRESAS[k];
  if (!e?.trabajos?.[j]) return;
  minisitio.abrir(e, k, e.trabajos[j], j);
}

// Perfil de cada empresa: la cámara cruza el triángulo y adentro sube su columna vertebral.
const perfil = new Perfil({
  empresas: EMPRESAS, reducido, fino,
  alAbrir: (k) => { encima(false); mundo?.ecosistema?.entrar(k); mundo?.saltoDimensional(); sonido.portal(); },
  // Al pasar a otra empresa, el recorrido de fondo también se mueve a su portal (sin mover la cámara: vuela sola).
  alCambiar: (k) => { mundo?.saltoDimensional(); sonido.portal(); irDimension(k, false, false); },
  alCerrar: () => { sonido.tic(); },
  abrirTrabajo, abrirExperiencia,
  alContacto: () => irAContacto(),
});
function abrirPerfil(k) {
  if (perfil.abierto || minisitio.abierto) return;
  perfil.abrir(k);
}
function irAContacto() {
  if (perfil.abierto) perfil.cerrar(true);
  $('#contacto').scrollIntoView({ behavior: reducido ? 'auto' : 'smooth' });
}

// Alyxia puede llevar la cámara a cualquier parte: una sección o el portal de una empresa.
const agente = new Agente({
  sonido,
  irA: (destino) => {
    if (minisitio.abierto) minisitio.cerrar();
    if (perfil.abierto) perfil.cerrar(true);
    const m = /^dimension-(\d+)$/.exec(destino);
    if (m) { irDimension(Number(m[1])); return; }
    if (destino === 'inicio') { window.scrollTo({ top: 0, behavior: reducido ? 'auto' : 'smooth' }); return; }
    const t = tramos.find(x => x.id === destino);
    if (t) irA(t, t.curva === 'pausa' || t.curva === 'fijada' ? t.pA + 0.02 : 0.5, true);
  },
});

// Lleva el scroll a la parada frente al portal de la empresa k.
function irDimension(k, suave = entrado, moverCamara = true) {
  const t = tramos.find(x => x.id === 'ecosistema');
  if (!t) return;
  if (!mundo) { mostrarDimension(k); return; }
  const n = Math.max(1, (t.pasos || EMPRESAS.length) - 1);
  irA(t, t.pA + (k / n) * (t.pB - t.pA), suave, moverCamara);
}
eco.botones.forEach(b => b.addEventListener('click', () => irDimension(+b.dataset.dim)));

// ------------------------------------------------------------------ proyectos: carrusel y vista de caso
const listaCasos = $$('.caso');
const detalle = { num: $('.cd-num span'), titulo: $('.cd-titulo'), texto: $('.cd-texto'), tec: $('.cd-tec'), glifo: $('.cd-glifo') };
let casoActivo = -1;
function mostrarCaso(i) {
  if (i === casoActivo) return;
  casoActivo = i;
  listaCasos.forEach((a, k) => a.classList.toggle('activo', k === i));
  const c = casos[i];
  detalle.num.textContent = String(i + 1).padStart(2, '0');
  detalle.titulo.textContent = c.titulo;
  delete detalle.titulo.dataset.revuelto;
  revolver(detalle.titulo, reducido);
  detalle.texto.textContent = c.texto;
  detalle.tec.textContent = c.tec;
  glifar(detalle.glifo, PATRONES[i % PATRONES.length]);
}
mostrarCaso(0);
function irCaso(i) {
  const t = tramos.find(x => x.id === 'proyectos');
  if (!t) return;
  irA(t, t.pA + (i / Math.max(1, casos.length - 1)) * (t.pB - t.pA), entrado);
}
$$('.caso-ir').forEach((b, i) => b.addEventListener('click', () => { if (raiz.classList.contains('con-3d')) irCaso(i); }));

const vista = $('.caso-vista');
let vistaAbierta = false, focoPrevio = null;
function abrirCaso(i) {
  if (!mundo?.carrusel || vistaAbierta) return;
  const c = casos[i];
  const r = mundo.carrusel.rectPantalla(i, mundo.camara, window.innerWidth, window.innerHeight);
  const W = window.innerWidth, H = window.innerHeight;
  vista.style.setProperty('--ct', `${(r.t / H * 100).toFixed(2)}%`);
  vista.style.setProperty('--cb', `${((H - r.b) / H * 100).toFixed(2)}%`);
  vista.style.setProperty('--cl', `${(r.l / W * 100).toFixed(2)}%`);
  vista.style.setProperty('--cr', `${((W - r.r) / W * 100).toFixed(2)}%`);
  $('.cv-fondo', vista).style.backgroundImage = `url(${mundo.carrusel.imagen(i)})`;
  $('.cv-meta', vista).textContent = `${String(i + 1).padStart(2, '0')} / ${String(casos.length).padStart(2, '0')} · Proyecto`;
  $('.cv-titulo', vista).textContent = c.titulo;
  $('.cv-texto', vista).textContent = c.texto;
  $('.cv-tec', vista).textContent = c.tec;
  focoPrevio = document.activeElement;
  vista.hidden = false;
  vistaAbierta = true;
  requestAnimationFrame(() => requestAnimationFrame(() => vista.classList.add('abierta')));
  setTimeout(() => $('.cv-cerrar', vista).focus({ preventScroll: true }), 300);
  sonido.tic();
}
function cerrarCaso() {
  if (!vistaAbierta) return;
  vistaAbierta = false;
  vista.classList.remove('abierta');
  setTimeout(() => { if (!vistaAbierta) vista.hidden = true; }, 900);
  focoPrevio?.focus?.({ preventScroll: true });
}
$('.cv-cerrar', vista).addEventListener('click', cerrarCaso);
$('.cd-abrir').addEventListener('click', () => abrirCaso(Math.max(0, casoActivo)));
vista.addEventListener('wheel', (e) => { e.preventDefault(); cerrarCaso(); }, { passive: false });
vista.addEventListener('touchmove', (e) => { e.preventDefault(); cerrarCaso(); }, { passive: false });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarCaso(); });
window.addEventListener('click', (e) => {
  if (minisitio.abierto || e.target.closest('a, button, input, .mp, .agente')) return;
  // Tarjetas de la columna, dentro del perfil.
  const ecoHover = mundo?.ecosistema?.hover ?? -1;
  if (perfil.abierto) { if (ecoHover >= 0) abrirTrabajo(perfil.k, ecoHover); return; }
  if (!mundo?.carrusel || vistaAbierta) return;
  const i = mundo.carrusel.hover;
  if (i >= 0) { if (i === casoActivo) abrirCaso(i); else irCaso(i); }
});

// ------------------------------------------------------------------ interfaz general
const riel = $('.riel ol');
RUTA.forEach(t => {
  const li = document.createElement('li');
  li.innerHTML = `<a href="#${t.id}" aria-label="${esc(t.etiqueta)}"><span class="mono">${esc(t.etiqueta)}</span><i></i></a>`;
  riel.append(li);
});
const enlacesRiel = $$('.riel a');
const enlacesNav = $$('.nav-enlaces a, .menu-movil a');
const hud = { z: $('[data-hud="z"]'), v: $('[data-hud="v"]'), s: $('[data-hud="s"]') };
const pasos = $$('.pasos li');
const barraProceso = $('.proceso-barra i');
let seccionActual = -1, pasoActual = -1;

function cambiarSeccion(i) {
  seccionActual = i;
  const id = tramos[i].id;
  enlacesRiel.forEach((a, k) => a.setAttribute('aria-current', k === i ? 'true' : 'false'));
  raiz.classList.toggle('al-final', id === 'contacto' || id === 'ecosistema');
  const grupo = RUTA[i].objeto ? 'servicios' : id;
  enlacesNav.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + grupo ? 'true' : 'false'));
}

function actualizarProceso(p) {
  const t = tramos.find(x => x.id === 'proceso');
  const k = clamp((p - t.pA) / (t.pB - t.pA), 0, 0.9999);
  const paso = Math.floor(k * pasos.length);
  if (paso !== pasoActual) {
    pasoActual = paso;
    pasos.forEach((li, j) => { li.classList.toggle('activo', j === paso); li.classList.toggle('hecho', j < paso); });
  }
  barraProceso.style.transform = `scaleX(${k.toFixed(4)})`;
}

function actualizarProyectos(p) {
  const t = tramos.find(x => x.id === 'proyectos');
  const k = clamp((p - t.pA) / (t.pB - t.pA), 0, 1);
  mundo?.carrusel?.irA(k);
  mostrarCaso(Math.round(k * (casos.length - 1)));
}

function actualizarHud() {
  const z = mundo ? mundo.camZ : 0;
  const v = mundo ? Math.abs(mundo.vel) : 0;
  hud.z.textContent = `Z ${z >= 0 ? '+' : '−'}${Math.abs(z).toFixed(2).padStart(6, '0')}`;
  hud.v.textContent = `V ${v.toFixed(1).padStart(4, '0')}`;
  hud.s.textContent = `${String(seccionActual + 1).padStart(2, '0')} / ${String(RUTA.length).padStart(2, '0')} · ${RUTA[seccionActual]?.etiqueta ?? ''}`;
}

// Glifos en las tarjetas de servicios: se descifran al aparecer y de vez en cuando cambian.
$$('.tarjeta .ojo').forEach((o, i) => { const g = document.createElement('i'); g.className = 'glifos'; g.setAttribute('aria-hidden', 'true'); g.textContent = PATRONES[i % PATRONES.length]; o.append(g); });
setInterval(() => {
  const visibles = $$('.dentro .glifos');
  if (visibles.length) { const g = visibles[(Math.random() * visibles.length) | 0]; glifar(g, PATRONES[(Math.random() * PATRONES.length) | 0]); }
}, 2600);

// ------------------------------------------------------------------ cursor, imanes y tarjetas
const cursor = $('.cursor');
let cx = -100, cy = -100, tx = -100, ty = -100, sobreActual = null, sobre3D = false;
window.addEventListener('pointermove', (e) => {
  tx = e.clientX; ty = e.clientY;
  if (mundo) {
    mundo.puntero.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    mundo.punteroActivo = e.pointerType === 'mouse';
  }
  if (e.pointerType === 'mouse') raiz.classList.add('cursor-activo');
}, { passive: true });
document.addEventListener('pointerout', (e) => { if (!e.relatedTarget) raiz.classList.remove('cursor-activo'); });
document.addEventListener('pointerover', (e) => {
  const s = e.target.closest('a, button');
  if (s && s !== sobreActual) sonido.tic();
  sobreActual = s;
});
function moverCursor(dt) {
  if (!fino) return;
  const k = 1 - Math.exp(-dt * 22);
  cx += (tx - cx) * k;
  cy += (ty - cy) * k;
  cursor.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0)`;
  const hover3D = (mundo?.carrusel?.hover ?? -1) >= 0 || (mundo?.ecosistema?.hover ?? -1) >= 0;
  if (hover3D && !sobre3D) sonido.tic();
  sobre3D = hover3D;
  cursor.classList.toggle('sobre', !!sobreActual || hover3D);
}

if (fino) {
  $$('.magnetico').forEach(b => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      b.style.translate = `${((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1)}px ${((e.clientY - r.top - r.height / 2) * 0.32).toFixed(1)}px`;
    });
    b.addEventListener('pointerleave', () => { b.style.translate = ''; });
  });
  listaCasos.forEach(c => {
    c.addEventListener('pointermove', (e) => {
      if (raiz.classList.contains('con-3d')) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
      c.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
      c.style.setProperty('--rx', `${((0.5 - y) * 7).toFixed(2)}deg`);
      c.style.setProperty('--ry', `${((x - 0.5) * 9).toFixed(2)}deg`);
    });
    c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
  });
}

// ------------------------------------------------------------------ menú móvil
const btnMenu = $('.nav-menu');
const menu = $('#menu-movil');
function alternarMenu(abrir) {
  btnMenu.setAttribute('aria-expanded', String(abrir));
  if (abrir) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add('abierto'));
  } else {
    menu.classList.remove('abierto');
    setTimeout(() => { if (btnMenu.getAttribute('aria-expanded') !== 'true') menu.hidden = true; }, 350);
  }
}
btnMenu.addEventListener('click', () => alternarMenu(btnMenu.getAttribute('aria-expanded') !== 'true'));
menu.addEventListener('click', (e) => { if (e.target.closest('a')) alternarMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && btnMenu.getAttribute('aria-expanded') === 'true') { alternarMenu(false); btnMenu.focus(); } });

// ------------------------------------------------------------------ sonido y reproductor
const btnSonido = $('.nav-sonido');
const pistaUI = $('.rp-pista');
function actualizarSonidoUI() {
  btnSonido.setAttribute('aria-pressed', String(sonido.activo));
  btnSonido.setAttribute('aria-label', sonido.activo ? 'Silenciar sonido' : 'Activar sonido');
  pistaUI.textContent = `${sonido.nombrePista()} — Haxelera`;
}
btnSonido.addEventListener('click', () => { if (sonido.activo) sonido.apagar(); else sonido.encender(); actualizarSonidoUI(); });
$('.rp-ant').addEventListener('click', () => { sonido.cambiarPista(-1); if (!sonido.activo) sonido.encender(); actualizarSonidoUI(); });
$('.rp-sig').addEventListener('click', () => { sonido.cambiarPista(1); if (!sonido.activo) sonido.encender(); actualizarSonidoUI(); });
document.addEventListener('visibilitychange', () => sonido.pausar(document.hidden));

// ------------------------------------------------------------------ contacto
const aviso = $('.aviso');
let avisoTiempo = 0;
function avisar(texto) {
  aviso.textContent = texto;
  aviso.classList.add('visible');
  clearTimeout(avisoTiempo);
  avisoTiempo = setTimeout(() => aviso.classList.remove('visible'), 3200);
}
const btnCorreo = $('[data-contacto="correo"]');
const btnWhatsapp = $('[data-contacto="whatsapp"]');
if (CONFIG.correo) btnCorreo.href = `mailto:${CONFIG.correo}?subject=${encodeURIComponent('Proyecto con Haxelera Group')}`;
else btnCorreo.addEventListener('click', (e) => { e.preventDefault(); avisar('Falta configurar el correo en js/config.js'); });
if (CONFIG.whatsapp) {
  btnWhatsapp.href = `https://wa.me/${CONFIG.whatsapp.replace(/\D/g, '')}`;
  btnWhatsapp.target = '_blank';
  btnWhatsapp.rel = 'noopener';
} else btnWhatsapp.addEventListener('click', (e) => { e.preventDefault(); avisar('Falta configurar el WhatsApp en js/config.js'); });
$('[data-anio]').textContent = String(new Date().getFullYear());

// ------------------------------------------------------------------ bucle
const destello = $('.destello');
let ultimo = 0, contador = 0;
function cuadro(ahora) {
  requestAnimationFrame(cuadro);
  const dt = Math.min(Math.max((ahora - ultimo) / 1000, 0), 0.05);
  ultimo = ahora;
  if (!tramos.length) return;
  const { z, i, p } = posicion();
  ancla = { i, p };
  if (mundo) {
    // Dentro de un perfil, la cámara va al otro lado del portal de esa empresa; el scroll de la página no la mueve.
    perfil.cuadro();
    const E = mundo.ecosistema;
    mundo.zObjetivo = perfil.abierto && E ? E.zPerfil(perfil.k) : z;
    mundo.perfil = perfil.abierto && E ? { k: perfil.k, c: perfil.c } : null;
    mundo.cuadro(dt);
    if (mundo.destello !== undefined) destello.style.opacity = mundo.destello.toFixed(3);
    // Antes de cruzar el triángulo solo se ve el logo; al cruzarlo aparece el mensaje.
    const cz = mundo.camZ;
    raiz.classList.toggle('antes-portal', cz > -0.3);
    raiz.classList.toggle('portal-visible', cz <= -0.3 && cz > -36);
    if (E) { if (perfil.abierto) perfil.marcar(E.trabajoActivo); actualizarEscena(); }
  }
  if (i !== seccionActual) cambiarSeccion(i);
  const id = tramos[i].id;
  if (id === 'proceso') actualizarProceso(p);
  if (id === 'proyectos') actualizarProyectos(p);
  if (++contador % 5 === 0) actualizarHud();
  sonido.actualizar(mundo ? mundo.vel : 0, clamp((mundo ? -mundo.camZ : 0) / 640, 0, 1));
  moverCursor(dt);
}

prepararRevelados(reducido);
cargar();
