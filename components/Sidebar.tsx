'use client';

import React from 'react';
import {
  Layers,
  Sparkles,
  Zap,
  Bookmark,
  Image as ImageIcon,
  BookOpen,
  Info,
  ArrowRight,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen = false,
  onClose,
}) => {
  const menuItems = [
    { id: 'playground', label: 'Playground', icon: Layers },
    { id: 'presets', label: 'Presets', icon: Sparkles },
    { id: 'benchmarks', label: 'Benchmarks', icon: Zap },
    { id: 'saved', label: 'Saved Pipelines', icon: Bookmark },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
  ];

  const secondaryItems = [
    { id: 'docs', label: 'Documentation', icon: BookOpen },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleSelectTab = (id: string) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`w-64 bg-[#0c101c] border-r border-[#1a2337] flex flex-col justify-between shrink-0 h-screen select-none z-50 transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div className="overflow-y-auto">
          {/* Brand header */}
          <div className="px-5 pt-5 pb-4 flex items-center justify-between">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Transforma Logo"
              className="h-12 w-auto max-w-[190px] object-contain drop-shadow-md"
            />
            {onClose && (
              <button
                onClick={onClose}
                className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Primary Navigation */}
          <nav className="px-3 py-2 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Secondary Navigation */}
          <div className="pt-3 px-3 space-y-1 border-t border-[#1a2337]/60 mt-3">
            {secondaryItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Powered by Cloudinary card */}
        <div className="p-4">
          <div className="rounded-xl bg-[#101728] border border-[#1d2740] p-3.5 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/15 p-1 flex items-center justify-center border border-blue-500/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/cloudinary-transparent.png"
                alt="Cloudinary"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">Powered by Cloudinary</div>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                Transforma uses Cloudinary for secure uploads, real-time transformations, and global delivery.
              </p>
            </div>
            <a
              href="https://cloudinary.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-400 hover:text-blue-300 hover:underline pt-1"
            >
              <span>Learn more</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};
