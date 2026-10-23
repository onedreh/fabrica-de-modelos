import React from 'react';
import {
  Sparkles,
  Layers,
  Palette,
  Camera,
  Shirt,
  User,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

interface LivePromptTokensBarProps {
  formValues: Record<string, any>;
  onScrollToSection?: (sectionId: string) => void;
}

export const LivePromptTokensBar: React.FC<LivePromptTokensBarProps> = ({
  formValues,
  onScrollToSection
}) => {
  const generator = String(formValues.target_generator || 'flux').toUpperCase();
  const aspectRatio = String(formValues.aspect_ratio || '9:16');
  const age = String(formValues.age || '26-30');
  const ethnicity = String(formValues.ethnicity || 'Brasileira');
  const productName = formValues.product_name || formValues.product_type || 'Produto';
  const productColor = formValues.product_color;
  const productMaterial = formValues.product_material;
  const lighting = formValues.lighting || 'Softbox suave';
  const background = formValues.background || 'Estúdio branco';

  // Count active specifications
  const activeTokensCount = [
    generator,
    aspectRatio,
    age,
    productName,
    productColor,
    productMaterial,
    lighting,
    background
  ].filter(Boolean).length;

  return (
    <div className="bg-slate-900/90 border border-slate-800/90 rounded-xl p-3 backdrop-blur-md shadow-lg space-y-2">
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200">
            Estrutura Ativa do Prompt (DNA em Tempo Real)
          </span>
        </div>
        <span className="text-[11px] font-mono text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded-full">
          {activeTokensCount} blocos sincronizados
        </span>
      </div>

      {/* Chips Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
        {/* Generator Chip */}
        <div className="flex items-center gap-1 bg-slate-950 border border-indigo-500/40 text-indigo-300 px-2.5 py-1 rounded-lg shrink-0 font-mono font-medium">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span>{generator}</span>
        </div>

        {/* Aspect Ratio Chip */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg shrink-0 font-mono">
          <Camera className="w-3 h-3 text-emerald-400" />
          <span>{aspectRatio}</span>
        </div>

        {/* Model Spec Chip */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg shrink-0">
          <User className="w-3 h-3 text-amber-400" />
          <span>{ethnicity.split(' ')[0]} ({age}a)</span>
        </div>

        {/* Product Name Chip */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 text-white px-2.5 py-1 rounded-lg shrink-0 font-medium max-w-[200px] truncate">
          <Shirt className="w-3 h-3 text-sky-400 shrink-0" />
          <span className="truncate">{productName}</span>
        </div>

        {/* Product Color & Material Chip */}
        {productColor && (
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 text-slate-300 px-2.5 py-1 rounded-lg shrink-0">
            <Palette className="w-3 h-3 text-rose-400" />
            <span>{productColor}</span>
          </div>
        )}

        {/* Lighting Chip */}
        <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 text-slate-400 px-2.5 py-1 rounded-lg shrink-0 max-w-[160px] truncate">
          <SlidersHorizontal className="w-3 h-3 text-amber-300 shrink-0" />
          <span className="truncate">{lighting.split(' ')[0]}</span>
        </div>
      </div>
    </div>
  );
};
