import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Clock,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  SendHorizontal,
  Zap,
  Check
} from 'lucide-react';
import { FORM_SECTIONS, PRESETS, PRESET_COMPLETE_EXAMPLES } from './config/formSchema';
import { FormSection } from './components/FormSection';
import { ResultCard, GenerationResult } from './components/ResultCard';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ComplianceBanner } from './components/ComplianceBanner';
import { LivePromptTokensBar } from './components/LivePromptTokensBar';
import { MobileBottomSheet } from './components/MobileBottomSheet';
import { TryOnGuideModal } from './components/TryOnGuideModal';
import { useHistory } from './hooks/useHistory';
import { i18n } from './i18n/ptBR';

// Build initial values from schema defaults
function buildDefaultFormValues(): Record<string, any> {
  const defaults: Record<string, any> = {};
  for (const section of FORM_SECTIONS) {
    for (const field of section.fields) {
      if (field.default !== undefined) {
        defaults[field.id] = field.default;
      }
    }
  }
  return defaults;
}

export default function App() {
  const [formValues, setFormValues] = useState<Record<string, any>>(buildDefaultFormValues);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('none');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showMobileTryOnGuide, setShowMobileTryOnGuide] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const {
    history,
    addHistoryItem,
    removeHistoryItem,
    toggleFavorite,
    clearHistory,
    exportJson,
    importJson
  } = useHistory();

  // Progress calculation
  const totalFields = useMemo(() => {
    return FORM_SECTIONS.flatMap(s => s.fields).filter(f => f.type !== 'checkbox').length;
  }, []);

  const filledFieldsCount = useMemo(() => {
    return FORM_SECTIONS.flatMap(s => s.fields)
      .filter(f => f.type !== 'checkbox')
      .filter(f => {
        const val = formValues[f.id];
        return val !== undefined && val !== null && String(val).trim() !== '';
      }).length;
  }, [formValues]);

  const progressPercentage = Math.round((filledFieldsCount / totalFields) * 100);

  // Field change handler
  const handleFieldChange = (id: string, val: any) => {
    setFormValues(prev => ({
      ...prev,
      [id]: val
    }));
  };

  // Preset applicator
  const handleApplyPreset = (presetKey: string) => {
    setSelectedPreset(presetKey);
    if (presetKey === 'none') return;

    const presetData = PRESETS[presetKey];
    if (presetData) {
      setFormValues(prev => ({
        ...prev,
        ...presetData,
        preset: presetKey
      }));
    }
  };

  // Auto-fill entire form with a realistic example tailored to the preset
  const handleFillPresetExample = (presetKey?: string) => {
    const key = presetKey || (selectedPreset !== 'none' ? selectedPreset : 'ecommerce_clean');
    const example = PRESET_COMPLETE_EXAMPLES[key];

    if (example) {
      setFormValues({
        ...buildDefaultFormValues(),
        ...example
      });
      setSelectedPreset(key);

      const presetNames: Record<string, string> = {
        ecommerce_clean: 'E-commerce Clean (Vestido Midi Terracota)',
        lifestyle_tiktok: 'Lifestyle TikTok (Jaqueta Jeans Cropped)',
        editorial: 'Editorial de Moda (Blazer Alfaiataria Esmeralda)',
        luxury_campaign: 'Campanha de Luxo (Colar Banhado a Ouro)'
      };

      showToast(`Exemplo completo de "${presetNames[key] || key}" preenchido com sucesso!`);
    }
  };

  // Reset form
  const handleResetForm = () => {
    if (confirm('Deseja redefinir todos os campos do formulário para os padrões iniciais?')) {
      setFormValues(buildDefaultFormValues());
      setSelectedPreset('none');
      setErrorMessage(null);
    }
  };

  // Main generation submission
  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_values: formValues
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || i18n.errors.generic);
      }

      setResult(data);

      // Save to localStorage history
      addHistoryItem({
        form_values: formValues,
        profile_id: null,
        adapter: data.adapter,
        aspect_ratio: data.aspect_ratio,
        prompt: data.prompt,
        negative_prompt: data.negative_prompt,
        chunks: data.chunks,
        quality_score: data.quality_score ?? 85,
        params: data.params,
        formatted_full_copy: data.formatted_full_copy,
        word_count: data.word_count
      });

      // Scroll smoothly to result on smaller screens
      if (window.innerWidth < 1024) {
        setTimeout(() => {
          document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    } catch (err: any) {
      setErrorMessage(err.message || i18n.errors.generic);
    } finally {
      setIsLoading(false);
    }
  };

  // Duplicate from history
  const handleDuplicateFromHistory = (values: Record<string, any>, item: any) => {
    setFormValues({
      ...buildDefaultFormValues(),
      ...values
    });
    setResult({
      prompt: item.prompt,
      negative_prompt: item.negative_prompt,
      chunks: item.chunks,
      adapter: item.adapter,
      aspect_ratio: item.aspect_ratio,
      params: item.params || {},
      formatted_full_copy: item.formatted_full_copy || item.prompt,
      word_count: item.word_count || 150,
      quality_score: item.quality_score,
      warnings: []
    });
    setIsHistoryOpen(false);
  };

  // Shortcut Cmd/Ctrl + Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isLoading) {
          handleGenerate();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formValues, isLoading]);

  return (
    <div className="min-h-screen bg-[#070a11] studio-grid-pattern text-slate-100 flex flex-col font-sans selection:bg-indigo-600 selection:text-white relative">
      {/* Compliance Top Banner */}
      <ComplianceBanner />

      {/* Main Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white">
                  Prompt Factory
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300">
                  Modelos
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                TikTok Shop & E-commerce Fotorrealista
              </p>
            </div>
          </div>

          {/* Header Controls */}
          <div className="flex items-center gap-3">
            {/* Quick Demo Pre-fill Button */}
            <button
              type="button"
              onClick={() => handleFillPresetExample()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-xs font-semibold text-indigo-200 transition-colors shadow-sm"
              title="Preencher todo o formulário com dados de exemplo realistas"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Exemplo Rápido</span>
              <span className="sm:hidden">Exemplo</span>
            </button>

            {/* Quick Preset Selector */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-400 font-medium">Preset:</span>
              <select
                value={selectedPreset}
                onChange={(e) => handleApplyPreset(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="none" className="bg-slate-900">Personalizado</option>
                <option value="ecommerce_clean" className="bg-slate-900">E-commerce Clean</option>
                <option value="lifestyle_tiktok" className="bg-slate-900">Lifestyle TikTok</option>
                <option value="editorial" className="bg-slate-900">Editorial de Moda</option>
                <option value="luxury_campaign" className="bg-slate-900">Campanha de Luxo</option>
              </select>
            </div>

            {/* Reset Form Button */}
            <button
              type="button"
              onClick={handleResetForm}
              className="text-slate-400 hover:text-slate-200 p-2 rounded-lg hover:bg-slate-800/60 transition-colors"
              title={i18n.app.reset_form}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* History Toggle Button */}
            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-200 transition-colors relative"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Histórico</span>
              {history.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center font-mono">
                  {history.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Form Fill Progress Bar */}
        <div className="w-full bg-slate-900 h-1 overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-indigo-400 h-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 bg-emerald-950/95 border border-emerald-600/80 text-emerald-200 text-xs font-medium px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 backdrop-blur-md">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Schema Accordion (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick Demo Pre-fill Bar */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-xl p-3.5 space-y-2.5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-indigo-600/20 text-indigo-400">
                  <Zap className="w-4 h-4 text-amber-400" />
                </span>
                <span className="text-xs font-semibold text-white">
                  Exemplos de Demonstração em 1 Clique:
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                Preencha o formulário completo e teste agora
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleFillPresetExample('ecommerce_clean')}
                className={`px-2.5 py-2 rounded-lg text-left border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                  selectedPreset === 'ecommerce_clean'
                    ? 'bg-indigo-900/60 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <span className="font-semibold truncate">E-commerce Clean</span>
                <span className="text-[10px] text-slate-400 truncate">Vestido Terracota</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillPresetExample('lifestyle_tiktok')}
                className={`px-2.5 py-2 rounded-lg text-left border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                  selectedPreset === 'lifestyle_tiktok'
                    ? 'bg-indigo-900/60 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <span className="font-semibold truncate">Lifestyle TikTok</span>
                <span className="text-[10px] text-slate-400 truncate">Jaqueta Jeans</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillPresetExample('editorial')}
                className={`px-2.5 py-2 rounded-lg text-left border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                  selectedPreset === 'editorial'
                    ? 'bg-indigo-900/60 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <span className="font-semibold truncate">Editorial Moda</span>
                <span className="text-[10px] text-slate-400 truncate">Blazer Esmeralda</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillPresetExample('luxury_campaign')}
                className={`px-2.5 py-2 rounded-lg text-left border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                  selectedPreset === 'luxury_campaign'
                    ? 'bg-indigo-900/60 border-indigo-500 text-white shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <span className="font-semibold truncate">Campanha Luxo</span>
                <span className="text-[10px] text-slate-400 truncate">Colar Banhado a Ouro</span>
              </button>
            </div>
          </div>

          {/* Real-time DNA & Active Tokens Bar */}
          <LivePromptTokensBar formValues={formValues} />

          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-base font-bold text-white">
                Especificação da Imagem
              </h2>
              <p className="text-xs text-slate-400">
                Preencha os detalhes do produto e modelo. A IA completa com alto realismo os campos opcionais.
              </p>
            </div>

            <div className="text-right text-xs text-slate-400 font-mono">
              <span className="text-white font-bold">{filledFieldsCount}</span>/{totalFields} campos
            </div>
          </div>

          {/* Form Sections */}
          <div className="space-y-3">
            {FORM_SECTIONS.map((section, index) => (
              <FormSection
                key={section.id}
                section={section}
                formValues={formValues}
                onFieldChange={handleFieldChange}
                defaultOpen={index === 0 || index === 1 || index === 5} // Open mode, identity, and product by default
              />
            ))}
          </div>

          {/* Desktop "Gerar Prompt" Button */}
          <div className="pt-4 hidden lg:block">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold text-base shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{i18n.app.generating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  <span>{i18n.app.generate_button}</span>
                  <span className="text-xs font-mono font-normal opacity-70 ml-2 border border-white/20 px-2 py-0.5 rounded">
                    Ctrl + Enter
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output / Result Panel (5 cols) */}
        <div id="result-section" className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          {/* Error Message Box */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-200 text-xs sm:text-sm space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center gap-2 font-semibold text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Atenção</span>
              </div>
              <p className="leading-relaxed text-xs">{errorMessage}</p>
              <div className="pt-1 flex gap-3">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="text-xs font-medium text-white bg-rose-800 hover:bg-rose-700 px-3 py-1 rounded transition-colors"
                >
                  {i18n.errors.retry}
                </button>
                <button
                  type="button"
                  onClick={() => setErrorMessage(null)}
                  className="text-xs text-rose-400 hover:text-rose-200 transition-colors"
                >
                  {i18n.errors.dismiss}
                </button>
              </div>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-slate-800 rounded w-1/3" />
                <div className="h-5 bg-slate-800 rounded w-1/4" />
              </div>
              <div className="h-32 bg-slate-950 rounded-xl" />
              <div className="h-10 bg-slate-800 rounded-lg w-full" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-800 rounded w-5/6" />
                <div className="h-4 bg-slate-800 rounded w-4/6" />
              </div>
              <div className="text-center py-2 text-xs text-indigo-400 font-medium flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Orquestrando 5 grupos de chunks em paralelo...</span>
              </div>
            </div>
          )}

          {/* Result Card or Empty State */}
          {!isLoading && result && (
            <ResultCard
              result={result}
              onUpdateResult={setResult}
              formValues={formValues}
            />
          )}

          {!isLoading && !result && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-indigo-400 shadow-inner">
                <SendHorizontal className="w-7 h-7" />
              </div>

              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="font-semibold text-sm text-white">
                  {i18n.app.empty_result_title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {i18n.app.empty_result_desc}
                </p>
              </div>

              <div className="pt-2 text-left bg-slate-950/60 p-4 rounded-xl border border-slate-800/60 text-xs text-slate-300 space-y-2">
                <div className="font-medium text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Destaques da Arquitetura:</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-slate-400 text-[11px]">
                  <li>Pipeline paralelo de 5 grupos de chunks via Gemini com saída estruturada.</li>
                  <li>Montagem determinística por código sem distorções de formato.</li>
                  <li>Fidelidade ao tecido, cor, caimento e detalhes de costura.</li>
                  <li>Adaptadores prontos para Flux, Midjourney (--ar, --no), SD3 e outros.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Sticky Mobile Footer with prominent "Gerar Prompt" button */}
      <div className="lg:hidden sticky bottom-0 z-30 p-3 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isLoading}
          className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>{i18n.app.generating}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{i18n.app.generate_button}</span>
            </>
          )}
        </button>
      </div>

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onToggleFavorite={toggleFavorite}
        onRemoveItem={removeHistoryItem}
        onClearHistory={clearHistory}
        onDuplicate={handleDuplicateFromHistory}
        onExportJson={exportJson}
        onImportJson={importJson}
      />

      {/* Mobile Interactive Bottom Sheet */}
      <MobileBottomSheet
        result={result}
        onOpenTryOnGuide={() => setShowMobileTryOnGuide(true)}
        onUpdateResult={setResult}
        formValues={formValues}
      />

      {/* Try-on Guide Modal for mobile trigger */}
      <TryOnGuideModal
        isOpen={showMobileTryOnGuide}
        onClose={() => setShowMobileTryOnGuide(false)}
        prompt={result?.prompt || ''}
        targetGenerator={result?.adapter || 'flux'}
      />
    </div>
  );
}
