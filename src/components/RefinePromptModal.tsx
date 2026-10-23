import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Send,
  Loader2,
  AlertCircle,
  Lightbulb,
  Check,
  Undo2
} from 'lucide-react';
import { GenerationResult } from './ResultCard';

interface RefinePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: GenerationResult;
  onApplyRefine: (refinedResult: GenerationResult) => void;
  formValues: Record<string, any>;
  lockedChunks?: Record<string, string>;
}

const QUICK_SUGGESTIONS = [
  { label: '🌅 Luz Dourada (Golden Hour)', prompt: 'mude a iluminação para luz dourada de pôr do sol (golden hour) com brilho suave e quente' },
  { label: '☕ Cenário Cafeteria Urbana', prompt: 'troque o cenário para uma cafeteria moderna urbana charmosa com mesas de mármore e luz ambiente aconchegante' },
  { label: '🕶️ Óculos de Sol Sofisticados', prompt: 'adicione óculos de sol pretos elegantes de armação de acetato combinando com o look' },
  { label: '🚶‍♀️ Pose Caminhando com Movimento', prompt: 'altere a pose para a modelo caminhando naturalmente com movimento fluido do corpo e drapeado natural da peça' },
  { label: '✨ Sorriso Aberto e Confiante', prompt: 'faça a expressão facial ter um sorriso aberto, caloroso e cativante de catálogo comercial' },
  { label: '🔍 Foco Macro no Tecido', prompt: 'mude a lente para macro e destaque as texturas táteis do tecido, costuras refinadas e acabamento da roupa' },
  { label: '🏛️ Fundo Minimalista Editorial', prompt: 'coloque em estúdio minimalista com elementos arquitetônicos neutros e iluminação suave' }
];

export const RefinePromptModal: React.FC<RefinePromptModalProps> = ({
  isOpen,
  onClose,
  result,
  onApplyRefine,
  formValues,
  lockedChunks
}) => {
  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previousResult, setPreviousResult] = useState<GenerationResult | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (customInstruction?: string) => {
    const textToUse = customInstruction || instruction;
    if (!textToUse.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chunks: result.chunks,
          instruction: textToUse.trim(),
          target_generator: result.adapter,
          aspect_ratio: result.aspect_ratio,
          locked_chunks: lockedChunks ? Object.keys(lockedChunks) : [],
          form_values: formValues
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao aplicar refinamento com IA.');
      }

      const data = await response.json();
      setPreviousResult(result);

      onApplyRefine({
        ...result,
        prompt: data.prompt,
        negative_prompt: data.negative_prompt,
        chunks: data.chunks,
        adapter: data.adapter,
        aspect_ratio: data.aspect_ratio,
        params: data.params,
        formatted_full_copy: data.formatted_full_copy,
        word_count: data.word_count,
        warnings: data.warnings,
        quality_score: data.quality_score
      });

      setInstruction('');
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro inesperado ao refinar o prompt.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = () => {
    if (previousResult) {
      onApplyRefine(previousResult);
      setPreviousResult(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                <span>Refinar Prompt com IA</span>
                <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full">
                  Fase 2 Ativa
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ajuste iluminação, pose, acessórios ou ambiente sem perder a identidade da modelo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-lg leading-none p-1"
          >
            ✕
          </button>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="block text-xs font-medium text-slate-300">
            O que você deseja ajustar no prompt?
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="Ex: Mude a iluminação para golden hour no pôr do sol e adicione óculos de sol pretos..."
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-3.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/50 flex items-start gap-2 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick suggestions */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Sugestões rápidas de 1 clique:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_SUGGESTIONS.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInstruction(item.prompt);
                  handleSubmit(item.prompt);
                }}
                disabled={isLoading}
                className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-indigo-950/60 border border-slate-800 hover:border-indigo-700/60 text-[11px] text-slate-300 hover:text-indigo-200 transition-colors text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div>
            {previousResult && (
              <button
                type="button"
                onClick={handleUndo}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Desfazer último refinamento</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isLoading || !instruction.trim()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Refinando com IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Aplicar Refinamento</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
