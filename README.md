# haxeleragroup.com

Sitio inmersivo de Haxelera Group SRL. Es un solo lienzo WebGL detrás de la página: al hacer scroll, la cámara viaja desde el logo cromado, cruza el «A» como un portal, atraviesa un túnel de código y recorre seis estaciones, una por servicio. Al final, el logo se vuelve a armar con partículas.

No usa modelos 3D ni imágenes externas. Todo se genera con código: el logo se vectorizó a partir de la imagen original y se extruye en cromo iridiscente, y los objetos, los reflejos, el sonido y las texturas se crean en el navegador.

## Probarlo en tu Mac

```bash
cd ~/Documents/haxelera-web
python3 -m http.server 8080
```

Abre http://localhost:8080. Tiene que servirse por HTTP; abrir `index.html` con doble clic no funciona.

Así el sitio corre completo, pero las experiencias en vivo quedan en modo sin conexión (ver «Experiencias en vivo»). Para probarlas con su servidor (Node 18 o más nuevo, sin instalar nada):

```bash
cd ~/Documents/haxelera-web
npm run servidor
```

Abre http://localhost:8090.

Parámetros útiles:

- `?calidad=alta|media|baja` fuerza un nivel de calidad. Sin el parámetro, el sitio lo detecta solo.
- `?depurar` entra directo y expone en la consola `haxelera.ir('seguridad')`, `haxelera.irDim(3)`, `haxelera.abrirPerfil(3)`, `haxelera.irCaso(2)`, `haxelera.abrirTrabajo(3, 0)` y `haxelera.abrirExperiencia(4)` para saltar. Es solo para pruebas.

## Publicar

El sitio está en vivo en **haxeleragroup.com** desde el 17 oct 2026.

- Lo sirve la app de Amplify **haxelera-site** (región us-east-2), conectada al repositorio de GitHub `VALANTHAY/haxelera-site`, rama `main`. Cada `git push` a `main` se publica solo en uno o dos minutos.
- `amplify.yml` copia solo `index.html`, `css`, `js` y `assets` (el servidor y esta documentación no se sirven).
- `customHttp.yml` pone la CSP y las cabeceras de seguridad. Si cambian los scripts en línea del `index.html`, vuelve a generarlo con `node servidor/cabeceras-amplify.mjs` antes de subir.
- El sitio anterior (React) quedó en la etiqueta `sitio-react-2026-06` del repositorio, por si hay que volver.
- Esta carpeta es el repositorio (conectada a `origin`, rama `main`): para publicar, `git add`, `git commit` y `git push` desde aquí.

Pendiente:

1. Escribir el correo y el WhatsApp en `js/config.js`. Mientras estén vacíos, los botones de contacto muestran un aviso.
2. Revisar los textos de servicios, proyectos, empresas y pilares, porque hablan por la empresa.
3. Para Alyxia con IA real y los votos compartidos de la encuesta, montar `servidor/servidor.mjs` aparte (por ejemplo, en una función o un contenedor) y poner su dirección en `CONFIG.api`.

## El recorrido

1. **Intro**: el logo completo se llena de abajo arriba con el progreso real de carga.
2. **Inicio**: solo el logo en cromo, sobre negro puro (sin estrellas, desde el 17 oct 2026). El hilo de energía marca el triángulo grande.
3. **Portal**: la cámara entra justo por el centro del triángulo a un túnel triangular de código. Al cruzarlo, «Tecnología de otra dimensión» aparece letra por letra y se muestra la navegación.
4. **Ecosistema**: las nueve empresas del grupo. Cada una es una dimensión con su propio fondo animado y un portal triangular con su nombre en el centro. El scroll frena frente a cada portal; al tocarlo se entra al perfil de la empresa.
5. **Equipo**: un laboratorio con personas holográficas. A la izquierda programan y a la derecha vigilan la seguridad, con pantallas vivas.
6. **Servicios**: seis estaciones 3D. Entre estación y estación se cruza un pasadizo distinto: circuito de luz, hexágonos, pantallas, láser de seguridad, servidores y flujo de datos.
7. **Proceso**: cinco puertas triangulares.
8. **Proyectos**: carrusel curvo de tarjetas de vidrio, al estilo de Active Theory. Cada tarjeta se abre a pantalla completa.
9. **Contacto**: el logo se vuelve a armar con partículas.

## Las empresas del grupo

Están en `js/empresas.js`. Cada empresa tiene nombre, mundo, colores, área, lema, una descripción corta, cuatro pilares y tres trabajos con su animación.

- El área y el lema son los del grupo.
- La descripción, los pilares y los tres trabajos son una propuesta. Hay que revisarlos antes de publicar.

En el recorrido, cada empresa es solo su portal: un triángulo que se dibuja solo, con dos triángulos interiores que se mecen en 3D, ondas que salen del marco y chispas que corren por el borde. El nombre está en el centro (letras que llegan desde el espacio y un destello cromado que las recorre). Ningún objeto del fondo tapa el triángulo: cada mundo deja despejado un cono de visión desde la parada.

Al entrar (el triángulo, el botón «Entrar a…» o la barra de triángulos de abajo para saltar entre empresas), la cámara cruza el portal y se abre el **perfil** (`js/perfil.js`):

1. Portada: nombre, área y lema.
2. Quiénes somos.
3. Pilares: cuatro por empresa.
4. Trabajos: la columna vertebral de cromo gira con el scroll y la tarjeta de cada trabajo queda de frente cuando su fila pasa por el centro (`js/trabajos.js` dibuja sus animaciones). Cada trabajo, o su tarjeta 3D, abre una minipágina viva.
5. En vivo: la experiencia de la empresa, si tiene.
6. Siguiente dimensión: se pasa a la otra empresa sin salir; la cámara vuela hasta su mundo.

