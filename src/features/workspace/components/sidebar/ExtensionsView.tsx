/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Check, 
  Circle,
  Brain,
  Orbit,
  Code2,
  Crown,
  Cpu,
  Network,
  Palette,
  Atom,
  Microscope,
  Package,
  Sparkles,
} from 'lucide-react';
import { PROFILE_DATA } from '../../../../features/about';
import { PROJECTS_DATA } from '../../../../features/projects';
import extensionsData from '../../../../data/extensions.json';

interface ExtensionsViewProps {
  openFile?: (path: string) => void;
}

// ─── Icon & Color Map ──────────────────────────────────────────

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Brain, Orbit, Code2, Crown, Cpu, Network, Palette, Atom, Microscope, Sparkles,
};

const COLOR_MAP: Record<string, string> = {
  Brain: '#a78bfa',
  Orbit: '#38bdf8',
  Code2: '#60a5fa',
  Crown: '#facc15',
  Cpu: '#fb923c',
  Network: '#4ade80',
  Palette: '#fbbf24',
  Atom: '#e879f9',
  Microscope: '#2dd4bf',
  Sparkles: '#c084fc',
};

// ─── Component ─────────────────────────────────────────────────

export default function ExtensionsView({ openFile }: ExtensionsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // ─── Data ────────────────────────────────────────────────────

  const installed = extensionsData.installed || [];
  const discovering = extensionsData.discovering || [];

  const filterBySearch = (items: any[]) =>
    items.filter(ext =>
      ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const filteredInstalled = useMemo(() => filterBySearch(installed), [searchQuery, installed]);
  const filteredDiscovering = useMemo(() => filterBySearch(discovering), [searchQuery, discovering]);

  // ─── Render ──────────────────────────────────────────────────

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#1e1e1e] text-[#cccccc] font-sans select-none text-left">
      
      {/* Search Bar */}
      <div className="p-2.5 bg-[#252526] border-b border-[#3c3c3c] shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#8b949e] pointer-events-none" />
          <input
            type="text"
            placeholder="Search Extensions in Marketplace"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-2 py-1.5 pl-8 pr-8 rounded bg-[#3c3c3c]/60 text-xs border border-transparent focus:border-[#007acc] focus:outline-none text-[#cccccc] placeholder-[#8b949e] text-[11px]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')} 
              className="absolute right-2 top-2 text-[#8b949e] hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Extensions List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
        
        {/* INSTALLED Section */}
        <div>
          <div className="text-[10px] font-bold text-[#8b949e] mb-2 px-1 py-0.5 uppercase tracking-wider font-mono flex items-center justify-between">
            <span>Installed</span>
            <span className="text-[9px] opacity-60">({filteredInstalled.length})</span>
          </div>

          <div className="space-y-1.5">
            {filteredInstalled.map((ext) => {
              const IconComp = ICON_MAP[ext.icon] || Package;
              const color = COLOR_MAP[ext.icon] || '#8b949e';

              return (
                <div
                  key={ext.id}
                  className="p-2.5 rounded border border-[#2d2d2d] bg-[#252526]/40 hover:bg-[#2a2a2b] transition flex gap-3 cursor-default group"
                >
                  {/* Icon */}
                  <div 
                    className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center border border-[#3c3c3c] transition-colors"
                    style={{ backgroundColor: `${color}10` }}
                  >
                    <IconComp className="w-4.5 h-4.5" style={{ color }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                       <span className="text-[11.5px] font-semibold text-[#cccccc] truncate">{ext.name}</span>
                      <span className="text-[9px] text-[#8b949e] font-mono shrink-0">v{ext.version}</span>
                    </div>
                    <p className="text-[10px] text-[#8b949e] mt-0.5 line-clamp-1">{ext.description}</p>
                    
                    {/* Installed Badge */}
                    <div className="flex items-center gap-1 mt-1.5 text-[9px] text-emerald-400 font-mono font-semibold">
                      <Check className="w-3 h-3" />
                      <span>Installed</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredInstalled.length === 0 && (
              <div className="text-[10px] text-[#8b949e] text-center py-4 border border-dashed border-[#3c3c3c] rounded font-mono">
                No installed extensions found
              </div>
            )}
          </div>
        </div>

        {/* DISCOVERING Section */}
        <div>
          <div className="text-[10px] font-bold text-[#8b949e] mb-2 px-1 py-0.5 uppercase tracking-wider font-mono flex items-center justify-between">
            <span>Discovering</span>
            <span className="text-[9px] opacity-60">({filteredDiscovering.length})</span>
          </div>

          <div className="space-y-1.5">
            {filteredDiscovering.map((ext) => {
              const IconComp = ICON_MAP[ext.icon] || Package;
              const color = COLOR_MAP[ext.icon] || '#8b949e';

              return (
                <div
                  key={ext.id}
                  className="p-2.5 rounded border border-[#2d2d2d] bg-[#252526]/40 hover:bg-[#2a2a2b] transition flex gap-3 cursor-default group"
                >
                  {/* Icon */}
                  <div 
                    className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center border border-[#3c3c3c] transition-colors"
                    style={{ backgroundColor: `${color}10` }}
                  >
                    <IconComp className="w-4.5 h-4.5" style={{ color }} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                       <span className="text-[11.5px] font-semibold text-[#cccccc] truncate">{ext.name}</span>
                      <span className="text-[9px] text-[#8b949e] font-mono shrink-0">v{ext.version}</span>
                    </div>
                    <p className="text-[10px] text-[#8b949e] mt-0.5 line-clamp-1">{ext.description}</p>
                    
                    {/* Exploring Badge */}
                    <div className="flex items-center gap-1 mt-1.5 text-[9px] text-sky-400 font-mono font-semibold">
                      <Circle className="w-2.5 h-2.5 fill-sky-400/30" />
                      <span>Exploring Next</span>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredDiscovering.length === 0 && (
              <div className="text-[10px] text-[#8b949e] text-center py-4 border border-dashed border-[#3c3c3c] rounded font-mono">
                No discovering extensions found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
