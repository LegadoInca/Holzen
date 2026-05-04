import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const useCountUp = (target: number, active: boolean, duration = 1400) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let startTime: number | null = null;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return val;
};

const CircleStat = ({
  val, prefix = '', suffix, label, maxVal, active,
}: {
  val: number; prefix?: string; suffix: string; label: string; maxVal: number; active: boolean;
}) => {
  const count = useCountUp(val, active);
  const size = 110;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const progress = active ? Math.min(val / maxVal, 1) : 0;
  const dash = circ * progress;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative flex items-center justify-center rounded-xl border border-cream/10"
        style={{ width: size + 24, height: size + 24, background: 'rgba(30,18,10,0.55)' }}
      >
        <svg
          width={size}
          height={size}
          className="absolute"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(201,169,110,0.15)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#c9a96e"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circ}`}
            strokeDashoffset={circ - dash}
            style={{ transition: active ? 'stroke-dashoffset 1.4s cubic-bezier(0.16,1,0.3,1)' : 'none' }}
          />
        </svg>
        <span className="font-serif text-gold font-bold relative z-10" style={{ fontSize: '1.5rem' }}>
          {prefix}{count}{suffix}
        </span>
      </div>
      <p className="text-cream/55 font-sans text-[10px] tracking-widest uppercase text-center leading-tight max-w-[100px]">
        {label}
      </p>
    </div>
  );
};

const Manifesto = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { key: 'historia', label: t('manifesto_tab_historia'), content: t('manifesto_historia') },
    { key: 'mision', label: t('manifesto_tab_mision'), content: t('manifesto_mision') },
    { key: 'impacto', label: t('manifesto_tab_impacto'), content: t('manifesto_impacto') },
  ];

  const stats = [
    { val: 142, suffix: '', label: t('manifesto_stat_families'), maxVal: 200 },
    { val: 340, suffix: '', label: t('manifesto_stat_children'), maxVal: 400 },
    { val: 48, prefix: '', suffix: 'K€', label: t('manifesto_stat_donated'), maxVal: 60 },
    { val: 38, suffix: '', label: t('manifesto_stat_women'), maxVal: 50 },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setContentVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.5 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveTab((p) => (p + 1) % tabs.length), 4500);
    return () => clearInterval(timer);
  }, [tabs.length]);

  
  return (
    <section id="manifesto" ref={sectionRef} className="relative bg-coffee-900 py-16 px-6 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
        src="/Holzen/videos/hero5.mp4"
      />
      <div className="absolute inset-0 bg-coffee-900/45 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto grid lg:grid-cols-3 gap-10 items-start">

        {/* LEFT */}
        <div className={`lg:col-span-2 transition-all duration-700 ${contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <h2 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-8">
            {t('manifesto_title').split('\n').map((line, i, arr) => (
              i === arr.length - 1
                ? <span key={i}>{line} <em className="text-gold italic">{t('manifesto_title_highlight')}</em></span>
                : <span key={i}>{line}<br /></span>
            ))}
          </h2>

          {/* Tab switcher */}
          <div className="flex gap-1 bg-coffee-800 rounded-full p-1 mb-6 w-fit">
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-sans transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  activeTab === i
                    ? 'bg-gold text-coffee-900 font-semibold'
                    : 'text-cream/50 hover:text-cream'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="mb-8">
            {tabs.map((tab, i) => (
              <p
                key={tab.key}
                className={`text-cream/70 font-serif text-sm leading-relaxed transition-all duration-500 ${
                  activeTab === i ? 'opacity-100 block' : 'opacity-0 hidden'
                }`}
              >
                {tab.content}
              </p>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="border-l-2 border-gold pl-5 mb-10">
            <p className="font-serif italic text-cream/90 text-lg leading-relaxed whitespace-pre-line">
              {t('manifesto_quote')}
            </p>
          </blockquote>

        </div>

        {/* Stats column 2x2 */}
        <div ref={statsRef} className="grid grid-cols-2 gap-4 lg:sticky lg:top-20">
          {stats.map((s) => (
            <CircleStat
              key={s.label}
              val={s.val}
              prefix={s.prefix}
              suffix={s.suffix}
              label={s.label}
              maxVal={s.maxVal}
              active={statsVisible}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Manifesto;
