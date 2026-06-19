/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React from 'react';

interface OutputViewProps {
  outputLines: string[];
}

export default function OutputView({ outputLines }: OutputViewProps) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-[11px] p-3 text-left space-y-1 select-text" id="terminal-output-view">
      {outputLines.map((line, idx) => {
        let colorClass = 'text-slate-400';
        if (line.includes('[ERROR]')) colorClass = 'text-rose-400 font-semibold';
        else if (line.includes('[SUCCESS]') || line.includes('complete')) colorClass = 'text-emerald-400';
        
        return (
          <div key={idx} className={colorClass}>
            {line}
          </div>
        );
      })}
    </div>
  );
}
