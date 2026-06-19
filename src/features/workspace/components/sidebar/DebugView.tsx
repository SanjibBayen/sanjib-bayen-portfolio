/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */
import React, { useState, useMemo } from 'react';
import { Play, RotateCcw, ChevronDown, ChevronRight, ShieldCheck } from 'lucide-react';
import { toast } from '../../../../shared/utils/toast';

interface DebugViewProps {
  onSimulateRun?: (configName: string) => void;
}

export default function DebugView({ onSimulateRun }: DebugViewProps) {
  const [isStatusOpen, setIsStatusOpen] = useState(true);
  const [isSessionOpen, setIsSessionOpen] = useState(true);
  const [isCalibrating, setIsCalibrating] = useState(false);

  // Status indicators for monospace listing
  const statusItems = [
    { label: 'Research', status: 'Online' },
    { label: 'Creativity', status: 'Online' },
    { label: 'Innovation', status: 'Online' },
    { label: 'Learning', status: 'Online' }
  ];

  const handleRebootCheck = () => {
    setIsCalibrating(true);
    toast.success("Initiating System status calibration...");
    
    if (onSimulateRun) {
      onSimulateRun("System Calibration");
    }

    setTimeout(() => {
      setIsCalibrating(false);
      toast.success("Calibration complete. All pipelines optimized!");
    }, 1500);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 bg-[#252526] text-[#cccccc] font-mono text-[11px] select-none text-left">
      
      {/* VS Code styled top control bar */}
      <div className="p-3 border-b border-neutral-800 flex items-center justify-between bg-[#1e1e1e] shrink-0">
        <span className="font-semibold text-neutral-400 font-sans text-xs flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          SYSTEM RUNTIME
        </span>
        <div className="flex items-center space-x-1">
          <button 
            onClick={handleRebootCheck}
            disabled={isCalibrating}
            className="p-1 hover:bg-neutral-800 rounded transition text-neutral-400 hover:text-emerald-400 cursor-pointer disabled:opacity-50"
            title="Calibrate System Status"
          >
            <Play className={`w-3 h-3 ${isCalibrating ? 'text-amber-400' : ''}`} />
          </button>
          <button 
            onClick={() => {
              toast.info("Clearing status buffers... zero logs detected.");
            }}
            className="p-1 hover:bg-neutral-800 rounded transition text-neutral-400 hover:text-rose-400 cursor-pointer"
            title="Reset Diagnosticians"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 space-y-1.5">
        
        {/* SECTION 1: SYSTEM STATUS */}
        <div className="border border-neutral-800/40 rounded overflow-hidden">
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            className="w-full flex items-center px-1.5 py-1 bg-[#1e1e1e] hover:bg-[#2a2a2b] transition font-semibold text-neutral-300 gap-1 border-b border-neutral-800/20"
          >
            {isStatusOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span className="font-sans text-[10px] uppercase tracking-wider">SYSTEM STATUS</span>
          </button>

          {isStatusOpen && (
            <div className="p-3 space-y-2 bg-[#1e1e1e]/40">
              {statusItems.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-0.5 group">
                  <span className="text-neutral-400 hover:text-white transition">{item.label}</span>
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: RUNTIME CONTEXT */}
        <div className="border border-neutral-800/40 rounded overflow-hidden">
          <button
            onClick={() => setIsSessionOpen(!isSessionOpen)}
            className="w-full flex items-center px-1.5 py-1 bg-[#1e1e1e] hover:bg-[#2a2a2b] transition font-semibold text-neutral-300 gap-1 border-b border-neutral-800/20"
          >
            {isSessionOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span className="font-sans text-[10px] uppercase tracking-wider">RUNTIME CONTEXT</span>
          </button>

          {isSessionOpen && (
            <div className="p-3 space-y-2.5 bg-[#1e1e1e]/40">
              <div>
                <div className="text-neutral-500 text-[10px] uppercase font-sans mb-0.5">Current Mission</div>
                <div className="text-white font-semibold text-[11.5px] leading-relaxed">Building the Future</div>
              </div>
              
              <div>
                <div className="text-neutral-500 text-[10px] uppercase font-sans mb-0.5">Mode</div>
                <div className="text-sky-400 font-semibold font-mono text-[11px] flex items-center gap-1">
                  <code>Builder</code>
                </div>
              </div>

              <div>
                <div className="text-neutral-500 text-[10px] uppercase font-sans mb-0.5">Status</div>
                <div className="text-emerald-400 font-bold font-mono text-[11px] flex items-center gap-1">
                  <code>Operational</code>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
