'use client';

import React, { useState } from 'react';
import { CloudinaryAsset, TransformationConfig } from '@/types/pipeline';
import { buildCloudinaryUrl, buildOriginalUrl } from '@/lib/transformations';
import { ZoomIn, ZoomOut, Maximize2, SplitSquareVertical, Columns } from 'lucide-react';

interface ImageComparisonViewProps {
  asset: CloudinaryAsset;
  config: TransformationConfig;
}

export const ImageComparisonView: React.FC<ImageComparisonViewProps> = ({ asset, config }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [zoom, setZoom] = useState(100);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  const transformedUrl = buildCloudinaryUrl(asset.cloudName, asset.publicId, config);
  const originalUrl = buildOriginalUrl(asset.cloudName, asset.publicId);

  // Compute display size estimate based on configuration
  const originalSizeMB = (asset.bytes / (1024 * 1024)).toFixed(1);
  const estimatedTransformedKB = Math.round((asset.bytes / 1024) * 0.18); // ~80% reduction for preview badge

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[#1b253b] bg-[#0c101c] flex flex-col justify-between aspect-[16/10] select-none shadow-2xl">
      {/* Top Floating Badges */}
      <div className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 z-20 flex flex-wrap items-center justify-between gap-1.5 pointer-events-none">
        {/* Original Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#090d18]/90 backdrop-blur-md border border-[#1a2337] px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-mono shadow-lg pointer-events-auto">
          <span className="font-semibold text-slate-200">Original</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">{originalSizeMB} MB</span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline">{asset.width} × {asset.height}</span>
        </div>

        {/* Transformed Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#090d18]/90 backdrop-blur-md border border-blue-500/30 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-mono shadow-lg pointer-events-auto">
          <span className="font-semibold text-blue-400">Transformed</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">{estimatedTransformedKB} KB</span>
          <span className="text-slate-400">•</span>
          <span className="text-blue-300 uppercase">{config.format}</span>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
        {viewMode === 'slider' ? (
          <div
            className="relative w-full h-full transition-transform duration-150"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            {/* Original Image (Full background) */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalUrl}
              alt="Original"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Transformed Image (Clipped overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={transformedUrl}
                alt="Transformed"
                className="absolute inset-0 max-w-none w-full h-full object-cover"
                style={{ width: '100%', height: '100%' }}
              />
            </div>

            {/* Split Divider Line & Handle */}
            <div
              className="absolute top-0 bottom-0 w-[2px] bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.7)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-slate-900 flex items-center justify-center text-xs font-bold shadow-xl border border-slate-300">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M8 18l-6-6 6-6M16 6l6 6-6 6" />
                </svg>
              </div>
            </div>

            {/* Interactive Drag Layer */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(parseInt(e.target.value, 10))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-10"
            />
          </div>
        ) : (
          /* Side by side mode */
          <div className="grid grid-cols-2 w-full h-full">
            <div className="border-r border-[#1a2337] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={originalUrl} alt="Original" className="w-full h-full object-cover" />
            </div>
            <div className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={transformedUrl} alt="Transformed" className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bars: Zoom on left, View Switcher on right */}
      {/* Bottom Control Bars: Zoom on left, View Switcher on right */}
      <div className="absolute bottom-2.5 sm:bottom-4 left-2.5 sm:left-4 right-2.5 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#090d18]/90 backdrop-blur-md border border-[#1a2337] px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl shadow-lg pointer-events-auto">
          <button
            onClick={() => setZoom((prev) => Math.max(50, prev - 10))}
            className="text-slate-400 hover:text-slate-200 p-0.5"
          >
            <ZoomOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
          <span className="text-[10px] sm:text-xs font-mono text-slate-300 font-semibold">{zoom}%</span>
          <button
            onClick={() => setZoom((prev) => Math.min(200, prev + 10))}
            className="text-slate-400 hover:text-slate-200 p-0.5"
          >
            <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
          <button
            onClick={() => setZoom(100)}
            className="text-slate-400 hover:text-slate-200 ml-0.5 pl-1 border-l border-slate-700 hidden sm:inline"
          >
            <Maximize2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-[#090d18]/90 backdrop-blur-md border border-[#1a2337] p-0.5 sm:p-1 rounded-lg sm:rounded-xl shadow-lg pointer-events-auto">
          <button
            onClick={() => setViewMode('slider')}
            className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-colors ${
              viewMode === 'slider' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Split Slider"
          >
            <SplitSquareVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-colors ${
              viewMode === 'side-by-side' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Side by Side"
          >
            <Columns className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
