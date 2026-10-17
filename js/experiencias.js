// Experiencias en vivo de la fase 2 (se abren dentro del pasadizo de las minipáginas):
//  · Nexel Data — encuesta viva con resultados e intervalos de confianza en tiempo real.
//  · Xelera Cloud — estado en vivo con datos reales de la visita y del servidor.
//  · Haxion — desafíos de seguridad: correo falso, fuerza de una clave (local) y laberinto Zero Trust.
import { api, visitante } from './api.js';
import { ENCUESTA, CONFIG } from './config.js';

const TAU = Math.PI * 2;
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hora = () => new Date().toLocaleTimeString('es-DO', { hour12: false });
const fmt = (n, d = 0) => Number(n).toLocaleString('es-DO', { maximumFractionDigits: d, minimumFractionDigits: d });
function lienzoNitido(c) {
  const pr = Math.min(window.devicePixelRatio || 1, 2), r = c.getBoundingClientRect();
  c.width = Math.max(1, Math.round(r.width * pr)); c.height = Math.max(1, Math.round(r.height * pr));
  return pr;
}

// Intervalo de Wilson al 95 %: honesto incluso con pocas respuestas.
function wilson(x, n) {
  if (!n) return [0, 0];
  const z = 1.96, p = x / n, d = 1 + (z * z) / n;
  const centro = (p + (z * z) / (2 * n)) / d, mitad = (z * Math.sqrt((p * (1 - p)) / n + (z * z) / (4 * n * n))) / d;
  return [Math.max(0, centro - mitad), Math.min(1, centro + mitad)];
}

// =====================================================================
// Nexel Data · Encuesta viva
// =====================================================================
function encuesta(cont, ctx) {
  cont.innerHTML = `
    <div class="xp-cab">
      <p class="mono xp-num">05 · Nexel Data · Encuesta viva</p>
      <h3 class="xp-titulo">${esc(ENCUESTA.pregunta)}</h3>
      <p class="xp-nota">Abierta y anónima: no se pide ningún dato personal. Es una consulta abierta, no una muestra representativa.</p>
    </div>
    <div class="enc">
      <ol class="enc-opciones">${ENCUESTA.opciones.map((o, i) => `
        <li><button type="button" class="enc-op" data-i="${i}">
          <span class="enc-nombre">${esc(o)}</span>
          <span class="enc-barra"><i></i><b></b></span>
          <span class="enc-pct mono">—</span>
        </button></li>`).join('')}
      </ol>
      <aside class="enc-lado">
        <p class="mono xp-et">Respuestas</p>
        <p class="enc-total">—</p>
        <p class="mono enc-vivo"><i></i><span>Conectando…</span></p>
        <canvas class="enc-chispas" aria-hidden="true"></canvas>
        <p class="enc-explica">Cada barra es el porcentaje de votos. La franja fina marca el intervalo de confianza del 95 %: con más respuestas, se estrecha.</p>
        <p class="mono enc-msj" role="status"></p>
      </aside>
    </div>`;
  const $ = (s) => cont.querySelector(s);
  const ops = [...cont.querySelectorAll('.enc-op')];
  const chispas = [];
  let datos = { votos: ENCUESTA.opciones.map(() => 0), total: 0 }, miVoto = null, local = false, cortar = () => {};
  try { const g = JSON.parse(localStorage.getItem(`hx-voto-${ENCUESTA.id}`) || 'null'); if (g !== null) miVoto = g; } catch { /* sin almacenamiento */ }

  function pintar(nuevo = null) {
    const n = datos.total;
    $('.enc-total').textContent = fmt(n);
    ops.forEach((b, i) => {
      const x = datos.votos[i] || 0, p = n ? x / n : 0, [a, z] = wilson(x, n);
      b.querySelector('i').style.transform = `scaleX(${p})`;
      const ic = b.querySelector('b');
      ic.style.left = `${a * 100}%`; ic.style.width = `${Math.max(0.5, (z - a) * 100)}%`;
      b.querySelector('.enc-pct').textContent = n ? `${fmt(p * 100, 1)} %` : '—';
      b.classList.toggle('mio', miVoto === i);
      b.classList.toggle('votado', miVoto !== null);
      if (nuevo === i) { b.classList.remove('destello'); void b.offsetWidth; b.classList.add('destello'); }
    });
    if (nuevo !== null) for (let k = 0; k < 14; k++) chispas.push({ x: Math.random(), y: 1, v: 0.2 + Math.random() * 0.5, vida: 1 });
  }

  async function iniciar() {
    if (await api.comprobar()) {
      try { datos = await api.encuesta(); } catch { /* se queda en cero */ }
      $('.enc-vivo span').textContent = 'En vivo · los votos de todos llegan al instante';
      $('.enc-vivo').classList.add('ok');
      cortar = api.escucharEncuesta((d, opcion) => { datos = d; pintar(opcion); if (opcion !== null) ctx.alVoto?.(); });
    } else {
      local = true;
      $('.enc-vivo span').textContent = 'Sin servidor · tu voto queda solo en este equipo';
    }
    pintar();
  }

  cont.querySelector('.enc-opciones').addEventListener('click', async (e) => {
    const b = e.target.closest('.enc-op');
    if (!b || miVoto !== null) return;
    const i = Number(b.dataset.i);
    ctx.sonido?.tic();
    try {
      if (local) { datos.votos[i]++; datos.total++; pintar(i); ctx.alVoto?.(); }
      else { datos = await api.votar(i); pintar(i); }
      miVoto = i;
      try { localStorage.setItem(`hx-voto-${ENCUESTA.id}`, String(i)); } catch { /* sin almacenamiento */ }
      $('.enc-msj').textContent = local ? 'Gracias. Sin servidor conectado, tu voto se guarda solo en este equipo.' : 'Gracias: tu voto ya cuenta.';
    } catch (err) {
      if (err.codigo === 409) { miVoto = i; if (err.datos?.votos) datos = err.datos; }
      $('.enc-msj').textContent = err.message;
    }
    pintar();
  });

  const lienzo = $('.enc-chispas');
  lienzoNitido(lienzo);
  iniciar();
  return {
    cuadro(dt) {
      const x = lienzo.getContext('2d'), W = lienzo.width, H = lienzo.height;
      x.clearRect(0, 0, W, H);
      for (let i = chispas.length - 1; i >= 0; i--) {
        const c = chispas[i];
        c.y -= c.v * dt; c.vida -= dt * 0.6;
        if (c.vida <= 0) { chispas.splice(i, 1); continue; }
        x.globalAlpha = c.vida; x.fillStyle = ctx.color;
        x.beginPath(); x.arc(c.x * W, c.y * H, 2.5 * (W / 300), 0, TAU); x.fill();
      }
      x.globalAlpha = 1;
    },
    desmontar() { cortar(); },
  };
}

