// Minipáginas de cada trabajo: se abren desde la columna de cada empresa con un pasadizo dimensional
// y adentro todo está vivo: una escena animada grande, un monitor, un registro de actividad que no para
// y una acción que pone a correr el sistema. Todo es demostración: se marca como simulación.
import { FAMILIAS } from './trabajos.js';

const TAU = Math.PI * 2;
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hora = () => new Date().toLocaleTimeString('es-DO', { hour12: false });

// Qué se mide y qué se registra según el tipo de trabajo.
const VIDA = {
  onda:       { metrica: 'conversaciones activas', base: 18, unidad: '', log: ['agente atendió consulta', 'cita agendada', 'pregunta resuelta con documentos', 'caso escalado a una persona', 'registro guardado en el CRM'], exito: 'AGENTE EN LÍNEA', pasos: ['Escucha y entiende', 'Consulta tus sistemas', 'Responde o escala'] },
  escaneo:    { metrica: 'objetos por minuto', base: 42, unidad: '', log: ['documento leído', 'objeto detectado', 'pieza aprobada', 'pieza con defecto apartada', 'alerta enviada'], exito: 'OBJETO RECONOCIDO', pasos: ['Captura la imagen', 'Detecta y clasifica', 'Actúa al instante'] },
  red:        { metrica: 'conexiones activas', base: 64, unidad: '', log: ['nodo sincronizado', 'mensaje entregado', 'conexión verificada', 'ruta optimizada', 'nuevo enlace creado'], exito: 'RED SINCRONIZADA', pasos: ['Conecta las fuentes', 'Procesa y aprende', 'Entrega resultados'] },
  panel:      { metrica: 'operaciones del día', base: 1280, unidad: '', log: ['operación registrada', 'reporte generado', 'permiso actualizado', 'cambio auditado', 'usuario conectado'], exito: 'OPERACIÓN REGISTRADA', pasos: ['Centraliza la operación', 'Asigna roles', 'Decide con datos en vivo'] },
  codigo:     { metrica: 'pruebas en verde', base: 312, unidad: '', log: ['commit integrado', 'pruebas aprobadas', 'revisión de código lista', 'versión empaquetada', 'documentación actualizada'], exito: 'VERSIÓN COMPILADA', pasos: ['Diseña la arquitectura', 'Programa con pruebas', 'Entrega cada semana'] },
  servidores: { metrica: 'carga del clúster', base: 46, unidad: '%', log: ['instancia iniciada', 'balanceador actualizado', 'base de datos replicada', 'certificado renovado', 'métricas enviadas'], exito: 'CAPACIDAD ESCALADA', pasos: ['Diseña la arquitectura', 'Despliega en la nube', 'Escala con la demanda'] },
  linea:      { metrica: 'disponibilidad', base: 99.9, unidad: '%', decimales: 2, log: ['zona A en línea', 'zona B en línea', 'tráfico redistribuido', 'salud verificada', 'alerta resuelta'], exito: 'SERVICIO ESTABLE', pasos: ['Reparte en zonas', 'Vigila la salud', 'Recupera solo'] },
  progreso:   { metrica: 'respaldos completos', base: 365, unidad: '', log: ['respaldo cifrado', 'copia enviada a otra región', 'restauración probada', 'retención aplicada', 'integridad verificada'], exito: 'RESPALDO COMPLETO', pasos: ['Copia y cifra', 'Guarda en otra región', 'Prueba la restauración'] },
  escudo:     { metrica: 'accesos verificados', base: 940, unidad: '', log: ['identidad verificada · MFA', 'acceso mínimo concedido', 'dispositivo evaluado', 'sesión reverificada', 'segmento aislado'], exito: 'ACCESO VERIFICADO', pasos: ['Verifica identidad', 'Concede lo mínimo', 'Vuelve a verificar'] },
  soc:        { metrica: 'eventos analizados', base: 5200, unidad: '', log: ['evento correlacionado', 'origen no confiable bloqueado', 'anomalía investigada', 'regla de firewall aplicada', 'incidente cerrado'], exito: 'ATAQUE BLOQUEADO', pasos: ['Recoge los registros', 'Detecta anomalías', 'Responde y documenta'] },
  terminal:   { metrica: 'controles revisados', base: 86, unidad: '', log: ['alcance autorizado confirmado', 'servicio revisado', 'hallazgo documentado', 'corrección verificada', 'reporte entregado'], exito: 'PRUEBA COMPLETADA', pasos: ['Acuerda el alcance', 'Prueba con permiso', 'Reporta y verifica'] },
  barras:     { metrica: 'respuestas recibidas', base: 1450, unidad: '', log: ['respuesta registrada', 'cuota de la región al día', 'ponderación recalculada', 'intervalo actualizado', 'tablero publicado'], exito: 'RESULTADOS ACTUALIZADOS', pasos: ['Diseña la muestra', 'Recoge y pondera', 'Publica con su margen'] },
  dona:       { metrica: 'indicadores al día', base: 48, unidad: '', log: ['indicador recalculado', 'desvío detectado', 'reporte enviado', 'meta actualizada', 'tablero compartido'], exito: 'INDICADORES AL DÍA', pasos: ['Define los indicadores', 'Conecta los datos', 'Alerta los desvíos'] },
  wireframe:  { metrica: 'pantallas prototipadas', base: 24, unidad: '', log: ['pantalla armada', 'prueba con usuario', 'ajuste aplicado', 'flujo validado', 'prototipo compartido'], exito: 'PROTOTIPO LISTO', pasos: ['Bosqueja la idea', 'Prueba con usuarios', 'Pasa a producción'] },
  tuberia:    { metrica: 'despliegues del mes', base: 120, unidad: '', log: ['código integrado', 'pruebas aprobadas', 'imagen construida', 'desplegado en producción', 'monitoreo activo'], exito: 'DESPLEGADO', pasos: ['Integra el cambio', 'Prueba y construye', 'Despliega sin pausa'] },
  flujo:      { metrica: 'tareas automatizadas', base: 3400, unidad: '', log: ['aprobación enviada', 'notificación entregada', 'reporte programado', 'datos sincronizados', 'tarea completada'], exito: 'FLUJO EJECUTADO', pasos: ['Mapea el proceso', 'Automatiza las tareas', 'Mide el ahorro'] },
  mapa:       { metrica: 'mercados conectados', base: 12, unidad: '', log: ['ruta comercial abierta', 'socio local contactado', 'contenido localizado', 'requisito regulatorio revisado', 'reunión agendada'], exito: 'MERCADO CONECTADO', pasos: ['Estudia el mercado', 'Suma socios locales', 'Lanza y acompaña'] },
};

