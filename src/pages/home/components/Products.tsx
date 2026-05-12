import { useState, useCallback, useRef } from 'react';
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

export default function Products({ onAddToCart }: ProductsProps) {
  const { t } = useTranslation();
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [mobileIdx, setMobileIdx] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const toggleFlip = (id: string) => {
    setFlipped((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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

  const handleAdd = useCallback((p: typeof products[0]) => {
    onAddToCart({
      id: p.id,
      name: p.detailName,
      priceLabel: p.priceLabel,
      priceNum: p.priceNum,
      image: p.image,
    });
  }, [onAddToCart]);

  const ProductCard = ({ product, height = 'h-[520px]' }: { product: typeof products[0]; height?: string }) => {
    const isFlipped = flipped[product.id];
    return (
      <div className={`relative rounded-xl overflow-hidden ${height} flex-shrink-0 w-full`}>
        {/* Front: Product */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          {/* Product image */}
          <img
            alt={product.overlayName}
            className="w-full h-full object-cover object-top bg-stone-800"
            src={product.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coffee-900/50 via-coffee-900/5 to-transparent" />

          {/* Stock badge + Stars */}
          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
            <div className="flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-sans font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full animate-pulse shadow-lg whitespace-nowrap">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
              {getStockLabel(product.stock, t)}
            </div>
            <div className="flex items-center gap-1 bg-coffee-900/70 backdrop-blur-sm border border-gold/40 px-2 py-1 rounded-full">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i key={star} className={`ri-star-${star <= Math.round(product.rating) ? 'fill' : 'line'} text-gold text-[10px]`} />
                ))}
              </div>
              <span className="text-cream/80 text-[9px] font-sans ml-1">({product.rating.toFixed(1)})</span>
            </div>
          </div>

          {/* Farmer avatar circle - top right */}
          <div className="absolute top-3 right-3 z-20 flex flex-col items-end">
            <span className="text-[9px] tracking-[0.14em] uppercase text-coffee-900 font-sans font-bold mb-1.5 bg-gold px-2.5 py-1 rounded-full whitespace-nowrap border border-gold shadow-lg shadow-gold/40 animate-pulse">
              Haz click aquí
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFlip(product.id);
              }}
              className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gold shadow-lg shadow-gold/40 cursor-pointer hover:scale-105 transition-transform"
            >
              <img
                alt={product.producer.name}
                className="w-full h-full object-cover object-top bg-stone-800"
                src={product.producer.image}
              />
              <span className="absolute inset-0 rounded-full border border-gold animate-ping" />
            </button>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {product.notes.split(' · ').map((note) => (
                <span key={note} className="text-[10px] text-gold/80 border border-gold/20 bg-coffee-900/40 backdrop-blur-sm px-2 py-0.5 rounded-full font-sans">
                  {note}
                </span>
              ))}
            </div>
            <div className="font-serif text-lg text-cream leading-tight mb-1">{product.overlayName}</div>
            <div className="text-cream/50 text-xs font-sans mb-3">{product.overlayOrigin}</div>

            {/* Orange CTA - {product.ctaLabel} */}
            <button
              onClick={(e) => { e.stopPropagation(); handleAdd(product); }}
              className="relative w-full overflow-hidden bg-[#F97316] hover:bg-orange-500 text-white font-sans font-bold py-2.5 rounded-full text-[10px] tracking-[0.15em] uppercase transition-colors cursor-pointer whitespace-nowrap shadow-lg shadow-orange-900/30"
            >
              <span className="relative z-10">{product.ctaLabel}</span>
              <span className="absolute top-0 bottom-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </button>
          </div>
        </div>

        {/* Back: Farmer story */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          {/* Farmer image */}
          <img
            alt={product.producer.name}
            className="w-full h-full object-cover object-top bg-stone-800"
            src={product.producer.image}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

          {/* Close button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFlip(product.id);
            }}
            className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white/80 hover:bg-black/60 transition-colors cursor-pointer"
          >
            <i className="ri-close-line text-lg" />
          </button>

          {/* Bottom story panel */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-md p-5">
            <div className="mb-0.5">
              <h3 className="font-serif text-base text-cream leading-tight">{product.producer.name}</h3>
              <p className="text-gold/70 text-[10px] font-sans tracking-widest uppercase">{product.producer.location}</p>
            </div>
            <p className="text-gold font-serif text-xs italic mb-1.5">{product.producer.storyTitle}</p>
            <div className="max-h-[100px] overflow-y-auto pr-1 mb-3">
              <p className="text-cream/70 text-xs font-sans leading-relaxed">{product.producer.story}</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); handleAdd(product); }}
              className="relative w-full overflow-hidden bg-[#F97316] hover:bg-orange-500 text-white font-sans font-bold py-2.5 rounded-full text-[10px] tracking-[0.15em] uppercase transition-colors cursor-pointer whitespace-nowrap shadow-lg shadow-orange-900/30"
            >
              <span className="relative z-10">{product.ctaLabel}</span>
              <span className="absolute top-0 bottom-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="products" className="relative py-16 md:py-20 px-4 md:px-6 overflow-hidden" data-product-shop>
      <div className="absolute inset-0">
        <img
          alt="background"
          className="w-full h-full object-cover object-center"
          src="/Holzen/images/products-bg.jpeg"
        />
        <div className="absolute inset-0 bg-coffee-900/60"></div>
        <div className="absolute inset-0 bg-amber-900/20"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="mb-10 md:mb-14">
          <p className="text-gold text-xs tracking-[0.4em] uppercase font-sans mb-3">{t('products_eyebrow')}</p>
          <h2 className="font-serif text-3xl md:text-5xl text-cream leading-tight mb-3 font-bold">{t('products_title_line1')}<br /><em className="text-gold italic">{t('products_title_line2')}</em></h2>
          <p className="text-cream/60 font-sans text-sm max-w-lg leading-relaxed">{t('products_desc')}</p>
        </div>

        {/* Desktop grid */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="sm:hidden">
          <ProductCard product={products[mobileIdx]} height="h-[420px]" />
          <div className="flex items-center justify-between mt-5 px-1">
            <button
              disabled={mobileIdx === 0}
              onClick={() => setMobileIdx((p) => Math.max(0, p - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-cream/20 text-cream/50 disabled:opacity-20 cursor-pointer"
            >
              <i className="ri-arrow-left-s-line text-lg"></i>
            </button>
            <div className="flex gap-1.5">
              {products.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setMobileIdx(idx)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    idx === mobileIdx ? 'w-6 h-3 bg-gold' : 'w-3 h-3 bg-cream/25'
                  }`}
                />
              ))}
            </div>
            <button
              disabled={mobileIdx === products.length - 1}
              onClick={() => setMobileIdx((p) => Math.min(products.length - 1, p + 1))}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-cream/20 text-cream/50 disabled:opacity-20 cursor-pointer"
            >
              <i className="ri-arrow-right-s-line text-lg"></i>
            </button>
          </div>
          <p className="text-center text-cream/30 text-[10px] font-sans mt-3 tracking-widest">
            {t('products_mobile_counter', { current: mobileIdx + 1, total: products.length })}
          </p>
        </div>

        <p className="text-center text-cream/30 text-xs font-sans mt-8 tracking-widest uppercase hidden sm:block">
          {t('products_footer_note')}
        </p>
      </div>
    </section>
    );
}
