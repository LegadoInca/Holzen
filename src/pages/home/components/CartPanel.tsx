import { useTranslation } from 'react-i18next';
import { CartItem } from '../types';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onQtyChange: (id: string, delta: number) => void;
}

const CartPanel = ({ isOpen, onClose, items, onRemove, onQtyChange }: CartPanelProps) => {
  const { t } = useTranslation();
  const total = items.reduce((acc, i) => acc + i.priceNum * i.qty, 0);

  const sendWhatsApp = () => {
    const lines = items.map((i) => `• ${i.name} x${i.qty} (${i.priceLabel})`).join('\n');
    const text = t('cart_whatsapp_message', { lines, total: total.toFixed(2) });
    window.open(`https://wa.me/51XXXXXXXXX?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-50 bg-black/60 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-coffee-800 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gold/10">
          <h2 className="font-serif text-xl text-cream">{t('cart_title')}</h2>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center cursor-pointer text-cream/60 hover:text-cream transition-colors"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-cream/40">
              <i className="ri-shopping-basket-2-line text-5xl" />
              <p className="text-sm text-center font-sans whitespace-pre-line">
                {t('cart_empty_text')}
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 items-center bg-coffee-700/40 rounded-lg p-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-cream text-sm font-medium font-serif truncate">{item.name}</p>
                    <p className="text-gold text-xs font-sans mt-0.5">{item.priceLabel}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => onQtyChange(item.id, -1)} className="w-6 h-6 flex items-center justify-center border border-gold/30 text-gold rounded cursor-pointer hover:bg-gold/10 text-sm">–</button>
                      <span className="text-cream text-sm w-4 text-center">{item.qty}</span>
                      <button onClick={() => onQtyChange(item.id, 1)} className="w-6 h-6 flex items-center justify-center border border-gold/30 text-gold rounded cursor-pointer hover:bg-gold/10 text-sm">+</button>
                    </div>
                  </div>
                  <button onClick={() => onRemove(item.id)} className="w-7 h-7 flex items-center justify-center cursor-pointer text-cream/30 hover:text-cream/70 transition-colors">
                    <i className="ri-delete-bin-line text-sm" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-gold/10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-cream/70 text-sm font-sans">{t('cart_total')}</span>
              <span className="text-gold font-serif text-lg">${total.toFixed(2)}</span>
            </div>
            <button
              onClick={sendWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white py-3 rounded-full font-sans text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              <i className="ri-whatsapp-line text-lg" />
              {t('cart_whatsapp_btn')}
            </button>
            <p className="text-cream/40 text-xs text-center mt-3 font-sans leading-relaxed">
              {t('cart_whatsapp_note')}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPanel;