// =====================================================================
// Xelera Cloud · Estado en vivo
// =====================================================================
function estado(cont, ctx) {
  cont.innerHTML = `
    <div class="xp-cab">
      <p class="mono xp-num">03 · Xelera Cloud · Estado en vivo</p>
      <h3 class="xp-titulo">Así viaja tu visita ahora mismo</h3>
      <p class="xp-nota">Datos reales medidos en este momento: tu conexión, tu equipo y nuestro servidor. No se guarda nada.</p>
    </div>
    <div class="est">
      <article class="est-t ancho"><p class="mono xp-et">Latencia hasta el servidor</p><p class="est-v"><b data-v="lat">—</b><span>ms</span></p><canvas class="est-curva" aria-hidden="true"></canvas><p class="mono est-s" data-v="jit">—</p></article>
      <article class="est-t"><p class="mono xp-et">Ruta</p><p class="est-v"><b data-v="cdn">—</b></p><p class="mono est-s" data-v="proto">—</p></article>
      <article class="est-t"><p class="mono xp-et">Carga de esta página</p><p class="est-v"><b data-v="carga">—</b><span>s</span></p><p class="mono est-s" data-v="ttfb">—</p></article>
      <article class="est-t"><p class="mono xp-et">Transferido</p><p class="est-v"><b data-v="kb">—</b><span>KB</span></p><p class="mono est-s" data-v="rec">—</p></article>
      <article class="est-t"><p class="mono xp-et">Tu equipo</p><p class="est-v"><b data-v="fps">—</b><span>fps</span></p><p class="mono est-s" data-v="equipo">—</p></article>
      <article class="est-t"><p class="mono xp-et">Servidor</p><p class="est-v"><b data-v="srv">—</b></p><p class="mono est-s" data-v="srv2">—</p></article>
      <article class="est-t ancho"><p class="mono xp-et">Rack · cada luz es una petición real</p><canvas class="est-rack" aria-hidden="true"></canvas></article>
      <article class="est-t ancho"><p class="mono xp-et">Registro de peticiones</p><ol class="mono est-log"></ol></article>
    </div>`;
  const v = (k) => cont.querySelector(`[data-v="${k}"]`);
  const curva = cont.querySelector('.est-curva'), rack = cont.querySelector('.est-rack'), log = cont.querySelector('.est-log');
  lienzoNitido(curva); lienzoNitido(rack);
  const lat = [], luces = [];
  let vivo = true, servidor = false, reloj = 0, cuadros = 0, tFps = 0;

  // Datos de la carga de la página (Navigation y Resource Timing del navegador).
  const nav = performance.getEntriesByType('navigation')[0];
  if (nav) {
    v('carga').textContent = fmt((nav.loadEventEnd || nav.domComplete || performance.now()) / 1000, 2);
    v('ttfb').textContent = `primer byte ${fmt(nav.responseStart, 0)} ms · listo ${fmt(nav.domContentLoadedEventEnd, 0)} ms`;
  }
  const recursos = performance.getEntriesByType('resource');
  const bytes = recursos.reduce((a, r) => a + (r.transferSize || 0), 0) + (nav?.transferSize || 0);
  v('kb').textContent = fmt(bytes / 1024, 0);
  v('rec').textContent = `${recursos.length + 1} recursos · ${new Set(recursos.map(r => { try { return new URL(r.name).host; } catch { return ''; } })).size} orígenes`;
  // El protocolo sale de la propia página o, si el navegador no lo informa, de los archivos del mismo sitio.
  const proto = nav?.nextHopProtocol || performance.getEntriesByType('resource').find(r => r.name.startsWith(location.origin) && r.nextHopProtocol)?.nextHopProtocol;
  const NOMBRES = { h3: 'HTTP/3', h2: 'HTTP/2', 'http/1.1': 'HTTP/1.1' };
  v('proto').textContent = proto ? `protocolo ${NOMBRES[proto] || proto.toUpperCase()}` : 'protocolo no informado por el navegador';
  v('equipo').textContent = `${navigator.hardwareConcurrency || '?'} núcleos · ${screen.width}×${screen.height} @${fmt(devicePixelRatio, 1)}x`;

  function registrar(t) {
    const li = document.createElement('li');
    li.innerHTML = `<span>${hora()}</span>${esc(t)}`;
    log.prepend(li);
    while (log.children.length > 6) log.lastElementChild.remove();
  }

  async function medir() {
    if (!vivo) return;
    try {
      let ms, datos = null, cabeceras = null;
      if (servidor) {
        const t0 = performance.now();
        const r = await fetch(`${CONFIG.api || location.origin}/api/estado`, { cache: 'no-store' });
        ms = performance.now() - t0; datos = await r.json(); cabeceras = r.headers;
      } else {
        const t0 = performance.now();
        const r = await fetch(`assets/logo-datos.json?t=${Date.now()}`, { cache: 'no-store' });
        await r.text(); ms = performance.now() - t0; cabeceras = r.headers;
      }
      lat.push(ms); if (lat.length > 40) lat.shift();
      const prom = lat.reduce((a, b) => a + b, 0) / lat.length;
      const jit = Math.sqrt(lat.reduce((a, b) => a + (b - prom) ** 2, 0) / lat.length);
      v('lat').textContent = fmt(ms, 0);
      v('jit').textContent = `promedio ${fmt(prom, 0)} ms · variación ${fmt(jit, 1)} ms`;
      const pop = cabeceras?.get('x-amz-cf-pop'), ray = cabeceras?.get('cf-ray');
      v('cdn').textContent = pop ? `CloudFront · ${pop}` : ray ? `Cloudflare · ${ray.split('-').pop()}` : location.hostname === 'localhost' ? 'Directo · local' : 'Directo';
      if (datos) {
        const h = Math.floor(datos.activoSegundos / 3600), m = Math.floor((datos.activoSegundos % 3600) / 60);
        v('srv').textContent = `${datos.region} · en línea`;
        v('srv2').textContent = `activo ${h} h ${m} min · ${fmt(datos.peticiones)} peticiones · ${datos.memoriaMB} MB · ${datos.node}`;
      } else {
        v('srv').textContent = 'Hosting estático';
        v('srv2').textContent = 'sin servidor de experiencias conectado';
      }
      registrar(`${servidor ? 'GET /api/estado' : 'GET /assets/logo-datos.json'} · ${fmt(ms, 0)} ms`);
      for (let i = 0; i < 6; i++) luces.push({ fila: Math.floor(Math.random() * 6), x: 0, vel: 0.6 + Math.random() * 0.8 });
      dibujarCurva();
    } catch {
      registrar('sin respuesta del servidor');
    }
    if (vivo) setTimeout(medir, 1500);
  }

  function dibujarCurva() {
    const x = curva.getContext('2d'), W = curva.width, H = curva.height;
    x.clearRect(0, 0, W, H);
    if (lat.length < 2) return;
    const max = Math.max(...lat) * 1.2, min = 0;
    x.beginPath();
    lat.forEach((m, i) => { const px = (i / 39) * W, py = H - ((m - min) / (max - min || 1)) * H; i ? x.lineTo(px, py) : x.moveTo(px, py); });
    x.strokeStyle = ctx.color; x.lineWidth = 2 * (W / 400); x.stroke();
  }

  api.comprobar().then(hay => { servidor = hay; medir(); });
  return {
    cuadro(dt) {
      cuadros++; tFps += dt;
      if (tFps > 1) { v('fps').textContent = fmt(cuadros / tFps, 0); cuadros = 0; tFps = 0; }
      reloj += dt;
      const x = rack.getContext('2d'), W = rack.width, H = rack.height;
      x.fillStyle = '#05050a'; x.fillRect(0, 0, W, H);
      const filas = 6, alto = H / filas;
      for (let f = 0; f < filas; f++) {
        x.fillStyle = 'rgba(255,255,255,.05)'; x.fillRect(8, f * alto + 4, W - 16, alto - 8);
        for (let k = 0; k < 40; k++) { x.fillStyle = 'rgba(255,255,255,.08)'; x.fillRect(16 + k * ((W - 32) / 40), f * alto + alto / 2 - 2, 4, 4); }
      }
      for (let i = luces.length - 1; i >= 0; i--) {
        const l = luces[i];
        l.x += l.vel * dt;
        if (l.x > 1) { luces.splice(i, 1); continue; }
        x.fillStyle = ctx.color;
        x.shadowColor = ctx.color; x.shadowBlur = 12;
        x.fillRect(16 + l.x * (W - 32), l.fila * alto + alto / 2 - 3, 10, 6);
        x.shadowBlur = 0;
      }
    },
    desmontar() { vivo = false; },
  };
}

