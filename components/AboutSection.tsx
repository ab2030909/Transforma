'use client';

import React from 'react';
import { Layers, ShieldCheck, Zap, Sliders, CheckCircle, ExternalLink, Cpu } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
          PROJECT OVERVIEW & MILESTONE
        </span>
        <h2 className="text-2xl font-bold text-slate-100 mt-0.5">
          About Transforma
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          A dedicated developer workbench solving visual fidelity versus payload size optimization for web media delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0e1424] border border-[#1b253b] p-5 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-100">Authenticated Upload Flow</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Uploads are signed securely on the server using Next.js Route Handlers (`/api/sign-upload`) and the official Cloudinary Node.js SDK. `CLOUDINARY_API_SECRET` remains strictly server-side.
          </p>
        </div>

        <div className="bg-[#0e1424] border border-[#1b253b] p-5 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-100">Dynamic Transformation URLs</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Constructs strictly validated Cloudinary URL segments (`c_fit,w_1200,f_auto,q_auto,fl_strip_profile`), instantly rendered via edge CDN without server load.
          </p>
        </div>

        <div className="bg-[#0e1424] border border-[#1b253b] p-5 rounded-2xl space-y-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-bold text-slate-100">Auditable Live Benchmarking</h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Measures real network latency and byte reduction directly in the browser using Performance and Fetch APIs against actual Cloudinary edge distributions.
          </p>
        </div>
      </div>

      <div className="bg-[#0e1424] border border-[#1b253b] rounded-2xl p-5 text-xs text-slate-300 space-y-3">
        <h4 className="font-semibold text-slate-100 flex items-center gap-1.5">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Cloudinary Creators Community Checklist
        </h4>
        <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside">
          <li><strong>Production-grade UI:</strong> Dark developer console with instant URL preview and pixel inspector.</li>
          <li><strong>Real Cloudinary Assets:</strong> Works out-of-the-box with demo assets and accepts authenticated user uploads.</li>
          <li><strong>Zero Mock Metrics:</strong> Network and payload savings are computed live without hardcoded figures.</li>
          <li><strong>Multi-Framework Snippets:</strong> Instant code exports for HTML5, Next.js, and Node.js SDK.</li>
        </ul>
      </div>
    </div>
  );
};
