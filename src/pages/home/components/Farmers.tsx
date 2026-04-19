import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { farmers } from '../../../mocks/holzen';

const AUTOPLAY_MS = 6500;

interface SideCardProps {
  farmer: typeof farmers[0];
  onClick: () => void;
  isLeaving: boolean;
}

const SideCard = ({ farmer, onClick, isLeaving }: SideCardProps) => (
  <button
    onClick={onClick}
    className="group relative rounded-xl overflow-hidden cursor-pointer border border-cream/10 hover:border-gold/50 w-full"
    style={{
      height: '148px',
      opacity: isLeaving ? 0.35 : 1,
      transform: isLeaving ? 'scale(0.96)' : 'scale(1)',
      transition: 'opacity 0.5s ease, transform 0.5s ease, border-color 0.3s ease',
    }}
  >
    <img
      src={farmer.image}
      alt={farmer.name}
      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
    />
    <div className="absolute inset-0 bg-coffee-900/55 group-hover:bg-coffee-900/20 transition-colors duration-300" />
    <div className="absolute bottom-0 left-0 right-0 p-2.5">
      <p className="text-gold font-sans mb-0.5 truncate" style={{ fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{farmer.tag}</p>
      <p className="text-cream font-serif text-xs leading-tight">{farmer.name}</p>
      <div className="flex items-center gap-1 mt-1.5">
        <i className="ri-user-line text-gold/60" style={{ fontSize: '9px' }} />
        <span className="text-cream/50 font-sans truncate" style={{ fontSize: '9px' }}>{farmer.stat} {farmer.statLabel}</span>
      </div>
    </div>
  </button>
);

const Farmers = () => {
  const { t } = useTranslation();
  const [cur, setCur] = useState(0);
  const [next, setNext] = useState<number | null>(null);
  const [curtainPhase, setCurtainPhase] = useState<'idle' | 'cover' | 'reveal'>('idle');
  const [showStory, setShowStory] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animRef = useRef(false);

  const goTo = useCallback((idx: number) => {
    if (animRef.current || idx === cur) return;
    animRef.current = true;
    setNext(idx);
    setCurtainPhase('cover');
    setTimeout(() => {
      setCur(idx);
      setNext(null);
      setCurtainPhase('reveal');
      setTimeout(() => {
        setCurtainPhase('idle');
        animRef.current = false;
      }, 420);
    }, 380);
  }, [cur]);

  const advance = useCallback(() => {
    goTo((cur + 1) % farmers.length);
  }, [cur, goTo]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(advance, AUTOPLAY_MS);
  }, [advance]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  }, []);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  const handleSelect = (idx: number) => {
    setShowStory(false);
    startTimer();
    goTo(idx);
  };

  const handleStoryToggle = () => {
    setShowStory((v) => {
      if (!v) stopTimer();
      else startTimer();
      return !v;
    });
  };

  const f = farmers[cur];
  const nextF = next !== null ? farmers[next] : null;
  const others = farmers.map((_, i) => i).filter(i => i !== cur);
  const leftOthers = others.slice(0, Math.ceil(others.length / 2));
  const rightOthers = others.slice(Math.ceil(others.length / 2));

  const curtainVisible = curtainPhase === 'cover' || curtainPhase === 'reveal';
  const curtainFull = curtainPhase === 'cover';

  return (
    <section id="farmers" className="relative w-full bg-coffee-900 overflow-hidden py-10 md:py-12">
      <video autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none"
        src="https://res.cloudinary.com/djfmngyl0/video/upload/v1773436299/14701095_1920_1080_30fps_amrqfg.mp4"
      />
      <div className="absolute inset-0 bg-coffee-900/35 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-3">{t('farmers_eyebrow')}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream">{t('farmers_title')}</h2>
          <p className="text-cream/40 font-sans text-sm mt-2 max-w-md mx-auto leading-relaxed">
            {t('farmers_desc')}
          </p>
        </div>

        {/* Stage */}
        <div className="flex items-center justify-center gap-5">

          {/* Left thumbnails */}
          <div className="hidden md:flex flex-col gap-3 flex-shrink-0" style={{ width: '130px' }}>
            {leftOthers.map((idx) => (
              <SideCard key={idx} farmer={farmers[idx]} onClick={() => handleSelect(idx)} isLeaving={next === idx} />
            ))}
          </div>

          {/* Center card */}
          <div className="relative flex-shrink-0 rounded-2xl overflow-hidden" style={{ width: '400px', maxWidth: '90vw' }}>

            <div className="relative w-full overflow-hidden" style={{ height: '420px' }}>

              <img
                src={f.image}
                alt={f.name}
                className="absolute inset-0 w-full h-full object-cover object-top"
              />

              {nextF && (
                <img
                  src={nextF.image}
                  alt={nextF.name}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  style={{ opacity: curtainPhase === 'reveal' ? 1 : 0 }}
                />
              )}

              <div
                className="absolute inset-x-0 top-0 bg-coffee-900 z-20 pointer-events-none"
                style={{
                  height: '100%',
                  transform: curtainVisible
                    ? curtainFull ? 'translateY(0%)' : 'translateY(-100%)'
                    : 'translateY(-100%)',
                  transition: curtainFull
                    ? 'transform 0.38s cubic-bezier(0.4,0,0.2,1)'
                    : 'transform 0.42s cubic-bezier(0.4,0,0.2,1)',
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-coffee-900 via-coffee-900/10 to-transparent z-10" />

              <div className="absolute top-4 left-4 z-30">
                <span className="flex items-center gap-1.5 bg-coffee-900/80 border border-gold/40 text-gold text-[10px] tracking-widest uppercase font-sans font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                  <i className={f.tagIcon} style={{ fontSize: '11px' }} />
                  {f.tag}
                </span>
              </div>

              <div className="absolute top-4 right-4 z-30">
                <span className="text-cream/30 font-serif text-sm tabular-nums">
                  {String(cur + 1).padStart(2, '0')} / {String(farmers.length).padStart(2, '0')}
                </span>
              </div>

              {!showStory && (
                <div className="absolute bottom-5 right-5 z-30">
                  <button
                    onClick={handleStoryToggle}
                    className="flex items-center gap-1.5 bg-coffee-900/60 backdrop-blur-sm border border-cream/20 text-cream text-[9px] tracking-widest uppercase font-sans px-3 py-1.5 rounded-full cursor-pointer hover:border-gold/50 transition-colors whitespace-nowrap"
                  >
                    <i className="ri-book-open-line" style={{ fontSize: '10px' }} />
                    {t('farmers_see_story')}
                  </button>
                </div>
              )}

              <div
                className="absolute inset-x-0 bottom-0 z-30 px-6 pb-6 pt-12 cursor-pointer"
                style={{
                  background: 'linear-gradient(to top, rgba(15,8,3,0.98) 65%, transparent)',
                  opacity: showStory ? 1 : 0,
                  transform: showStory ? 'translateY(0)' : 'translateY(16px)',
                  transition: 'opacity 0.4s ease, transform 0.4s ease',
                  pointerEvents: showStory ? 'auto' : 'none',
                }}
                onClick={handleStoryToggle}
              >
                <p className="text-gold/70 font-sans text-[10px] tracking-widest uppercase mb-1">{f.location}</p>
                <h3 className="font-serif text-xl text-cream leading-tight mb-3">{f.name}</h3>
                <p className="text-cream/75 font-sans text-sm leading-relaxed mb-4">{f.story}</p>
                <div className="flex items-center gap-2">
                  <i className="ri-user-line text-gold" style={{ fontSize: '13px' }} />
                  <span className="font-serif text-gold font-bold">{f.stat}</span>
                  <span className="text-cream/40 font-sans text-xs">{f.statLabel}</span>
                </div>
                <p className="text-cream/30 font-sans text-[9px] mt-4 tracking-widest uppercase">{t('farmers_tap_close')}</p>
              </div>

              <div
                className="absolute bottom-5 left-5 z-20 transition-all duration-300"
                style={{ opacity: showStory ? 0 : 1, transform: showStory ? 'translateY(4px)' : 'translateY(0)' }}
              >
                <p className="font-serif text-lg text-cream leading-tight">{f.name}</p>
                <p className="text-cream/45 font-sans text-[10px] tracking-widest uppercase mt-0.5">{f.location}</p>
              </div>
            </div>

            <div
              className="bg-coffee-900/95 border-t border-cream/10 px-5 py-3 flex items-center gap-3 transition-all duration-400"
              style={{ opacity: curtainPhase === 'cover' ? 0 : 1 }}
            >
              <i className="ri-user-line text-gold" style={{ fontSize: '14px' }} />
              <span className="font-serif text-gold text-lg font-bold">{f.stat}</span>
              <span className="text-cream/40 font-sans text-xs">{f.statLabel}</span>
            </div>
          </div>

          {/* Right thumbnails */}
          <div className="hidden md:flex flex-col gap-3 flex-shrink-0" style={{ width: '130px' }}>
            {rightOthers.map((idx) => (
              <SideCard key={idx} farmer={farmers[idx]} onClick={() => handleSelect(idx)} isLeaving={next === idx} />
            ))}
          </div>

        </div>

        {/* Mobile thumbnails */}
        <div className="flex md:hidden gap-3 mt-5 justify-center flex-wrap">
          {others.map((idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className="group relative rounded-xl overflow-hidden cursor-pointer border border-cream/10 hover:border-gold/50 transition-all duration-300"
              style={{ width: '80px', height: '110px' }}
            >
              <img src={farmers[idx].image} alt={farmers[idx].name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-coffee-900/55 group-hover:bg-coffee-900/25 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="text-cream font-serif leading-tight" style={{ fontSize: '9px' }}>{farmers[idx].name}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 mt-8 justify-center flex-wrap">
          {farmers.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className="relative h-[3px] rounded-full overflow-hidden cursor-pointer transition-all duration-300"
              style={{ width: idx === cur ? '48px' : '16px', background: 'rgba(201,169,110,0.2)' }}
            >
              {idx === cur && !showStory && (
                <span
                  className="absolute inset-0 bg-gold rounded-full origin-left"
                  style={{ animation: `progressBar ${AUTOPLAY_MS}ms linear forwards` }}
                />
              )}
              {idx === cur && showStory && (
                <span className="absolute inset-0 bg-gold rounded-full" />
              )}
            </button>
          ))}
        </div>

      </div>

      <style>{`
        @keyframes progressBar {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
};

export default Farmers;
