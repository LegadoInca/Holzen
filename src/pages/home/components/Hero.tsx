import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { heroSlides } from '../../../mocks/holzen';

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const Hero = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5500);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section id="hero" className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
      {heroSlides.map((slide, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slide.type === 'video' ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={slide.src} type="video/mp4" />
            </video>
          ) : (
            <img
              src={slide.src}
              alt=""
              className="w-full h-full object-cover object-top"
            />
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-coffee-900/50 via-coffee-900/30 to-coffee-900/70" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-start justify-center text-left px-6 md:px-16 max-w-4xl">
        <p className="text-gold text-xs tracking-[0.4em] uppercase font-serif mb-4 opacity-90">
          {t('hero_eyebrow')}
        </p>
        <h1 className="font-serif font-black text-[clamp(2.5rem,7vw,5.5rem)] leading-none tracking-[0.15em] text-cream uppercase mb-4">
          HOLZEN
        </h1>
        <p className="font-serif font-black text-[clamp(0.85rem,2.3vw,1.9rem)] leading-tight tracking-[0.08em] text-cream uppercase mb-8 whitespace-pre-line">
          {t('hero_subtitle')}
        </p>
        <p className="max-w-xl text-cream/70 text-sm md:text-base font-serif leading-relaxed mb-10">
          {t('hero_desc')}
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => scrollTo('products')}
            className="relative overflow-hidden bg-gold hover:bg-gold-light text-coffee-900 font-serif font-black px-8 py-3.5 rounded-full text-sm tracking-widest uppercase transition-colors cursor-pointer whitespace-nowrap group"
            style={{ boxShadow: '0 0 20px rgba(201,169,110,0.45)' }}
          >
            <span className="relative z-10">{t('hero_cta_primary')}</span>
            <span className="absolute top-0 bottom-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </button>
          <button
            onClick={() => scrollTo('farmers')}
            className="relative overflow-hidden border border-cream/60 hover:border-cream text-cream hover:bg-cream/5 font-serif font-black px-8 py-3.5 rounded-full text-sm tracking-widest uppercase transition-all cursor-pointer whitespace-nowrap group"
            style={{ boxShadow: '0 0 18px rgba(245,235,210,0.18)' }}
          >
            <span className="relative z-10">{t('hero_cta_secondary')}</span>
            <span className="absolute top-0 bottom-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </button>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === current
                ? 'w-8 h-2 bg-gold'
                : 'w-2 h-2 bg-cream/30 hover:bg-cream/60'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
