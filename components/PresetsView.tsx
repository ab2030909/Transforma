'use client';

import React from 'react';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { PRESETS_LIST } from '@/lib/transformations';
import { TransformationConfig } from '@/types/pipeline';

interface PresetsViewProps {
  currentConfig: TransformationConfig;
  onApplyPreset: (config: TransformationConfig, name: string) => void;
}

export const PresetsView: React.FC<PresetsViewProps> = ({ currentConfig, onApplyPreset }) => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
          CURATED PIPELINE PRESETS
        </span>
        <h2 className="text-2xl font-bold text-slate-100 mt-0.5">
          Production-Ready Image Recipes
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Select pre-engineered transformation recipes optimized for web performance, high DPI mobile displays, and AI subject framing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PRESETS_LIST.map((preset) => {
          const isSelected =
            currentConfig.width === preset.config.width &&
            currentConfig.crop === preset.config.crop &&
            currentConfig.format === preset.config.format;

          return (
            <div
              key={preset.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-600/10 border-blue-500/60 shadow-lg shadow-blue-500/10'
                  : 'bg-[#0e1424] border-[#1b253b] hover:border-[#2b3a5a] hover:bg-[#121a2e]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-100">{preset.name}</h3>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-600/20 px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-500/30">
                      <Check className="w-3 h-3" /> Active
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  {preset.desc}
                </p>

                {/* Technical specification tags */}
                <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-300 mb-4">
                  <span className="bg-[#090d18] border border-[#1a2337] px-2 py-0.5 rounded-md">
                    {preset.config.width ? `${preset.config.width}w` : 'auto-width'}
                  </span>
                  <span className="bg-[#090d18] border border-[#1a2337] px-2 py-0.5 rounded-md uppercase">
                    {preset.config.format}
                  </span>
                  <span className="bg-[#090d18] border border-[#1a2337] px-2 py-0.5 rounded-md">
                    c_{preset.config.crop}
                  </span>
                  <span className="bg-[#090d18] border border-[#1a2337] px-2 py-0.5 rounded-md">
                    q_{preset.config.quality}
                  </span>
                  {preset.config.smartCrop && (
                    <span className="bg-blue-950/60 border border-blue-800 text-blue-300 px-2 py-0.5 rounded-md">
                      AI Smart Crop
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onApplyPreset(preset.config, preset.name)}
                className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#141d33] hover:bg-blue-600 text-slate-200 hover:text-white border border-[#223052]'
                }`}
              >
                <span>{isSelected ? 'Active Preset' : 'Apply Recipe to Playground'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
