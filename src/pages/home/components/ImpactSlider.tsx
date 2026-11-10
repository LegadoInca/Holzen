import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SLIDER_MIN = 1;
const SLIDER_MAX = 100;

interface ImpactCard {
  icon: string;
  image: string;
  getValue: (n: number) => string;
  /** clave i18n del título de la tarjeta */
  labelKey: string;
  /** clave i18n de la frase que cambia según el valor del slider */
  sublabelKey: (n: number) => string;
}

const impactCards: ImpactCard[] = [
  {
    icon: 'ri-group-line',
    image: '/Holzen/images/impact1.jpeg',
    getValue: (n) => String(Math.max(1, Math.round(n / 12))),
    labelKey: 'impact_c1_label',
    sublabelKey: (n) => (n <= 10 ? 'impact_c1_s1' : n <= 40 ? 'impact_c1_s2' : 'impact_c1_s3'),
  },
  {
    icon: 'ri-money-dollar-circle-line',
    image: '/Holzen/images/product5.jpeg',
    getValue: () => '',
    labelKey: 'impact_c2_label',
    sublabelKey: (n) => (n <= 10 ? 'impact_c2_s1' : n <= 40 ? 'impact_c2_s2' : 'impact_c2_s3'),
  },
  {
    icon: 'ri-book-open-line',
    image: '/Holzen/images/impact3.jpeg',
    getValue: (n) => String(Math.max(1, Math.round(n / 18))),
    labelKey: 'impact_c3_label',
    sublabelKey: (n) => (n <= 15 ? 'impact_c3_s1' : n <= 50 ? 'impact_c3_s2' : 'impact_c3_s3'),
  },
  {
    icon: 'ri-plant-line',
    image: '/Holzen/images/product1.jpeg',
    getValue: (n) => String(Math.max(1, Math.round(n * 1.4))),
    labelKey: 'impact_c4_label',
    sublabelKey: (n) => (n <= 10 ? 'impact_c4_s1' : n <= 40 ? 'impact_c4_s2' : 'impact_c4_s3'),
  },
];

// Voces del campo: rol, cita y "años de…" salen de i18n (prod_<id>_role / _voice / _yl)
const voices = [
  { id: 'beltran', name: 'Beltran', location: 'Quillabamba, Cusco', image: '/Holzen/images/beltran.png', years: 4 },
  { id: 'juliana', name: 'Juliana Avalos Lopez', location: 'Quellouno, Cusco', image: '/Holzen/images/juliana.png', years: 6 },
  { id: 'edgar', name: 'Edgar Cardenas', location: 'Quellouno, Cusco', image: '/Holzen/images/edgar.png', years: 3 },
  { id: 'manuel', name: 'Manuel Ccahuana', location: 'Ayacucho, Valle del Pampas', image: '/Holzen/images/farmer5.jpg', years: 8 },
];

