'use client';

import React from 'react';
import { BookOpen, Code2, ShieldCheck, Zap, Layers, ExternalLink } from 'lucide-react';

export const DocsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <span className="text-[10px] font-bold tracking-wider text-blue-400 uppercase">
          DEVELOPER REFERENCE & GUIDES
        </span>
        <h2 className="text-2xl font-bold text-slate-100 mt-0.5">
          Documentation & Transformation Reference
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Technical specifications for Cloudinary URL parameters, signed upload architecture, and responsive integration patterns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* URL Parameters Card */}
        <div className="bg-[#0e1424] border border-[#1b253b] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">Transformation URL Anatomy</h3>
          </div>

          <div className="bg-[#090d18] p-3 rounded-xl border border-[#1a2337] font-mono text-[11px] text-blue-300">
            https://res.cloudinary.com/&lt;cloud&gt;/image/upload/
            <span className="text-amber-400 font-bold">f_auto,q_auto,w_1200,c_fit</span>
            /&lt;public_id&gt;
          </div>

          <ul className="space-y-2 text-xs text-slate-300">
            <li>
              <code className="text-blue-400 font-mono font-bold">f_auto</code>: Automatically delivers WebP or AVIF based on the requesting browser&apos;s capabilities.
            </li>
            <li>
              <code className="text-blue-400 font-mono font-bold">q_auto</code>: AI perceptual compression maintaining high visual quality while dramatically lowering byte size.
            </li>
            <li>
              <code className="text-blue-400 font-mono font-bold">c_fit / c_fill</code>: Resizes within specified dimensions or crops smartly using subject detection.
            </li>
            <li>
              <code className="text-blue-400 font-mono font-bold">g_auto</code>: AI smart gravity centering on faces or prominent objects during crops.
            </li>
            <li>
              <code className="text-blue-400 font-mono font-bold">fl_strip_profile</code>: Strips camera metadata (EXIF/ICC) to save up to 15% additional payload.
            </li>
          </ul>
        </div>

        {/* Upload Signing Architecture */}
        <div className="bg-[#0e1424] border border-[#1b253b] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-100">Authenticated Server Signing Flow</h3>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Transforma protects your API Secret by delegating signature creation to a Next.js Route Handler (`/api/sign-upload`).
          </p>

          <div className="bg-[#090d18] p-3.5 rounded-xl border border-[#1a2337] font-mono text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
            <div className="text-slate-500">// Server-side signature creation</div>
            <div>const signature = cloudinary.utils.api_sign_request(&#123;</div>
            <div className="pl-4 text-emerald-400">folder: &apos;transforma-pipeline&apos;,</div>
            <div className="pl-4 text-emerald-400">timestamp: Math.round(Date.now() / 1000)</div>
            <div>&#125;, process.env.CLOUDINARY_API_SECRET);</div>
          </div>

          <p className="text-[11px] text-slate-500">
            The browser then streams the image file directly to Cloudinary&apos;s upload API endpoint with the generated SHA signature.
          </p>
        </div>
      </div>

      {/* Official Documentation links */}
      <div className="bg-[#0e1424] border border-[#1b253b] rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-bold text-slate-200">Official Cloudinary Documentation</h4>
          <p className="text-[11px] text-slate-400 mt-0.5">Explore full transformations, video pipelines, and AI features.</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="https://cloudinary.com/documentation/image_transformations"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Image Transformations</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://cloudinary.com/documentation/upload_images"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>Upload Guide</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
