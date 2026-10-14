'use client';

import React, { useState } from 'react';
import { CloudinaryAsset, TransformationConfig, BenchmarkRow } from '@/types/pipeline';
import { buildCloudinaryUrl } from '@/lib/transformations';
import { Copy, Check, Play, RefreshCw } from 'lucide-react';

interface BottomPanelsProps {
  asset: CloudinaryAsset;
  config: TransformationConfig;
  benchmarkRows: BenchmarkRow[];
  onRunBenchmark: () => void;
  isRunningBenchmark: boolean;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const BottomPanels: React.FC<BottomPanelsProps> = ({
  asset,
  config,
  benchmarkRows,
  onRunBenchmark,
  isRunningBenchmark,
  onToast,
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'HTML' | 'Next.js' | 'JavaScript' | 'React'>('HTML');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const transUrl = buildCloudinaryUrl(asset.cloudName, asset.publicId, config);

  const codeSnippets = {
    HTML: `<img
  src="${transUrl}"
  alt="Transformed image"
  loading="lazy" />`,
    'Next.js': `import Image from 'next/image';

<Image
  src="${transUrl}"
  alt="Transformed image"
  width={${config.width ?? 1200}}
  height={${config.height ?? 800}}
/>`,
    JavaScript: `// Fetch optimized asset
const imageUrl = "${transUrl}";
const image = new Image();
image.src = imageUrl;`,
    React: `export function CloudinaryImage() {
  return (
    <img
      src="${transUrl}"
      alt="Optimized asset"
      className="rounded-xl shadow-lg"
    />
  );
}`,
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(transUrl);
    setCopiedUrl(true);
    onToast('Transformation URL copied!', 'success');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCopiedCode(true);
    onToast(`Copied ${activeCodeTab} snippet!`, 'success');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left Box: Transformation URL & Code Examples */}
      <div className="bg-[#0e1424] border border-[#1b253b] rounded-2xl p-5 shadow-xl space-y-4">
        {/* Transformation URL Bar */}
        <div>
          <span className="text-xs font-semibold text-slate-300 block mb-2">Transformation URL</span>
          <div className="flex items-center gap-2 bg-[#090d18] border border-[#1a2337] rounded-xl p-1.5 pl-3">
            <span className="text-xs font-mono text-slate-400 truncate flex-1">{transUrl}</span>
            <button
              onClick={handleCopyUrl}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* Code Examples with Tabs */}
        <div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-2">
            <span className="text-xs font-semibold text-slate-300">Code Examples</span>
            <div className="flex flex-wrap items-center gap-1 bg-[#090d18] p-1 rounded-lg border border-[#1a2337] w-full sm:w-auto">
              {(['HTML', 'Next.js', 'JavaScript', 'React'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveCodeTab(tab)}
                  className={`flex-1 sm:flex-initial px-2 sm:px-2.5 py-1 rounded-md text-[10px] sm:text-[11px] font-semibold transition-all ${
                    activeCodeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="relative bg-[#090d18] border border-[#1a2337] rounded-xl p-3 font-mono text-xs text-slate-300 overflow-x-auto min-h-[90px]">
            <button
              onClick={handleCopyCode}
              className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-[#101728] border border-[#1f2b47] px-2 py-0.5 rounded-md transition-colors"
            >
              {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy</span>
            </button>
            <pre className="pr-16 text-[11px] leading-relaxed text-blue-300">
              {codeSnippets[activeCodeTab]}
            </pre>
          </div>
        </div>
      </div>

      {/* Right Box: Benchmark Results Table */}
      <div className="bg-[#0e1424] border border-[#1b253b] rounded-2xl p-5 shadow-xl space-y-3 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300">Benchmark Results</span>
            <button
              onClick={onRunBenchmark}
              disabled={isRunningBenchmark}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/20"
            >
              {isRunningBenchmark ? (
                <RefreshCw className="w-3 h-3 animate-spin" />
              ) : (
                <Play className="w-3 h-3 fill-current" />
              )}
              <span>Run Benchmark</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-[#1b253b] text-[11px]">
                  <th className="pb-2 font-medium">Configuration</th>
                  <th className="pb-2 font-medium">Size</th>
                  <th className="pb-2 font-medium">Dimensions</th>
                  <th className="pb-2 font-medium">Format</th>
                  <th className="pb-2 font-medium text-right">Load Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1b253b]/60">
                {benchmarkRows.map((row) => {
                  const isHighlighted = row.id === 'resized';
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-[#101728]/50 transition-colors ${
                        isHighlighted ? 'text-blue-400 font-semibold bg-blue-600/5' : 'text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 font-sans font-medium">{row.name}</td>
                      <td className="py-2.5">{row.sizeFormatted}</td>
                      <td className="py-2.5">{row.dimensions}</td>
                      <td className="py-2.5">{row.format}</td>
                      <td className="py-2.5 text-right">{row.loadTime}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
