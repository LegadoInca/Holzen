import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CartItem } from '../types';

const GRACIAS_AUDIO_URL = '/Holzen/gracias.mp3';
const AUDIO_START_OFFSET = 2.2;

interface AndeanBasketToastProps {
  item: Omit<CartItem, 'qty'> | null;
  cartCount: number;
  cartTotal: number;
  producerName: string;
  producerImage?: string;
  onClose: () => void;
  onOpenCart: () => void;
}

const SimpleBasket = () => (
  <div className="relative select-none" style={{ width: 56, height: 56 }}>
    <div
      className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-b-[45%] rounded-t-[15%]"
      style={{ width: 48, height: 36, background: 'linear-gradient(160deg, #d4a96a 0%, #b8864a 60%, #9a6e38 100%)' }}
    >
      {[30, 50, 70].map((pct) => (
        <div key={pct} className="absolute w-full" style={{ top: `${pct}%`, height: 1, background: 'rgba(90,50,10,0.25)' }} />
      ))}
      {[20, 40, 60, 80].map((pct) => (
        <div key={pct} className="absolute h-full" style={{ left: `${pct}%`, width: 1, background: 'rgba(90,50,10,0.2)' }} />
      ))}
    </div>
    <div className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ width: 52, height: 10, bottom: 33, background: 'linear-gradient(180deg, #c49050 0%, #9a6e38 100%)', border: '1.5px solid rgba(90,50,10,0.3)' }} />
    <div className="absolute rounded-full" style={{ width: 14, height: 16, bottom: 38, left: 5, border: '2.5px solid #9a6e38', borderBottom: 'none', background: 'transparent' }} />
    <div className="absolute rounded-full" style={{ width: 14, height: 16, bottom: 38, right: 5, border: '2.5px solid #9a6e38', borderBottom: 'none', background: 'transparent' }} />
  </div>
);

