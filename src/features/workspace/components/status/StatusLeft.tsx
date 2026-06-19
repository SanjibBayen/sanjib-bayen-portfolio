/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React from 'react';
import { 
  GitBranch, 
  RefreshCw, 
  CheckCircle2, 
  Database,
  Coffee
} from 'lucide-react';
import { PROJECTS_DATA } from '../../../../features/projects';

interface StatusLeftProps {
  gitCommitted: boolean;
  onRefresh: () => void;
}

export default function StatusLeft({ gitCommitted, onRefresh }: StatusLeftProps) {
  const personalCount = PROJECTS_DATA.filter(p => p.category === 'Personal Project').length;
  const worksCount = PROJECTS_DATA.filter(p => p.category === 'Works').length;
  
  return (
    <div className="flex items-center space-x-3.5 h-full select-none">
      {/* Branch */}
      <div 
        onClick={onRefresh}
        className="flex items-center space-x-1 hover:bg-white/10 px-1.5 h-full transition cursor-pointer"
        title="Reload Git Indices"
      >
        <GitBranch className="w-3.5 h-3.5 stroke-[1.8]" />
        <span className="font-mono text-[10px]">main</span>
      </div>

      {/* Sync Status Button */}
      <button 
        onClick={onRefresh}
        title="Sync local records"
        className="hover:bg-white/10 px-1 hover:opacity-100 transition h-full flex items-center cursor-pointer bg-transparent border-0 text-inherit"
      >
        <RefreshCw className={`w-3 h-3 ${gitCommitted ? '' : 'animate-spin'}`} />
      </button>

      {/* Dynamic Git/Workspace File modification status */}
      <div className="flex items-center space-x-2.5 h-full">
        {gitCommitted ? (
          <div className="flex items-center space-x-1 hover:bg-white/10 px-1.5 h-full transition" title="0 outstanding changes (clean workspace)">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span className="font-mono text-[10px]">clean</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1 hover:bg-white/10 px-1.5 h-full transition text-amber-300" title="1 unstaged modification in portfolio.db">
           <Coffee className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-mono text-[10px]">chai:legendary</span>
          </div>
        )}
      </div>

      {/* Dynamic Database Statistics */}
      <div 
        className="hidden md:flex items-center space-x-1.5 hover:bg-white/10 px-2 h-full transition"
        title={`Portfolio DB: ${PROJECTS_DATA.length} projects registered`}
      >
        <Database className="w-3 h-3 opacity-90 text-sky-400" />
        <span className="font-mono text-[10px]">
          portfolio.db: {PROJECTS_DATA.length} active ({personalCount} personal, {worksCount} works)
        </span>
      </div>
    </div>
  );
}
