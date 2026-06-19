/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface Problem {
  id: number;
  type: string;
  message: string;
  code: string;
  file: string;
  line: number;
}

interface ProblemsViewProps {
  problems: Problem[];
  openFile: (path: string) => void;
}

export default function ProblemsView({ problems, openFile }: ProblemsViewProps) {
  if (problems.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-neutral-500 select-none" id="terminal-problems-empty">
        <span className="text-xs font-semibold text-neutral-400 font-sans tracking-wide">No problems have been detected in the workspace.</span>
        <span className="text-[10px] opacity-50 mt-1 font-mono">Compiled successfully with exactly zero faults, warnings, or leaks.</span>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[11.5px] p-2 flex flex-col space-y-1 text-left select-text" id="terminal-problems-view">
      {problems.map((prob) => (
        <button
          key={prob.id}
          id={`problem-row-${prob.id}`}
          onClick={() => openFile(prob.file)}
          className="w-full text-left p-1.5 hover:bg-neutral-800/40 rounded flex items-center justify-between border-0 transition text-inherit cursor-pointer bg-transparent"
        >
          <div className="flex items-center space-x-2">
            {prob.type === 'warning' ? (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            ) : (
              <Info className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            )}
            <span className="text-slate-300">{prob.message}</span>
            <span className="text-neutral-500 text-[10.5px] shrink-0">[{prob.code}]</span>
          </div>
          <div className="text-[10px] text-neutral-500 shrink-0 font-mono pl-4">
            {prob.file}:{prob.line}
          </div>
        </button>
      ))}
    </div>
  );
}
