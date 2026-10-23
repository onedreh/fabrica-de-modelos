import React, { useState, useEffect } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  Layers,
  AlertTriangle,
  RotateCw,
  FileText,
  ShieldAlert,
  ChevronDown,
  Wand2,
  CopyCheck,
  Camera,
  Grid3X3,
  Lock,
  Layers3
} from 'lucide-react';
import { i18n } from '../i18n/ptBR';
import { TryOnGuideModal } from './TryOnGuideModal';
import { RefinePromptModal } from './RefinePromptModal';

export interface PromptVariation {
  id: string;
  label: string;
  angle_description: string;
  prompt: string;
  negative_prompt: string;
  chunks: Record<string, string>;
  params: Record<string, any>;
  formatted_full_copy: string;
  word_count: number;
  quality_score: number;
  warnings: string[];
}

export interface GenerationResult {
  prompt: string;
  negative_prompt: string;
  chunks: Record<string, string>;
  adapter: string;
  aspect_ratio: string;
  params: Record<string, any>;
  formatted_full_copy: string;
  word_count: number;
  warnings?: string[];
  quality_score?: number;
  request_id?: string;
  variations?: PromptVariation[];
  active_profile_name?: string;
}

interface ResultCardProps {
  result: GenerationResult;
  onUpdateResult: (updated: GenerationResult) => void;
  formValues: Record<string, any>;
  activeProfileName?: string;
  lockedChunks?: Record<string, string>;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  result,
  onUpdateResult,
  formValues,
  activeProfileName,
  lockedChunks
}) => {
  const [activeTab, setActiveTab] = useState<'prompt' | 'negative' | 'chunks' | 'params'>('prompt');
  const [activeVariationIndex, setActiveVariationIndex] = useState<number>(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [editableChunks, setEditableChunks] = useState<Record<string, string>>(result.chunks || {});
  const [isReassembling, setIsReassembling] = useState(false);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);
  const [showWarnings, setShowWarnings] = useState(true);
  const [showTryOnGuide, setShowTryOnGuide] = useState(false);
  const [showRefineModal, setShowRefineModal] = useState(false);

  const variations = result.variations && result.variations.length > 0 ? result.variations : null;
  const currentVariation = variations ? variations[activeVariationIndex] : null;

  // Active displayed values depend on whether variations are active
  const displayPrompt = currentVariation ? currentVariation.prompt : result.prompt;
  const displayNegative = currentVariation ? currentVariation.negative_prompt : result.negative_prompt;
  const displayChunks = currentVariation ? currentVariation.chunks : editableChunks;
  const displayWordCount = currentVariation ? currentVariation.word_count : result.word_count;
  const displayFullCopy = currentVariation ? currentVariation.formatted_full_copy : result.formatted_full_copy;
  const displayParams = currentVariation ? currentVariation.params : result.params;
  const displayScore = currentVariation ? currentVariation.quality_score : (result.quality_score ?? 85);
  const displayWarnings = currentVariation ? currentVariation.warnings : (result.warnings || []);

  // Sync editable chunks if new result arrives
  useEffect(() => {
    setEditableChunks(displayChunks || {});
  }, [displayChunks]);

  const copyToClipboard = async (text: string, sectionKey: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionKey);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const copyAllVariations = async () => {
    if (!variations) return;
    const combined = variations
      .map(
        (v, i) =>
          `=== VARIAÇÃO ${i + 1}: ${v.label.toUpperCase()} ===\n[ÂNGULO]: ${v.angle_description}\n\n${v.formatted_full_copy}`
      )
      .join('\n\n' + '='.repeat(60) + '\n\n');

    await copyToClipboard(combined, 'all_variations');
  };

  // Reassemble when user modifies chunks
  const handleReassemble = async (
    targetGen = result.adapter,
    aspect = result.aspect_ratio,
    chunksToUse = editableChunks
  ) => {
    setIsReassembling(true);
    try {
      const response = await fetch('/api/reassemble', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chunks: chunksToUse,
          target_generator: targetGen,
          aspect_ratio: aspect,
          form_values: formValues
        })
      });

      if (!response.ok) throw new Error('Falha ao remontar');
      const data = await response.json();

      onUpdateResult({
        ...result,
        prompt: data.prompt,
        negative_prompt: data.negative_prompt,
        chunks: chunksToUse,
        adapter: data.adapter,
        aspect_ratio: data.aspect_ratio,
        params: data.params,
        formatted_full_copy: data.formatted_full_copy,
        word_count: data.word_count,
        warnings: data.warnings,
        quality_score: data.quality_score
      });
    } catch (e) {
      console.error('Erro na remontagem:', e);
    } finally {
      setIsReassembling(false);
    }
  };

  // Generate 3 variations on the fly if user only generated 1
  const handleGenerateVariations = async () => {
    setIsGeneratingVariations(true);
    try {
      const response = await fetch('/api/variations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chunks: result.chunks,
          target_generator: result.adapter,
          aspect_ratio: result.aspect_ratio,
          form_values: formValues
        })
      });

      if (!response.ok) throw new Error('Falha ao gerar variações');
      const data = await response.json();

      if (data.variations && data.variations.length > 0) {
        onUpdateResult({
          ...result,
          variations: data.variations
        });
        setActiveVariationIndex(0);
      }
    } catch (e) {
      console.error('Erro ao gerar variações:', e);
    } finally {
      setIsGeneratingVariations(false);
    }
  };

  const handleGeneratorChange = (newGen: string) => {
    handleReassemble(newGen, result.aspect_ratio, editableChunks);
  };

  const handleAspectRatioChange = (newAspect: string) => {
    handleReassemble(result.adapter, newAspect, editableChunks);
  };

  const handleChunkChange = (key: string, val: string) => {
    setEditableChunks((prev: Record<string, string>) => ({
      ...prev,
      [key]: val
    }));
  };

  // Score color
  const scoreColor =
    displayScore >= 85
      ? 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80'
      : displayScore >= 70
      ? 'text-indigo-400 bg-indigo-950/60 border-indigo-800/80'
      : displayScore >= 50
      ? 'text-amber-400 bg-amber-950/60 border-amber-800/80'
      : 'text-rose-400 bg-rose-950/60 border-rose-800/80';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
      {/* Top Header / Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Target Generator Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs shadow-inner">
            <span className="text-slate-400 font-medium">Gerador:</span>
            <select
              value={result.adapter}
              onChange={(e) => handleGeneratorChange(e.target.value)}
              disabled={isReassembling}
              className="bg-transparent font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="flux" className="bg-slate-900">Flux</option>
              <option value="midjourney" className="bg-slate-900">Midjourney</option>
              <option value="sd3" className="bg-slate-900">Stable Diffusion 3</option>
              <option value="ideogram" className="bg-slate-900">Ideogram</option>
              <option value="leonardo" className="bg-slate-900">Leonardo AI</option>
              <option value="gemini_image" className="bg-slate-900">Gemini (Imagem)</option>
              <option value="generic" className="bg-slate-900">Genérico</option>
            </select>
          </div>

          {/* Aspect Ratio Switcher */}
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs shadow-inner">
            <span className="text-slate-400 font-medium">Proporção:</span>
            <select
              value={result.aspect_ratio}
              onChange={(e) => handleAspectRatioChange(e.target.value)}
              disabled={isReassembling}
              className="bg-transparent font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="9:16" className="bg-slate-900">9:16 (TikTok/Story)</option>
              <option value="4:5" className="bg-slate-900">4:5 (Feed/Vitrine)</option>
              <option value="1:1" className="bg-slate-900">1:1 (Quadrado)</option>
              <option value="3:4" className="bg-slate-900">3:4 (Retrato)</option>
              <option value="16:9" className="bg-slate-900">16:9 (Horizontal)</option>
            </select>
          </div>

          {/* Quality Score Indicator */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono font-semibold tabular-nums shadow-xs ${scoreColor}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Score: {displayScore}/100</span>
          </div>

          {/* Model Lock Badge if Active */}
          {(activeProfileName || result.active_profile_name) && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-medium shadow-xs">
              <Lock className="w-3 h-3 text-indigo-400" />
              <span className="truncate max-w-[130px]">{activeProfileName || result.active_profile_name}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Refinar com IA Button (Active Fase 2) */}
          <button
            type="button"
            onClick={() => setShowRefineModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-950/80 hover:bg-violet-900 border border-violet-700/60 text-violet-300 hover:text-white font-medium text-xs transition-colors cursor-pointer shadow-xs"
            title="Ajuste o prompt por instrução em linguagem natural mantendo a modelo consistente"
          >
            <Wand2 className="w-3.5 h-3.5 text-violet-400" />
            <span>Refinar com IA</span>
          </button>

          {/* 3 Variações Button */}
          {!variations ? (
            <button
              type="button"
              onClick={handleGenerateVariations}
              disabled={isGeneratingVariations}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs transition-colors cursor-pointer shadow-xs"
              title="Gerar 3 ângulos de catálogo da mesma modelo: Corpo Inteiro, 3/4 e Detalhe"
            >
              <Grid3X3 className={`w-3.5 h-3.5 text-indigo-400 ${isGeneratingVariations ? 'animate-spin' : ''}`} />
              <span>{isGeneratingVariations ? 'Gerando 3 Ângulos...' : '3 Variações de Catálogo'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={copyAllVariations}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-indigo-600/50 text-indigo-300 font-medium text-xs transition-colors cursor-pointer shadow-xs"
              title="Copiar os 3 prompts de variação juntos"
            >
              {copiedSection === 'all_variations' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>3 Variações Copiadas!</span>
                </>
              ) : (
                <>
                  <Layers3 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Copiar Todas as 3</span>
                </>
              )}
            </button>
          )}

          {/* Como Usar com Foto Button */}
          <button
            type="button"
            onClick={() => setShowTryOnGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 font-medium text-xs transition-colors whitespace-nowrap cursor-pointer shadow-xs"
            title="Aprenda a combinar o prompt com a foto da roupa real"
          >
            <Camera className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Como Usar c/ Foto</span>
            <span className="sm:hidden">Guia Foto</span>
          </button>

          {/* Primary Copy Current Prompt Button */}
          <button
            type="button"
            onClick={() => copyToClipboard(displayFullCopy, 'all')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition-colors whitespace-nowrap"
          >
            {copiedSection === 'all' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>{i18n.app.copied}</span>
              </>
            ) : (
              <>
                <CopyCheck className="w-3.5 h-3.5" />
                <span>{i18n.app.copy_all}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Variations Switcher Bar if active */}
      {variations && (
        <div className="bg-slate-950/80 border-b border-indigo-900/40 p-2 sm:px-5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
              <Grid3X3 className="w-3.5 h-3.5" /> 3 Variações de Catálogo:
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            {variations.map((v, idx) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveVariationIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  activeVariationIndex === idx
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/50'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <span>{v.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({v.word_count}p)</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Warnings & Lint Alerts */}
      {displayWarnings && displayWarnings.length > 0 && (
        <div className="px-4 py-2.5 bg-amber-950/30 border-b border-amber-900/40 text-xs text-amber-300">
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setShowWarnings(!showWarnings)}>
            <div className="flex items-center gap-2 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{displayWarnings.length} observação(ões) de qualidade e conformidade</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showWarnings ? 'rotate-180' : ''}`} />
          </div>

          {showWarnings && (
            <ul className="mt-2 pl-5 list-disc space-y-1 text-slate-300">
              {displayWarnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-800 bg-slate-950/20 px-4">
        <button
          type="button"
          onClick={() => setActiveTab('prompt')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'prompt'
              ? 'border-indigo-500 text-white bg-slate-800/30'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          {i18n.tabs.prompt}
          <span className="text-[11px] font-mono text-slate-500 tabular-nums">
            ({displayWordCount} palavras)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('negative')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'negative'
              ? 'border-indigo-500 text-white bg-slate-800/30'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          {i18n.tabs.negative}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chunks')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'chunks'
              ? 'border-indigo-500 text-white bg-slate-800/30'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          {i18n.tabs.chunks}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('params')}
          className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'params'
              ? 'border-indigo-500 text-white bg-slate-800/30'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <span>Parâmetros</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 sm:p-5 flex-1 bg-slate-900/50">
        {/* Tab: Prompt */}
        {activeTab === 'prompt' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                Prompt fotorrealista otimizado para{' '}
                <strong className="text-indigo-400 uppercase">{result.adapter}</strong>
                {currentVariation && (
                  <span className="ml-1 text-slate-400 font-normal">
                    • {currentVariation.angle_description}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(displayPrompt, 'prompt')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                {copiedSection === 'prompt' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar Prompt</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 text-slate-200 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-all relative group shadow-inner">
              {displayPrompt}
            </div>
          </div>
        )}

        {/* Tab: Negative */}
        {activeTab === 'negative' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Restrições anatômicas, mãos corretas, produto fiel e sem pele plástica</span>
              <button
                type="button"
                onClick={() => copyToClipboard(displayNegative, 'negative')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                {copiedSection === 'negative' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar Negative</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 text-slate-300 font-mono text-xs sm:text-sm leading-relaxed whitespace-pre-wrap select-all shadow-inner">
              {displayNegative}
            </div>
          </div>
        )}

        {/* Tab: Chunks (Editable with instant reassemble) */}
        {activeTab === 'chunks' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-indigo-950/30 border border-indigo-900/40 rounded-2xl text-xs text-indigo-300">
              <span>
                Edite individualmente qualquer bloco descritivo abaixo. Clique em &quot;Remontar Prompt&quot; para reprocessar deterministamente sem nova chamada à IA.
              </span>
              <button
                type="button"
                onClick={() => handleReassemble(result.adapter, result.aspect_ratio, editableChunks)}
                disabled={isReassembling}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isReassembling ? 'animate-spin' : ''}`} />
                <span>{isReassembling ? i18n.app.reassembling : i18n.app.reassemble_button}</span>
              </button>
            </div>

            <div className="space-y-3">
              {Object.entries(editableChunks).map(([chunkKey, chunkVal]) => {
                const valStr = String(chunkVal || '');
                const words = valStr.trim().split(/\s+/).filter(Boolean).length;
                const isProduct = chunkKey === 'product_integration';
                const isLockedIdentity = ['subject_core', 'face_details', 'skin_texture', 'hair', 'body_posture'].includes(chunkKey) && activeProfileName;

                return (
                  <div
                    key={chunkKey}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isProduct
                        ? 'border-indigo-500/50 bg-indigo-950/20'
                        : isLockedIdentity
                        ? 'border-violet-500/40 bg-violet-950/15'
                        : 'border-slate-800 bg-slate-950/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <span className="font-mono font-medium text-slate-200 flex items-center gap-1.5">
                        <span>{chunkKey}</span>
                        {isProduct && <span className="text-indigo-400 font-bold">★ DESTAQUE PRODUTO</span>}
                        {isLockedIdentity && (
                          <span className="text-violet-400 font-bold flex items-center gap-0.5 text-[10px] bg-violet-950/80 px-1.5 py-0.5 rounded-md border border-violet-800/50">
                            <Lock className="w-2.5 h-2.5" /> MODELO FIXADA
                          </span>
                        )}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px] tabular-nums">
                        {words} palavras
                      </span>
                    </div>

                    <textarea
                      rows={2}
                      value={valStr}
                      onChange={(e) => handleChunkChange(chunkKey, e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab: Parameters */}
        {activeTab === 'params' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Configurações e parâmetros técnicos recomendados para {result.adapter.toUpperCase()}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(JSON.stringify(displayParams, null, 2), 'params')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs transition-colors cursor-pointer"
              >
                {copiedSection === 'params' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar Parâmetros</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800/80 font-mono text-xs text-indigo-300 whitespace-pre-wrap select-all shadow-inner">
              {JSON.stringify(displayParams, null, 2)}
            </div>
          </div>
        )}
      </div>

      {/* Footer / AI Disclosure */}
      <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-950 text-[11px] text-slate-500 flex flex-wrap items-center justify-between gap-2">
        <span>Lembrete de Conformidade: Rotule conteúdos gerados por IA ao publicar em plataformas de e-commerce.</span>
        {result.request_id && (
          <span className="font-mono text-slate-600">ID: {result.request_id}</span>
        )}
      </div>

      {/* Guide Modal to use with real product image */}
      <TryOnGuideModal
        isOpen={showTryOnGuide}
        onClose={() => setShowTryOnGuide(false)}
        prompt={displayPrompt}
        targetGenerator={result.adapter}
      />

      {/* Refine with AI Modal */}
      <RefinePromptModal
        isOpen={showRefineModal}
        onClose={() => setShowRefineModal(false)}
        result={result}
        onApplyRefine={onUpdateResult}
        formValues={formValues}
        lockedChunks={lockedChunks}
      />
    </div>
  );
};