const AndeanBasketToast = ({ item, cartCount, cartTotal, producerName, producerImage, onClose, onOpenCart }: AndeanBasketToastProps) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const [flyProduct, setFlyProduct] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const t1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const t2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(GRACIAS_AUDIO_URL);
    audio.preload = 'auto';
    audioRef.current = audio;
    return () => { audio.pause(); audioRef.current = null; };
  }, []);

  const triggerAudio = useCallback(() => {
    if (!voiceEnabled) return;
    t2Ref.current = setTimeout(() => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.pause();
      audio.currentTime = AUDIO_START_OFFSET;
      audio.volume = 0.92;
      audio.play().catch(() => {});
    }, 400);
  }, [voiceEnabled]);

  useEffect(() => {
    if (!item) return;
    setVisible(true);
    setFlyProduct(false);
    if (t1Ref.current) clearTimeout(t1Ref.current);
    if (t2Ref.current) clearTimeout(t2Ref.current);
    t1Ref.current = setTimeout(() => { setFlyProduct(true); triggerAudio(); }, 180);
    return () => {
      if (t1Ref.current) clearTimeout(t1Ref.current);
      if (t2Ref.current) clearTimeout(t2Ref.current);
      audioRef.current?.pause();
    };
  }, [item, triggerAudio]);

  const handleClose = () => { setVisible(false); setTimeout(onClose, 300); };

  const getImpactLines = (total: number, name: string): string[] => {
    if (total < 25) return [t('toast_impact_line1_low', { name }), t('toast_impact_line2_low'), t('toast_impact_line3_low')];
    if (total < 60) return [t('toast_impact_line1_mid', { name }), t('toast_impact_line2_mid'), t('toast_impact_line3_mid')];
    if (total < 100) return [t('toast_impact_line1_high', { name }), t('toast_impact_line2_high'), t('toast_impact_line3_high')];
    return [t('toast_impact_line1_max', { name }), t('toast_impact_line2_max'), t('toast_impact_line3_max')];
  };

  if (!item) return null;

  const impactLines = getImpactLines(cartTotal, producerName);
  const progressPct = Math.min(100, Math.round((cartTotal / 120) * 100));

  const producerImg = producerImage || null;

  return (
    <>
      <style>{`
        @keyframes toastSlideIn { from { transform: translate(-50%,-50%) scale(0.93); opacity:0; } to { transform: translate(-50%,-50%) scale(1); opacity:1; } }
        @keyframes toastSlideOut { from { transform: translate(-50%,-50%) scale(1); opacity:1; } to { transform: translate(-50%,-50%) scale(0.93); opacity:0; } }
        @keyframes backdropIn  { from { opacity:0; } to { opacity:1; } }
        @keyframes backdropOut { from { opacity:1; } to { opacity:0; } }
        @keyframes flyToBasket { 0% { transform:translate(0,0) scale(1); opacity:1; } 60% { transform:translate(-140px,50px) scale(0.55); opacity:0.8; } 100% { transform:translate(-160px,65px) scale(0.1); opacity:0; } }
        @keyframes basketReceive { 0% { transform:scale(1) rotate(0deg); } 30% { transform:scale(1.15) rotate(-4deg); } 60% { transform:scale(0.96) rotate(2deg); } 100% { transform:scale(1) rotate(0deg); } }
        @keyframes impactLineIn { from { transform:translateX(12px); opacity:0; } to { transform:translateX(0); opacity:1; } }
        @keyframes producerPop { from { transform:scale(0.7); opacity:0; } to { transform:scale(1); opacity:1; } }
        @keyframes goldenShimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
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

      {/* Modal */}
      <div
        className="fixed z-[70]"
        style={{
          top: '50%', left: '50%',
          width: '100%', maxWidth: 600,
          padding: '0 16px',
          transform: 'translate(-50%, -50%)',
          animation: visible
            ? 'toastSlideIn 0.38s cubic-bezier(0.34,1.56,0.64,1) forwards'
            : 'toastSlideOut 0.25s ease-in forwards',
          pointerEvents: visible ? 'auto' : 'none',
        }}
      >
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(201,169,110,0.35)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}
        >
          {/* Background image with golden overlay */}
          <div className="absolute inset-0" style={{ zIndex: 0 }}>
            <img
              src="/Holzen/images/process3.jpeg"
              alt=""
              className="w-full h-full object-cover object-center"
              style={{ opacity: 0.55 }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(150deg, rgba(28,15,6,0.82) 0%, rgba(42,22,8,0.72) 40%, rgba(20,10,4,0.85) 100%)' }} />
            {/* Golden shimmer overlay */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.06) 0%, rgba(245,200,120,0.10) 50%, rgba(201,169,110,0.06) 100%)', backgroundSize: '200% 100%', animation: 'goldenShimmer 4s ease-in-out infinite' }} />
          </div>

          {/* Top stripe */}
          <div className="h-1.5 w-full flex relative z-10">
            {['#8B2500','#C0390A','#D4622A','#E8820A','#F0A020','#F5C842','#E8A020','#D4622A','#C0390A','#8B2500','#F5C842','#E8A020','#D4622A','#C0390A'].map((c, i) => (
              <div key={i} className="flex-1" style={{ background: c }} />
            ))}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
              <span className="font-sans text-xs tracking-[0.3em] uppercase font-semibold" style={{ color: 'rgba(245,230,211,0.85)' }}>
                {t('toast_added')}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setVoiceEnabled(v => { if (v) audioRef.current?.pause(); return !v; }); }}
                className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer rounded-full"
                style={{ color: 'rgba(245,230,211,0.35)' }}
              >
                <i className={voiceEnabled ? 'ri-volume-up-line text-sm' : 'ri-volume-mute-line text-sm'} />
              </button>
              <button
                onClick={handleClose}
                className="w-7 h-7 flex items-center justify-center transition-colors cursor-pointer rounded-full"
                style={{ color: 'rgba(245,230,211,0.45)', border: '1px solid rgba(245,230,211,0.15)' }}
              >
                <i className="ri-close-line text-sm" />
              </button>
            </div>
          </div>

          {/* Main body */}
          <div className="flex items-stretch gap-0 px-5 pb-5 relative z-10">

            {/* LEFT — producer photo + basket */}
            <div className="flex flex-col items-center justify-center pr-4 flex-shrink-0" style={{ width: 110 }}>

              {/* Producer photo */}
              <div
                className="relative rounded-full overflow-hidden mb-2"
                style={{
                  width: 96, height: 96,
                  border: '2.5px solid rgba(201,169,110,0.6)',
                  boxShadow: '0 0 18px rgba(201,169,110,0.3)',
                  animation: flyProduct ? 'producerPop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both' : 'none',
                }}
              >
                {producerImg ? (
                  <img src={producerImg} alt={producerName} className="w-full h-full object-cover object-top" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold" style={{ background: 'rgba(201,169,110,0.15)', color: '#c9a96e' }}>
                    {producerName?.charAt(0) || '?'}
                  </div>
                )}
                {/* Gold ring */}
                <div className="absolute inset-0 rounded-full" style={{ border: '1.5px solid rgba(201,169,110,0.4)' }} />
              </div>
              <span className="font-sans text-[9px] font-semibold text-center leading-tight mb-2" style={{ color: 'rgba(201,169,110,0.8)', maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {producerName}
              </span>

              {/* Flying product + basket */}
              <div className="relative flex justify-center" style={{ height: 72, width: 96 }}>
                {flyProduct && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 rounded-lg overflow-hidden z-10"
                    style={{ width: 36, height: 36, border: '1px solid rgba(201,169,110,0.4)', animation: 'flyToBasket 0.7s cubic-bezier(0.4,0,0.6,1) forwards' }}
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                  </div>
                )}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2"
                  style={{ animation: flyProduct ? 'basketReceive 0.6s ease 0.55s both' : 'none' }}
                >
                  <SimpleBasket />
                </div>
              </div>

              <span className="font-sans text-[8px] tracking-[0.2em] uppercase mt-1 text-center" style={{ color: 'rgba(245,230,211,0.2)' }}>
                {t('toast_basket_label')}
              </span>
            </div>

            {/* Divider */}
            <div className="w-px self-stretch mx-1 flex-shrink-0" style={{ background: 'rgba(201,169,110,0.12)' }} />

            {/* RIGHT — impact */}
            <div className="flex-1 pl-5 flex flex-col justify-center gap-3">
              <p className="font-sans text-[9px] tracking-[0.35em] uppercase font-semibold" style={{ color: 'rgba(201,169,110,0.7)' }}>
                {t('toast_impact_eyebrow')}
              </p>

              <ul className="flex flex-col gap-2">
                {impactLines.map((line, i) => (
                  <li key={i} className="flex items-start gap-2.5" style={{ animation: flyProduct ? `impactLineIn 0.4s ease ${0.3 + i * 0.1}s both` : 'none' }}>
                    <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ background: i === 0 ? '#c9a96e' : i === 1 ? '#66BB6A' : '#E8A020' }} />
                    <span className="font-sans text-sm leading-snug" style={{ color: 'rgba(245,230,211,0.88)' }}>{line}</span>
                  </li>
                ))}
              </ul>

              {/* Progress */}
              <div>
                <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg, #2E7D32, #c9a96e)' }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-sans text-[9px]" style={{ color: 'rgba(245,230,211,0.3)' }}>${cartTotal.toFixed(0)} {t('toast_progress_of')} $120</span>
                  <span className="font-sans text-[9px]" style={{ color: 'rgba(201,169,110,0.5)' }}>{progressPct}%</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => { handleClose(); onOpenCart(); }}
                className="relative overflow-hidden w-full flex items-center justify-center gap-2 rounded-xl py-2.5 font-sans text-xs font-bold tracking-[0.15em] uppercase transition-all cursor-pointer whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #D4622A 0%, #E8820A 50%, #C0390A 100%)', color: '#FFFFFF', fontWeight: 800, letterSpacing: '0.12em', boxShadow: '0 4px 20px rgba(212,98,42,0.45)' }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <i className="ri-shopping-basket-2-line text-sm" />
                  {t('toast_cta', { total: cartTotal.toFixed(2) })}
                </span>
                <span className="absolute top-0 bottom-0 w-1/3 animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              </button>
            </div>
          </div>

          {/* Bottom stripe */}
          <div className="h-1 w-full flex relative z-10">
            {['#8B2500','#C0390A','#D4622A','#E8820A','#F0A020','#F5C842','#E8A020','#D4622A','#C0390A','#8B2500','#F5C842','#E8A020','#D4622A','#C0390A'].map((c, i) => (
              <div key={i} className="flex-1" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AndeanBasketToast;
