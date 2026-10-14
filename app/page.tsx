'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, Upload, Image as ImageIcon, CheckCircle2, AlertCircle, Info, Menu, X } from 'lucide-react';
import { Sidebar } from '@/components/Sidebar';
import { ImageComparisonView } from '@/components/ImageComparisonView';
import { ControlsPanel } from '@/components/ControlsPanel';
import { MetricCardsRow } from '@/components/MetricCardsRow';
import { BottomPanels } from '@/components/BottomPanels';
import { PresetsView } from '@/components/PresetsView';
import { BenchmarksView } from '@/components/BenchmarksView';
import { SavedPipelines } from '@/components/SavedPipelines';
import { GalleryView } from '@/components/GalleryView';
import { DocsView } from '@/components/DocsView';
import { AboutSection } from '@/components/AboutSection';
import { CloudinaryAsset, TransformationConfig, BenchmarkRow, SavedPipeline } from '@/types/pipeline';
import { DEFAULT_CONFIG, PRESETS_LIST } from '@/lib/transformations';
import { runLiveBenchmarkSuite } from '@/lib/benchmark';
import { getSavedPipelines, savePipeline, deletePipeline } from '@/lib/storage';

export const INITIAL_ASSET: CloudinaryAsset = {
  publicId: 'cld-sample-2',
  cloudName: 'demo',
  secureUrl: 'https://res.cloudinary.com/demo/image/upload/cld-sample-2.jpg',
  width: 4032,
  height: 3024,
  format: 'jpg',
  bytes: 3355443, // ~3.2 MB
  isSample: true,
};