export class Minisitio {
  constructor({ sonido, alAbrir, alCerrar } = {}) {
    this.sonido = sonido;
    this.alAbrir = alAbrir;
    this.alCerrar = alCerrar;
    this.abierto = false;
    this.energia = 0;
    this.reloj = 0;
    this.construir();
  }

  construir() {
    const r = this.raiz = document.createElement('div');
    r.className = 'mp';
    r.hidden = true;
    r.setAttribute('role', 'dialog');
    r.setAttribute('aria-modal', 'true');
    r.setAttribute('aria-labelledby', 'mp-titulo');
    r.innerHTML = `
      <canvas class="mp-pasadizo" aria-hidden="true"></canvas>
      <div class="mp-contenido">
        <header class="mp-barra mono">
          <button type="button" class="mp-volver">&lt;- Volver</button>
          <span class="mp-ruta"></span>
          <span class="mp-chip"><i></i><span class="mp-chip-t">Simulación en vivo</span></span>
        </header>
        <div class="mp-trabajo">
        <section class="mp-portada">
          <div class="mp-texto">
            <p class="mono mp-num"></p>
            <h3 id="mp-titulo" class="mp-titulo"></h3>
            <p class="mp-resumen"></p>
            <button type="button" class="boton boton-claro mp-accion"></button>
          </div>
          <div class="mp-escena"><canvas class="mp-lienzo" aria-hidden="true"></canvas><span class="mp-sello mono"></span></div>
        </section>
        <section class="mp-paneles">
          <article class="mp-panel"><p class="mono mp-et">Monitor</p><p class="mp-metrica"><b></b><span></span></p><canvas class="mp-linea" aria-hidden="true"></canvas></article>
          <article class="mp-panel"><p class="mono mp-et">Actividad</p><ol class="mp-log mono" aria-live="off"></ol></article>
          <article class="mp-panel"><p class="mono mp-et">Cómo funciona</p><ol class="mp-pasos"></ol></article>
        </section>
        <section class="mp-incluye"><p class="mono mp-et">Qué incluye</p><ul></ul></section>
        <section class="mp-cierre">
          <p class="mp-cierre-t">¿Lo quieres para tu empresa?</p>
          <a class="boton boton-claro boton-grande mp-hablar" href="#contacto">Hablemos</a>
        </section>
        </div>
        <div class="mp-exp"></div>
      </div>`;
    document.body.append(r);
    const $ = (s) => r.querySelector(s);
    this.el = {
      portal: $('.mp-pasadizo'), contenido: $('.mp-contenido'), ruta: $('.mp-ruta'), num: $('.mp-num'), titulo: $('.mp-titulo'),
      resumen: $('.mp-resumen'), accion: $('.mp-accion'), lienzo: $('.mp-lienzo'), sello: $('.mp-sello'), metrica: $('.mp-metrica b'),
      unidad: $('.mp-metrica span'), etMetrica: $('.mp-panel .mp-et'), linea: $('.mp-linea'), log: $('.mp-log'), pasos: $('.mp-pasos'),
      incluye: $('.mp-incluye ul'), volver: $('.mp-volver'), hablar: $('.mp-hablar'), trabajo: $('.mp-trabajo'), exp: $('.mp-exp'), chip: $('.mp-chip-t'),
    };
    this.el.volver.addEventListener('click', () => this.cerrar());
    this.el.accion.addEventListener('click', () => this.accionar());
    this.el.hablar.addEventListener('click', () => this.cerrar(true));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && this.abierto) { e.preventDefault(); this.cerrar(); } });
    window.addEventListener('resize', () => { if (this.abierto) this.ajustarLienzos(); });
  }

  // Experiencias en vivo (encuesta, estado, desafíos): mismo pasadizo, contenido propio.
  abrirExperiencia(empresa, k, montar, etiqueta) {
    if (this.abierto) return;
    this.empresa = empresa;
    this.color = empresa.colores[0];
    this.color2 = empresa.colores[1];
    this.raiz.style.setProperty('--c1', this.color);
    this.raiz.style.setProperty('--c2', this.color2);
    this.el.ruta.textContent = `${empresa.nombre} / ${etiqueta}`;
    this.el.chip.textContent = empresa.experiencia?.chip || 'En vivo';
    this.foco = document.activeElement;
    this.el.trabajo.hidden = true;
    this.el.exp.hidden = false;
    this.el.exp.innerHTML = '';
    this.mostrar();
    this.exp = montar(this.el.exp, { color: this.color, color2: this.color2, sonido: this.sonido, alVoto: () => this.alVoto?.(k) });
  }

  abrir(empresa, k, trabajo, j) {
    if (this.abierto) return;
    this.el.trabajo.hidden = false;
    this.el.exp.hidden = true;
    this.el.chip.textContent = 'Simulación en vivo';
    this.exp = null;
    this.empresa = empresa;
    this.trabajo = trabajo;
    this.vida = VIDA[trabajo.tipo] || VIDA.linea;
    this.color = empresa.colores[0];
    this.color2 = empresa.colores[1];
    this.valor = this.vida.base;
    this.historia = Array.from({ length: 60 }, () => this.vida.base);
    this.energia = 0;
    this.reloj = 0;
    this.ultimoLog = 0;
    this.foco = document.activeElement;
    const e = this.el;
    this.raiz.style.setProperty('--c1', this.color);
    this.raiz.style.setProperty('--c2', this.color2);
    e.ruta.textContent = `${empresa.nombre} / ${trabajo.titulo}`;
    e.num.textContent = `${String(k + 1).padStart(2, '0')}.${j + 1} · ${empresa.area}`;
    e.titulo.textContent = trabajo.titulo;
    e.resumen.textContent = trabajo.resumen || '';
    e.accion.textContent = `${trabajo.accion || 'Ejecutar'} ->`;
    e.etMetrica.textContent = `Demostración · ${this.vida.metrica}`;
    e.unidad.textContent = this.vida.unidad;
    e.log.innerHTML = '';
    e.pasos.innerHTML = this.vida.pasos.map((p, i) => `<li><span class="mono">0${i + 1}</span>${esc(p)}<i></i></li>`).join('');
    e.incluye.innerHTML = (trabajo.incluye || []).map((x, i) => `<li><span class="mono">0${i + 1}</span>${esc(x)}</li>`).join('');
    e.sello.textContent = '';
    for (let i = 0; i < 4; i++) this.registrar(this.vida.log[i % this.vida.log.length]);
    this.mostrar();
  }

  mostrar() {
    const e = this.el;
    this.abierto = true;
    this.foco = document.activeElement;
    this.energia = 0;
    this.reloj = 0;
    document.body.classList.add('mp-abierta');
    this.raiz.hidden = false;
    this.raiz.classList.remove('saliendo', 'listo');
    e.contenido.scrollTop = 0;
    this.ajustarLienzos();
    this.inicioPasadizo = performance.now();
    this.direccion = 1;
    this.sonido?.portal();
    this.alAbrir?.(this.color);
    requestAnimationFrame(() => this.raiz.classList.add('entrando'));
    setTimeout(() => { if (this.abierto) { this.raiz.classList.add('listo'); e.volver.focus({ preventScroll: true }); } }, 820);
    if (!this.bucleActivo) { this.bucleActivo = true; this.ultimo = performance.now(); requestAnimationFrame((t) => this.cuadro(t)); }
  }

  cerrar(alContacto = false) {
    if (!this.abierto) return;
    this.abierto = false;
    this.raiz.classList.remove('listo');
    this.raiz.classList.add('saliendo');
    this.inicioPasadizo = performance.now();
    this.direccion = -1;
    this.exp?.desmontar();
    setTimeout(() => {
      this.exp = null;
      this.raiz.hidden = true;
      this.raiz.classList.remove('entrando', 'saliendo');
      document.body.classList.remove('mp-abierta');
      this.alCerrar?.(alContacto);
      if (!alContacto) this.foco?.focus?.({ preventScroll: true });
    }, 620);
  }

  accionar() {
    this.energia = 1;
    this.sonido?.tic();
    this.valor *= 1.06 + Math.random() * 0.04;
    this.registrar(`${this.trabajo.accion.toLowerCase()} · iniciado`);
    setTimeout(() => { if (this.abierto) { this.registrar(this.vida.exito.toLowerCase()); this.el.sello.textContent = this.vida.exito; this.el.sello.classList.add('visible'); } }, 900);
    setTimeout(() => this.el.sello.classList.remove('visible'), 3200);
    this.el.pasos.querySelectorAll('li').forEach((li, i) => { li.classList.remove('corriendo'); void li.offsetWidth; li.style.setProperty('--d', `${i * 0.35}s`); li.classList.add('corriendo'); });
  }

  registrar(texto) {
    const li = document.createElement('li');
    li.innerHTML = `<span>${hora()}</span>${esc(texto)}`;
    this.el.log.prepend(li);
    while (this.el.log.children.length > 7) this.el.log.lastElementChild.remove();
  }

  ajustarLienzos() {
    const pr = Math.min(window.devicePixelRatio || 1, 2);
    for (const c of [this.el.lienzo, this.el.linea, this.el.portal]) {
      const r = c.getBoundingClientRect();
      c.width = Math.max(1, Math.round(r.width * pr));
      c.height = Math.max(1, Math.round(r.height * pr));
    }
  }

  cuadro(ahora) {
    const dt = Math.max(0, Math.min((ahora - this.ultimo) / 1000, 0.05));
    this.ultimo = ahora;
    const pasadizoVivo = ahora - this.inicioPasadizo < 900;
    if (!this.abierto && !pasadizoVivo) { this.bucleActivo = false; return; }
    requestAnimationFrame((t) => this.cuadro(t));
    this.energia = Math.max(0, this.energia - dt * 0.45);
    this.reloj += dt * (1 + this.energia * 4);
    this.dibujarPasadizo(ahora);
    if (!this.abierto) return;
    if (this.exp) { this.exp.cuadro(dt); return; }
    this.dibujarEscena();
    this.vivir(dt);
  }

  // El pasadizo: la forma del portal de la empresa se repite en profundidad y viene hacia la pantalla.
  dibujarPasadizo(ahora) {
    const c = this.el.portal, x = c.getContext('2d');
    const W = c.width, H = c.height;
    const k = Math.min(1, (ahora - this.inicioPasadizo) / 850);
    x.clearRect(0, 0, W, H);
    if (k >= 1) return;
    const avance = this.direccion > 0 ? k : 1 - k;
    const fuerza = Math.sin(k * Math.PI);
    x.fillStyle = `rgba(0,0,0,${this.direccion > 0 ? Math.min(1, k * 2.2) : 1 - k})`;
    x.fillRect(0, 0, W, H);
    x.save();
    x.translate(W / 2, H / 2);
    x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 90; i++) {
      const a = (i / 90) * TAU + i * 0.37;
      const r0 = (0.05 + ((i * 0.618) % 1) * 0.2) * Math.max(W, H) * (0.3 + avance);
      const r1 = r0 + Math.max(W, H) * 0.25 * fuerza;
      x.strokeStyle = i % 3 ? this.color : this.color2;
      x.globalAlpha = 0.5 * fuerza;
      x.lineWidth = 1.5;
      x.beginPath(); x.moveTo(Math.cos(a) * r0, Math.sin(a) * r0); x.lineTo(Math.cos(a) * r1, Math.sin(a) * r1); x.stroke();
    }
    for (let i = 0; i < 9; i++) {
      const z = (i / 9 + avance * 1.6) % 1;
      const r = Math.pow(z, 2.4) * Math.max(W, H) * 1.3;
      x.globalAlpha = (1 - z) * 0.9 * fuerza + 0.05;
      x.strokeStyle = i % 2 ? this.color : this.color2;
      x.lineWidth = 2 + z * 6;
      x.beginPath();
      for (let v = 0; v < 3; v++) { const a = -Math.PI / 2 + (v / 3) * TAU; v ? x.lineTo(Math.cos(a) * r, Math.sin(a) * r) : x.moveTo(Math.cos(a) * r, Math.sin(a) * r); }
      x.closePath(); x.stroke();
    }
    x.restore();
    x.globalAlpha = 1;
    x.globalCompositeOperation = 'source-over';
  }

  // La escena grande reutiliza la animación de la tarjeta, ampliada y con partículas de vida alrededor.
  dibujarEscena() {
    const c = this.el.lienzo, x = c.getContext('2d');
    const W = c.width, H = c.height;
    x.setTransform(1, 0, 0, 1, 0, 0);
    const fondo = x.createLinearGradient(0, 0, W, H);
    fondo.addColorStop(0, '#030306'); fondo.addColorStop(1, '#0a0912');
    x.fillStyle = fondo; x.fillRect(0, 0, W, H);
    const s = Math.min(W / 512, H / 320);
    x.save();
    x.translate((W - 512 * s) / 2, (H - 320 * s) / 2);
    x.scale(s, s);
    (FAMILIAS[this.trabajo.tipo] || FAMILIAS.linea)(x, this.reloj, this.color);
    x.restore();
    x.save();
    x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 46; i++) {
      const px = ((i * 97.3 + this.reloj * (14 + (i % 5) * 6)) % (W + 40)) - 20;
      const py = (Math.sin(i * 1.7 + this.reloj * 0.6) * 0.5 + 0.5) * H;
      x.globalAlpha = 0.25 + this.energia * 0.5;
      x.fillStyle = i % 2 ? this.color : '#ffffff';
      x.beginPath(); x.arc(px, py, (1 + (i % 3)) * (W / 900), 0, TAU); x.fill();
    }
    if (this.energia > 0.02) {
      x.globalAlpha = this.energia * 0.5;
      x.strokeStyle = this.color;
      x.lineWidth = 3 * (W / 900);
      const r = (1 - this.energia) * Math.max(W, H);
      x.beginPath(); x.arc(W / 2, H / 2, r, 0, TAU); x.stroke();
    }
    x.restore();
  }

  // Monitor y registro: la métrica respira, la línea avanza y la actividad se escribe sola.
  vivir(dt) {
    const v = this.vida;
    const objetivo = v.base * (1 + this.energia * 0.35);
    this.valor += (objetivo - this.valor) * dt * 1.5 + (Math.random() - 0.5) * v.base * 0.004;
    if (v.unidad === '%') this.valor = Math.min(this.valor, v.base > 90 ? 99.99 : 98);
    this.acum = (this.acum || 0) + dt;
    if (this.acum > 0.12) {
      this.acum = 0;
      this.historia.shift(); this.historia.push(this.valor);
      this.el.metrica.textContent = this.valor.toLocaleString('es-DO', { maximumFractionDigits: v.decimales ?? 0, minimumFractionDigits: v.decimales ?? 0 });
      this.dibujarLinea();
    }
    this.ultimoLog += dt * (1 + this.energia * 3);
    if (this.ultimoLog > 1.6) { this.ultimoLog = 0; this.registrar(v.log[(Math.random() * v.log.length) | 0]); }
  }

  dibujarLinea() {
    const c = this.el.linea, x = c.getContext('2d');
    const W = c.width, H = c.height;
    x.clearRect(0, 0, W, H);
    const min = Math.min(...this.historia) * 0.98, max = Math.max(...this.historia) * 1.02;
    x.beginPath();
    this.historia.forEach((v, i) => { const px = (i / (this.historia.length - 1)) * W, py = H - ((v - min) / (max - min || 1)) * H * 0.85 - H * 0.05; i ? x.lineTo(px, py) : x.moveTo(px, py); });
    x.strokeStyle = this.color; x.lineWidth = 2 * (W / 300); x.stroke();
    x.lineTo(W, H); x.lineTo(0, H); x.closePath();
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, `${this.color}55`); g.addColorStop(1, `${this.color}00`);
    x.fillStyle = g; x.fill();
  }
}
