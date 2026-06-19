/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React from 'react';
import { 
  Sparkles, 
  Orbit, 
  Rocket, 
  Film, 
  Cpu, 
  Network, 
  Palette, 
  Check, 
  Circle, 
  User, 
  Tag, 
  BookOpen, 
  Heart,
  Globe,
  Settings,
  ShieldAlert
} from 'lucide-react';
import { VSCodeTheme } from '@/types';
import { toast } from '@/shared/utils/toast';
import extensionsJson from '@/app/data/extensions.json';

interface ExtensionDetailsViewerProps {
  path: string;
  theme: VSCodeTheme;
}

// Icon mapping for high aesthetic quality
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Brain: Sparkles,
  Orbit: Orbit,
  Rocket: Rocket,
  Film: Film,
  Cpu: Cpu,
  Network: Network,
  Palette: Palette
};

export default function ExtensionDetailsViewer({ path, theme }: ExtensionDetailsViewerProps) {
  // Parse path to fetch extension details
  const extId = path.split('/')[1];

  // Dynamically load data from JSON to stay data-driven
  const allExts = [...(extensionsJson.installed || []), ...(extensionsJson.discovering || [])];
  const ext = allExts.find(e => e.id === extId);

  if (!ext) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-neutral-500 font-mono text-xs select-none">
        <ShieldAlert className="w-8 h-8 text-rose-500 mb-2 animate-bounce" />
        <span>Extension Metadata Unresolved</span>
      </div>
    );
  }

  const isInstalled = (extensionsJson.installed || []).some((item: any) => item.id === ext.id);
  const IconComp = ICON_MAP[ext.icon] || Sparkles;

  return (
    <div className="w-full h-full bg-[#1e1e1e] text-[#cccccc] flex flex-col font-sans select-text text-left overflow-y-auto custom-scrollbar">
      
      {/* 1. Header Banner styled exactly like VS Code Extension Panel */}
      <div className="p-6 md:p-8 border-b border-neutral-800 flex flex-col sm:flex-row items-start gap-5 bg-neutral-900/40 select-none shrink-0">
        
        {/* Huge Icon Frame */}
        <div className="w-[72px] h-[72px] rounded bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0 text-amber-500 shadow-md">
          <IconComp className="w-10 h-10 text-amber-500" />
        </div>

        {/* Core Metadata Block */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-none">{ext.name}</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#007acc]/40 text-[#007acc] bg-[#007acc]/10 font-mono font-medium">
              {(ext as any).version || "v1.0.0"}
            </span>
          </div>

          <p className="text-xs text-neutral-400 font-mono leading-relaxed max-w-2xl">{ext.description}</p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-neutral-500 font-mono">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>Publisher: <strong className="text-neutral-400 font-sans">{(ext as any).publisher || "Sanjib"}</strong></span>
            </span>
            <span className="text-neutral-700 select-none">|</span>
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Category: <span className="text-[#58a6ff] hover:underline cursor-pointer">{((ext as any).categories || [ext.icon || "General"]).join(', ')}</span></span>
            </span>
          </div>

          {/* Installed/Discovering Buttons row */}
          <div className="flex items-center gap-2 pt-1 font-sans">
            {isInstalled ? (
              <>
                <button
                  onClick={() => toast.success(`${ext.name} successfully disabled.`)}
                  className="px-3.5 py-1 bg-[#3c3c3c] hover:bg-[#4d4d4d] text-white text-[11px] rounded transition font-medium cursor-pointer"
                >
                  Disable
                </button>
                <button
                  onClick={() => toast.info(`This is a default exploration path. Cannot uninstall!`)}
                  className="px-3.5 py-1 bg-rose-600/15 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 text-[11px] rounded transition font-medium cursor-pointer"
                >
                  Uninstall
                </button>
              </>
            ) : (
              <button
                onClick={() => toast.success(`Learning routine pinned! You are now exploring ${ext.name}.`)}
                className="px-4 py-1.5 bg-[#007acc] hover:bg-[#0088ff] text-white text-[11.5px] rounded transition font-semibold flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Circle className="w-3 h-3 fill-white shrink-0" />
                <span>Explore Routine</span>
              </button>
            )}
            <button
              onClick={() => toast.info("Feedback mechanism connected!")}
              className="p-1 hover:bg-[#3c3c3c] rounded text-neutral-500 hover:text-white transition cursor-pointer"
              title="Extension Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Side-by-Side Detailed Review Section */}
      <div className="flex-1 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Column Left: High-fidelity details & rich documentation */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* README simulated block */}
          <div className="space-y-4">
            <h2 className="text-[13px] uppercase tracking-wider font-bold text-neutral-400 font-mono pb-1 border-b border-neutral-800">
              README.md Overview
            </h2>
            <div className="bg-neutral-900/30 border border-neutral-800/40 rounded-lg p-5 space-y-4 text-neutral-300 text-xs md:text-sm leading-relaxed max-w-3xl">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-[#58a6ff]" />
                <span className="font-bold text-white text-[14px]">Interests / Exploration Deck</span>
              </div>
              
              <p>
                {(ext as any).longDescription || ext.description}
              </p>

              <div className="bg-neutral-950/40 p-4 border-l-4 border-[#007acc]/40 rounded text-neutral-400 font-mono text-[11px] space-y-1">
                <div className="font-bold text-neutral-300">Curiosity Metrics / Intent:</div>
                <div>• Priority: Active learning and compounding research cycles.</div>
                <div>• Context: This area remains fully data-driven. Configurable in extensions.json.</div>
              </div>

              {/* Heart Badge */}
              <div className="flex items-center gap-1.5 text-[11px] text-pink-500 font-mono pt-1 pb-1">
                <Heart className="w-3.5 h-3.5 fill-pink-500 text-pink-500 animate-pulse" />
                <span>Building with pristine digital craft.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Column Right: Interactive Metadata Sidebar Panel */}
        <div className="space-y-6 border-l border-neutral-800/20 pl-0 lg:pl-6 select-none text-[11.5px] font-mono">
          
          <div className="space-y-4">
            <h3 className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Metrics</h3>
            
            <div className="space-y-2 text-neutral-400">
              <div className="flex items-center justify-between border-b border-neutral-800/40 py-1">
                <span>Status:</span>
                <span className={`font-semibold ${isInstalled ? 'text-emerald-400' : 'text-sky-400'}`}>
                  {isInstalled ? '✓ Installed' : '○ Discovering'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-800/40 py-1">
                <span>Domain Scope:</span>
                <span className="text-white font-sans">{((ext as any).categories?.[0]) || ext.icon || 'Learning'}</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-800/40 py-1">
                <span>Rating:</span>
                <span className="text-amber-400">★★★★★</span>
              </div>
              <div className="flex items-center justify-between border-b border-neutral-800/40 py-1">
                <span>Curiosity Rate:</span>
                <span className="text-white">Compound %</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h3 className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Resources</h3>
            <div className="space-y-1.5 text-[#58a6ff] hover:text-[#58a6ff]/80 font-sans">
              <a 
                onClick={(e) => { e.preventDefault(); toast.success("Opening repository references..."); }}
                className="flex items-center gap-1.5 hover:underline cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-neutral-400" />
                <span>Knowledge Base</span>
              </a>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
