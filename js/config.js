// Datos de contacto del sitio. Mientras estén vacíos, los botones avisan que faltan.
export const CONFIG = {
  correo: '',    // por ejemplo: 'contacto@haxeleragroup.com'
  whatsapp: '',  // solo dígitos con código de país, por ejemplo: '18095551234'

  // Servidor de las experiencias en vivo (agente, encuesta, estado). Vacío = mismo dominio que el sitio.
  api: '',
};

// Encuesta viva de Nexel Data: la pregunta del mes. Cambiar «id» al cambiar la pregunta (reinicia los votos).
export const ENCUESTA = {
  id: '2026-10',
  pregunta: '¿Qué tecnología impulsará más a tu empresa el próximo año?',
  opciones: ['Inteligencia artificial', 'Ciberseguridad', 'Nube', 'Automatización', 'Análisis de datos'],
};
