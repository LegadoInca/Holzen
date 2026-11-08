import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { farmers } from '../../../mocks/holzen';
import MapWithPins from './MapWithPins';

const INK = '#0D0D0C';
const GREEN = '#26E237'; // el verde de Holzen

// Productores que NO se muestran (nos quedamos con 6). Para cambiar a quién ocultas,
// solo cambia el nombre en esta lista.
const HIDDEN = ['Manuel Ccahuana'];
const shown = farmers.filter((f) => !HIDDEN.includes(f.name));

const Farmers = () => {
  const { t } = useTranslation();
  const [cur, setCur] = useState(0);
  const [showStory, setShowStory] = useState(false);

  const select = (idx: number) => {
    setCur(idx);
    setShowStory(false);
  };
  const openStory = (idx: number) => {
    setCur(idx);
    setShowStory(true);
  };
  const selectByName = (name: string) => {
    const idx = shown.findIndex((f) => f.name === name);
    if (idx >= 0) select(idx);
  };

  // Esc cierra la historia
  useEffect(() => {
    if (!showStory) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowStory(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showStory]);

  const f = shown[cur];
  const counter = `${String(cur + 1).padStart(2, '0')} / ${String(shown.length).padStart(2, '0')}`;

  return (
    <section id="farmers" className="relative w-full overflow-hidden py-12 md:py-16" style={{ background: '#F7F4EA' }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-20 lg:pl-32 lg:pr-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* ───────── Columna izquierda: encabezado + grilla de productores ───────── */}
          <div>
            <div className="text-center mb-10">
              <p
                className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase font-sans font-semibold mb-3"
                style={{ color: INK }}
              >
                <span className="inline-block w-2 h-2 rounded-full" style={{ background: '#BBDA1F' }} />
                {t('farmers_eyebrow')}
              </p>
              <h2
                className="text-3xl md:text-5xl"
                style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, letterSpacing: '-0.025em', color: INK, lineHeight: 1.05 }}
              >
                {t('farmers_title')}
              </h2>
              <p className="font-sans text-sm mt-3 max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(13,13,12,0.6)' }}>
                {t('farmers_desc')}
              </p>
            </div>

            <div className="relative">
              {/* Grilla 3 arriba + 3 abajo */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-9">
                {shown.map((farmer, idx) => {
                  const selected = idx === cur;
                  return (
                    <div
                      key={farmer.name}
                      className="relative flex flex-col"
                      style={{
                        transform: selected ? 'scale(1.07)' : 'scale(1)',
                        zIndex: selected ? 10 : 1,
                        transition: 'transform 0.35s cubic-bezier(0.2,0.8,0.2,1)',
                      }}
                    >
                      <button
                        onClick={() => select(idx)}
                        className="block w-full text-left cursor-pointer group flex-1"
                        aria-pressed={selected}
                      >
                        <div
                          className="relative overflow-hidden rounded-md"
                          style={{
                            aspectRatio: '3 / 4',
                            background: '#d9d6cc',
                            boxShadow: selected ? '0 14px 30px rgba(13,13,12,0.28)' : 'none',
                            transition: 'box-shadow 0.35s ease',
                          }}
                        >
                          <img
                            src={farmer.image}
                            alt={farmer.name}
                            className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-500"
                            style={{ filter: 'grayscale(1) contrast(1.05)' }}
                          />
                        </div>

                        <div className="mt-3">
                          <p
                            className="text-[15px] leading-tight"
                            style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700, color: INK }}
                          >
                            {farmer.name}
                          </p>
                          <p
                            className="mt-1 text-[10px] tracking-[0.14em] uppercase font-sans"
                            style={{ color: 'rgba(13,13,12,0.5)' }}
                          >
                            {farmer.tag}
                          </p>
                          <p className="mt-1 text-xs font-sans leading-snug" style={{ color: 'rgba(13,13,12,0.62)' }}>
                            <span style={{ fontWeight: 700, color: INK }}>{farmer.stat}</span> {farmer.statLabel}
                          </p>
                        </div>
                      </button>

                      {/* Botón verde del logo */}
                      <button
                        onClick={() => openStory(idx)}
                        className="relative overflow-hidden mt-3 w-full flex-shrink-0 inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold cursor-pointer whitespace-nowrap transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0"
                        style={{
                          background: GREEN,
                          color: INK,
                          fontFamily: "'Inter', system-ui, sans-serif",
                          boxShadow: '0 6px 16px rgba(38,226,55,0.38)',
                        }}
                      >
                        <span className="relative z-10 inline-flex items-center gap-1.5">
                          {t('farmers_know_story', { defaultValue: 'Conocer su historia' })}
                          <i className="ri-arrow-right-up-line" />
                        </span>
                        <span className="absolute top-0 bottom-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/45 to-transparent" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Historia del productor (se abre con el botón verde) */}
              <div
                className="fixed inset-0 z-[70] md:absolute md:inset-0 md:z-30 p-3 md:p-0 flex items-center justify-center bg-black/50 md:bg-[#F7F4EA]/[0.97] md:backdrop-blur-md md:rounded-2xl"
                style={{
                  opacity: showStory ? 1 : 0,
                  pointerEvents: showStory ? 'auto' : 'none',
                  transition: 'opacity 0.3s ease',
                }}
                onClick={() => setShowStory(false)}
              >
                <div
                  className="w-full max-h-full overflow-y-auto rounded-2xl"
                  style={{
                    background: '#F7F4EA',
                    border: '1px solid rgba(13,13,12,0.10)',
                    boxShadow: '0 24px 60px rgba(13,13,12,0.25)',
                    transform: showStory ? 'translateY(0) scale(1)' : 'translateY(14px) scale(0.98)',
                    transition: 'transform 0.35s cubic-bezier(0.2,0.8,0.2,1)',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="grid md:grid-cols-[210px_1fr] gap-5 md:gap-7 p-5 md:p-7">
                    <div
                      className="relative overflow-hidden rounded-md w-full max-w-[210px] mx-auto md:mx-0"
                      style={{ aspectRatio: '3 / 4', background: '#d9d6cc' }}
                    >
                      <img
                        src={f.image}
                        alt={f.name}
                        className="absolute inset-0 w-full h-full object-cover object-top"
                        style={{ filter: 'grayscale(1) contrast(1.05)' }}
                      />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase font-sans font-semibold px-3 py-1.5 rounded-full"
                          style={{ background: INK, color: '#BBDA1F' }}
                        >
                          <i className={f.tagIcon} style={{ fontSize: '11px' }} />
                          {f.tag}
                        </span>
                        <span className="text-sm tabular-nums font-sans" style={{ color: 'rgba(13,13,12,0.4)' }}>
                          {counter}
                        </span>
                      </div>

                      <h3
                        className="mt-4 text-2xl md:text-3xl"
                        style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700, letterSpacing: '-0.02em', color: INK, lineHeight: 1.1 }}
                      >
                        {f.name}
                      </h3>
                      <p className="mt-1.5 text-[11px] tracking-[0.16em] uppercase font-sans" style={{ color: 'rgba(13,13,12,0.5)' }}>
                        {f.location}
                      </p>

                      <p className="mt-5 text-[15px] leading-relaxed font-sans" style={{ color: 'rgba(13,13,12,0.82)' }}>
                        {f.story}
                      </p>

                      <div className="mt-5 flex items-center gap-2">
                        <i className="ri-user-line" style={{ fontSize: '15px', color: INK }} />
                        <span className="text-lg font-bold" style={{ color: INK, fontFamily: "'Inter', system-ui, sans-serif" }}>{f.stat}</span>
                        <span className="text-xs font-sans" style={{ color: 'rgba(13,13,12,0.55)' }}>{f.statLabel}</span>
                      </div>

                      <button
                        onClick={() => setShowStory(false)}
                        className="mt-6 self-start inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-sans font-semibold cursor-pointer hover:opacity-60 transition-opacity"
                        style={{ color: 'rgba(13,13,12,0.6)' }}
                      >
                        <i className="ri-close-line text-base" />
                        {t('farmers_tap_close')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ───────── Columna derecha: mapa (misma posición de siempre) ───────── */}
          <div className="flex flex-col gap-3 items-center lg:pt-32 lg:pl-16">
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full font-sans text-xs font-semibold tracking-[0.2em] uppercase cursor-default select-none"
              style={{ background: INK, color: '#BBDA1F' }}
            >
              <i className="ri-map-pin-line text-sm" />
              Toca un nombre para conocer al productor
            </div>
            <div className="w-full">
              <MapWithPins
                activeName={f.name}
                onSelect={selectByName}
                visibleNames={shown.map((x) => x.name)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Farmers;
