// Alyxia: la asistente de IA del sitio. Se le habla por texto o por voz y puede llevar la cámara
// a cualquier parte del recorrido. Con servidor y clave usa un modelo de IA; si no, responde en modo local.
import { api } from './api.js';
import { responderLocal, SUGERENCIAS } from './conocimiento.js';

const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const Reconocimiento = window.SpeechRecognition || window.webkitSpeechRecognition;

export class Agente {
  constructor({ irA, sonido } = {}) {
    this.irA = irA;
    this.sonido = sonido;
    this.historial = [];
    this.abierto = false;
    this.hablarEnVoz = false;
    this.construir();
  }

  construir() {
    const pill = this.pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'agente-pill';
    pill.setAttribute('aria-haspopup', 'dialog');
    pill.innerHTML = '<span class="agente-orbe" aria-hidden="true"><i></i></span><span>Pregúntale a Alyxia</span>';
    pill.addEventListener('click', () => this.alternar());

    const p = this.panel = document.createElement('aside');
    p.className = 'agente';
    p.hidden = true;
    p.setAttribute('role', 'dialog');
    p.setAttribute('aria-label', 'Alyxia, asistente de inteligencia artificial');
    p.innerHTML = `
      <header class="agente-cab">
        <span class="agente-orbe grande" aria-hidden="true"><i></i></span>
        <div><p class="agente-nombre">Alyxia</p><p class="mono agente-modo">Conectando…</p></div>
        <button type="button" class="agente-voz mono" aria-pressed="false" title="Leer las respuestas en voz alta">Voz</button>
        <button type="button" class="agente-cerrar" aria-label="Cerrar">×</button>
      </header>
      <ol class="agente-mensajes" aria-live="polite"></ol>
      <div class="agente-sugerencias"></div>
      <form class="agente-form">
        <label class="sr" for="agente-texto">Escribe tu pregunta</label>
        <input id="agente-texto" class="agente-texto" type="text" autocomplete="off" enterkeyhint="send" maxlength="600" placeholder="Pregúntame o pídeme que te lleve…">
        <button type="button" class="agente-mic" aria-label="Hablar" ${Reconocimiento ? '' : 'hidden'}><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" fill="currentColor"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button>
        <button type="submit" class="agente-enviar" aria-label="Enviar">-&gt;</button>
      </form>
      <p class="agente-aviso mono">Es una IA. No compartas datos sensibles. Las conversaciones no se guardan.</p>`;
    document.body.append(pill, p);
    const $ = (s) => p.querySelector(s);
    this.el = { mensajes: $('.agente-mensajes'), sugerencias: $('.agente-sugerencias'), form: $('.agente-form'), texto: $('.agente-texto'), mic: $('.agente-mic'), voz: $('.agente-voz'), modo: $('.agente-modo') };
    $('.agente-cerrar').addEventListener('click', () => this.cerrar());
    this.el.form.addEventListener('submit', (e) => { e.preventDefault(); this.enviar(this.el.texto.value); });
    this.el.mic.addEventListener('click', () => this.escuchar());
    this.el.voz.addEventListener('click', () => { this.hablarEnVoz = !this.hablarEnVoz; this.el.voz.setAttribute('aria-pressed', String(this.hablarEnVoz)); if (!this.hablarEnVoz) speechSynthesis?.cancel(); });
    this.el.sugerencias.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) this.enviar(b.textContent); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.abierto) { e.preventDefault(); this.cerrar(); } });
    this.pintarSugerencias(SUGERENCIAS);
  }

  async alternar() { if (this.abierto) this.cerrar(); else this.abrir(); }

  async abrir() {
    this.abierto = true;
    this.panel.hidden = false;
    this.pill.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => this.panel.classList.add('abierto'));
    this.sonido?.tic();
    if (!this.historial.length) this.decir('Hola, soy Alyxia, la asistente de inteligencia artificial del Grupo Haxelera. Pregúntame lo que quieras o pídeme que te lleve a cualquier parte del sitio.');
    setTimeout(() => this.el.texto.focus({ preventScroll: true }), 250);
    const hay = await api.comprobar();
    this.el.modo.textContent = !hay ? 'Modo local · sin servidor' : api.ia ? 'IA en línea' : 'Modo local · sin clave de IA';
    this.el.modo.classList.toggle('en-linea', hay && api.ia);
  }

  cerrar() {
    this.abierto = false;
    this.panel.classList.remove('abierto');
    this.pill.setAttribute('aria-expanded', 'false');
    speechSynthesis?.cancel();
    this.reco?.abort?.();
    setTimeout(() => { if (!this.abierto) this.panel.hidden = true; }, 380);
  }

  pintarSugerencias(lista) {
    this.el.sugerencias.innerHTML = lista.map(s => `<button type="button" class="mono">${esc(s)}</button>`).join('');
  }

  burbuja(rol, texto) {
    const li = document.createElement('li');
    li.className = `agente-msj ${rol.split(' ').map(r => `es-${r}`).join(' ')}`;
    li.textContent = texto;
    this.el.mensajes.append(li);
    this.el.mensajes.scrollTop = this.el.mensajes.scrollHeight;
    return li;
  }

  // La respuesta aparece palabra por palabra y, si la voz está activa, se lee en voz alta.
  decir(texto) {
    const li = this.burbuja('agente', '');
    const palabras = texto.split(' ');
    let i = 0;
    const paso = () => {
      li.textContent = palabras.slice(0, ++i).join(' ');
      this.el.mensajes.scrollTop = this.el.mensajes.scrollHeight;
      if (i < palabras.length) setTimeout(paso, 28);
    };
    paso();
    this.historial.push({ rol: 'agente', texto });
    if (this.hablarEnVoz && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = 'es-ES';
      const voz = speechSynthesis.getVoices().find(v => v.lang?.startsWith('es'));
      if (voz) u.voice = voz;
      u.rate = 1.04;
      speechSynthesis.speak(u);
    }
  }

  async enviar(texto) {
    texto = String(texto || '').trim();
    if (!texto || this.ocupado) return;
    this.el.texto.value = '';
    this.burbuja('persona', texto);
    this.historial.push({ rol: 'persona', texto });
    this.ocupado = true;
    const pensando = this.burbuja('agente pensando', '');
    pensando.innerHTML = '<i></i><i></i><i></i>';
    let r;
    try {
      r = (await api.comprobar()) ? await api.agente(texto, this.historial.slice(-9, -1)) : responderLocal(texto);
    } catch (e) {
      r = e.codigo === 429 ? { respuesta: e.message, destino: null } : responderLocal(texto);
    }
    pensando.remove();
    this.ocupado = false;
    this.decir(r.respuesta || 'No te entendí bien. ¿Me lo dices de otra forma?');
    if (r.destino) setTimeout(() => {
      // En el celular el panel tapa la escena: se cierra para que se vea el viaje.
      if (matchMedia('(max-width: 640px)').matches) this.cerrar();
      this.irA?.(r.destino);
    }, matchMedia('(max-width: 640px)').matches ? 1600 : 700);
  }

  // Dictado por voz con el reconocimiento del navegador.
  escuchar() {
    if (!Reconocimiento) return;
    if (this.reco) { this.reco.stop(); return; }
    const reco = this.reco = new Reconocimiento();
    reco.lang = 'es-DO';
    reco.interimResults = true;
    reco.maxAlternatives = 1;
    this.el.mic.classList.add('escuchando');
    this.hablarEnVoz = true;
    this.el.voz.setAttribute('aria-pressed', 'true');
    reco.onresult = (e) => {
      const r = e.results[e.results.length - 1];
      this.el.texto.value = r[0].transcript;
      if (r.isFinal) this.enviar(r[0].transcript);
    };
    reco.onend = () => { this.el.mic.classList.remove('escuchando'); this.reco = null; };
    reco.onerror = () => { this.el.mic.classList.remove('escuchando'); this.reco = null; };
    reco.start();
  }
}
