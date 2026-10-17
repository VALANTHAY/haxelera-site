// Perfil de cada empresa del grupo. Se entra cruzando su portal triangular y adentro está todo:
// portada, quiénes somos, pilares, trabajos (con su columna vertebral en 3D, que gira con el scroll)
// y su experiencia en vivo. La escena 3D sigue detrás: el fondo es el mundo de esa empresa.
import { partirLetras, degradarLetras } from './texto.js';

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dos = (n) => String(n).padStart(2, '0');

export class Perfil {
  constructor(op) {
    Object.assign(this, op);
    this.abierto = false;
    this.k = -1;
    this.c = -2.4;
    this.activo = -1;
    this.construir();
  }

  construir() {
    const r = this.raiz = document.createElement('div');
    r.className = 'perfil';
    r.hidden = true;
    r.setAttribute('role', 'dialog');
    r.setAttribute('aria-modal', 'true');
    r.setAttribute('aria-labelledby', 'pf-nombre');
    r.innerHTML = `
      <header class="pf-barra mono">
        <button type="button" class="pf-volver">&lt;- Ecosistema</button>
        <span class="pf-ruta"></span>
        <span class="pf-navegar">
          <button type="button" class="pf-ant" aria-label="Empresa anterior">&lt;</button>
          <span class="pf-cuenta"></span>
          <button type="button" class="pf-sig" aria-label="Empresa siguiente">&gt;</button>
        </span>
      </header>
      <div class="pf-scroll"><div class="pf-contenido"></div></div>`;
    document.body.append(r);
    const $ = (s) => r.querySelector(s);
    this.el = { volver: $('.pf-volver'), ruta: $('.pf-ruta'), cuenta: $('.pf-cuenta'), scroll: $('.pf-scroll'), contenido: $('.pf-contenido') };
    this.el.volver.addEventListener('click', () => this.cerrar());
    $('.pf-ant').addEventListener('click', () => this.ir(this.k - 1));
    $('.pf-sig').addEventListener('click', () => this.ir(this.k + 1));
    this.el.contenido.addEventListener('click', (ev) => {
      const b = ev.target.closest('button');
      if (!b) return;
      if (b.classList.contains('pf-trab')) this.abrirTrabajo?.(this.k, Number(b.dataset.j));
      else if (b.classList.contains('pf-exp')) this.abrirExperiencia?.(this.k);
      else if (b.classList.contains('pf-siguiente')) this.ir(this.k + 1);
      else if (b.classList.contains('pf-cerrar')) this.cerrar();
      else if (b.classList.contains('pf-hablar')) this.alContacto?.();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !this.abierto || e.defaultPrevented) return;
      e.preventDefault();
      this.cerrar();
    });
    // Los bloques aparecen al entrar en pantalla, dentro del propio perfil.
    this.io = new IntersectionObserver((entradas) => {
      for (const en of entradas) if (en.isIntersecting) { en.target.classList.add('visto'); this.io.unobserve(en.target); }
    }, { root: this.el.scroll, threshold: 0.18 });
    // Pilares que se inclinan hacia el puntero (solo con mouse).
    if (this.fino) {
      this.el.contenido.addEventListener('pointermove', (ev) => {
        const c = ev.target.closest('.pf-pilar');
        if (!c) return;
        const b = c.getBoundingClientRect();
        const x = (ev.clientX - b.left) / b.width, y = (ev.clientY - b.top) / b.height;
        c.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
        c.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
        c.style.setProperty('--rx', `${((0.5 - y) * 8).toFixed(2)}deg`);
        c.style.setProperty('--ry', `${((x - 0.5) * 10).toFixed(2)}deg`);
      });
      this.el.contenido.addEventListener('pointerout', (ev) => {
        const c = ev.target.closest('.pf-pilar');
        if (c && !c.contains(ev.relatedTarget)) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); }
      });
    }
  }

  pintar(k) {
    const e = this.empresas[k], N = this.empresas.length;
    const sig = this.empresas[(k + 1) % N];
    const r = this.raiz;
    r.style.setProperty('--c1', e.colores[0]);
    r.style.setProperty('--c2', e.colores[1]);
    this.el.ruta.textContent = `${e.nombre} / Perfil`;
    this.el.cuenta.textContent = `${dos(k + 1)} / ${dos(N)}`;
    const vivo = e.experiencia ? `
      <section class="pf-bloque pf-vivo pf-revelar">
        <p class="mono pf-et">04 · En vivo</p>
        <h3 class="pf-h">${esc(e.experiencia.etiqueta)}</h3>
        <p class="pf-p">${esc(TEXTO_VIVO[e.experiencia.id] || 'Una experiencia real, funcionando ahora mismo.')}</p>
        <button type="button" class="boton boton-claro pf-exp"><i aria-hidden="true"></i>${esc(e.experiencia.etiqueta)} -&gt;</button>
      </section>` : '';
    this.el.contenido.innerHTML = `
      <section class="pf-portada">
        <p class="mono pf-num">${dos(k + 1)} / ${dos(N)} · Dimensión <i aria-hidden="true">▲</i></p>
        <h2 id="pf-nombre" class="pf-nombre">${esc(e.nombre)}</h2>
        <p class="mono pf-area">${esc(e.area)}</p>
        <p class="pf-lema">${esc(e.lema)}</p>
        <p class="mono pf-bajar" aria-hidden="true"><i></i>Baja para recorrer su columna</p>
      </section>
      <section class="pf-bloque pf-quienes pf-revelar">
        <p class="mono pf-et">01 · Quiénes somos</p>
        <p class="pf-texto">${esc(e.texto)}</p>
      </section>
      <section class="pf-bloque pf-revelar">
        <p class="mono pf-et">02 · Pilares</p>
        <ol class="pf-pilares">${(e.pilares || []).map((p, i) => `
          <li class="pf-pilar" style="--i:${i}"><span class="mono">${dos(i + 1)}</span><h3>${esc(p.titulo)}</h3><p>${esc(p.texto)}</p></li>`).join('')}
        </ol>
      </section>
      <section class="pf-bloque pf-trabajos-b">
        <p class="mono pf-et pf-revelar">03 · Trabajos <span>· cada uno abre una mini página viva</span></p>
        <ol class="pf-trabajos">${e.trabajos.map((t, j) => `
          <li class="pf-revelar"><button type="button" class="pf-trab" data-j="${j}">
            <span class="mono pf-trab-num">${dos(k + 1)}.${j + 1}</span>
            <span class="pf-trab-titulo">${esc(t.titulo)}</span>
            <span class="pf-trab-texto">${esc(t.resumen)}</span>
            <span class="pf-chips mono">${(t.incluye || []).slice(0, 3).map(x => `<span>${esc(x)}</span>`).join('')}</span>
            <span class="mono pf-abrir">Abrir mini página -&gt;</span>
          </button></li>`).join('')}
        </ol>
      </section>
      ${vivo}
      <section class="pf-cierre pf-revelar">
        <button type="button" class="pf-siguiente" style="--s1:${sig.colores[0]};--s2:${sig.colores[1]}">
          <span class="pf-sig-tri" aria-hidden="true"></span>
          <span class="pf-sig-txt">
            <span class="mono">${dos(((k + 1) % N) + 1)} / ${dos(N)} · Siguiente dimensión</span>
            <b>${esc(sig.nombre)}</b>
            <span class="mono">${esc(sig.lema)} -&gt;</span>
          </span>
        </button>
        <div class="pf-acciones">
          <button type="button" class="boton boton-fantasma pf-cerrar">&lt;- Volver al ecosistema</button>
          <button type="button" class="boton boton-claro pf-hablar">Hablar con el equipo</button>
        </div>
      </section>`;
    const nombre = this.el.contenido.querySelector('.pf-nombre');
    nombre.classList.toggle('dos', /\s/.test(e.nombre));
    partirLetras([nombre], 'pl', 0, !this.reducido);
    this.filas = [...this.el.contenido.querySelectorAll('.pf-trab')];
    this.activo = -1;
    this.el.scroll.scrollTop = 0;
    this.el.contenido.querySelectorAll('.pf-revelar').forEach(b => this.io.observe(b));
    requestAnimationFrame(() => degradarLetras(nombre, '.pl', !this.reducido));
  }

  abrir(k) {
    if (this.abierto) return;
    this.abierto = true;
    this.k = k;
    this.c = -2.4;
    this.foco = document.activeElement;
    this.pintar(k);
    document.body.classList.add('pf-abierto');
    this.raiz.hidden = false;
    this.raiz.classList.remove('listo', 'saliendo');
    this.alAbrir?.(k);
    clearTimeout(this.tEntrada);
    // El contenido aparece cuando la cámara ya cruzó el triángulo.
    this.tEntrada = setTimeout(() => {
      if (!this.abierto) return;
      this.raiz.classList.add('listo');
      this.el.volver.focus({ preventScroll: true });
    }, this.reducido ? 60 : 680);
  }

  // Pasa a otra empresa sin salir: la cámara vuela por el ecosistema hasta su mundo.
  ir(k) {
    const N = this.empresas.length;
    k = ((k % N) + N) % N;
    if (!this.abierto || k === this.k) return;
    this.raiz.classList.remove('listo');
    this.k = k;
    this.c = -2.4;
    this.alCambiar?.(k);
    clearTimeout(this.tEntrada);
    this.tEntrada = setTimeout(() => {
      if (!this.abierto) return;
      this.pintar(this.k);
      this.raiz.classList.add('listo');
    }, this.reducido ? 60 : 560);
  }

  cerrar(inmediato = false) {
    if (!this.abierto) return;
    this.abierto = false;
    clearTimeout(this.tEntrada);
    this.raiz.classList.remove('listo');
    this.raiz.classList.add('saliendo');
    this.alCerrar?.(this.k, inmediato);
    setTimeout(() => {
      if (this.abierto) return;
      this.raiz.hidden = true;
      this.raiz.classList.remove('saliendo');
      document.body.classList.remove('pf-abierto');
      if (!inmediato) this.foco?.focus?.({ preventScroll: true });
    }, inmediato ? 0 : 420);
  }

  // c: índice continuo de la tarjeta que debe quedar de frente en la columna, según qué fila de trabajos
  // está al centro de la pantalla. Antes de llegar a los trabajos, la columna ya va girando.
  cuadro() {
    if (!this.abierto || !this.filas?.length) return;
    const centro = window.innerHeight * 0.5;
    const ys = this.filas.map(f => { const b = f.getBoundingClientRect(); return b.top + b.height / 2; });
    const n = ys.length - 1;
    const paso = Math.max(1, (ys[n] - ys[0]) / Math.max(1, n));
    let c;
    if (centro <= ys[0]) c = (centro - ys[0]) / paso;
    else if (centro >= ys[n]) c = n + (centro - ys[n]) / paso;
    else { let i = 0; while (i < n - 1 && centro > ys[i + 1]) i++; c = i + (centro - ys[i]) / Math.max(1, ys[i + 1] - ys[i]); }
    this.c = Math.max(-2.4, Math.min(n + 0.6, c));
  }

  // Resalta la fila del trabajo cuya tarjeta está de frente.
  marcar(j) {
    if (j === this.activo || !this.filas) return;
    this.activo = j;
    this.filas.forEach((f, i) => f.classList.toggle('activo', i === j));
  }
}

const TEXTO_VIVO = {
  agente: 'Alyxia es la inteligencia artificial del grupo: habla por texto o por voz y te lleva a cualquier parte del sitio. Es una IA y lo dice.',
  estado: 'Lo que pasa ahora mismo con tu visita: latencia real, ruta, protocolo, tiempos de carga y el estado del servidor.',
  desafios: 'Tres pruebas rápidas: detecta un correo falso, mide la fuerza de una contraseña y cruza el laberinto Zero Trust.',
  encuesta: 'Una pregunta abierta y anónima. Los votos de todos llegan al instante, con su margen de error.',
};
