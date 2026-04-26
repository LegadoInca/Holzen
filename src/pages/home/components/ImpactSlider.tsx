import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SLIDER_MIN = 1;
const SLIDER_MAX = 100;

interface ImpactCard {
  icon: string;
  image: string;
  getValue: (n: number) => string;
  label: string;
  sublabel: (n: number) => string;
}

const impactCards: ImpactCard[] = [
  {
    icon: 'ri-group-line',
    image: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&h=260&fit=crop',
    getValue: (n) => String(Math.max(1, Math.round(n / 12))),
    label: 'Familias productoras beneficiadas',
    sublabel: (n) => n <= 10 ? 'una pequeña familia apoyada' : n <= 40 ? 'varias familias esta semana' : 'comunidad entera impactada',
  },
  {
    icon: 'ri-money-dollar-circle-line',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=260&fit=crop',
    getValue: (n) => `$${(n * 2.8).toFixed(0)}`,
    label: 'USD directos al productor',
    sublabel: (n) => n <= 10 ? 'paga un día de trabajo' : n <= 40 ? 'cubre una semana de servicios' : 'financia un mes completo',
  },
  {
    icon: 'ri-book-open-line',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=260&fit=crop',
    getValue: (n) => String(Math.max(1, Math.round(n / 18))),
    label: 'Niños con educación apoyada',
    sublabel: (n) => n <= 15 ? 'un mes de clases garantizado' : n <= 50 ? 'varios niños en la escuela' : 'toda una aula beneficiada',
  },
  {
    icon: 'ri-plant-line',
    image: 'https://images.unsplash.com/photo-1611174797136-5e1a4a5c4e2f?w=400&h=260&fit=crop',
    getValue: (n) => String(Math.max(1, Math.round(n * 1.4))),
    label: 'Plantas de café preservadas',
    sublabel: (n) => n <= 10 ? 'un pequeño jardín preservado' : n <= 40 ? 'parcela activa mantenida' : 'hectárea completa protegida',
  },
];

const voices = [
  {
    name: 'Lucía Quispe',
    role: 'Productora de café Chuncho',
    location: 'Quillabamba, Cusco',
    quote: 'Perdí todo en una noche por una helada. Pero esa noche también me enseñó que yo era más fuerte que mi miedo. Hoy entreno a otras mujeres de mi comunidad.',
    image: '/Holzen/images/farmer1.jpg',
    years: 4,
    yearsLabel: 'años cultivando',
  },
  {
    name: 'Edilberto Rojas',
    role: 'Productor de Bourbon Natural',
    location: 'Tarapoto, San Martín',
    quote: 'Mis hijos no van a heredar deudas. Van a heredar dignidad. Cada saco que exporto es una promesa que les cumplo.',
    image: '/Holzen/images/farmer2.jpeg',
    years: 6,
    yearsLabel: 'años de cafetal',
  },
  {
    name: 'Rosa Panduro',
    role: 'Productora de Honey Amarillo',
    location: 'Valle Monzón, Huánuco',
    quote: 'Nadie me regaló nada. Pero tampoco nadie me quitó las ganas. Aprendí sola, observando. Hoy mis hijos me ven trabajar y saben que rendirse no es una opción.',
    image: '/Holzen/images/farmer3.jpeg',
    years: 3,
    yearsLabel: 'años exportando',
  },
  {
    name: 'Manuel Ccahuana',
    role: 'Productor Typica Natural',
    location: 'Ayacucho, Valle del Pampas',
    quote: 'Sembrar aquí donde todo fue destruido es mi forma de decir: seguimos vivos. Cada cosecha es un acto de resistencia y de paz.',
    image: '/Holzen/images/farmer5.jpg',
    years: 8,
    yearsLabel: 'años de resistencia',
  },
];

