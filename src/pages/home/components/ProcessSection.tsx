import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { processSteps } from '../../../mocks/holzen';

const ProcessSection = () => {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  const prev = useCallback(() => setActive((a) => Math.max(0, a - 1)), []);
  const next = useCallback(() => setActive((a) => Math.min(processSteps.length - 1, a + 1)), []);

  const getCardStyle = (idx: number) => {
    const diff = idx - active;
    if (diff === 0) return { scale: 1, x: '0%', opacity: 1, zIndex: 10, blur: 0 };
    if (Math.abs(diff) === 1) return { scale: 0.82, x: diff < 0 ? '-68%' : '68%', opacity: 0.55, zIndex: 5, blur: 1 };
    return { scale: 0.68, x: diff < 0 ? '-110%' : '110%', opacity: 0.2, zIndex: 1, blur: 2 };
  };

  const s = processSteps[active];

  return (
    <section id="process" className="relative bg-coffee-900 py-14 px-6 overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/djfmngyl0/image/upload/v1776578027/search-image_37_femwi5.jpg"
          alt="background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-coffee-900/82" />
        <div className="absolute inset-0 bg-amber-950/25" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-3">{t('process_eyebrow')}</p>
            <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight">
              {t('process_title').split('tu mesa').length > 1 ? (
                <>
                  {t('process_title').split('tu mesa')[0]}
                  <em className="text-gold italic">tu mesa</em>
                  {t('process_title').split('tu mesa')[1]}
                </>
              ) : t('process_title')}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={prev}
              disabled={active === 0}
              className="w-10 h-10 flex items-center justify-center border border-cream/20 hover:border-gold text-cream/60 hover:text-gold rounded-full transition-all duration-300 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <i className="ri-arrow-left-line text-sm" />
            </button>
            <span className="font-serif text-cream/30 text-sm tabular-nums">
              {String(active + 1).padStart(2, '0')} / {String(processSteps.length).padStart(2, '0')}
            </span>
            <button
              onClick={next}
              disabled={active === processSteps.length - 1}
              className="w-10 h-10 flex items-center justify-center border border-cream/20 hover:border-gold text-cream/60 hover:text-gold rounded-full transition-all duration-300 cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <i className="ri-arrow-right-line text-sm" />
            </button>
          </div>
        </div>

        {/* DESKTOP carousel */}
        <div className="hidden md:flex relative items-center justify-center" style={{ height: '380px' }}>
          {processSteps.map((step, idx) => {
            const style = getCardStyle(idx);
            const isActive = idx === active;
            return (
              <div
                key={step.n}
                onClick={() => !isActive && setActive(idx)}
                className="absolute rounded-2xl overflow-hidden"
                style={{
                  width: isActive ? '520px' : '300px',
                  height: isActive ? '360px' : '280px',
                  transform: `translateX(${style.x}) scale(${style.scale})`,
                  opacity: style.opacity,
                  zIndex: style.zIndex,
                  cursor: isActive ? 'default' : 'pointer',
                  filter: style.blur ? `blur(${style.blur}px)` : 'none',
                  transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                <img src={step.image} alt={step.title} className="absolute inset-0 w-full h-full object-cover object-center" />
                <div
                  className="absolute inset-0"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(15,10,5,0.85) 0%, rgba(15,10,5,0.4) 60%, rgba(15,10,5,0.2) 100%)'
                      : 'rgba(15,10,5,0.65)',
                  }}
                />
                {isActive && (
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow: `inset 0 0 0 1.5px ${step.color}60, 0 0 40px ${step.color}20` }}
                  />
                )}
                <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0"
                        style={{ background: `${step.color}25`, border: `1px solid ${step.color}60` }}
                      >
                        <i className={`${step.icon} text-base`} style={{ color: step.color }} />
                      </div>
                      <span className="font-sans text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: step.color }}>
                        {t('process_step_label', { n: step.n })}
                      </span>
                    </div>
                    {isActive && (
                      <span className="font-serif text-5xl font-bold leading-none select-none" style={{ color: `${step.color}15` }}>
                        {step.n}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="text-cream/60 font-sans text-[10px] tracking-widest uppercase mb-1">{step.subtitle}</p>
                    <h3 className={`font-serif text-cream leading-tight mb-3 ${isActive ? 'text-2xl md:text-3xl' : 'text-xl'}`}>
                      {step.title}
                    </h3>
                    {isActive && (
                      <p className="text-cream/65 font-sans text-sm leading-relaxed mb-4">{step.desc}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {step.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-sans text-[10px] tracking-widest uppercase px-3 py-1 rounded-full"
                          style={{ background: `${step.color}18`, border: `1px solid ${step.color}40`, color: step.color }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* MOBILE — single card full width */}
        <div className="md:hidden">
          {processSteps.map((step, idx) => {
            if (idx !== active) return null;
            return (
              <div key={step.n} className="rounded-2xl overflow-hidden w-full" style={{ height: '340px' }}>
                <div className="relative w-full h-full">
                  <img src={step.image} alt={step.title} className="absolute inset-0 w-full h-full object-cover object-center" />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(135deg, rgba(15,10,5,0.88) 0%, rgba(15,10,5,0.5) 60%, rgba(15,10,5,0.25) 100%)' }}
                  />
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow: `inset 0 0 0 1.5px ${step.color}60` }}
                  />
                  <div className="relative z-10 h-full flex flex-col justify-between p-6">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0"
                        style={{ background: `${step.color}25`, border: `1px solid ${step.color}60` }}
                      >
                        <i className={`${step.icon} text-base`} style={{ color: step.color }} />
                      </div>
                      <span className="font-sans text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: step.color }}>
                        {t('process_step_label', { n: step.n })}
                      </span>
                    </div>
                    <div>
                      <p className="text-cream/60 font-sans text-[10px] tracking-widest uppercase mb-1">{step.subtitle}</p>
                      <h3 className="font-serif text-cream text-2xl leading-tight mb-3">{step.title}</h3>
                      <p className="text-cream/65 font-sans text-sm leading-relaxed mb-4">{step.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-sans text-[10px] tracking-widest uppercase px-3 py-1 rounded-full"
                            style={{ background: `${step.color}18`, border: `1px solid ${step.color}40`, color: step.color }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex justify-center gap-3 mt-6">
            {processSteps.map((step, idx) => (
              <button
                key={step.n}
                onClick={() => setActive(idx)}
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                  style={{
                    background: idx === active ? s.color : 'rgba(255,255,255,0.2)',
                    transform: idx === active ? 'scale(1.4)' : 'scale(1)',
                    boxShadow: idx === active ? `0 0 8px ${s.color}80` : 'none',
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Timeline bar — desktop only */}
        <div className="hidden md:block mt-10 relative">
          <div className="relative h-[2px] bg-cream/10 rounded-full mx-auto max-w-lg">
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
              style={{
                width: `${(active / (processSteps.length - 1)) * 100}%`,
                background: `linear-gradient(90deg, #8b6340, ${s.color})`,
              }}
            />
          </div>
          <div className="flex justify-between max-w-lg mx-auto mt-4">
            {processSteps.map((step, idx) => (
              <button key={step.n} onClick={() => setActive(idx)} className="flex flex-col items-center gap-1 cursor-pointer">
                <div
                  className="w-2 h-2 rounded-full transition-all duration-300 -mt-[21px]"
                  style={{
                    background: idx <= active ? s.color : 'rgba(255,255,255,0.15)',
                    transform: idx === active ? 'scale(1.6)' : 'scale(1)',
                    boxShadow: idx === active ? `0 0 8px ${s.color}80` : 'none',
                  }}
                />
                <span
                  className="font-sans text-[9px] tracking-widest uppercase transition-colors duration-300 mt-3"
                  style={{ color: idx === active ? s.color : 'rgba(255,255,255,0.3)' }}
                >
                  {step.title.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
