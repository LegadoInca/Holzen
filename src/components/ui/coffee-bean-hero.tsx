import * as React from "react"
import { BEAN_PROFILE } from "./coffee-bean-profile"

/**
 * CoffeeBeanHero — hero controlado por scroll con un grano de café 3D
 * modelado por código y renderizado en WebGL puro (sin dependencias).
 *
 * El scroll es la línea de tiempo: 4 escenas (portada, origen, proceso,
 * final). Entre cada una la cámara orbita el grano, este cambia de tamaño y
 * posición, se "tuesta" (verde → café brillante) y el texto entra y sale con
 * su propio escalonado. Inspirado en "Lycoris Specimen" (21st.dev).
 */

export type CoffeeBeanHeroCopy = {
  eyebrow: string
  word: string
  desc: string
  scroll: string
  originLabel: string
  originTitle: string
  originMeta: string
  processLabel: string
  steps: [string, string, string]
  title: string
  ctaPrimary: string
  ctaSecondary: string
}

export type CoffeeBeanHeroProps = {
  copy: CoffeeBeanHeroCopy
  logo?: string
  /** Foto del lado plano (con la hendidura), sin fondo, alineada horizontalmente. */
  textureFront?: string
  /** Foto del lomo redondeado. */
  textureBack?: string
  /** Video en bucle de la escena final (chorro de café en la taza). */
  pourVideo?: string
  pourVideoMobile?: string
  pourPoster?: string
  /** Color de la palabra de portada. */
  wordColor?: string
  onPrimary?: () => void
  onSecondary?: () => void
  id?: string
  ink?: string
  cream?: string
  lime?: string
  gold?: string
  /** Alturas de pantalla de scroll por escena (más bajo = más rápido). */
  sceneScroll?: number
  className?: string
}

