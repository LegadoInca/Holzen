import { useState, useEffect, useRef } from 'react';

interface MapPin {
  id: string;
  region: string;
  name: string;
  altitude: string;
  story: string;
  storyTitle: string;
  image: string;
  familyImage: string;
  familyCaption: string;
  stat: string;
  statLabel: string;
  x: number;
  y: number;
}

const mapPins: MapPin[] = [
  {
    id: 'lucia',
    region: 'Canchaque · Piura',
    name: 'Lucía Quispe',
    altitude: '1,200 m.s.n.m',
    storyTitle: 'El renacer de Lucía',
    story: "A los 19 años perdió su cosecha entera por una helada en las alturas de Canchaque. Sin crédito ni apoyo, aprendió sola el proceso natural en los cafetales de Huancabamba",
    image: '/Holzen/images/farmer1.jpg',
    familyImage: '/Holzen/images/farmer5.jpg',
    familyCaption: "Los hijos de Lucía van a la escuela gracias al café",
    stat: '3×', statLabel: 'ingresos en 4 años',
    x: 30, y: 38,
  },
  {
    id: 'edilberto',
    region: 'Montero · Ayabaca',
    name: 'Edilberto Rojas',
    altitude: '1,500 m.s.n.m',
    storyTitle: 'El despertar de Edilberto',
    story: "Exmilitar que volvió a Montero con las manos vacías. Convirtió una parcela abandonada en las montañas de Ayabaca en 3 hectáreas de cafetal, trabajando solo de madrugada por dos años",
    image: '/Holzen/images/farmer2.jpeg',
    familyImage: '/Holzen/images/impact1.jpeg',
    familyCaption: "Los 4 hijos de Edilberto estudian en la universidad",
    stat: '3 ha', statLabel: 'cultivadas desde cero',
    x: 26, y: 32,
  },
  {
    id: 'rosa',
    region: 'Sicchez · Ayabaca',
    name: 'Rosa Panduro',
    altitude: '1,800 m.s.n.m',
    storyTitle: 'La fuerza de Rosa',
    story: "Madre soltera de tres hijos en Sicchez, heredó una deuda y una parcela descuidada. Aprendió el secado solar artesanal observando a sus vecinos de Ayabaca",
    image: '/Holzen/images/farmer3.jpeg',
    familyImage: '/Holzen/images/impact3.jpeg',
    familyCaption: "Los 3 hijos de Rosa crecen con dignidad y sin deudas",
    stat: '100%', statLabel: 'venta directa al exterior',
    x: 28, y: 34,
  },
  {
    id: 'segundo',
    region: 'S. Miguel · Huancabamba',
    name: 'Segundo Herrera',
    altitude: '1,400 m.s.n.m',
    storyTitle: 'El nuevo comienzo de Segundo',
    story: "Creció viendo a su padre vender café a precios de miseria en San Miguel del Faique. A los 28 años rompió esa cadena: aprendió catación, certificó su finca y comenzó a exportar directamente",
    image: '/Holzen/images/farmer4.jpeg',
    familyImage: '/Holzen/images/farmer5.jpg',
    familyCaption: "La familia de Segundo ya no vende a intermediarios",
    stat: '12 países', statLabel: 'destinos de exportación',
    x: 32, y: 40,
  },
  {
    id: 'manuel',
    region: 'Chalaco · Morropón',
    name: 'Manuel Ccahuana',
    altitude: '2,000 m.s.n.m',
    storyTitle: 'La resistencia de Manuel',
    story: "En los 90, la violencia llegó hasta las montañas de Chalaco. Manuel perdió a su padre y a tres vecinos en una semana",
    image: '/Holzen/images/farmer5.jpg',
    familyImage: '/Holzen/images/impact1.jpeg',
    familyCaption: "La familia de Manuel vive en paz donde antes hubo miedo",
    stat: '54 años', statLabel: 'de resistencia',
    x: 34, y: 42,
  },
  {
    id: 'rosaquispe',
    region: 'Jililí · Ayabaca',
    name: 'Rosa Quispe',
    altitude: '1,950 m.s.n.m',
    storyTitle: 'La esperanza de Rosa',
    story: "Rosa escapó de una relación violenta con tres hijos pequeños — Lucía de 4, Ander de 6 y Mateo de 8. Sin dinero ni apoyo, llegó a Jililí con lo puesto",
    image: '/Holzen/images/farmer6.jpg',
    familyImage: '/Holzen/images/impact3.jpeg',
    familyCaption: "Lucía, Ander y Mateo van a la escuela cada mañana",
    stat: '3 hijos', statLabel: 'en la escuela gracias al café',
    x: 24, y: 36,
  },
  {
    id: 'julia',
    region: 'Pacaipampa · Ayabaca',
    name: 'Julia Flores',
    altitude: '2,100 m.s.n.m',
    storyTitle: 'El orgullo de Julia',
    story: "Hace tres años, Julia cultivaba productos sin futuro en Pacaipampa porque no había otra opción. Hoy cultiva café premium con certificación de origen",
    image: '/Holzen/images/farmer7.jpeg',
    familyImage: '/Holzen/images/impact1.jpeg',
    familyCaption: "Julia cultiva con dignidad en las alturas de Ayabaca",
    stat: '100%', statLabel: 'café certificado de origen',
    x: 27, y: 30,
  },
];

