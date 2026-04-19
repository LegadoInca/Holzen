import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const FARMERS = [
  {
    id: 'lucia',
    name: 'Lucía Quispe',
    region: 'Cusco',
    role: 'Productora de café Chuncho',
    need: 'Necesita: Tanques de fermentación artesanal',
    progress: 68,
    adopters: 14,
    image: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776577663/search-image_28_xprx4c.jpg',
    impact: {
      30: 'Financias 2 días de secado solar artesanal de su café Chuncho.',
      40: 'Cubres una semana completa de fermentación controlada.',
      60: 'Financias el análisis de laboratorio de su lote mensual.',
      80: 'Cubres el empaque GrainPro de un saco de 60 kg.',
      100: 'Financias el transporte de Lima al puerto de exportación.',
      200: 'Cubres la certificación EUDR de su finca por un mes.',
    },
  },
  {
    id: 'edilberto',
    name: 'Edilberto Rojas',
    region: 'San Martín',
    role: 'Productor de Bourbon Natural',
    need: 'Necesita: Camas africanas de secado solar',
    progress: 45,
    adopters: 9,
    image: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1773516115/624a4fa7b3b3c803786cb9be0bafb4d2_gvcce3.jpg',
    impact: {
      30: 'Financias el mantenimiento de su cafetal por una semana.',
      40: 'Cubres los insumos de procesado natural de un quintal.',
      60: 'Financias una cama africana de secado para su finca.',
      80: 'Cubres el jornal de dos trabajadores durante la cosecha.',
      100: 'Financias el análisis sensorial de su Bourbon Natural.',
      200: 'Cubres la renovación de plantas de su parcela este año.',
    },
  },
  {
    id: 'rosa',
    name: 'Rosa Panduro',
    region: 'Huánuco',
    role: 'Productora de Honey Amarillo',
    need: 'Necesita: Secadora solar portátil',
    progress: 20,
    adopters: 4,
    image: 'https://res.cloudinary.com/djfmngyl0/image/upload/v1776577667/search-image_26_dvtva9.jpg',
    impact: {
      30: 'Financias los materiales de secado de su lote Honey.',
      40: 'Cubres una semana de procesado artesanal sin intermediarios.',
      60: 'Financias el transporte de su café al centro de acopio.',
      80: 'Cubres el empaque y etiquetado de su primer lote de exportación.',
      100: 'Financias la capacitación en catación para Rosa este mes.',
      200: 'Cubres la secadora solar que necesita para independizarse.',
    },
  },
];

const MONTHLY_AMOUNTS = [30, 40, 60, 80, 100, 200];
const ANNUAL_AMOUNTS = [200, 300, 500, 700, 900, 1200];

const RADIUS = 40;
const CIRC = 2 * Math.PI * RADIUS;

interface StatItem {
  end: number;
  display: string;
  labelKey: string;
  pct: number;
}

const STATS: StatItem[] = [
  { end: 27, display: '27', labelKey: 'contact_stat_adopters', pct: 68 },
  { end: 3, display: '3', labelKey: 'contact_stat_families', pct: 45 },
  { end: 1200, display: '$1.2K', labelKey: 'contact_stat_raised', pct: 82 },
  { end: 100, display: '100%', labelKey: 'contact_stat_direct', pct: 100 },
];

const StatCircle = ({ stat, animate }: { stat: StatItem; animate: boolean }) => {
  const { t } = useTranslation();
  const [count, setCount] = useState(0);
  const [arc, setArc] = useState(0);

  useEffect(() => {
    if (!animate) return;
    const duration = 1600;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * stat.end));
      setArc(eased * stat.pct);
      if (step >= steps) clearInterval(timer);
    }, interval);
    return () => clearInterval(timer);
  }, [animate, stat.end, stat.pct]);

  const offset = CIRC - (arc / 100) * CIRC;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-16 h-16 md:w-24 md:h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={RADIUS} fill="none" stroke="rgba(201,169,78,0.15)" strokeWidth="5" />
          <circle
            cx="50" cy="50" r={RADIUS} fill="none" stroke="#c9a96e" strokeWidth="5"
            strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-serif text-xs md:text-lg font-bold text-gold leading-none">
            {animate ? stat.display.replace(/\d+/, String(count)) : '0'}
          </span>
        </div>
      </div>
      <div className="text-[8px] md:text-[9px] text-cream/40 font-sans uppercase tracking-[0.15em] text-center leading-tight">
        {t(stat.labelKey)}
      </div>
    </div>
  );
};

