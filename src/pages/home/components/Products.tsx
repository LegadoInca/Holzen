import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { products } from '@/mocks/holzen';
import { CartItem } from '../types';

interface ProductsProps {
  onAddToCart: (item: Omit<CartItem, 'qty'>) => void;
}

const getStockLabel = (stock: number, t: (key: string, opts?: Record<string, unknown>) => string) => {
  if (stock === 1) return t('products_stock_last');
  if (stock <= 3) return t('products_stock_few', { n: stock });
  return t('products_stock_some', { n: stock });
};

/* ── Single product card ── */
interface CardProps {
  p: typeof products[0];
  isFlipped: boolean;
  onFlip: () => void;
  onUnflip: () => void;
  onAddToCart: ProductsProps['onAddToCart'];
  compact?: boolean;
  tapHint: string;
  stockLabel: string;
}

const ProductCard = ({ p, isFlipped, onFlip, onUnflip, onAddToCart, compact = false, tapHint, stockLabel }: CardProps) => {
  const h = compact ? 'h-[360px]' : 'h-[480px]';

  return (
    <div className={`relative rounded-xl overflow-hidden ${h} cursor-pointer flex-shrink-0 w-full`}>
      {/* Stock badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-sans font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full animate-pulse shadow-lg whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
        {stockLabel}
      </div>

      {/* Tag badge */}
      <div className="absolute top-3 right-3 z-20">
        <span className="text-[10px] tracking-widest uppercase text-gold font-sans border border-gold/50 bg-coffee-900/60 backdrop-blur-sm px-2.5 py-1 rounded-full whitespace-nowrap">
          {p.tag}
        </span>
      </div>

      {/* FRONT */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={onFlip}
      >
        <img src={p.image} alt={p.overlayName} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/90 via-coffee-900/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="font-serif text-lg text-cream leading-tight mb-1">{p.overlayName}</div>
          <div className="text-cream/50 text-xs font-sans mb-2">{p.overlayOrigin}</div>
          <div className="flex flex-wrap gap-1 mb-3">
            {p.notes.split(' · ').map((note) => (
              <span key={note} className="text-[10px] text-gold/80 border border-gold/20 px-2 py-0.5 rounded-full font-sans">
                {note}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gold font-sans text-sm font-semibold">{p.overlayPrice}</span>
            <span className="text-cream/40 text-[10px] font-sans uppercase tracking-widest">{tapHint}</span>
          </div>
        </div>
      </div>

      {/* BACK */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 flex flex-col ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onUnflip}
      >
        <div className="relative h-[52%] flex-shrink-0">
          <img src={p.producer.image} alt={p.producer.name} className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-coffee-900" />
        </div>
        <div className="flex-1 bg-coffee-900 px-5 pt-3 pb-4 flex flex-col justify-between overflow-hidden">
          <div className="flex flex-col overflow-hidden">
            <div className="font-serif text-sm text-cream mb-0.5">{p.producer.name}</div>
            <div className="text-gold/70 text-[10px] font-sans tracking-widest uppercase mb-2">{p.producer.location}</div>
            {p.producer.storyTitle && (
              <p className="text-gold font-serif text-xs italic mb-1.5">{p.producer.storyTitle}</p>
            )}
            <div className="overflow-y-auto flex-1 pr-1 scrollbar-thin">
              <p className="text-cream/60 text-xs font-sans leading-relaxed">{p.producer.story}</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart({ id: p.id, name: p.detailName, priceLabel: p.priceLabel, priceNum: p.priceNum, image: p.image });
              onUnflip();
            }}
            className="relative mt-3 w-full overflow-hidden bg-gold hover:bg-amber-400 text-coffee-900 font-sans font-bold py-2.5 rounded-full text-xs tracking-[0.2em] uppercase transition-colors cursor-pointer whitespace-nowrap group"
          >
            <span className="relative z-10">{p.ctaLabel}</span>
            <span className="absolute top-0 bottom-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main section ── */
const Products = ({ onAddToCart }: ProductsProps) => {
  const { t } = useTranslation();
  const [showProducer, setShowProducer] = useState<string | null>(null);
  const [mobileIdx, setMobileIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) setMobileIdx((i) => Math.min(i + 1, products.length - 1));
      else setMobileIdx((i) => Math.max(i - 1, 0));
    }
    touchStartX.current = null;
  };

  const tapHint = t('products_tap_hint');

  return (
    <section id="products" className="relative py-16 md:py-20 px-4 md:px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://res.cloudinary.com/djfmngyl0/image/upload/v1776583647/search-image_39_rchtpi.jpg"
          alt="background"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-coffee-900/60" />
        <div className="absolute inset-0 bg-amber-900/20" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 md:mb-14">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-3">{t('products_eyebrow')}</p>
          <h2 className="font-serif text-3xl md:text-5xl text-cream leading-tight mb-3 font-bold">
            {t('products_title_line1')}<br /><em className="text-gold italic">{t('products_title_line2')}</em>
          </h2>
          <p className="text-cream/60 font-sans text-sm max-w-lg leading-relaxed">
            {t('products_desc')}
          </p>
        </div>

        {/* DESKTOP grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              p={p}
              isFlipped={showProducer === p.id}
              onFlip={() => setShowProducer(p.id)}
              onUnflip={() => setShowProducer(null)}
              onAddToCart={onAddToCart}
              tapHint={tapHint}
              stockLabel={getStockLabel(p.stock, t)}
            />
          ))}
        </div>

        {/* MOBILE swipeable single card */}
        <div className="sm:hidden">
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <ProductCard
              key={products[mobileIdx].id}
              p={products[mobileIdx]}
              isFlipped={showProducer === products[mobileIdx].id}
              onFlip={() => setShowProducer(products[mobileIdx].id)}
              onUnflip={() => setShowProducer(null)}
              onAddToCart={onAddToCart}
              compact
              tapHint={tapHint}
              stockLabel={getStockLabel(products[mobileIdx].stock, t)}
            />
          </div>

          {/* Mobile nav */}
          <div className="flex items-center justify-between mt-5 px-1">
            <button
              onClick={() => { setShowProducer(null); setMobileIdx((i) => Math.max(i - 1, 0)); }}
              disabled={mobileIdx === 0}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-cream/20 text-cream/50 disabled:opacity-20 cursor-pointer"
            >
              <i className="ri-arrow-left-s-line text-lg" />
            </button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {products.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setShowProducer(null); setMobileIdx(i); }}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === mobileIdx ? 'w-5 h-2 bg-gold' : 'w-2 h-2 bg-cream/25'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => { setShowProducer(null); setMobileIdx((i) => Math.min(i + 1, products.length - 1)); }}
              disabled={mobileIdx === products.length - 1}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-cream/20 text-cream/50 disabled:opacity-20 cursor-pointer"
            >
              <i className="ri-arrow-right-s-line text-lg" />
            </button>
          </div>

          <p className="text-center text-cream/30 text-[10px] font-sans mt-3 tracking-widest">
            {t('products_mobile_counter', { current: mobileIdx + 1, total: products.length })}
          </p>
        </div>

        {/* Footer note */}
        <p className="text-center text-cream/30 text-xs font-sans mt-8 tracking-widest uppercase hidden sm:block">
          {t('products_footer_note')}
        </p>
      </div>
    </section>
  );
};

export default Products;
