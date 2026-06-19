/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React from 'react';

// Inline official-style VS Code Logo Vector Path

import vscodeLogo from './assets/vscode.png';

export const VSCodeLogo = () => (
  <img 
    src={vscodeLogo} 
    alt="VS Code Logo" 
    className="w-4 h-4 mr-1 shrink-0 select-none"
  />
);

// High quality custom SVG icons representing VS Code editor layout controls
export const SidebarToggleIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-3.5 h-3.5 ${active ? 'text-sky-400' : 'text-slate-400/60 group-hover:text-slate-300'}`} viewBox="0 0 16 16" fill="currentColor">
    <path d="M14 2H2c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zM5 13H2V3h3v10zm9 0H6V3h8v10z"/>
  </svg>
);

export const BottomPanelToggleIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-3.5 h-3.5 ${active ? 'text-sky-400' : 'text-slate-400/60 group-hover:text-slate-300'}`} viewBox="0 0 16 16" fill="currentColor">
    <path d="M14 2H2c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zM2 3h12v7H2V3zm0 9h12v1H2v-1z"/>
  </svg>
);

export const SecondarySidebarToggleIcon = ({ active }: { active: boolean }) => (
  <svg className={`w-3.5 h-3.5 ${active ? 'text-sky-400' : 'text-slate-400/60 group-hover:text-slate-300'}`} viewBox="0 0 16 16" fill="currentColor">
    <path d="M14 2H2c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zM11 3h3v10h-3V3zM2 3h8v10H2V3z"/>
  </svg>
);

export const LayoutToggleIcon = () => (
  <svg className="w-3.5 h-3.5 text-slate-400/60 hover:text-slate-300 transition-colors" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2.5 1.5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-11a1 1 0 0 0-1-1h-11zm5 5h6v7h-6v-7zm0-1v-2h6v2h-6zm-1-2v10h-4v-10h4z"/>
  </svg>
);

export const SplitLayoutToggleIcon = () => (
  <svg className="w-3.5 h-3.5 text-slate-400/60 hover:text-slate-300 transition-colors" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 2v12h12V2H2zm1 1h4.5v10H3V3zm10 10H8.5V3H13v10z"/>
  </svg>
);