export const INITIAL_BENCHMARK_ROWS: BenchmarkRow[] = [
  {
    id: 'original',
    name: 'Original',
    url: 'https://res.cloudinary.com/demo/image/upload/cld-sample-2.jpg',
    sizeFormatted: '3.2 MB',
    bytes: 3355443,
    dimensions: '4032 × 3024',
    format: 'JPEG',
    loadTime: '1.24 s',
    durationMs: 1240,
  },
  {
    id: 'auto_f_q',
    name: 'Auto (f_auto,q_auto)',
    url: 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/cld-sample-2.jpg',
    sizeFormatted: '285 KB',
    bytes: 291840,
    dimensions: '4032 × 3024',
    format: 'WebP',
    loadTime: '420 ms',
    durationMs: 420,
  },
  {
    id: 'resized',
    name: 'Resized (1200 × 800)',
    url: 'https://res.cloudinary.com/demo/image/upload/f_webp,q_80,w_1200,h_800,c_fit/cld-sample-2.jpg',
    sizeFormatted: '142 KB',
    bytes: 145408,
    dimensions: '1200 × 800',
    format: 'WebP',
    loadTime: '320 ms',
    durationMs: 320,
  },
  {
    id: 'high_quality',
    name: 'High Quality (q_90)',
    url: 'https://res.cloudinary.com/demo/image/upload/f_webp,q_90,w_1200,h_800,c_fit/cld-sample-2.jpg',
    sizeFormatted: '212 KB',
    bytes: 217088,
    dimensions: '1200 × 800',
    format: 'WebP',
    loadTime: '360 ms',
    durationMs: 360,
  },
];

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('playground');
  const [activeSubTab, setActiveSubTab] = useState<'transform' | 'presets' | 'export'>('transform');
  const [asset, setAsset] = useState<CloudinaryAsset>(INITIAL_ASSET);
  const [config, setConfig] = useState<TransformationConfig>(DEFAULT_CONFIG);
  const [benchmarkRows, setBenchmarkRows] = useState<BenchmarkRow[]>(INITIAL_BENCHMARK_ROWS);
  const [savedPipelines, setSavedPipelines] = useState<SavedPipeline[]>([]);
  const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSavedPipelines(getSavedPipelines());
  }, []);

  // Keyboard shortcut cmd+k / ctrl+k for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];

    if (!file.type.startsWith('image/')) {
      addToast('Please upload an image file.', 'error');
      return;
    }

    try {
      setUploading(true);
      addToast('Signing upload request...', 'info');

      const signRes = await fetch('/api/sign-upload', { method: 'POST' });
      const signData = await signRes.json();

      if (!signRes.ok || !signData.configured) {
        throw new Error(signData.error || 'Cloudinary credentials missing in .env.local');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signData.apiKey);
      formData.append('timestamp', signData.timestamp.toString());
      formData.append('signature', signData.signature);
      formData.append('folder', signData.folder);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;
      const uploadRes = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });

      const resData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(resData.error?.message || 'Upload failed');

      const newAsset: CloudinaryAsset = {
        publicId: resData.public_id,
        cloudName: signData.cloudName,
        secureUrl: resData.secure_url,
        width: resData.width,
        height: resData.height,
        format: resData.format,
        bytes: resData.bytes,
        isSample: false,
      };

      setAsset(newAsset);
      setActiveTab('playground');
      addToast(`Image uploaded to Cloudinary: ${resData.public_id}`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      addToast(msg, 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRunBenchmark = async () => {
    try {
      setIsRunningBenchmark(true);
      addToast('Running live CDN benchmark requests...', 'info');
      const rows = await runLiveBenchmarkSuite(asset);
      setBenchmarkRows(rows);
      addToast('Benchmark measurements updated!', 'success');
    } catch {
      addToast('Failed to complete benchmark suite', 'error');
    } finally {
      setIsRunningBenchmark(false);
    }
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    addToast('Reset transformations to default', 'info');
  };

  const handleTryExample = () => {
    const samples = [
      {
        publicId: 'cld-sample-2',
        cloudName: 'demo',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/cld-sample-2.jpg',
        width: 4032,
        height: 3024,
        format: 'jpg',
        bytes: 3355443,
        isSample: true,
      },
      {
        publicId: 'cld-sample-5',
        cloudName: 'demo',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/cld-sample-5.jpg',
        width: 1870,
        height: 1250,
        format: 'jpg',
        bytes: 563200,
        isSample: true,
      },
      {
        publicId: 'sample',
        cloudName: 'demo',
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
        width: 864,
        height: 576,
        format: 'jpg',
        bytes: 178200,
        isSample: true,
      },
    ];
    const nextSample = samples[Math.floor(Math.random() * samples.length)];
    setAsset(nextSample);
    setActiveTab('playground');
    addToast(`Switched example asset: ${nextSample.publicId}`, 'info');
  };

  const handleApplyPreset = (presetConfig: TransformationConfig, name: string) => {
    setConfig(presetConfig);
    setActiveTab('playground');
    addToast(`Applied recipe "${name}"`, 'success');
  };

  const handleSavePipeline = (pipe: SavedPipeline) => {
    const updated = savePipeline(pipe);
    setSavedPipelines(updated);
  };

  const handleDeletePipeline = (id: string) => {
    const updated = deletePipeline(id);
    setSavedPipelines(updated);
  };

  const handleLoadPipeline = (pipeConfig: TransformationConfig, name: string) => {
    setConfig(pipeConfig);
    setActiveTab('playground');
    addToast(`Loaded saved pipeline "${name}"`, 'success');
  };

  return (
    <div className="flex min-h-screen w-full bg-[#080c14] text-slate-100 overflow-x-hidden relative">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Left Sidebar (Responsive Drawer on mobile, sticky on desktop) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 px-4 sm:px-8 border-b border-[#162035] flex items-center justify-between bg-[#080c14]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger Button on Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-[#12192d] transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Logo */}
            <div className="lg:hidden flex items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="Transforma"
                className="h-8 w-auto max-w-[130px] object-contain"
              />
            </div>

            {/* Search Bar with live search popover */}
            <div className="relative w-48 sm:w-72 md:w-80 hidden sm:block">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search pipelines, presets..."
                className="w-full bg-[#0d1322] border border-[#1b253b] rounded-xl pl-9 pr-10 py-1.5 text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 bg-[#162035] px-1.5 py-0.5 rounded border border-[#212f4d]">
                  ⌘K
                </span>
              )}

              {/* Live Search Results Dropdown */}
              {isSearchOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsSearchOpen(false)}
                  />
                  <div className="absolute left-0 right-0 top-full mt-2 bg-[#0c101c] border border-[#1a2337] rounded-xl shadow-2xl p-2 z-40 max-h-80 overflow-y-auto space-y-1">
                    <div className="text-[10px] uppercase font-semibold text-slate-500 px-2 py-1">
                      Quick Navigation & Presets
                    </div>
                    {PRESETS_LIST.filter(
                      (p) =>
                        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.desc.toLowerCase().includes(searchQuery.toLowerCase())
                    ).map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          handleApplyPreset(p.config, p.name);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#12192d] transition-colors flex items-center justify-between"
                      >
                        <div>
                          <div className="text-xs font-semibold text-slate-200">{p.name}</div>
                          <div className="text-[10px] text-slate-400">{p.desc}</div>
                        </div>
                        <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                          Preset
                        </span>
                      </button>
                    ))}

                    {/* View pages */}
                    {[
                      { id: 'playground', name: 'Playground Workspace' },
                      { id: 'presets', name: 'Presets Gallery' },
                      { id: 'benchmarks', name: 'Performance Benchmarks' },
                      { id: 'saved', name: 'Saved Pipelines' },
                      { id: 'gallery', name: 'Asset Gallery' },
                      { id: 'docs', name: 'Documentation Reference' },
                      { id: 'about', name: 'About Transforma' },
                    ]
                      .filter((v) => v.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((v) => (
                        <button
                          key={v.id}
                          onClick={() => {
                            setActiveTab(v.id);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#12192d] transition-colors flex items-center justify-between"
                        >
                          <span className="text-xs text-slate-300 font-medium">{v.name}</span>
                          <span className="text-[10px] text-slate-500">View</span>
                        </button>
                      ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Right Header Icons & Active Asset Indicator */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400 bg-[#0d1322] border border-[#1b253b] px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="truncate max-w-[120px]">Asset: {asset.publicId}</span>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#162238] border border-[#223354] flex items-center justify-center text-xs font-semibold text-slate-300">
              A
            </div>
          </div>
        </header>

        {/* Dynamic Page Views */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'playground' && (
            <>
              {/* Hero Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
                    IMAGE TRANSFORMATION PLAYGROUND
                  </span>
                  <h2 className="text-2xl font-bold text-slate-100 mt-0.5">
                    Transform your images with precision
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Upload an image, adjust the settings, and see the results in real time. Optimize for web, mobile, or any use case.
                  </p>
                </div>

                {/* Action Buttons: Upload Image | Try an Example */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="bg-[#12192d] hover:bg-[#18233e] text-slate-200 border border-[#212f4d] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
                  </button>

                  <button
                    onClick={handleTryExample}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-blue-500/20"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Try an Example</span>
                  </button>
                </div>
              </div>

              {/* Center Stage: Left Image Comparison + Right Transformation Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Visual Compare Workspace (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                  <ImageComparisonView asset={asset} config={config} />
                  
                  {/* Metric Cards Row (4 cards) */}
                  <MetricCardsRow
                    savingsPercent={90}
                    originalBytes={asset.bytes}
                    transformedBytes={Math.round(asset.bytes * 0.1)}
                    width={config.width ?? 1200}
                    height={config.height ?? 800}
                    format={config.format}
                    loadTimeMs={320}
                  />
                </div>

                {/* Transformation Controls Panel (4 cols) */}
                <div className="lg:col-span-4">
                  <ControlsPanel
                    config={config}
                    onChange={setConfig}
                    onReset={handleReset}
                    activeSubTab={activeSubTab}
                    setActiveSubTab={setActiveSubTab}
                    onToast={addToast}
                  />
                </div>
              </div>

              {/* Bottom Section: Transformation URL / Code Examples + Benchmark Results Table */}
              <BottomPanels
                asset={asset}
                config={config}
                benchmarkRows={benchmarkRows}
                onRunBenchmark={handleRunBenchmark}
                isRunningBenchmark={isRunningBenchmark}
                onToast={addToast}
              />
            </>
          )}

          {activeTab === 'presets' && (
            <PresetsView
              currentConfig={config}
              onApplyPreset={handleApplyPreset}
            />
          )}

          {activeTab === 'benchmarks' && (
            <BenchmarksView
              asset={asset}
              benchmarkRows={benchmarkRows}
              onRunBenchmark={handleRunBenchmark}
              isRunningBenchmark={isRunningBenchmark}
            />
          )}

          {activeTab === 'saved' && (
            <SavedPipelines
              savedPipelines={savedPipelines}
              currentConfig={config}
              onSave={handleSavePipeline}
              onDelete={handleDeletePipeline}
              onLoad={handleLoadPipeline}
              onToast={addToast}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryView
              currentAsset={asset}
              onSelectAsset={(selected) => {
                setAsset(selected);
                setActiveTab('playground');
                addToast(`Loaded ${selected.publicId} into playground`, 'success');
              }}
              config={config}
            />
          )}

          {activeTab === 'docs' && <DocsView />}

          {activeTab === 'about' && <AboutSection />}
        </main>
      </div>

      {/* Floating Toast Notification Box */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl shadow-2xl border text-xs font-medium pointer-events-auto transition-all ${
              toast.type === 'success'
                ? 'bg-[#0f172a] text-emerald-300 border-emerald-500/40'
                : toast.type === 'error'
                ? 'bg-[#0f172a] text-red-300 border-red-500/40'
                : 'bg-[#0f172a] text-blue-300 border-blue-500/40'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
            {toast.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-400" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
