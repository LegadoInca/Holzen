import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CookieBar = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookies')) setVisible(true);
  }, []);

  const accept = () => { localStorage.setItem('cookies', 'ok'); setVisible(false); };
  const dismiss = () => setVisible(false);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-coffee-800 border-t border-gold/10 px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-cream/70 text-xs font-sans">{t('cookie_text')}</p>
        <div className="flex gap-3 flex-shrink-0">
          <button onClick={accept} className="bg-gold hover:bg-gold-light text-coffee-900 text-xs font-sans font-semibold px-5 py-2 rounded-full transition-colors cursor-pointer whitespace-nowrap">{t('cookie_accept')}</button>
          <button onClick={dismiss} className="border border-cream/20 hover:border-cream/50 text-cream/60 hover:text-cream text-xs font-sans px-5 py-2 rounded-full transition-colors cursor-pointer whitespace-nowrap">{t('cookie_essential')}</button>
        </div>
      </div>
    </div>
  );
};

export default CookieBar;
