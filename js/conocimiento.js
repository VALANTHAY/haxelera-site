// Conocimiento de Alyxia, la asistente de IA del sitio. Sale de la información real del sitio (empresas, servicios,
// proceso) para no inventar nada. Lo usan el navegador (modo local) y el servidor (instrucciones del modelo de IA).
import { EMPRESAS } from './empresas.js';

const SERVICIOS = [
  { id: 'software', nombre: 'Software a medida', claves: ['software', 'sistema', 'crm', 'erp', 'plataforma', 'programacion', 'programar', 'api'], texto: 'Sistemas que se adaptan a tu operación: plataformas de gestión, CRM y ERP, integraciones y APIs.' },
  { id: 'apps', nombre: 'Aplicaciones móviles', claves: ['app', 'apps', 'aplicacion', 'movil', 'celular', 'ios', 'android', 'iphone'], texto: 'Apps para iOS y Android rápidas, fluidas y capaces de trabajar sin conexión.' },
  { id: 'web', nombre: 'Desarrollo web', claves: ['web', 'pagina', 'sitio', 'tienda', 'ecommerce', 'seo', '3d', 'webgl'], texto: 'Sitios y plataformas web de alto rendimiento, experiencias 3D, comercio electrónico y paneles en tiempo real.' },
  { id: 'seguridad', nombre: 'Ciberseguridad', claves: ['seguridad', 'ciberseguridad', 'hacker', 'ataque', 'pentest', 'intrusion', 'proteger'], texto: 'Auditorías, pruebas de intrusión autorizadas, endurecimiento de servidores y monitoreo.' },
  { id: 'cloud', nombre: 'Cloud y DevOps', claves: ['nube', 'cloud', 'aws', 'servidor', 'servidores', 'devops', 'respaldo', 'hosting'], texto: 'Infraestructura en la nube, despliegue continuo y respaldos automáticos.' },
  { id: 'ia', nombre: 'Datos e inteligencia artificial', claves: ['datos', 'inteligencia', 'ia', 'analitica', 'tablero', 'machine', 'modelo'], texto: 'Tableros en vivo, analítica avanzada y automatización con inteligencia artificial.' },
];

// Lugares a los que la asistente puede llevar la cámara.
export const DESTINOS = [
  'inicio', 'nosotros', 'ecosistema', 'equipo', 'software', 'apps', 'web', 'seguridad', 'cloud', 'ia', 'proceso', 'proyectos', 'contacto',
  ...EMPRESAS.map((_, k) => `dimension-${k}`),
];

export const normalizar = (t) => String(t).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const saludo = 'Hola, soy Alyxia, la asistente de inteligencia artificial del Grupo Haxelera. Puedo contarte sobre nuestras nueve empresas y nuestros servicios, o llevarte a cualquier parte del sitio.';

