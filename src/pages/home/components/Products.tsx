import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { products } from '@/mocks/holzen';
import { CartItem } from '../types';

interface ProductsProps {
  onAddToCart: (item: Omit<CartItem, 'qty'>) => void;
}

const INK = '#0D0D0C';
const GREEN = '#26E237'; // el verde de Holzen
const VISIBLE_COUNT = 4; // por ahora mostramos solo 4 productos
const sans = "'Inter', system-ui, sans-serif";

const getStockLabel = (stock: number, t: (key: string, opts?: Record<string, unknown>) => string) => {
  if (stock === 1) return t('products_stock_last');
  if (stock <= 3) return t('products_stock_few', { n: stock });
  return t('products_stock_some', { n: stock });
};

export default function Products({ onAddToCart }: ProductsProps) {
  const { t } = useTranslation();
  const shown = products.slice(0, VISIBLE_COUNT);
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
      if (diff > 0) setMobileIdx((i) => Math.min(i + 1, shown.length - 1));
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

  // Tarjeta: foto redondeada (alturas alternadas) + texto debajo, como la referencia
  const renderCard = (product: typeof products[0], idx: number, mobile = false) => {
    const isFlipped = flipped[product.id];
    const tall = mobile ? true : idx % 2 === 0;
    const ratio = mobile ? '4 / 5' : tall ? '2 / 3' : '1 / 1.05';

    return (
      <article key={product.id} className="w-full">
        <div
          className="relative overflow-hidden rounded-2xl"
          style={{ aspectRatio: ratio, background: '#d9d6cc' }}
          onTouchStart={mobile ? handleTouchStart : undefined}
          onTouchEnd={mobile ? handleTouchEnd : undefined}
        >
          {/* Frente: producto */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <img alt={product.overlayName} className="w-full h-full object-cover object-top" src={product.image} />
            <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-transparent" />

            {/* Stock + estrellas */}
            <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
              <div className="flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-sans font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full animate-pulse shadow-lg whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
                {getStockLabel(product.stock, t)}
              </div>
              <div className="flex items-center gap-1 bg-black/55 backdrop-blur-sm px-2 py-1 rounded-full">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className={`ri-star-${star <= Math.round(product.rating) ? 'fill' : 'line'} text-[10px]`} style={{ color: '#F5C84B' }} />
                  ))}
                </div>
                <span className="text-white/85 text-[9px] font-sans ml-1">({product.rating.toFixed(1)})</span>
              </div>
            </div>

            {/* Avatar del productor */}
            <div className="absolute top-3 right-3 z-20 flex flex-col items-end">
              <span
                className="text-[8px] tracking-[0.14em] uppercase font-sans font-bold mb-1.5 px-2.5 py-1 rounded-full whitespace-nowrap shadow-lg animate-pulse"
                style={{ background: GREEN, color: INK }}
              >
                Haz click aquí
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFlip(product.id);
                }}
                className="relative w-16 h-16 rounded-full overflow-hidden border-2 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                style={{ borderColor: GREEN }}
              >
                <img alt={product.producer.name} className="w-full h-full object-cover object-top bg-stone-800" src={product.producer.image} />
                <span className="absolute inset-0 rounded-full border animate-ping" style={{ borderColor: GREEN }} />
              </button>
            </div>
          </div>

          {/* Reverso: historia del productor */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <img alt={product.producer.name} className="w-full h-full object-cover object-top bg-stone-800" src={product.producer.image} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/5 to-transparent" />

            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFlip(product.id);
              }}
              className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-black/45 text-white/85 hover:bg-black/65 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-lg" />
            </button>

            <div className={`absolute bottom-0 left-0 right-0 bg-black/55 backdrop-blur-md ${tall ? 'p-4' : 'p-3'}`}>
              <div className="mb-0.5">
                <h3 className="text-sm text-white leading-tight" style={{ fontFamily: sans, fontWeight: 700 }}>{product.producer.name}</h3>
                <p className="text-white/60 text-[9px] font-sans tracking-widest uppercase">{product.producer.location}</p>
              </div>
              <p className={`${tall ? 'text-xs mb-1.5' : 'text-[11px] mb-1'} italic`} style={{ fontFamily: sans, color: '#BBDA1F' }}>{product.producer.storyTitle}</p>
              <div className={`${tall ? 'max-h-[110px] mb-3' : 'max-h-[52px] mb-2'} overflow-y-auto pr-1`}>
                <p className={`text-white/75 ${tall ? 'text-[11px]' : 'text-[10px]'} font-sans leading-relaxed`}>{product.producer.story}</p>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleAdd(product); }}
                className={`relative w-full overflow-hidden font-sans font-bold ${tall ? 'py-2.5' : 'py-2'} rounded-full text-[10px] tracking-[0.15em] uppercase transition-transform hover:-translate-y-0.5 cursor-pointer whitespace-nowrap`}
                style={{ background: GREEN, color: INK }}
              >
                <span className="relative z-10">{product.ctaLabel}</span>
                <span className="absolute top-0 bottom-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/45 to-transparent" />
              </button>
            </div>
          </div>
        </div>

        {/* Texto debajo de la foto */}
        <div className="mt-4">
          <h3
            className="text-lg md:text-[19px] leading-tight"
            style={{ fontFamily: sans, fontWeight: 700, letterSpacing: '-0.02em', color: INK }}
          >
            {product.overlayName}
          </h3>
          <p className="mt-1 text-xs font-sans" style={{ color: 'rgba(13,13,12,0.55)' }}>{product.overlayOrigin}</p>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {product.notes.split(' · ').map((note) => (
              <span
                key={note}
                className="text-[10px] font-sans px-2 py-0.5 rounded-full"
                style={{ color: 'rgba(13,13,12,0.65)', border: '1px solid rgba(13,13,12,0.16)' }}
              >
                {note}
              </span>
            ))}
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); handleAdd(product); }}
            className="mt-4 inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase cursor-pointer hover:opacity-60 transition-opacity whitespace-nowrap"
            style={{ fontFamily: sans, fontWeight: 700, color: INK, textDecoration: 'underline', textUnderlineOffset: '5px', textDecorationThickness: '2px' }}
          >
            {product.ctaLabel}
            <i className="ri-arrow-right-up-line text-sm" />
          </button>
        </div>
      </article>
    );
  };

  return (
    <section
      id="products"
      className="relative py-14 md:py-20 px-4 md:px-6 overflow-hidden"
      style={{ background: '#F7F4EA', borderTop: '1px solid rgba(13,13,12,0.08)' }}
      data-product-shop
    >
      <div className="relative max-w-6xl mx-auto">
        {/* Encabezado: título + pastilla a la izquierda, descripción a la derecha */}
        <div className="grid md:grid-cols-[1.25fr_1fr] gap-6 md:gap-14 items-start mb-10 md:mb-14">
          <div>
            <h2
              className="text-4xl md:text-6xl"
              style={{ fontFamily: sans, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.03, color: INK }}
            >
              {t('products_title_line1')}
              <br />
              <em className="italic" style={{ fontWeight: 500 }}>{t('products_title_line2')}</em>
            </h2>
            <span
              className="inline-flex items-center gap-2.5 mt-6 rounded-full px-5 py-2.5 text-sm font-medium cursor-default select-none"
              style={{ background: INK, color: '#fff', fontFamily: sans }}
            >
              {t('products_eyebrow')}
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white/85 inline-flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-white" />
              </span>
            </span>
          </div>
          <p
            className="text-sm md:text-[15px] leading-relaxed max-w-md md:pt-2"
            style={{ fontFamily: sans, color: 'rgba(13,13,12,0.72)' }}
          >
            {t('products_desc')}
          </p>
        </div>

        {/* Escritorio: 4 tarjetas con alturas alternadas */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 items-start">
          {shown.map((product, idx) => renderCard(product, idx))}
        </div>

        {/* Móvil: carrusel */}
        <div className="sm:hidden">
          {renderCard(shown[mobileIdx], mobileIdx, true)}
          <div className="flex items-center justify-between mt-6 px-1">
            <button
              disabled={mobileIdx === 0}
              onClick={() => setMobileIdx((p) => Math.max(0, p - 1))}
              className="w-9 h-9 flex items-center justify-center rounded-full disabled:opacity-25 cursor-pointer"
              style={{ border: '1px solid rgba(13,13,12,0.25)', color: INK }}
            >
              <i className="ri-arrow-left-s-line text-lg"></i>
            </button>
            <div className="flex gap-1.5">
              {shown.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setMobileIdx(idx)}
                  className="rounded-full transition-all duration-300 cursor-pointer"
                  style={{
                    width: idx === mobileIdx ? 24 : 10,
                    height: 10,
                    background: idx === mobileIdx ? INK : 'rgba(13,13,12,0.2)',
                  }}
                />
              ))}
            </div>
            <button
              disabled={mobileIdx === shown.length - 1}
              onClick={() => setMobileIdx((p) => Math.min(shown.length - 1, p + 1))}
              className="w-9 h-9 flex items-center justify-center rounded-full disabled:opacity-25 cursor-pointer"
              style={{ border: '1px solid rgba(13,13,12,0.25)', color: INK }}
            >
              <i className="ri-arrow-right-s-line text-lg"></i>
            </button>
          </div>
          <p className="text-center text-[10px] font-sans mt-3 tracking-widest" style={{ color: 'rgba(13,13,12,0.4)' }}>
            {t('products_mobile_counter', { current: mobileIdx + 1, total: shown.length })}
          </p>
        </div>

        <p className="text-center text-xs font-sans mt-12 tracking-widest uppercase hidden sm:block" style={{ color: 'rgba(13,13,12,0.4)' }}>
          {t('products_footer_note')}
        </p>
      </div>
    </section>
  );
}
