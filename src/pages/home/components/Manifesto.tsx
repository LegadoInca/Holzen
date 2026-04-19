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

interface MapPin {
  id: string;
  region: string;
  name: string;
  altitude: string;
  story: string;
  image: string;
  stat: string;
  statLabel: string;
  x: number;
  y: number;
}

const mapPins: MapPin[] = [
  {
    id: 'lucia',
    region: 'Quillabamba · Cusco',
    name: 'Lucía Quispe',
    altitude: '1,200 m.s.n.m',
    story: 'A los 19 años perdió su cosecha entera por una helada. Sin crédito, sin apoyo, decidió aprender sola el proceso natural. Hoy su café Chuncho es el más solicitado por tostadoras en Alemania y Países Bajos.',
    image: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1773516122/d6c6488724febbae729820d253497cb7_un9okc.jpg',
    stat: '3×', statLabel: 'ingresos en 4 años',
    x: 42, y: 62,
  },
  {
    id: 'edilberto',
    region: 'San Martín · Perú',
    name: 'Edilberto Rojas',
    altitude: '850 m.s.n.m',
    story: 'Exmilitar que volvió a su tierra con las manos vacías. Convirtió una parcela abandonada en un cafetal de 3 hectáreas trabajando solo, de madrugada, durante dos años. Su café financió la educación de sus cuatro hijos.',
    image: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1773516115/624a4fa7b3b3c803786cb9be0bafb4d2_gvcce3.jpg',
    stat: '3 ha', statLabel: 'cultivadas desde cero',
    x: 52, y: 38,
  },
  {
    id: 'rosa',
    region: 'Valle Monzón · Huánuco',
    name: 'Rosa Panduro',
    altitude: '900 m.s.n.m',
    story: 'Madre soltera de tres hijos, heredó una deuda y una parcela descuidada. Aprendió el secado solar artesanal observando a sus vecinos. Hoy produce uno de los cafés naturales más complejos del Perú, sin intermediarios.',
    image: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776577667/search-image_26_dvtva9.jpg',
    stat: '100%', statLabel: 'venta directa al exterior',
    x: 48, y: 48,
  },
  {
    id: 'segundo',
    region: 'Jaén · Cajamarca',
    name: 'Segundo Herrera',
    altitude: '1,400 m.s.n.m',
    story: 'Creció viendo a su padre vender café a precios de miseria. A los 28 años aprendió catación, certificó su finca y comenzó a exportar directamente. Hoy su café llega a Japón y Suecia con su nombre en el saco.',
    image: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776560755/search-image_11_kf9lnh.jpg',
    stat: '12 países', statLabel: 'destinos de exportación',
    x: 36, y: 28,
  },
  {
    id: 'manuel',
    region: 'Ayacucho · Valle del Pampas',
    name: 'Manuel Ccahuana',
    altitude: '2,200 m.s.n.m',
    story: 'En los 90, el terrorismo destruyó su comunidad. Manuel perdió a su padre y a tres vecinos en una semana. Hoy, a los 54 años, cultiva café donde antes solo había miedo. Cada saco que exporta es un acto de resistencia y de paz.',
    image: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776563427/search-image_21_hqnltd.jpg',
    stat: '54 años', statLabel: 'de resistencia',
    x: 46, y: 56,
  },
  {
    id: 'rosaquispe',
    region: 'Cusco · Finca La Esperanza',
    name: 'Rosa Quispe',
    altitude: '2,800 m.s.n.m',
    story: 'Rosa escapó de una relación violenta con tres hijos pequeños. Sin dinero ni red de apoyo, llegó a Cusco con lo puesto. Hoy su finca financia la escuela de sus tres hijos y exporta directamente a Europa.',
    image: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776562290/25c37853594fb2280f9aa9681f936840_cow5ay.jpg',
    stat: '3 hijos', statLabel: 'en la escuela',
    x: 50, y: 66,
  },
  {
    id: 'julia',
    region: 'San Martín · Alto Huallaga',
    name: 'Julia Flores',
    altitude: '1,900 m.s.n.m',
    story: 'Hace tres años, Julia cultivaba coca porque no había otra opción. Hoy cultiva café premium con certificación de origen. "El café me devolvió el orgullo", dice en el audio que recibirás con tu pedido.',
    image: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776560748/search-image_10_uiz3lx.jpg',
    stat: '100%', statLabel: 'café certificado de origen',
    x: 55, y: 42,
  },
];

