/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React from 'react';
import { Settings } from 'lucide-react';
import { ActivityView, VSCodeTheme, ExtensionItem } from '../../../shared/types';

// Modular Sidebar views
import FileExplorerView from './sidebar/FileExplorerView';
import SearchView from './sidebar/SearchView';
import GitView from './sidebar/GitView';
import DebugView from './sidebar/DebugView';
import ExtensionsView from './sidebar/ExtensionsView';
import { toast } from '../../../shared/utils/toast';

interface SidebarPanelProps {
  activeView: ActivityView;
  theme: VSCodeTheme;
  openFile: (path: string) => void;
  activeFilePath?: string;
  avatarUrl: string;
  onSimulateRun: (configName: string) => void;
  gitCommitted: boolean;
  setGitCommitted: (com: boolean) => void;
  extensions: ExtensionItem[];
  onExtensionAction: (id: string, action: 'install' | 'uninstall' | 'toggleActive') => void;
  onViewChange?: (view: ActivityView) => void;
}

export default function SidebarPanel({
  activeView,
  theme,
  openFile,
  activeFilePath,
  avatarUrl,
  onSimulateRun,
  gitCommitted,
  setGitCommitted,
  extensions,
  onExtensionAction,
  onViewChange
}: SidebarPanelProps) {
  
  return (
    <div
      className="w-60 h-full border-r flex flex-col select-none relative z-10 font-sans shrink-0"
      id="sidebar-container"
      style={{
        backgroundColor: theme.id === 'dark-default' ? '#252526' : theme.sidebarBg,
        borderColor: theme.id === 'dark-default' ? '#1a1a1a' : `${theme.activeBorder}20`,
        color: theme.id === 'dark-default' ? '#cccccc' : theme.textColor
      }}
    >
      {/* Dynamic Pane Header */}
      <div className="p-3 border-b border-neutral-800 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider select-none shrink-0" id="sidebar-header">
        <span>
          {activeView === 'explorer' && 'Explorer: SANJIB-BAYEN'}
          {activeView === 'search' && 'Search Grid VFS'}
          {activeView === 'git' && 'Source Control (Git)'}
          {activeView === 'debug' && 'Run and Debug Config'}
          {activeView === 'extensions' && 'Extension Marketplace'}
        </span>
        <button 
          className="opacity-40 hover:opacity-100 transition cursor-pointer bg-transparent border-0 text-inherit p-0"
          onClick={() => toast.info("Sidebar panels are fully operational. Toggle views using the leftmost Activity Bar.")}
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Pane Content Container */}
      <div className="flex-1 flex flex-col min-h-0 relative select-none" id="sidebar-content">
        {activeView === 'explorer' && (
          <FileExplorerView
            theme={theme}
            openFile={openFile}
            activeFilePath={activeFilePath}
            avatarUrl={avatarUrl}
            gitCommitted={gitCommitted}
          />
        )}

        {activeView === 'search' && (
          <SearchView openFile={openFile} />
        )}

        {activeView === 'git' && (
          <GitView 
            gitCommitted={gitCommitted}
            setGitCommitted={setGitCommitted}
            openFile={openFile}
          />
        )}

        {activeView === 'debug' && (
          <DebugView onSimulateRun={onSimulateRun} />
        )}

        {activeView === 'extensions' && (
          <ExtensionsView
            openFile={openFile}
          />
        )}
      </div>
    </div>
  );
}
