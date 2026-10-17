// Sonido generativo con Web Audio: nada se descarga, todo se sintetiza en vivo.
// Apagado por defecto; solo arranca si la persona elige «Entrar con sonido» o toca el botón.
// Tres pistas generativas (cambian el acorde del bajo y del brillo) para el reproductor.
const PISTAS = [
  { nombre: '01 · Umbral', dron: [55, 82.41, 110.3, 164.4, 220.6], brillo: [659.25, 987.77, 1318.5] },
  { nombre: '02 · Órbita', dron: [49, 73.42, 98.2, 146.8, 196.4], brillo: [587.33, 880, 1174.7] },
  { nombre: '03 · Núcleo', dron: [61.74, 92.5, 123.7, 185, 247.2], brillo: [739.99, 1108.7, 1480] },
];
const PENTATONICA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.7, 1318.5, 1568];

export class Sonido {
  constructor() {
    this.ctx = null;
    this.activo = false;
    this.pista = 0;
    this.voces = [];
    this.brillos = [];
  }

  nombrePista() { return PISTAS[this.pista].nombre; }

  cambiarPista(d) {
    this.pista = (this.pista + d + PISTAS.length) % PISTAS.length;
    if (!this.ctx) return;
    const t = this.ctx.currentTime, p = PISTAS[this.pista];
    this.voces.forEach((o, i) => o.frequency.setTargetAtTime(p.dron[i], t, 1.2));
    this.brillos.forEach((o, i) => o.frequency.setTargetAtTime(p.brillo[i] * (1 + (i - 1) * 0.002), t, 1.2));
  }

  // Campanada suave al cruzar el portal de cada dimensión del ecosistema.
  dimension(k) {
    if (!this.activo) return;
    const c = this.ctx, t = c.currentTime;
    [PENTATONICA[k % PENTATONICA.length], PENTATONICA[(k + 2) % PENTATONICA.length] * 1.5].forEach((f, i) => {
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(i ? 0.03 : 0.06, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1.6);
      o.connect(g);
      g.connect(this.rev);
      g.connect(this.seco);
      o.start(t);
      o.stop(t + 1.7);
    });
  }

  crear() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    const ctx = this.ctx = new AC();

    this.maestro = ctx.createGain();
    this.maestro.gain.value = 0;
    const compresor = ctx.createDynamicsCompressor();
    compresor.threshold.value = -18;
    compresor.ratio.value = 3;
    this.maestro.connect(compresor).connect(ctx.destination);

    // Reverberación sintética: ruido que se apaga.
    this.rev = ctx.createConvolver();
    this.rev.buffer = this.impulso(3.5, 2.8);
    const revG = ctx.createGain();
    revG.gain.value = 0.5;
    this.rev.connect(revG).connect(this.maestro);
    this.seco = ctx.createGain();
    this.seco.gain.value = 0.7;
    this.seco.connect(this.maestro);

    // Bajo continuo en La, con respiración lenta.
    this.filtro = ctx.createBiquadFilter();
    this.filtro.type = 'lowpass';
    this.filtro.frequency.value = 320;
    this.filtro.Q.value = 0.8;
    const dron = ctx.createGain();
    dron.gain.value = 0.22;
    this.filtro.connect(dron);
    dron.connect(this.seco);
    dron.connect(this.rev);
    const pista = PISTAS[this.pista];
    [['sine', 0.55], ['triangle', 0.28], ['sawtooth', 0.09], ['sawtooth', 0.05], ['sine', 0.06]].forEach(([tipo, v], i) => {
      const o = ctx.createOscillator();
      o.type = tipo;
      o.frequency.value = pista.dron[i];
      this.voces.push(o);
      const g = ctx.createGain();
      g.gain.value = v;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.04 + i * 0.023;
      const lg = ctx.createGain();
      lg.gain.value = v * 0.45;
      lfo.connect(lg).connect(g.gain);
      o.connect(g).connect(this.filtro);
      o.start();
      lfo.start();
    });