// =====================================================================
// Haxion · Ponte a prueba
// =====================================================================
const CORREOS = [
  { de: 'Soporte Banco Ejemplo', dir: 'seguridad@banco-ejemplo-verificacion.co', asunto: 'Tu cuenta será suspendida en 24 horas', texto: 'Detectamos actividad inusual. Confirma tu usuario y clave aquí para evitar el bloqueo.', enlace: 'http://banco-ejemplo.verificar-cuenta.co/login', falso: true, porque: 'Urgencia, dominio que no es el del banco y te pide la clave. Un banco nunca la pide por correo.' },
  { de: 'Envíos Demo', dir: 'notificaciones@enviosdemo.com', asunto: 'Tu paquete fue entregado', texto: 'Tu pedido llegó hoy a las 3:12 p. m. Puedes ver el detalle en la app oficial.', enlace: '', falso: false, porque: 'No pide datos ni da enlaces raros: solo informa y remite a la app oficial.' },
  { de: 'Nube Demo', dir: 'no-reply@nube-dem0.com', asunto: 'Compartieron un archivo contigo: Factura_pendiente.zip', texto: 'Abre el adjunto para revisar la factura antes del cierre del mes.', enlace: '', falso: true, porque: 'El dominio usa un cero en lugar de la «o» y trae un .zip inesperado: un clásico para instalar malware.' },
  { de: 'Tienda Demo', dir: 'pedidos@tiendademo.com', asunto: 'Recibo de tu compra', texto: 'Gracias por tu compra. El detalle está en tu cuenta, entrando como siempre desde la app.', enlace: '', falso: false, porque: 'Remitente coherente, sin urgencia y sin enlaces para iniciar sesión.' },
  { de: 'Director General', dir: 'director.general.urgente@correo-demo.com', asunto: 'Necesito una transferencia urgente y confidencial', texto: 'Estoy en una reunión. Haz el pago a este proveedor hoy y no lo comentes con nadie.', enlace: '', falso: true, porque: 'Fraude del «jefe»: correo personal, urgencia y secreto. Siempre confirma por otro canal.' },
  { de: 'Recursos Humanos', dir: 'rrhh@tuempresa-demo.com', asunto: 'Actualiza tu nómina antes del viernes', texto: 'Entra al nuevo portal para confirmar tu cuenta bancaria.', enlace: 'https://portal-tuempresa-demo.net/nomina', falso: true, porque: 'El enlace lleva a un dominio distinto al de la empresa y pide datos bancarios.' },
];
const COMUNES = ['123456', '12345678', '123456789', 'password', 'contrasena', 'qwerty', '111111', 'abc123', 'iloveyou', 'admin', 'welcome', 'letmein', '000000', 'hola123', 'teamo', 'dominicana', 'republica', 'haxelera', 'santo', 'domingo', 'futbol', 'amor', 'familia', 'dios'];
const SECUENCIAS = ['abcdefghijklmnopqrstuvwxyz', '0123456789', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

// Estimación local de la fuerza de una clave. No sale del navegador.
function evaluarClave(c) {
  const fallas = [];
  let pool = 0;
  if (/[a-z]/.test(c)) pool += 26;
  if (/[A-Z]/.test(c)) pool += 26;
  if (/\d/.test(c)) pool += 10;
  if (/[^A-Za-z0-9]/.test(c)) pool += 33;
  let bits = c.length * Math.log2(Math.max(pool, 1));
  const baja = c.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  if (COMUNES.some(w => baja.includes(w))) { bits = Math.min(bits, 12); fallas.push('Contiene una palabra o clave muy común.'); }
  if (/(.)\1{2,}/.test(c)) { bits -= 10; fallas.push('Repite el mismo carácter varias veces.'); }
  for (const s of SECUENCIAS) for (let i = 0; i + 3 <= s.length; i++) if (baja.includes(s.slice(i, i + 3))) { bits -= 6; fallas.push('Tiene una secuencia fácil (como «abc», «123» o «qwe»).'); i = s.length; }
  if (/(19|20)\d{2}/.test(c)) { bits -= 8; fallas.push('Incluye un año: es de lo primero que se prueba.'); }
  if (c.length < 12) fallas.push('Es corta: usa 12 caracteres o más.');
  if (pool <= 36) fallas.push('Mezcla mayúsculas, minúsculas, números y símbolos.');
  bits = Math.max(0, bits);
  const segundos = Math.pow(2, bits) / 2 / 1e10; // ataque fuera de línea a 10 mil millones de intentos por segundo
  const nivel = bits < 28 ? 0 : bits < 40 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4;
  return { bits, segundos, nivel, fallas: [...new Set(fallas)] };
}
function tiempoHumano(s) {
  if (s < 1) return 'al instante';
  const u = [['segundos', 60], ['minutos', 60], ['horas', 24], ['días', 365], ['años', 100], ['siglos', 1e7]];
  let v = s;
  for (const [n, k] of u) { if (v < k) return `${fmt(v, 0)} ${n}`; v /= k; }
  return 'más que la edad del universo';
}
const ESCENARIOS = [
  { t: 'Ana, de finanzas, entra a la nómina desde su laptop de la empresa, con doble factor y desde la oficina.', ok: 'permitir', porque: 'Identidad verificada, equipo de confianza y acceso solo a lo que su rol necesita.' },
  { t: 'Un usuario válido entra desde un país nuevo a las 3 a. m. y pide descargar toda la base de clientes.', ok: 'bloquear', porque: 'Comportamiento anómalo y una petición masiva: se bloquea y se investiga.' },
  { t: 'Un técnico conocido pide permisos de administrador desde un equipo sin actualizaciones de seguridad.', ok: 'verificar', porque: 'La persona es válida, pero el equipo no cumple. Primero se actualiza y se da acceso temporal.' },
  { t: 'Una app interna pide leer la base de datos de pagos, que nunca había usado.', ok: 'bloquear', porque: 'Mínimo privilegio: si no lo necesita para su función, no lo obtiene.' },
  { t: 'Carlos escribe su clave correcta, pero sin segundo factor, desde la red de un café.', ok: 'verificar', porque: 'Una clave sola no basta en una red pública: se pide el segundo factor.' },
];

function desafios(cont, ctx) {
  cont.innerHTML = `
    <div class="xp-cab">
      <p class="mono xp-num">04 · Haxion · Ponte a prueba</p>
      <h3 class="xp-titulo">¿Pasarías el filtro de Haxion?</h3>
      <p class="xp-nota">Tres desafíos rápidos. Todo ocurre en tu navegador: nada se envía ni se guarda.</p>
    </div>
    <div class="des-tabs mono" role="tablist">
      <button type="button" role="tab" aria-selected="true" data-tab="correo">01 · Correo falso</button>
      <button type="button" role="tab" aria-selected="false" data-tab="clave">02 · Tu contraseña</button>
      <button type="button" role="tab" aria-selected="false" data-tab="zt">03 · Laberinto Zero Trust</button>
    </div>
    <section class="des-panel" data-panel="correo">
      <p class="mono des-marcador">Aciertos <b>0</b> / ${CORREOS.length}</p>
      <ol class="des-correos">${CORREOS.map((m, i) => `
        <li class="des-correo" data-i="${i}">
          <div class="des-de"><b>${esc(m.de)}</b><span>&lt;${esc(m.dir)}&gt;</span></div>
          <p class="des-asunto">${esc(m.asunto)}</p>
          <p class="des-texto">${esc(m.texto)}${m.enlace ? ` <u>${esc(m.enlace)}</u>` : ''}</p>
          <div class="des-botones"><button type="button" class="boton boton-fantasma" data-r="seguro">Es seguro</button><button type="button" class="boton boton-fantasma" data-r="falso">Es falso</button></div>
          <p class="des-porque"></p>
        </li>`).join('')}
      </ol>
    </section>
    <section class="des-panel" data-panel="clave" hidden>
      <label class="des-label" for="des-clave">Escribe una clave <em>inventada</em>, parecida a las que usas</label>
      <div class="des-campo"><input id="des-clave" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" maxlength="128"><button type="button" class="mono des-ver" aria-pressed="false">Ver</button></div>
      <div class="des-medidor"><i></i><i></i><i></i><i></i><i></i></div>
      <p class="des-tiempo">Escribe para medir.</p>
      <ul class="des-fallas"></ul>
      <p class="mono des-privado">Se calcula en tu equipo. No se envía ni se guarda.</p>
    </section>
    <section class="des-panel" data-panel="zt" hidden>
      <div class="zt-camino" aria-hidden="true">${ESCENARIOS.map(() => '<i></i>').join('')}<b class="zt-paquete"></b></div>
      <p class="mono zt-paso">Puerta <b>1</b> / ${ESCENARIOS.length}</p>
      <p class="zt-texto"></p>
      <div class="zt-botones"><button type="button" class="boton boton-fantasma" data-r="permitir">Permitir</button><button type="button" class="boton boton-fantasma" data-r="verificar">Pedir verificación</button><button type="button" class="boton boton-fantasma" data-r="bloquear">Bloquear</button></div>
      <p class="zt-porque" role="status"></p>
      <button type="button" class="boton boton-fantasma zt-otra" hidden>Intentar de nuevo</button>
    </section>`;
  const $ = (s) => cont.querySelector(s);

  // Pestañas
  cont.querySelector('.des-tabs').addEventListener('click', (e) => {
    const b = e.target.closest('[data-tab]');
    if (!b) return;
    cont.querySelectorAll('[data-tab]').forEach(t => t.setAttribute('aria-selected', String(t === b)));
    cont.querySelectorAll('.des-panel').forEach(p => { p.hidden = p.dataset.panel !== b.dataset.tab; });
    ctx.sonido?.tic();
  });

  // 01 · Correos
  let aciertos = 0;
  cont.querySelector('.des-correos').addEventListener('click', (e) => {
    const b = e.target.closest('[data-r]');
    const li = e.target.closest('.des-correo');
    if (!b || !li || li.classList.contains('respondido')) return;
    const m = CORREOS[Number(li.dataset.i)];
    const bien = (b.dataset.r === 'falso') === m.falso;
    if (bien) aciertos++;
    li.classList.add('respondido', bien ? 'bien' : 'mal');
    li.querySelector('.des-porque').textContent = `${bien ? '✓ Bien.' : '✗ Ojo.'} ${m.falso ? 'Era falso: ' : 'Era seguro: '}${m.porque}`;
    $('.des-marcador b').textContent = aciertos;
    ctx.sonido?.tic();
  });

  // 02 · Clave
  const campo = $('#des-clave'), barras = [...cont.querySelectorAll('.des-medidor i')];
  const NIVELES = ['Muy débil', 'Débil', 'Aceptable', 'Fuerte', 'Muy fuerte'];
  campo.addEventListener('input', () => {
    const c = campo.value;
    if (!c) { barras.forEach(b => b.className = ''); $('.des-tiempo').textContent = 'Escribe para medir.'; $('.des-fallas').innerHTML = ''; return; }
    const r = evaluarClave(c);
    barras.forEach((b, i) => { b.className = i <= r.nivel ? `n${r.nivel}` : ''; });
    $('.des-tiempo').innerHTML = `<b>${NIVELES[r.nivel]}</b> · descifrarla tomaría <b>${tiempoHumano(r.segundos)}</b>`;
    $('.des-fallas').innerHTML = r.fallas.length ? r.fallas.map(f => `<li>${esc(f)}</li>`).join('') : '<li class="ok">Sin debilidades evidentes. Úsala solo en un sitio y guárdala en un gestor de claves.</li>';
  });
  $('.des-ver').addEventListener('click', (e) => {
    const ver = campo.type === 'password';
    campo.type = ver ? 'text' : 'password';
    e.currentTarget.setAttribute('aria-pressed', String(ver));
    e.currentTarget.textContent = ver ? 'Ocultar' : 'Ver';
  });

  // 03 · Laberinto Zero Trust
  let paso = 0, puntos = 0;
  const puertas = [...cont.querySelectorAll('.zt-camino i')];
  function mostrar() {
    if (paso >= ESCENARIOS.length) {
      $('.zt-paso').innerHTML = `Resultado <b>${puntos}</b> / ${ESCENARIOS.length}`;
      $('.zt-texto').textContent = puntos === ESCENARIOS.length ? 'Pensamiento Zero Trust impecable: nunca confiar, siempre verificar.' : 'Zero Trust es simple de decir y difícil de aplicar. Para eso está Haxion.';
      cont.querySelector('.zt-botones').hidden = true;
      $('.zt-otra').hidden = false;
      return;
    }
    $('.zt-paso').innerHTML = `Puerta <b>${paso + 1}</b> / ${ESCENARIOS.length}`;
    $('.zt-texto').textContent = ESCENARIOS[paso].t;
    // El paquete se centra sobre cada puerta (triángulos de 34 px repartidos de borde a borde).
    $('.zt-paquete').style.left = `calc(${paso / (ESCENARIOS.length - 1)} * (100% - 34px) + 10px)`;
  }
  cont.querySelector('.zt-botones').addEventListener('click', (e) => {
    const b = e.target.closest('[data-r]');
    if (!b || paso >= ESCENARIOS.length) return;
    const s = ESCENARIOS[paso];
    const bien = b.dataset.r === s.ok;
    if (bien) puntos++;
    puertas[paso].className = bien ? 'bien' : 'mal';
    $('.zt-porque').textContent = `${bien ? '✓' : '✗'} ${s.porque}`;
    ctx.sonido?.tic();
    paso++;
    setTimeout(mostrar, 900);
  });
  $('.zt-otra').addEventListener('click', () => {
    paso = 0; puntos = 0;
    puertas.forEach(p => { p.className = ''; });
    $('.zt-porque').textContent = '';
    $('.zt-otra').hidden = true;
    cont.querySelector('.zt-botones').hidden = false;
    mostrar();
  });
  mostrar();
  return { cuadro() {}, desmontar() {} };
}

export const EXPERIENCIAS = { encuesta, estado, desafios };
export { visitante };
