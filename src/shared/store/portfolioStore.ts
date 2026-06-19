/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * Portfolio Workspace Zustand Central Store
 */

import { create } from 'zustand';
import { VSCodeTheme, THEMES, ActivityView, Tab, ExtensionItem, TerminalLine } from '@/types';
import { VFS_DATA, VFSNode } from '@/shared/data/portfolioData';

interface PortfolioState {
  // Theme Configuration
  activeThemeId: string;
  theme: VSCodeTheme;
  setActiveThemeId: (id: string) => void;

  // Sidebar Panel Configuration
  activeView: ActivityView;
  setActiveView: (view: ActivityView) => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;

  // Settings Configuration Overlay
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;

  // Bottom Resizable Panel and Logs Config
  panelHeight: number;
  setPanelHeight: (height: number) => void;
  isTerminalOpen: boolean;
  setIsTerminalOpen: (open: boolean) => void;
  simulateLogsTrigger: string;
  setSimulateLogsTrigger: (trigger: string) => void;

  // Security Gate and Mobile Check overrides
  isSecurityVerified: boolean;
  setIsSecurityVerified: (verified: boolean) => void;
  isOverrideActive: boolean;
  setIsOverrideActive: (active: boolean) => void;

  // Workspace Settings Custom toggles
  soundEffects: boolean;
  setSoundEffects: (enabled: boolean) => void;
  wordWrap: boolean;
  setWordWrap: (enabled: boolean) => void;
  autosaveEnabled: boolean;
  setAutosaveEnabled: (enabled: boolean) => void;
  sidebarPosition: 'left' | 'right';
  setSidebarPosition: (pos: 'left' | 'right') => void;

  // Virtual File System & Open Workspace tabs
  openTabs: Tab[];
  setOpenTabs: (tabs: Tab[]) => void;
  activeTabPath: string | undefined;
  setActiveTabPath: (path: string | undefined) => void;

  // Extensions Marketplace State
  extensions: ExtensionItem[];
  setExtensions: (extensions: ExtensionItem[]) => void;
  handleExtensionAction: (id: string, action: 'install' | 'uninstall' | 'toggleActive') => void;

  // Sandboxed Console Command state
  terminalHistory: TerminalLine[];
  setTerminalHistory: (history: TerminalLine[] | ((prev: TerminalLine[]) => TerminalLine[])) => void;
  currentPath: string[];
  setCurrentPath: (path: string[] | ((prev: string[]) => string[])) => void;
  commandQueue: string[];
  setCommandQueue: (queue: string[]) => void;
  queuePointer: number;
  setQueuePointer: (pointer: number) => void;

  // State flags
  gitCommitted: boolean;
  setGitCommitted: (committed: boolean) => void;
  crtEnabled: boolean;
  setCrtEnabled: (enabled: boolean) => void;

  // Action Helpers
  findVFSFile: (filePath: string) => VFSNode | null;
  handleOpenFile: (path: string) => void;
  handleCloseTab: (path: string) => void;
  handleSelectTab: (path: string) => void;
  handleTriggerTerminalSimulate: (commandMsg: string) => void;
  handleRefreshWorkspace: () => void;
}

const getSavedTerminalHeight = (): number => {
  try {
    const saved = localStorage.getItem('terminalHeight');
    return saved ? parseInt(saved, 10) : 160;
  } catch {
    return 160;
  }
};

const getSavedTerminalOpenState = (): boolean => {
  try {
    const saved = localStorage.getItem('isTerminalOpen');
    return saved ? saved === 'true' : false; // Default to collapsed
  } catch {
    return false;
  }
};

const getSavedSecurityVerified = (): boolean => {
  try {
    return sessionStorage.getItem('cf_verified') === 'true';
  } catch {
    return false;
  }
};

