/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  RefreshCw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { VSCodeTheme, TerminalLine } from '../../../shared/types';
import { useTerminalCore } from '../../terminal/hooks/useTerminalCore';

// Modular views
import ProblemsView from '../../terminal/components/ProblemsView';
import OutputView from '../../terminal/components/OutputView';
import PortsView from '../../terminal/components/PortsView';

interface TerminalPanelProps {
  theme: VSCodeTheme;
  onThemeSelect: (themeId: string) => void;
  openFile: (path: string) => void;
  panelHeight: number;
  setPanelHeight: (height: number) => void;
  simulateLogsTrigger?: string;
  setSimulateLogsTrigger: (trig: string) => void;
  onClose?: () => void;
  extensions?: any[];
  terminalHistory?: TerminalLine[];
  setTerminalHistory?: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
  currentPath?: string[];
  setCurrentPath?: React.Dispatch<React.SetStateAction<string[]>>;
  commandQueue?: string[];
  setCommandQueue?: React.Dispatch<React.SetStateAction<string[]>>;
  queuePointer?: number;
  setQueuePointer?: React.Dispatch<React.SetStateAction<number>>;
}

export default function TerminalPanel(props: TerminalPanelProps) {
  const {
    theme,
    onThemeSelect,
    openFile,
    panelHeight,
    setPanelHeight,
    simulateLogsTrigger,
    setSimulateLogsTrigger,
    onClose,
    extensions,
    terminalHistory,
    setTerminalHistory,
    currentPath,
    setCurrentPath,
    commandQueue,
    setCommandQueue,
    queuePointer,
    setQueuePointer
  } = props;

  const [activePanelTab, setActivePanelTab] = useState<'problems' | 'output' | 'debug' | 'terminal' | 'ports'>('terminal');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Problems list
  const [problems] = useState([]);

  // ─── Use Shared Terminal Core ───────────────────────────────
  
  const terminal = useTerminalCore({
    onThemeSelect,
    openFile,
    simulateTrigger: simulateLogsTrigger,
    setSimulateTrigger: setSimulateLogsTrigger,
    externalHistory: terminalHistory,
    setExternalHistory: setTerminalHistory,
    externalPath: currentPath,
    setExternalPath: setCurrentPath,
    externalQueue: commandQueue,
    setExternalQueue: setCommandQueue,
    externalPointer: queuePointer,
    setExternalPointer: setQueuePointer,
  });

  // ─── Debug Console ──────────────────────────────────────────
  
  const [debugLogs, setDebugLogs] = useState<{ query: string; response: string }[]>([
    { query: 'device_model', response: '"Jetson_Orin_Nano"' },
    { query: 'process.uptime()', response: '"Steady uptime since 2026-06-01"' }
  ]);
  const [debugInput, setDebugInput] = useState('');
  const debugEndRef = useRef<HTMLDivElement>(null);

  // ─── Output Console ─────────────────────────────────────────
  
  const [outputLines] = useState<string[]>([
    "[2026-06-01 15:53:28] Booting Sanjib's workspace bindings...",
    '[2026-06-01 15:53:29] Compilation complete. Wasm binary generated in index.html scripts.',
    '[2026-06-01 15:53:30] Webpack HMR is bypassed by platform guidelines. Watchers disabled.',
    '[2026-06-01 15:53:31] Virtual port listener activated. Server streaming metrics.'
  ]);

  // ─── Auto-scroll debug ──────────────────────────────────────
  
  useEffect(() => {
    if (debugEndRef.current) {
      debugEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [debugLogs]);

  // ─── Debug Expression Evaluator ─────────────────────────────
  
  const evalDebugExpression = (equation: string) => {
    const q = equation.trim();
    if (!q) return;

    let res = '';
    const cleanEq = q.toLowerCase().replace(/\s+/g, '');

    if (cleanEq === 'device_model') {
      res = '"Jetson_Orin_Nano"';
    } else if (cleanEq === 'uptime' || cleanEq === 'process.uptime()') {
      res = '"Steady uptime since 2026-06-01"';
    } else if (cleanEq === 'sanjib' || cleanEq === 'sanjibbayen') {
      res = '"Senior AI Systems Engineer & Co-founder of Shuttersync Studios"';
    } else if (cleanEq === 'profile' || cleanEq === 'whoami') {
      res = '"Sanjib Bayen - sanjibayen04@gmail.com"';
    } else {
      try {
        if (/^[0-9+\-*/().\s]+$/.test(q)) {
          const evaluated = Function(`"use strict"; return (${q})`)();
          res = String(evaluated);
        } else {
          res = 'Unrecognized symbol. Try: "5 * 10", "device_model", "sanjib", "profile"';
        }
      } catch {
        res = 'Error: Arithmetic expression is invalid.';
      }
    }

    setDebugLogs(prev => [...prev, { query: q, response: res }]);
    setDebugInput('');
  };

  // ─── Resize Handler ─────────────────────────────────────────
  
  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isFullscreen) return;
    const startY = e.clientY;
    const startHeight = panelHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const maxTerminalHeight = Math.floor(window.innerHeight * 0.35);
      const newHeight = Math.max(90, Math.min(maxTerminalHeight, startHeight - deltaY));
      setPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // ─── Render ─────────────────────────────────────────────────
  
  return (
    <div
      className="border-t overflow-hidden flex flex-col font-mono text-[11.5px] select-text relative shrink-0"
      id="terminal-panel-container"
      style={{
        height: isFullscreen ? 'calc(100vh - 64px)' : `${panelHeight}px`,
        position: isFullscreen ? 'fixed' : 'relative',
        bottom: isFullscreen ? '28px' : 0,
        left: 0,
        right: 0,
        zIndex: isFullscreen ? 35 : 20,
        backgroundColor: theme.panelBg,
        borderColor: `${theme.activeBorder}25`,
        color: theme.textColor
      }}
    >
      {/* Invisible drag-handle to resize panel */}
      {!isFullscreen && (
        <div 
          className="absolute top-0 left-0 right-0 h-1.5 cursor-ns-resize hover:bg-sky-500/40 z-50 transition-colors"
          onMouseDown={handleResizeMouseDown}
          title="Drag to resize terminal panel"
        />
      )}
      
      {/* Terminal Panel Header Workspace Bar */}
      <div 
        className="h-[30px] border-b flex items-center justify-between px-3 select-none text-[10.5px] font-sans shrink-0"
        id="terminal-tabs-header"
        style={{ 
          backgroundColor: theme.sidebarBg,
          borderColor: `${theme.activeBorder}15`,
          color: theme.textColor
        }}
      >
        <div className="flex items-center space-x-4 h-full">
          {/* TAB Trigger - PROBLEMS */}
          <button
            onClick={() => setActivePanelTab('problems')}
            className={`h-full px-2.5 flex items-center space-x-1.5 border-b-2 hover:text-white transition cursor-pointer bg-transparent border-t-0 border-x-0 outline-none text-inherit ${
              activePanelTab === 'problems' 
                ? 'text-white font-semibold' 
                : 'text-neutral-400 border-transparent opacity-80'
            }`}
            style={{ borderBottomColor: activePanelTab === 'problems' ? theme.activeBorder : 'transparent' }}
          >
            <span>PROBLEMS</span>
            <span className="bg-neutral-800 text-neutral-400 text-[10px] items-center justify-center font-bold px-1.5 rounded-full flex scale-85">
              {problems.length}
            </span>
          </button>

          {/* TAB Trigger - OUTPUT */}
          <button
            onClick={() => setActivePanelTab('output')}
            className={`h-full px-2.5 flex items-center space-x-1 border-b-2 hover:text-white transition cursor-pointer bg-transparent border-t-0 border-x-0 outline-none text-inherit ${
              activePanelTab === 'output' 
                ? 'text-white font-semibold' 
                : 'text-neutral-400 border-transparent opacity-80'
            }`}
            style={{ borderBottomColor: activePanelTab === 'output' ? theme.activeBorder : 'transparent' }}
          >
            <span>OUTPUT</span>
          </button>

          {/* TAB Trigger - DEBUG CONSOLE */}
          <button
            onClick={() => setActivePanelTab('debug')}
            className={`h-full px-2.5 flex items-center space-x-1 border-b-2 hover:text-white transition cursor-pointer bg-transparent border-t-0 border-x-0 outline-none text-inherit ${
              activePanelTab === 'debug' 
                ? 'text-white font-semibold' 
                : 'text-neutral-400 border-transparent opacity-80'
            }`}
            style={{ borderBottomColor: activePanelTab === 'debug' ? theme.activeBorder : 'transparent' }}
          >
            <span>DEBUG CONSOLE</span>
          </button>

          {/* TAB Trigger - TERMINAL */}
          <button
            onClick={() => setActivePanelTab('terminal')}
            className={`h-full px-2.5 flex items-center space-x-1 border-b-2 hover:text-white transition cursor-pointer bg-transparent border-t-0 border-x-0 outline-none text-inherit ${
              activePanelTab === 'terminal' 
                ? 'text-white font-semibold' 
                : 'text-neutral-400 border-transparent opacity-80'
            }`}
            style={{ borderBottomColor: activePanelTab === 'terminal' ? theme.activeBorder : 'transparent' }}
          >
            <span>TERMINAL</span>
            <span className="bg-sky-500/15 text-sky-400 text-[9px] px-1 rounded hover:opacity-100 select-none">PowerShell</span>
          </button>

          {/* TAB Trigger - PORTS */}
          <button
            onClick={() => setActivePanelTab('ports')}
            className={`h-full px-2.5 flex items-center space-x-1 border-b-2 hover:text-white transition cursor-pointer bg-transparent border-t-0 border-x-0 outline-none text-inherit ${
              activePanelTab === 'ports' 
                ? 'text-white font-semibold' 
                : 'text-neutral-400 border-transparent opacity-80'
            }`}
            style={{ borderBottomColor: activePanelTab === 'ports' ? theme.activeBorder : 'transparent' }}
          >
            <span>PORTS</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-0.5" />
          </button>
        </div>

        {/* Console Action options */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => {
              if (activePanelTab === 'terminal') terminal.clearHistory();
              if (activePanelTab === 'debug') setDebugLogs([]);
            }}
            title="Clean Panel Feed"
            className="p-1 hover:bg-neutral-800 rounded transition cursor-pointer opacity-60 hover:opacity-100 bg-transparent border-0 text-inherit"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setPanelHeight(panelHeight > 220 ? 120 : 320)}
            disabled={isFullscreen}
            title="Toggle Size"
            className={`p-1 hover:bg-neutral-800 rounded transition cursor-pointer opacity-60 hover:opacity-100 bg-transparent border-0 text-inherit ${isFullscreen ? 'opacity-25 cursor-not-allowed' : ''}`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => setIsFullscreen(prev => !prev)}
            title={isFullscreen ? "Restore Size" : "Maximize Panel Size"}
            className="p-1 hover:bg-neutral-800 rounded transition cursor-pointer opacity-60 hover:opacity-100 bg-transparent border-0 text-inherit"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-sky-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              title="Close Panel (Ctrl+`)"
              className="p-1 hover:bg-neutral-800 rounded transition cursor-pointer opacity-60 hover:opacity-100 text-red-400 bg-transparent border-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Panel View Body */}
      <div className="flex-1 overflow-auto custom-scrollbar p-3 flex flex-col min-h-0" id="terminal-body-content">
        
        {/* VIEW A: PROBLEMS LIST */}
        {activePanelTab === 'problems' && (
          <ProblemsView 
            problems={problems}
            openFile={openFile}
          />
        )}

        {/* VIEW B: COMPILATION OUTPUT */}
        {activePanelTab === 'output' && (
          <OutputView outputLines={outputLines} />
        )}

        {/* VIEW C: MATHEMATICAL DEBUG CONSOLE */}
        {activePanelTab === 'debug' && (
          <div className="flex-1 flex flex-col justify-between select-text min-h-0 text-left font-mono">
            <div className="overflow-y-auto space-y-2 flex-1 custom-scrollbar pr-2 mb-2">
              <div className="text-slate-500 text-[10.5px] italic mb-1">
                // Evaluates custom JS variables or equations with simple filters.
                // Examples: "5 * 15", "device_model", "sanjib", "profile", "(140 - 20) / 2"
              </div>
              
              {debugLogs.map((log, id) => (
                <div key={id} className="space-y-0.5 border-l-2 border-neutral-700 pl-2.5">
                  <div className="text-slate-400">⚡ debug&gt; <span className="text-indigo-300 font-semibold">{log.query}</span></div>
                  <div className="text-emerald-400 pl-4">{log.response}</div>
                </div>
              ))}
              <div ref={debugEndRef} />
            </div>

            <div className="flex items-center space-x-1.5 border-t border-neutral-800/50 pt-2 shrink-0">
              <span className="text-indigo-400 font-bold">debug&gt;</span>
              <input
                type="text"
                value={debugInput}
                onChange={(e) => setDebugInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && evalDebugExpression(debugInput)}
                placeholder="Type variable or calculus expression here..."
                className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-amber-300 placeholder-neutral-600 font-mono text-[11.5px]"
              />
            </div>
          </div>
        )}

        {/* VIEW D: FULL INTERACTIVE TERMINAL POWERSHELL */}
        {activePanelTab === 'terminal' && (
          <div 
            ref={terminal.terminalRef}
            className="flex-1 overflow-y-auto custom-scrollbar select-text min-h-0 text-left"
            onClick={() => terminal.inputRef.current?.focus()}
          >
            <div className="space-y-1.5 pr-2 mb-2 font-mono">
              {terminal.history.map((line, id) => {
                if (line.type === 'link' && line.projectId) {
                  return (
                    <div
                      key={id}
                      onClick={(e) => {
                        e.stopPropagation();
                        terminal.handleProjectLink(line.projectId!);
                      }}
                      className="cursor-pointer text-sky-400 hover:text-sky-300 hover:underline flex items-center space-x-1 py-0.5 font-mono font-bold leading-relaxed w-fit select-none"
                      title="Click to view this project inside portfolio.db!"
                    >
                      <span>{line.text}</span>
                      <span className="text-[9px] text-zinc-500 font-normal no-underline ml-2 italic cursor-pointer select-none">(click to view project)</span>
                    </div>
                  );
                }
                let colorClass = 'text-slate-300';
                if (line.type === 'input') colorClass = 'text-white font-semibold font-mono';
                if (line.type === 'system') colorClass = 'text-neutral-500 font-mono italic';
                if (line.type === 'error') colorClass = 'text-red-400 font-mono font-medium';
                if (line.type === 'success') colorClass = 'text-sky-400 font-mono font-bold';
                return (
                  <div key={id} className={`whitespace-pre-wrap ${colorClass} leading-relaxed font-mono`}>
                    {line.text}
                  </div>
                );
              })}
            </div>

            {/* Input prompt line */}
            <div className="flex items-center space-x-1.5 border-t border-neutral-800/40 pt-2 shrink-0">
              <span className="text-emerald-500 font-extrabold select-none shrink-0 font-mono text-[11px]">
                PS C:\Projects\Sanjib-Bayen{terminal.formatPromptPath()}&gt;
              </span>
              <input
                ref={terminal.inputRef}
                type="text"
                autoFocus
                value={terminal.terminalInput}
                onChange={(e) => terminal.setTerminalInput(e.target.value)}
                onKeyDown={terminal.handleKeyDown}
                readOnly={terminal.isTyping}
                className={`flex-1 bg-transparent border-none outline-none focus:ring-0 text-amber-300 caret-amber-400 font-mono text-[11.5px] py-0 ${terminal.isTyping ? 'cursor-wait opacity-85' : ''}`}
                aria-label="PowerShell Input"
              />
            </div>
          </div>
        )}

        {/* VIEW E: REAL EXPOSED PORTS DETECTOR */}
        {activePanelTab === 'ports' && (
          <PortsView />
        )}

      </div>
    </div>
  );
}
