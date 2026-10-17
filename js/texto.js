// Revelado de textos al entrar en pantalla y efecto de «descifrado» en títulos.
const GLIFOS = '01<>/\\{}[]=+*#%&$?!ΛΣΔ';

// Cada letra queda en su sitio (transparente) y encima se dibuja un glifo al azar,
// así el ancho del renglón no cambia mientras se descifra.
export function revolver(el, reducido = false) {
  if (reducido || el.dataset.revuelto) return;
  el.dataset.revuelto = '1';
  const ficha = (el._ficha = (el._ficha || 0) + 1);
  const final = el.textContent;
  el.setAttribute('aria-label', final);
  el.textContent = '';
  const letras = [];
  for (const ch of final) {
    if (ch === ' ') { el.append(' '); continue; }
    const s = document.createElement('span');
    s.className = 'rv espera';
    s.textContent = ch;
    el.append(s);
    letras.push(s);
  }
  const n = letras.length || 1;
  const plan = letras.map((s, i) => ({ s, ini: (i / n) * 0.45 + Math.random() * 0.1, fin: 0.35 + (i / n) * 0.55 + Math.random() * 0.1, hecho: false }));
  const dur = 650 + n * 18;
  const t0 = performance.now();
  const paso = (ahora) => {
    if (el._ficha !== ficha) return;
    const k = Math.min((ahora - t0) / dur, 1);
    for (const p of plan) {
      if (p.hecho) continue;
      if (k >= p.fin) { p.s.className = 'rv'; p.hecho = true; }
      else if (k >= p.ini) { p.s.className = 'rv cifrado'; p.s.dataset.g = GLIFOS[(Math.random() * GLIFOS.length) | 0]; }
    }
    if (k < 1) requestAnimationFrame(paso);
    else { el.textContent = final; el.removeAttribute('aria-label'); }
  };
  requestAnimationFrame(paso);
}

function indexar(el) {
  el.querySelectorAll('.r').forEach((c, i) => c.style.setProperty('--i', i));
}

export function revelarAhora(elementos, reducido = false) {
  for (const el of elementos) {
    indexar(el);
    el.classList.add('dentro');
    el.querySelectorAll('[data-revolver]').forEach(t => revolver(t, reducido));
  }
}

export function prepararRevelados(reducido = false) {
  const io = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      revelarAhora([e.target], reducido);
      io.unobserve(e.target);
    }
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-revelar]').forEach(el => { indexar(el); io.observe(el); });
  document.querySelectorAll('[data-revelar-manual]').forEach(indexar);
}

// Cada letra va en su propio span para animarse sola, pero dentro de su palabra (que no se parte):
// así el navegador nunca corta una palabra entre letras. Con «disperso», cada letra arranca
// en un punto distinto del espacio y se arma en su lugar.
export function partirLetras(contenedores, clase, inicio = 0, disperso = false) {
  let k = inicio;
  for (const el of contenedores) {
    const palabras = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    palabras.forEach((p, i) => {
      if (i) el.append(' ');
      const w = document.createElement('span');
      w.className = 'palabra';
      for (const ch of p) {
        const s = document.createElement('span');
        s.className = clase;
        s.textContent = ch;
        s.style.setProperty('--k', k++);
        if (disperso) {
          const az = (a, b) => (a + Math.random() * (b - a)).toFixed(1);
          s.style.setProperty('--dx', `${az(-0.6, 0.6)}em`);
          s.style.setProperty('--dy', `${az(-0.5, 0.7)}em`);
          s.style.setProperty('--dz', `${az(-260, 160)}px`);
          s.style.setProperty('--rx', `${az(-90, 90)}deg`);
          s.style.setProperty('--ry', `${az(-60, 60)}deg`);
        }
        w.append(s);
      }
      el.append(w);
    });
  }
  return k;
}

// Un solo degradado (y un destello que lo recorre) cruza cada renglón de letras, aunque cada letra
// se anime sola. Se calcula por renglón: así un nombre que baja a dos líneas no pierde letras.
export function degradarLetras(contenedor, selector, conDestello = false) {
  const letras = [...contenedor.querySelectorAll(selector)];
  if (!letras.length) return;
  const renglones = new Map();
  for (const l of letras) { const y = l.offsetTop; if (!renglones.has(y)) renglones.set(y, []); renglones.get(y).push(l); }
  for (const fila of renglones.values()) {
    const x0 = fila[0].offsetLeft, ultima = fila[fila.length - 1];
    const ancho = Math.max(1, ultima.offsetLeft + ultima.offsetWidth - x0);
    fila.forEach(l => {
      const x = -(l.offsetLeft - x0);
      if (conDestello) {
        l.style.backgroundSize = `${ancho * 3}px 100%, ${ancho}px 100%`;
        l.style.backgroundPosition = `calc(${x}px + var(--barrido, -1.7) * ${ancho}px) 0, ${x}px 0`;
      } else {
        l.style.backgroundSize = `${ancho}px 100%`;
        l.style.backgroundPosition = `${x}px 0`;
      }
    });
  }
}
