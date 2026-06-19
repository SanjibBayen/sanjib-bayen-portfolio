/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * Professional PowerShell Terminal Emulator - CMD Style
 * Uses shared terminal logic from useTerminalCore hook
 * Dynamically adapts to VSCode theme colors
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Terminal, 
  HelpCircle, 
  RefreshCw, 
  Plus,
  X,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { VSCodeTheme, TerminalLine } from '@/types';
import { useTerminalCore } from '@/features/terminal/hooks/useTerminalCore';

// ─── Interfaces ────────────────────────────────────────────────

interface CmdSandboxDashboardProps {
  theme: VSCodeTheme;
  onThemeSelect: (themeId: string) => void;
  openFile: (path: string) => void;
  simulateLogsTrigger?: string;
  setSimulateLogsTrigger?: (trigger: string) => void;
  onClose?: () => void;
  terminalHistory?: TerminalLine[];
  setTerminalHistory?: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
  currentPath?: string[];
  setCurrentPath?: React.Dispatch<React.SetStateAction<string[]>>;
  commandQueue?: string[];
  setCommandQueue?: React.Dispatch<React.SetStateAction<string[]>>;
  queuePointer?: number;
  setQueuePointer?: React.Dispatch<React.SetStateAction<number>>;
}

interface TabSession {
  id: string;
  name: string;
  history: TerminalLine[];
  currentPath: string[];
  commandQueue: string[];
  queuePointer: number;
}

// ─── Styles ────────────────────────────────────────────────────

const getStyles = (theme: VSCodeTheme) => `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap');

  .terminal-font {
    font-family: 'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace;
  }

  .terminal-scrollbar::-webkit-scrollbar {
    width: 8px;
  }
  .terminal-scrollbar::-webkit-scrollbar-track {
    background: ${theme.panelBg};
  }
  .terminal-scrollbar::-webkit-scrollbar-thumb {
    background: ${theme.activeBorder}40;
    border-radius: 4px;
    border: 2px solid ${theme.panelBg};
  }
  .terminal-scrollbar::-webkit-scrollbar-thumb:hover {
    background: ${theme.activeBorder}60;
  }

  .tabs-scroll::-webkit-scrollbar {
    height: 0;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(2px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn {
    animation: fadeIn 0.15s ease-out;
  }
`;

// ─── Theme Color Helpers ───────────────────────────────────────

const hexToRgba = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const adjustColor = (hex: string, amount: number): string => {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
};

// ─── Component ─────────────────────────────────────────────────

