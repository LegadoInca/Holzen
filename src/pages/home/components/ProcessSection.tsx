import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { processSteps } from '../../../mocks/holzen';

const ProcessSection = () => {
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="process" className="relative bg-coffee-900 py-14 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/Holzen/images/product1.jpeg"
          alt="background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-coffee-900/82" />
        <div className="absolute inset-0 bg-amber-950/25" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-3">{t('process_eyebrow')}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream leading-tight">
            {t('process_title')} <em className="text-gold italic">{t('process_title_highlight')}</em>
          </h2>
        </div>

        {/* DESKTOP — Horizontal accordion timeline */}
        <div className="hidden md:flex gap-2 h-[480px]">
          {processSteps.map((step, idx) => {
            const isHovered = hovered === idx;
            const isAnyHovered = hovered !== null;

            return (
              <div
                key={step.n}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                className="relative rounded-2xl overflow-hidden cursor-pointer flex-shrink-0"
                style={{
                  flex: isHovered ? '4 1 0%' : isAnyHovered ? '0.6 1 0%' : '1 1 0%',
                  transition: 'flex 0.55s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                {/* Image */}
                <img
                  src={step.image}
                  alt={step.title}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  style={{
                    transform: isHovered ? 'scale(1.04)' : 'scale(1)',
                    transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
                  }}
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0 transition-all duration-500"
                  style={{
                    background: isHovered
                      ? 'linear-gradient(to top, rgba(10,6,2,0.95) 0%, rgba(10,6,2,0.55) 50%, rgba(10,6,2,0.15) 100%)'
                      : 'linear-gradient(to top, rgba(10,6,2,0.88) 0%, rgba(10,6,2,0.5) 60%, rgba(10,6,2,0.2) 100%)',
                  }}
                />

                {/* Gold border glow on hover */}
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
                  style={{
                    boxShadow: `inset 0 0 0 1.5px ${step.color}${isHovered ? '80' : '00'}`,
                    opacity: isHovered ? 1 : 0,
                  }}
                />

                {/* Step number — always visible, top */}
                <div className="absolute top-5 left-5 z-10">
                  <span
                    className="font-sans text-[10px] tracking-[0.35em] uppercase font-bold"
                    style={{ color: step.color }}
                  >
                    {t('process_step_label', { n: step.n })}
                  </span>
                </div>

                {/* Collapsed state — vertical title */}
                <div
                  className="absolute inset-0 flex items-end justify-start p-5 z-10 transition-opacity duration-300"
                  style={{ opacity: isHovered ? 0 : 1, pointerEvents: isHovered ? 'none' : 'auto' }}
                >
                  <div className="flex flex-col gap-2">
                    <div
                      className="w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0"
                      style={{ background: `${step.color}25`, border: `1px solid ${step.color}60` }}
                    >
                      <i className={`${step.icon} text-sm`} style={{ color: step.color }} />
                    </div>
                    <h3 className="font-serif text-cream text-base leading-tight writing-vertical">
                      {step.title}
                    </h3>
                  </div>
                </div>

                {/* Expanded state — full info */}
                <div
                  className="absolute inset-0 flex flex-col justify-end p-7 z-10 transition-opacity duration-400"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    pointerEvents: isHovered ? 'auto' : 'none',
                    transitionDelay: isHovered ? '0.15s' : '0s',
                  }}
                >
                  {/* Timeline connector dot */}
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0"
                      style={{ background: `${step.color}25`, border: `1px solid ${step.color}70` }}
                    >
                      <i className={`${step.icon} text-base`} style={{ color: step.color }} />
                    </div>
                    <div>
                      <p className="text-cream/50 font-sans text-[10px] tracking-widest uppercase">{step.subtitle}</p>
                    </div>
                  </div>

                  <h3 className="font-serif text-cream text-2xl md:text-3xl leading-tight mb-3">
                    {step.title}
                  </h3>
                  <p className="text-cream/65 font-sans text-sm leading-relaxed mb-5 max-w-xs">
                    {step.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-sans text-[10px] tracking-widest uppercase px-3 py-1 rounded-full whitespace-nowrap"
                        style={{
                          background: `${step.color}18`,
                          border: `1px solid ${step.color}50`,
                          color: step.color,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Timeline connector bar — desktop */}
        <div className="hidden md:flex items-center gap-2 mt-5">
          {processSteps.map((step, idx) => (
            <div key={step.n} className="flex items-center flex-1">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all duration-300"
                style={{
                  background: hovered !== null && idx <= hovered ? step.color : 'rgba(255,255,255,0.15)',
                  boxShadow: hovered === idx ? `0 0 10px ${step.color}90` : 'none',
                  transform: hovered === idx ? 'scale(1.5)' : 'scale(1)',
                }}
              />
              {idx < processSteps.length - 1 && (
                <div
                  className="flex-1 h-[1px] mx-1 transition-all duration-500"
                  style={{
                    background: hovered !== null && idx < hovered
                      ? `linear-gradient(90deg, ${step.color}, ${processSteps[idx + 1].color})`
                      : 'rgba(255,255,255,0.1)',
                  }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="hidden md:flex justify-between mt-2">
          {processSteps.map((step, idx) => (
            <div key={step.n} className="flex-1 text-center">
              <span
                className="font-sans text-[9px] tracking-widest uppercase transition-colors duration-300"
                style={{ color: hovered === idx ? step.color : 'rgba(255,255,255,0.25)' }}
              >
                {step.title.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>

        {/* MOBILE — stacked cards */}
        <div className="md:hidden flex flex-col gap-4">
          {processSteps.map((step) => (
            <div key={step.n} className="relative rounded-2xl overflow-hidden h-[220px]">
              <img src={step.image} alt={step.title} className="absolute inset-0 w-full h-full object-cover object-center" />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(10,6,2,0.9) 0%, rgba(10,6,2,0.5) 60%, rgba(10,6,2,0.2) 100%)' }}
              />
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1.5px ${step.color}50` }}
              />
              <div className="relative z-10 h-full flex flex-col justify-between p-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ background: `${step.color}25`, border: `1px solid ${step.color}60` }}
                  >
                    <i className={`${step.icon} text-sm`} style={{ color: step.color }} />
                  </div>
                  <span className="font-sans text-[10px] tracking-[0.3em] uppercase font-bold" style={{ color: step.color }}>
                    {t('process_step_label', { n: step.n })}
                  </span>
                </div>
                <div>
                  <p className="text-cream/50 font-sans text-[10px] tracking-widest uppercase mb-1">{step.subtitle}</p>
                  <h3 className="font-serif text-cream text-xl leading-tight mb-2">{step.title}</h3>
                  <p className="text-cream/60 font-sans text-xs leading-relaxed mb-3">{step.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-sans text-[9px] tracking-widest uppercase px-2.5 py-0.5 rounded-full"
                        style={{ background: `${step.color}18`, border: `1px solid ${step.color}40`, color: step.color }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
