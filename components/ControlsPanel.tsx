'use client';

import React, { useState } from 'react';
import { TransformationConfig, CropMode, ImageFormat } from '@/types/pipeline';
import { PRESETS_LIST } from '@/lib/transformations';
import { Sliders, Sparkles, UploadCloud, Info, RotateCcw } from 'lucide-react';

interface ControlsPanelProps {
  config: TransformationConfig;
  onChange: (config: TransformationConfig) => void;
  onReset: () => void;
  activeSubTab: 'transform' | 'presets' | 'export';
  setActiveSubTab: (tab: 'transform' | 'presets' | 'export') => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const WIDTH_PRESETS = [320, 640, 800, 1200, 1920];

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  config,
  onChange,
  onReset,
  activeSubTab,
  setActiveSubTab,
  onToast,
}) => {
  const update = (partial: Partial<TransformationConfig>) => {
    onChange({ ...config, ...partial });
  };

  return (
    <div className="bg-[#0e1424] border border-[#1b253b] rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      <div>
        {/* Top Segmented Controls: Transform | Presets | Export */}
        <div className="flex items-center gap-1 bg-[#090d18] p-1 rounded-xl border border-[#1a2337] mb-5">
          <button
            onClick={() => setActiveSubTab('transform')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'transform'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Transform</span>
          </button>
          <button
            onClick={() => setActiveSubTab('presets')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'presets'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Presets</span>
          </button>
          <button
            onClick={() => setActiveSubTab('export')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'export'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>

        {activeSubTab === 'transform' && (
          <div className="space-y-4">
            {/* Resize Section */}
            <div>
              <div className="text-xs font-semibold text-slate-300 mb-2">Resize</div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Width</span>
                  <div className="flex items-center bg-[#090d18] border border-[#1b253b] rounded-lg px-2.5 py-1.5">
                    <input
                      type="number"
                      value={config.width ?? ''}
                      onChange={(e) => update({ width: e.target.value ? parseInt(e.target.value, 10) : null })}
                      className="w-full bg-transparent text-xs text-slate-200 focus:outline-none font-mono"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">px</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Height</span>
                  <div className="flex items-center bg-[#090d18] border border-[#1b253b] rounded-lg px-2.5 py-1.5">
                    <input
                      type="number"
                      value={config.height ?? ''}
                      onChange={(e) => update({ height: e.target.value ? parseInt(e.target.value, 10) : null })}
                      className="w-full bg-transparent text-xs text-slate-200 focus:outline-none font-mono"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">px</span>
                  </div>
                </div>
              </div>

              {/* Preset Width Badges */}
              <div className="grid grid-cols-5 gap-1">
                {WIDTH_PRESETS.map((pw) => (
                  <button
                    key={pw}
                    onClick={() => update({ width: pw })}
                    className={`py-1 text-center rounded-lg text-[10px] sm:text-xs font-mono transition-all ${
                      config.width === pw
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-[#101728] text-slate-400 hover:text-slate-200 border border-[#1b253b]'
                    }`}
                  >
                    {pw}
                  </button>
                ))}
              </div>
            </div>

            {/* Crop Mode Section */}
            <div>
              <div className="text-xs font-semibold text-slate-300 mb-2">Crop</div>
              <div className="grid grid-cols-4 gap-1">
                {(['fit', 'fill', 'crop', 'scale'] as CropMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => update({ crop: mode })}
                    className={`py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-mono capitalize transition-all ${
                      config.crop === mode
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-[#101728] text-slate-400 hover:text-slate-200 border border-[#1b253b]'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Format & Quality Row */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-xs font-semibold text-slate-300 block mb-1.5">Format</span>
                <select
                  value={config.format}
                  onChange={(e) => update({ format: e.target.value as ImageFormat })}
                  className="w-full bg-[#090d18] border border-[#1b253b] rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none capitalize font-mono"
                >
                  <option value="auto">Auto (Smart)</option>
                  <option value="webp">WebP</option>
                  <option value="avif">AVIF</option>
                  <option value="jpg">JPEG</option>
                  <option value="png">PNG</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-300">Quality</span>
                  <span className="text-xs font-mono text-blue-400 font-bold">{config.quality}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="5"
                  value={config.quality}
                  onChange={(e) => update({ quality: parseInt(e.target.value, 10) })}
                  className="w-full cursor-pointer mt-1"
                />
              </div>
            </div>

            {/* Advanced Options Toggles */}
            <div className="pt-2 border-t border-[#1b253b] space-y-2">
              <span className="text-xs font-semibold text-slate-300 block mb-2">Advanced Options</span>

              <label className="flex items-center justify-between text-xs text-slate-400 cursor-pointer">
                <span>Auto format (f_auto)</span>
                <input
                  type="checkbox"
                  checked={config.autoFormat}
                  onChange={(e) => update({ autoFormat: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-400 cursor-pointer">
                <span>Auto quality (q_auto)</span>
                <input
                  type="checkbox"
                  checked={config.autoQuality}
                  onChange={(e) => update({ autoQuality: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-400 cursor-pointer">
                <span>Auto device pixel ratio (dpr_auto)</span>
                <input
                  type="checkbox"
                  checked={config.autoDpr}
                  onChange={(e) => update({ autoDpr: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-400 cursor-pointer">
                <span>Smart crop (g_auto)</span>
                <input
                  type="checkbox"
                  checked={config.smartCrop}
                  onChange={(e) => update({ smartCrop: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                />
              </label>

              <label className="flex items-center justify-between text-xs text-slate-400 cursor-pointer">
                <span>Strip metadata</span>
                <input
                  type="checkbox"
                  checked={config.stripMetadata}
                  onChange={(e) => update({ stripMetadata: e.target.checked })}
                  className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700"
                />
              </label>
            </div>
          </div>
        )}

        {activeSubTab === 'presets' && (
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300 mb-2">Preset Pipelines</div>
            {PRESETS_LIST.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onChange(p.config);
                  onToast(`Applied preset: ${p.name}`, 'success');
                }}
                className="w-full text-left p-2.5 rounded-xl border border-[#1b253b] bg-[#090d18] hover:border-blue-500/50 hover:bg-[#101728] transition-all"
              >
                <div className="text-xs font-bold text-slate-200">{p.name}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{p.desc}</div>
              </button>
            ))}
          </div>
        )}

        {activeSubTab === 'export' && (
          <div className="space-y-3 text-xs text-slate-400">
            <p>Export options are also directly accessible in the bottom code bar.</p>
            <div className="p-3 bg-[#090d18] rounded-xl border border-[#1b253b]">
              <span className="font-semibold text-slate-200 block mb-1">Quick Tip:</span>
              Cloudinary dynamic transformation URLs are delivered via high-speed edge CDN globally.
            </div>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="mt-4 w-full py-2 bg-[#12192d] hover:bg-[#18223d] border border-[#1f2b47] rounded-xl text-xs font-medium text-slate-300 flex items-center justify-center gap-1.5 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Reset</span>
      </button>
    </div>
  );
};