// #region vectores y matrices
type V3 = [number, number, number]
type M4 = Float32Array
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const cross = (a: V3, b: V3): V3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
]
const norm = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1
  return [a[0] / l, a[1] / l, a[2] / l]
}
const perspective = (fovy: number, aspect: number, near: number, far: number): M4 => {
  const f = 1 / Math.tan(fovy / 2)
  const m = new Float32Array(16)
  m[0] = f / aspect
  m[5] = f
  m[10] = (far + near) / (near - far)
  m[11] = -1
  m[14] = (2 * far * near) / (near - far)
  return m
}
const lookAt = (eye: V3, at: V3): M4 => {
  const z = norm(sub(eye, at))
  const x = norm(cross([0, 1, 0], z))
  const y = cross(z, x)
  const m = new Float32Array(16)
  m[0] = x[0]; m[4] = x[1]; m[8] = x[2]
  m[1] = y[0]; m[5] = y[1]; m[9] = y[2]
  m[2] = z[0]; m[6] = z[1]; m[10] = z[2]
  m[12] = -dot(x, eye); m[13] = -dot(y, eye); m[14] = -dot(z, eye); m[15] = 1
  return m
}
const multiply = (a: M4, b: M4): M4 => {
  const o = new Float32Array(16)
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++)
      o[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3]
  return o
}
const rotY = (t: number): M4 => {
  const c = Math.cos(t), s = Math.sin(t)
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1])
}
const rotX = (t: number): M4 => {
  const c = Math.cos(t), s = Math.sin(t)
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1])
}
const rotZ = (t: number): M4 => {
  const c = Math.cos(t), s = Math.sin(t)
  return new Float32Array([c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
}
const transScale = (x: number, y: number, z: number, k: number): M4 =>
  new Float32Array([k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, x, y, z, 1])
const hexToLinear = (hex: string): V3 => {
  let h = hex.replace("#", "").trim()
  if (h.length === 3) h = h.split("").map((c) => c + c).join("")
  const n = parseInt(h.slice(0, 6), 16)
  if (Number.isNaN(n)) return [0.5, 0.5, 0.5]
  const ch = (v: number) => Math.pow(v / 255, 2.2)
  return [ch((n >> 16) & 255), ch((n >> 8) & 255), ch(n & 255)]
}
// #endregion

// #region el grano
/**
 * Grano de café con la silueta exacta de la foto real (BEAN_PROFILE): eje largo
 * en X, cara plana con la hendidura hacia +Y, lomo redondeado hacia -Y.
 */
const RL = 1.0
const P = BEAN_PROFILE
const lerpProfile = (arr: readonly number[], x: number) => {
  const f = Math.min(Math.max((x + 1) / 2, 0), 1) * (arr.length - 1)
  const i = Math.min(Math.floor(f), arr.length - 2)
  const t = f - i
  return arr[i] + (arr[i + 1] - arr[i]) * t
}
const HW_MAX = Math.max(...P.top.map((t, i) => (P.bot[i] - t) / 2))
const FRONT_H = 0.34 // alto de la cara plana (relativo al ancho)
const BACK_H = 0.62 // alto del lomo

const beanPoint = (u: number, v: number): { p: V3; occ: number } => {
  const sv = Math.sin(v)
  const su = Math.sin(u)
  const cu = Math.cos(u)
  const x = RL * Math.cos(v)
  const top = lerpProfile(P.top, x)
  const bot = lerpProfile(P.bot, x)
  const close = 1 - Math.pow(1 - sv, 6) // cierra las puntas
  const hw = ((bot - top) / 2) * close
  const zc = (bot + top) / 2
  const hN = Math.pow(Math.max(hw, 0) / HW_MAX, 0.7) * HW_MAX
  const z = zc + hw * cu
  let y = su * hN * (su > 0 ? FRONT_H / HW_MAX * 0.95 : BACK_H / HW_MAX * 0.95) * HW_MAX
  let occ = 0
  if (su > 0) {
    // hendidura: sigue la línea medida en la foto
    const cz = lerpProfile(P.crease, x)
    const d = (z - cz) / 0.04
    const taper = Math.max(0, 1 - Math.pow(Math.abs(x), 6))
    const face = Math.min(1, su * 2.5)
    const g = Math.exp(-d * d) * taper * face
    y -= 0.085 * g
    occ = g
  }
  return { p: [x, y, z], occ }
}

const buildBean = () => {
  const U = 128
  const V = 96
  const data: number[] = []
  const idx: number[] = []
  const e = 0.002
  for (let j = 0; j <= V; j++) {
    const v = 0.0015 + (j / V) * (Math.PI - 0.003)
    for (let i = 0; i <= U; i++) {
      const u = (i / U) * Math.PI * 2
      const { p, occ } = beanPoint(u, v)
      const pu = sub(beanPoint(u + e, v).p, beanPoint(u - e, v).p)
      const pv = sub(beanPoint(u, v + e).p, beanPoint(u, v - e).p)
      let n = norm(cross(pu, pv))
      if (!Number.isFinite(n[0]) || Math.hypot(...pu) < 1e-7) n = [Math.sign(p[0]) || 1, 0, 0]
      if (dot(n, [p[0], p[1], p[2] - (P.zmin + P.zmax) / 2]) < 0) n = [-n[0], -n[1], -n[2]]
      data.push(p[0], p[1], p[2], n[0], n[1], n[2], occ)
    }
  }
  for (let j = 0; j < V; j++)
    for (let i = 0; i < U; i++) {
      const a = j * (U + 1) + i
      const b = a + U + 1
      idx.push(a, b, a + 1, a + 1, b, b + 1)
    }
  return { data: new Float32Array(data), index: new Uint16Array(idx) }
}
const STRIDE = 7
// #endregion

// #region scroll
const clamp01 = (x: number) => (x <= 0 ? 0 : x > 1 ? 1 : x)
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const progressFrom = (top: number, height: number, viewport: number) => {
  const travel = height - viewport
  return travel <= 0 ? 0 : clamp01(-top / travel)
}
const sceneCoord = (p: number, n: number, hold: number) => {
  const t = clamp01(p) * (n - 1)
  const i = Math.min(Math.floor(t), n - 2)
  const h = hold / 2
  return i + easeInOut(clamp01((t - i - h) / (1 - 2 * h)))
}
const reveal = (coord: number, scene: number, delay: number) => {
  const d = coord - scene
  const lag = d < 0 ? delay : 1 - delay
  return clamp01((0.6 - Math.abs(d) - lag * 0.2) / 0.25)
}
// #endregion

type Key = { spin: number; el: number; size: number; ox: number; oy: number; roll: number }
const KEYS: Key[] = [
  { spin: 0.5, el: 34, size: 0.46, ox: 0, oy: 0.24, roll: 0.3 },
  { spin: 1.9, el: 72, size: 0.42, ox: 0.42, oy: 0.0, roll: 0.1 },
  { spin: 3.0, el: 28, size: 0.2, ox: 0, oy: 0.22, roll: -0.25 },
  { spin: 3.7, el: 56, size: 0.17, ox: 0.04, oy: 0.1, roll: 0.22 },
]
const KEYS_TALL: Partial<Key>[] = [
  { size: 0.42, oy: 0.3 },
  { size: 0.42, ox: 0, oy: 0.4 },
  { size: 0.28, oy: 0.28 },
  { size: 0.2, ox: -0.5, oy: 0.66 },
]
const SCENES = KEYS.length
const HOLD = 0.34
const keyAt = (coord: number, tall: boolean): Key => {
  const i = Math.max(0, Math.min(SCENES - 1, Math.floor(coord)))
  const j = Math.min(SCENES - 1, i + 1)
  const f = coord - i
  const a = { ...KEYS[i], ...(tall ? KEYS_TALL[i] : {}) }
  const b = { ...KEYS[j], ...(tall ? KEYS_TALL[j] : {}) }
  const l = (x: number, y: number) => x + (y - x) * f
  return { spin: l(a.spin, b.spin), el: l(a.el, b.el), size: l(a.size, b.size), ox: l(a.ox, b.ox), oy: l(a.oy, b.oy), roll: l(a.roll, b.roll) }
}

// granos satélite de la escena "proceso"
const SATS = Array.from({ length: 9 }, (_, i) => {
  const a = (i / 9) * Math.PI * 2
  const r = 2.3 + (i % 3) * 0.45
  return { a, r, y: Math.sin(i * 2.1) * 0.7, s: 0.32 + (i % 4) * 0.05, rx: i * 1.7, ry: i * 0.9 }
})

const VERT = `
attribute vec3 a_pos;
attribute vec3 a_nrm;
attribute float a_occ;
uniform mat4 u_vp;
uniform mat4 u_model;
uniform vec2 u_offset;
uniform vec2 u_zr;
varying vec3 v_n;
varying vec3 v_ln;
varying vec3 v_w;
varying vec2 v_uv;
varying float v_occ;
void main() {
  vec4 w = u_model * vec4(a_pos, 1.0);
  v_w = w.xyz;
  v_n = (u_model * vec4(a_nrm, 0.0)).xyz;
  v_ln = a_nrm;
  v_uv = vec2((a_pos.x + 1.0) * 0.5, (a_pos.z - u_zr.x) / (u_zr.y - u_zr.x));
  v_occ = a_occ;
  gl_Position = u_vp * w;
  gl_Position.xy += u_offset * gl_Position.w;
}
`

// La foto real es el color base (proyectada arriba y abajo); su luminancia da
// el relieve fino (poros, arrugas). El tueste lleva de grano verde a la foto.
const FRAG = `
precision highp float;
uniform mat4 u_model;
uniform vec3 u_eye;
uniform vec3 u_rim;
uniform vec3 u_gold;
uniform float u_roastK;
uniform sampler2D u_front;
uniform sampler2D u_back;
uniform vec2 u_texel;
uniform float u_ready;
varying vec3 v_n;
varying vec3 v_ln;
varying vec3 v_w;
varying vec2 v_uv;
varying float v_occ;
float lum(vec3 c) { return dot(c, vec3(0.3, 0.55, 0.15)); }
vec3 tex(sampler2D t, vec2 uv) { return pow(texture2D(t, uv).rgb, vec3(2.2)); }
float studio(vec3 r) {
  float key = pow(max(dot(r, normalize(vec3(-0.45, 0.85, 0.35))), 0.0), 22.0) * 2.2;
  float strip = smoothstep(0.62, 0.86, r.x) * smoothstep(-0.6, 0.3, r.y) * 0.7;
  float hz = exp(-abs(r.y - 0.05) * 8.0) * 0.2;
  return key + strip + hz;
}
void main() {
  vec2 uvF = v_uv;
  vec2 uvB = vec2(v_uv.x, 1.0 - v_uv.y);
  float wF = smoothstep(-0.3, 0.3, normalize(v_ln).y);
  vec3 cF = tex(u_front, uvF);
  vec3 cB = tex(u_back, uvB);
  vec3 alb = mix(cB, cF, wF);
  // relieve desde la foto
  float hF0 = lum(cF), hB0 = lum(cB);
  float du = mix(lum(tex(u_back, uvB + vec2(u_texel.x, 0.0))) - hB0, lum(tex(u_front, uvF + vec2(u_texel.x, 0.0))) - hF0, wF);
  float dv = mix(-(lum(tex(u_back, uvB + vec2(0.0, u_texel.y))) - hB0), lum(tex(u_front, uvF + vec2(0.0, u_texel.y))) - hF0, wF);
  vec3 ln = normalize(v_ln);
  vec3 T = normalize(vec3(1.0, 0.0, 0.0) - ln * ln.x);
  vec3 B = normalize(vec3(0.0, 0.0, 1.0) - ln * ln.z);
  float bump = 9.0 * u_ready;
  ln = normalize(ln - (T * du + B * dv) * bump * (1.0 - 0.7 * v_occ));
  vec3 n = normalize((u_model * vec4(ln, 0.0)).xyz);
  vec3 v = normalize(u_eye - v_w);
  if (dot(n, v) < 0.0) n = -n;
  vec3 r = reflect(-v, n);

  // tueste: verde → canela → tostado (la foto)
  float l = lum(alb);
  vec3 raw = mix(vec3(0.10, 0.12, 0.06), vec3(0.46, 0.47, 0.29), clamp(l * 4.0, 0.0, 1.0));
  vec3 cinn = mix(vec3(0.16, 0.08, 0.03), vec3(0.62, 0.38, 0.16), clamp(l * 4.0, 0.0, 1.0));
  float k = u_roastK;
  vec3 base = k < 0.5 ? mix(raw, cinn, k * 2.0) : mix(cinn, alb, k * 2.0 - 1.0);
  base = mix(vec3(0.2, 0.1, 0.05), base, u_ready);

  float occ = 1.0 - 0.55 * v_occ;
  float dif = max(dot(n, normalize(vec3(-0.35, 0.8, 0.55))), 0.0);
  float back = max(dot(n, normalize(vec3(0.6, -0.2, -0.7))), 0.0);
  vec3 col = base * (0.22 + 1.1 * dif + 0.3 * back) * occ;
  float gloss = mix(0.15, 0.75, k) * smoothstep(0.004, 0.04, l);
  col += vec3(1.0, 0.86, 0.7) * pow(studio(r), 1.5) * 0.3 * gloss * occ;
  float fr = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  col += (u_gold * 0.16 + u_rim * 0.03) * fr;
  col = col / (1.0 + col);
  col = pow(col, vec3(1.0 / 2.2));
  gl_FragColor = vec4(col, 1.0);
}
`

const CSS =
  ".cbh-stage{container-type:size;container-name:cbh}" +
  ".cbh-nav button{display:flex;align-items:center;gap:10px;justify-content:flex-end;background:none;border:0;padding:5px 0;cursor:pointer;color:inherit;font:inherit}" +
  ".cbh-nav .cbh-tick{display:block;height:1px;width:14px;background:currentColor;opacity:.45;transition:width .4s cubic-bezier(.2,.8,.2,1),opacity .3s,background-color .3s}" +
  ".cbh-nav button[aria-current=step] .cbh-tick{width:34px;opacity:1;background:var(--cbh-lime)}" +
  "@container cbh (orientation: portrait){.cbh-pour{top:11cqh!important;right:-12cqw!important;width:100cqw!important;transform:none!important}.cbh-left{left:7cqw!important;right:7cqw!important;top:auto!important;bottom:10cqh!important;max-width:none!important}" +
  ".cbh-steps{gap:5cqw!important;bottom:7cqh!important}}" +
  "@container cbh (max-width: 720px){.cbh-hide-sm{display:none!important}}"

type Fx = "rise" | "clip" | "line" | "fade"
const sc = (scene: number, fx: Fx = "rise", delay = 0) => ({ "data-sc": scene, "data-fx": fx, "data-d": delay })

const DISPLAY = "'Playfair Display', Georgia, serif"
const SANS = "'Inter', system-ui, sans-serif"

export default function CoffeeBeanHero({
  copy,
  logo,
  textureFront = "/images/bean/front.webp",
  textureBack = "/images/bean/back.webp",
  wordColor = "#26E237",
  pourVideo,
  pourVideoMobile,
  pourPoster,
  onPrimary,
  onSecondary,
  id,
  ink = "#0D0D0C",
  cream = "#F5E6D0",
  lime = "#BBDA1F",
  gold = "#C8A96E",
  sceneScroll = 0.75,
  className = "",
}: CoffeeBeanHeroProps) {
  const rootRef = React.useRef<HTMLElement | null>(null)
  const stageRef = React.useRef<HTMLDivElement | null>(null)
  const pourRef = React.useRef<HTMLVideoElement | null>(null)
  const [pourSrc, setPourSrc] = React.useState<string | undefined>(undefined)
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const glowRef = React.useRef<HTMLDivElement | null>(null)
  const wordRef = React.useRef<HTMLDivElement | null>(null)
  const [reduced, setReduced] = React.useState(false)
  const [active, setActive] = React.useState(0)

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  React.useEffect(() => {
    if (!pourVideo) return
    setPourSrc(window.matchMedia("(max-width: 767px)").matches && pourVideoMobile ? pourVideoMobile : pourVideo)
  }, [pourVideo, pourVideoMobile])

  const look = React.useRef({ reduced, lime, textureFront, textureBack })
  look.current = { reduced, lime, textureFront, textureBack }

  React.useEffect(() => {
    const root = rootRef.current
    const stage = stageRef.current
    const canvas = canvasRef.current
    const glow = glowRef.current
    const word = wordRef.current
    if (!root || !stage || !canvas || !glow || !word) return

    const mesh = buildBean()
    let gl: WebGLRenderingContext | null = null
    let prog: WebGLProgram | null = null
    let vbo: WebGLBuffer | null = null
    let ibo: WebGLBuffer | null = null
    const loc: Record<string, WebGLUniformLocation | null> = {}
    const textures: (WebGLTexture | null)[] = []
    let texSize: [number, number] = [1024, 512]
    let readyAt = -1

    const initGL = () => {
      gl = canvas.getContext("webgl", { alpha: true, antialias: true, premultipliedAlpha: true }) as WebGLRenderingContext | null
      if (!gl) return false
      const g = gl
      const compile = (type: number, src: string) => {
        const sh = g.createShader(type)!
        g.shaderSource(sh, src)
        g.compileShader(sh)
        return g.getShaderParameter(sh, g.COMPILE_STATUS) ? sh : null
      }
      const vs = compile(g.VERTEX_SHADER, VERT)
      const fs = compile(g.FRAGMENT_SHADER, FRAG)
      if (!vs || !fs) return false
      prog = g.createProgram()!
      g.attachShader(prog, vs)
      g.attachShader(prog, fs)
      g.linkProgram(prog)
      g.deleteShader(vs)
      g.deleteShader(fs)
      if (!g.getProgramParameter(prog, g.LINK_STATUS)) return false
      g.useProgram(prog)
      vbo = g.createBuffer()
      g.bindBuffer(g.ARRAY_BUFFER, vbo)
      g.bufferData(g.ARRAY_BUFFER, mesh.data, g.STATIC_DRAW)
      ibo = g.createBuffer()
      g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, ibo)
      g.bufferData(g.ELEMENT_ARRAY_BUFFER, mesh.index, g.STATIC_DRAW)
      const attr = (n: string, size: number, off: number) => {
        const a = g.getAttribLocation(prog!, n)
        if (a < 0) return
        g.enableVertexAttribArray(a)
        g.vertexAttribPointer(a, size, g.FLOAT, false, STRIDE * 4, off * 4)
      }
      attr("a_pos", 3, 0)
      attr("a_nrm", 3, 3)
      attr("a_occ", 1, 6)
      for (const n of ["u_vp", "u_model", "u_offset", "u_zr", "u_eye", "u_rim", "u_gold", "u_roastK", "u_front", "u_back", "u_texel", "u_ready"])
        loc[n] = g.getUniformLocation(prog, n)
      // texturas de la foto real (placeholder de 1px hasta que cargan)
      const mkTex = (unit: number, url: string, onReady: () => void) => {
        const tx = g.createTexture()
        g.activeTexture(g.TEXTURE0 + unit)
        g.bindTexture(g.TEXTURE_2D, tx)
        g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, 1, 1, 0, g.RGBA, g.UNSIGNED_BYTE, new Uint8Array([90, 45, 20, 255]))
        const img = new Image()
        img.onload = () => {
          if (!gl) return
          g.activeTexture(g.TEXTURE0 + unit)
          g.bindTexture(g.TEXTURE_2D, tx)
          g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, img)
          g.generateMipmap(g.TEXTURE_2D)
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR_MIPMAP_LINEAR)
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR)
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE)
          g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
          texSize = [img.naturalWidth, img.naturalHeight]
          onReady()
        }
        img.src = url
        textures.push(tx)
      }
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR)
      let loaded = 0
      const done = () => {
        loaded++
        if (loaded === 2) readyAt = performance.now()
      }
      mkTex(0, look.current.textureFront, done)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR)
      mkTex(1, look.current.textureBack, done)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR)
      g.uniform1i(loc.u_front, 0)
      g.uniform1i(loc.u_back, 1)
      g.enable(g.DEPTH_TEST)
      g.clearColor(0, 0, 0, 0)
      return true
    }
    if (!initGL()) gl = null
    const onLost = (e: Event) => {
      e.preventDefault()
      gl = null
    }
    const onRestored = () => {
      if (!initGL()) gl = null
    }
    canvas.addEventListener("webglcontextlost", onLost)
    canvas.addEventListener("webglcontextrestored", onRestored)

    let W = 1
    let H = 1
    const measure = () => {
      const sr = stage.getBoundingClientRect()
      W = Math.max(1, sr.width)
      H = Math.max(1, sr.height)
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cw = Math.round(W * dpr)
      const ch = Math.round(H * dpr)
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw
        canvas.height = ch
      }
    }
    const ro = new ResizeObserver(measure)
    ro.observe(stage)
    measure()

    const chars = Array.from(word.querySelectorAll<HTMLElement>("[data-ch]"))
    const items = Array.from(stage.querySelectorAll<HTMLElement>("[data-sc]")).map((el) => ({
      el,
      scene: Number(el.dataset.sc),
      fx: el.dataset.fx as Fx,
      delay: Number(el.dataset.d) || 0,
      last: -1,
    }))

    // puntero: inclinación suave + arrastrar para girar
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    let spin = 0
    let spinVel = 0
    let drag: { id: number; x: number } | null = null
    const onMove = (e: PointerEvent) => {
      const r = stage.getBoundingClientRect()
      pointer.tx = ((e.clientX - r.left) / r.width) * 2 - 1
      pointer.ty = ((e.clientY - r.top) / r.height) * 2 - 1
      if (drag && drag.id === e.pointerId) {
        spinVel += (e.clientX - drag.x) * 0.0025
        drag.x = e.clientX
      }
    }
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return
      if ((e.target as HTMLElement).closest("a,button")) return
      drag = { id: e.pointerId, x: e.clientX }
      stage.style.cursor = "grabbing"
    }
    const onUp = () => {
      drag = null
      stage.style.cursor = ""
    }
    stage.addEventListener("pointermove", onMove)
    stage.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)

    const GOLD = hexToLinear(gold)

    let raf = 0
    let running = false
    let visible = true
    let last = performance.now()
    const born = last
    let time = 0
    let prog01 = -1
    let shownScene = -1

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const L = look.current
      const moving = !L.reduced
      if (moving) time += dt

      const r = root.getBoundingClientRect()
      const p = progressFrom(r.top, r.height, H)
      prog01 = prog01 < 0 || L.reduced ? p : prog01 + (p - prog01) * (1 - Math.exp(-dt * 10))
      const coord = sceneCoord(prog01, SCENES, HOLD)
      const scene = Math.round(coord)
      if (scene !== shownScene) {
        shownScene = scene
        setActive(scene)
      }

      const tall = H > W * 1.05
      const k = keyAt(coord, tall)
      pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 4))
      pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 4))
      if (moving) {
        spin += spinVel + dt * 0.15
        spinVel *= Math.exp(-dt * 3)
      } else {
        spin += spinVel
        spinVel = 0
      }
      const px = moving ? pointer.x : 0
      const py = moving ? pointer.y : 0
      const fov = (30 * Math.PI) / 180
      const minDim = Math.min(W, H)
      const intro = L.reduced ? 1 : easeInOut(clamp01((now - born) / 1600))
      const dist = (RL * H) / (k.size * minDim * Math.tan(fov / 2))
      const el = Math.max(-85, Math.min(85, k.el + py * 8)) * (Math.PI / 180)
      const eye: V3 = [0, Math.sin(el) * dist, Math.cos(el) * dist]
      const proj = perspective(fov, W / H, Math.max(0.05, dist - 8), dist + 8)
      const vp = multiply(proj, lookAt(eye, [0, 0, 0]))
      const float = moving ? Math.sin(time * 1.1) * 0.04 : 0
      const bob = transScale(0, float, 0, 0.6 + 0.4 * intro)
      const model = multiply(bob, multiply(rotY(k.spin + spin + px * 0.4 + (1 - intro) * -1.2), multiply(rotX(py * 0.08), rotZ(k.roll))))
      // tueste: verde solo en portada; ya tostado desde "origen"
      const roastK = smoothstep(0.3, 0.95, coord)

      const gx = (0.5 + k.ox / 2) * W
      const gy = (0.5 - k.oy / 2) * H
      const gr = k.size * minDim * 1.6
      glow.style.transform = "translate(" + (gx - gr).toFixed(1) + "px," + (gy - gr).toFixed(1) + "px)"
      glow.style.width = glow.style.height = (gr * 2).toFixed(1) + "px"

      if (gl && prog) {
        const g = gl
        g.viewport(0, 0, canvas.width, canvas.height)
        g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT)
        const rim = hexToLinear(L.lime)
        g.uniformMatrix4fv(loc.u_vp, false, vp)
        g.uniform2f(loc.u_offset, k.ox, k.oy)
        g.uniform3f(loc.u_eye, eye[0], eye[1], eye[2])
        g.uniform2f(loc.u_zr, P.zmin, P.zmax)
        g.uniform2f(loc.u_texel, 1.5 / texSize[0], 1.5 / texSize[1])
        g.uniform1f(loc.u_ready, readyAt < 0 ? 0 : clamp01((now - readyAt) / 500))
        g.uniform3f(loc.u_rim, rim[0], rim[1], rim[2])
        g.uniform3f(loc.u_gold, GOLD[0], GOLD[1], GOLD[2])
        g.uniform1f(loc.u_roastK, roastK)
        g.uniformMatrix4fv(loc.u_model, false, model)
        g.drawElements(g.TRIANGLES, mesh.index.length, g.UNSIGNED_SHORT, 0)

        // granos que orbitan en la escena "proceso"
        const sat = smoothstep(0, 1, clamp01(1.4 - Math.abs(coord - 2) * 1.5))
        if (sat > 0.01) {
          for (const s of SATS) {
            const a = s.a + spin * 0.4 + time * 0.12
            const rr = s.r * (0.7 + 0.3 * sat)
            const m = multiply(
              transScale(Math.cos(a) * rr, s.y + Math.sin(time * 0.9 + s.rx) * 0.08, Math.sin(a) * rr, s.s * sat),
              multiply(rotY(s.ry + time * 0.5), rotX(s.rx + time * 0.3)),
            )
            g.uniformMatrix4fv(loc.u_model, false, m)
            g.drawElements(g.TRIANGLES, mesh.index.length, g.UNSIGNED_SHORT, 0)
          }
        }
      }

      // texto de cada escena
      const still = L.reduced
      for (const it of items) {
        const v = reveal(coord, it.scene, it.delay)
        const q = Math.round(v * 500) / 500
        if (q === it.last) continue
        it.last = q
        const s = it.el.style
        const dir = coord < it.scene ? 1 : -1
        s.visibility = q <= 0 ? "hidden" : ""
        s.pointerEvents = q > 0.6 ? "" : "none"
        if (it.fx === "line") {
          s.transform = "scaleX(" + q + ")"
          s.opacity = String(Math.min(1, q * 2))
          continue
        }
        s.opacity = String(q)
        if (still || it.fx === "fade") continue
        if (it.fx === "clip") {
          const hid = ((1 - q) * 100).toFixed(1)
          s.clipPath = dir > 0 ? "inset(0 0 " + hid + "% 0)" : "inset(" + hid + "% 0 0 0)"
          s.transform = "translateY(" + ((1 - q) * 0.4 * dir).toFixed(3) + "em)"
        } else {
          s.transform = "translateY(" + ((1 - q) * 34 * dir).toFixed(1) + "px)"
          s.filter = q > 0.995 ? "" : "blur(" + ((1 - q) * 8).toFixed(1) + "px)"
        }
      }

      // el video del chorro solo corre cuando su escena está a la vista
      const pv = pourRef.current
      if (pv) {
        const show = reveal(coord, 3, 0.2) > 0
        if (show && pv.paused) pv.play().catch(() => {})
        else if (!show && !pv.paused) pv.pause()
      }

      // la palabra de portada se abre letra por letra y se desvanece
      const m = easeInOut(clamp01(coord * 1.25))
      const n = chars.length
      chars.forEach((c, i) => {
        const off = i - (n - 1) / 2
        const intro01 = still ? 1 : clamp01((now - born - 150 - i * 70) / 900)
        const ie = 1 - Math.pow(1 - intro01, 3)
        const dx = off * m * W * 0.06
        const dy = -m * 70 + (1 - ie) * 40
        c.style.transform = still ? "" : "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px)"
        c.style.opacity = String(ie * (1 - smoothstep(0.05, 0.7, m)))
        const b = (1 - ie) * 10 + m * 14
        c.style.filter = still || b < 0.3 ? "" : "blur(" + b.toFixed(1) + "px)"
        c.style.visibility = coord > 0.95 ? "hidden" : ""
      })
    }

    const start = () => {
      if (running || !visible || document.hidden) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(root)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener("visibilitychange", onVis)
    start()

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      stage.removeEventListener("pointermove", onMove)
      stage.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
      canvas.removeEventListener("webglcontextlost", onLost)
      canvas.removeEventListener("webglcontextrestored", onRestored)
      const g = gl as WebGLRenderingContext | null
      if (g) {
        g.deleteBuffer(vbo)
        g.deleteBuffer(ibo)
        g.deleteProgram(prog)
        textures.forEach((t) => g.deleteTexture(t))
      }
    }
  }, [copy.word, gold, textureFront, textureBack])

  const jump = (i: number) => {
    const root = rootRef.current
    const stage = stageRef.current
    if (!root || !stage) return
    const r = root.getBoundingClientRect()
    const travel = r.height - stage.clientHeight
    window.scrollBy({ top: (i / (SCENES - 1)) * travel + r.top, behavior: reduced ? "auto" : "smooth" })
  }

  const display: React.CSSProperties = { fontFamily: DISPLAY }
  const sans: React.CSSProperties = { fontFamily: SANS }
  const hidden: React.CSSProperties = { opacity: 0 }
  const eyebrow: React.CSSProperties = { ...sans, fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, color: lime }
  const nav = ["Holzen", copy.originLabel, copy.processLabel, copy.ctaSecondary]

  return (
    <section
      id={id}
      ref={rootRef}
      className={"relative w-full " + className}
      style={{ height: "calc(100svh * " + (1 + (SCENES - 1) * sceneScroll).toFixed(3) + ")", background: ink }}
    >
      <style>{CSS}</style>
      <div
        ref={stageRef}
        className="cbh-stage sticky top-0 w-full overflow-hidden select-none"
        style={{ height: "100svh", minHeight: 560, color: cream, background: ink, ["--cbh-lime" as string]: lime } as React.CSSProperties}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(120% 90% at 50% 45%, transparent 55%, " + gold + "14 100%)" }}
        />
        <div
          ref={glowRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 rounded-full"
          style={{ background: "radial-gradient(closest-side, " + gold + "38, " + gold + "10 50%, transparent 100%)", willChange: "transform" }}
        />
        {pourVideo && (
          <div
            {...sc(3, "fade", 0.2)}
            className="cbh-pour pointer-events-none absolute"
            style={{
              opacity: 0, right: "-2cqw", top: "50%", transform: "translateY(-50%)", width: "52cqw", aspectRatio: "16 / 9",
              WebkitMaskImage: "radial-gradient(ellipse 50% 52% at 50% 50%, #000 58%, transparent 100%)",
              maskImage: "radial-gradient(ellipse 50% 52% at 50% 50%, #000 58%, transparent 100%)",
            }}
          >
            <video
              ref={pourRef}
              src={pourSrc}
              poster={pourPoster}
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden
              className="block h-full w-full object-cover"
            />
          </div>
        )}
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block" style={{ width: "100%", height: "100%" }} />

        {/* ============================ 0 · portada ============================ */}
        <div className="pointer-events-none absolute inset-0">
          <div {...sc(0, "rise", 0.1)} className="absolute" style={{ ...eyebrow, ...hidden, left: "5cqw", top: "max(104px, 14cqh)" }}>
            {copy.eyebrow}
          </div>
          <div
            ref={wordRef}
            className="absolute whitespace-nowrap"
            style={{ ...sans, left: "50%", top: "70%", transform: "translate(-50%, -50%)", fontSize: "min(20cqw, 30cqh)", lineHeight: 1, fontWeight: 600, letterSpacing: "-0.04em", color: wordColor }}
            aria-hidden
          >
            {Array.from(copy.word).map((c, i) => (
              <span key={i} data-ch className="inline-block" style={{ willChange: "transform, opacity", opacity: 0 }}>
                {c}
              </span>
            ))}
          </div>
          <p {...sc(0, "rise", 0.3)} className="cbh-hide-sm absolute" style={{ ...sans, ...hidden, left: "5cqw", bottom: "5cqh", maxWidth: 340, fontSize: 13, lineHeight: 1.5, margin: 0, opacity: 0 }}>
            {copy.desc}
          </p>
          <div {...sc(0, "rise", 0.5)} className="absolute flex flex-col items-center gap-2" style={{ ...hidden, left: "50%", bottom: "4cqh", transform: "translateX(-50%)" }}>
            <span style={{ ...sans, fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: lime }}>{copy.scroll}</span>
            <span className="block w-px h-8 animate-pulse" style={{ background: lime }} />
          </div>
        </div>

        {/* ============================ 1 · origen ============================ */}
        <div className="pointer-events-none absolute inset-0">
          <div className="cbh-left absolute" style={{ left: "7cqw", top: "50%", transform: "translateY(-50%)", maxWidth: "42cqw" }}>
            <div {...sc(1, "rise", 0)} style={{ ...eyebrow, ...hidden, marginBottom: "2.5cqh" }}>
              01 — {copy.originLabel}
            </div>
            <h2 {...sc(1, "clip", 0.15)} className="whitespace-pre-line" style={{ ...display, ...hidden, margin: 0, fontSize: "min(7.5cqw, 11cqh)", lineHeight: 0.98, fontWeight: 500 }}>
              {copy.originTitle}
            </h2>
            <div {...sc(1, "line", 0.35)} style={{ ...hidden, height: 1, background: cream + "40", margin: "3.5cqh 0 2cqh", transformOrigin: "left" }} />
            <div {...sc(1, "rise", 0.45)} style={{ ...sans, ...hidden, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.75 }}>
              {copy.originMeta}
            </div>
          </div>
        </div>

        {/* ============================ 2 · proceso ============================ */}
        <div className="pointer-events-none absolute inset-0">
          <div {...sc(2, "rise", 0)} className="absolute text-center" style={{ ...eyebrow, ...hidden, left: 0, right: 0, top: "max(110px, 15cqh)" }}>
            02 — {copy.processLabel}
          </div>
          <div className="cbh-steps absolute flex justify-center" style={{ left: "6cqw", right: "6cqw", bottom: "9cqh", gap: "6cqw" }}>
            {copy.steps.map((s, i) => (
              <div key={s} {...sc(2, "clip", 0.15 + i * 0.15)} className="text-center" style={hidden}>
                <div style={{ ...sans, fontSize: 11, letterSpacing: "0.3em", color: lime, marginBottom: 6 }}>{String(i + 1).padStart(2, "0")}</div>
                <div style={{ ...display, fontSize: "min(3.6cqw, 5.2cqh)", lineHeight: 1, fontStyle: "italic" }}>{s}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ============================ 3 · final ============================ */}
        <div className="pointer-events-none absolute inset-0">
          <div className="cbh-left absolute" style={{ left: "6cqw", top: "52%", transform: "translateY(-50%)", maxWidth: "46cqw" }}>
            {logo && (
              <img {...sc(3, "rise", 0)} src={logo} alt="Holzen coffee" className="block w-auto" style={{ ...hidden, height: "min(14cqh, 130px)", marginBottom: "3cqh" }} />
            )}
            <h1
              {...sc(3, "clip", 0.15)}
              className="whitespace-pre-line"
              style={{ ...sans, ...hidden, margin: "0 0 3.5cqh", fontWeight: 600, fontSize: "clamp(1.5rem, min(3.4cqw, 6cqh), 2.85rem)", lineHeight: 1.03, letterSpacing: "-0.025em", color: lime }}
            >
              {copy.title}
            </h1>
            <div {...sc(3, "rise", 0.35)} className="flex flex-wrap gap-3" style={hidden}>
              <button
                type="button"
                onClick={onPrimary}
                className="inline-flex items-center rounded-full px-6 py-2.5 text-sm font-medium tracking-wide uppercase whitespace-nowrap cursor-pointer transition-all duration-200 hover:bg-white hover:border-white"
                style={{ background: lime, border: "1px solid " + lime, color: ink }}
              >
                {copy.ctaPrimary}
              </button>
              <button
                type="button"
                onClick={onSecondary}
                className="inline-flex items-center rounded-full px-6 py-2.5 text-sm font-medium tracking-wide whitespace-nowrap cursor-pointer transition-all duration-200 hover:!bg-[#BBDA1F] hover:!text-[#0D0D0C]"
                style={{ background: "transparent", border: "1px solid " + lime, color: lime }}
              >
                {copy.ctaSecondary}
              </button>
            </div>
            <p {...sc(3, "rise", 0.5)} className="cbh-hide-sm" style={{ ...sans, ...hidden, maxWidth: 360, fontSize: 13, lineHeight: 1.5, margin: "3.5cqh 0 0", opacity: 0 }}>
              {copy.desc}
            </p>
          </div>
        </div>

        {/* ============================ navegación ============================ */}
        <nav
          aria-label="Hero"
          className="cbh-nav cbh-hide-sm absolute flex flex-col items-end"
          style={{ ...sans, right: "2cqw", top: "50%", transform: "translateY(-50%)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase" }}
        >
          {nav.map((n, i) => (
            <button key={i} type="button" onClick={() => jump(i)} aria-label={n} aria-current={active === i ? "step" : undefined}>
              <span className="cbh-tick" />
            </button>
          ))}
        </nav>

        <svg aria-hidden className="pointer-events-none absolute inset-0" width="100%" height="100%" style={{ opacity: 0.07, mixBlendMode: "screen" }}>
          <filter id="cbh-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cbh-grain)" />
        </svg>
      </div>
    </section>
  )
}
