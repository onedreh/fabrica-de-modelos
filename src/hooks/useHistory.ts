import { useState, useEffect, useCallback } from 'react';

export interface GenerationHistoryItem {
  id: string;
  created_at: string;
  form_values: Record<string, any>;
  profile_id: string | null;
  adapter: string;
  aspect_ratio: string;
  prompt: string;
  negative_prompt: string;
  chunks: Record<string, string>;
  quality_score: number;
  favorite: boolean;
  tags?: string[];
  params?: Record<string, any>;
  formatted_full_copy?: string;
  word_count?: number;
}

const STORAGE_KEY = 'pf_history';
const MAX_HISTORY_ITEMS = 50;

export function useHistory() {
  const [history, setHistory] = useState<GenerationHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed.slice(0, MAX_HISTORY_ITEMS);
      }
    } catch (e) {
      console.warn('Erro ao carregar histórico do localStorage:', e);
    }
    return [];
  });

  const saveHistory = useCallback((items: GenerationHistoryItem[]) => {
    try {
      const trimmed = items.slice(0, MAX_HISTORY_ITEMS);
      setHistory(trimmed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.error('Erro ao salvar no localStorage (limite de cota):', e);
    }
  }, []);

  const addHistoryItem = useCallback((item: Omit<GenerationHistoryItem, 'id' | 'created_at' | 'favorite'>) => {
    const newItem: GenerationHistoryItem = {
      ...item,
      id: `gen_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      favorite: false
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev.filter(i => i.id !== newItem.id)].slice(0, MAX_HISTORY_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Cota de armazenamento excedida:', err);
      }
      return updated;
    });

    return newItem;
  }, []);

  const removeHistoryItem = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn(err);
      }
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setHistory((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          return { ...item, favorite: !item.favorite };
        }
        return item;
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn(err);
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const exportJson = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `prompt_factory_historico_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [history]);

  const importJson = useCallback((jsonString: string): { success: boolean; count: number; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, count: 0, error: 'O arquivo JSON deve conter uma lista de gerações.' };
      }

      const validItems: GenerationHistoryItem[] = parsed.filter(item => item && item.prompt && item.chunks);
      if (validItems.length === 0) {
        return { success: false, count: 0, error: 'Nenhuma geração válida encontrada no arquivo.' };
      }

      setHistory(prev => {
        const merged = [...validItems, ...prev];
        const uniqueMap = new Map<string, GenerationHistoryItem>();
        for (const it of merged) {
          uniqueMap.set(it.id || `${it.created_at}_${it.prompt.slice(0, 20)}`, it);
        }
        const combined = Array.from(uniqueMap.values()).slice(0, MAX_HISTORY_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
        return combined;
      });

      return { success: true, count: validItems.length };
    } catch (err: any) {
      return { success: false, count: 0, error: err?.message || 'Falha ao processar arquivo JSON.' };
    }
  }, []);

  return {
    history,
    addHistoryItem,
    removeHistoryItem,
    toggleFavorite,
    clearHistory,
    exportJson,
    importJson
  };
}
