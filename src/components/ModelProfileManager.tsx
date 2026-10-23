import React, { useState } from 'react';
import {
  UserCheck,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Download,
  Upload,
  Sparkles,
  ChevronRight,
  Shield,
  Layers,
  Check
} from 'lucide-react';
import { ModelProfile } from '../types/profile';

interface ModelProfileManagerProps {
  profiles: ModelProfile[];
  activeProfile: ModelProfile | null;
  onSelectProfile: (id: string | null) => void;
  onSaveCurrentAsProfile: (name: string, description: string) => void;
  onDeleteProfile: (id: string) => void;
  onExportProfiles: () => void;
  onImportProfiles: (jsonStr: string) => void;
  currentFormValues: Record<string, any>;
  currentResultChunks?: Record<string, string>;
  onLockCurrentChunksToProfile?: (profileId: string) => void;
}

export const ModelProfileManager: React.FC<ModelProfileManagerProps> = ({
  profiles,
  activeProfile,
  onSelectProfile,
  onSaveCurrentAsProfile,
  onDeleteProfile,
  onExportProfiles,
  onImportProfiles,
  currentFormValues,
  currentResultChunks,
  onLockCurrentChunksToProfile
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileDesc, setNewProfileDesc] = useState('');
  const [showManageModal, setShowManageModal] = useState(false);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    onSaveCurrentAsProfile(newProfileName.trim(), newProfileDesc.trim());
    setNewProfileName('');
    setNewProfileDesc('');
    setShowCreateModal(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) onImportProfiles(content);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Active Profile Banner or Quick Selector */}
      {activeProfile ? (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 relative overflow-hidden shadow-lg shadow-indigo-950/20">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div className="flex items-start sm:items-center gap-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${activeProfile.avatar_color || 'from-indigo-600 to-violet-700'} flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0`}>
                <Lock className="w-5 h-5 text-white/90" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/90 border border-indigo-700/50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3 text-indigo-300" /> Identidade Travada
                  </span>
                  <span className="text-xs text-slate-400">Garante a mesma modelo em 20+ produtos</span>
                </div>
                <h4 className="font-semibold text-slate-100 text-sm mt-0.5">{activeProfile.name}</h4>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                  {activeProfile.ethnicity} • {activeProfile.age_range} anos • {activeProfile.skin_tone} • {activeProfile.hair_type}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                type="button"
                onClick={() => setShowManageModal(true)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
              >
                Trocar Modelo
              </button>
              <button
                type="button"
                onClick={() => onSelectProfile(null)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/50 hover:text-rose-300 border border-slate-800 text-xs font-medium text-slate-400 transition-colors"
                title="Desbloquear para configurar modelo livre"
              >
                <Unlock className="w-3.5 h-3.5" />
                <span>Desafixar</span>
              </button>
            </div>
          </div>

          {/* Locked Chunks status */}
          <div className="mt-3 pt-3 border-t border-indigo-900/40 flex flex-wrap items-center justify-between gap-2 text-[11px] text-indigo-300">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>Chunks de Rosto, Pele, Cabelo e Corpo travados matematicamente no prompt.</span>
            </div>
            {currentResultChunks && onLockCurrentChunksToProfile && (
              <button
                type="button"
                onClick={() => onLockCurrentChunksToProfile(activeProfile.id)}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
              >
                Atualizar texto fixo da modelo com a geração atual
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                <h4 className="text-sm font-semibold text-slate-200">Perfis de Modelos Reutilizáveis</h4>
                <span className="text-[10px] bg-indigo-950 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-800/60">
                  Fase 2
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Fixe uma modelo fictícia consistente para todo o seu catálogo de roupas ou crie uma nova abaixo.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Salvar Modelo Atual</span>
              </button>
              <button
                type="button"
                onClick={() => setShowManageModal(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Ver Todas ({profiles.length})
              </button>
            </div>
          </div>

          {/* Quick Profile Cards Carousel */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {profiles.slice(0, 3).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectProfile(p.id)}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-indigo-500/50 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${p.avatar_color || 'from-indigo-600 to-violet-700'} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                    {p.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 truncate">
                      {p.name.split('–')[0].trim()}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {p.ethnicity} • {p.age_range} anos
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Modal: Salvar Modelo Atual como Perfil */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-slate-100 text-sm sm:text-base">Salvar Modelo como Perfil</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              As características atuais de etnia ({currentFormValues.ethnicity || 'não definida'}), idade ({currentFormValues.age_range || '26-30'}), tom de pele e cabelo serão salvas para você poder reutilizar a mesma modelo fictícia em qualquer produto.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nome da Modelo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Clara – Modelo TikTok Morena"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Descrição ou nicho (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Ideal para vestidos e looks casuais femininos"
                  value={newProfileDesc}
                  onChange={(e) => setNewProfileDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p><strong>Etnia:</strong> {currentFormValues.ethnicity || 'Latina / Brasileira'}</p>
                <p><strong>Idade:</strong> {currentFormValues.age_range || '26-30'}</p>
                <p><strong>Cabelo:</strong> {currentFormValues.hair_type || 'Ondulado'} ({currentFormValues.hair_color || 'Castanho'})</p>
                <p><strong>Corpo:</strong> {currentFormValues.body_type || 'Equilibrado'}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  Salvar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Gerenciar Todos os Perfis */}
      {showManageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-slate-100 text-base">Gerenciador de Perfis de Modelos</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="text-slate-400 hover:text-slate-200 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 shrink-0">
              <p className="text-xs text-slate-400">
                Selecione uma modelo salva para fixar sua identidade em todas as gerações de produtos.
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onExportProfiles}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                  title="Exportar perfis em arquivo JSON"
                >
                  <Download className="w-3 h-3" />
                  <span>Exportar</span>
                </button>
                <label className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors cursor-pointer">
                  <Upload className="w-3 h-3" />
                  <span>Importar</span>
                  <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            </div>

            {/* List */}
            <div className="space-y-2.5 overflow-y-auto pr-1 flex-1">
              {profiles.map((p) => {
                const isSelected = activeProfile?.id === p.id;
                return (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/50'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.avatar_color || 'from-indigo-600 to-violet-700'} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs`}>
                        {p.name.slice(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-100 text-sm truncate">{p.name}</h4>
                          {isSelected && (
                            <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Ativa
                            </span>
                          )}
                        </div>

                        {p.description && (
                          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{p.description}</p>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px] text-slate-300 font-mono">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{p.ethnicity}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{p.age_range} anos</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{p.skin_tone}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">{p.hair_type}</span>
                          {p.locked_chunks && (
                            <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                              🔒 Chunks Fixados
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {isSelected ? (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectProfile(null);
                            setShowManageModal(false);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
                        >
                          Desafixar
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onSelectProfile(p.id);
                            setShowManageModal(false);
                          }}
                          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs"
                        >
                          Usar Modelo
                        </button>
                      )}

                      {!p.id.startsWith('prof_sofia') && !p.id.startsWith('prof_beatriz') && !p.id.startsWith('prof_camila') && (
                        <button
                          type="button"
                          onClick={() => onDeleteProfile(p.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Excluir este perfil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowManageModal(false);
                  setShowCreateModal(true);
                }}
                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Salvar configuração atual como novo perfil</span>
              </button>

              <button
                type="button"
                onClick={() => setShowManageModal(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
