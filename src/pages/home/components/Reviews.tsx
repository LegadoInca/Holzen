import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { reviews } from '@/mocks/reviews';

const INK = '#0D0D0C';
const STAR = '#F2B705';
const sans = "'Inter', system-ui, sans-serif";

const Stars = ({ count, small = false }: { count: number; small?: boolean }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <i
        key={i}
        className={`ri-star-fill ${small ? 'text-xs' : 'text-sm md:text-base'}`}
        style={{ color: i < count ? STAR : 'rgba(13,13,12,0.14)' }}
      />
    ))}
  </div>
);

const LangBadge = ({ lang }: { lang: string }) => {
  const map: Record<string, string> = { ES: '🇪🇸', EN: '🇬🇧', DE: '🇩🇪', CS: '🇨🇿' };
  return (
    <span className="text-[10px] font-sans tracking-widest flex items-center gap-1" style={{ color: 'rgba(13,13,12,0.4)' }}>
      <span>{map[lang] ?? '🌍'}</span>
      <span>{lang}</span>
    </span>
  );
};

const Reviews = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);
  const total = reviews.length;

  const prev = useCallback(() => setActive((a) => (a - 1 + total) % total), [total]);
  const next = useCallback(() => setActive((a) => (a + 1) % total), [total]);

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  const getIdx = (offset: number) => (active + offset + total) % total;

  return (
    <section
      id="reviews"
      className="relative py-14 md:py-20 px-4 md:px-6 overflow-hidden"
      style={{ background: '#F7F4EA', borderTop: '1px solid rgba(13,13,12,0.08)' }}
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-10 md:mb-14">
          <p
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase font-semibold mb-3"
            style={{ color: INK, fontFamily: sans }}
          >
            <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#BBDA1F' }} />
            {t('reviews_eyebrow')}
          </p>
          <h2
            className="text-3xl md:text-5xl"
            style={{ fontFamily: sans, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.05, color: INK }}
          >
            {t('reviews_title')}
          </h2>
        </div>

        {/* Carrusel */}
        <div className="relative flex items-center justify-center">
          {/* Tarjeta lateral izquierda */}
          <div
            className="hidden md:block absolute left-0 lg:left-[4%] w-[250px] cursor-pointer"
            style={{ zIndex: 1 }}
            onClick={prev}
          >
            <div className="opacity-60 scale-90 origin-right transition-all duration-500 pointer-events-none">
              <GhostCard review={reviews[getIdx(-1)]} />
            </div>
          </div>

          {/* Tarjeta central (más compacta) */}
          <div className="relative z-10 w-full max-w-[28rem] mx-auto md:mx-0 transition-all duration-500">
            <ActiveCard review={reviews[active]} />
          </div>

          {/* Tarjeta lateral derecha */}
          <div
            className="hidden md:block absolute right-0 lg:right-[4%] w-[250px] cursor-pointer"
            style={{ zIndex: 1 }}
            onClick={next}
          >
            <div className="opacity-60 scale-90 origin-left transition-all duration-500 pointer-events-none">
              <GhostCard review={reviews[getIdx(1)]} />
            </div>
          </div>

          {/* Flechas */}
          <button
            onClick={prev}
            className="absolute left-0 md:left-2 z-20 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white hover:!bg-[#0D0D0C] hover:!text-white transition-all cursor-pointer"
            style={{ border: '1px solid rgba(13,13,12,0.18)', color: INK, boxShadow: '0 6px 16px rgba(13,13,12,0.08)' }}
            aria-label="Anterior"
          >
            <i className="ri-arrow-left-s-line text-xl" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 md:right-2 z-20 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white hover:!bg-[#0D0D0C] hover:!text-white transition-all cursor-pointer"
            style={{ border: '1px solid rgba(13,13,12,0.18)', color: INK, boxShadow: '0 6px 16px rgba(13,13,12,0.08)' }}
            aria-label="Siguiente"
          >
            <i className="ri-arrow-right-s-line text-xl" />
          </button>
        </div>

        {/* Puntos */}
        <div className="flex justify-center gap-2 mt-8 md:mt-10">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="transition-all duration-300 rounded-full cursor-pointer"
              style={{
                width: i === active ? 24 : 8,
                height: 8,
                background: i === active ? INK : 'rgba(13,13,12,0.2)',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Tarjeta activa (centro) ── */
const ActiveCard = ({ review }: { review: (typeof reviews)[0] }) => (
  <div
    className="bg-white rounded-2xl p-5 md:p-7 mx-6 md:mx-0"
    style={{ border: '1px solid rgba(13,13,12,0.08)', boxShadow: '0 18px 50px rgba(13,13,12,0.09)' }}
  >
    <Stars count={review.stars} />

    <p
      className="text-[13px] md:text-sm leading-relaxed mt-3 mb-4 md:mt-4 md:mb-5"
      style={{ fontFamily: sans, color: 'rgba(13,13,12,0.82)' }}
    >
      {review.text}
    </p>

    <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: 'rgba(13,13,12,0.1)' }}>
      <div className="w-9 h-9 md:w-10 md:h-10 flex-shrink-0 rounded-full overflow-hidden bg-stone-200">
        <img src={review.avatar} alt={review.name} className="w-full h-full object-cover object-top" />
      </div>
      <div className="min-w-0">
        <div className="text-sm truncate" style={{ fontFamily: sans, fontWeight: 700, color: INK }}>{review.name}</div>
        <div className="text-xs mt-0.5 truncate" style={{ fontFamily: sans, color: 'rgba(13,13,12,0.55)' }}>{review.location}</div>
      </div>
      <div className="ml-auto flex-shrink-0">
        <LangBadge lang={review.lang} />
      </div>
    </div>
  </div>
);

/* ── Tarjeta lateral ── */
const GhostCard = ({ review }: { review: (typeof reviews)[0] }) => (
  <div
    className="rounded-2xl p-5"
    style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(13,13,12,0.08)' }}
  >
    <Stars count={review.stars} small />
    <p
      className="text-xs leading-relaxed mt-3 mb-4 line-clamp-4"
      style={{ fontFamily: sans, color: 'rgba(13,13,12,0.6)' }}
    >
      {review.text}
    </p>
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden bg-stone-200">
        <img src={review.avatar} alt={review.name} className="w-full h-full object-cover object-top" />
      </div>
      <div>
        <div className="text-xs" style={{ fontFamily: sans, fontWeight: 600, color: 'rgba(13,13,12,0.75)' }}>{review.name}</div>
        <div className="text-[10px]" style={{ fontFamily: sans, color: 'rgba(13,13,12,0.45)' }}>{review.location}</div>
      </div>
    </div>
  </div>
);

export default Reviews;
