import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Camera,
  Layers,
  ArrowRight,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sliders
} from 'lucide-react';

interface TryOnGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  targetGenerator: string;
}

export const TryOnGuideModal: React.FC<TryOnGuideModalProps> = ({
  isOpen,
  onClose,
  prompt,
  targetGenerator
}) => {
  const [selectedTool, setSelectedTool] = useState<'midjourney' | 'leonardo' | 'flux_sd'>('midjourney');
  const [copiedParam, setCopiedParam] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedParam(key);
    setTimeout(() => setCopiedParam(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-5 sm:p-6 text-slate-200 shadow-2xl relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                Como Usar com a Foto do Produto Real
              </h3>
              <p className="text-xs text-slate-400">
                Aprenda a combinar o prompt do Prompt Factory com a foto da sua roupa ou acessório
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tool Selector Tabs */}
        <div className="flex border-b border-slate-800/80 bg-slate-950/40 p-1.5 rounded-xl mt-4 shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setSelectedTool('midjourney')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              selectedTool === 'midjourney'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Midjourney
          </button>
          <button
            type="button"
            onClick={() => setSelectedTool('leonardo')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              selectedTool === 'leonardo'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Leonardo AI
          </button>
          <button
            type="button"
            onClick={() => setSelectedTool('flux_sd')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              selectedTool === 'flux_sd'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Flux / Fooocus / SD
          </button>
        </div>

        {/* Content Body */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1 text-xs leading-relaxed text-slate-300">
          {selectedTool === 'midjourney' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-[11px]">1</span>
                  Envie a foto do seu produto
                </span>
                <p className="text-slate-400 pl-6">
                  No Discord do Midjourney ou na interface web, arraste a foto do produto (em fundo branco ou manequim) para o chat e envie. Copie o link da imagem (.jpg ou .png).
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-[11px]">2</span>
                  Monte a chamada no comando /imagine
                </span>
                <p className="text-slate-400 pl-6">
                  Cole o link da foto no começo do prompt, seguido pelo prompt do Prompt Factory e o parâmetro <code className="text-indigo-300 font-mono">--iw 2.0</code> (peso máximo para copiar a roupa com fidelidade).
                </p>
                <div className="ml-6 p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-200 flex items-center justify-between gap-2">
                  <span className="truncate">/imagine prompt: &lt;URL_DA_FOTO&gt; [SEU_PROMPT] --iw 2.0</span>
                  <button
                    type="button"
                    onClick={() => copyText('--iw 2.0', 'iw')}
                    className="shrink-0 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 flex items-center gap-1"
                  >
                    {copiedParam === 'iw' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>Copiar --iw</span>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-[11px]">3</span>
                  Fidelidade de Estilo e Cor (--sref)
                </span>
                <p className="text-slate-400 pl-6">
                  Se você quiser que o Midjourney puxe a textura e cor exatas da peça, adicione no final do prompt: <code className="text-indigo-300 font-mono">--sref &lt;URL_DA_FOTO&gt;</code>.
                </p>
              </div>
            </div>
          )}

          {selectedTool === 'leonardo' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-[11px]">1</span>
                  Ative o recurso &quot;Image Guidance&quot;
                </span>
                <p className="text-slate-400 pl-6">
                  Na barra lateral esquerda do Leonardo AI, ative a opção <strong>Image Guidance</strong> e faça o upload da foto do produto que você vende.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-[11px]">2</span>
                  Selecione o tipo &quot;Content&quot; ou &quot;Edge&quot;
                </span>
                <p className="text-slate-400 pl-6">
                  Defina a influência (*Strength*) entre <strong>0.70 e 0.85</strong>. Isso faz com que a IA mantenha o formato e estampa do seu produto sem distorção.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-[11px]">3</span>
                  Cole o prompt do Prompt Factory
                </span>
                <p className="text-slate-400 pl-6">
                  Cole o prompt positivo na barra superior e o Negative Prompt no campo de restrições. O Leonardo gerará a modelo vestindo a peça de forma realista.
                </p>
              </div>
            </div>
          )}

          {selectedTool === 'flux_sd' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-[11px]">1</span>
                  No Fooocus ou WebUI (SDXL / Flux)
                </span>
                <p className="text-slate-400 pl-6">
                  Marque a caixa <strong>Input Image</strong> e selecione a aba <strong>Image Prompt</strong>. Faça o upload da foto do produto e escolha o modo <strong>CPDS</strong> ou <strong>FaceSwap/IP-Adapter</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <span className="font-semibold text-white text-xs flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-[11px]">2</span>
                  Para Virtual Try-On com IA Dedicada
                </span>
                <p className="text-slate-400 pl-6">
                  Você pode usar o modelo open-source <strong>IDM-VTON</strong> ou <strong>CatVTON</strong>: envie a foto gerada da modelo no campo de pessoa e a foto do produto no campo de roupa para troca de tecido instantânea milimétrica.
                </p>
              </div>
            </div>
          )}

          {/* Golden Tip Box */}
          <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-700/50 text-indigo-200 space-y-1">
            <span className="font-semibold text-xs flex items-center gap-1.5 text-indigo-300">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              Por que o Prompt Factory funciona tão bem com fotos de referência?
            </span>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              O prompt descreve exatamente o caimento anatômico, tecido e cor, e o negative prompt bloqueia <em>&quot;altered product design&quot;</em> e <em>&quot;product merged with skin&quot;</em>. Isso força a ferramenta a obedecer a foto real em vez de inventar uma estampa aleatória.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Entendido, fechar guia
          </button>
        </div>
      </div>
    </div>
  );
};
