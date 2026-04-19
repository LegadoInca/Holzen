import { useTranslation } from 'react-i18next';

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const SiteFooter = () => {
  const { t } = useTranslation();

  const companyLinks = [
    { l: t('footer_philosophy'), id: 'manifesto' },
    { l: t('footer_farmers'), id: 'farmers' },
    { l: t('footer_process'), id: 'process' },
    { l: t('footer_contact'), id: 'contact' },
  ];

  const productNames = [t('footer_product_1'), t('footer_product_2'), t('footer_product_3')];

  return (
    <footer className="bg-coffee-950 pt-16 pb-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-gold/10">
        <div>
          <div className="font-serif text-xl font-bold tracking-[0.2em] text-cream uppercase">HOLZEN</div>
          <div className="text-[10px] tracking-[0.15em] text-gold font-sans mb-4">by Legado Inca</div>
          <p className="text-cream/50 text-xs font-sans leading-relaxed whitespace-pre-line">{t('footer_tagline')}</p>
        </div>
        <div>
          <h5 className="text-cream/80 text-xs tracking-widest uppercase font-sans mb-4">{t('footer_products')}</h5>
          <ul className="space-y-2">
            {productNames.map(n => (
              <li key={n}>
                <button onClick={() => scrollTo('products')} className="text-cream/50 hover:text-gold text-xs font-sans transition-colors cursor-pointer">{n}</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-cream/80 text-xs tracking-widest uppercase font-sans mb-4">{t('footer_company')}</h5>
          <ul className="space-y-2">
            {companyLinks.map(i => (
              <li key={i.id}>
                <button onClick={() => scrollTo(i.id)} className="text-cream/50 hover:text-gold text-xs font-sans transition-colors cursor-pointer">{i.l}</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
        <p className="text-cream/30 text-xs font-sans">{t('footer_copyright')}</p>
        <a href="https://wa.me/51XXXXXXXXX" target="_blank" rel="noopener noreferrer nofollow" className="flex items-center gap-2 text-cream/40 hover:text-gold text-xs font-sans transition-colors">
          <i className="ri-whatsapp-line" /> WhatsApp
        </a>
      </div>
    </footer>
  );
};

export default SiteFooter;
