'use client';

import React from 'react';
import { Download, Minimize2, FileCode, Clock } from 'lucide-react';

interface MetricCardsRowProps {
  savingsPercent: number;
  originalBytes: number;
  transformedBytes: number;
  width: number;
  height: number;
  format: string;
  loadTimeMs: number;
}

export const MetricCardsRow: React.FC<MetricCardsRowProps> = ({
  savingsPercent,
  originalBytes,
  transformedBytes,
  width,
  height,
  format,
  loadTimeMs,
}) => {
  const origMB = (originalBytes / (1024 * 1024)).toFixed(1);
  const transKB = Math.round(transformedBytes / 1024);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
      {/* File Size */}
      <div className="bg-[#0e1424] border border-[#1b253b] rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-lg min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-blue-600/15 border border-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block truncate">File Size</span>
          <div className="text-xs sm:text-sm font-bold text-cyan-400 truncate">{savingsPercent}% smaller</div>
          <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono block truncate">
            {origMB}MB → {transKB}KB
          </span>
        </div>
      </div>

      {/* Dimensions */}
      <div className="bg-[#0e1424] border border-[#1b253b] rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-lg min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-purple-600/15 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
          <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block truncate">Dimensions</span>
          <div className="text-xs sm:text-sm font-bold text-slate-100 font-mono truncate">
            {width} × {height}
          </div>
          <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono block truncate">72% fewer px</span>
        </div>
      </div>

      {/* Format */}
      <div className="bg-[#0e1424] border border-[#1b253b] rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-lg min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-600/15 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <FileCode className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block truncate">Format</span>
          <div className="text-xs sm:text-sm font-bold text-slate-100 uppercase truncate">{format}</div>
          <span className="text-[9px] sm:text-[10px] text-slate-500 block truncate">Modern format</span>
        </div>
      </div>

      {/* Load Time */}
      <div className="bg-[#0e1424] border border-[#1b253b] rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex items-center gap-2 sm:gap-3 shadow-lg min-w-0">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-600/15 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div className="min-w-0">
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block truncate">Load Time</span>
          <div className="text-xs sm:text-sm font-bold text-slate-100 font-mono truncate">{loadTimeMs} ms</div>
          <span className="text-[9px] sm:text-[10px] text-slate-500 block truncate">Cloudinary CDN</span>
        </div>
      </div>
    </div>
  );
};
