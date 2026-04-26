import { useState, useRef, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { farmers, products } from '@/mocks/holzen';

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
interface CartItem {
  id: string;
  name: string;
  priceLabel: string;
  priceNum: number;
  image: string;
  qty: number;
}

/* ─────────────────────────────────────────────
   B2B PRODUCT DATA (precios por caja / kilo mayor)
───────────────────────────────────────────── */
const b2bProducts = [
  {
    id: 'chuncho-b2b',
    tag: 'Variedad Nativa',
    name: 'Caturra del Cusco',
    origin: 'Quillabamba, Cusco · 1,200 msnm',
    notes: 'Frutas rojas · Jazmín · Panela',
    image: '/Holzen/images/product1.jpeg',
    formats: [
      { label: 'Caja 5 kg', price: 29.50, unit: 'caja', minQty: 5 },
      { label: 'Saco 30 kg', price: 27.00, unit: 'saco', minQty: 1 },
      { label: 'Saco 60 kg', price: 25.50, unit: 'saco', minQty: 1 },
    ],
    producer: 'Lucía Quispe',
    producerImg: '/Holzen/images/farmer1.jpg',
    badge: 'Más pedido',
  },
  {
    id: 'bourbon-b2b',
    tag: 'Microlote',
    name: 'Bourbon Rojo Natural',
    origin: 'San Martín, Perú · 1,600 msnm',
    notes: 'Ciruela · Chocolate negro · Miel',
    image: '/Holzen/images/product2.jpg',
    formats: [
      { label: 'Caja 5 kg', price: 26.00, unit: 'caja', minQty: 5 },
      { label: 'Saco 30 kg', price: 23.50, unit: 'saco', minQty: 1 },
      { label: 'Saco 60 kg', price: 22.00, unit: 'saco', minQty: 1 },
    ],
    producer: 'Edilberto Rojas',
    producerImg: '/Holzen/images/farmer2.jpeg',
    badge: null,
  },
  {
    id: 'monzon-b2b',
    tag: 'Selección Especial',
    name: 'Monzón Heritage Honey',
    origin: 'Valle Monzón, Huánuco · 900 msnm',
    notes: 'Durazno · Caña · Madera dulce',
    image: '/Holzen/images/product3.jpg',
    formats: [
      { label: 'Caja 5 kg', price: 25.50, unit: 'caja', minQty: 5 },
      { label: 'Saco 30 kg', price: 23.00, unit: 'saco', minQty: 1 },
      { label: 'Saco 60 kg', price: 21.50, unit: 'saco', minQty: 1 },
    ],
    producer: 'Rosa Panduro',
    producerImg: '/Holzen/images/farmer3.jpeg',
    badge: null,
  },
  {
    id: 'geisha-b2b',
    tag: 'Alta Gama',
    name: 'Geisha de Jaén',
    origin: 'Jaén, Cajamarca · 1,800 msnm',
    notes: 'Bergamota · Flor blanca · Limón',
    image: '/Holzen/images/product4.jpg',
    formats: [
      { label: 'Caja 5 kg', price: 40.00, unit: 'caja', minQty: 3 },
      { label: 'Saco 30 kg', price: 37.00, unit: 'saco', minQty: 1 },
      { label: 'Saco 60 kg', price: 35.00, unit: 'saco', minQty: 1 },
    ],
    producer: 'Segundo Herrera',
    producerImg: '/Holzen/images/farmer5.jpg',
    badge: 'Premium',
  },
  {
    id: 'pampas-b2b',
    tag: 'Resistencia',
    name: 'Pampas Alto Typica',
    origin: 'Ayacucho · 2,200 msnm',
    notes: 'Cacao · Tabaco suave · Frutos secos',
    image: '/Holzen/images/product5.jpeg',
    formats: [
      { label: 'Caja 5 kg', price: 31.00, unit: 'caja', minQty: 5 },
      { label: 'Saco 30 kg', price: 28.50, unit: 'saco', minQty: 1 },
      { label: 'Saco 60 kg', price: 27.00, unit: 'saco', minQty: 1 },
    ],
    producer: 'Manuel Ccahuana',
    producerImg: '/Holzen/images/farmer6.jpg',
    badge: null,
  },
  {
    id: 'esperanza-b2b',
    tag: 'Origen Directo',
    name: 'La Esperanza Caturra',
    origin: 'Cusco · Finca La Esperanza · 2,800 msnm',
    notes: 'Naranja · Caramelo · Almendra',
    image: '/Holzen/images/farmer7.jpeg',
    formats: [
      { label: 'Caja 5 kg', price: 36.50, unit: 'caja', minQty: 3 },
      { label: 'Saco 30 kg', price: 33.00, unit: 'saco', minQty: 1 },
      { label: 'Saco 60 kg', price: 31.00, unit: 'saco', minQty: 1 },
    ],
    producer: 'Rosa Quispe',
    producerImg: '/Holzen/images/farmer4.jpeg',
    badge: null,
  },
];

/* ─────────────────────────────────────────────
   B2B ADOPTION PLANS
───────────────────────────────────────────── */
const CORPORATE_FARMERS = [
  {
    id: 'lucia',
    name: 'Lucía Quispe',
    region: 'Cusco',
    role: 'Productora de café Chuncho',
    need: 'Necesita: Tanques de fermentación artesanal',
    progress: 68,
    adopters: 3,
    image: '/Holzen/images/farmer1.jpg',
    impact: {
      500: 'Financia el análisis de laboratorio mensual + empaque GrainPro de 2 sacos de 60 kg.',
      700: 'Cubre la certificación EUDR anual de su finca + transporte al puerto de exportación.',
      1000: 'Financia la renovación completa de su parcela de 1 hectárea este año.',
      1500: 'Cubre infraestructura de secado solar + capacitación avanzada en catación.',
      2000: 'Financia un año completo de operaciones: cosecha, procesado, certificación y exportación.',
    },
  },
  {
    id: 'edilberto',
    name: 'Edilberto Rojas',
    region: 'San Martín',
    role: 'Productor de Bourbon Natural',
    need: 'Necesita: Camas africanas de secado solar',
    progress: 45,
    adopters: 2,
    image: '/Holzen/images/farmer2.jpeg',
    impact: {
      500: 'Financia 4 camas africanas de secado solar para su finca de 3 hectáreas.',
      700: 'Cubre la renovación de plantas + insumos de procesado natural por un año.',
      1000: 'Financia la expansión de su cafetal a 1 hectárea adicional.',
      1500: 'Cubre maquinaria de despulpado + infraestructura de fermentación controlada.',
      2000: 'Financia la certificación orgánica internacional de toda su finca.',
    },
  },
  {
    id: 'rosa',
    name: 'Rosa Panduro',
    region: 'Huánuco',
    role: 'Productora de Honey Amarillo',
    need: 'Necesita: Secadora solar portátil',
    progress: 20,
    adopters: 1,
    image: '/Holzen/images/farmer3.jpeg',
    impact: {
      500: 'Financia la secadora solar portátil que necesita para independizarse de intermediarios.',
      700: 'Cubre la secadora + capacitación en catación + primer lote de exportación directa.',
      1000: 'Financia infraestructura completa de procesado + certificación de origen.',
      1500: 'Cubre un año de operaciones autónomas sin intermediarios.',
      2000: 'Financia la expansión de su finca + contratación de 2 trabajadores locales.',
    },
  },
];

const MONTHLY_AMOUNTS = [500, 700, 1000, 1500, 2000];
const ANNUAL_AMOUNTS = [700, 1000, 1500, 2500, 4000];

/* ─────────────────────────────────────────────
   NAVBAR EMPRESAS
───────────────────────────────────────────── */
const EmpresasNavbar = () => {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobOpen(false);
  };

  const navLinks = [
    { id: 'b2b-catalogo', label: t('emp_nav_catalog') },
    { id: 'b2b-productores', label: t('emp_nav_farmers') },
    { id: 'b2b-proceso', label: t('emp_nav_process') },
    { id: 'b2b-adopcion', label: t('emp_nav_adoption') },
    { id: 'b2b-contacto', label: t('emp_nav_contact') },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-coffee-900/95 backdrop-blur-sm border-b border-gold/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="cursor-pointer">
            <span className="font-serif text-xl font-bold tracking-[0.2em] text-cream uppercase">HOLZEN</span>
            <span className="block text-[10px] tracking-[0.15em] text-gold font-sans font-light">{t('emp_footer_subtitle')}</span>
          </Link>

          <ul className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <li key={l.id}>
                <button onClick={() => scrollTo(l.id)} className="text-cream/80 hover:text-gold transition-colors text-xs tracking-widest uppercase font-serif font-bold cursor-pointer whitespace-nowrap">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link to="/" className="hidden md:flex items-center gap-1.5 text-cream/60 hover:text-gold transition-colors text-xs font-sans tracking-widest uppercase border border-cream/20 hover:border-gold/40 px-3 py-1.5 rounded-full whitespace-nowrap">
              <i className="ri-arrow-left-s-line" />
              {t('emp_nav_store')}
            </Link>
            <a href="https://wa.me/51XXXXXXXXX?text=Hola,%20soy%20empresa%20y%20me%20interesa%20el%20café%20HOLZEN%20al%20por%20mayor" target="_blank" rel="noopener noreferrer nofollow" className="hidden md:flex items-center gap-2 text-sm text-gold border border-gold/40 hover:border-gold hover:bg-gold/10 transition-all px-4 py-2 rounded-full whitespace-nowrap font-sans tracking-wide">
              <i className="ri-whatsapp-line" />
              {t('emp_nav_whatsapp')}
            </a>
            <button className="md:hidden w-9 h-9 flex items-center justify-center cursor-pointer" onClick={() => setMobOpen(true)}>
              <i className="ri-menu-line text-cream text-xl" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 md:hidden ${mobOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        <div className="absolute inset-0 bg-black/60" onClick={() => setMobOpen(false)} />
        <div className={`absolute top-0 right-0 w-72 h-full bg-coffee-800 transition-transform duration-300 ${mobOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col p-8`}>
          <button onClick={() => setMobOpen(false)} className="self-end mb-8 w-9 h-9 flex items-center justify-center cursor-pointer">
            <i className="ri-close-line text-cream text-2xl" />
          </button>
          <div className="flex flex-col gap-6">
            {navLinks.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)} className="text-left text-cream/80 hover:text-gold transition-colors text-sm tracking-widest uppercase font-serif font-bold cursor-pointer">
                {l.label}
              </button>
            ))}
            <Link to="/" className="text-gold/70 text-sm font-sans flex items-center gap-2">
              <i className="ri-arrow-left-s-line" /> {t('emp_nav_back')}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   HERO B2B