const MapWithPins = ({ activeName, hintText }: { activeName?: string; hintText?: string }) => {
  const [active, setActive] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  // Sync with external prop activeName
  useEffect(() => {
    if (activeName) {
      const pin = mapPins.find(p => p.name === activeName);
      if (pin) setActive(pin.id);
    }
  }, [activeName]);
  const [cardTab, setCardTab] = useState<'producer' | 'family'>('producer');
  const containerRef = useRef<HTMLDivElement>(null);

  const activePin = mapPins.find(p => p.id === (active ?? hovered));

  const handlePin = (id: string) => {
    setActive(prev => {
      if (prev === id) return null;
      setCardTab('producer');
      return id;
    });
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setActive(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <div className="relative w-full select-none" style={{ height: '580px' }}>
        <img
          src="/Holzen/images/mapa.png"
          alt="Mapa del Perú"
          className="w-full h-full object-contain object-center"
          style={{ filter: 'drop-shadow(0 0 40px rgba(201,169,110,0.15))' }}
          draggable={false}
        />

        {mapPins.map((pin) => {
          const isActive = active === pin.id;
          const isHov = hovered === pin.id;
          return (
            <button
              key={pin.id}
              className="absolute z-20 cursor-pointer group"
              style={{ left: `${pin.x}%`, top: `${pin.y}%`, transform: 'translate(-50%, -50%)' }}
              onClick={() => handlePin(pin.id)}
              onMouseEnter={() => setHovered(pin.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <span
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: 'rgba(201,169,110,0.35)', animationDuration: '2s', opacity: isActive || isHov ? 1 : 0.5 }}
              />
              <span
                className="relative flex items-center justify-center rounded-full border-2 transition-all duration-300"
                style={{
                  width: isActive ? '18px' : '13px',
                  height: isActive ? '18px' : '13px',
                  background: isActive ? '#c9a96e' : 'rgba(201,169,110,0.7)',
                  borderColor: isActive ? '#fff' : 'rgba(201,169,110,0.9)',
                  boxShadow: isActive ? '0 0 12px rgba(201,169,110,0.8)' : 'none',
                }}
              />
              <span
                className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap font-sans text-[9px] tracking-widest uppercase transition-all duration-300 pointer-events-none"
                style={{
                  bottom: isActive ? '-22px' : '-18px',
                  color: isActive ? '#c9a96e' : 'rgba(255,245,230,0.6)',
                  fontSize: isActive ? '9px' : '8px',
                }}
              >
                {pin.region.split('·')[0].trim()}
              </span>
            </button>
          );
        })}

        {/* Active pin card — two tabs */}
        {activePin && (
          <div
            key={activePin.id}
            className="absolute z-30 rounded-2xl overflow-hidden"
            style={{
              width: '180px',
              left: activePin.x > 55 ? `${activePin.x - 2}%` : `${activePin.x + 3}%`,
              top: activePin.y > 60 ? `${activePin.y - 10}%` : `${activePin.y + 3}%`,
              transform: activePin.x > 55 ? 'translateX(-100%)' : 'translateX(0)',
              animation: 'cardIn 0.28s cubic-bezier(0.16,1,0.3,1) forwards',
              background: 'rgba(14,8,3,0.97)',
              border: '1px solid rgba(201,169,110,0.3)',
              boxShadow: '0 20px 56px rgba(0,0,0,0.8)',
            }}
          >
            {/* Photo */}
            <div className="relative w-full" style={{ height: '148px' }}>
              <img
                src={cardTab === 'producer' ? activePin.image : activePin.familyImage}
                alt={cardTab === 'producer' ? activePin.name : 'Familia'}
                className="w-full h-full object-cover object-top transition-opacity duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Tag top-left */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] font-sans font-semibold tracking-widest uppercase"
                style={{ background: 'rgba(194,98,42,0.85)', color: '#fff8f0' }}>
                {cardTab === 'producer' ? 'Productor' : 'Su familia'}
              </div>

              {/* Close */}
              <button
                onClick={() => setActive(null)}
                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full bg-black/60 text-cream/70 hover:text-cream cursor-pointer transition-colors"
              >
                <i className="ri-close-line" style={{ fontSize: '10px' }} />
              </button>

              {/* Story title over photo bottom */}
              <div className="absolute bottom-0 left-0 right-0 px-3 pb-2">
                <p className="font-serif text-cream text-[11px] leading-tight font-semibold">
                  {activePin.storyTitle}
                </p>
              </div>
            </div>

            {/* Info */}
            <div className="px-3 pt-2 pb-1">
              <p className="text-gold font-sans text-[8px] tracking-widest uppercase mb-0.5 truncate">{activePin.region}</p>
              <h4 className="font-serif text-cream text-sm leading-tight">{activePin.name}</h4>
              {cardTab === 'family' && (
                <p className="text-cream/55 font-sans text-[9px] leading-snug mt-1.5 italic">
                  {activePin.familyCaption}
                </p>
              )}
            </div>

            {/* Tabs */}
            <div className="flex border-t mx-3 mb-2.5 mt-2" style={{ borderColor: 'rgba(201,169,110,0.15)' }}>
              <button
                onClick={() => setCardTab('producer')}
                className="flex-1 py-1.5 font-sans text-[9px] tracking-widest uppercase transition-colors cursor-pointer"
                style={{ color: cardTab === 'producer' ? '#c9a96e' : 'rgba(255,245,230,0.35)', borderBottom: cardTab === 'producer' ? '1.5px solid #c9a96e' : '1.5px solid transparent' }}
              >
                Productor
              </button>
              <button
                onClick={() => setCardTab('family')}
                className="flex-1 py-1.5 font-sans text-[9px] tracking-widest uppercase transition-colors cursor-pointer"
                style={{ color: cardTab === 'family' ? '#c9a96e' : 'rgba(255,245,230,0.35)', borderBottom: cardTab === 'family' ? '1.5px solid #c9a96e' : '1.5px solid transparent' }}
              >
                Su familia
              </button>
            </div>
          </div>
        )}
      </div>



      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default MapWithPins;