Las minipáginas están marcadas como simulación. El plan para volverlas reales está en `~/Documents/haxelera-docs/plan-experiencias.md`. **Los pilares son una propuesta: hay que revisarlos.**

## Experiencias en vivo

Cuatro empresas tienen una experiencia real, no simulada. Se abren con el botón que aparece bajo el lema de su dimensión.

| Empresa | Experiencia | Con servidor | Sin servidor |
| --- | --- | --- | --- |
| Nexora | **Alyxia**, la asistente de IA (también en el botón fijo «Pregúntale a Alyxia»). Responde por texto o por voz y lleva la cámara a cualquier parte del sitio | Con `ANTHROPIC_API_KEY`, responde con un modelo de IA; sin clave, en modo local | Modo local: responde con la información del sitio |
| Nexel Data | **Encuesta viva**: una pregunta, votos de todos al instante (SSE) e intervalo de confianza del 95 %. Cada voto hace latir la ciudad de datos | Votos compartidos, uno por navegador, guardados en `servidor/datos/` | El voto queda solo en ese equipo |
| Xelera Cloud | **Estado en vivo**: latencia real, ruta (CDN), protocolo, tiempos de carga, peso transferido, cuadros por segundo y estado del servidor | Todo | Todo, menos los datos del servidor |
| Haxion | **Ponte a prueba**: correo falso, fuerza de una contraseña y laberinto Zero Trust | Igual | Igual: todo ocurre en el navegador y no se envía nada |

- Alyxia siempre dice que es una IA y avisa que no se compartan datos sensibles. Las conversaciones no se guardan.
- Los correos del desafío usan marcas inventadas (Banco Ejemplo, Envíos Demo…), no marcas reales.
- La pregunta de la encuesta está en `js/config.js` (`ENCUESTA`). Para una pregunta nueva, cambia también su `id`: así empieza de cero.

### Variables del servidor

| Variable | Para qué |
| --- | --- |
| `PUERTO` | Puerto HTTP (8090 por defecto) |
| `ANTHROPIC_API_KEY` | Activa la IA de Alyxia. La pones tú en el servicio donde corra el servidor; nunca va en el código ni en el navegador |
| `AGENTE_MODELO` | Modelo de IA (por defecto `claude-haiku-5-5`) |
| `REGION` | Nombre de la región que se muestra en «Estado en vivo» |
| `ORIGENES` | Si el sitio y el servidor están en dominios distintos, los orígenes permitidos separados por coma. En ese caso, pon la dirección del servidor en `CONFIG.api` (`js/config.js`) |

El servidor manda cabeceras de seguridad (CSP con huellas de los scripts, `nosniff`, `frame-ancestors 'none'`, HSTS cuando llega por HTTPS), limita las peticiones por IP (20 por minuto a Alyxia y 12 votos por hora) y no sirve sus propios archivos, los `.md` ni los archivos ocultos.

## Estructura

| Archivo | Qué hace |
| --- | --- |
| `index.html` | Contenido real y semántico (lo leen Google y los lectores de pantalla) y los metadatos para compartir |
| `css/estilos.css` | Interfaz: navegación de vidrio, tarjetas, tipografía y adaptación a celular |
| `js/main.js` | Cargador, scroll → cámara, letras, ecosistema, carrusel, vista de proyecto, reproductor y contacto |
| `js/ruta.js` | El recorrido: qué profundidad corresponde a cada sección y qué pasadizo sigue |
| `js/escena.js` | Mundo 3D: logo, portal, túnel, océano, laboratorio, pasadizos y postproceso |
| `js/empresas.js` | Las nueve empresas del grupo: área, lema, texto, pilares y trabajos |
| `js/dimensiones.js` | Los nueve mundos del ecosistema, sus portales triangulares y la columna de cada empresa |
| `js/perfil.js` | El perfil de cada empresa: portada, quiénes somos, pilares, trabajos con su columna, en vivo y siguiente dimensión |
| `js/trabajos.js` | Las tarjetas animadas de los trabajos de cada empresa |
| `js/minisitio.js` | Las minipáginas vivas de cada trabajo: pasadizo de entrada, escena, monitor, actividad y acción |
| `js/experiencias.js` | Experiencias en vivo: encuesta de Nexel Data, estado de Xelera Cloud y desafíos de Haxion |
| `js/agente.js` | Alyxia, la asistente de IA: panel, voz y viajes de cámara |
| `js/conocimiento.js` | Lo que sabe Alyxia (sale de los datos del sitio) y sus respuestas en modo local |
| `js/api.js` | Cliente de la API, con modo sin conexión |
| `js/config.js` | Correo, WhatsApp, dirección de la API y la pregunta de la encuesta |
| `servidor/servidor.mjs` | Servidor sin dependencias: sitio, API de Alyxia, encuesta en tiempo real y estado |
| `js/pasadizos.js` | Los portales entre estaciones |
| `js/personas.js` | Puestos de trabajo con personas holográficas y pantallas vivas |
| `js/carrusel.js` | Carrusel de proyectos |
| `js/objetos.js` | Los seis objetos de los servicios |
| `js/shaders.js` | Sombreadores GLSL propios |
| `js/audio.js` | Sonido generativo con tres pistas (apagado por defecto) |
| `assets/` | Logo vectorizado, símbolo, favicon e imagen para compartir |

## Rendimiento y accesibilidad

- Hay tres niveles de calidad. Si el equipo baja de ~46 cuadros por segundo, el sitio reduce su resolución interna por su cuenta.
- Con «reducir movimiento» activado se quitan los destellos, la aberración y los rayos de velocidad.
- Sin WebGL el sitio sigue funcionando en un modo ligero, con el logo plano y todo el contenido.
- Three.js r169 se carga desde jsDelivr con la versión fijada.