const ContactSection = () => {
  const { t } = useTranslation();
  const [selectedFarmer, setSelectedFarmer] = useState(FARMERS[0]);
  const [payMode, setPayMode] = useState<'monthly' | 'annual'>('monthly');
  const [amount, setAmount] = useState(30);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hoveredFarmer, setHoveredFarmer] = useState<typeof FARMERS[0] | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [mobilePreview, setMobilePreview] = useState<typeof FARMERS[0] | null>(null);
  const [showCert, setShowCert] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const leftColRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const amounts = payMode === 'monthly' ? MONTHLY_AMOUNTS : ANNUAL_AMOUNTS;

  const handleModeSwitch = (mode: 'monthly' | 'annual') => {
    setPayMode(mode);
    setAmount(mode === 'monthly' ? 30 : 200);
  };

  const impactText =
    selectedFarmer.impact[amount as keyof typeof selectedFarmer.impact] ??
    `Con $${amount} apoyas directamente a ${selectedFarmer.name} y su familia.`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    try {
      const body = new URLSearchParams({
        farmer: selectedFarmer.name,
        region: selectedFarmer.region,
        pay_mode: payMode === 'monthly' ? t('contact_monthly') : t('contact_annual'),
        amount: `$${amount}`,
        name,
        email,
      });
      await fetch('https://readdy.ai/api/form/d7i8dn46o6v9400gqbhg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const period = payMode === 'monthly' ? t('contact_submit_monthly') : t('contact_submit_annual');

  return (
    <>
      <section id="contact" className="relative py-14 md:py-20 px-4 md:px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://res.cloudinary.com/djfmngyl0/image/upload/v1773435430/b5dcee5858d308c712cc1e53229f35e6_gc2rqw.jpg"
            alt="background"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-coffee-900/80" />
          <div className="absolute inset-0 bg-amber-950/30" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-3">{t('contact_eyebrow')}</p>
            <h2 className="font-serif text-3xl md:text-5xl text-cream leading-tight mb-3">
              {t('contact_title').split('Cafetal').length > 1 ? (
                <>
                  {t('contact_title').split('Cafetal')[0]}
                  <em className="text-gold italic">Cafetal</em>
                  {t('contact_title').split('Cafetal')[1]}
                </>
              ) : t('contact_title')}
            </h2>
            <p className="text-cream/50 font-sans text-sm italic">
              &ldquo;{t('contact_subtitle').replace(/^"|"$/g, '')}&rdquo;
            </p>
          </div>

          {/* Stats — mobile */}
          <div
            ref={statsRef}
            className="rounded-xl border border-cream/10 bg-white/5 px-2 py-4 grid grid-cols-4 gap-1 mb-6 lg:hidden"
          >
            {STATS.map((s) => (
              <StatCircle key={s.labelKey} stat={s} animate={statsVisible} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* LEFT COLUMN */}
            <div className="flex flex-col gap-4 relative" ref={leftColRef}>
              {/* Desktop hover tooltip */}
              {hoveredFarmer && (
                <div className="fixed z-50 pointer-events-none hidden md:block" style={{ left: tooltipPos.x + 16, top: tooltipPos.y - 20 }}>
                  <div className="w-56 rounded-2xl overflow-hidden shadow-2xl border border-gold/20 bg-coffee-900">
                    <div className="relative h-52">
                      <img src={hoveredFarmer.image} alt={hoveredFarmer.name} className="w-full h-full object-cover object-top" />
                      <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/90 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <div className="font-serif text-sm text-cream font-bold">{hoveredFarmer.name}</div>
                        <div className="text-cream/60 text-[10px] font-sans mt-0.5">{hoveredFarmer.role}</div>
                        <span className="inline-block mt-1.5 text-[9px] bg-gold/30 text-gold px-2 py-0.5 rounded-full font-sans">{hoveredFarmer.region}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Farmer selector */}
              <div>
                <p className="text-gold/70 text-[10px] tracking-[0.3em] uppercase font-sans mb-3">{t('contact_choose_farmer')}</p>
                <div className="flex flex-col gap-2.5">
                  {FARMERS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFarmer(f)}
                      onMouseEnter={(e) => { setHoveredFarmer(f); setTooltipPos({ x: e.clientX, y: e.clientY }); }}
                      onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
                      onMouseLeave={() => setHoveredFarmer(null)}
                      className={`w-full text-left rounded-xl p-3 md:p-4 border transition-all duration-300 cursor-pointer ${
                        selectedFarmer.id === f.id ? 'border-gold/60 bg-gold/10' : 'border-cream/10 bg-white/5 hover:border-cream/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setMobilePreview(f); }}
                          className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full overflow-hidden relative cursor-pointer"
                        >
                          <img src={f.image} alt={f.name} className="w-full h-full object-cover object-top" />
                          <div className="absolute inset-0 bg-black/35 flex items-center justify-center md:hidden">
                            <i className="ri-eye-line text-white text-xs" />
                          </div>
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-serif text-sm text-cream font-semibold">{f.name}</span>
                            <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full font-sans whitespace-nowrap">{f.region}</span>
                          </div>
                          <div className="text-cream/50 text-xs font-sans mt-0.5 truncate">{f.role}</div>
                          <div className="text-gold/70 text-[10px] font-sans mt-0.5 flex items-center gap-1">
                            <i className="ri-tools-line flex-shrink-0" />
                            <span className="truncate">{f.need}</span>
                          </div>
                        </div>
                        {selectedFarmer.id === f.id && (
                          <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full bg-gold text-coffee-900">
                            <i className="ri-check-line text-xs" />
                          </div>
                        )}
                      </div>
                      <div className="mt-2.5">
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gold rounded-full transition-all duration-500" style={{ width: `${f.progress}%` }} />
                        </div>
                        <div className="text-[10px] text-cream/30 font-sans mt-1 text-right">
                          {f.progress}% · {t('contact_adopters_count', { n: f.adopters })}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Newsletter — desktop only */}
              <div className="hidden lg:block rounded-xl border border-cream/10 bg-white/5 p-5">
                <div className="font-serif text-base text-cream mb-1">{t('contact_newsletter_title')}</div>
                <p className="text-cream/40 text-xs font-sans mb-4">{t('contact_newsletter_desc')}</p>
                <input type="email" placeholder={t('contact_newsletter_email')} className="w-full bg-white/5 border border-cream/15 rounded-lg px-4 py-2.5 text-cream text-sm font-sans placeholder-cream/30 focus:outline-none focus:border-gold/50 mb-3" />
                <button className="w-full bg-gold hover:bg-amber-400 text-coffee-900 font-sans font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap">{t('contact_newsletter_btn')}</button>
                <p className="text-cream/25 text-[10px] font-sans mt-2 text-center">{t('contact_newsletter_privacy')}</p>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-3 md:gap-4">
              {/* Stats — desktop only */}
              <div className="hidden lg:grid rounded-xl border border-cream/10 bg-white/5 px-4 py-5 grid-cols-4 gap-2">
                {STATS.map((s) => (
                  <StatCircle key={s.labelKey} stat={s} animate={statsVisible} />
                ))}
              </div>

              {/* Pay mode toggle */}
              <div className="grid grid-cols-2 gap-2 bg-white/5 rounded-xl p-1 border border-cream/10">
                <button onClick={() => handleModeSwitch('monthly')} className={`py-2.5 rounded-lg text-sm font-sans font-semibold transition-all cursor-pointer whitespace-nowrap ${payMode === 'monthly' ? 'bg-gold text-coffee-900' : 'text-cream/50 hover:text-cream'}`}>{t('contact_monthly')}</button>
                <button onClick={() => handleModeSwitch('annual')} className={`py-2.5 rounded-lg text-sm font-sans font-semibold transition-all cursor-pointer whitespace-nowrap ${payMode === 'annual' ? 'bg-gold text-coffee-900' : 'text-cream/50 hover:text-cream'}`}>{t('contact_annual')}</button>
              </div>

              {/* Amount grid */}
              <div className="grid grid-cols-3 gap-2">
                {amounts.map((a) => (
                  <button key={a} onClick={() => setAmount(a)} className={`py-2.5 md:py-3 rounded-xl text-sm font-sans font-semibold border transition-all cursor-pointer whitespace-nowrap ${amount === a ? 'bg-gold/20 border-gold text-gold' : 'border-cream/15 bg-white/5 text-cream/60 hover:border-cream/30 hover:text-cream'}`}>
                    ${a}
                  </button>
                ))}
              </div>

              {/* Impact */}
              <div className="rounded-xl border border-gold/20 bg-gold/5 p-3 md:p-4 flex gap-3 items-start">
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-seedling-line text-gold text-sm" />
                </div>
                <div>
                  <div className="text-gold text-[10px] tracking-widest uppercase font-sans mb-1">{t('contact_impact_label')}</div>
                  <p className="text-cream/70 text-xs font-sans leading-relaxed">Con ${amount} para {selectedFarmer.name}: {impactText}</p>
                </div>
              </div>

              {/* Certificate */}
              <div
                className="relative rounded-xl border border-cream/10 bg-white/5 p-3 md:p-4 flex items-center justify-between group cursor-default"
                onMouseEnter={() => setShowCert(true)}
                onMouseLeave={() => setShowCert(false)}
              >
                <div className="flex gap-3 items-center min-w-0">
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                    <i className="ri-award-line text-gold text-base" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-cream text-xs font-sans font-semibold">{t('contact_cert_title')}</div>
                    <div className="text-cream/40 text-[10px] font-sans truncate">{t('contact_cert_desc')}</div>
                  </div>
                </div>
                <i className="ri-eye-line text-gold/50 group-hover:text-gold text-base flex-shrink-0 ml-2 transition-colors" />

                {showCert && (
                  <div className="absolute bottom-full right-0 mb-3 z-50 w-[92vw] max-w-[480px] pointer-events-none">
                    <div className="relative rounded-xl overflow-hidden shadow-2xl border border-[#c9a96e]/40" style={{ background: 'linear-gradient(135deg, #f5efe0 0%, #ede3cc 50%, #f0e8d5 100%)' }}>
                      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#8b6340]/40 rounded-tl" />
                      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#8b6340]/40 rounded-tr" />
                      <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#8b6340]/40 rounded-bl" />
                      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#8b6340]/40 rounded-br" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                        <span className="font-serif text-[100px] font-black text-coffee-900 rotate-[-15deg]">H</span>
                      </div>
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 text-[7px] tracking-[0.25em] uppercase text-[#8b6340]/50 font-sans whitespace-nowrap">HOLZEN · CAFÉ PERUANO</div>
                      <div className="px-6 md:px-10 py-5 md:py-7">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border-2 border-[#c9a96e]/60 flex items-center justify-center bg-[#c9a96e]/10">
                              <i className="ri-award-fill text-[#8b6340] text-sm" />
                            </div>
                            <div>
                              <div className="text-[9px] tracking-[0.2em] uppercase text-[#8b6340] font-sans font-bold">{t('contact_cert_adoption')}</div>
                              <div className="text-[8px] text-[#8b6340]/60 font-sans">{t('contact_cert_program')}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="w-8 h-8 rounded-full border-2 border-[#c9a96e]/60 flex items-center justify-center bg-[#c9a96e]/10 ml-auto mb-0.5">
                              <i className="ri-medal-fill text-[#8b6340] text-sm" />
                            </div>
                            <div className="text-[7px] tracking-widest uppercase text-[#8b6340]/60 font-sans">{t('contact_cert_official')}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex-1 h-px bg-[#c9a96e]/30" />
                          <i className="ri-seedling-line text-[#c9a96e]/50 text-xs" />
                          <div className="flex-1 h-px bg-[#c9a96e]/30" />
                        </div>
                        <p className="text-[9px] text-[#5c3d1e]/60 font-sans mb-1">{t('contact_cert_acredita')}</p>
                        <div className="font-serif text-lg md:text-2xl text-[#3d2008] mb-2 italic">{name.trim() || t('contact_name_placeholder')}</div>
                        <p className="text-[10px] text-[#5c3d1e]/70 font-sans leading-relaxed italic mb-3">
                          {t('contact_cert_body', { farmer: selectedFarmer.name })}
                        </p>
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="font-serif text-sm text-[#3d2008] italic border-b border-[#8b6340]/30 pb-0.5 mb-1">{name.trim() || t('contact_name_placeholder')}</div>
                            <div className="text-[8px] text-[#8b6340]/50 font-sans">{t('contact_cert_godparent')}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[8px] text-[#8b6340]/50 font-sans">{t('contact_cert_year')}</div>
                            <div className="font-serif text-lg text-[#8b6340] font-bold">2026</div>
                            <div className="text-[7px] text-[#8b6340]/40 font-sans mt-0.5">N° 00{Math.floor(Math.random() * 900) + 100}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              {submitted ? (
                <div className="rounded-xl border border-gold/30 bg-gold/10 p-6 text-center">
                  <i className="ri-heart-fill text-gold text-2xl mb-2 block" />
                  <div className="font-serif text-lg text-cream mb-1">{t('contact_success_title')}</div>
                  <p className="text-cream/50 text-xs font-sans">{t('contact_success_desc')}</p>
                </div>
              ) : (
                <form data-readdy-form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input type="text" name="name" placeholder={t('contact_name_placeholder')} value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/5 border border-cream/15 rounded-xl px-4 py-3 text-cream text-sm font-sans placeholder-cream/30 focus:outline-none focus:border-gold/50" />
                  <input type="email" name="email" placeholder={t('contact_email_placeholder')} value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/5 border border-cream/15 rounded-xl px-4 py-3 text-cream text-sm font-sans placeholder-cream/30 focus:outline-none focus:border-gold/50" />
                  <button type="submit" disabled={submitting} className="w-full bg-gold hover:bg-amber-400 disabled:opacity-60 text-coffee-900 font-sans font-bold py-3.5 rounded-xl text-sm tracking-wide transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center gap-2">
                    <i className="ri-heart-line" />
                    {submitting ? t('contact_submitting') : t('contact_submit', { amount, period })}
                  </button>
                </form>
              )}

              {/* Newsletter — mobile only */}
              <div className="lg:hidden rounded-xl border border-cream/10 bg-white/5 p-4">
                <div className="font-serif text-sm text-cream mb-1">{t('contact_newsletter_title')}</div>
                <p className="text-cream/40 text-xs font-sans mb-3">{t('contact_newsletter_desc_short')}</p>
                <input type="email" placeholder={t('contact_newsletter_email')} className="w-full bg-white/5 border border-cream/15 rounded-lg px-4 py-2.5 text-cream text-sm font-sans placeholder-cream/30 focus:outline-none focus:border-gold/50 mb-2.5" />
                <button className="w-full bg-gold hover:bg-amber-400 text-coffee-900 font-sans font-bold py-2.5 rounded-lg text-sm transition-colors cursor-pointer whitespace-nowrap">{t('contact_newsletter_btn')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile farmer photo modal */}
      {mobilePreview && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center md:hidden" onClick={() => setMobilePreview(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-sm mx-4 mb-6 rounded-2xl overflow-hidden shadow-2xl border border-gold/20" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-72">
              <img src={mobilePreview.image} alt={mobilePreview.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/95 via-coffee-900/20 to-transparent" />
              <button onClick={() => setMobilePreview(null)} className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-cream cursor-pointer">
                <i className="ri-close-line text-base" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="font-serif text-xl text-cream font-bold mb-0.5">{mobilePreview.name}</div>
                <div className="text-cream/60 text-xs font-sans mb-2">{mobilePreview.role}</div>
                <span className="inline-block text-[10px] bg-gold/30 text-gold px-3 py-1 rounded-full font-sans">{mobilePreview.region}</span>
              </div>
            </div>
            <div className="bg-coffee-900 px-5 py-4">
              <button
                onClick={() => { setSelectedFarmer(mobilePreview); setMobilePreview(null); }}
                className="w-full bg-gold hover:bg-amber-400 text-coffee-900 font-sans font-bold py-3 rounded-xl text-sm tracking-wide transition-colors cursor-pointer whitespace-nowrap"
              >
                {t('contact_support_btn', { name: mobilePreview.name.split(' ')[0] })}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactSection;
