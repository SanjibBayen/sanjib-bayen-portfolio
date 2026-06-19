/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React from 'react';
import { VSCodeTheme } from '../../../shared/types';
import StatusLeft from './status/StatusLeft';
import StatusRight from './status/StatusRight';

interface StatusBarProps {
  theme: VSCodeTheme;
  activeLanguage?: string;
  gitCommitted: boolean;
  onRefresh: () => void;
  activeFilePath?: string;
}

export default function StatusBar({
  theme,
  activeLanguage = 'Plain Text',
  gitCommitted,
  onRefresh,
  activeFilePath
}: StatusBarProps) {
  
  return (
    <div
      className="h-7 border-t select-none flex items-center justify-between text-[11px] px-2 font-sans relative z-30 shrink-0"
      id="status-bar-container"
      style={{
        backgroundColor: theme.statusBarBg,
        color: theme.statusBarFg,
        borderTopColor: theme.id === 'dark-default' ? '#1a1a1a' : `${theme.activeBorder}15`
      }}
    >
      {/* Left section: Git icons, compile monitors, Chai metrics */}
      <StatusLeft 
        gitCommitted={gitCommitted}
        onRefresh={onRefresh}
      />

      {/* Middle breadcrumbs: absolute target files location indicator */}
      <div className="hidden sm:block truncate opacity-70 text-[10.5px] font-mono select-none pointer-events-none">
        {activeFilePath ? `./src/${activeFilePath}` : 'Sanjib-Bayen Workspace Ready'}
      </div>

      {/* Right section: position metrics, formats, social mail triggers */}
      <StatusRight
        activeLanguage={activeLanguage}
      />
    </div>
  );
}