const ImpactSlider = () => {
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
    <section className="relative py-10 md:py-14 px-4 md:px-6 overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a0d05 0%, #120a03 100%)' }}>
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)' }} />

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h3 className="font-serif text-xl md:text-2xl text-cream leading-tight">Tu Impacto Real</h3>
            <p className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full font-sans text-xs font-semibold text-white cursor-default select-none" style={{ background: 'linear-gradient(90deg, #c2622a, #e07830)', boxShadow: '0 0 10px rgba(210,100,40,0.45)' }}>
              <i className="ri-drag-move-line text-white/80 text-xs" />
              Mueve el slider y descubre el impacto de cada compra
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/25 bg-gold/8">
            <i className="ri-seedling-line text-gold text-xs" />
            <span className="text-gold font-sans text-[10px] tracking-widest uppercase font-semibold">Café Peruano</span>
          </div>
        </div>

        {/* Counter display */}
        <div className="text-center mb-5">
          <div className="flex items-baseline justify-center gap-2">
            <span className="font-serif text-5xl md:text-6xl text-gold leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {sliderVal}
            </span>
            <span className="font-sans text-cream/60 text-base md:text-lg">productos</span>
          </div>
          <p className="text-cream/30 font-sans text-[9px] tracking-[0.35em] uppercase mt-1">Unidades seleccionadas</p>
        </div>

        {/* Slider track */}
        <div className="relative mb-7 px-2" onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
          <div ref={trackRef} className="relative h-1.5 rounded-full cursor-pointer" style={{ background: 'rgba(255,255,255,0.08)' }}>
            {/* Fill */}
            <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #c2622a, #e07830)' }} />
            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white cursor-grab active:cursor-grabbing flex items-center justify-center"
              style={{ left: `${pct}%`, background: 'linear-gradient(135deg, #c2622a, #e07830)', boxShadow: '0 0 12px rgba(210,100,40,0.6)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
            </div>
          </div>
          {/* Tick marks */}
          <div className="flex justify-between mt-2 px-0">
            {[1, 25, 50, 75, 100].map((v) => (
              <span key={v} className="font-sans text-[9px] text-cream/25">{v}</span>
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
              <img src={card.image} alt={card.label} className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,5,2,0.3) 0%, rgba(10,5,2,0.82) 100%)' }} />
              {/* Icon */}
              <div className="absolute top-2.5 left-2.5 w-6 h-6 flex items-center justify-center rounded-full" style={{ background: 'rgba(194,98,42,0.75)' }}>
                <i className={`${card.icon} text-white text-xs`} />
              </div>
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <div
                  className="font-serif text-xl text-white leading-none font-bold mb-0.5"
                  style={{
                    fontVariantNumeric: 'tabular-nums',
                    display: 'inline-block',
                    animation: bouncing ? 'numBounce 0.35s cubic-bezier(0.36,0.07,0.19,0.97) both' : 'none',
                  }}
                >
                  {card.getValue(sliderVal)}
                </div>
                <div className="text-cream/80 font-sans text-[9px] leading-tight mb-1">{card.label}</div>
                <div className="text-[8px] font-sans italic" style={{ color: '#e07830' }}>{card.sublabel(sliderVal)}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px" style={{ background: 'rgba(201,169,110,0.15)' }} />
          <span className="text-gold/50 font-sans text-[9px] tracking-[0.35em] uppercase font-semibold">Voces del campo</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(201,169,110,0.15)' }} />
        </div>

        {/* Voice card */}
        <div
          className="rounded-xl overflow-hidden relative"
          style={{
            border: '1px solid rgba(201,169,110,0.18)',
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
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 flex-shrink-0" style={{ borderColor: 'rgba(201,169,110,0.5)' }}>
                <img src={voice.image} alt={voice.name} className="w-full h-full object-cover object-top" />
              </div>
              <div className="text-center">
                <div className="font-serif text-lg text-gold font-bold leading-none">{voice.years}</div>
                <div className="text-cream/50 font-sans text-[8px] leading-tight mt-0.5 max-w-[60px]">{voice.yearsLabel}</div>
              </div>
            </div>

            {/* Right: quote + name */}
            <div className="flex-1 min-w-0">
              <i className="ri-double-quotes-l text-gold/40 text-2xl leading-none block mb-1" />
              <p className="text-cream/90 font-serif text-sm leading-relaxed italic mb-3">
                {voice.quote}
              </p>
              <div className="flex items-end justify-between gap-3 flex-wrap">
                <div>
                  <div className="font-sans text-sm text-cream font-semibold">{voice.name}</div>
                  <div className="text-gold/70 font-sans text-[10px] mt-0.5">{voice.role}</div>
                  <div className="text-cream/40 font-sans text-[9px] flex items-center gap-1 mt-0.5">
                    <i className="ri-map-pin-line text-[9px]" />
                    {voice.location}
                  </div>
                </div>
                {/* CTA button */}
                <Link
                  to="/productores"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[10px] font-semibold text-white whitespace-nowrap cursor-pointer transition-all hover:brightness-110"
                  style={{ background: 'linear-gradient(90deg, #c2622a, #e07830)', boxShadow: '0 0 10px rgba(210,100,40,0.4)' }}
                >
                  <i className="ri-user-heart-line text-xs" />
                  Ver más historias
                </Link>
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
                    background: voiceIdx === i ? '#c2622a' : 'rgba(201,169,110,0.3)',
                    boxShadow: voiceIdx === i ? '0 0 6px rgba(194,98,42,0.6)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Subtle bottom border */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent)' }} />
    </section>
  );
};

export default ImpactSlider;
