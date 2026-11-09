import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

// Íconos de los 4 contadores, en el mismo orden que `stats`
// Texto de la pestaña "Historia" (se muestra en el idioma activo)
const HISTORIA_TEXT: Record<string, string> = {
  es: 'Donde alguna vez hubo pérdida, hoy nace café, esperanza y futuro. HOLZEN conecta la resiliencia de productores peruanos con quienes buscan algo más que un gran café: una experiencia con origen, propósito y un legado que trasciende cada taza.',
  en: 'Where there was once loss, coffee, hope and a future are born today. HOLZEN connects the resilience of Peruvian producers with those who seek more than a great coffee: an experience with origin, purpose, and a legacy that transcends every cup.',
  de: 'Wo einst Verlust war, entstehen heute Kaffee, Hoffnung und Zukunft. HOLZEN verbindet die Widerstandskraft peruanischer Produzenten mit Menschen, die mehr suchen als einen großartigen Kaffee: ein Erlebnis mit Herkunft, Sinn und einem Vermächtnis, das jede Tasse überdauert.',
  cs: 'Tam, kde kdysi byla ztráta, dnes vzniká káva, naděje a budoucnost. HOLZEN spojuje odolnost peruánských pěstitelů s těmi, kdo hledají víc než skvělou kávu: zážitek s původem, smyslem a odkazem, který přesahuje každý šálek.',
};

const STAT_ICONS = ['ri-group-line', 'ri-graduation-cap-line', 'ri-hand-heart-line', 'ri-user-3-line'];

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
  val, prefix = '', suffix, label, maxVal, active, icon,
}: {
  val: number; prefix?: string; suffix: string; label: string; maxVal: number; active: boolean; icon: string;
}) => {
  const count = useCountUp(val, active);
  const size = 96;
  const stroke = 3;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const progress = active ? Math.min(val / maxVal, 1) : 0;
  const dash = circ * progress;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="absolute" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="rgba(201,169,110,0.22)"
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
        <i className={`${icon} relative z-10`} style={{ color: '#c9a96e', fontSize: '2rem' }} />
      </div>
      <p
        className="text-cream mt-4 leading-none"
        style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 700, letterSpacing: '-0.02em', fontSize: '2rem', fontVariantNumeric: 'tabular-nums' }}
      >
        {prefix}{count}{suffix}
      </p>
      <p
        className="text-cream/70 mt-2 leading-snug max-w-[140px]"
        style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: '0.9rem' }}
      >
        {label}
      </p>
    </div>
  );
};

const Manifesto = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [statsVisible, setStatsVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { key: 'historia', label: t('manifesto_tab_historia'), content: HISTORIA_TEXT[(i18n.language || 'es').slice(0, 2)] ?? t('manifesto_historia') },
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

  // useEffect(() => {
  //   const timer = setInterval(() => setActiveTab((p) => (p + 1) % tabs.length), 4500);
  //   return () => clearInterval(timer);
  // }, [tabs.length]);

  
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
          <h2
            className="text-4xl md:text-5xl text-cream mb-8"
            style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.06 }}
          >
            {t('manifesto_title').split('\n').map((line, i, arr) => (
              i === arr.length - 1
                ? <span key={i}>{line} <em className="text-gold italic" style={{ fontWeight: 500 }}>{t('manifesto_title_highlight')}</em></span>
                : <span key={i}>{line}<br /></span>
            ))}
          </h2>

          {/* Tab switcher — minimalista */}
          <div className="flex gap-7 mb-7 w-fit" style={{ borderBottom: '1px solid rgba(245,230,208,0.14)' }}>
            {tabs.map((tab, i) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(i)}
                className="relative pb-3 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 cursor-pointer whitespace-nowrap"
                style={{
                  fontFamily: "'Inter', system-ui, sans-serif",
                  fontWeight: activeTab === i ? 600 : 500,
                  color: activeTab === i ? '#F5E6D0' : 'rgba(245,230,208,0.45)',
                }}
              >
                {tab.label}
                <span
                  className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full bg-gold transition-all duration-300"
                  style={{ opacity: activeTab === i ? 1 : 0, transform: activeTab === i ? 'scaleX(1)' : 'scaleX(0.4)' }}
                />
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="mb-8">
            {tabs.map((tab, i) => (
              <p
                key={tab.key}
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
                className={`text-cream/70 text-[15px] leading-[1.75] transition-all duration-500 ${
                  activeTab === i ? 'opacity-100 block' : 'opacity-0 hidden'
                }`}
              >
                {tab.content}
              </p>
            ))}
          </div>

          {/* Quote */}
          <blockquote className="border-l-2 border-gold pl-5 mb-10">
            <p className="italic text-cream/90 text-lg leading-relaxed whitespace-pre-line" style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 400 }}>
              {t('manifesto_quote')}
            </p>
          </blockquote>

        </div>

        {/* Stats column 2x2 */}
        <div ref={statsRef} className="grid grid-cols-2 gap-x-6 gap-y-10 lg:sticky lg:top-20">
          {stats.map((s, idx) => (
            <CircleStat
              key={s.label}
              icon={STAT_ICONS[idx]}
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
