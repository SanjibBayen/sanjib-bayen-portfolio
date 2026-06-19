/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */
import React from 'react';
import { 
  GitBranch, 
  ChevronDown, 
  MoreHorizontal, 
  RotateCcw, 
  FileCode,
  GitCommit
} from 'lucide-react';

interface GitViewProps {
  gitCommitted: boolean;
  setGitCommitted: (com: boolean) => void;
  openFile?: (path: string) => void;
}

export default function GitView({ gitCommitted, setGitCommitted, openFile }: GitViewProps) {
  // Modified files matching the three main sections
  const changedFiles = [
    { name: 'ping_human.js', path: 'connect/api.tsx', status: 'M', statusText: 'Modified', color: 'text-amber-400' },
    { name: 'whoami.md', path: 'about/README.md', status: 'M', statusText: 'Modified', color: 'text-amber-400' },
    { name: 'combat_stats.json', path: 'skills/skills.pkt', status: 'M', statusText: 'Modified', color: 'text-amber-400' }
  ];

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col h-full text-left bg-[#252526] select-none text-[#cccccc] font-sans text-xs">
      
      {/* SOURCE CONTROL TOOLBAR ACTIONS bar */}
      <div className="px-3 py-2 bg-[#2d3238]/30 border-b border-[#1b1b1b]/80 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-1.5 font-mono text-[10px] text-neutral-400">
          <GitBranch className="w-3.5 h-3.5 text-sky-400" />
          <span className="font-bold text-[#e1e1e1]">main</span>
          <span className="opacity-50">• Local Repository</span>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={handleRefresh}
            title="Refresh repository cache"
            className="hover:bg-[#3c3c3c] p-1 rounded text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button 
            title="More Actions..."
            className="hover:bg-[#3c3c3c] p-1 rounded text-neutral-400 hover:text-white transition cursor-pointer"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* DETAILED REALISTIC VS CODE STYLE GIT PANEL */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-4">
        
        {/* COMMITTING MESSAGE FORM */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              readOnly
              value="chore: convinced code to work without understanding why"
              placeholder="Commit message..."
              className="w-full min-h-[56px] max-h-[100px] bg-[#3c3c3c] text-white font-sans text-xs p-2 rounded outline-none border border-[#3c3c3c] cursor-default focus:border-[#007acc] resize-none leading-tight"
              aria-label="Commit Message"
            />
          </div>
          
          <button
            onClick={() => {}}
            className="w-full py-1.5 font-semibold text-xs rounded shadow-sm text-center flex items-center justify-center space-x-1.5 bg-[#007acc] hover:bg-[#0062a3] text-white border border-[#005f9e] transition cursor-pointer"
          >
            <GitCommit className="w-4 h-4 shrink-0" />
            <span>Commit & Push</span>
          </button>
        </div>

        {/* ACCORDION SECTION: CHANGES */}
        <div className="space-y-1.5 pt-1.5">
          <div className="w-full flex items-center justify-between py-1 select-none text-[10px] uppercase font-bold text-neutral-400">
            <div className="flex items-center space-x-1.5 min-w-0">
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              <span className="tracking-wider text-[#9aa0a6]">CHANGES</span>
              <span className="text-[8.5px] text-white bg-[#007acc] px-1.5 rounded-full select-none font-mono">
                {changedFiles.length}
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 px-1 font-mono font-normal">Active</span>
          </div>

          <div className="space-y-1">
            {changedFiles.map(file => (
              <div
                key={file.name}
                className="group flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#2a2d2e]/80 transition text-neutral-300"
                title={`${file.name} is modified (${file.statusText})`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <FileCode className="w-4 h-4 text-neutral-450 shrink-0" />
                  <div className="flex flex-col truncate">
                    <span className="text-[11.5px] text-[#e1e2e3] font-medium truncate leading-tight">{file.name}</span>
                    <span className="text-[9px] text-neutral-500 font-mono truncate leading-none mt-0.5">{file.path}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 pl-1 select-none">
                  <span className={`w-4 text-center font-bold font-mono text-[10px] ${file.color}`}>
                    {file.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* STATIC STATUS META INFORMATION FOOTER */}
        <div className="border-t border-[#30363d]/30 pt-3 flex flex-col space-y-1.5 text-[10.5px] text-neutral-400 font-sans leading-relaxed">
          <div className="flex items-center gap-1.5 text-[#58a6ff]" />
          <p className="text-neutral-500 font-sans text-[10px] leading-snug">
            running on caffeine and unreasonable optimism.
          </p>
        </div>

      </div>

    </div>
  );
}
