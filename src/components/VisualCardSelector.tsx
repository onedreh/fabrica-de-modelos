import React from 'react';
import {
  Smartphone,
  Square,
  Image as ImageIcon,
  Monitor,
  Maximize2,
  Camera,
  Sun,
  Shirt,
  Sparkles,
  Watch,
  Glasses,
  ShoppingBag,
  Footprints,
  Eye,
  Check
} from 'lucide-react';

interface VisualCardOption {
  value: string;
  label: string;
  subtitle?: string;
  icon?: React.ReactNode;
  aspectRatioClass?: string;
  imgSrc?: string;
}

interface VisualCardSelectorProps {
  fieldId: string;
  value: string;
  onChange: (val: string) => void;
  options: (string | { value: string | number; label: string })[];
}

export const VisualCardSelector: React.FC<VisualCardSelectorProps> = ({
  fieldId,
  value,
  onChange,
  options
}) => {
  // 1. Aspect Ratio Visual Cards
  if (fieldId === 'aspect_ratio') {
    const aspectCards: VisualCardOption[] = [
      {
        value: '9:16',
        label: '9:16 Vertical',
        subtitle: 'TikTok, Reels, Stories',
        aspectRatioClass: 'w-6 h-10',
        icon: <Smartphone className="w-4 h-4 text-indigo-400" />
      },
      {
        value: '4:5',
        label: '4:5 Retrato',
        subtitle: 'Feed Instagram e Galeria',
        aspectRatioClass: 'w-7 h-9',
        icon: <ImageIcon className="w-4 h-4 text-emerald-400" />
      },
      {
        value: '1:1',
        label: '1:1 Quadrado',
        subtitle: 'Capa e Catálogo clássico',
        aspectRatioClass: 'w-8 h-8',
        icon: <Square className="w-4 h-4 text-amber-400" />
      },
      {
        value: '3:4',
        label: '3:4 Editorial',
        subtitle: 'Retrato de Moda e Revista',
        aspectRatioClass: 'w-7.5 h-10',
        icon: <Maximize2 className="w-4 h-4 text-rose-400" />
      },
      {
        value: '16:9',
        label: '16:9 Horizontal',
        subtitle: 'Banner e Paisagem',
        aspectRatioClass: 'w-11 h-6',
        icon: <Monitor className="w-4 h-4 text-sky-400" />
      }
    ];

    return (
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
        {aspectCards.map((card) => {
          const isSelected = value === card.value;
          return (
            <button
              key={card.value}
              type="button"
              onClick={() => onChange(card.value)}
              className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer group ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500/80 shadow-md shadow-indigo-950'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              {/* Graphic Asset Slot */}
              <div className="h-14 w-full flex items-center justify-center mb-2 bg-slate-950/60 rounded-lg border border-slate-800/60 relative overflow-hidden group-hover:border-slate-700">
                <div
                  className={`border-2 rounded transition-all duration-150 flex items-center justify-center ${card.aspectRatioClass} ${
                    isSelected
                      ? 'border-indigo-400 bg-indigo-500/15'
                      : 'border-slate-600 bg-slate-900 group-hover:border-slate-500'
                  }`}
                >
                  {card.icon}
                </div>

                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              <div>
                <p className="font-semibold text-xs text-slate-100 flex items-center justify-between">
                  {card.label}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                  {card.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // 2. Framing (Enquadramento) Visual Cards
  if (fieldId === 'framing') {
    const framingCards: VisualCardOption[] = [
      {
        value: 'Corpo inteiro',
        label: 'Corpo Inteiro',
        subtitle: 'Da cabeça aos pés (vestidos e looks completos)'
      },
      {
        value: '3/4 (dos joelhos para cima)',
        label: '3/4 (Joelhos p/ cima)',
        subtitle: 'Clássico comercial TikTok (casacos, saias, tops)'
      },
      {
        value: 'Meio corpo',
        label: 'Meio Corpo (Cintura)',
        subtitle: 'Foco no tronco (blusas, camisas, decotes)'
      },
      {
        value: 'Close-up rosto/pescoço (joias/óculos)',
        label: 'Close Joias / Óculos',
        subtitle: 'Colares, brincos, óculos de sol e chapéus'
      },
      {
        value: 'Close-up mãos (anéis/relógios)',
        label: 'Close Mãos / Relógios',
        subtitle: 'Anéis, esmaltes, pulseiras e relógios'
      },
      {
        value: 'Detalhe do produto',
        label: 'Detalhe Macro',
        subtitle: 'Foco na textura do tecido, fivela ou costura'
      }
    ];

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
        {framingCards.map((card) => {
          const isSelected = value === card.value;
          return (
            <button
              key={card.value}
              type="button"
              onClick={() => onChange(card.value)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between cursor-pointer group ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500/80 shadow-md shadow-indigo-950'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              {/* Graphic Wireframe / Viewfinder Asset Slot */}
              <div className="h-16 w-full flex items-center justify-center mb-2 bg-slate-950/70 rounded-lg border border-slate-800/80 relative overflow-hidden group-hover:border-slate-700">
                {/* SVG Silhouette Viewfinder */}
                <svg viewBox="0 0 100 100" className="w-10 h-10 text-slate-500 group-hover:text-slate-400 transition-colors">
                  {/* Outer Frame */}
                  <rect x="10" y="10" width="80" height="80" rx="4" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
                  {card.value.includes('rosto') ? (
                    // Head/Neck close crop
                    <g fill="none" stroke={isSelected ? '#818cf8' : '#94a3b8'} strokeWidth="2.5">
                      <circle cx="50" cy="46" r="22" />
                      <path d="M42 68 Q50 78 58 68" />
                      <circle cx="50" cy="82" r="4" fill={isSelected ? '#818cf8' : '#94a3b8'} />
                    </g>
                  ) : card.value.includes('mãos') ? (
                    // Hands closeup
                    <g fill="none" stroke={isSelected ? '#818cf8' : '#94a3b8'} strokeWidth="2.5">
                      <path d="M35 70 C35 50, 45 40, 50 40 C55 40, 65 50, 65 70" />
                      <circle cx="50" cy="55" r="5" />
                    </g>
                  ) : card.value.includes('Corpo inteiro') ? (
                    // Full body
                    <g fill="none" stroke={isSelected ? '#818cf8' : '#94a3b8'} strokeWidth="2">
                      <circle cx="50" cy="24" r="7" />
                      <line x1="50" y1="31" x2="50" y2="58" strokeWidth="2.5" />
                      <line x1="50" y1="40" x2="36" y2="50" />
                      <line x1="50" y1="40" x2="64" y2="50" />
                      <line x1="50" y1="58" x2="42" y2="82" strokeWidth="2.5" />
                      <line x1="50" y1="58" x2="58" y2="82" strokeWidth="2.5" />
                    </g>
                  ) : card.value.includes('Meio corpo') ? (
                    // Half body
                    <g fill="none" stroke={isSelected ? '#818cf8' : '#94a3b8'} strokeWidth="2">
                      <circle cx="50" cy="30" r="10" />
                      <path d="M30 65 Q50 50 70 65" strokeWidth="3" />
                      <line x1="50" y1="40" x2="50" y2="75" strokeWidth="2.5" />
                    </g>
                  ) : (
                    // 3/4 framing
                    <g fill="none" stroke={isSelected ? '#818cf8' : '#94a3b8'} strokeWidth="2">
                      <circle cx="50" cy="26" r="9" />
                      <line x1="50" y1="35" x2="50" y2="65" strokeWidth="2.5" />
                      <line x1="50" y1="44" x2="35" y2="58" />
                      <line x1="50" y1="44" x2="65" y2="58" />
                      <line x1="50" y1="65" x2="43" y2="85" strokeWidth="2.5" />
                      <line x1="50" y1="65" x2="57" y2="85" strokeWidth="2.5" />
                    </g>
                  )}
                </svg>

                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </div>

              <div>
                <p className="font-semibold text-xs text-slate-100 flex items-center justify-between">
                  {card.label}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                  {card.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // 3. Product Type (Tipo de Produto) Visual Cards
  if (fieldId === 'product_type') {
    const productTypeIcons: Record<string, React.ReactNode> = {
      'Vestido / macacão': <Sparkles className="w-5 h-5 text-indigo-400" />,
      'Roupa (parte de cima)': <Shirt className="w-5 h-5 text-emerald-400" />,
      'Roupa (parte de baixo)': <Maximize2 className="w-5 h-5 text-amber-400" />,
      'Conjunto': <LayersIcon className="w-5 h-5 text-sky-400" />,
      'Moda praia': <Sun className="w-5 h-5 text-orange-400" />,
      'Lingerie / íntimo': <HeartIcon className="w-5 h-5 text-rose-400" />,
      'Bolsa': <ShoppingBag className="w-5 h-5 text-purple-400" />,
      'Sapato': <Footprints className="w-5 h-5 text-amber-500" />,
      'Joia / bijuteria': <Sparkles className="w-5 h-5 text-yellow-400" />,
      'Óculos': <Glasses className="w-5 h-5 text-teal-400" />,
      'Relógio': <Watch className="w-5 h-5 text-blue-400" />
    };

    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {options.slice(0, 8).map((opt) => {
          const valStr = typeof opt === 'string' ? opt : String(opt.value);
          const labelStr = typeof opt === 'string' ? opt : opt.label;
          const isSelected = value === valStr;

          return (
            <button
              key={valStr}
              type="button"
              onClick={() => onChange(valStr)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex items-center gap-2.5 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500/80 shadow-md shadow-indigo-950 text-white'
                  : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                {productTypeIcons[valStr] || <Shirt className="w-4 h-4 text-indigo-400" />}
              </div>
              <span className="text-xs font-medium leading-tight truncate">
                {labelStr}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  // 4. Lighting (Iluminação) Visual Cards
  if (fieldId === 'lighting') {
    const lightingCards: VisualCardOption[] = [
      {
        value: 'Softbox suave frontal',
        label: 'Softbox Suave',
        subtitle: 'Luz difusa de estúdio sem sombras duras'
      },
      {
        value: 'Luz natural de janela',
        label: 'Luz de Janela',
        subtitle: 'Luz orgânica de quarto lifestyle UGC'
      },
      {
        value: 'Golden hour',
        label: 'Golden Hour',
        subtitle: 'Tons quentes e dourados de fim de tarde'
      },
      {
        value: 'Luz dramática lateral',
        label: 'Luz Dramática',
        subtitle: 'Chiaroscuro editorial com sombras marcadas'
      },
      {
        value: 'Luz de estúdio com contraluz suave',
        label: 'Contraluz Luxo',
        subtitle: 'Rim light destacando contorno e tecido'
      }
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {lightingCards.map((card) => {
          const isSelected = value === card.value;
          return (
            <button
              key={card.value}
              type="button"
              onClick={() => onChange(card.value)}
              className={`p-2.5 rounded-xl border text-left transition-all duration-150 flex items-start gap-2.5 cursor-pointer ${
                isSelected
                  ? 'bg-indigo-950/60 border-indigo-500 ring-1 ring-indigo-500/80 shadow-md shadow-indigo-950'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
                <Sun className="w-4 h-4" />
              </div>

              <div>
                <p className="font-semibold text-xs text-slate-100">
                  {card.label}
                </p>
                <p className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-2">
                  {card.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return null;
};

// Subtle helper icons
function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );
}
