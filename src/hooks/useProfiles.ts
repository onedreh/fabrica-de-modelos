import { useState, useCallback } from 'react';
import { ModelProfile, DEFAULT_PROFILES } from '../types/profile';

const PROFILES_STORAGE_KEY = 'pf_profiles';
const ACTIVE_PROFILE_KEY = 'pf_active_profile_id';

export function useProfiles() {
  const [profiles, setProfiles] = useState<ModelProfile[]>(() => {
    try {
      const stored = localStorage.getItem(PROFILES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar perfis de modelos:', e);
    }
    // Default initial profiles
    return DEFAULT_PROFILES;
  });

  const [activeProfileId, setActiveProfileId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(ACTIVE_PROFILE_KEY) || null;
    } catch {
      return null;
    }
  });

  const saveProfilesToStorage = useCallback((items: ModelProfile[]) => {
    setProfiles(items);
    try {
      localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Erro ao salvar perfis no localStorage:', e);
    }
  }, []);

  const selectProfile = useCallback((id: string | null) => {
    setActiveProfileId(id);
    try {
      if (id) {
        localStorage.setItem(ACTIVE_PROFILE_KEY, id);
      } else {
        localStorage.removeItem(ACTIVE_PROFILE_KEY);
      }
    } catch (e) {
      console.warn('Erro ao salvar perfil ativo:', e);
    }
  }, []);

  const activeProfile = profiles.find(p => p.id === activeProfileId) || null;

  const addProfile = useCallback((profileData: Omit<ModelProfile, 'id' | 'created_at'>) => {
    const newProfile: ModelProfile = {
      ...profileData,
      id: `prof_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      created_at: new Date().toISOString()
    };

    saveProfilesToStorage([newProfile, ...profiles]);
    selectProfile(newProfile.id);
    return newProfile;
  }, [profiles, saveProfilesToStorage, selectProfile]);

  const updateProfile = useCallback((id: string, updates: Partial<ModelProfile>) => {
    const updated = profiles.map(p => (p.id === id ? { ...p, ...updates } : p));
    saveProfilesToStorage(updated);
  }, [profiles, saveProfilesToStorage]);

  const deleteProfile = useCallback((id: string) => {
    const filtered = profiles.filter(p => p.id !== id);
    saveProfilesToStorage(filtered);
    if (activeProfileId === id) {
      selectProfile(null);
    }
  }, [profiles, activeProfileId, saveProfilesToStorage, selectProfile]);

  const exportProfilesJson = useCallback(() => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profiles, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `prompt_factory_perfis_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }, [profiles]);

  const importProfilesJson = useCallback((jsonString: string): { success: boolean; count?: number; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, error: 'O arquivo JSON deve conter uma lista de perfis.' };
      }

      const validProfiles: ModelProfile[] = parsed.filter(item => item && item.id && item.name);
      if (validProfiles.length === 0) {
        return { success: false, error: 'Nenhum perfil válido encontrado no arquivo.' };
      }

      // Merge avoiding duplicates by id
      const existingIds = new Set(profiles.map(p => p.id));
      const merged = [...validProfiles.filter(p => !existingIds.has(p.id)), ...profiles];

      saveProfilesToStorage(merged);
      return { success: true, count: validProfiles.length };
    } catch (err: any) {
      return { success: false, error: 'Formato JSON inválido.' };
    }
  }, [profiles, saveProfilesToStorage]);

  return {
    profiles,
    activeProfileId,
    activeProfile,
    selectProfile,
    addProfile,
    updateProfile,
    deleteProfile,
    exportProfilesJson,
    importProfilesJson
  };
}
