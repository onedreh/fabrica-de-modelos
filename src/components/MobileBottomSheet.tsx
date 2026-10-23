import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  X,
  Copy,
  Check,
  Sparkles,
  Layers,
  Camera,
  Sliders,
  FileText,
  ShieldAlert,
  CopyCheck
} from 'lucide-react';
import { GenerationResult } from './ResultCard';

interface MobileBottomSheetProps {
  result: GenerationResult | null;
  onOpenTryOnGuide: () => void;
  onUpdateResult: (res: GenerationResult) => void;
  formValues: Record<string, any>;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  result,
  onOpenTryOnGuide,
  onUpdateResult,
  formValues
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'negative' | 'chunks' | 'params'>('prompt');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!result) return null;

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const score = result.quality_score ?? 85;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
      {/* Backdrop when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sheet Container */}
      <div
        className={`relative z-40 bg-slate-900 border-t border-slate-700/80 rounded-t-3xl shadow-2xl transition-all duration-300 ease-out flex flex-col ${
          isExpanded ? 'max-h-[85vh] h-[85vh]' : 'h-20'
        }`}
      >
        {/* Pull Handle Header */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2.5 flex flex-col items-center cursor-pointer select-none border-b border-slate-800/80 shrink-0"
        >
          {/* Visual Pull Bar */}
          <div className="w-10 h-1 rounded-full bg-slate-600 mb-2" />

          <div className="w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 truncate">
              <span className="p-1.5 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </span>
              <div className="truncate">
                <p className="font-bold text-xs text-white truncate">
                  Prompt Pronto ({result.adapter.toUpperCase()})
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  Score: {score}/100 · {result.word_count} palavras
                </p>
              </div>
            </div>

            {/* Quick Actions in Mini Bar */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  copyText(result.formatted_full_copy, 'all_mini');
                }}
                className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                {copiedKey === 'all_mini' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <CopyCheck className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>

              <div className="p-1 text-slate-400">
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Sheet Content */}
        {isExpanded && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Action Bar inside Expanded Sheet */}
            <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-2 shrink-0">
              <button
                type="button"
                onClick={onOpenTryOnGuide}
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700/60"
              >
                <Camera className="w-3.5 h-3.5 text-indigo-400" />
                <span>Como usar c/ foto</span>
              </button>

              <button
                type="button"
                onClick={() => copyText(result.formatted_full_copy, 'all_expanded')}
                className="py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
              >
                {copiedKey === 'all_expanded' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Tudo Copiado!</span>
                  </>
                ) : (
                  <>
                    <CopyCheck className="w-3.5 h-3.5" />
                    <span>Copiar Tudo</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Tab Bar */}
            <div className="flex border-b border-slate-800/80 bg-slate-950/30 px-3 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('prompt')}
                className={`flex-1 py-2.5 text-xs font-semibold border-b-2 text-center transition-colors ${
                  activeTab === 'prompt'
                    ? 'border-indigo-500 text-white bg-slate-800/40'
                    : 'border-transparent text-slate-400'
                }`}
              >
                Prompt
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('negative')}
                className={`flex-1 py-2.5 text-xs font-semibold border-b-2 text-center transition-colors ${
                  activeTab === 'negative'
                    ? 'border-indigo-500 text-white bg-slate-800/40'
                    : 'border-transparent text-slate-400'
                }`}
              >
                Negative
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('chunks')}
                className={`flex-1 py-2.5 text-xs font-semibold border-b-2 text-center transition-colors ${
                  activeTab === 'chunks'
                    ? 'border-indigo-500 text-white bg-slate-800/40'
                    : 'border-transparent text-slate-400'
                }`}
              >
                Chunks
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('params')}
                className={`flex-1 py-2.5 text-xs font-semibold border-b-2 text-center transition-colors ${
                  activeTab === 'params'
                    ? 'border-indigo-500 text-white bg-slate-800/40'
                    : 'border-transparent text-slate-400'
                }`}
              >
                Parâmetros
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              {activeTab === 'prompt' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Prompt completo em inglês</span>
                    <button
                      type="button"
                      onClick={() => copyText(result.prompt, 'prompt_mob')}
                      className="px-2.5 py-1 rounded bg-slate-800 text-white font-medium text-xs flex items-center gap-1"
                    >
                      {copiedKey === 'prompt_mob' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copiar</span>
                    </button>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap select-all">
                    {result.prompt}
                  </div>
                </div>
              )}

              {activeTab === 'negative' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Negative Prompt (mãos, fidelidade, pele)</span>
                    <button
                      type="button"
                      onClick={() => copyText(result.negative_prompt, 'negative_mob')}
                      className="px-2.5 py-1 rounded bg-slate-800 text-white font-medium text-xs flex items-center gap-1"
                    >
                      {copiedKey === 'negative_mob' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copiar</span>
                    </button>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
                    {result.negative_prompt}
                  </div>
                </div>
              )}

              {activeTab === 'chunks' && (
                <div className="space-y-2">
                  <p className="text-[11px] text-slate-400">
                    Blocos anatômicos e técnicos gerados para {result.adapter.toUpperCase()}:
                  </p>
                  {Object.entries(result.chunks).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs font-mono space-y-1">
                      <span className="text-indigo-400 font-semibold text-[11px] block">{key}:</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{val}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'params' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Configurações técnicas ({result.adapter.toUpperCase()})</span>
                    <button
                      type="button"
                      onClick={() => copyText(JSON.stringify(result.params, null, 2), 'params_mob')}
                      className="px-2.5 py-1 rounded bg-slate-800 text-white font-medium text-xs flex items-center gap-1"
                    >
                      {copiedKey === 'params_mob' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copiar</span>
                    </button>
                  </div>
                  <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300 whitespace-pre-wrap">
                    {JSON.stringify(result.params, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
