import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CartItem } from '../types';

/* ── Thank-you audio from Cloudinary ── */
const GRACIAS_AUDIO_URL = 'https://res.cloudinary.com/djfmngyl0/video/upload/v1776611165/AI_Toolkit___Artlist_-_Google_Chrome_2026-04-19_09-59-40_online-audio-converter.com_vf3cze.mp3';
// Skip the first N seconds of silence/empty space at the start
const AUDIO_START_OFFSET = 2.2;

interface AndeanBasketToastProps {
  item: Omit<CartItem, 'qty'> | null;
  cartCount: number;
  cartTotal: number;
  producerName: string;
  onClose: () => void;
  onOpenCart: () => void;
}

const AndeanBasket = ({ filled, large }: { filled: boolean; large?: boolean }) => {
  const scale = large ? 1.7 : 1;
  const W = Math.round(120 * scale);
  const H = Math.round(90 * scale);
  const rimW = Math.round(124 * scale);
  const rimH = Math.round(22 * scale);
  const rimBottom = Math.round(82 * scale);
  const handleW = Math.round(32 * scale);
  const handleH = Math.round(28 * scale);
  const handleBottom = Math.round(96 * scale);
  const handleLeftL = Math.round(18 * scale);
  const handleRightR = Math.round(18 * scale);
  const llamaBottom = Math.round(28 * scale);
  const fringeBottom = Math.round(90 * scale);
  const fringeW = Math.round(110 * scale);
  const containerW = Math.round(144 * scale);
  const containerH = Math.round(144 * scale);

  return (
    <div className="relative flex-shrink-0 select-none" style={{ width: containerW, height: containerH }}>
      {/* Basket body */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-b-[50%] rounded-t-[20%] overflow-hidden"
        style={{ width: W, height: H }}
      >
        {['#8B2500','#D4622A','#E8A020','#F5C842','#2E7D32','#66BB6A','#1565C0','#42A5F5','#8B2500','#D4622A','#E8A020'].map((color, i) => (
          <div key={i} style={{ background: color, height: `${100 / 11}%`, width: '100%' }} />
        ))}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="grid grid-cols-5 gap-0.5">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-white rounded-sm opacity-60" />
            ))}
          </div>
        </div>
      </div>

      {/* Rim */}
      <div
        className="absolute rounded-full border-4 border-amber-800"
        style={{
          width: rimW, height: rimH,
          bottom: rimBottom,
          left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(180deg, #92400e 0%, #78350f 100%)',
        }}
      />

      {/* Handles */}
      <div className="absolute border-4 border-amber-700 rounded-full"
        style={{ width: handleW, height: handleH, bottom: handleBottom, left: handleLeftL, borderBottom: 'none', background: 'transparent' }}
      />
      <div className="absolute border-4 border-amber-700 rounded-full"
        style={{ width: handleW, height: handleH, bottom: handleBottom, right: handleRightR, borderBottom: 'none', background: 'transparent' }}
      />

      {/* Llama */}
      <div className="absolute select-none" style={{ bottom: llamaBottom, left: '50%', transform: 'translateX(-50%)', fontSize: large ? 28 : 18 }}>
        🦙
      </div>

      {/* Fringe */}
      <div className="absolute flex gap-0.5 justify-center" style={{ bottom: fringeBottom, left: '50%', transform: 'translateX(-50%)', width: fringeW }}>
        {['#E8A020','#2E7D32','#D4622A','#42A5F5','#F5C842','#8B2500','#66BB6A','#1565C0','#E8A020','#D4622A'].map((c, i) => (
          <div key={i} className="rounded-b-full" style={{ width: large ? 13 : 8, height: large ? (16 + (i % 3) * 6) : (10 + (i % 3) * 4), background: c, opacity: 0.9 }} />
        ))}
      </div>

      {/* Flying product */}
      {filled && (
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full bg-gold/80 flex items-center justify-center text-coffee-900 font-bold"
          style={{
            width: large ? 44 : 32,
            height: large ? 44 : 32,
            animation: 'flyIntoBasket 0.65s cubic-bezier(0.4,0,0.2,1) forwards',
          }}
        >
          <i className={`ri-cup-fill ${large ? 'text-xl' : 'text-sm'}`} />
        </div>
      )}
    </div>
  );
};

