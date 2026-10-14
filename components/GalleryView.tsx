'use client';

import React from 'react';
import { CloudinaryAsset, TransformationConfig } from '@/types/pipeline';
import { buildCloudinaryUrl } from '@/lib/transformations';
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

interface GalleryViewProps {
  currentAsset: CloudinaryAsset;
  onSelectAsset: (asset: CloudinaryAsset) => void;
  config: TransformationConfig;
}

export const GALLERY_ITEMS: CloudinaryAsset[] = [
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
  {
    publicId: 'cld-sample-4',
    cloudName: 'demo',
    secureUrl: 'https://res.cloudinary.com/demo/image/upload/cld-sample-4.jpg',
    width: 1870,
    height: 1250,
    format: 'jpg',
    bytes: 421000,
    isSample: true,
  },
  {
    publicId: 'cld-sample-3',
    cloudName: 'demo',
    secureUrl: 'https://res.cloudinary.com/demo/image/upload/cld-sample-3.jpg',
    width: 1870,
    height: 1250,
    format: 'jpg',
    bytes: 495000,
    isSample: true,
  },
  {
    publicId: 'cld-sample',
    cloudName: 'demo',
    secureUrl: 'https://res.cloudinary.com/demo/image/upload/cld-sample.jpg',
    width: 1870,
    height: 1250,
    format: 'jpg',
    bytes: 412000,
    isSample: true,
  },
];

export const GalleryView: React.FC<GalleryViewProps> = ({
  currentAsset,
  onSelectAsset,
  config,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
          TEST ASSET LIBRARY
        </span>
        <h2 className="text-2xl font-bold text-slate-100 mt-0.5">Asset Gallery</h2>
        <p className="text-xs text-slate-400 mt-1">
          Explore different subjects (landscapes, portraits, products, animals) and examine how your active transformation pipeline applies in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GALLERY_ITEMS.map((item) => {
          const isSelected = currentAsset.publicId === item.publicId;
          const previewTransUrl = buildCloudinaryUrl(item.cloudName, item.publicId, config);

          return (
            <div
              key={item.publicId}
              className={`rounded-2xl border overflow-hidden transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-600/10 border-blue-500/80 ring-1 ring-blue-500'
                  : 'bg-[#0e1424] border-[#1b253b] hover:border-[#2b3a5a]'
              }`}
            >
              <div className="aspect-[16/10] bg-[#090d18] relative overflow-hidden group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewTransUrl}
                  alt={item.publicId}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5 bg-[#090d18]/85 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-300 border border-[#1a2337]">
                  {item.width} × {item.height}
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-100 font-mono">{item.publicId}</h3>
                    <p className="text-[11px] text-slate-400">
                      {(item.bytes / 1024).toFixed(0)} KB • {item.format.toUpperCase()}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-950 border border-blue-800 px-2 py-0.5 rounded-full font-semibold">
                      Selected
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectAsset(item)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#141d33] hover:bg-blue-600 text-slate-300 hover:text-white border border-[#223052]'
                    }`}
                  >
                    <span>{isSelected ? 'Loaded in Playground' : 'Load in Playground'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <a
                    href={previewTransUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-[#141d33] hover:bg-[#1a2542] text-slate-400 hover:text-slate-200 border border-[#223052]"
                    title="Open transformed image"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