    // Brillo agudo que aparece al llegar a «la otra dimensión».
    this.brillo = ctx.createGain();
    this.brillo.gain.value = 0;
    this.brillo.connect(this.rev);
    pista.brillo.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f * (1 + (i - 1) * 0.002);
      this.brillos.push(o);
      const g = ctx.createGain();
      g.gain.value = 0.018;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.11 + i * 0.07;
      const lg = ctx.createGain();
      lg.gain.value = 0.012;
      lfo.connect(lg).connect(g.gain);
      o.connect(g).connect(this.brillo);
      o.start();
      lfo.start();
    });

    // Viento que sube con la velocidad del scroll.
    this.ruido = this.ruidoBlanco(2);
    const fuente = ctx.createBufferSource();
    fuente.buffer = this.ruido;
    fuente.loop = true;
    this.banda = ctx.createBiquadFilter();
    this.banda.type = 'bandpass';
    this.banda.frequency.value = 500;
    this.banda.Q.value = 0.8;
    this.viento = ctx.createGain();
    this.viento.gain.value = 0;
    fuente.connect(this.banda).connect(this.viento);
    this.viento.connect(this.seco);
    this.viento.connect(this.rev);
    fuente.start();
    return true;
  }

  ruidoBlanco(seg) {
    const n = Math.floor(this.ctx.sampleRate * seg);
    const b = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  impulso(seg, caida) {
    const sr = this.ctx.sampleRate, n = Math.floor(sr * seg);
    const b = this.ctx.createBuffer(2, n, sr);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, caida);
    }
    return b;
  }

  encender() {
    if (!this.ctx && !this.crear()) return;
    this.ctx.resume();
    this.activo = true;
    const t = this.ctx.currentTime;
    this.maestro.gain.cancelScheduledValues(t);
    this.maestro.gain.setTargetAtTime(0.75, t, 0.9);
  }

  apagar() {
    if (!this.ctx) return;
    this.activo = false;
    const t = this.ctx.currentTime;
    this.maestro.gain.cancelScheduledValues(t);
    this.maestro.gain.setTargetAtTime(0, t, 0.25);
  }

  pausar(oculto) {
    if (!this.ctx) return;
    if (oculto) this.ctx.suspend();
    else if (this.activo) this.ctx.resume();
  }

  actualizar(vel, profundidad) {
    if (!this.activo) return;
    const t = this.ctx.currentTime;
    const v = Math.min(Math.abs(vel) / 35, 1);
    this.viento.gain.setTargetAtTime(v * 0.28, t, 0.08);
    this.banda.frequency.setTargetAtTime(350 + v * 2600, t, 0.12);
    this.filtro.frequency.setTargetAtTime(260 + profundidad * 700 + v * 500, t, 0.4);
    this.brillo.gain.setTargetAtTime(profundidad > 0.12 ? 0.7 : 0, t, 1.5);
  }

  tic() {
    if (!this.activo) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(2400, t);
    o.frequency.exponentialRampToValueAtTime(1200, t + 0.04);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    o.connect(g).connect(this.seco);
    o.start(t);
    o.stop(t + 0.08);
  }

  // Golpe grave y ráfaga al cruzar el portal.
  portal() {
    if (!this.activo) return;
    const c = this.ctx, t = c.currentTime;
    const o = c.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(90, t);
    o.frequency.exponentialRampToValueAtTime(28, t + 1.2);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    o.connect(g);
    g.connect(this.seco);
    g.connect(this.rev);
    o.start(t);
    o.stop(t + 1.5);
    const r = c.createBufferSource();
    r.buffer = this.ruido;
    const f = c.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.setValueAtTime(4000, t);
    f.frequency.exponentialRampToValueAtTime(300, t + 1.0);
    const rg = c.createGain();
    rg.gain.setValueAtTime(0.25, t);
    rg.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    r.connect(f).connect(rg);
    rg.connect(this.rev);
    rg.connect(this.seco);
    r.start(t);
    r.stop(t + 1.3);
  }
}
