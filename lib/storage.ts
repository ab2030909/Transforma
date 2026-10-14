import { SavedPipeline } from '@/types/pipeline';

const KEY = 'transforma_saved_pipelines_v1';

export function getSavedPipelines(): SavedPipeline[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savePipeline(pipe: SavedPipeline): SavedPipeline[] {
  if (typeof window === 'undefined') return [];
  try {
    const existing = getSavedPipelines().filter(p => p.id !== pipe.id);
    const updated = [pipe, ...existing];
    localStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function deletePipeline(id: string): SavedPipeline[] {
  if (typeof window === 'undefined') return [];
  try {
    const updated = getSavedPipelines().filter(p => p.id !== id);
    localStorage.setItem(KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}
