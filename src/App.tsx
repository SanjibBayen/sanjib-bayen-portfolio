/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 * Copyright 2026 Sanjib Bayen
 */

import React, { useEffect } from 'react';
import { usePortfolio } from './shared/hooks/usePortfolio';
import { THEMES, VSCodeTheme, ActivityView, Tab, ExtensionItem, TerminalLine } from './shared/types';
import { VFS_DATA, VFSNode } from './shared/data/portfolioData';
import { PROFILE_DATA } from './features/about';
import TitleBar from './features/workspace/components/TitleBar';
import ActivityBar from './features/workspace/components/ActivityBar';
import SidebarPanel from './features/workspace/components/SidebarPanel';
import EditorPanel from './components/EditorPanel';
import TerminalPanel from './features/workspace/components/TerminalPanel';
import StatusBar from './features/workspace/components/StatusBar';
import ToastContainer from './shared/components/ToastContainer';
import SanjibHumanRepoDashboard from './components/editor/viewers/SanjibHumanRepoDashboard';
import CmdSandboxDashboard from './components/editor/viewers/CmdSandboxDashboard';
import MobileGate from './features/security/components/MobileGate';
import SecurityGate from './features/security/components/SecurityGate';
import { toast } from './shared/utils/toast';
import { generateCVContent } from './shared/utils/cv';
import extensionsData from './data/extensions.json';
import { 
  Sliders, 
  Volume2, 
  VolumeX, 
  Tv, 
  Coffee, 
  Download, 
  Check, 
  RefreshCw, 
  Sparkles,
  Zap,
  CheckCircle2,
  Lock,
  Moon,
  Sun,
  Code,
  Layout,
  FileText
} from 'lucide-react';

//  image url
const AVATAR_URL = "/sanjib.jpg";

