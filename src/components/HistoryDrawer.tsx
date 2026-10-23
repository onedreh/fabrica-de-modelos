import React, { useState, useRef } from 'react';
import {
  X,
  Search,
  Star,
  Copy,
  Check,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Clock,
  Sparkles,
  Layers
} from 'lucide-react';
import { GenerationHistoryItem } from '../hooks/useHistory';
import { i18n } from '../i18n/ptBR';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: GenerationHistoryItem[];
  onToggleFavorite: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearHistory: () => void;
  onDuplicate: (formValues: Record<string, any>, item: GenerationHistoryItem) => void;
  onExportJson: () => void;
  onImportJson: (jsonString: string) => { success: boolean; count: number; error?: string };
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onToggleFavorite,
  onRemoveItem,
  onClearHistory,
  onDuplicate,
  onExportJson,
  onImportJson
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Filter history items
  const filtered = history.filter((item) => {
    if (onlyFavorites && !item.favorite) return false;
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    const productName = String(item.form_values?.product_name || '').toLowerCase();
    const productType = String(item.form_values?.product_type || '').toLowerCase();
    const prompt = item.prompt.toLowerCase();
    const adapter = item.adapter.toLowerCase();

    return productName.includes(term) || productType.includes(term) || prompt.includes(term) || adapter.includes(term);
  });

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = onImportJson(content);
        if (res.success) {
          setImportStatus(`Sucesso! ${res.count} gerações importadas.`);
        } else {
          setImportStatus(`Erro: ${res.error}`);
        }
        setTimeout(() => setImportStatus(null), 3000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">
              {i18n.history.title}
            </h2>
            <span className="text-[11px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full tabular-nums">
              {history.length}/50
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 border-b border-slate-800/80 space-y-2 bg-slate-950/20">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder={i18n.history.search_placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                onlyFavorites
                  ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{i18n.history.filter_favorites}</span>
            </button>

            {history.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(i18n.history.clear_confirm)) {
                    onClearHistory();
                  }
                }}
                className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
              >
                {i18n.history.clear_all}
              </button>
            )}
          </div>

          {importStatus && (
            <div className="text-[11px] px-2.5 py-1 rounded bg-indigo-950 border border-indigo-800 text-indigo-300">
              {importStatus}
            </div>
          )}
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Layers className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs font-medium text-slate-400">{i18n.history.empty_title}</p>
              <p className="text-[11px] max-w-xs mx-auto leading-relaxed">{i18n.history.empty_desc}</p>
            </div>
          ) : (
            filtered.map((item) => {
              const productName = item.form_values?.product_name || item.form_values?.product_type || 'Produto sem título';
              const dateStr = new Date(item.created_at).toLocaleString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={item.id}
                  className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3.5 space-y-2.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-semibold text-white line-clamp-1">
                        {productName}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                        <span>{item.adapter.toUpperCase()}</span>
                        <span>·</span>
                        <span>{item.aspect_ratio}</span>
                        <span>·</span>
                        <span>{dateStr}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(item.id)}
                        className="p-1 rounded text-slate-400 hover:text-amber-400 transition-colors"
                        title="Favoritar"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            item.favorite ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 transition-colors"
                        title={i18n.history.delete_action}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Prompt preview */}
                  <p className="text-[11px] text-slate-300 font-mono line-clamp-3 bg-slate-900/90 p-2 rounded-lg border border-slate-800/60 leading-relaxed">
                    {item.prompt}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => onDuplicate(item.form_values, item)}
                      className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{i18n.history.duplicate_action}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(item.prompt, item.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-medium flex items-center gap-1 transition-colors"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{i18n.app.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with JSON Import/Export */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 py-1.5 px-3 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{i18n.history.import_json}</span>
          </button>

          <button
            type="button"
            onClick={onExportJson}
            disabled={history.length === 0}
            className="flex-1 py-1.5 px-3 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{i18n.history.export_json}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
