import * as React from "react"

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
 * Grano de café: elipsoide con el eje largo en X, la cara plana hacia +Y y,
 * sobre ella, la hendidura en forma de S que recorre el grano de punta a punta.
 */
const RL = 1.0 // semieje largo
const RW = 0.56 // alto (cara plana → lomo)
const RD = 0.72 // ancho

const beanPoint = (u: number, v: number): { p: V3; occ: number } => {
  const sv = Math.sin(v)
  const cv = Math.cos(v)
  const su = Math.sin(u)
  const cu = Math.cos(u)
  // pequeñas irregularidades para que no parezca una píldora
  const wob = 1 + 0.025 * Math.sin(3 * u + 1.3) * sv + 0.015 * Math.sin(5 * v + 2.1)
  const x = RL * cv * wob
  let y = RW * sv * su * wob
  const z = RD * sv * cu * wob
  let occ = 0
  if (su > 0) {
    // aplanar la cara frontal con continuidad suave
    y *= 1 - 0.5 * su
    // hendidura en S
    const t = x / RL
    const cz = 0.09 * Math.sin(t * Math.PI * 1.15)
    const d = (z - cz) / 0.075
    const taper = Math.max(0, 1 - Math.pow(Math.abs(t), 3.2))
    const face = Math.min(1, su * 2.2)
    const g = Math.exp(-d * d) * taper * face
    y -= 0.2 * g
    occ = g
  }
  return { p: [x, y, z], occ }
}

const buildBean = () => {
  const U = 96
  const V = 64
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
      if (!Number.isFinite(n[0]) || Math.hypot(...pu) < 1e-6) n = norm(p)
      if (dot(n, p) < 0) n = [-n[0], -n[1], -n[2]]
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
  { spin: 4.2, el: 24, size: 0.4, ox: 0.46, oy: -0.02, roll: 0.45 },
]
const KEYS_TALL: Partial<Key>[] = [
  { size: 0.42, oy: 0.3 },
  { size: 0.42, ox: 0, oy: 0.4 },
  { size: 0.28, oy: 0.28 },
  { size: 0.38, ox: 0, oy: 0.46 },
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
varying vec3 v_n;
varying vec3 v_w;
varying float v_occ;
void main() {
  vec4 w = u_model * vec4(a_pos, 1.0);
  v_w = w.xyz;
  v_n = (u_model * vec4(a_nrm, 0.0)).xyz;
  v_occ = a_occ;
  gl_Position = u_vp * w;
  gl_Position.xy += u_offset * gl_Position.w;
}
`

// Grano tostado: difuso cálido, brillo aceitoso que crece con el tueste,
// hendidura oscurecida y un filo lima de la marca en los bordes.
const FRAG = `
precision highp float;
uniform vec3 u_eye;
uniform vec3 u_raw;
uniform vec3 u_roast;
uniform vec3 u_rim;
uniform vec3 u_gold;
uniform float u_roastK;
varying vec3 v_n;
varying vec3 v_w;
varying float v_occ;
float studio(vec3 r) {
  float key = pow(max(dot(r, normalize(vec3(-0.45, 0.85, 0.35))), 0.0), 18.0) * 2.4;
  float strip = smoothstep(0.6, 0.85, r.x) * smoothstep(-0.6, 0.3, r.y) * 0.9;
  float hz = exp(-abs(r.y - 0.05) * 8.0) * 0.25;
  return key + strip + hz;
}
void main() {
  vec3 n = normalize(v_n);
  vec3 v = normalize(u_eye - v_w);
  if (dot(n, v) < 0.0) n = -n;
  vec3 r = reflect(-v, n);
  vec3 base = mix(u_raw, u_roast, u_roastK);
  float gloss = mix(0.25, 1.0, u_roastK);
  float occ = 1.0 - 0.8 * v_occ;
  float dif = max(dot(n, normalize(vec3(-0.35, 0.8, 0.55))), 0.0);
  float back = max(dot(n, normalize(vec3(0.6, -0.2, -0.7))), 0.0);
  vec3 col = base * (0.1 + 1.05 * dif + 0.25 * back) * occ;
  float e = studio(r);
  col += vec3(1.0, 0.85, 0.68) * pow(e, 1.6) * 0.45 * gloss * occ;
  float fr = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  col += (u_gold * 0.45 + u_rim * 0.08) * fr;
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
  "@container cbh (orientation: portrait){.cbh-left{left:7cqw!important;right:7cqw!important;top:auto!important;bottom:10cqh!important;max-width:none!important}" +
  ".cbh-steps{gap:5cqw!important;bottom:7cqh!important}}" +
  "@container cbh (max-width: 720px){.cbh-hide-sm{display:none!important}}"

type Fx = "rise" | "clip" | "line" | "fade"
const sc = (scene: number, fx: Fx = "rise", delay = 0) => ({ "data-sc": scene, "data-fx": fx, "data-d": delay })

const DISPLAY = "'Playfair Display', Georgia, serif"
const SANS = "'Inter', system-ui, sans-serif"

export default function CoffeeBeanHero({
  copy,
  logo,
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

  const look = React.useRef({ reduced, lime })
  look.current = { reduced, lime }

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
      for (const n of ["u_vp", "u_model", "u_offset", "u_eye", "u_raw", "u_roast", "u_rim", "u_gold", "u_roastK"])
        loc[n] = g.getUniformLocation(prog, n)
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

    const RAW = hexToLinear("#A7A57C")
    const ROAST = hexToLinear("#5A3018")
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
      // tueste: verde en portada/origen, café brillante desde "proceso"
      const roastK = smoothstep(0.9, 2.0, coord)

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
        g.uniform3f(loc.u_raw, RAW[0], RAW[1], RAW[2])
        g.uniform3f(loc.u_roast, ROAST[0], ROAST[1], ROAST[2])
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
      }
    }
  }, [copy.word, gold])

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
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 block" style={{ width: "100%", height: "100%" }} />

        {/* ============================ 0 · portada ============================ */}
        <div className="pointer-events-none absolute inset-0">
          <div {...sc(0, "rise", 0.1)} className="absolute" style={{ ...eyebrow, ...hidden, left: "5cqw", top: "max(104px, 14cqh)" }}>
            {copy.eyebrow}
          </div>
          <div
            ref={wordRef}
            className="absolute whitespace-nowrap"
            style={{ ...sans, left: "50%", top: "70%", transform: "translate(-50%, -50%)", fontSize: "min(20cqw, 30cqh)", lineHeight: 1, fontWeight: 600, letterSpacing: "-0.04em" }}
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
