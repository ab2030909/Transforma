'use client';

import React, { useState } from 'react';
import { SavedPipeline, TransformationConfig } from '@/types/pipeline';
import { Bookmark, Trash2, ArrowUpRight, Plus, Calendar, Sparkles } from 'lucide-react';

interface SavedPipelinesProps {
  savedPipelines: SavedPipeline[];
  currentConfig: TransformationConfig;
  onSave: (pipeline: SavedPipeline) => void;
  onDelete: (id: string) => void;
  onLoad: (config: TransformationConfig, name: string) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const SavedPipelines: React.FC<SavedPipelinesProps> = ({
  savedPipelines,
  currentConfig,
  onSave,
  onDelete,
  onLoad,
  onToast,
}) => {
  const [pipelineName, setPipelineName] = useState('');
  const [description, setDescription] = useState('');

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pipelineName.trim()) {
      onToast('Please enter a name for your pipeline', 'error');
      return;
    }

    const newPipeline: SavedPipeline = {
      id: 'pipe_' + Date.now().toString(36),
      name: pipelineName.trim(),
      description: description.trim() || undefined,
      config: currentConfig,
      savedAt: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    };

    onSave(newPipeline);
    setPipelineName('');
    setDescription('');
    onToast(`Saved pipeline "${newPipeline.name}" to localStorage!`, 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
          LOCALSTORAGE PERSISTENCE
        </span>
        <h2 className="text-2xl font-bold text-slate-100 mt-0.5">
          Saved Pipelines
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Store, reload, and organize custom transformation configurations in browser localStorage.
        </p>
      </div>

      {/* Save current config form */}
      <form onSubmit={handleSaveCurrent} className="bg-[#0e1424] border border-[#1b253b] p-5 rounded-2xl space-y-3">
        <label className="text-xs font-semibold text-slate-200 block">
          Save Current Active Configuration
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            placeholder="Pipeline name (e.g. Hero High-DPI WebP)"
            value={pipelineName}
            onChange={(e) => setPipelineName(e.target.value)}
            className="w-full bg-[#090d18] border border-[#1b253b] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
          <input
            type="text"
            placeholder="Optional notes or description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#090d18] border border-[#1b253b] rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors shadow-md shadow-blue-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Save Pipeline Recipe</span>
        </button>
      </form>

      {/* List of saved pipelines */}
      {savedPipelines.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedPipelines.map((pipe) => (
            <div
              key={pipe.id}
              className="bg-[#0e1424] border border-[#1b253b] hover:border-blue-500/50 rounded-2xl p-4 flex flex-col justify-between space-y-4 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-200 truncate">{pipe.name}</h3>
                  <button
                    onClick={() => {
                      onDelete(pipe.id);
                      onToast(`Deleted "${pipe.name}"`, 'info');
                    }}
                    className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                    title="Delete pipeline"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {pipe.description && (
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{pipe.description}</p>
                )}

                <div className="flex flex-wrap gap-1 mt-3 font-mono text-[10px] text-slate-400">
                  <span className="bg-[#090d18] border border-[#1b253b] px-2 py-0.5 rounded">
                    {pipe.config.width ? `${pipe.config.width}w` : 'auto'}
                  </span>
                  <span className="bg-[#090d18] border border-[#1b253b] px-2 py-0.5 rounded uppercase">
                    {pipe.config.format}
                  </span>
                  <span className="bg-[#090d18] border border-[#1b253b] px-2 py-0.5 rounded">
                    c_{pipe.config.crop}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1b253b] flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3 h-3" />
                  {pipe.savedAt}
                </span>
                <button
                  onClick={() => onLoad(pipe.config, pipe.name)}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                >
                  <span>Load in Playground</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-[#1b253b] rounded-2xl bg-[#0e1424]/40">
          <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-300">No pipelines saved yet.</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Save custom transformation parameters using the form above for instant 1-click loading.
          </p>
        </div>
      )}
    </div>
  );
};