───────────────────────────────────────────── */
const EmpresasHero = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: 'ri-box-3-line', value: t('emp_hero_stat1_val'), label: t('emp_hero_stat1_label') },
    { icon: 'ri-shield-check-line', value: t('emp_hero_stat2_val'), label: t('emp_hero_stat2_label') },
    { icon: 'ri-truck-line', value: t('emp_hero_stat3_val'), label: t('emp_hero_stat3_label') },
    { icon: 'ri-user-heart-line', value: t('emp_hero_stat4_val'), label: t('emp_hero_stat4_label') },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/Holzen/videos/hero5.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-coffee-900/75" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/40 bg-gold/10 mb-8">
          <i className="ri-building-2-line text-gold text-sm" />
          <span className="text-gold font-sans text-xs tracking-[0.3em] uppercase font-semibold">{t('emp_hero_badge')}</span>
        </div>

        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-cream leading-tight mb-6 font-bold">
          {t('emp_hero_title1')}<br />
          <em className="text-gold italic">{t('emp_hero_title2')}</em>
        </h1>

        <p className="text-cream/70 font-sans text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-4">
          {t('emp_hero_desc1')}
        </p>
        <p className="text-gold/80 font-sans text-sm max-w-xl mx-auto leading-relaxed mb-10">
          {t('emp_hero_desc2')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => document.getElementById('b2b-catalogo')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative overflow-hidden px-6 py-3 rounded-full font-serif font-black text-xs tracking-[0.15em] uppercase text-white cursor-pointer whitespace-nowrap"
            style={{ background: 'linear-gradient(135deg, #c2622a, #e07830)', boxShadow: '0 0 24px rgba(210,100,40,0.4)' }}
          >
            <span className="relative z-10 flex items-center gap-2 justify-center">
              <i className="ri-box-3-line" />
              {t('emp_hero_cta_catalog')}
            </span>
            <span className="absolute top-0 bottom-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </button>
          <a
            href="https://wa.me/51XXXXXXXXX?text=Hola,%20soy%20empresa%20y%20me%20interesa%20el%20café%20HOLZEN%20al%20por%20mayor"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="px-8 py-4 rounded-full font-serif font-black text-xs tracking-[0.15em] uppercase text-gold border border-gold/50 hover:bg-gold/10 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 justify-center"
          >
            <i className="ri-whatsapp-line" />
            {t('emp_hero_cta_advisor')}
          </a>
        </div>

        {/* Stats bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-cream/10 bg-white/5 backdrop-blur-sm px-4 py-4 text-center">
              <div className="w-8 h-8 flex items-center justify-center mx-auto mb-2">
                <i className={`${s.icon} text-gold text-lg`} />
              </div>
              <div className="font-serif text-lg text-cream font-bold leading-none mb-1">{s.value}</div>
              <div className="text-cream/40 font-sans text-[10px] tracking-widest uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-gold/40" />
        <i className="ri-arrow-down-s-line text-gold/60 text-lg" />
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   B2B CATALOG
───────────────────────────────────────────── */
const B2BCatalog = () => {
  const { t } = useTranslation();
  const [selectedFormat, setSelectedFormat] = useState<Record<string, number>>({});
  const [flipped, setFlipped] = useState<string | null>(null);

  const getFormat = (productId: string, product: typeof b2bProducts[0]) => {
    const idx = selectedFormat[productId] ?? 0;
    return product.formats[idx];
  };

  const perks = [
    { icon: 'ri-file-list-3-line', title: t('emp_perk1_title'), desc: t('emp_perk1_desc') },
    { icon: 'ri-shield-check-line', title: t('emp_perk2_title'), desc: t('emp_perk2_desc') },
    { icon: 'ri-refresh-line', title: t('emp_perk3_title'), desc: t('emp_perk3_desc') },
  ];

  return (
    <section id="b2b-catalogo" className="relative py-16 md:py-24 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover object-center"><source src="/Holzen/videos/farmers-bg.mp4" type="video/mp4" /></video>
        <div className="absolute inset-0 bg-coffee-900/70" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-3">{t('emp_catalog_eyebrow')}</p>
          <h2 className="font-serif text-3xl md:text-5xl text-cream leading-tight mb-3 font-bold">
            {t('emp_catalog_title1')}<br /><em className="text-gold italic">{t('emp_catalog_title2')}</em>
          </h2>
          <p className="text-cream/60 font-serif text-sm max-w-xl leading-relaxed">
            {t('emp_catalog_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" data-product-shop>
          {b2bProducts.map((p) => {
            const fmt = getFormat(p.id, p);
            const isFlipped = flipped === p.id;
            return (
              <div key={p.id} className="relative rounded-xl overflow-hidden h-[420px] cursor-pointer flex-shrink-0">
                {p.badge && (
                  <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-gold text-coffee-900 text-[10px] font-sans font-bold tracking-widest uppercase px-2.5 py-1 rounded-full whitespace-nowrap">
                    <i className="ri-star-fill text-[9px]" />
                    {p.badge}
                  </div>
                )}
                <div className="absolute top-3 right-3 z-20">
                  <span className="text-[10px] tracking-widest uppercase text-gold font-sans border border-gold/50 bg-coffee-900/60 backdrop-blur-sm px-2.5 py-1 rounded-full whitespace-nowrap">{p.tag}</span>
                </div>

                {/* FRONT */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} onClick={() => setFlipped(p.id)}>
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/95 via-coffee-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="font-serif text-lg text-cream leading-tight mb-1">{p.name}</div>
                    <div className="text-cream/50 text-xs font-sans mb-2">{p.origin}</div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.notes.split(' · ').map((note) => (
                        <span key={note} className="text-[10px] text-gold/80 border border-gold/20 px-2 py-0.5 rounded-full font-sans">{note}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gold font-sans text-sm font-semibold">{t('emp_catalog_from')} ${fmt.price.toFixed(2)} {t('emp_catalog_per_kg')}</span>
                      <span className="text-cream/40 text-[10px] font-sans uppercase tracking-widest">{t('emp_catalog_see_formats')}</span>
                    </div>
                  </div>
                </div>

                {/* BACK */}
                <div className={`absolute inset-0 transition-opacity duration-500 flex flex-col bg-coffee-900 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  <div className="relative h-[38%] flex-shrink-0">
                    <img src={p.producerImg} alt={p.producer} className="w-full h-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-coffee-900" />
                    <div className="absolute bottom-3 left-4">
                      <div className="text-cream/50 text-[9px] font-sans uppercase tracking-widest">{t('emp_catalog_producer')}</div>
                      <div className="font-serif text-sm text-cream">{p.producer}</div>
                    </div>
                  </div>

                  <div className="flex-1 px-4 pt-3 pb-4 flex flex-col gap-2 overflow-hidden">
                    <div className="text-gold/60 text-[9px] font-sans uppercase tracking-widest mb-1">{t('emp_catalog_select_format')}</div>
                    {p.formats.map((f, i) => (
                      <button
                        key={i}
                        onClick={(e) => { e.stopPropagation(); setSelectedFormat((prev) => ({ ...prev, [p.id]: i })); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm font-sans transition-all cursor-pointer ${(selectedFormat[p.id] ?? 0) === i ? 'border-gold bg-gold/15 text-gold' : 'border-cream/15 text-cream/60 hover:border-cream/30'}`}
                      >
                        <span className="font-semibold">{f.label}</span>
                        <span className="text-xs">${f.price.toFixed(2)} / kg</span>
                      </button>
                    ))}
                    <div className="text-cream/30 text-[9px] font-sans mt-1">
                      {t('emp_catalog_min')} {p.formats[selectedFormat[p.id] ?? 0].minQty} {p.formats[selectedFormat[p.id] ?? 0].minQty > 1 ? t('emp_catalog_units') : t('emp_catalog_unit')}
                    </div>
                    <a
                      href={`https://wa.me/51XXXXXXXXX?text=Hola,%20soy%20empresa%20y%20me%20interesa%20${encodeURIComponent(p.name)}%20en%20formato%20${encodeURIComponent(p.formats[selectedFormat[p.id] ?? 0].label)}`}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-auto w-full flex items-center justify-center gap-2 bg-gold hover:bg-amber-400 text-coffee-900 font-serif font-black py-2 rounded-full text-[10px] tracking-[0.15em] uppercase transition-colors cursor-pointer whitespace-nowrap"
                    >
                      <i className="ri-whatsapp-line" />
                      {t('emp_catalog_quote_btn')}
                    </a>
                    <button onClick={() => setFlipped(null)} className="text-cream/30 text-[9px] font-sans text-center cursor-pointer hover:text-cream/60 transition-colors">
                      {t('emp_catalog_back')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* B2B perks */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          {perks.map((perk) => (
            <div key={perk.title} className="rounded-xl border border-cream/10 bg-white/5 p-5 flex gap-4 items-start">
              <div className="w-10 h-10 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: 'rgba(194,98,42,0.2)' }}>
                <i className={`${perk.icon} text-gold text-base`} />
              </div>
              <div>
                <div className="font-sans text-sm text-cream font-semibold mb-1">{perk.title}</div>
                <div className="text-cream/50 text-xs font-sans leading-relaxed">{perk.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   B2B FARMERS
───────────────────────────────────────────── */
const B2BFarmers = () => {
  const { t } = useTranslation();
  const [cur, setCur] = useState(0);
  const f = farmers[cur];

  return (
    <section id="b2b-productores" className="relative py-16 md:py-20 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover object-center">
          <source src="/Holzen/videos/hero4.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-coffee-900/75" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)' }} />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-3">{t('emp_farmers_eyebrow')}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream font-bold mb-3">
            {t('emp_farmers_title')}
          </h2>
          <p className="text-cream/50 font-serif text-sm max-w-lg mx-auto leading-relaxed">
            {t('emp_farmers_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Main farmer card */}
          <div className="relative rounded-2xl overflow-hidden" style={{ height: 420 }}>
            <img src={f.image} alt={f.name} className="w-full h-full object-cover object-top transition-all duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/95 via-coffee-900/20 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="flex items-center gap-1.5 bg-coffee-900/80 border border-gold/40 text-gold text-[10px] tracking-widest uppercase font-sans font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                <i className={f.tagIcon} style={{ fontSize: 11 }} />
                {f.tag}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="font-serif text-2xl text-cream mb-1">{f.name}</div>
              <div className="text-gold/70 font-sans text-xs tracking-widest uppercase mb-3">{f.location}</div>
              <p className="text-cream/70 font-sans text-sm leading-relaxed mb-4">{f.story}</p>
              <div className="flex items-center gap-2">
                <i className="ri-user-line text-gold text-sm" />
                <span className="font-serif text-gold font-bold">{f.stat}</span>
                <span className="text-cream/40 font-sans text-xs">{f.statLabel}</span>
              </div>
            </div>
          </div>

          {/* Farmer list */}
          <div className="flex flex-col gap-3">
            <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 mb-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <i className="ri-qr-code-line text-gold text-lg" />
                </div>
                <div>
                  <div className="text-gold text-xs font-sans font-semibold tracking-widest uppercase mb-1">{t('emp_farmers_qr_title')}</div>
                  <p className="text-cream/60 text-xs font-sans leading-relaxed">
                    {t('emp_farmers_qr_desc')}
                  </p>
                </div>
              </div>
            </div>

            {farmers.slice(0, 6).map((farmer, i) => (
              <button
                key={i}
                onClick={() => setCur(i)}
                className={`w-full text-left rounded-xl p-3 border transition-all duration-300 cursor-pointer flex items-center gap-3 ${cur === i ? 'border-gold/60 bg-gold/10' : 'border-cream/10 bg-white/5 hover:border-cream/20'}`}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <img src={farmer.image} alt={farmer.name} className="w-full h-full object-cover object-top" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-serif text-sm text-cream font-semibold">{farmer.name}</div>
                  <div className="text-cream/40 text-[10px] font-sans truncate">{farmer.location}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-serif text-sm text-gold font-bold">{farmer.stat}</div>
                  <div className="text-cream/30 text-[9px] font-sans">{farmer.statLabel}</div>
                </div>
                {cur === i && <i className="ri-check-line text-gold flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   B2B PROCESS
───────────────────────────────────────────── */
const B2BProcess = () => {
  const { t } = useTranslation();

  const steps = [
    {
      n: '01', icon: 'ri-plant-line',
      title: t('emp_process_step1_title'),
      desc: t('emp_process_step1_desc'),
      tags: ['100% Manual', 'GPS trazado'],
      image: '/Holzen/images/process1.jpeg',
    },
    {
      n: '02', icon: 'ri-flask-line',
      title: t('emp_process_step2_title'),
      desc: t('emp_process_step2_desc'),
      tags: ['48-72 horas', 'Fermentación'],
      image: '/Holzen/images/process2.jpeg',
    },
    {
      n: '03', icon: 'ri-sun-line',
      title: t('emp_process_step3_title'),
      desc: t('emp_process_step3_desc'),
      tags: ['7-10 días', '≤7% humedad'],
      image: '/Holzen/images/process3.jpeg',
    },
    {
      n: '04', icon: 'ri-shield-check-line',
      title: t('emp_process_step4_title'),
      desc: t('emp_process_step4_desc'),
      tags: ['Cert. EUDR', 'GrainPro'],
      image: '/Holzen/images/process4.jpeg',
    },
  ];

  const logisticsCols = [
    {
      icon: 'ri-truck-line',
      title: t('emp_logistics_title'),
      items: [t('emp_logistics_item1'), t('emp_logistics_item2'), t('emp_logistics_item3'), t('emp_logistics_item4')],
    },
    {
      icon: 'ri-file-text-line',
      title: t('emp_docs_title'),
      items: [t('emp_docs_item1'), t('emp_docs_item2'), t('emp_docs_item3'), t('emp_docs_item4')],
    },
    {
      icon: 'ri-customer-service-2-line',
      title: t('emp_support_title'),
      items: [t('emp_support_item1'), t('emp_support_item2'), t('emp_support_item3'), t('emp_support_item4')],
    },
  ];

  return (
    <section id="b2b-proceso" className="relative py-16 md:py-20 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0">
        <img src="/Holzen/images/process3.jpeg" alt="bg" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-coffee-900/80" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-3">{t('emp_process_eyebrow')}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream font-bold mb-3">
            {t('emp_process_title')}
          </h2>
          <p className="text-cream/50 font-sans text-sm max-w-lg mx-auto leading-relaxed">
            {t('emp_process_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step) => (
            <div key={step.n} className="rounded-xl overflow-hidden border border-cream/10 bg-coffee-900/60 backdrop-blur-sm">
              <div className="relative h-36">
                <img src={step.image} alt={step.title} className="w-full h-full object-cover object-center" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-coffee-900/80" />
                <div className="absolute top-3 left-3 font-serif text-2xl text-gold/30 font-bold">{step.n}</div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <i className={`${step.icon} text-gold text-sm`} />
                  </div>
                  <div className="font-sans text-sm text-cream font-semibold">{step.title}</div>
                </div>
                <p className="text-cream/50 text-xs font-sans leading-relaxed mb-3">{step.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {step.tags.map((tag) => (
                    <span key={tag} className="text-[9px] text-gold/70 border border-gold/20 px-2 py-0.5 rounded-full font-sans">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logistics info */}
        <div className="mt-10 rounded-xl border border-gold/20 bg-gold/5 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {logisticsCols.map((col) => (
              <div key={col.title}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 flex items-center justify-center">
                    <i className={`${col.icon} text-gold text-base`} />
                  </div>
                  <div className="font-sans text-sm text-cream font-semibold">{col.title}</div>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-cream/60 text-xs font-sans">
                      <i className="ri-check-line text-gold/60 text-xs flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   B2B IMPACT SLIDER
───────────────────────────────────────────── */
const B2BImpact = () => {
  const { t } = useTranslation();
  const [sliderVal, setSliderVal] = useState(50);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const SLIDER_MIN = 5;
  const SLIDER_MAX = 500;
  const pct = ((sliderVal - SLIDER_MIN) / (SLIDER_MAX - SLIDER_MIN)) * 100;

  const calcFromX = useCallback((clientX: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    setSliderVal(Math.round(SLIDER_MIN + ratio * (SLIDER_MAX - SLIDER_MIN)));
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

  const impactCards = [
    { icon: 'ri-group-line', getValue: (n: number) => String(Math.max(1, Math.round(n / 8))), label: t('emp_impact_card1'), image: '/Holzen/images/impact1.jpeg' },
    { icon: 'ri-money-dollar-circle-line', getValue: (n: number) => `$${(n * 3.2).toFixed(0)}`, label: t('emp_impact_card2'), image: '/Holzen/images/product5.jpeg' },
    { icon: 'ri-book-open-line', getValue: (n: number) => String(Math.max(1, Math.round(n / 12))), label: t('emp_impact_card3'), image: '/Holzen/images/impact3.jpeg' },
    { icon: 'ri-plant-line', getValue: (n: number) => String(Math.max(1, Math.round(n * 2.1))), label: t('emp_impact_card4'), image: '/Holzen/images/product1.jpeg' },
  ];

  return (
    <section className="relative py-12 md:py-16 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="w-full h-full object-cover object-center">
          <source src="/Holzen/videos/farmers-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-coffee-900/85" />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)' }} />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-start justify-between mb-8 gap-4">
          <div>
            <h3 className="font-serif text-xl md:text-2xl text-cream leading-tight">{t('emp_impact_title')}</h3>
            <p className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full font-sans text-xs font-semibold text-white cursor-default select-none" style={{ background: 'linear-gradient(90deg, #c2622a, #e07830)', boxShadow: '0 0 10px rgba(210,100,40,0.45)' }}>
              <i className="ri-drag-move-line text-white/80 text-xs" />
              {t('emp_impact_slider_hint')}
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/25 bg-gold/8">
            <i className="ri-building-2-line text-gold text-xs" />
            <span className="text-gold font-sans text-[10px] tracking-widest uppercase font-semibold">{t('emp_impact_b2b_badge')}</span>
          </div>
        </div>

        <div className="text-center mb-5">
          <div className="flex items-baseline justify-center gap-2">
            <span className="font-serif text-5xl md:text-6xl text-gold leading-none" style={{ fontVariantNumeric: 'tabular-nums' }}>{sliderVal}</span>
            <span className="font-sans text-cream/60 text-base md:text-lg">{t('emp_impact_unit')}</span>
          </div>
          <p className="text-cream/30 font-sans text-[9px] tracking-[0.35em] uppercase mt-1">{t('emp_impact_unit_label')}</p>
        </div>

        <div className="relative mb-7 px-2" onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
          <div ref={trackRef} className="relative h-1.5 rounded-full cursor-pointer" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #c2622a, #e07830)' }} />
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-white cursor-grab active:cursor-grabbing flex items-center justify-center" style={{ left: `${pct}%`, background: 'linear-gradient(135deg, #c2622a, #e07830)', boxShadow: '0 0 12px rgba(210,100,40,0.6)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
            </div>
          </div>
          <div className="flex justify-between mt-2 px-0">
            {[5, 125, 250, 375, 500].map((v) => (
              <span key={v} className="font-sans text-[9px] text-cream/25">{v} kg</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          {impactCards.map((card, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden" style={{ height: 130 }}>
              <img src={card.image} alt={card.label} className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(10,5,2,0.3) 0%, rgba(10,5,2,0.82) 100%)' }} />
              <div className="absolute top-2.5 left-2.5 w-6 h-6 flex items-center justify-center rounded-full" style={{ background: 'rgba(194,98,42,0.75)' }}>
                <i className={`${card.icon} text-white text-xs`} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <div className="font-serif text-xl text-white leading-none font-bold mb-0.5" style={{ fontVariantNumeric: 'tabular-nums' }}>{card.getValue(sliderVal)}</div>
                <div className="text-cream/80 font-sans text-[9px] leading-tight">{card.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.2), transparent)' }} />
    </section>
  );
};

/* ─────────────────────────────────────────────
   B2B ADOPTION
───────────────────────────────────────────── */
const B2BAdoption = () => {
  const { t } = useTranslation();
  const [selectedFarmer, setSelectedFarmer] = useState(CORPORATE_FARMERS[0]);
  const [payMode, setPayMode] = useState<'monthly' | 'annual'>('monthly');
  const [amount, setAmount] = useState(500);
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const amounts = payMode === 'monthly' ? MONTHLY_AMOUNTS : ANNUAL_AMOUNTS;

  const handleModeSwitch = (mode: 'monthly' | 'annual') => {
    setPayMode(mode);
    setAmount(mode === 'monthly' ? 500 : 700);
  };

  const impactText =
    selectedFarmer.impact[amount as keyof typeof selectedFarmer.impact] ??
    `Con $${amount} tu empresa apoya directamente a ${selectedFarmer.name} y su comunidad.`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!companyName.trim() || !contactName.trim() || !email.trim()) return;
    setSubmitting(true);
    try {
      const body = new URLSearchParams({
        company_name: companyName,
        contact_name: contactName,
        email,
        farmer: selectedFarmer.name,
        region: selectedFarmer.region,
        pay_mode: payMode === 'monthly' ? 'Mensual' : 'Anual',
        amount: `$${amount}`,
      });
      await fetch('https://readdy.ai/api/form/d7mmtefu2vahpmebfa1g', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const adoptionBadges = [
    { icon: 'ri-award-line', text: t('emp_adoption_badge1') },
    { icon: 'ri-bar-chart-line', text: t('emp_adoption_badge2') },
    { icon: 'ri-image-line', text: t('emp_adoption_badge3') },
    { icon: 'ri-video-line', text: t('emp_adoption_badge4') },
  ];

  return (
    <section id="b2b-adopcion" className="relative py-16 md:py-20 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0">
        <img src="/Holzen/images/product1.jpeg" alt="bg" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(20,12,5,0.75)' }} />
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-3">{t('emp_adoption_eyebrow')}</p>
          <h2 className="font-serif text-3xl md:text-5xl text-cream leading-tight mb-3 font-bold">
            {t('emp_adoption_title1')}<br /><em className="text-gold italic">{t('emp_adoption_title2')}</em>
          </h2>
          <p className="text-cream/50 font-sans text-sm max-w-xl mx-auto leading-relaxed">
            {t('emp_adoption_desc')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            {adoptionBadges.map((b) => (
              <div key={b.text} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gold/25 bg-gold/8">
                <i className={`${b.icon} text-gold text-xs`} />
                <span className="text-gold font-sans text-[10px] tracking-wide font-semibold">{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing highlight */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 max-w-2xl mx-auto">
          <div className={`rounded-xl border p-5 text-center cursor-pointer transition-all ${payMode === 'monthly' ? 'border-gold bg-gold/10' : 'border-cream/15 bg-white/5 hover:border-cream/25'}`} onClick={() => handleModeSwitch('monthly')}>
            <div className="text-gold/60 text-[10px] font-sans uppercase tracking-widest mb-2">{t('emp_adoption_monthly_label')}</div>
            <div className="font-serif text-3xl text-cream font-bold mb-1">{t('emp_adoption_monthly_from')} <span className="text-gold">$500</span></div>
            <div className="text-cream/40 text-xs font-sans">{t('emp_adoption_monthly_min')}</div>
            <div className="mt-3 text-[10px] text-cream/50 font-sans">{t('emp_adoption_monthly_note')}</div>
          </div>
          <div className={`rounded-xl border p-5 text-center cursor-pointer transition-all relative overflow-hidden ${payMode === 'annual' ? 'border-gold bg-gold/10' : 'border-cream/15 bg-white/5 hover:border-cream/25'}`} onClick={() => handleModeSwitch('annual')}>
            <div className="absolute top-2 right-2 bg-gold text-coffee-900 text-[9px] font-bold px-2 py-0.5 rounded-full font-sans">{t('emp_adoption_recommended')}</div>
            <div className="text-gold/60 text-[10px] font-sans uppercase tracking-widest mb-2">{t('emp_adoption_annual_label')}</div>
            <div className="font-serif text-3xl text-cream font-bold mb-1">{t('emp_adoption_annual_from')} <span className="text-gold">$700</span></div>
            <div className="text-cream/40 text-xs font-sans">{t('emp_adoption_annual_min')}</div>
            <div className="mt-3 text-[10px] text-cream/50 font-sans">{t('emp_adoption_annual_note')}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT: farmer selector */}
          <div className="flex flex-col gap-4">
            <p className="text-gold/70 text-[10px] tracking-[0.3em] uppercase font-sans">{t('emp_adoption_choose')}</p>
            <div className="flex flex-col gap-2.5">
              {CORPORATE_FARMERS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFarmer(f)}
                  className={`w-full text-left rounded-xl p-3 md:p-4 border transition-all duration-300 cursor-pointer ${selectedFarmer.id === f.id ? 'border-gold/60 bg-gold/10' : 'border-cream/10 bg-white/5 hover:border-cream/20'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full overflow-hidden">
                      <img src={f.image} alt={f.name} className="w-full h-full object-cover object-top" />
                    </div>
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
                      {f.progress}% · {f.adopters} {f.adopters !== 1 ? t('emp_adoption_progress_companies_pl') : t('emp_adoption_progress_companies')} {f.adopters !== 1 ? t('emp_adoption_progress_adopters') : t('emp_adoption_progress_adopter')}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* RSE badge */}
            <div className="rounded-xl border border-gold/20 bg-gold/5 p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  <i className="ri-award-line text-gold text-lg" />
                </div>
                <div>
                  <div className="text-gold text-xs font-sans font-semibold tracking-widest uppercase mb-1">{t('emp_adoption_rse_title')}</div>
                  <p className="text-cream/60 text-xs font-sans leading-relaxed">
                    {t('emp_adoption_rse_desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: form */}
          <div className="flex flex-col gap-3">
            {/* Amount selector */}
            <div className="grid grid-cols-2 gap-2 bg-white/5 rounded-xl p-1 border border-cream/10">
              <button onClick={() => handleModeSwitch('monthly')} className={`py-2.5 rounded-lg text-sm font-sans font-semibold transition-all cursor-pointer whitespace-nowrap ${payMode === 'monthly' ? 'bg-gold text-coffee-900' : 'text-cream/50 hover:text-cream'}`}>{t('emp_adoption_tab_monthly')}</button>
              <button onClick={() => handleModeSwitch('annual')} className={`py-2.5 rounded-lg text-sm font-sans font-semibold transition-all cursor-pointer whitespace-nowrap ${payMode === 'annual' ? 'bg-gold text-coffee-900' : 'text-cream/50 hover:text-cream'}`}>{t('emp_adoption_tab_annual')}</button>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {amounts.map((a) => (
                <button key={a} onClick={() => setAmount(a)} className={`py-2.5 rounded-xl text-sm font-sans font-semibold border transition-all cursor-pointer whitespace-nowrap ${amount === a ? 'bg-gold/20 border-gold text-gold' : 'border-cream/15 bg-white/5 text-cream/60 hover:border-cream/30 hover:text-cream'}`}>
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
                <div className="text-gold text-[10px] tracking-widest uppercase font-sans mb-1">{t('emp_adoption_impact_label')}</div>
                <p className="text-cream/70 text-xs font-sans leading-relaxed">Con ${amount} para {selectedFarmer.name}: {impactText}</p>
              </div>
            </div>

            {/* Form */}
            {submitted ? (
              <div className="rounded-xl border border-gold/30 bg-gold/10 p-6 text-center">
                <i className="ri-building-2-line text-gold text-2xl mb-2 block" />
                <div className="font-serif text-lg text-cream mb-1">{t('emp_adoption_success_title')}</div>
                <p className="text-cream/50 text-xs font-sans">{t('emp_adoption_success_desc')}</p>
              </div>
            ) : (
              <form data-readdy-form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input type="text" name="company_name" placeholder={t('emp_adoption_company_placeholder')} value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="w-full bg-white/5 border border-cream/15 rounded-xl px-4 py-3 text-cream text-sm font-sans placeholder-cream/30 focus:outline-none focus:border-gold/50" />
                <input type="text" name="contact_name" placeholder={t('emp_adoption_contact_placeholder')} value={contactName} onChange={(e) => setContactName(e.target.value)} required className="w-full bg-white/5 border border-cream/15 rounded-xl px-4 py-3 text-cream text-sm font-sans placeholder-cream/30 focus:outline-none focus:border-gold/50" />
                <input type="email" name="email" placeholder={t('emp_adoption_email_placeholder')} value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-white/5 border border-cream/15 rounded-xl px-4 py-3 text-cream text-sm font-sans placeholder-cream/30 focus:outline-none focus:border-gold/50" />
                <button type="submit" disabled={submitting} className="relative overflow-hidden w-full disabled:opacity-60 font-sans font-bold py-3.5 rounded-xl text-sm tracking-wide cursor-pointer whitespace-nowrap flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #c2622a 0%, #e07830 50%, #c2622a 100%)', color: '#fff8f0', boxShadow: '0 0 20px rgba(210,100,40,0.3)' }}>
                  <span className="relative z-10 flex items-center gap-2">
                    <i className="ri-building-2-line text-white/90 text-lg" />
                    {submitting ? t('emp_adoption_submitting') : `${t('emp_adoption_submit', { amount, period: payMode === 'monthly' ? t('emp_adoption_submit_monthly') : t('emp_adoption_submit_annual') })}`}
                  </span>
                  <span className="absolute top-0 bottom-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </button>
                <p className="text-cream/25 text-[10px] font-sans text-center">{t('emp_adoption_min_note')}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   B2B CONTACT / CTA
───────────────────────────────────────────── */
const B2BContact = () => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [emailVal, setEmailVal] = useState('');
  const [volume, setVolume] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !emailVal.trim()) return;
    setSubmitting(true);
    try {
      const body = new URLSearchParams({ name, company, email: emailVal, volume, message: message.slice(0, 500) });
      await fetch('https://readdy.ai/api/form/d7mmtefu2vahpmebfa1g', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const contactItems = [
    { icon: 'ri-whatsapp-line', title: t('emp_contact_whatsapp_title'), desc: t('emp_contact_whatsapp_desc'), action: t('emp_contact_whatsapp_action'), href: 'https://wa.me/51XXXXXXXXX?text=Hola,%20soy%20empresa%20y%20me%20interesa%20el%20café%20HOLZEN%20al%20por%20mayor' },
    { icon: 'ri-mail-line', title: t('emp_contact_email_title'), desc: t('emp_contact_email_desc'), action: null, href: null },
    { icon: 'ri-map-pin-line', title: t('emp_contact_office_title'), desc: t('emp_contact_office_desc'), action: null, href: null },
  ];

  return (
    <section id="b2b-contacto" className="relative py-16 md:py-20 px-4 md:px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="/Holzen/images/reviews-bg.jpg" alt="bg" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0" style={{ background: 'rgba(20,12,5,0.75)' }} />
      </div>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent)' }} />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-10">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-3">{t('emp_contact_eyebrow')}</p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream font-bold mb-3">
            {t('emp_contact_title')}
          </h2>
          <p className="text-cream/50 font-sans text-sm max-w-lg mx-auto leading-relaxed">
            {t('emp_contact_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: contact info */}
          <div className="flex flex-col gap-5">
            <div className="rounded-xl overflow-hidden" style={{ height: 220 }}>
              <img src="/Holzen/images/process3.jpeg" alt="B2B contact" className="w-full h-full object-cover object-center" />
            </div>

            <div className="flex flex-col gap-3">
              {contactItems.map((c) => (
                <div key={c.title} className="flex items-center gap-3 rounded-xl border border-cream/10 bg-white/5 p-4">
                  <div className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0" style={{ background: 'rgba(194,98,42,0.2)' }}>
                    <i className={`${c.icon} text-gold text-base`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-sans text-sm text-cream font-semibold">{c.title}</div>
                    <div className="text-cream/40 text-xs font-sans">{c.desc}</div>
                  </div>
                  {c.action && c.href && (
                    <a href={c.href} target="_blank" rel="noopener noreferrer nofollow" className="text-gold text-xs font-sans font-semibold whitespace-nowrap hover:text-amber-400 transition-colors cursor-pointer">
                      {c.action} →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          {submitted ? (
            <div className="rounded-xl border border-gold/30 bg-gold/10 p-8 text-center flex flex-col items-center justify-center" style={{ minHeight: 400 }}>
              <i className="ri-check-double-line text-gold text-3xl mb-3 block" />
              <div className="font-serif text-xl text-cream mb-2">{t('emp_contact_success_title')}</div>
              <p className="text-cream/50 text-sm font-sans max-w-xs">{t('emp_contact_success_desc')}</p>
            </div>
          ) : (
            <form data-readdy-form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" name="name" placeholder={t('emp_contact_name_placeholder')} value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-white/5 border border-cream/15 rounded-xl px-4 py-3 text-cream text-sm font-sans placeholder-cream/30 focus:outline-none focus:border-gold/50" />
                <input type="text" name="company" placeholder={t('emp_contact_company_placeholder')} value={company} onChange={(e) => setCompany(e.target.value)} className="w-full bg-white/5 border border-cream/15 rounded-xl px-4 py-3 text-cream text-sm font-sans placeholder-cream/30 focus:outline-none focus:border-gold/50" />
              </div>
              <input type="email" name="email" placeholder={t('emp_contact_email_placeholder')} value={emailVal} onChange={(e) => setEmailVal(e.target.value)} required className="w-full bg-white/5 border border-cream/15 rounded-xl px-4 py-3 text-cream text-sm font-sans placeholder-cream/30 focus:outline-none focus:border-gold/50" />
              <select name="volume" value={volume} onChange={(e) => setVolume(e.target.value)} className="w-full bg-coffee-900 border border-cream/15 rounded-xl px-4 py-3 text-cream text-sm font-sans focus:outline-none focus:border-gold/50 cursor-pointer">
                <option value="">{t('emp_contact_volume_placeholder')}</option>
                <option value="5-30kg">{t('emp_contact_volume_opt1')}</option>
                <option value="30-100kg">{t('emp_contact_volume_opt2')}</option>
                <option value="100-300kg">{t('emp_contact_volume_opt3')}</option>
                <option value="300kg+">{t('emp_contact_volume_opt4')}</option>
              </select>
              <textarea
                name="message"
                placeholder={t('emp_contact_message_placeholder')}
                value={message}
                onChange={(e) => { if (e.target.value.length <= 500) setMessage(e.target.value); }}
                rows={4}
                className="w-full bg-white/5 border border-cream/15 rounded-xl px-4 py-3 text-cream text-sm font-sans placeholder-cream/30 focus:outline-none focus:border-gold/50 resize-none"
              />
              <div className="text-cream/25 text-[10px] font-sans text-right">{message.length}/500</div>
              <button type="submit" disabled={submitting} className="relative overflow-hidden w-full disabled:opacity-60 font-sans font-bold py-3.5 rounded-xl text-sm tracking-wide cursor-pointer whitespace-nowrap" style={{ background: 'linear-gradient(135deg, #c2622a 0%, #e07830 50%, #c2622a 100%)', color: '#fff8f0', boxShadow: '0 0 20px rgba(210,100,40,0.3)' }}>
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  <i className="ri-send-plane-line text-white/90" />
                  {submitting ? t('emp_contact_submitting') : t('emp_contact_submit')}
                </span>
                <span className="absolute top-0 bottom-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </button>
              <p className="text-cream/25 text-[10px] font-sans text-center">{t('emp_contact_footer_note')}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────
   FOOTER B2B
───────────────────────────────────────────── */
const B2BFooter = () => {
  const { t } = useTranslation();
  return (
    <footer className="relative py-10 px-4 md:px-6" style={{ background: '#1a0d05', borderTop: '1px solid rgba(201,169,110,0.12)' }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="font-serif text-lg font-bold tracking-[0.2em] text-cream uppercase">HOLZEN</div>
          <div className="text-[10px] tracking-[0.15em] text-gold font-sans font-light">{t('emp_footer_subtitle')}</div>
          <p className="text-cream/30 font-sans text-xs mt-2 max-w-xs leading-relaxed">{t('emp_footer_tagline')}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link to="/" className="text-cream/50 hover:text-gold transition-colors text-xs font-sans tracking-widest uppercase flex items-center gap-1.5">
            <i className="ri-arrow-left-s-line" /> {t('emp_footer_store')}
          </Link>
          <Link to="/productores" className="text-cream/50 hover:text-gold transition-colors text-xs font-sans tracking-widest uppercase">
            {t('emp_footer_farmers')}
          </Link>
          <a href="https://wa.me/51XXXXXXXXX?text=Hola,%20soy%20empresa%20y%20me%20interesa%20el%20café%20HOLZEN%20al%20por%20mayor" target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-2 text-sm text-gold border border-gold/40 hover:border-gold hover:bg-gold/10 transition-all px-4 py-2 rounded-full whitespace-nowrap font-sans">
            <i className="ri-whatsapp-line" /> {t('emp_nav_whatsapp')}
          </a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-6 pt-5 border-t border-cream/5 text-center">
        <p className="text-cream/20 font-sans text-[10px] tracking-widest">{t('emp_footer_copyright')}</p>
      </div>
    </footer>
  );
};

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
const EmpresasPage = () => {
  void products;

  return (
    <div className="min-h-screen bg-coffee-900">
      <EmpresasNavbar />
      <EmpresasHero />
      <B2BCatalog />
      <B2BFarmers />
      <B2BProcess />
      <B2BImpact />
      <B2BAdoption />
      <B2BContact />
      <B2BFooter />
    </div>
  );
};

export default EmpresasPage;
