import React, { useState } from 'react';
import { ShieldCheck, AlertCircle, Info, X } from 'lucide-react';
import { i18n } from '../i18n/ptBR';

export const ComplianceBanner: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2.5 text-xs text-slate-300 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-medium text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              {i18n.compliance.banner_adult}
            </span>
            <span className="hidden sm:inline text-slate-500">·</span>
            <span className="text-slate-400 truncate max-w-[260px] sm:max-w-md md:max-w-lg lg:max-w-xl">
              {i18n.compliance.banner_tiktok}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-indigo-400 hover:text-indigo-300 font-medium underline-offset-2 hover:underline transition-colors flex items-center gap-1 shrink-0"
          >
            <Info className="w-3 h-3" />
            Políticas de Segurança
          </button>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 text-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">
                  {i18n.compliance.banner_modal_title}
                </h3>
                <p className="text-xs text-slate-400">Diretrizes inegociáveis do sistema</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-300 leading-relaxed mb-6">
              <p>
                <strong className="text-white">1. Modelo Adulta (21+):</strong> O sistema opera exclusivamente com modelos adultas fictícias a partir de 21 anos. Qualquer menção a menores ou colegiais é bloqueada no backend antes do envio à IA.
              </p>
              <p>
                <strong className="text-white">2. Pessoa 100% Fictícia:</strong> É proibido gerar ou tentar simular semelhança com celebridades, influenciadores ou pessoas reais.
              </p>
              <p>
                <strong className="text-white">3. Sem Nudez ou Conteúdo Explícito:</strong> Todas as criações focam estritamente no produto comercial, caimento de roupas e acessórios.
              </p>
              <p>
                <strong className="text-white">4. Rotulagem TikTok Shop:</strong> Lembre-se de seguir as diretrizes da plataforma informando o uso de conteúdo gerado por IA quando necessário.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors"
            >
              Compreendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
