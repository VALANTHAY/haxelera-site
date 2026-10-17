// Recorrido de la cámara. Cada sección de la página es un tramo del viaje:
// cuando el centro de la pantalla recorre la sección, la cámara va de z0 a z1.
// «meseta» frena en el centro del tramo (ahí se lee el texto); «lineal» vuela parejo;
// «pausa» casi se detiene mientras el contenido de la sección está fijo en pantalla;
// «fijada» avanza mientras el contenido está fijo (entra y sale con «entrada» unidades); con «pasos»,
// frena en cada parada: en el ecosistema, una frente a cada portal.
// Las estaciones (objeto) quedan en el punto medio del tramo, del lado indicado
// (−1 izquierda, 1 derecha); el texto va del lado contrario.
// «pasadizo» es el portal que se cruza al salir de ese tramo hacia el siguiente.
export const RUTA = [
  { id: 'inicio',     etiqueta: 'Inicio',     z0: 22,   z1: 6,    curva: 'meseta' },
  { id: 'portal',     etiqueta: 'Portal',     z0: 6,    z1: -44,  curva: 'lineal' },
  { id: 'nosotros',   etiqueta: 'Nosotros',   z0: -44,  z1: -72,  curva: 'meseta' },
  { id: 'ecosistema', etiqueta: 'Ecosistema', z0: -72,  z1: -300, curva: 'fijada', entrada: 12, pasos: 9 },
  { id: 'equipo',     etiqueta: 'Equipo',     z0: -300, z1: -340, curva: 'meseta', pasadizo: 'circuito' },
  { id: 'software',   etiqueta: 'Software',   z0: -340, z1: -375, curva: 'meseta', objeto: 'nucleo',   lado: -1, pasadizo: 'hexagono' },
  { id: 'apps',       etiqueta: 'Apps',       z0: -375, z1: -410, curva: 'meseta', objeto: 'telefono', lado: 1,  pasadizo: 'pantallas' },
  { id: 'web',        etiqueta: 'Web',        z0: -410, z1: -445, curva: 'meseta', objeto: 'capas',    lado: -1, pasadizo: 'laser' },
  { id: 'seguridad',  etiqueta: 'Seguridad',  z0: -445, z1: -480, curva: 'meseta', objeto: 'escudo',   lado: 1,  pasadizo: 'servidores' },
  { id: 'cloud',      etiqueta: 'Cloud',      z0: -480, z1: -515, curva: 'meseta', objeto: 'infinito', lado: -1, pasadizo: 'datos' },
  { id: 'ia',         etiqueta: 'Datos e IA', z0: -515, z1: -550, curva: 'meseta', objeto: 'red',      lado: 1 },
  { id: 'proceso',    etiqueta: 'Proceso',    z0: -550, z1: -598, curva: 'lineal' },
  { id: 'proyectos',  etiqueta: 'Proyectos',  z0: -598, z1: -624, curva: 'pausa' },
  { id: 'contacto',   etiqueta: 'Contacto',   z0: -624, z1: -648, curva: 'meseta' },
];

// Fin del recorrido: el océano, el polvo y los rayos se extienden hasta aquí.
export const Z_FINAL = -730;