export default function App() {
  const {
    activeThemeId,
    setActiveThemeId,
    theme,
    activeView,
    setActiveView,
    isSidebarOpen,
    setIsSidebarOpen,
    showSettings,
    setShowSettings,
    panelHeight,
    setPanelHeight,
    isTerminalOpen,
    setIsTerminalOpen,
    simulateLogsTrigger,
    setSimulateLogsTrigger,
    isSecurityVerified,
    setIsSecurityVerified,
    isOverrideActive,
    setIsOverrideActive,
    soundEffects,
    setSoundEffects,
    wordWrap,
    setWordWrap,
    autosaveEnabled,
    setAutosaveEnabled,
    sidebarPosition,
    setSidebarPosition,
    openTabs,
    activeTabPath,
    extensions,
    handleExtensionAction,
    terminalHistory,
    setTerminalHistory,
    currentPath,
    setCurrentPath,
    commandQueue,
    setCommandQueue,
    queuePointer,
    setQueuePointer,
    gitCommitted,
    setGitCommitted,
    crtEnabled,
    setCrtEnabled,
    handleOpenFile,
    handleCloseTab,
    handleSelectTab,
    handleTriggerTerminalSimulate,
    handleRefreshWorkspace,
    isMobileOrTablet,
    activeLanguage,
    handleActivityViewChange
  } = usePortfolio();

  // Web Audio dynamic retro signal synthesizer is fully muted and disabled
  const playSound = (type: 'click' | 'success' | 'warn' | 'settings') => {
    // Completely removed and muted per user instruction
  };

  const handleSimulateRun = (configName: string) => {
    handleTriggerTerminalSimulate(`.\\execute_simulation.ps1 --config "${configName}"`);
  };

  const isCrtActive = crtEnabled;

  if (isMobileOrTablet && !isOverrideActive) {
    return <MobileGate onOverride={() => setIsOverrideActive(true)} />;
  }

  if (!isSecurityVerified) {
    return (
      <SecurityGate 
        onVerify={() => {
          try {
            sessionStorage.setItem('cf_verified', 'true');
          } catch (e) {}
          setIsSecurityVerified(true);
        }} 
      />
    );
  }

  return (
    <div
      className={`w-screen h-screen overflow-hidden flex flex-col font-sans transition-colors duration-500 relative ${isCrtActive ? 'crt-screen border-2 border-emerald-500/20 shadow-inner' : ''}`}
      style={{
        backgroundColor: theme.background,
        color: theme.textColor
      }}
    >
      {isCrtActive && (
        <>
          <style>{`
            @keyframes crt-scanline {
              0% { transform: translateY(-100%); }
              100% { transform: translateY(100%); }
            }
            @keyframes crt-flicker {
              0% { opacity: 0.96; }
              50% { opacity: 1.0; }
              100% { opacity: 0.97; }
            }
            .crt-screen::before {
              content: " ";
              display: block;
              position: absolute;
              top: 0; left: 0; bottom: 0; right: 0;
              background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%), linear-gradient(90deg, rgba(34, 197, 94, 0.04), rgba(0, 255, 0, 0.01), rgba(34, 197, 94, 0.03));
              z-index: 9999;
              background-size: 100% 3px, 5px 100%;
              pointer-events: none;
            }
            .crt-screen::after {
              content: " ";
              display: block;
              position: absolute;
              top: 0; left: 0; bottom: 0; right: 0;
              background: rgba(18, 16, 16, 0.06);
              pointer-events: none;
              z-index: 9999;
              animation: crt-flicker 0.15s infinite;
            }
            .crt-scanline-el {
              position: absolute;
              top: 0; left: 0; width: 100%; height: 100%;
              background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(16, 185, 129, 0.05) 51%, rgba(16, 185, 129, 0.02));
              background-size: 100% 500px;
              z-index: 10000;
              pointer-events: none;
              animation: crt-scanline 6s linear infinite;
            }
          `}</style>
          <div className="crt-scanline-el" />
        </>
      )}
      {/* 1. Windows Header Titlebar */}
      <TitleBar
        theme={theme}
        activeFileName={openTabs.find(t => t.path === activeTabPath)?.name || ''}
        onRefresh={handleRefreshWorkspace}
        onThemeSelect={setActiveThemeId}
        allThemes={THEMES}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isTerminalOpen={isTerminalOpen}
        setIsTerminalOpen={setIsTerminalOpen}
      />

      {/* 2. Primary split: Activity Bar + Sidebar + Main Workspace */}
      <div className={`flex-1 flex w-full overflow-hidden relative ${sidebarPosition === 'right' ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Left Side: Activity Bar */}
        <ActivityBar
          activeView={activeView}
          onViewChange={handleActivityViewChange}
          theme={theme}
          avatarUrl={AVATAR_URL}
          showSettings={showSettings}
          setShowSettings={setShowSettings}
        />

        {/* Dynamic Side Navigation Panel */}
        {isSidebarOpen && activeView !== 'cmd' && (
          <SidebarPanel
            activeView={activeView}
            theme={theme}
            openFile={handleOpenFile}
            activeFilePath={activeTabPath}
            avatarUrl={AVATAR_URL}
            onSimulateRun={handleSimulateRun}
            gitCommitted={gitCommitted}
            setGitCommitted={setGitCommitted}
            extensions={extensions}
            onExtensionAction={handleExtensionAction}
            onViewChange={handleActivityViewChange}
          />
        )}

        {/* Right Area: Workspace Editor & Terminal Panel Stack */}
        <div className="flex-1 h-full flex flex-col min-h-0 overflow-auto relative">
          
          {/* Top: Tabs & Interactive Editor Screen */}
          <div className="flex-1 min-h-0 overflow-auto flex flex-col relative">
            {showSettings ? (
              /* Settings tab override display */
              <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-[#161617] border-b border-neutral-800 text-left font-sans select-none flex flex-col max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                      <Sliders className="w-5 h-5 text-sky-400" />
                      System Settings
                    </h2>
                    <p className="text-neutral-400 text-xs">Customize your workspace environment parameters dynamically.</p>
                  </div>
                  <div className="text-[10px] font-mono text-[#4ec9b0] bg-[#4ec9b0]/10 px-2 py-1 rounded">
                    SanjibOS v1.2.0
                  </div>
                </div>
                
                <hr className="border-neutral-800" />
                
                {/* 1. DOWNLOAD CV FEATURE - PROMINENT CARD */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-sky-950/40 via-neutral-900 to-indigo-950/20 border border-sky-900/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      <Download className="w-4 h-4 text-sky-400" />
                      Download Sanjib's CV / Resume
                    </h3>
                    <p className="text-xs text-neutral-400 leading-normal max-w-sm">
                      Get a compiled ASCII/Markdown technical resume file containing Sanjib's active projects, credentials, and published research.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      const cvContent = generateCVContent(PROFILE_DATA);
                      const legacyIgnored = `======================================================================
                     SANJIB BAYEN - SOFTWARE CV & RESUME
======================================================================
Email: sanjibayen04@gmail.com
Phone: +91 7477743793
Location: West Bengal, India
GitHub: https://github.com/SanjibBayen

----------------------------------------------------------------------
PROFESSIONAL SUMMARY
----------------------------------------------------------------------
AI/ML Engineer and Full-Stack Developer with hands-on expertise in 
building production-ready intelligent systems. Specializes in explainable 
clinical neural models, space-tech hazard controllers, and high-performance 
full-stack services.

----------------------------------------------------------------------
CORE SPECIALIZATIONS & FOCUS VECTORS
----------------------------------------------------------------------
• Artificial Intelligence & Deep Learning
• Computer Vision & FMCW DSP gesture classifier
• Health-tech Diagnostics (Grad-CAM neural explainability)
• Space-Tech autonomous path tracking and hazard sensors
• Modular Full-Stack architectures & high-performance APIs

----------------------------------------------------------------------
ACADEMICS & EDUCATION
----------------------------------------------------------------------
• Brainware University, Barasat (B.Tech CSE - 2023 to 2027)
• Keshabpur Jalpai G.J.M. Vidyapith (Higher Secondary Class 12)

----------------------------------------------------------------------
PROFESSIONAL EXPERIENCE
----------------------------------------------------------------------
Head of Engineering @ Creatiq Media (Jul - Dec 2025)
  - Led a 20+ member cross-functional team overseeing web systems, 
    AI products, and standard startup engineering architectures.
  - Guided Next.js, React, and Firebase deployments with rigorous 
    code reviews and robust standard guidelines.

----------------------------------------------------------------------
ACADEMIC RE-SEARCH PAPERS PUBLISHED
----------------------------------------------------------------------
• Cardiovascular Stroke & Multi-disease Prediction using Ensemble 
  Learning Frameworks (IJMTES, Vol 12)
• Dental Radiography Anomaly Risk Classifications with Grad-CAM overlays

----------------------------------------------------------------------
TECHNICAL HARDWARE & SOFTWARE STACK
----------------------------------------------------------------------
• Languages:       TypeScript, Python, C++, Java, Rust, SQL, Bash
• Frameworks:      React 18, Next.js, TailWind CSS, PyTorch, Fast.ai
• Developer Tools: Git, VSCode, Docker, Linux, LoRa/IoT mesh networks
• Databases:       PostgreSQL, MariaDB, Firebase, SQLite

======================================================================
Generated online via Sanjib Bayen Interactive Portfolio. 
Feel free to contact at ${PROFILE_DATA.email} to collaborate!
======================================================================`;

                      const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = 'Sanjib_Bayen_CV.txt';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                      
                      playSound('success');
                      toast.success("Downloaded CV matching local variables!");
                    }}
                    className="w-full sm:w-auto px-4 py-2 font-semibold text-xs text-white rounded bg-sky-600 hover:bg-sky-500 hover:scale-102 flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 border border-sky-400/25"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download CV (.txt)
                  </button>
                </div>

                <hr className="border-neutral-800" />

                {/* 2. PREMIUM THEME SWITCHER GRID */}
                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1">
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    Color Theme Selector
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {THEMES.map((themeOption) => {
                      const isSelected = activeThemeId === themeOption.id;
                      return (
                        <button
                          key={themeOption.id}
                          onClick={() => {
                            setActiveThemeId(themeOption.id);
                            playSound('settings');
                            toast.success(`Theme switched to: ${themeOption.name}`);
                          }}
                          className={`p-3.5 text-left rounded-lg border text-xs flex flex-col justify-between h-20 transition group select-none cursor-pointer ${
                            isSelected 
                              ? 'border-sky-500 bg-sky-500/5' 
                              : 'border-neutral-800/80 bg-neutral-900/60 hover:border-neutral-700 hover:bg-neutral-850'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-bold text-slate-200 group-hover:text-white transition truncate max-w-[85px]">
                              {themeOption.name}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-sky-400 shrink-0" />}
                          </div>
                          
                          {/* Color Circles Row previewing actual theme values */}
                          <div className="flex items-center gap-1 mt-2">
                            <span className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: themeOption.background }} title="Background" />
                            <span className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: themeOption.sidebarBg }} title="Sidebar" />
                            <span className="w-3 h-3 rounded-full border border-white/10" style={{ backgroundColor: themeOption.activeBorder }} title="Accent" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <hr className="border-neutral-800" />

                {/* 3. FUNCTIONING SETTINGS TOGGLES */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#4ec9b0]" />
                    Editor & Workspace Configuration
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Audio Sound Indicators */}
                    <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-850 flex items-center justify-between gap-2.5 text-left">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-200 text-xs font-bold">
                          {soundEffects ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-neutral-500" />}
                          <span>Audio Feedbacks</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 max-w-[190px]">Synthesizes subtle system ticks during tab navigation and selections.</p>
                      </div>
                      <button
                        onClick={() => {
                          setSoundEffects(!soundEffects);
                          const nextState = !soundEffects;
                          toast.success(nextState ? "Sound enabled (fully muted by system)" : "Sound muted");
                        }}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${soundEffects ? 'bg-emerald-600' : 'bg-neutral-800'}`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${soundEffects ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Editor Word-Wrap */}
                    <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-850 flex items-center justify-between gap-2.5 text-left">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-200 text-xs font-bold">
                          <FileText className="w-3.5 h-3.5 text-sky-400" />
                          <span>Editor: Word Wrap</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 max-w-[190px]">Wraps long code strings dynamically to fit within file tabs.</p>
                      </div>
                      <button
                        onClick={() => {
                          setWordWrap(!wordWrap);
                          playSound('click');
                          toast.success(!wordWrap ? "Word Wrap enabled" : "Word Wrap disabled");
                        }}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${wordWrap ? 'bg-sky-600' : 'bg-neutral-800'}`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${wordWrap ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* VFS Autosaving */}
                    <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-850 flex items-center justify-between gap-2.5 text-left">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-200 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#4ec9b0]" />
                          <span>Autosave Buffers</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 max-w-[190px]">Commits any custom local edits back to browser index buffers.</p>
                      </div>
                      <button
                        onClick={() => {
                          setAutosaveEnabled(!autosaveEnabled);
                          playSound('click');
                          toast.success(!autosaveEnabled ? "Autosave enabled" : "Autosave disabled");
                        }}
                        className={`w-10 h-5.5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${autosaveEnabled ? 'bg-emerald-600' : 'bg-neutral-800'}`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${autosaveEnabled ? 'translate-x-4.5' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Sidebar positional choices */}
                    <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-850 flex flex-col justify-between gap-2 text-left">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-1.5 text-slate-200 text-xs font-bold">
                          <Layout className="w-3.5 h-3.5 text-orange-400" />
                          <span>Sidebar Placement</span>
                        </div>
                        <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-neutral-850 text-neutral-400 font-mono uppercase select-none">
                          {sidebarPosition}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        {(['left', 'right'] as const).map((pos) => {
                          const isActive = sidebarPosition === pos;
                          return (
                            <button
                              key={pos}
                              onClick={() => {
                                setSidebarPosition(pos);
                                playSound('click');
                                toast.success(`Sidebar aligned to the ${pos}`);
                              }}
                              className={`py-1 text-[10.5px] font-mono rounded border transition cursor-pointer capitalize ${
                                isActive 
                                  ? 'border-orange-500/60 bg-orange-500/10 text-orange-400' 
                                  : 'border-neutral-800 bg-neutral-950/40 text-neutral-450 hover:border-neutral-700 hover:text-slate-200'
                              }`}
                            >
                              {pos} Side
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="border-neutral-800" />

                {/* 4. RESET DIAGNOSTICS CONTROL */}
                <div className="flex flex-col space-y-1.5 pt-1.5 text-left">
                  <label className="text-xs font-bold text-neutral-300">File Cache Diagnostics</label>
                  <p className="text-[11px] text-neutral-500 max-w-md leading-relaxed">Wipes local session storage cache and restores virtual workspace files to standard values.</p>
                  <button
                    onClick={() => {
                      handleRefreshWorkspace();
                      playSound('success');
                      toast.success("All workspace caches successfully clean!");
                    }}
                    className="w-56 py-1.5 px-3 rounded text-xs bg-neutral-800 hover:bg-neutral-700 font-medium text-slate-200 border border-neutral-700 transition cursor-pointer flex items-center justify-center gap-1.5 self-start"
                  >
                    <RefreshCw className="w-3 h-3 text-sky-400 shrink-0" />
                    Reset Virtual Workspace
                  </button>
                </div>
              </div>
            ) : activeView === 'git' ? (
              /* Dedicated Source Control Layout Dashboard */
              <SanjibHumanRepoDashboard openFile={handleOpenFile} />
            ) : activeView === 'cmd' ? (
              /* Dedicated Sandboxed CommandLine Sandbox Dashboard */
              <CmdSandboxDashboard
                theme={theme}
                terminalHistory={terminalHistory}
                setTerminalHistory={setTerminalHistory}
                currentPath={currentPath}
                setCurrentPath={setCurrentPath}
                commandQueue={commandQueue}
                setCommandQueue={setCommandQueue}
                queuePointer={queuePointer}
                setQueuePointer={setQueuePointer}
                onThemeSelect={setActiveThemeId}
                openFile={handleOpenFile}
              />
            ) : (
              /* Standard opened files panel */
              <EditorPanel
                theme={theme}
                openTabs={openTabs}
                activeTabPath={activeTabPath}
                onSelectTab={handleSelectTab}
                onCloseTab={handleCloseTab}
                triggerTerminalSimulate={handleTriggerTerminalSimulate}
                openFile={handleOpenFile}
                extensions={extensions}
                wordWrap={wordWrap}
              />
            )}
          </div>

          {/* Bottom Area: Terminal splits panel */}
          {isTerminalOpen && (
            <TerminalPanel
              theme={theme}
              onThemeSelect={setActiveThemeId}
              openFile={handleOpenFile}
              panelHeight={panelHeight}
              setPanelHeight={setPanelHeight}
              simulateLogsTrigger={simulateLogsTrigger}
              setSimulateLogsTrigger={setSimulateLogsTrigger}
              onClose={() => setIsTerminalOpen(false)}
              extensions={extensions}
              terminalHistory={terminalHistory}
              setTerminalHistory={setTerminalHistory}
              currentPath={currentPath}
              setCurrentPath={setCurrentPath}
              commandQueue={commandQueue}
              setCommandQueue={setCommandQueue}
              queuePointer={queuePointer}
              setQueuePointer={setQueuePointer}
            />
          )}

        </div>
      </div>

      {/* 3. Base Tray Status Bar */}
      <StatusBar
        theme={theme}
        activeLanguage={activeLanguage}
        gitCommitted={gitCommitted}
        onRefresh={handleRefreshWorkspace}
        activeFilePath={activeTabPath}
      />
      
      {/* 4. Global Toast Notifications Overlay */}
      <ToastContainer theme={theme} />
    </div>
  );
}
