import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
}

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'cs', label: 'Čeština', flag: '🇨🇿' },
];

const INK = '#0D0D0C';
const LIME = '#BBDA1F';
const PAPER = '#F7F4EA';
const LOGO = '/Holzen/images/holzen-logo.png';
const WA_LINK = 'https://wa.me/51XXXXXXXXX?text=Hola,%20me%20interesa%20el%20café%20HOLZEN';

const Navbar = ({ cartCount, onCartOpen }: NavbarProps) => {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [mobOpen, setMobOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
      if (mobileLangRef.current && !mobileLangRef.current.contains(e.target as Node)) {
        setMobileLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const links = [
    { key: 'manifesto', label: t('nav_philosophy') },
    { key: 'products', label: t('nav_catalog') },
    { key: 'farmers', label: t('nav_farmers') },
    { key: 'process', label: t('nav_process') },
    { key: 'contact', label: t('nav_contact') },
  ];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setLangOpen(false);
    setMobileLangOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-shadow duration-300"
        style={{
          background: 'rgba(247,244,234,0.96)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(13,13,12,0.08)',
          boxShadow: scrolled ? '0 8px 24px rgba(13,13,12,0.07)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="cursor-pointer flex-shrink-0"
            aria-label="Holzen coffee"
          >
            <img src={LOGO} alt="Holzen coffee" className="h-9 md:h-10 w-auto block" />
          </button>

          {/* Links centrados */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {links.map((l) => (
              <li key={l.key}>
                <button
                  onClick={() => scrollTo(l.key)}
                  className="hover:opacity-55 transition-opacity text-[13px] lg:text-sm font-medium cursor-pointer whitespace-nowrap"
                  style={{ color: INK, fontFamily: "'Inter', system-ui, sans-serif" }}
                >
                  {l.label}
                </button>
              </li>
            ))}
            <li>
              <Link
                to="/empresas"
                className="flex items-center gap-1.5 text-[13px] lg:text-sm font-medium whitespace-nowrap px-4 py-1.5 rounded-full transition-all duration-200 hover:!bg-[#0D0D0C] hover:!text-white"
                style={{ color: INK, border: `1px solid ${INK}`, fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                <i className="ri-building-2-line text-sm" />
                Empresas
              </Link>
            </li>
            <li className="flex items-center gap-2 animate-flag-float">
              <img
                src="https://flagcdn.com/w40/pe.png"
                alt="Peru"
                className="w-9 h-6 rounded-sm object-cover shadow-sm"
              />
              <img
                src="https://flagcdn.com/w40/cz.png"
                alt="Czech Republic"
                className="w-9 h-6 rounded-sm object-cover shadow-sm"
              />
            </li>
          </ul>

          <div className="flex items-center gap-3">
            {/* Selector de idioma — desktop */}
            <div ref={langRef} className="relative hidden md:block">
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-1.5 hover:border-black transition-colors text-xs tracking-widest uppercase font-semibold px-3 py-1.5 rounded-full cursor-pointer whitespace-nowrap"
                style={{ color: INK, border: '1px solid rgba(13,13,12,0.25)', fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                <span>{currentLang.flag}</span>
                <span>{currentLang.code.toUpperCase()}</span>
                <i className={`ri-arrow-down-s-line text-sm transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>

              {langOpen && (
                <div
                  className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden min-w-[150px]"
                  style={{ background: '#fff', border: '1px solid rgba(13,13,12,0.10)', boxShadow: '0 12px 32px rgba(13,13,12,0.14)' }}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs tracking-wide hover:bg-[#BBDA1F]/25 transition-colors cursor-pointer whitespace-nowrap text-left"
                      style={{
                        color: INK,
                        fontWeight: lang.code === i18n.language ? 700 : 400,
                        fontFamily: "'Inter', system-ui, sans-serif",
                      }}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                      {lang.code === i18n.language && <i className="ri-check-line ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Banderas — móvil, siempre visibles */}
            <div className="md:hidden flex items-center gap-1.5 animate-flag-float">
              <img
                src="https://flagcdn.com/w40/pe.png"
                alt="Peru"
                className="w-6 h-4 rounded-sm object-cover shadow-sm"
              />
              <img
                src="https://flagcdn.com/w40/cz.png"
                alt="Czech Republic"
                className="w-6 h-4 rounded-sm object-cover shadow-sm"
              />
            </div>

            {/* Selector de idioma — móvil */}
            <div ref={mobileLangRef} className="relative md:hidden">
              <button
                onClick={() => setMobileLangOpen((v) => !v)}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap"
                style={{ color: INK, border: '1px solid rgba(13,13,12,0.25)', fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                <span className="text-sm">{currentLang.flag}</span>
                <span className="tracking-widest uppercase font-semibold">{currentLang.code.toUpperCase()}</span>
                <i className={`ri-arrow-down-s-line text-sm transition-transform duration-200 ${mobileLangOpen ? 'rotate-180' : ''}`} />
              </button>

              {mobileLangOpen && (
                <div
                  className="absolute right-0 top-full mt-2 rounded-xl overflow-hidden z-[60]"
                  style={{ minWidth: 140, background: '#fff', border: '1px solid rgba(13,13,12,0.10)', boxShadow: '0 12px 32px rgba(13,13,12,0.14)' }}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-xs tracking-wide hover:bg-[#BBDA1F]/25 transition-colors cursor-pointer whitespace-nowrap text-left"
                      style={{
                        color: INK,
                        fontWeight: lang.code === i18n.language ? 700 : 400,
                        fontFamily: "'Inter', system-ui, sans-serif",
                      }}
                    >
                      <span>{lang.flag}</span>
                      <span className="uppercase tracking-widest">{lang.code.toUpperCase()}</span>
                      {lang.code === i18n.language && <i className="ri-check-line ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp — pastilla negra (como el "Sign Up" de la referencia) */}
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="hidden md:flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-full whitespace-nowrap transition-colors duration-200 hover:!bg-[#BBDA1F] hover:!text-[#0D0D0C]"
              style={{ background: INK, color: '#fff', fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              <i className="ri-whatsapp-line" />
              WhatsApp
            </a>

            <button
              onClick={onCartOpen}
              className="relative w-9 h-9 flex items-center justify-center cursor-pointer"
              aria-label="Carrito"
            >
              <i className="ri-shopping-bag-line text-xl" style={{ color: INK }} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center"
                  style={{ background: LIME, color: INK }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            <button
              className="md:hidden w-9 h-9 flex items-center justify-center cursor-pointer"
              onClick={() => setMobOpen(true)}
              aria-label="Menú"
            >
              <i className="ri-menu-line text-xl" style={{ color: INK }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Menú móvil */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 md:hidden ${
          mobOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobOpen(false)} />
        <div
          className={`absolute top-0 right-0 w-72 h-full transition-transform duration-300 ${
            mobOpen ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col p-8`}
          style={{ background: PAPER }}
        >
          <button
            onClick={() => setMobOpen(false)}
            className="self-end mb-8 w-9 h-9 flex items-center justify-center cursor-pointer"
            aria-label="Cerrar"
          >
            <i className="ri-close-line text-2xl" style={{ color: INK }} />
          </button>

          <div className="flex flex-col gap-6">
            {links.map((l) => (
              <button
                key={l.key}
                onClick={() => {
                  scrollTo(l.key);
                  setMobOpen(false);
                }}
                className="text-left hover:opacity-55 transition-opacity text-base font-medium cursor-pointer"
                style={{ color: INK, fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {l.label}
              </button>
            ))}
            <Link
              to="/empresas"
              onClick={() => setMobOpen(false)}
              className="flex items-center gap-2 font-semibold text-base"
              style={{ color: INK, fontFamily: "'Inter', system-ui, sans-serif" }}
            >
              <i className="ri-building-2-line" />
              Empresas
            </Link>
          </div>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="mt-auto flex items-center justify-center gap-2 text-sm font-semibold px-4 py-3 rounded-full"
            style={{ background: INK, color: '#fff', fontFamily: "'Inter', system-ui, sans-serif" }}
          >
            <i className="ri-whatsapp-line" />
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
};

export default Navbar;
