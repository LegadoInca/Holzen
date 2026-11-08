import { useTranslation } from 'react-i18next';

// ─────────────────────────────────────────────────────────────
// Imagen única del hero.
// Cuando tengas la foto final, súbela a public/images/ y cambia solo esta línea.
// Medida recomendada: 1920 × 1080 px (16:9), JPG/WebP, idealmente < 400 KB.
// Sujeto a la DERECHA; la mitad izquierda debe ser tranquila/oscura (ahí va el texto).
// ─────────────────────────────────────────────────────────────
const HERO_IMAGE = '/Holzen/images/hero1.jpg';

const LIME = '#BBDA1F';
const INK = '#0D0D0C';

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden mt-16 h-[calc(100vh-4rem)] min-h-[560px]"
      style={{ background: INK }}
    >
      {/* Foto única en blanco y negro (quita el filter si prefieres la foto a color) */}
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '68% 35%', filter: 'grayscale(1) contrast(1.08)' }}
      />

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
      <div className="absolute inset-0 bg-black/30 md:hidden" />

      {/* Contenido */}
      <div className="relative z-10 h-full max-w-[1400px] mx-auto px-5 md:px-10 flex flex-col">
        <div className="flex-1 flex items-center pt-[6vh]">
          <div className="w-full flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-12">
            {/* Titular + botones */}
            <div className="max-w-3xl">
              <h1
                className="whitespace-pre-line"
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: 600,
                  fontSize: 'clamp(2.1rem, 5vw, 4.25rem)',
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
      </div>
    </section>
  );
};

export default Hero;