function entradas() {
  const lista = [
    { claves: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'saludos', 'hey'], respuesta: saludo, destino: null, peso: 1.5 },
    { claves: ['eres humano', 'eres una persona', 'eres un robot', 'eres ia', 'eres real', 'quien eres', 'que eres', 'como te llamas', 'tu nombre', 'quien es alyxia', 'que es alyxia'], respuesta: 'Soy Alyxia, una inteligencia artificial, no una persona. Si prefieres hablar con el equipo, te llevo a Contacto.', destino: null, peso: 2 },
    { claves: ['grupo', 'empresas', 'ecosistema', 'cuantas empresas', 'subempresas', 'filiales'], respuesta: `El Grupo Haxelera reúne nueve empresas: ${EMPRESAS.map(e => e.nombre).join(', ')}. Cada una es una dimensión del sitio. Te llevo al ecosistema.`, destino: 'ecosistema', peso: 1 },
    { claves: ['quienes son', 'quienes somos', 'nosotros', 'haxelera group', 'que hacen'], respuesta: 'Somos un equipo de ingeniería que convierte ideas complejas en productos rápidos, bellos y seguros: software, apps, web, nube, datos y ciberseguridad.', destino: 'nosotros', peso: 1 },
    { claves: ['equipo', 'personas', 'trabajan', 'programadores', 'ingenieros'], respuesta: 'Nuestro equipo programa y protege cada proyecto. Te llevo al laboratorio donde lo ves en acción.', destino: 'equipo', peso: 1 },
    { claves: ['proceso', 'como trabajan', 'metodologia', 'pasos', 'etapas'], respuesta: 'Trabajamos en cinco etapas: descubrir, diseñar, construir, blindar, y lanzar y escalar. Te las muestro.', destino: 'proceso', peso: 1 },
    { claves: ['proyectos', 'casos', 'portafolio', 'trabajos realizados', 'que han hecho'], respuesta: 'Construimos plataformas de gestión, apps de campo, analítica y encuestas, experiencias web 3D, nube y automatización con IA. Te llevo a los proyectos.', destino: 'proyectos', peso: 1 },
    { claves: ['precio', 'costo', 'cuanto cuesta', 'cotizar', 'cotizacion', 'presupuesto', 'contratar', 'contacto', 'hablar con alguien', 'correo', 'whatsapp'], respuesta: 'Cada proyecto depende de su alcance. Cuéntanos tu idea y te respondemos con un plan claro, tiempos y presupuesto. Te llevo a Contacto.', destino: 'contacto', peso: 1.2 },
  ];
  EMPRESAS.forEach((e, k) => {
    const palabras = normalizar(`${e.area}`).split(/[^a-z0-9]+/).filter(w => w.length > 4);
    lista.push({
      claves: [normalizar(e.nombre), ...normalizar(e.nombre).split(' ').filter(w => w.length > 4 && w !== 'haxelera'), ...palabras, ...e.trabajos.map(t => normalizar(t.titulo))],
      respuesta: `${e.nombre}: ${e.area}. ${e.texto} Te llevo a su dimensión.`,
      destino: `dimension-${k}`,
      peso: 1.4,
      nombre: normalizar(e.nombre),
    });
  });
  SERVICIOS.forEach(s => lista.push({ claves: s.claves, respuesta: `${s.nombre}: ${s.texto} Te llevo ahí.`, destino: s.id, peso: 0.9 }));
  return lista;
}
const ENTRADAS = entradas();

export const SUGERENCIAS = ['¿Qué empresas forman el grupo?', 'Llévame a Haxion', '¿Cómo trabajan?', 'Quiero cotizar un proyecto'];

// Respuesta sin modelo de IA: busca la entrada que mejor coincide con lo que se pidió.
export function responderLocal(texto) {
  const t = ` ${normalizar(texto)} `;
  let mejor = null, puntos = 0;
  for (const e of ENTRADAS) {
    let p = 0;
    for (const c of e.claves) if (c && t.includes(c.length > 3 ? c : ` ${c} `)) p += c.length > 6 ? 2 : 1;
    if (e.nombre && t.includes(e.nombre)) p += 6;
    p *= e.peso;
    if (p > puntos) { puntos = p; mejor = e; }
  }
  if (!mejor || puntos < 1) {
    return { respuesta: 'Puedo contarte sobre las nueve empresas del grupo, nuestros servicios o nuestro proceso, y llevarte a cualquier parte del sitio. ¿Qué te interesa?', destino: null };
  }
  return { respuesta: mejor.respuesta, destino: mejor.destino };
}

// Instrucciones para el modelo de IA del servidor.
export function instruccionesSistema() {
  const empresas = EMPRESAS.map((e, k) => `- dimension-${k} · ${e.nombre}: ${e.area}. Lema: «${e.lema}». ${e.texto} Trabajos: ${e.trabajos.map(t => t.titulo).join(', ')}.`).join('\n');
  const servicios = SERVICIOS.map(s => `- ${s.id} · ${s.nombre}: ${s.texto}`).join('\n');
  return `Eres Alyxia, la asistente de inteligencia artificial del sitio del Grupo Haxelera SRL. Eres una IA y lo dices si te preguntan.
Responde en el idioma de la persona (por defecto español), en un tono cercano y profesional, con un máximo de tres frases.
Usa SOLO esta información. Si no sabes algo, dilo y ofrece llevar a la persona a Contacto. Nunca inventes precios, clientes, cifras, ubicaciones ni promesas.
No pidas datos personales sensibles.

Empresas del grupo (cada una es una dimensión del sitio):
${empresas}

Servicios:
${servicios}

Proceso: descubrir, diseñar, construir, blindar, y lanzar y escalar.
Precios: dependen del alcance; el equipo responde con un plan claro, tiempos y presupuesto (sección contacto).

Puedes llevar a la persona a una parte del sitio. Destinos válidos: ${DESTINOS.join(', ')}.
Contesta SIEMPRE con un JSON y nada más: {"respuesta": "texto", "destino": "uno de los destinos o null"}.`;
}