const ImpactSlider = () => {
  const { t } = useTranslation();
  // Inject numBounce keyframe
  useEffect(() => {
    const id = 'impact-slider-styles';
    if (!document.getElementById(id)) {
      const style = document.createElement('style');
      style.id = id;
      style.textContent = `@keyframes numBounce { 0%{transform:scale(1)} 30%{transform:scale(1.18)} 60%{transform:scale(0.95)} 80%{transform:scale(1.06)} 100%{transform:scale(1)} }`;
      document.head.appendChild(style);
    }
  }, []);
  const [sliderVal, setSliderVal] = useState(20);
  const [voiceIdx, setVoiceIdx] = useState(0);
  const [voiceFade, setVoiceFade] = useState(true);
  const [bouncing, setBouncing] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const bounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const pct = ((sliderVal - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;

  const triggerBounce = useCallback(() => {
    setBouncing(false);
    if (bounceTimer.current) clearTimeout(bounceTimer.current);
    // pequeño delay para que el re-render resetee la animación
    requestAnimationFrame(() => {
      setBouncing(true);
      bounceTimer.current = setTimeout(() => setBouncing(false), 350);
    });
  }, []);

  const calcFromX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setSliderVal(Math.round(SLIDER_MIN + ratio * (SLIDER_MAX - SLIDER_MIN)));
    triggerBounce();
  }, [triggerBounce]);

  const goToVoice = useCallback((idx: number) => {
    setVoiceFade(false);
    setTimeout(() => {
      setVoiceIdx(idx);
      setVoiceFade(true);
    }, 220);
  }, []);

  const resetAutoTimer = useCallback(() => {
    if (autoTimer.current) clearInterval(autoTimer.current);
    autoTimer.current = setInterval(() => {
      setVoiceIdx((prev) => {
        const next = (prev + 1) % voices.length;
        setVoiceFade(false);
        setTimeout(() => {
          setVoiceIdx(next);
          setVoiceFade(true);
        }, 220);
        return prev;
      });
    }, 4000);
  }, []);

  useEffect(() => {
    resetAutoTimer();
    return () => {
      if (autoTimer.current) clearInterval(autoTimer.current);
    };
  }, [resetAutoTimer]);

  useEffect(() => () => {
    if (bounceTimer.current) clearTimeout(bounceTimer.current);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    calcFromX(e.clientX);
    const onMove = (ev: MouseEvent) => { if (dragging.current) calcFromX(ev.clientX); };
    const onUp = () => { dragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    calcFromX(e.touches[0].clientX);
    const onMove = (ev: TouchEvent) => calcFromX(ev.touches[0].clientX);
    const onEnd = () => { window.removeEventListener('touchmove', onMove); window.removeEventListener('touchend', onEnd); };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  };

  const voice = voices[voiceIdx];

  return (
    <section
      className="relative py-10 md:py-14 px-4 md:px-6 overflow-hidden"
      style={{ background: '#F7F4EA', borderTop: '1px solid rgba(13,13,12,0.08)' }}
    >

      <div className="max-w-5xl mx-auto" style={{position:'relative', zIndex:10}}>

        {/* Header */}
        <div className="flex items-start justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h3 className="text-2xl md:text-4xl leading-tight" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, letterSpacing: '-0.025em', color: '#0D0D0C' }}>{t('impact_title')}</h3>
            <p className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full font-sans text-xs font-semibold cursor-default select-none" style={{ background: '#0D0D0C', color: '#BBDA1F' }}>
              <i className="ri-drag-move-line text-xs" />
              {t('impact_hint')}
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/15 bg-white/60">
            <i className="ri-seedling-line text-xs" style={{color:'#0D0D0C'}} />
            <span className="font-sans text-[10px] tracking-widest uppercase font-semibold" style={{color:'#0D0D0C'}}>{t('impact_badge')}</span>
          </div>
        </div>

        {/* Counter display */}
        <div className="text-center mb-5">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl md:text-6xl leading-none" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', color:'#0D0D0C' }}>
              {sliderVal}
            </span>
            <span className="font-sans text-base md:text-lg" style={{color:'rgba(13,13,12,0.6)'}}>{t('impact_unit')}</span>
          </div>
          <p className="font-sans text-[9px] tracking-[0.35em] uppercase mt-1" style={{color:'rgba(13,13,12,0.45)'}}>{t('impact_selected')}</p>
        </div>

        {/* Slider track */}
        <div className="relative mb-7 px-2" onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
          <div ref={trackRef} className="relative h-1.5 rounded-full cursor-pointer" style={{ background: 'rgba(13,13,12,0.12)' }}>
            {/* Fill */}
            <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${pct}%`, background: '#0D0D0C' }} />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-[#0D0D0C] cursor-grab active:cursor-grabbing flex items-center justify-center"
              style={{ left: `${pct}%`, background: '#BBDA1F', boxShadow: '0 2px 8px rgba(13,13,12,0.3)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#0D0D0C]" />
            </div>
          </div>
          {/* Tick marks */}
          <div className="flex justify-between mt-2 px-0">
            {[1, 25, 50, 75, 100].map((v) => (
              <span key={v} className="font-sans text-[9px]" style={{color:'rgba(13,13,12,0.4)'}}>{v}</span>
            ))}
          </div>
        </div>

        {/* Impact cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mb-8">
          {impactCards.map((card, i) => (
            <div
              key={i}
              className="relative rounded-xl overflow-hidden"
              style={{ height: 130 }}
            >
              <img src={card.image} alt={t(card.labelKey)} className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,5,2,0.3) 0%, rgba(10,5,2,0.82) 100%)' }} />
              {/* Icon */}
              <div className="absolute top-2.5 left-2.5 w-6 h-6 flex items-center justify-center rounded-full" style={{ background: '#BBDA1F' }}>
                <i className={`${card.icon} text-xs`} style={{ color: '#0D0D0C' }} />
              </div>
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <div
                  className="text-xl text-white leading-none font-bold mb-0.5"
                  style={{
                    fontFamily: "'Inter', system-ui, sans-serif",
                    fontVariantNumeric: 'tabular-nums',
                    display: 'inline-block',
                    animation: bouncing ? 'numBounce 0.35s cubic-bezier(0.36,0.07,0.19,0.97) both' : 'none',
                  }}
                >
                  {card.getValue(sliderVal)}
                </div>
                <div className="font-sans text-[9px] leading-tight mb-1" style={{color:'rgba(245,230,208,0.8)'}}>{t(card.labelKey)}</div>
                <div className="text-[8px] font-sans italic" style={{ color: '#BBDA1F' }}>{t(card.sublabelKey(sliderVal))}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: 'rgba(13,13,12,0.12)' }} />
          <span className="font-sans text-[9px] tracking-[0.35em] uppercase font-semibold" style={{color:'rgba(13,13,12,0.5)'}}>{t('impact_voices')}</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(13,13,12,0.12)' }} />
        </div>

        {/* Voice card */}
        <div
          className="rounded-xl overflow-hidden relative"
          style={{
            background: '#17100A',
            border: '1px solid rgba(13,13,12,0.10)',
            opacity: voiceFade ? 1 : 0,
            transition: 'opacity 0.22s ease',
          }}
        >
          {/* Video background */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.45) saturate(0.8)' }}
          >
            <source src="https://videos.pexels.com/video-files/4812205/4812205-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          </video>
          {/* Overlay gradient — más ligero para que se vea el video */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(12,5,1,0.55) 0%, rgba(20,9,2,0.38) 100%)' }} />

          {/* Content wrapper */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-start p-4 md:p-5">
            {/* Left: photo + stat */}
            <div className="flex sm:flex-col items-center gap-3 flex-shrink-0">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: '#BBDA1F' }}>
                <img src={voice.image} alt={voice.name} className="w-full h-full object-cover object-top" />
              </div>
              <div className="text-center">
                <div className="text-lg font-bold leading-none" style={{ fontFamily: "'Inter', system-ui, sans-serif", color:'#BBDA1F' }}>{voice.years}</div>
                <div className="font-sans text-[8px] leading-tight mt-0.5 max-w-[60px]" style={{color:'rgba(245,230,208,0.5)'}}>{t(`prod_${voice.id}_yl`)}</div>
              </div>
            </div>

            {/* Right: quote + name */}
            <div className="flex-1 min-w-0">
              <i className="ri-double-quotes-l text-2xl leading-none block mb-1" style={{color:'rgba(187,218,31,0.6)'}} />
              <p className="text-sm leading-relaxed italic mb-3" style={{ fontFamily: "'Inter', system-ui, sans-serif", color:'rgba(245,230,208,0.92)' }}>
                {t(`prod_${voice.id}_voice`)}
              </p>
              <div className="flex items-end justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-sans text-sm font-semibold" style={{color:'#F5E6D0'}}>{voice.name}</div>
                  <div className="font-sans text-[10px] mt-0.5" style={{color:'rgba(187,218,31,0.9)'}}>{t(`prod_${voice.id}_role`)}</div>
                  <div className="font-sans text-[9px] flex items-center gap-1 mt-0.5" style={{color:'rgba(245,230,208,0.4)'}}>
                    <i className="ri-map-pin-line text-[9px]" />
                    {voice.location}
                  </div>
                </div>
                {/* CTA button */}
                <a
                  href="#farmers"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('farmers')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[10px] font-semibold whitespace-nowrap cursor-pointer transition-all hover:brightness-110"
                  style={{ background: '#BBDA1F', color: '#0D0D0C', boxShadow: '0 4px 12px rgba(187,218,31,0.35)' }}
                >
                  <i className="ri-user-heart-line text-xs" />
                  {t('impact_more')}
                </a>
              </div>
            </div>

            {/* Nav dots */}
            <div className="flex sm:flex-col gap-1.5 flex-shrink-0 self-center">
              {voices.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { goToVoice(i); resetAutoTimer(); }}
                  className="rounded-full transition-all duration-200 cursor-pointer"
                  style={{
                    width: voiceIdx === i ? 7 : 5,
                    height: voiceIdx === i ? 7 : 5,
                    background: voiceIdx === i ? '#BBDA1F' : 'rgba(255,255,255,0.3)',
                    boxShadow: voiceIdx === i ? '0 0 6px rgba(187,218,31,0.6)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Subtle bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'rgba(13,13,12,0.08)' }} />
    </section>
  );
};

export default ImpactSlider;
