/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */
import React from 'react';
import { 
  Minus, 
  Square, 
  X, 
  Search, 
  Sparkles, 
  ChevronDown, 
  ArrowLeft, 
  ArrowRight
} from 'lucide-react';
import { VSCodeTheme } from '../../../shared/types';
import { toast } from '../../../shared/utils/toast';

import {
  VSCodeLogo,
  SidebarToggleIcon,
  BottomPanelToggleIcon,
  SecondarySidebarToggleIcon,
  LayoutToggleIcon,
  SplitLayoutToggleIcon
} from './title/TitleBarIcons';
import TitleMenu from './title/TitleMenu';
import { PROFILE_DATA } from '../../../features/about';

interface TitleBarProps {
  theme: VSCodeTheme;
  activeFileName: string;
  onRefresh: () => void;
  onThemeSelect: (themeId: string) => void;
  allThemes: VSCodeTheme[];
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
  isTerminalOpen?: boolean;
  setIsTerminalOpen?: (open: boolean) => void;
}

export default function TitleBar({
  theme,
  onRefresh,
  onThemeSelect,
  allThemes,
  isSidebarOpen = true,
  setIsSidebarOpen,
  isTerminalOpen = true,
  setIsTerminalOpen
}: TitleBarProps) {

  return (
    <div
      className="h-9 border-b select-none flex items-center justify-between text-[12.5px] px-2.5 relative font-sans shrink-0 z-40 transition-colors duration-200"
      id="titlebar-wrapper"
      style={{
        backgroundColor: theme.id === 'dark-default' ? '#181818' : theme.sidebarBg,
        borderColor: theme.id === 'dark-default' ? '#252525' : `${theme.activeBorder}25`,
        color: theme.id === 'dark-default' ? '#cccccc' : theme.textColor
      }}
    >
      {/* 1. Left: VS Code Icon, Menus, Keyboard Arrows */}
      <div className="flex items-center space-x-2 z-30 shrink-0 select-none">
        <VSCodeLogo />

        {/* Text Menus Row */}
        <TitleMenu 
          theme={theme}
          allThemes={allThemes}
          onRefresh={onRefresh}
          onThemeSelect={onThemeSelect}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isTerminalOpen={isTerminalOpen}
          setIsTerminalOpen={setIsTerminalOpen}
        />

        {/* Back and Forward Navigation Arrows */}
        <div className="flex items-center space-x-1 pl-2 border-l border-neutral-800/50">
          <button 
            onClick={() => toast.info("Already at initial workspace screen.")}
            className="p-1 hover:bg-neutral-800/40 rounded transition opacity-50 hover:opacity-100 cursor-pointer bg-transparent border-0 text-inherit"
            title="Go Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => toast.info("Forward direction is vacant.")}
            className="p-1 hover:bg-neutral-800/40 rounded transition opacity-50 hover:opacity-100 cursor-pointer bg-transparent border-0 text-inherit"
            title="Go Forward"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Middle: Perfect Search Pill containing "Sanjib Bayen" */}
      <div className="absolute inset-x-0 mx-auto flex items-center justify-center pointer-events-none select-none z-10 w-[350px] md:w-[480px]">
        <div 
          onClick={() => toast.info("Connected workspace: Sanjib Bayen (Senior Systems Architect)")}
          className="pointer-events-auto flex items-center justify-between w-full h-[22px] bg-neutral-800/35 hover:bg-neutral-800/55 border border-neutral-700/20 hover:border-neutral-700/50 transition-all rounded-[5px] px-3 text-[11px] text-slate-350 cursor-pointer shadow-inner/5"
          id="search-pill"
          title="Search / Active Workspace"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3 h-3 text-slate-450 opacity-55" />
            <span className="font-light tracking-wide text-xs text-slate-300">Sanjib Bayen</span>
          </div>
          <div 
            onClick={(e) => {
              e.stopPropagation();
              toast.info("Sanjib Copilot AI is listening in the problems panel and the interactive terminal! Press Ctrl+` to summon.");
            }}
            className="flex items-center space-x-1 hover:bg-neutral-700/30 px-1 rounded transition opacity-65 hover:opacity-100"
            title="Sanjib Copilot Tools"
          >
            <Sparkles className="w-3 h-3 text-sky-400" />
            <ChevronDown className="w-2.5 h-2.5 text-slate-450" />
          </div>
        </div>
      </div>

      {/* 3. Right Side Layout Actions and Windows Window Management */}
      <div className="flex items-center space-x-1 z-35 shrink-0 ml-auto" id="layout-controls-wrapper">
        
        {/* Workspace Quick Actions */}
        <div className="flex items-center space-x-0.5 mr-1" id="quick-actions">
          {/* Theme Quick Switch Trigger */}
          <button
            onClick={() => {
              const currentId = theme.id;
              const nextId = currentId === 'dark-default' ? 'dracula' : currentId === 'dracula' ? 'one-dark' : currentId === 'one-dark' ? 'monokai' : 'dark-default';
              onThemeSelect(nextId);
            }}
            title="Cycle Active Theme"
            className="p-1 rounded hover:bg-neutral-800/40 transition cursor-pointer group bg-transparent border-0"
          >
            <SplitLayoutToggleIcon />
          </button>
          
          <span className="text-neutral-700/60 font-thin mx-1 select-none">|</span>

          {/* Sidebar Toggle */}
          <button
            onClick={() => setIsSidebarOpen?.(!isSidebarOpen)}
            title="Toggle Primary Sidebar (Ctrl+B)"
            className="p-1 rounded hover:bg-neutral-800/40 transition cursor-pointer group bg-transparent border-0"
          >
            <SidebarToggleIcon active={isSidebarOpen} />
          </button>

          {/* Bottom Panel Toggle */}
          <button
            onClick={() => setIsTerminalOpen?.(!isTerminalOpen)}
            title="Toggle Bottom Terminal Panel (Ctrl+`)"
            className="p-1 rounded hover:bg-neutral-800/40 transition cursor-pointer group bg-transparent border-0"
          >
            <BottomPanelToggleIcon active={isTerminalOpen} />
          </button>

          {/* Secondary Sidebar */}
          <button
            onClick={() => toast.info("Current Workspace node: Drone Swarm Mesh is active server-side.")}
            title="Toggle Secondary Sidebar Status"
            className="p-1 rounded hover:bg-neutral-800/40 transition cursor-pointer group bg-transparent border-0"
          >
            <SecondarySidebarToggleIcon active={false} />
          </button>

          {/* Layout Choices Dropdown */}
          <button
            onClick={() => toast.info("To configure editor layouts, drag file tabs left / right to trigger split workspace.")}
            title="Configure Layout"
            className="p-1 rounded hover:bg-neutral-800/40 transition cursor-pointer bg-transparent border-0"
          >
            <LayoutToggleIcon />
          </button>
        </div>

        {/* Windows OS Control Buttons */}
        <div className="flex items-center h-full pl-1 -mr-[10px]" id="os-window-controls">
          {/* Windows Minimize */}
          <button
            className="h-9 w-[46px] flex items-center justify-center hover:bg-neutral-800/45 text-slate-300 hover:text-white transition cursor-pointer bg-transparent border-0"
            onClick={() => toast.info("Workspace is persistent to prevent status loss.")}
            title="Minimize"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>

          {/* Windows Maximize */}
          <button
            className="h-9 w-[46px] flex items-center justify-center hover:bg-neutral-800/45 text-slate-300 hover:text-white transition cursor-pointer bg-transparent border-0"
            onClick={() => toast.info("Already optimized and maximized for your viewport screen size.")}
            title="Maximize"
          >
            <Square className="w-3 h-3 opacity-85" />
          </button>

          {/* Windows Close */}
          <button
            className="h-9 w-[46px] flex items-center justify-center hover:bg-red-600 hover:text-white text-slate-300 transition cursor-pointer bg-transparent border-0"
            onClick={() => {
              toast.info("Navigating to Sanjib's full GitHub repository landscape...");
              setTimeout(() => {
                window.open(PROFILE_DATA.github[0]?.url || 'https://github.com', "_blank");
              }, 800);
            }}
            title="Exit Workspace"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