const PeruMap = ({ contentVisible, mapLegend }: { contentVisible: boolean; mapLegend: string }) => {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePin = mapPins.find(p => p.id === (active ?? hovered));

  const handlePin = (id: string) => {
    setActive(prev => prev === id ? null : id);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActive(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative transition-all duration-700 delay-200 ${contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}
    >
      <div className="relative w-full select-none" style={{ height: '580px' }}>
        <img
          src="https://res.cloudinary.com/djfmngyl0/image/upload/v1776561016/58e9ceb9-87e6-40b2-b113-c4a6305bf31e_iwupfo.png"
          alt="Mapa del Perú"
          className="w-full h-full object-contain object-center"
          style={{ filter: 'drop-shadow(0 0 40px rgba(201,169,110,0.15))' }}
          draggable={false}
        />

        {mapPins.map((pin) => {
          const isActive = active === pin.id;
          const isHov = hovered === pin.id;
          return (
            <button
              key={pin.id}
              className="absolute z-20 cursor-pointer group"
              style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -50%)' }}
              onClick={() => handlePin(pin.id)}
              onMouseEnter={() => setHovered(pin.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{
                  background: 'rgba(201,169,110,0.35)',
                  animationDuration: '2s',
                  opacity: isActive || isHov ? 1 : 0.5,
                }}
              />
              <span
                className="relative flex items-center justify-center rounded-full border-2 transition-all duration-300"
                style={{
                  width: isActive ? '18px' : '13px',
                  height: isActive ? '18px' : '13px',
                  background: isActive ? '#c9a96e' : 'rgba(201,169,110,0.7)',
                  borderColor: isActive ? '#fff' : 'rgba(201,169,110,0.9)',
                  boxShadow: isActive ? '0 0 12px rgba(201,169,110,0.8)' : 'none',
                }}
              />
              <span
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-sans text-[9px] tracking-widest uppercase transition-all duration-300 pointer-events-none"
                style={{
                  bottom: isActive ? '-22px' : '-18px',
                  color: isActive ? '#c9a96e' : 'rgba(255,245,230,0.6)',
                  fontSize: isActive ? '9px' : '8px',
                }}
              >
                {pin.region.split('·')[0].trim()}
              </span>
            </button>
          );
        })}

        {activePin && (
          <div
            className="absolute z-30 rounded-2xl overflow-hidden"
            style={{
              width: '160px',
              left: activePin.x > 55 ? `${activePin.x - 2}%` : `${activePin.x + 3}%`,
              top: activePin.y > 60 ? `${activePin.y - 8}%` : `${activePin.y + 3}%`,
              transform: activePin.x > 55 ? 'translateX(-100%)' : 'translateX(0)',
              animation: 'cardIn 0.28s cubic-bezier(0.16,1,0.3,1) forwards',
              background: 'rgba(18,10,5,0.96)',
              border: '1px solid rgba(201,169,110,0.3)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.7)',
            }}
          >
            <div className="relative w-full" style={{ height: '140px' }}>
              <img
                src={activePin.image}
                alt={activePin.name}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <button
                onClick={() => setActive(null)}
                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-black/60 text-cream/70 hover:text-cream cursor-pointer transition-colors"
              >
                <i className="ri-close-line" style={{ fontSize: '10px' }} />
              </button>
            </div>
            <div className="px-3 py-2.5">
              <p className="text-gold font-sans text-[8px] tracking-widest uppercase mb-0.5 truncate">{activePin.region}</p>
              <h4 className="font-serif text-cream text-sm leading-tight">{activePin.name}</h4>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 mt-3">
        <span className="w-2 h-2 rounded-full bg-gold/70 flex-shrink-0" />
        <p className="text-cream/35 font-sans text-[10px] tracking-widest uppercase">
          {mapLegend}
        </p>
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
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

  const mapLegend = t('manifesto_map_legend', { count: mapPins.length });

  return (
    <section id="manifesto" ref={sectionRef} className="relative bg-coffee-900 py-16 px-6 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40 pointer-events-none"
        src="https://res.cloudinary.com/djfmngyl0/video/upload/v1773435823/9063027-uhd_3840_2160_30fps_rqdegd.mp4"
      />
      <div className="absolute inset-0 bg-coffee-900/45 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div className={`transition-all duration-700 ${contentVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-4">{t('manifesto_eyebrow')}</p>
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
                className={`text-cream/70 font-sans text-sm leading-relaxed transition-all duration-500 ${
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

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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

        {/* RIGHT — interactive Peru map */}
        <PeruMap contentVisible={contentVisible} mapLegend={mapLegend} />

      </div>
    </section>
  );
};

export default Manifesto;