const AndeanBasketToast = ({ item, cartCount, cartTotal, producerName, onClose, onOpenCart }: AndeanBasketToastProps) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [showProduct, setShowProduct] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const t1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Preload audio on mount
  useEffect(() => {
    const audio = new Audio(GRACIAS_AUDIO_URL);
    audio.preload = 'auto';
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const triggerAudio = useCallback(() => {
    if (!voiceEnabled) return;
    t2Ref.current = setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      audio.currentTime = AUDIO_START_OFFSET;
      audio.volume = 0.92;
      audio.play().catch(() => {/* autoplay blocked */});
    }, 400);
  }, [voiceEnabled]);

  useEffect(() => {
    if (!item) return;
    setVisible(true);
    setShowProduct(false);
    if (t1Ref.current) clearTimeout(t1Ref.current);
    if (t2Ref.current) clearTimeout(t2Ref.current);
    t1Ref.current = setTimeout(() => {
      setShowProduct(true);
      triggerAudio();
    }, 100);
    return () => {
      if (t1Ref.current) clearTimeout(t1Ref.current);
      if (t2Ref.current) clearTimeout(t2Ref.current);
      audioRef.current?.pause();
    };
  }, [item, triggerAudio]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const getImpactKey = (total: number): string => {
    if (total < 25) return 'toast_impact_low';
    if (total < 60) return 'toast_impact_mid';
    if (total < 100) return 'toast_impact_high';
    return 'toast_impact_max';
  };

  const impactRaw = item ? t(getImpactKey(cartTotal), { name: producerName }) : '';

  const renderImpact = (text: string) =>
    text.split(/\*\*(.*?)\*\*/g).map((part, i) =>
      i % 2 === 1
        ? <strong key={i} className="text-gold font-semibold">{part}</strong>
        : <span key={i}>{part}</span>
    );

  if (!item) return null;

  return (
    <>
      <style>{`
        @keyframes flyIntoBasket {
          0%   { transform: translateX(-50%) translateY(-80px) scale(1.3); opacity: 1; }
          70%  { transform: translateX(-50%) translateY(40px) scale(0.6); opacity: 0.7; }
          100% { transform: translateX(-50%) translateY(80px) scale(0); opacity: 0; }
        }
        @keyframes modalIn {
          from { transform: translate(-50%, -50%) scale(0.92); opacity: 0; }
          to   { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
        @keyframes modalOut {
          from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          to   { transform: translate(-50%, -50%) scale(0.92); opacity: 0; }
        }
        @keyframes backdropIn  { from { opacity: 0; } to { opacity: 1; } }
        @keyframes backdropOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes basketBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25%      { transform: translateY(-10px) rotate(-3deg); }
          60%      { transform: translateY(-4px) rotate(2deg); }
        }
        @keyframes shimmerStripe {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 z-[60]"
        style={{
          background: 'rgba(10,6,2,0.65)',
          backdropFilter: 'blur(4px)',
          animation: visible ? 'backdropIn 0.3s ease forwards' : 'backdropOut 0.3s ease forwards',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      />

      {/* Modal — centered */}
      <div
        className="fixed z-[70]"
        style={{
          top: '50%', left: '50%',
          width: '100%', maxWidth: '680px',
          padding: '0 16px',
          animation: visible
            ? 'modalIn 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards'
            : 'modalOut 0.25s ease-in forwards',
          pointerEvents: visible ? 'auto' : 'none',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #1e1008 0%, #2d1a0a 50%, #1e1008 100%)',
            border: '1px solid rgba(201,169,110,0.3)',
          }}
        >
          {/* Andean stripe bar top */}
          <div className="h-2 w-full flex">
            {['#8B2500','#D4622A','#E8A020','#F5C842','#2E7D32','#66BB6A','#1565C0','#42A5F5','#8B2500','#D4622A','#E8A020','#F5C842','#2E7D32','#66BB6A'].map((c, i) => (
              <div key={i} className="flex-1" style={{ background: c }} />
            ))}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-7 pt-5 pb-3">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <span className="text-cream/90 font-sans text-sm tracking-[0.3em] uppercase font-bold">
                {t('toast_added')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* Voice toggle */}
              <button
                onClick={() => {
                  setVoiceEnabled(v => {
                    if (v) audioRef.current?.pause();
                    return !v;
                  });
                }}
                title={voiceEnabled ? 'Silenciar voz' : 'Activar voz'}
                className="w-8 h-8 flex items-center justify-center text-cream/40 hover:text-gold transition-colors cursor-pointer rounded-full hover:bg-white/5"
              >
                <i className={voiceEnabled ? 'ri-volume-up-line text-base' : 'ri-volume-mute-line text-base'} />
              </button>
              <button
                onClick={handleClose}
                className="w-9 h-9 flex items-center justify-center text-cream/50 hover:text-cream transition-colors cursor-pointer rounded-full hover:bg-white/8 border border-cream/10 hover:border-cream/30"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex items-center gap-6 px-7 pb-6">

            {/* Left: info */}
            <div className="flex-1 flex flex-col gap-4">

              {/* Product row */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-gold/25">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <p className="text-cream font-serif text-lg leading-tight">{item.name}</p>
                  <p className="text-gold font-sans text-base font-semibold mt-1">{item.priceLabel}</p>
                </div>
              </div>

              {/* Impact message */}
              <div
                className="rounded-2xl px-4 py-3.5 flex items-start gap-3"
                style={{ background: 'rgba(201,169,110,0.09)', border: '1px solid rgba(201,169,110,0.18)' }}
              >
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <i className="ri-seedling-line text-gold text-base" />
                </div>
                <p className="text-cream/80 font-sans text-sm leading-relaxed">
                  {renderImpact(impactRaw)}
                </p>
              </div>

              {/* Cart summary line */}
              <div className="flex items-center justify-between px-1">
                <span className="text-cream/40 font-sans text-sm">{t('toast_cart_summary')}</span>
                <span className="text-gold font-sans text-sm font-semibold">
                  {cartCount !== 1 ? t('toast_products_plural', { count: cartCount }) : t('toast_products', { count: cartCount })}
                </span>
              </div>

              <div className="h-px bg-gold/12 w-full" />

              {/* CTA button */}
              <button
                onClick={() => { handleClose(); onOpenCart(); }}
                className="relative w-full overflow-hidden flex items-center justify-center gap-2.5 rounded-2xl py-3.5 font-sans text-sm font-bold tracking-[0.18em] uppercase transition-all cursor-pointer whitespace-nowrap group"
                style={{ background: 'linear-gradient(135deg, #c9a96e, #d4a853)', color: '#1a0f05' }}
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  <i className="ri-shopping-basket-2-line text-base" />
                  {t('toast_cta', { total: cartTotal.toFixed(2) })}
                </span>
                <span className="absolute top-0 bottom-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </button>

              <p className="text-center text-cream/30 font-sans text-xs leading-relaxed">
                {t('toast_hint')}
              </p>
            </div>

            {/* Right: Andean basket */}
            <div
              className="flex flex-col items-center gap-2 flex-shrink-0"
              style={{ animation: showProduct ? 'basketBounce 0.8s ease-in-out' : 'none' }}
            >
              <AndeanBasket filled={showProduct} large />
              <span className="text-cream/30 font-sans text-[10px] tracking-[0.3em] uppercase mt-1">{t('toast_basket_label')}</span>
            </div>
          </div>

          {/* Andean stripe bar bottom */}
          <div className="h-1.5 w-full flex">
            {['#F5C842','#E8A020','#D4622A','#8B2500','#42A5F5','#1565C0','#66BB6A','#2E7D32','#F5C842','#E8A020','#D4622A','#8B2500','#42A5F5','#1565C0'].map((c, i) => (
              <div key={i} className="flex-1" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AndeanBasketToast;
