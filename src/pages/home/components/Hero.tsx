import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion';

// ─────────────────────────────────────────────────────────────
// Hero con secuencia de cuadros controlada por scroll ("Del grano a la taza").
// El video se exportó como imágenes WebP (public/hero-frames/) y se dibuja en
// un <canvas>: es mucho más fluido que adelantar un <video> con el scroll.
// Para cambiar el video, regenera los cuadros:
//   ffmpeg -i video.mp4 -vf scale=1600:-2 -c:v libwebp -quality 72 public/hero-frames/desktop/%03d.webp
//   ffmpeg -i video.mp4 -vf scale=900:-2  -c:v libwebp -quality 68 public/hero-frames/mobile/%03d.webp
// y actualiza FRAME_COUNT.
// ─────────────────────────────────────────────────────────────
const FRAME_COUNT = 156;
const frameUrl = (dir: 'desktop' | 'mobile', i: number) =>
  `/Holzen/hero-frames/${dir}/${String(i + 1).padStart(3, '0')}.webp`;
// Largo del recorrido de scroll del hero (más bajo = video más rápido)
const SCROLL_LENGTH = '240vh';
// Parte del scroll que ocupa el video; el resto es para mostrar el texto
const VIDEO_END = 0.78;
// Logo del hero: versión con "coffee" en blanco (el navbar usa holzen-logo.png)
const LOGO = '/Holzen/images/holzen-logo-coffee-blanco.png';

const LIME = '#BBDA1F';
const INK = '#0D0D0C';

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const Hero = () => {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const target = useRef(0);   // cuadro objetivo según el scroll
  const current = useRef(0);  // cuadro mostrado (interpolado)
  const drawn = useRef(-1);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    target.current = Math.min(p / VIDEO_END, 1) * (FRAME_COUNT - 1);
  });

  // Dibuja el cuadro más cercano ya cargado, tipo "object-cover"
  const draw = (index: number) => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || !frames.length) return;
    let i = index;
    while (i > 0 && !(frames[i]?.complete && frames[i].naturalWidth)) i--;
    const img = frames[i];
    if (!img?.complete || !img.naturalWidth) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const cw = canvas.width, ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale, h = img.naturalHeight * scale;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    drawn.current = index;
  };

  // Precarga de cuadros + tamaño del canvas
  useEffect(() => {
    const dir = window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop';
    const frames: HTMLImageElement[] = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = 'async';
      img.src = frameUrl(dir, i);
      if (i === 0) img.onload = () => draw(0);
      frames.push(img);
    }
    framesRef.current = frames;

    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      draw(Math.round(current.current));
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // Bucle de animación: interpolación suave hacia el cuadro objetivo
  useEffect(() => {
    if (reduceMotion) return;
    let raf = 0;
    const tick = () => {
      current.current += (target.current - current.current) * 0.25;
      const idx = Math.round(current.current);
      if (idx !== drawn.current) draw(idx);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  // Al inicio solo el video; el titular, botones y sombras aparecen al final
  const reveal = reduceMotion ? [0, 0.001] : [VIDEO_END - 0.12, VIDEO_END + 0.08];
  const contentOpacity = useTransform(scrollYProgress, reveal, [0, 1]);
  const contentY = useTransform(scrollYProgress, reveal, [50, 0]);
  const contentEvents = useTransform(contentOpacity, (o) => (o > 0.5 ? 'auto' : 'none'));
  const shadeOpacity = useTransform(scrollYProgress, reveal, [0, 1]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full"
      style={{ background: INK, height: reduceMotion ? '100vh' : SCROLL_LENGTH }}
    >
      <div className="sticky top-0 h-screen min-h-[600px] w-full overflow-hidden">
      {/* Secuencia de cuadros controlada por scroll */}
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 w-full h-full" />

      <motion.div className="absolute inset-0" style={{ opacity: shadeOpacity }}>

      {/* Oscurecido lateral para que el texto lima se lea (como la referencia) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.60) 36%, rgba(0,0,0,0.14) 68%, rgba(0,0,0,0) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 40%)' }}
      />
      {/* Sombra suave abajo a la derecha: asegura que la descripción se lea sobre cualquier foto */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{ background: 'radial-gradient(ellipse 55% 50% at 84% 80%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0) 72%)' }}
      />
      {/* Degradado arriba: el navbar transparente se lee sobre cualquier foto */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 24%)' }}
      />
      <div className="absolute inset-0 bg-black/30 md:hidden" />
      </motion.div>

      {/* Contenido */}
      <motion.div
        className="relative z-10 h-full max-w-[1400px] mx-auto px-5 md:px-10 flex flex-col"
        style={{ opacity: contentOpacity, y: contentY, pointerEvents: contentEvents }}
      >
        <div className="flex-1 flex items-center pt-[10vh]">
          <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12">
            {/* Titular + botones */}
            <div className="max-w-3xl">
              <img
                src={LOGO}
                alt="Holzen coffee"
                className="h-24 md:h-36 w-auto block mb-6 md:mb-8"
              />
              <h1
                className="whitespace-pre-line"
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: 'clamp(1.5rem, 3.4vw, 2.85rem)',
                  lineHeight: 1.03,
                  letterSpacing: '-0.025em',
                  color: LIME,
                  margin: '0 0 1.75rem',
                }}
              >
                {t('hero_subtitle')}
              </h1>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => scrollTo('products')}
                  className="inline-flex items-center rounded-full px-6 py-2.5 text-sm font-medium tracking-wide uppercase whitespace-nowrap cursor-pointer transition-all duration-200 hover:bg-white hover:border-white"
                  style={{ background: LIME, border: `1px solid ${LIME}`, color: INK }}
                >
                  {t('hero_cta_primary')}
                </button>
                <button
                  onClick={() => scrollTo('farmers')}
                  className="inline-flex items-center rounded-full px-6 py-2.5 text-sm font-medium tracking-wide whitespace-nowrap cursor-pointer transition-all duration-200 hover:!bg-[#BBDA1F] hover:!text-[#0D0D0C]"
                  style={{ background: 'transparent', border: `1px solid ${LIME}`, color: LIME }}
                >
                  {t('hero_cta_secondary')}
                </button>
              </div>
            </div>

            {/* Descripción, pequeña y a la derecha */}
            <p
              className="md:max-w-[22rem] text-[13px] leading-[1.5]"
              style={{ fontFamily: "'Inter', system-ui, sans-serif", color: LIME, textShadow: '0 1px 10px rgba(0,0,0,0.7)' }}
            >
              {t('hero_desc')}
            </p>
          </div>
        </div>

        {/* Pie pequeño */}
        <p
          className="pb-5 md:pb-6 text-[11px] tracking-[0.18em] uppercase"
          style={{ fontFamily: "'Inter', system-ui, sans-serif", color: LIME, opacity: 0.85 }}
        >
          {t('hero_eyebrow')}
        </p>
      </motion.div>

      {/* Indicador de scroll */}
      {!reduceMotion && (
        <motion.div
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
          style={{ opacity: hintOpacity }}
        >
          <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: LIME }}>Scroll</span>
          <motion.span
            className="block w-px h-8"
            style={{ background: LIME, transformOrigin: 'top' }}
            animate={{ scaleY: [0, 1, 0], y: [0, 0, 16] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
      </div>
    </section>
  );
};

export default Hero;
