// Sombreadores GLSL del mundo de Haxelera.
import { Vector2, Color } from 'three';

// Ruido simplex 3D (Ashima Arts / Stefan Gustavson, licencia MIT).
export const RUIDO = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

// Paleta iridiscente pastel (lila, aqua, durazno, rosa).
export const IRIS = /* glsl */ `
vec3 iris(float t){
  vec3 c = 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
  return mix(c, vec3(1.0), 0.38);
}
`;

export const HASH = /* glsl */ `
float hash12(vec2 p){
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
`;

export const UV_V = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

// ---------- Entorno de reflexión (solo para generar el mapa PMREM) ----------
export const ENTORNO_V = /* glsl */ `
varying vec3 vDir;
void main(){
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;
export const ENTORNO_F = /* glsl */ `
varying vec3 vDir;
void main(){
  vec3 d = normalize(vDir);
  float y = d.y;
  float az = atan(d.z, d.x);
  vec3 c = mix(vec3(0.003, 0.003, 0.005), vec3(0.03, 0.03, 0.04), smoothstep(-0.6, 0.8, y));
  c += vec3(0.10, 0.10, 0.12) * exp(-pow((y - 0.04) * 7.0, 2.0));
  c += vec3(0.78, 0.58, 1.00) * exp(-pow((y - 0.55) * 9.0, 2.0)) * (0.5 + 0.5 * sin(az * 2.0)) * 0.9;
  c += vec3(0.45, 0.95, 1.00) * exp(-pow((y + 0.35) * 8.0, 2.0)) * (0.5 + 0.5 * cos(az * 3.0 + 1.0)) * 0.75;
  c += vec3(1.00, 0.78, 0.58) * exp(-pow((y - 0.24) * 12.0, 2.0)) * pow(max(0.0, sin(az + 2.2)), 6.0) * 1.3;
  // Cajas de luz de estudio detrás de la cámara: las caras planas del cromo las reflejan como vetas.
  float frente = smoothstep(0.0, 0.35, d.z);
  float s1 = 1.0 - smoothstep(0.0, 0.035, abs(d.x * 0.8 + d.y * 0.6 - 0.12));
  float s2 = 1.0 - smoothstep(0.0, 0.05, abs(d.x - d.y * 0.25 + 0.42));
  float s3 = 1.0 - smoothstep(0.0, 0.025, abs(d.y - 0.3));
  float s4 = 1.0 - smoothstep(0.0, 0.04, abs(d.x * 0.6 - d.y * 0.8 - 0.48));
  float s5 = 1.0 - smoothstep(0.0, 0.02, abs(d.x * 0.7 + d.y * 0.7 + 0.3));
  c += frente * (vec3(1.5) * s1 + vec3(0.8, 0.62, 1.1) * s2 + vec3(0.5, 0.95, 1.0) * s3 + vec3(1.1, 0.85, 0.66) * s4 + vec3(0.95) * s5);
  gl_FragColor = vec4(c, 1.0);
}
`;

// ---------- Anillo de energía del portal (el hueco del «A») ----------
export const PORTAL_F = /* glsl */ `
uniform float uTiempo, uIgnicion, uAparicion;
varying vec2 vUv;
${IRIS}
void main(){
  float a = fract(vUv.x * 3.0 - uTiempo * 0.22);
  float pulso = pow(a, 14.0) * 4.0;
  vec3 c = mix(iris(vUv.x + uTiempo * 0.05), vec3(1.0), 0.45) * (0.5 + pulso);
  gl_FragColor = vec4(c * uIgnicion * uAparicion, 1.0);
}
`;

// ---------- Polvo estelar ----------
export const POLVO_V = /* glsl */ `
uniform float uTiempo, uEscala;
attribute vec4 aRand;
varying float vA;
varying vec3 vC;
${IRIS}
void main(){
  vec3 p = position;
  p.y += sin(uTiempo * 0.22 + aRand.w * 6.2831) * 0.35;
  p.x += cos(uTiempo * 0.18 + aRand.z * 6.2831) * 0.25;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float d = max(-mv.z, 0.01);
  gl_PointSize = min((0.012 + aRand.x * 0.04) * uEscala / d, 48.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.55 + 0.45 * sin(uTiempo * (0.6 + aRand.y * 2.0) + aRand.z * 30.0);
  vA = tw * smoothstep(0.4, 3.5, d) * (1.0 - smoothstep(38.0, 85.0, d)) * step(mv.z, 0.0);
  vC = mix(vec3(1.0), iris(aRand.w + uTiempo * 0.02), 0.45);
}
`;
export const PUNTO_F = /* glsl */ `
uniform float uOpacidad;
varying float vA;
varying vec3 vC;
void main(){
  float d = length(gl_PointCoord - 0.5);
  float a = 1.0 - smoothstep(0.0, 0.5, d);
  a *= a;
  if (a * vA < 0.003) discard;
  gl_FragColor = vec4(vC, a * vA * uOpacidad);
}
`;

// ---------- Rayos de velocidad (solo se ven al moverse rápido) ----------
export const RAYOS_V = /* glsl */ `
uniform float uLargo, uRayos;
attribute float aFin;
attribute float aRand;
varying float vA;
varying vec3 vC;
${IRIS}
void main(){
  vec3 p = position;
  p.z += aFin * uLargo * (0.4 + aRand);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float d = -mv.z;
  vA = uRayos * (1.0 - smoothstep(30.0, 80.0, d)) * smoothstep(0.5, 4.0, d) * (1.0 - aFin * 0.85);
  vC = mix(vec3(1.0), iris(aRand), 0.5);
  gl_Position = projectionMatrix * mv;
}
`;
export const RAYOS_F = /* glsl */ `
varying float vA;
varying vec3 vC;
void main(){ gl_FragColor = vec4(vC, vA); }
`;

// ---------- Túnel de código ----------
export const TUNEL_V = /* glsl */ `
varying vec2 vUv;
varying vec3 vMundo;
void main(){
  vUv = uv;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vMundo = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;
export const TUNEL_F = /* glsl */ `
uniform sampler2D uGlifos;
uniform float uTiempo, uRevelar, uZ0, uZ1, uCamZ, uLargo;
varying vec2 vUv;
varying vec3 vMundo;
${HASH}
${IRIS}
void main(){
  float cols = 56.0;
  float filas = uLargo * 1.15;
  vec2 rejilla = vUv * vec2(cols, filas);
  float col = floor(rejilla.x);
  float vel = 0.4 + hash12(vec2(col, 3.7)) * 1.6;
  float vv = rejilla.y + uTiempo * vel * 2.2;
  vec2 celda = vec2(col, floor(vv));
  vec2 f = vec2(fract(rejilla.x), fract(vv));
  float h = hash12(celda);
  float g = floor(mod(h * 64.0 + floor(uTiempo * (0.5 + h * 3.0)), 64.0));
  vec2 guv = (vec2(mod(g, 8.0), 7.0 - floor(g / 8.0)) + f) / 8.0;
  float glifo = textureGrad(uGlifos, guv, dFdx(rejilla) / 8.0, dFdy(rejilla) / 8.0).r;
  float estela = pow(fract(vv * 0.035 + hash12(vec2(col, 9.1))), 5.0);
  float escaso = step(0.42, hash12(celda + 17.0));
  float brillo = glifo * escaso * (0.12 + 2.2 * estela);
  vec3 color = mix(iris(vUv.x * 2.0 + vMundo.z * 0.01 + uTiempo * 0.03), vec3(1.0), estela * 0.7);
  float anillo = pow(abs(sin((vMundo.z - uTiempo * 6.0) * 0.28)), 120.0);
  vec3 c = color * brillo + iris(vMundo.z * 0.02 + 0.3) * anillo * 0.9;
  float niebla = exp(-abs(vMundo.z - uCamZ) * 0.05);
  float a = clamp((uZ0 - vMundo.z) / 6.0, 0.0, 1.0);
  float b = clamp((vMundo.z - uZ1) / 8.0, 0.0, 1.0);
  float bordes = a * a * (3.0 - 2.0 * a) * b * b * (3.0 - 2.0 * b);
  gl_FragColor = vec4(c * niebla * bordes * uRevelar, 1.0);
}
`;

// ---------- Océano de datos (puntos sobre olas de ruido) ----------
export const OCEANO_V = /* glsl */ `
uniform float uTiempo, uEscala, uRevelar;
attribute float aRand;
varying float vA;
varying vec3 vC;
${RUIDO}
${IRIS}
void main(){
  vec3 p = position;
  float n = snoise(vec3(p.x * 0.045, p.z * 0.045, uTiempo * 0.1));
  float n2 = snoise(vec3(p.x * 0.16, p.z * 0.16 - uTiempo * 0.25, 3.7));
  p.y += n * 1.7 + n2 * 0.3;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float d = max(-mv.z, 0.01);
  gl_PointSize = clamp((0.03 + aRand * 0.03) * uEscala / d, 1.0, 7.0);
  gl_Position = projectionMatrix * mv;
  float cresta = smoothstep(-0.2, 1.0, n + n2 * 0.3);
  vA = (0.18 + 0.82 * cresta) * (1.0 - smoothstep(25.0, 115.0, d)) * smoothstep(1.0, 5.0, d) * uRevelar * step(mv.z, 0.0);
  vC = mix(vec3(0.85), iris(n * 0.4 + p.x * 0.012 + uTiempo * 0.02), 0.65);
}
`;

// ---------- Aura del horizonte ----------
export const AURA_F = /* glsl */ `
uniform float uTiempo, uRevelar;
varying vec2 vUv;
${RUIDO}
${IRIS}
void main(){
  vec2 p = (vUv - 0.5) * vec2(5.3, 1.76);
  float r = length(p * vec2(1.0, 3.2));
  float n = snoise(vec3(p * 2.2, uTiempo * 0.04)) * 0.5 + 0.5;
  float halo = exp(-r * 3.2) * (0.55 + 0.45 * n);
  float linea = exp(-abs(p.y) * 70.0) * exp(-abs(p.x) * 1.2);
  vec2 b = abs(vUv - 0.5) * 2.0;
  float bordes = (1.0 - smoothstep(0.6, 1.0, b.x)) * (1.0 - smoothstep(0.5, 1.0, b.y));
  vec3 c = iris(p.x * 0.5 + n * 0.25 + uTiempo * 0.01) * halo * 0.5 + vec3(1.0) * linea * 0.35;
  gl_FragColor = vec4(c * uRevelar * bordes, 1.0);
}
`;

// ---------- Puertas de luz (proceso y salida del túnel) ----------
export const PUERTA_F = /* glsl */ `
uniform float uTiempo, uFase, uBrillo, uMezcla, uDibujo;
uniform vec3 uTinte;
varying vec2 vUv;
${IRIS}
void main(){
  float a = vUv.x;
  // uDibujo < 1: el marco se traza desde el primer vértice hacia los dos lados, con una punta brillante.
  float tramo = min(a, 1.0 - a) * 2.0;
  if (tramo > uDibujo) discard;
  float punta = uDibujo < 0.999 ? smoothstep(uDibujo - 0.08, uDibujo, tramo) * 4.0 : 0.0;
  float barrido = pow(fract(a - uTiempo * 0.12 + uFase), 14.0) * 5.0;
  float base = 0.35 + 0.15 * sin(a * 6.2831 * 6.0 + uTiempo);
  vec3 tono = mix(mix(iris(a + uFase), vec3(1.0), 0.4), uTinte, uMezcla);
  gl_FragColor = vec4(tono * (base + barrido + punta) * uBrillo, 1.0);
}
`;

// ---------- Escudo de ciberseguridad con ondas de impacto ----------
export const ESCUDO_V = /* glsl */ `
varying vec3 vObj;
varying vec3 vN;
varying vec3 vV;
void main(){
  vObj = normalize(position);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelMatrix) * normal);
  vV = normalize(cameraPosition - w.xyz);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;
export const ESCUDO_F = /* glsl */ `
uniform vec4 uImp[6];
uniform float uTiempo, uActivo;
varying vec3 vObj;
varying vec3 vN;
varying vec3 vV;
${IRIS}
void main(){
  float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 3.0);
  vec3 col = iris(vObj.y * 0.35 + uTiempo * 0.03) * fres * 0.5;
  for (int i = 0; i < 6; i++) {
    vec4 im = uImp[i];
    float edad = uTiempo - im.w;
    if (edad < 0.0 || edad > 2.2) continue;
    float ang = acos(clamp(dot(vObj, im.xyz), -1.0, 1.0));
    float onda = (1.0 - smoothstep(0.0, 0.055, abs(ang - edad * 1.5))) * exp(-edad * 2.2);
    float nucleo = exp(-ang * 10.0) * exp(-edad * 6.0);
    col += vec3(0.95, 0.9, 1.0) * onda * 0.9 + vec3(1.0, 0.25, 0.32) * nucleo * 4.0;
  }
  gl_FragColor = vec4(col * uActivo, 1.0);
}
`;

// ---------- Logo de partículas (el cierre) ----------
export const LOGOP_V = /* glsl */ `
uniform float uTiempo, uEscala, uMorph;
uniform vec3 uPuntero;
attribute vec3 aInicio;
attribute vec4 aRand;
varying float vA;
varying vec3 vC;
${RUIDO}
${IRIS}
void main(){
  float m = clamp(uMorph * 1.3 - aRand.x * 0.3, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  vec3 deriva = vec3(sin(uTiempo * 0.3 + aRand.y * 6.2831), cos(uTiempo * 0.25 + aRand.z * 6.2831), sin(uTiempo * 0.2 + aRand.w * 6.2831)) * 0.7;
  vec3 p = mix(aInicio + deriva, position, m);
  p += vec3(snoise(position * 1.1 + uTiempo * 0.15), snoise(position * 1.1 + 9.0 + uTiempo * 0.15), 0.0) * 0.035 * m;
  vec2 dd = p.xy - uPuntero.xy;
  float dl = length(dd);
  float emp = (1.0 - smoothstep(0.0, 1.15, dl)) * m;
  p.xy += (dd / max(dl, 0.001)) * emp * 0.42;
  p.z += emp * 0.5;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float d = max(-mv.z, 0.01);
  gl_PointSize = clamp((0.016 + aRand.w * 0.02) * uEscala / d, 1.0, 10.0);
  gl_Position = projectionMatrix * mv;
  vC = mix(vec3(1.0), iris(position.x * 0.09 + position.y * 0.05 + uTiempo * 0.04), 0.5 + emp * 0.3);
  vA = (0.25 + 0.75 * m) * (0.7 + 0.3 * aRand.y) + emp * 0.5;
}
`;

// ---------- Pase final: aberración cromática, salto de portal, fugas de luz, viñeta y grano ----------
export const FINAL = {
  uniforms: {
    tDiffuse: { value: null },
    uTiempo: { value: 0 },
    uAberracion: { value: 0.0012 },
    uWarp: { value: 0 },
    uDestello: { value: 0 },
    uFugas: { value: 0.6 },
    uGrano: { value: 0.045 },
    uVineta: { value: 0.6 },
    uRes: { value: new Vector2(1, 1) },
    uColorFuga: { value: new Color(0.78, 0.62, 1.0) },
    uMezclaFuga: { value: 0 },
  },
  vertexShader: UV_V,
  fragmentShader: /* glsl */ `
uniform sampler2D tDiffuse;
uniform float uTiempo, uAberracion, uWarp, uDestello, uFugas, uGrano, uVineta, uMezclaFuga;
uniform vec2 uRes;
uniform vec3 uColorFuga;
varying vec2 vUv;
vec3 muestra(vec2 uv, vec2 off){
  return vec3(texture2D(tDiffuse, uv + off).r, texture2D(tDiffuse, uv).g, texture2D(tDiffuse, uv - off).b);
}
void main(){
  vec2 uv = vUv;
  vec2 c = uv - 0.5;
  float r2 = dot(c, c);
  vec2 off = c * uAberracion * (1.0 + r2 * 4.0);
  vec3 col = muestra(uv, off);
  if (uWarp > 0.001) {
    vec3 acc = col;
    float peso = 1.0;
    for (int i = 1; i < 8; i++) {
      float s = 1.0 - float(i) * 0.018 * uWarp;
      float w = 1.0 - float(i) / 8.0;
      acc += muestra(0.5 + c * s, off) * w;
      peso += w;
    }
    col = acc / peso;
  }
  float asp = uRes.x / uRes.y;
  vec2 q = vec2(c.x * asp, c.y);
  vec2 p1 = vec2((-0.42 + 0.08 * sin(uTiempo * 0.07)) * asp, 0.36 + 0.05 * cos(uTiempo * 0.05));
  vec2 p2 = vec2((0.45 + 0.06 * cos(uTiempo * 0.06)) * asp, -0.38 + 0.06 * sin(uTiempo * 0.08));
  float l1 = exp(-length(q - p1) * 2.6);
  float l2 = exp(-length(q - p2) * 2.6);
  col += uFugas * 0.06 * (l1 * mix(vec3(0.78, 0.62, 1.0), uColorFuga, uMezclaFuga) + l2 * mix(vec3(0.55, 0.92, 1.0), uColorFuga * 0.8, uMezclaFuga * 0.6));
  float vig = 1.0 - smoothstep(0.35, 1.05, length(c) * 1.35);
  col *= mix(1.0, vig, uVineta);
  col = mix(col, vec3(1.0), clamp(uDestello, 0.0, 1.0));
  float n = fract(sin(dot(floor(uv * uRes) + fract(uTiempo * 7.13) * 91.7, vec2(12.9898, 78.233))) * 43758.5453);
  // El grano vive en la luz: el negro queda negro.
  col += (n - 0.5) * uGrano * (0.12 + dot(col, vec3(0.333)) * 1.3);
  gl_FragColor = vec4(col, 1.0);
}
`,
};

// ---------- Tarjetas de vidrio del carrusel de proyectos ----------
export const CARTA_V = /* glsl */ `
uniform float uCurva, uTiempo;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
void main(){
  vUv = uv;
  vec3 p = position;
  // Al girar rápido la tarjeta se curva y ondula, como vidrio flexible.
  p.z -= abs(uCurva) * p.x * p.x * 0.11;
  p.z += sin(p.y * 2.6 + uTiempo * 2.0) * 0.02 * abs(uCurva);
  vec4 w = modelMatrix * vec4(p, 1.0);
  vV = normalize(cameraPosition - w.xyz);
  vN = normalize(mat3(modelMatrix) * vec3(0.0, 0.0, 1.0));
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;
export const CARTA_F = /* glsl */ `
uniform sampler2D uMapa;
uniform float uRGB, uActivo, uTiempo, uHover, uAspecto, uOpacidad;
varying vec2 vUv;
varying vec3 vN;
varying vec3 vV;
${IRIS}
float caja(vec2 p, vec2 b, float r){
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
void main(){
  vec2 p = (vUv - 0.5) * vec2(uAspecto, 1.0);
  float d = caja(p, vec2(uAspecto, 1.0) * 0.5, 0.07);
  float alfa = 1.0 - smoothstep(-0.004, 0.002, d);
  if (alfa < 0.01) discard;
  float mov = abs(uRGB) * 90.0;
  vec2 uv = vUv + vec2(sin(vUv.y * 12.0 + uTiempo * 1.3), cos(vUv.x * 10.0 - uTiempo)) * 0.0025 * (0.4 + mov);
  vec2 off = vec2(uRGB, uRGB * 0.25);
  vec3 col = vec3(texture2D(uMapa, uv + off).r, texture2D(uMapa, uv).g, texture2D(uMapa, uv - off).b);
  float borde = 1.0 - smoothstep(0.0, 0.02, abs(d + 0.01));
  float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.0);
  vec3 rim = iris(vUv.x * 0.8 + vUv.y * 0.4 + uTiempo * 0.05);
  float barrido = (1.0 - smoothstep(0.0, 0.07, abs(vUv.x + vUv.y * 0.45 - fract(uTiempo * 0.11) * 2.2 + 0.4))) * 0.16;
  col = col * (0.32 + 0.68 * uActivo) + rim * (borde * (0.55 + uHover * 0.9) + fres * 0.3) + barrido * uActivo;
  gl_FragColor = vec4(col, alfa * (0.5 + 0.5 * uActivo) * uOpacidad);
}
`;

// ---------- Pasadizos: tubos de luz instanciados que parpadean y se apagan a ratos ----------
export const LUZ_V = /* glsl */ `
attribute float aFase;
attribute vec3 aColor;
uniform float uTiempo, uAct;
varying vec3 vC;
varying float vB;
void main(){
  vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
  float parpadeo = 0.7 + 0.3 * sin(uTiempo * (2.0 + aFase * 7.0) + aFase * 30.0);
  float corte = step(0.07, fract(uTiempo * (0.12 + aFase * 0.45) + aFase * 7.3));
  vB = parpadeo * corte * uAct;
  vC = aColor;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`;
export const LUZ_F = /* glsl */ `
varying vec3 vC;
varying float vB;
void main(){ gl_FragColor = vec4(vC * vB, 1.0); }
`;

// ---------- Paneles de circuito de los pasadizos ----------
export const PANEL_F = /* glsl */ `
uniform sampler2D uMapa;
uniform float uAct, uTiempo;
uniform vec3 uTinte;
uniform vec2 uRepetir;
varying vec2 vUv;
varying vec3 vMundo;
void main(){
  vec3 tex = texture2D(uMapa, vUv * uRepetir).rgb;
  float barrido = exp(-pow((fract(vMundo.z * 0.06 + uTiempo * 0.3) - 0.5) * 14.0, 2.0));
  vec3 c = tex * uTinte * (0.12 + 0.95 * uAct) * (0.75 + barrido * 1.4 * uAct);
  gl_FragColor = vec4(c, 1.0);
}
`;

// ---------- Piso del laboratorio ----------
export const PISO_F = /* glsl */ `
uniform float uTiempo, uAct;
varying vec2 vUv;
varying vec3 vMundo;
${IRIS}
void main(){
  vec2 g = abs(fract(vMundo.xz * vec2(0.6, 0.6)) - 0.5);
  float linea = 1.0 - smoothstep(0.0, 0.025, min(g.x, g.y));
  float pulso = exp(-pow((fract(vMundo.z * 0.05 + uTiempo * 0.25) - 0.5) * 10.0, 2.0));
  vec2 b = abs(vUv - 0.5) * 2.0;
  float borde = (1.0 - smoothstep(0.55, 1.0, b.x)) * (1.0 - smoothstep(0.8, 1.0, b.y));
  vec3 c = mix(vec3(0.55, 0.7, 1.0), iris(vMundo.x * 0.05 + 0.4), 0.35) * linea * (0.18 + pulso * 0.5) * borde * uAct;
  gl_FragColor = vec4(c, 1.0);
}
`;

// ---------- Personas holográficas (nube de puntos con barrido de escaneo) ----------
export const PERSONA_V = /* glsl */ `
uniform float uTiempo, uEscala, uActivo;
uniform vec3 uColorA, uColorB;
attribute float aRand;
varying float vA;
varying vec3 vC;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.0);
  vec4 mv = viewMatrix * w;
  float d = max(-mv.z, 0.01);
  gl_PointSize = clamp((0.016 + aRand * 0.012) * uEscala / d, 1.0, 6.0);
  gl_Position = projectionMatrix * mv;
  float escaneo = pow(1.0 - abs(fract(w.y * 0.8 - uTiempo * 0.32) - 0.5) * 2.0, 16.0);
  float parpadeo = 0.86 + 0.14 * sin(uTiempo * 21.0 + aRand * 40.0);
  vA = (0.5 + escaneo * 1.5) * parpadeo * uActivo;
  vC = mix(uColorA, uColorB, aRand);
}
`;

// ---------- Estrellas HDR ----------
export const ESTRELLAS_V = /* glsl */ `
uniform float uTiempo, uPR;
attribute vec4 aDatos;
varying vec3 vC;
varying float vB;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float titilar = 0.7 + 0.3 * sin(uTiempo * (0.8 + aDatos.z * 3.0) + aDatos.z * 40.0);
  gl_PointSize = aDatos.x * uPR;
  vB = aDatos.y * titilar;
  vC = mix(vec3(0.72, 0.82, 1.0), vec3(1.0, 0.86, 0.72), aDatos.w);
}
`;
export const ESTRELLAS_F = /* glsl */ `
uniform float uRayos;
varying vec3 vC;
varying float vB;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float nucleo = exp(-d * d * 140.0);
  float halo = exp(-d * 10.0) * 0.3;
  float rayos = uRayos * (exp(-abs(c.x) * 70.0) * exp(-abs(c.y) * 5.5) + exp(-abs(c.y) * 70.0) * exp(-abs(c.x) * 5.5));
  float a = (uRayos > 0.5 ? nucleo + halo + rayos : 1.0 - smoothstep(0.15, 0.5, d)) * vB;
  if (a < 0.003) discard;
  gl_FragColor = vec4(vC * a, 1.0);
}
`;
