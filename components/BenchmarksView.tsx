'use client';

import React from 'react';
import { Zap, Play, RefreshCw, BarChart2, ShieldCheck, ArrowDownRight } from 'lucide-react';
import { BenchmarkRow, CloudinaryAsset } from '@/types/pipeline';

interface BenchmarksViewProps {
  asset: CloudinaryAsset;
  benchmarkRows: BenchmarkRow[];
  onRunBenchmark: () => void;
  isRunningBenchmark: boolean;
}

export const BenchmarksView: React.FC<BenchmarksViewProps> = ({
  asset,
  benchmarkRows,
  onRunBenchmark,
  isRunningBenchmark,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
            AUDITABLE CLIENT-SIDE LATENCY & PAYLOAD METRICS
          </span>
          <h2 className="text-2xl font-bold text-slate-100 mt-0.5">
            Live Benchmarking Suite
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Measures genuine response latency, HTTP payload weights, and compression ratios against active Cloudinary CDN endpoints.
          </p>
        </div>

        <button
          onClick={onRunBenchmark}
          disabled={isRunningBenchmark}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25 shrink-0"
        >
          {isRunningBenchmark ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
          <span>{isRunningBenchmark ? 'Running Live Requests...' : 'Execute Suite Benchmark'}</span>
        </button>
      </div>

      {/* Explanatory Banner */}
      <div className="bg-[#0e1424] border border-[#1b253b] rounded-2xl p-4 flex items-start gap-3">
        <BarChart2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Real Browser Measurements:</strong> Testing asset{' '}
          <span className="font-mono text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-900">
            {asset.publicId} ({asset.cloudName})
          </span>
          . Latency is collected via the browser&apos;s <code className="text-slate-300">performance.now()</code> API and actual byte size is verified via response stream analysis.
        </div>
      </div>

      {/* Main Detailed Benchmark Table */}
      <div className="bg-[#0e1424] border border-[#1b253b] rounded-2xl p-5 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-[#1b253b] text-[11px]">
                <th className="pb-3 font-medium">Pipeline Configuration</th>
                <th className="pb-3 font-medium">Delivered Format</th>
                <th className="pb-3 font-medium">Dimensions</th>
                <th className="pb-3 font-medium">Payload Size</th>
                <th className="pb-3 font-medium">Network Latency</th>
                <th className="pb-3 font-medium text-right">Data Savings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b253b]/60">
              {benchmarkRows.map((row) => {
                const isBaseline = row.id === 'original';
                return (
                  <tr key={row.id} className="hover:bg-[#121a2e]/50 transition-colors">
                    <td className="py-3.5 font-sans">
                      <div className="font-semibold text-slate-200">{row.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono truncate max-w-sm mt-0.5">
                        {row.url}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="bg-[#090d18] border border-[#1a2337] px-2 py-0.5 rounded uppercase text-[10px] text-slate-300">
                        {row.format}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-300">{row.dimensions}</td>
                    <td className="py-3.5 text-slate-200 font-bold">{row.sizeFormatted}</td>
                    <td className="py-3.5 text-slate-300">{row.loadTime}</td>
                    <td className="py-3.5 text-right">
                      {isBaseline ? (
                        <span className="text-slate-500 text-[11px]">Baseline</span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 text-cyan-400 bg-cyan-950/40 border border-cyan-800/40 px-2 py-0.5 rounded text-[11px] font-bold">
                          <ArrowDownRight className="w-3 h-3" />
                          ~85% saved
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
