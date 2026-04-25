import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { reviews } from '@/mocks/reviews';

const Stars = ({ count, small = false }: { count: number; small?: boolean }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <i
        key={i}
        className={`ri-star-fill ${small ? 'text-xs' : 'text-base'} ${i < count ? 'text-gold' : 'text-cream/20'}`}
      />
    ))}
  </div>
);

const LangBadge = ({ lang }: { lang: string }) => {
  const map: Record<string, string> = { ES: '🇪🇸', EN: '🇬🇧', DE: '🇩🇪', CS: '🇨🇿' };
  return (
    <span className="text-[10px] font-sans tracking-widest text-cream/40 flex items-center gap-1">
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
    <section id="reviews" className="relative py-14 md:py-24 px-4 md:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/Holzen/images/reviews-bg.jpg"
          alt="background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-coffee-900/65" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="block w-10 h-px bg-gold/50" />
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans">{t('reviews_eyebrow')}</p>
            <span className="block w-10 h-px bg-gold/50" />
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-cream leading-tight">
            {t('reviews_title')}
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center">
          {/* Left ghost */}
          <div
            className="hidden md:block absolute left-0 w-[280px] cursor-pointer"
            style={{ zIndex: 1 }}
            onClick={prev}
          >
            <div className="opacity-35 scale-90 origin-right transition-all duration-500 pointer-events-none">
              <GhostCard review={reviews[getIdx(-1)]} />
            </div>
          </div>

          {/* Center card */}
          <div className="relative z-10 w-full max-w-xl mx-auto md:mx-0 transition-all duration-500">
            <ActiveCard review={reviews[active]} />
          </div>

          {/* Right ghost */}
          <div
            className="hidden md:block absolute right-0 w-[280px] cursor-pointer"
            style={{ zIndex: 1 }}
            onClick={next}
          >
            <div className="opacity-35 scale-90 origin-left transition-all duration-500 pointer-events-none">
              <GhostCard review={reviews[getIdx(1)]} />
            </div>
          </div>

          {/* Nav arrows — visible on mobile too */}
          <button
            onClick={prev}
            className="absolute left-0 md:-left-10 z-20 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <i className="ri-arrow-left-s-line text-xl" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 md:-right-10 z-20 w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <i className="ri-arrow-right-s-line text-xl" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8 md:mt-10">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === active
                  ? 'w-6 h-2 bg-gold'
                  : 'w-2 h-2 bg-cream/30 hover:bg-cream/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── Active (center) card ── */
const ActiveCard = ({ review }: { review: (typeof reviews)[0] }) => (
  <div className="bg-white rounded-2xl p-5 md:p-10 mx-6 md:mx-0">
    <Stars count={review.stars} />

    <p className="text-coffee-800 font-sans text-sm md:text-base leading-relaxed mt-4 mb-5 md:mt-5 md:mb-7">
      {review.text}
    </p>

    <div className="flex items-center gap-3 pt-4 md:pt-5 border-t border-coffee-100">
      <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full overflow-hidden bg-coffee-100">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div className="min-w-0">
        <div className="font-serif text-sm md:text-base text-coffee-900 font-bold truncate">{review.name}</div>
        <div className="text-xs text-gold font-sans mt-0.5 truncate">{review.location}</div>
      </div>
      <div className="ml-auto flex-shrink-0">
        <LangBadge lang={review.lang} />
      </div>
    </div>
  </div>
);

/* ── Ghost (side) card ── */
const GhostCard = ({ review }: { review: (typeof reviews)[0] }) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
    <Stars count={review.stars} small />
    <p className="text-cream/60 font-sans text-xs leading-relaxed mt-3 mb-4 line-clamp-4">
      {review.text}
    </p>
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 flex-shrink-0 rounded-full overflow-hidden bg-white/10">
        <img
          src={review.avatar}
          alt={review.name}
          className="w-full h-full object-cover object-top"
        />
      </div>
      <div>
        <div className="font-serif text-xs text-cream/80 font-semibold">{review.name}</div>
        <div className="text-[10px] text-gold/60 font-sans">{review.location}</div>
      </div>
    </div>
  </div>
);

export default Reviews;