export default function CmdSandboxDashboard({
  theme,
  onThemeSelect,
  openFile,
  simulateLogsTrigger,
  setSimulateLogsTrigger,
  onClose,
  terminalHistory,
  setTerminalHistory,
  currentPath,
  setCurrentPath,
  commandQueue,
  setCommandQueue,
  queuePointer,
  setQueuePointer,
}: CmdSandboxDashboardProps) {
  
  const [isMaximized, setIsMaximized] = useState(false);
  const [localSessions, setLocalSessions] = useState<TabSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('tab-1');

  // ─── Theme-Derived Colors ────────────────────────────────────
  
  const colors = {
    bg: theme.panelBg,                                          // Main background
    titleBg: adjustColor(theme.panelBg, 3),                     // Slightly lighter for title bar
    border: hexToRgba(theme.activeBorder, 0.15),                 // Border color
    separator: hexToRgba(theme.activeBorder, 0.1),              // Separator lines
    text: theme.textColor,                                       // Main text
    textDim: hexToRgba(theme.textColor, 0.5),                   // Dimmed text
    textMuted: hexToRgba(theme.textColor, 0.35),                // Muted text
    hover: hexToRgba(theme.textColor, 0.08),                    // Hover background
    activeBorder: theme.activeBorder,                            // Active tab border
    skyText: theme.activeBorder,                                 // Sky/blue text (uses theme accent)
    emeraldText: '#4ade80',                                      // Success text (keep consistent)
    amberText: '#fbbf24',                                       // Input text (keep consistent)
    redText: '#f87171',                                         // Error text (keep consistent)
    inputBg: hexToRgba(theme.panelBg, 0.5),                     // Input background
    tabActiveBg: theme.panelBg,                                  // Active tab bg
    tabInactiveBg: 'transparent',                                // Inactive tab bg
    tabHoverBg: hexToRgba(theme.sidebarBg, 0.5),                // Tab hover bg
    closeHoverBg: hexToRgba('#ef4444', 0.2),                    // Close button hover
    closeHoverText: '#f87171',                                   // Close button hover text
  };

  // ─── Main Terminal Core (Tab 1) ────────────────────────────
  
  const mainTerminal = useTerminalCore({
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

  // ─── Tab Management ─────────────────────────────────────────

  const getActiveSession = useCallback((): TabSession | null => {
    if (activeSessionId === 'tab-1') {
      return {
        id: 'tab-1',
        name: 'PowerShell',
        history: mainTerminal.history,
        currentPath: mainTerminal.currentPath,
        commandQueue: mainTerminal.commandQueue,
        queuePointer: mainTerminal.queuePointer,
      };
    }
    return localSessions.find(s => s.id === activeSessionId) ?? null;
  }, [activeSessionId, mainTerminal, localSessions]);

  const addNewTab = useCallback(() => {
    const id = `tab-${Date.now()}`;
    const num = localSessions.length + 2;
    const newTab: TabSession = {
      id,
      name: `Shell ${num}`,
      history: [
        { text: `Windows PowerShell 7.4.2`, type: 'system' },
        { text: `Copyright (C) Microsoft Corporation. All rights reserved.`, type: 'system' },
        { text: '', type: 'output' },
        { text: `Loading Sanjib OS v4.1.0 development environment...`, type: 'success' },
        { text: `Session ${num} initialized. Type 'help' for available commands.`, type: 'success' },
        { text: '', type: 'output' },
      ],
      currentPath: [],
      commandQueue: [],
      queuePointer: -1,
    };
    setLocalSessions(prev => [...prev, newTab]);
    setActiveSessionId(id);
  }, [localSessions]);

  const closeTab = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (id === 'tab-1') {
      mainTerminal.clearHistory();
      return;
    }

    setLocalSessions(prev => {
      const remaining = prev.filter(s => s.id !== id);
      if (activeSessionId === id && remaining.length > 0) {
        setActiveSessionId(remaining[remaining.length - 1]!.id);
      } else if (remaining.length === 0) {
        setActiveSessionId('tab-1');
      }
      return remaining;
    });
  }, [activeSessionId, mainTerminal]);

  const toggleMaximize = useCallback(() => {
    setIsMaximized(prev => !prev);
  }, []);

  // ─── Auto-focus input on click ──────────────────────────────

  useEffect(() => {
    const handleClick = () => mainTerminal.inputRef.current?.focus();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [mainTerminal.inputRef]);

  // ─── Derived Values ─────────────────────────────────────────

  const session = getActiveSession();
  const activeHistory = session?.history ?? [];
  const activePath = session?.currentPath ?? [];
  const promptPath = activePath.length > 0 ? '\\' + activePath.join('\\') : '';

  // ─── Render ─────────────────────────────────────────────────

  return (
    <div 
      className={`flex flex-col h-full select-none overflow-hidden rounded-lg ${isMaximized ? 'fixed inset-0 z-50' : ''}`}
      style={{ 
        fontFamily: "'JetBrains Mono', 'Cascadia Code', 'Fira Code', monospace",
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      <style>{getStyles(theme)}</style>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TITLE BAR                                              */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div 
        className="flex items-center justify-between h-9 px-2 shrink-0 select-none border-b"
        style={{ 
          backgroundColor: colors.titleBg,
          borderColor: colors.border,
        }}
      >
        
        {/* Left: Tabs */}
        <div className="flex items-center h-full gap-0 overflow-x-auto tabs-scroll flex-1 min-w-0">
          
          {/* Main Tab */}
          <div
            onClick={() => setActiveSessionId('tab-1')}
            className="group relative flex items-center gap-2 h-8 px-3 rounded-t-md cursor-pointer transition-all duration-150 border-b-2"
            style={{
              backgroundColor: activeSessionId === 'tab-1' ? colors.tabActiveBg : colors.tabInactiveBg,
              borderBottomColor: activeSessionId === 'tab-1' ? colors.activeBorder : 'transparent',
              color: activeSessionId === 'tab-1' ? colors.text : colors.textDim,
            }}
            onMouseEnter={(e) => {
              if (activeSessionId !== 'tab-1') {
                e.currentTarget.style.backgroundColor = colors.tabHoverBg;
                e.currentTarget.style.color = colors.text;
              }
            }}
            onMouseLeave={(e) => {
              if (activeSessionId !== 'tab-1') {
                e.currentTarget.style.backgroundColor = colors.tabInactiveBg;
                e.currentTarget.style.color = colors.textDim;
              }
            }}
          >
            <Terminal 
              className="w-3.5 h-3.5" 
              style={{ color: activeSessionId === 'tab-1' ? colors.skyText : colors.textMuted }}
            />
            <span className="text-[11px] font-medium tracking-tight whitespace-nowrap">PowerShell</span>
            <button
              onClick={(e) => closeTab('tab-1', e)}
              className="ml-1 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-all"
              style={{ color: colors.textMuted }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.closeHoverBg;
                e.currentTarget.style.color = colors.closeHoverText;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = colors.textMuted;
              }}
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          {/* Dynamic Tabs */}
          {localSessions.map(tab => (
            <div
              key={tab.id}
              onClick={() => setActiveSessionId(tab.id)}
              className="group relative flex items-center gap-2 h-8 px-3 rounded-t-md cursor-pointer transition-all duration-150 border-b-2"
              style={{
                backgroundColor: activeSessionId === tab.id ? colors.tabActiveBg : colors.tabInactiveBg,
                borderBottomColor: activeSessionId === tab.id ? colors.emeraldText : 'transparent',
                color: activeSessionId === tab.id ? colors.text : colors.textDim,
              }}
              onMouseEnter={(e) => {
                if (activeSessionId !== tab.id) {
                  e.currentTarget.style.backgroundColor = colors.tabHoverBg;
                  e.currentTarget.style.color = colors.text;
                }
              }}
              onMouseLeave={(e) => {
                if (activeSessionId !== tab.id) {
                  e.currentTarget.style.backgroundColor = colors.tabInactiveBg;
                  e.currentTarget.style.color = colors.textDim;
                }
              }}
            >
              <Terminal 
                className="w-3.5 h-3.5" 
                style={{ color: activeSessionId === tab.id ? colors.emeraldText : colors.textMuted }}
              />
              <span className="text-[11px] font-medium tracking-tight whitespace-nowrap">{tab.name}</span>
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className="ml-1 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-all"
                style={{ color: colors.textMuted }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.closeHoverBg;
                  e.currentTarget.style.color = colors.closeHoverText;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = colors.textMuted;
                }}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {/* Add Tab Button */}
          <button
            onClick={addNewTab}
            className="flex items-center justify-center w-8 h-8 rounded-md transition-all ml-1 shrink-0"
            style={{ color: colors.textMuted }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hover;
              e.currentTarget.style.color = colors.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.textMuted;
            }}
            title="New Terminal (Ctrl+Shift+T)"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-1 ml-2 shrink-0">
          {/* Clear Button */}
          <button
            onClick={() => mainTerminal.clearHistory()}
            className="flex items-center justify-center w-8 h-8 rounded-md transition-all"
            style={{ color: colors.textDim }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hover;
              e.currentTarget.style.color = colors.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.textDim;
            }}
            title="Clear Terminal"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Help Button */}
          <button
            onClick={() => mainTerminal.executeCommand('help')}
            className="flex items-center justify-center w-8 h-8 rounded-md transition-all"
            style={{ color: colors.textDim }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = hexToRgba(colors.skyText, 0.1);
              e.currentTarget.style.color = colors.skyText;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.textDim;
            }}
            title="Help"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Separator */}
          <div 
            className="w-px h-5 mx-1" 
            style={{ backgroundColor: colors.separator }}
          />

          {/* Maximize */}
          <button
            onClick={toggleMaximize}
            className="flex items-center justify-center w-8 h-8 rounded-md transition-all"
            style={{ color: colors.textDim }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hover;
              e.currentTarget.style.color = colors.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = colors.textDim;
            }}
            title={isMaximized ? "Restore" : "Maximize"}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Close */}
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-md transition-all"
              style={{ color: colors.textDim }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.closeHoverBg;
                e.currentTarget.style.color = colors.closeHoverText;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = colors.textDim;
              }}
              title="Close"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TERMINAL BODY                                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-h-0 relative" style={{ backgroundColor: colors.bg }}>
        
        {/* Output Area */}
        <div
          ref={mainTerminal.terminalRef}
          className="flex-1 overflow-y-auto terminal-scrollbar px-5 py-3 space-y-1 min-h-0"
          onClick={() => mainTerminal.inputRef.current?.focus()}
        >
          
          {/* History Lines */}
          {activeHistory.map((line, idx) => {
            // Project Link
            if (line.type === 'link' && line.projectId) {
              return (
                <div
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    mainTerminal.handleProjectLink(line.projectId!);
                  }}
                  className="group flex items-center gap-2 py-0.5 cursor-pointer animate-fadeIn"
                >
                  <span 
                    className="font-semibold text-[13px]"
                    style={{ color: colors.skyText }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = adjustColor(colors.skyText, 30);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = colors.skyText;
                    }}
                  >
                    {line.text}
                  </span>
                  <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: colors.textMuted }}>
                    → Open
                  </span>
                </div>
              );
            }

            // Style mapping
            const styles: Record<string, { color: string; fontWeight?: string; fontStyle?: string }> = {
              input: { color: colors.amberText, fontWeight: '600' },
              system: { color: colors.textMuted, fontStyle: 'italic' },
              error: { color: colors.redText, fontWeight: '600' },
              success: { color: colors.emeraldText, fontWeight: '600' },
              output: { color: colors.text },
            };
            
            const prefixes: Record<string, string> = {
              input: '❯ ',
              error: '✗ ',
              success: '✓ ',
              system: '',
              output: '',
            };

            const lineStyle = (styles[line.type] || { color: colors.text }) as any;
            const prefix = prefixes[line.type] || '';

            return (
              <div
                key={idx}
                className="whitespace-pre-wrap leading-relaxed text-[13px] animate-fadeIn"
                style={{ 
                  color: lineStyle.color, 
                  fontWeight: lineStyle.fontWeight as any,
                  fontStyle: lineStyle.fontStyle as any,
                  wordBreak: 'break-word',
                }}
              >
                {prefix}{line.text}
              </div>
            );
          })}

          {/* Input Line */}
          <div className="flex items-center gap-1.5 pt-2">
            <span className="font-bold text-[13px] shrink-0" style={{ color: colors.skyText }}>PS</span>
            <span className="text-[13px] shrink-0" style={{ color: colors.textDim }}>
              C:\Projects\Sanjib-Bayen{promptPath}
            </span>
            <span className="font-bold text-[13px] shrink-0" style={{ color: colors.text }}>&gt;</span>
            
            <div className="flex-1 relative ml-1">
              <input
                ref={mainTerminal.inputRef}
                type="text"
                value={mainTerminal.terminalInput}
                onChange={(e) => mainTerminal.setTerminalInput(e.target.value)}
                onKeyDown={mainTerminal.handleKeyDown}
                readOnly={mainTerminal.isTyping}
                className={`w-full bg-transparent border-none outline-none text-[13px] placeholder-zinc-700 ${mainTerminal.isTyping ? 'cursor-wait opacity-85' : ''}`}
                style={{ 
                  color: colors.text,
                  caretColor: colors.skyText,
                }}
                placeholder="Type command..."
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                aria-label="Terminal input"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}