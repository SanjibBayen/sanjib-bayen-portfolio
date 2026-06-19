/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 * Copyright 2026 Sanjib Bayen
 */

export interface VFSNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  language?: string;
  content?: string;
  children?: VFSNode[];
}

export type ActivityView = 'explorer' | 'search' | 'git' | 'debug' | 'extensions' | 'cmd';

export interface ExtensionItem {
  id: string;
  name: string;
  desc: string;
  author: string;
  version: string;
  rating: string;
  downloads: string;
  isInstalled: boolean;
  active: boolean;
  category: 'Linter' | 'Developer' | 'AI' | 'IoT' | 'Theme';
  icon: string;
}

export interface Tab {
  name: string;
  path: string;
  language: string;
  content: string;
}

export interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system' | 'link';
  projectId?: number;
}

export interface VSCodeTheme {
  id: string;
  name: string;
  background: string;       // #1e1e1e
  sidebarBg: string;        // #252526
  activityBg: string;       // #1e1e1e / #333
  statusBarBg: string;      // #007acc
  statusBarFg: string;      // #ffffff
  textColor: string;        // #cccccc
  activeTabBg: string;      // #1e1e1e
  inactiveTabBg: string;    // #2d2d2d
  editorBg: string;         // #1e1e1e
  panelBg: string;          // #1e1e1e
  activeBorder: string;     // #007acc / #00a2ed
}

export const THEMES: VSCodeTheme[] = [
  {
    id: "dark-default",
    name: "Dark+ (Default)",
    background: "#1e1e1e",
    sidebarBg: "#252526",
    activityBg: "#333333",
    statusBarBg: "#007acc",
    statusBarFg: "#ffffff",
    textColor: "#d4d4d4",
    activeTabBg: "#1e1e1e",
    inactiveTabBg: "#2d2d2d",
    editorBg: "#1e1e1e",
    panelBg: "#1e1e1e",
    activeBorder: "#007acc"
  },
  {
    id: "dracula",
    name: "Dracula",
    background: "#282a36",
    sidebarBg: "#21222c",
    activityBg: "#191a21",
    statusBarBg: "#bd93f9",
    statusBarFg: "#282a36",
    textColor: "#f8f8f2",
    activeTabBg: "#282a36",
    inactiveTabBg: "#1e1f29",
    editorBg: "#282a36",
    panelBg: "#21222c",
    activeBorder: "#ff79c6"
  },
  {
    id: "one-dark",
    name: "One Dark Pro",
    background: "#282c34",
    sidebarBg: "#21252b",
    activityBg: "#1e2227",
    statusBarBg: "#4b5263",
    statusBarFg: "#abb2bf",
    textColor: "#abb2bf",
    activeTabBg: "#282c34",
    inactiveTabBg: "#21252b",
    editorBg: "#282c34",
    panelBg: "#21252b",
    activeBorder: "#61afef"
  },
  {
    id: "monokai",
    name: "Monokai Retro",
    background: "#272822",
    sidebarBg: "#1e1f1c",
    activityBg: "#141411",
    statusBarBg: "#a6e22e",
    statusBarFg: "#272822",
    textColor: "#f8f8f2",
    activeTabBg: "#272822",
    inactiveTabBg: "#1e1f1c",
    editorBg: "#272822",
    panelBg: "#1e1f1c",
    activeBorder: "#f92672"
  },
  {
    id: "github-light",
    name: "GitHub Light",
    background: "#ffffff",
    sidebarBg: "#f6f8fa",
    activityBg: "#24292e",
    statusBarBg: "#24292e",
    statusBarFg: "#ffffff",
    textColor: "#24292e",
    activeTabBg: "#ffffff",
    inactiveTabBg: "#f6f8fa",
    editorBg: "#ffffff",
    panelBg: "#f6f8fa",
    activeBorder: "#fd8c73"
  }
];