const initialExtensions: ExtensionItem[] = [
  {
    id: "lunar-intelligence",
    name: "Lunar Intelligence",
    desc: "Lunar Terrain Analyzer: Chandrayaan image analysis, crater hazard avoidance, and autonomous path tracking for space rovers.",
    author: "Sanjib Bayen",
    version: "v1.0.0",
    rating: "5.0",
    downloads: "42,891",
    isInstalled: false,
    active: false,
    category: "AI",
    icon: "Sparkles"
  },
  {
    id: "healthcare-ai",
    name: "Healthcare AI",
    desc: "Healthcare Prediction Engine: Automated multi-modal disease risk assessment, dental radiography Grad-CAM overlays, and anonymization.",
    author: "Sanjib Bayen",
    version: "v2.1.0",
    rating: "5.0",
    downloads: "18,410",
    isInstalled: false,
    active: false,
    category: "AI",
    icon: "Activity"
  },
  {
    id: "rescue-drone",
    name: "Rescue Drone",
    desc: "Embedded Systems Toolkit: Self-healing ad-hoc drone swarm P2P LoRa mesh network for missing coordinate emergency tracking.",
    author: "Sanjib Bayen",
    version: "v1.4.5",
    rating: "5.0",
    downloads: "12,192",
    isInstalled: false,
    active: false,
    category: "IoT",
    icon: "Cpu"
  },
  {
    id: "radar-system",
    name: "Radar System",
    desc: "FMCW Gesture Classifier: On-chip STM32 ARM Cortex discrete wave processing and short-range motion dimming sweeps.",
    author: "Sanjib Bayen",
    version: "v1.0.8",
    rating: "5.0",
    downloads: "8,940",
    isInstalled: false,
    active: false,
    category: "IoT",
    icon: "Workflow"
  },
  {
    id: "chess-platform",
    name: "Chess Platform",
    desc: "Grandmaster Wasm Engine: Responsive bitboard moves computation, real-time Socket.io matchmaking lobbies, and D3 review graphs.",
    author: "Sanjib Bayen",
    version: "v3.0.1",
    rating: "5.0",
    downloads: "64,250",
    isInstalled: false,
    active: false,
    category: "Developer",
    icon: "Code2"
  },
  {
    id: "ai-research-toolkit",
    name: "AI Research Toolkit",
    desc: "Physics-aware ML systems: Explainable clinical neural models (Grad-CAM, LRP), neuro-symbolic compiles, and safety control loops.",
    author: "Sanjib Bayen",
    version: "v1.2.0",
    rating: "5.0",
    downloads: "24,510",
    isInstalled: false,
    active: false,
    category: "AI",
    icon: "Monitor"
  }
];

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  // Theme Configuration
  activeThemeId: 'dark-default',
  theme: THEMES[0],
  setActiveThemeId: (id) => {
    const selectedTheme = THEMES.find(t => t.id === id) || THEMES[0];
    set({ activeThemeId: id, theme: selectedTheme });
  },

  // Sidebar Panel Configuration
  activeView: 'explorer',
  setActiveView: (view) => set({ activeView: view }),
  isSidebarOpen: true,
  setIsSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // Settings Configuration Overlay
  showSettings: false,
  setShowSettings: (show) => set({ showSettings: show }),

  // Bottom Resizable Panel and Logs Config
  panelHeight: getSavedTerminalHeight(),
  setPanelHeight: (height) => {
    try {
      localStorage.setItem('terminalHeight', height.toString());
    } catch (err) {
      console.warn("Storage unreachable:", err);
    }
    set({ panelHeight: height });
  },
  isTerminalOpen: getSavedTerminalOpenState(),
  setIsTerminalOpen: (open) => {
    try {
      localStorage.setItem('isTerminalOpen', open.toString());
    } catch (err) {
      console.warn("Storage unreachable:", err);
    }
    set({ isTerminalOpen: open });
  },
  simulateLogsTrigger: '',
  setSimulateLogsTrigger: (trigger) => set({ simulateLogsTrigger: trigger }),

  // Security Gate and Mobile Check overrides
  isSecurityVerified: getSavedSecurityVerified(),
  setIsSecurityVerified: (verified) => {
    try {
      sessionStorage.setItem('cf_verified', verified.toString());
    } catch (err) {
      console.warn("Storage unreachable:", err);
    }
    set({ isSecurityVerified: verified });
  },
  isOverrideActive: false,
  setIsOverrideActive: (active) => set({ isOverrideActive: active }),

  // Workspace Settings Custom toggles
  soundEffects: true,
  setSoundEffects: (enabled) => set({ soundEffects: enabled }),
  wordWrap: false,
  setWordWrap: (enabled) => set({ wordWrap: enabled }),
  autosaveEnabled: true,
  setAutosaveEnabled: (enabled) => set({ autosaveEnabled: enabled }),
  sidebarPosition: 'left',
  setSidebarPosition: (pos) => set({ sidebarPosition: pos }),

  // Virtual File System & Open Workspace tabs
  openTabs: [],
  setOpenTabs: (tabs) => set({ openTabs: tabs }),
  activeTabPath: undefined,
  setActiveTabPath: (path) => set({ activeTabPath: path }),

  // Extensions Marketplace State
  extensions: initialExtensions,
  setExtensions: (extensions) => set({ extensions }),
  handleExtensionAction: (id, action) => {
    set((state) => ({
      extensions: state.extensions.map(ext => {
        if (ext.id === id) {
          if (action === 'install') {
            return { ...ext, isInstalled: true, active: true };
          } else if (action === 'uninstall') {
            return { ...ext, isInstalled: false, active: false };
          } else if (action === 'toggleActive') {
            return { ...ext, active: !ext.active };
          }
        }
        return ext;
      })
    }));
  },

  // Sandboxed Console Command state
  terminalHistory: [
    { text: 'Sanjib OS v4.1.0 (Windows PowerShell Core Sandbox Edition)', type: 'system' },
    { text: `Copyright (c) ${new Date().getFullYear()} Sanjib Bayen. All professional rights reserved.`, type: 'system' },
    { text: '', type: 'output' },
    { text: 'Type "help" to list comprehensive interactive commands!', type: 'success' },
    { text: '', type: 'output' },
  ],
  setTerminalHistory: (update) => {
    if (typeof update === 'function') {
      set((state) => ({ terminalHistory: update(state.terminalHistory) }));
    } else {
      set({ terminalHistory: update });
    }
  },
  currentPath: [],
  setCurrentPath: (update) => {
    if (typeof update === 'function') {
      set((state) => ({ currentPath: update(state.currentPath) }));
    } else {
      set({ currentPath: update });
    }
  },
  commandQueue: [],
  setCommandQueue: (queue) => set({ commandQueue: queue }),
  queuePointer: -1,
  setQueuePointer: (pointer) => set({ queuePointer: pointer }),

  // State flags
  gitCommitted: false,
  setGitCommitted: (committed) => set({ gitCommitted: committed }),
  crtEnabled: false,
  setCrtEnabled: (enabled) => set({ crtEnabled: enabled }),

  // Action Helpers
  findVFSFile: (filePath: string) => {
    let result: VFSNode | null = null;
    
    const traverse = (nodes: VFSNode[]) => {
      for (const node of nodes) {
        if (node.path === filePath) {
          result = node;
          break;
        }
        if (node.children) {
          traverse(node.children);
        }
      }
    };

    traverse(VFS_DATA);
    return result;
  },

  handleOpenFile: (path: string) => {
    const state = get();
    // If setting is open, close it
    set({ showSettings: false });

    // Handle special repository path display
    if (path === 'repository/sanjib-human') {
      set({ isSidebarOpen: true, activeView: 'git' });
      return;
    }

    // Auto switch back to explorer view
    set({ activeView: 'explorer' });

    const isAlreadyOpen = state.openTabs.some(t => t.path === path);
    if (!isAlreadyOpen) {
      if (path.startsWith('extension/')) {
        const extId = path.split('/')[1];
        const ext = state.extensions.find(e => e.id === extId);
        if (ext) {
          const newTab: Tab = {
            name: `Extension: ${ext.name}`,
            path: path,
            language: "extension-details",
            content: JSON.stringify(ext)
          };
          set({ openTabs: [...state.openTabs, newTab] });
        }
      } else {
        let fileNode = state.findVFSFile(path);

        // Dynamic fallback mapping for humorous source control files
        if (!fileNode) {
          const HUMOROUS_FILES: Record<string, { name: string; language: string; content: string }> = {
            'brain/neuron-state': {
              name: 'brain-neuron-map.json',
              language: 'json',
              content: JSON.stringify({
                system: "Sanjib Bayen Neural Core v23.4",
                status: "Operational (Caffeine optimized)",
                active_hemispheres: {
                  left: "Mathematical & Structural Optimization Core",
                  right: "Space-aware FMCW Radar & FPV Trajectory Sandbox"
                },
                subsystems: {
                  chess_minimax_evaluator: {
                    staged_depth: 14,
                    efficiency: "99.9%"
                  },
                  startup_generator: {
                    ideas_per_three_minutes: "1.2",
                    crashed_ideas_count: 0
                  }
                }
              }, null, 2)
            },
            'brain/dreams-compiler': {
              name: 'overnight-dreams-analyzer.ts',
              language: 'typescript',
              content: `/**\n * @file overnight-dreams-analyzer.ts\n * Subconscious compilation agent. Turns daily dreams and design ideas into high-fidelity code structures.\n */\n\ninterface DreamState {\n  hasCaffeine: boolean;\n  ideasTargeted: string[];\n  resolvedBugs: string[];\n}\n\nexport function compileSleepDreamLoop(): DreamState {\n  return {\n    hasCaffeine: true,\n    ideasTargeted: [\n      "Autonomous Lunar Rover Avoidance",\n      "Decentralized P2P LoRa Rescue Drones",\n      "Interactive D3 Web-GL Portfolio UI"\n    ],\n    resolvedBugs: [\n      "Forgot to sleep",\n      "Unclosed temporal spacetime coordinate loop"\n    ]\n  };\n}`
            },
            'hardware/coffee-adc': {
              name: 'caffeine-level-sensor.py',
              language: 'python',
              content: `# !/usr/bin/env python3\n# Caffeine level ADC sensor polling daemon\nimport time\n\ndef polling_loop():\n    while True:\n        sensor_reading = 82 # read_biological_caffeine_v1()\n        if sensor_reading < 20:\n            print("[CRITICAL] Brew Coffee pulse trigger issued!")\n        time.sleep(120)`
            },
            'hobby/fpv-loop': {
              name: 'bug-watching-drone-videos.yml',
              language: 'yaml',
              content: `hobby: FPV Drone Aerodynamics\nstatus: Deleted (Redirected output telemetry to active tasks)\nlogs:\n  - time: "18:00"\n    message: "Lookup STM32 direct memory registers tutorials"\n  - time: "18:05"\n    message: "Youtube recommendation: High-Speed alpine drone racing"\n  - time: "22:00"\n    message: "Fascinated by aerodynamics and motor timing coefficients"`
            },
            'brain/sleep-profile': {
              name: 'sleep-deprivation-limit.conf',
              language: 'ini',
              content: `[BiologicalProcessingCore]\nTargetSleepDuration = 4h\nCurrentActualSleep = 3.5h\nState = ProneToAnomalousRefactoring\nDoubleEspressoMultiplier = 2.0\nCaffeineLevelSensorStatus = Online`
            },
            'projects/brains-db': {
              name: 'overloaded-startup-ideas.db',
              language: 'sql',
              content: `-- Humorous storage database schema for endless active startup designs\nCREATE TABLE startup_ideas (\n  id INTEGER PRIMARY KEY,\n  time_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  concept TEXT NOT NULL,\n  architectural_complexity TEXT,\n  database_system TEXT DEFAULT "Cloud Spanner"\n);\n\nINSERT INTO startup_ideas (concept, architectural_complexity) VALUES\n('AI Dental Radiograph Grad-CAM Diagnostician', 'High - Convolutional Classifier'),\n('P2P Mesh Coord Swarm Drone Pathfinder', 'Legendary - Distributed Ad-hoc Nodes'),\n('Minimax chess wasm evaluator with 120fps canvas', 'Extreme - Wasm Threadpools');`
            }
          };

          if (HUMOROUS_FILES[path]) {
            const mockFile = HUMOROUS_FILES[path];
            fileNode = {
              name: mockFile.name,
              path: path,
              type: 'file',
              language: mockFile.language,
              content: mockFile.content
            };
          }
        }

        if (fileNode && fileNode.type === 'file' && fileNode.content) {
          const newTab: Tab = {
            name: fileNode.name,
            path: fileNode.path,
            language: fileNode.language || 'plaintext',
            content: fileNode.content
          };
          set({ openTabs: [...state.openTabs, newTab] });
        }
      }
    }
    set({ activeTabPath: path });
  },

  handleCloseTab: (path: string) => {
    const state = get();
    const nextTabs = state.openTabs.filter(t => t.path !== path);
    set({ openTabs: nextTabs });

    if (state.activeTabPath === path) {
      if (nextTabs.length > 0) {
        set({ activeTabPath: nextTabs[nextTabs.length - 1].path });
      } else {
        set({ activeTabPath: undefined });
      }
    }
  },

  handleSelectTab: (path: string) => {
    set({ activeTabPath: path, showSettings: false });
  },

  handleTriggerTerminalSimulate: (commandMsg: string) => {
    set({ 
      isTerminalOpen: true, 
      simulateLogsTrigger: `${commandMsg}::${Date.now()}` 
    });
  },

  handleRefreshWorkspace: () => {
    const state = get();
    set({ 
      gitCommitted: false,
      activeView: 'explorer',
      showSettings: false
    });
    
    // Default tabs setup
    const filePaths = [
      'about/README.md',
      'about/profile.yml',
      'projects/portfolio.db',
      'research/research.ipynb',
      'connect/links.yml',
      'achievements/timeline.log',
      'skills/skills.pkt'
    ];

    const initialTabs: Tab[] = [];
    for (const filePath of filePaths) {
      const fileNode = state.findVFSFile(filePath);
      if (fileNode && fileNode.content) {
        initialTabs.push({
          name: fileNode.name,
          path: fileNode.path,
          language: fileNode.language || 'plaintext',
          content: fileNode.content
        });
      }
    }

    set({ 
      openTabs: initialTabs, 
      activeTabPath: 'about/README.md' 
    });
  }
}));
