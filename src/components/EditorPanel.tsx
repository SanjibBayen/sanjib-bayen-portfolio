/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React, { useState, useMemo } from 'react';
import { 
  X, 
  FileText, 
  ChevronRight,
  Terminal,
  Activity
} from 'lucide-react';
import { Tab, VSCodeTheme } from '../shared/types';
import { getFileIcon } from '../features/workspace/components/sidebar/SidebarIcons';

// Modular Subcomponents
import SkillsVisualizer from './editor/viewers/SkillsVisualizer';
import ProjectDbViewer from './editor/viewers/ProjectDbViewer';
import JupyterNotebookViewer from './editor/viewers/JupyterNotebookViewer';
import TimelineLogViewer from './editor/viewers/TimelineLogViewer';
import LinksYamlDashboard from './editor/viewers/LinksYamlDashboard';
import AboutReadmeViewer from './editor/viewers/AboutReadmeViewer';
import AboutProfileYamlViewer from './editor/viewers/AboutProfileYamlViewer';
import ApiPlaygroundDashboard from './editor/viewers/ApiPlaygroundDashboard';
import SanjibHumanRepoDashboard from './editor/viewers/SanjibHumanRepoDashboard';
import ExtensionDetailsViewer from './editor/viewers/ExtensionDetailsViewer';

interface EditorPanelProps {
  theme: VSCodeTheme;
  openTabs: Tab[];
  activeTabPath?: string;
  onSelectTab: (path: string) => void;
  onCloseTab: (path: string) => void;
  triggerTerminalSimulate: (msg: string) => void;
  openFile: (path: string) => void;
  extensions?: any;
  wordWrap?: boolean;
}

export default function EditorPanel({
  theme,
  openTabs,
  activeTabPath,
  onSelectTab,
  onCloseTab,
  triggerTerminalSimulate,
  openFile,
  extensions,
  wordWrap = false
}: EditorPanelProps) {
  // No local state needed - all state is managed by child components

  // Active Tab object
  const activeTab = useMemo(() => {
    return openTabs.find(t => t.path === activeTabPath);
  }, [openTabs, activeTabPath]);

  const renderTextWithLinks = (text: string): React.ReactNode => {
    if (!text) return null;
    const linkRegex = /(https?:\/\/[^\s"'`()<>]+|mailto:[^\s"'`()<>]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const parts = text.split(linkRegex);
    if (parts.length === 1) return text;
    
    return parts.map((p, pi) => {
      if (pi % 2 === 1) {
        let href = p;
        if (p.includes('@') && !p.startsWith('mailto:') && !p.startsWith('http')) {
          href = `mailto:${p}`;
        }
        return (
          <a
            key={pi}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 underline hover:text-sky-300 font-sans cursor-pointer transition"
          >
            {p}
          </a>
        );
      }
      return p;
    });
  };

  const colorizeCodeLine = (line: string, lang: string): React.ReactNode => {
    if (!line.trim()) return <span>{line}</span>;

    const trimmed = line.trim();

    if (lang === 'gitignore') {
      const leadingSpaces = line.substring(0, line.indexOf(trimmed));
      
      // Comments in gitignore
      if (trimmed.startsWith('#')) {
        if (trimmed.includes('████████████')) {
          // Highlight progress bar
          const parts = trimmed.split('████████████');
          return (
            <span className="text-[#6A9955] italic font-mono select-text">
              {leadingSpaces}
              <span>{parts[0]}</span>
              <span className="text-[#4ec9b0] font-bold not-italic">████████████</span>
              <span className="text-[#b5cea8] font-bold not-italic font-sans">{parts[1] || ''}</span>
            </span>
          );
        }
        return <span className="text-[#6A9955] italic font-mono">{line}</span>;
      }

      // Control checks
      if (trimmed.startsWith('if ') || trimmed.startsWith('goto ') || trimmed.startsWith('stay_humble') || trimmed === '}') {
        const words = line.split(/(\s+|\(|\)|\{|\}|;)/);
        return (
          <span className="font-mono">
            {words.map((w, idx) => {
              if (['if', 'goto'].includes(w)) {
                return <span key={idx} className="text-[#c586c0] font-bold">{w}</span>;
              }
              if (['stuck', 'overwhelmed', 'successful'].includes(w)) {
                return <span key={idx} className="text-[#9cdcfe] italic">{w}</span>;
              }
              if (['learning', 'build_small', 'stay_humble'].includes(w)) {
                return <span key={idx} className="text-[#dcdcaa] font-semibold">{w}</span>;
              }
              if (['{', '}', ';', '(', ')'].includes(w)) {
                return <span key={idx} className="text-amber-400 font-bold">{w}</span>;
              }
              return <span key={idx} className="text-slate-300">{w}</span>;
            })}
          </span>
        );
      }

      // Negation rule: starts with !
      if (trimmed.startsWith('!')) {
        const pathPart = trimmed.substring(1);
        const folderSlash = pathPart.endsWith('/') ? '/' : '';
        const namePart = folderSlash ? pathPart.slice(0, -1) : pathPart;
        return (
          <span>
            {leadingSpaces}
            <span className="text-[#f44747] font-bold mr-0.5">!</span>
            <span className="text-[#4ec9b0] font-bold hover:underline transition-all cursor-pointer">{namePart}</span>
            {folderSlash && <span className="text-[#858585]">{folderSlash}</span>}
          </span>
         );
      }

      // Directories
      if (trimmed.endsWith('/')) {
        const folderName = trimmed.slice(0, -1);
        return (
          <span>
            {leadingSpaces}
            <span className="text-[#9cdcfe] font-medium">{folderName}</span>
            <span className="text-[#858585] font-bold">/</span>
          </span>
        );
      }

      // Wildcards / Secret files (*.pem, *.key)
      if (trimmed.includes('*')) {
        const parts = trimmed.split(/(\*|\.)/);
        return (
          <span>
            {leadingSpaces}
            {parts.map((part, pIdx) => {
              if (part === '*') return <span key={pIdx} className="text-[#d19a66] font-bold">*</span>;
              if (part === '.') return <span key={pIdx} className="text-neutral-500">.</span>;
              return <span key={pIdx} className="text-[#ce9178]">{part}</span>;
            })}
          </span>
        );
      }

      // Fallback gitignore
      return <span className="text-slate-350 font-mono">{line}</span>;
    }

    if (lang === 'license') {
      const leadingSpaces = line.substring(0, line.indexOf(trimmed));

      // Block comments or line comments in LICENSE
      if (trimmed.startsWith('/*') || trimmed.startsWith('//') || trimmed.startsWith('**') || trimmed.startsWith('*') || (trimmed.endsWith('*/') && trimmed.startsWith('/*'))) {
        return <span className="text-[#6A9955] italic font-mono">{line}</span>;
      }

      // Check for Section decorative lines
      if (trimmed.startsWith('-') || trimmed.endsWith('-')) {
        return <span className="text-zinc-600 select-none font-mono">{line}</span>;
      }

      // Author Signature Block
      if (trimmed.includes('Sanjib Bayen')) {
        return (
          <span className="font-sans font-bold text-[#4ec9b0] text-[13px] tracking-wide block text-left my-1">
            {line}
          </span>
        );
      }

      // Questions / Answers (Q: / A:)
      if (trimmed.startsWith('Q:')) {
        return (
          <span className="text-[#569cd6] font-bold font-sans">
            <span className="text-[#c586c0] mr-1.5 font-bold">Q:</span>
            {trimmed.substring(2)}
          </span>
        );
      }
      if (trimmed.startsWith('A:')) {
        return (
          <span className="text-slate-200 font-sans">
            <span className="text-[#4ec9b0] font-bold mr-1.5 font-bold">A:</span>
            {trimmed.substring(2)}
          </span>
        );
      }

      // Status meters in Section 5
      const statusMatch = line.match(/^(\s*)([^:]+)(:\s+)(ACTIVE|ALWAYS|MODERATE|IN\s+PROGRESS|BUILDING|UNKNOWN)$/);
      if (statusMatch) {
        const [, indent, label, colon, status] = statusMatch;
        let statusClass = 'text-neutral-400';
        if (status === 'ACTIVE') statusClass = 'text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15';
        if (status === 'ALWAYS') statusClass = 'text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/15';
        if (status === 'MODERATE') statusClass = 'text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/15';
        if (status === 'IN PROGRESS') statusClass = 'text-fuchsia-400 font-bold bg-fuchsia-500/10 px-2 py-0.5 rounded border border-fuchsia-500/15';
        if (status === 'BUILDING') statusClass = 'text-orange-400 font-bold bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/15';
        if (status === 'UNKNOWN') statusClass = 'text-rose-450 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/15';

        return (
          <span className="font-mono">
            <span className="text-zinc-500">{indent}</span>
            <span className="text-[#9cdcfe] font-medium">{label}</span>
            <span className="text-neutral-500">{colon}</span>
            <span className={statusClass}>{status}</span>
          </span>
        );
      }

      // MIT CAPS SECTION CLAUSES
      const isHeaderAllUppercase = trimmed.length > 10 && trimmed === trimmed.toUpperCase() && !trimmed.startsWith('•') && !trimmed.match(/^\d/);
      if (isHeaderAllUppercase) {
        return <span className="text-white font-bold tracking-wide text-[11.5px] font-sans">{line}</span>;
      }

      // Bullet nodes (•)
      if (trimmed.startsWith('•')) {
        const bulletRest = trimmed.substring(1);
        return (
          <span>
            {leadingSpaces}
            <span className="text-[#4ec9b0] font-bold mr-2 select-none font-mono">•</span>
            <span className="text-slate-300 font-sans">{bulletRest}</span>
          </span>
        );
      }

      // Numeric list items (1., 2., etc.)
      const numberMatch = trimmed.match(/^(\d+\.)(.*)/);
      if (numberMatch) {
        return (
          <span>
            {leadingSpaces}
            <span className="text-[#d19a66] font-mono font-bold mr-1.5 select-none">{numberMatch[1]}</span>
            <span className="text-slate-300 font-sans">{numberMatch[2]}</span>
          </span>
        );
      }

      // Action affirmations
      if (trimmed === 'Use freely.' || trimmed === 'Modify responsibly.' || trimmed === 'Debug patiently.') {
        return <span className="text-[#4ec9b0] font-bold italic block my-1 font-sans">{line}</span>;
      }

      // Greetings/Permission header hooks
      if (trimmed.startsWith('Permission is hereby granted') || trimmed.startsWith('Dear Future Engineer') || trimmed.startsWith('By tokenizing this file, you agree:')) {
        return <span className="text-sky-400 font-bold my-1 block font-sans">{line}</span>;
      }

      // Quote paragraphs (at the end)
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        return <span className="text-[#ce9178] italic font-sans">{line}</span>;
      }

      // Catch-all default line
      return <span className="text-slate-305 font-sans">{line}</span>;
    }

    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed.startsWith('#')) {
      return <span className="text-[#6A9955] italic">{line}</span>;
    }
    

    if (lang === 'markdown') {
      const headingMatch = trimmed.match(/^(#{1,6})(.*)/);
      if (headingMatch) {
        const level = headingMatch[1].length;
        const text = headingMatch[2].trim();
        const sizes = ['text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm'];
        const colors = ['text-white', 'text-sky-400', 'text-emerald-400', 'text-blue-400', 'text-purple-400', 'text-gray-300'];
        return (
          <span className={`${sizes[level - 1]} font-bold ${colors[level - 1]} block my-1`}>
            <span className="text-[#569cd6] mr-2">{headingMatch[1]}</span>
            {renderTextWithLinks(text)}
          </span>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <span className="text-emerald-400 italic border-l-2 border-emerald-500 pl-3 my-1 block">
            {renderTextWithLinks(trimmed.substring(2))}
          </span>
        );
      }
      return <span className="text-neutral-300">{renderTextWithLinks(line)}</span>;
    }

    if (lang === 'yaml') {
      const matchKey = line.match(/^(\s*)([a-zA-Z0-9_\-]+)(\s*:\s*)(.*)/);
      if (matchKey) {
        const [, indent, key, divider, value] = matchKey;
        const valTrimmed = value.trim();
        let valElement: React.ReactNode = <span className="text-[#b5cea8]">{value}</span>;
        if (valTrimmed.startsWith('"') || valTrimmed.startsWith("'")) {
          valElement = <span className="text-[#ce9178]">{value}</span>;
        } else if (valTrimmed === 'true' || valTrimmed === 'false') {
          valElement = <span className="text-[#569cd6] font-bold">{valTrimmed}</span>;
        }
        return (
          <span>
            <span className="text-slate-500">{indent}</span>
            <span className="text-[#9cdcfe] font-medium">{key}</span>
            <span className="text-neutral-400">{divider}</span>
            {valElement}
          </span>
        );
      }
    }

    return <span className="text-slate-300">{line}</span>;
  };

  const renderCodeWithLineNumbers = (codeText: string, lang: string) => {
    const lines = codeText.split('\n');
    return (
      <div className="flex flex-col font-mono text-xs leading-relaxed select-text min-h-full w-full">
        {lines.map((line, idx) => (
          <div key={idx} className="flex hover:bg-neutral-800/15 min-h-[21px] w-full">
            <div className="w-[45px] text-right text-neutral-600 select-none pr-3.5 border-r border-neutral-800/40 text-[11px] flex-shrink-0 pt-0.5 font-mono">
              {idx + 1}
            </div>
            <div className={`flex-1 pl-4 text-[12.5px] pt-0.5 text-left min-w-0 ${(wordWrap || lang === 'license' || lang === 'gitignore') ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`}>
              {colorizeCodeLine(line, lang)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderViewer = () => {
    if (!activeTab) return null;

    const path = activeTab.path;
    const content = activeTab.content;

    if (path === 'repository/sanjib-human') {
      return <SanjibHumanRepoDashboard openFile={openFile} />;
    }

    if (path.startsWith('extension/')) {
      return <ExtensionDetailsViewer path={path} theme={theme} />;
    }

    if (path === 'about/README.md') {
      return (
        <AboutReadmeViewer
          theme={theme}
          content={content}
          openFile={openFile}
          triggerTerminalSimulate={triggerTerminalSimulate}
        />
      );
    }

    if (path === 'about/profile.yml') {
      return (
        <AboutProfileYamlViewer
          theme={theme}
          content={content}
          codeContentNode={renderCodeWithLineNumbers(content, 'yaml')}
        />
      );
    }

    if (path === 'connect/links.yml') {
      return <LinksYamlDashboard theme={theme} content={content} />;
    }

    if (path === 'connect/api.tsx') {
      return (
        <ApiPlaygroundDashboard 
          theme={theme} 
          content={content} 
          triggerTerminalSimulate={triggerTerminalSimulate} 
          openFile={openFile} 
        />
      );
    }

    if (path === '.gitignore') {
      return (
        <div className="py-2 pl-0 pr-4 select-text h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
          {renderCodeWithLineNumbers(content, 'gitignore')}
        </div>
      );
    }

    if (path === 'LICENSE.txt') {
      return (
        <div className="py-2 pl-0 pr-4 select-text h-full overflow-y-auto overflow-x-hidden custom-scrollbar">
          {renderCodeWithLineNumbers(content, 'license')}
        </div>
      );
    }

    if (path === 'projects/portfolio.db') {
      return <ProjectDbViewer theme={theme} content={content} triggerTerminalSimulate={triggerTerminalSimulate} />;
    }

    if (path === 'research/research.ipynb') {
      return <JupyterNotebookViewer theme={theme} content={content} triggerTerminalSimulate={triggerTerminalSimulate} />;
    }

    if (path === 'achievements/timeline.log') {
      return <TimelineLogViewer theme={theme} content={content} />;
    }

    if (activeTab.language === 'markdown') {
      return (
        <div className="py-2 pl-0 pr-4 select-text h-full overflow-auto custom-scrollbar">
          {renderCodeWithLineNumbers(content, 'markdown')}
        </div>
      );
    }

    if (path.startsWith('skills/')) {
      return (
        <div className="bg-neutral-900/65 rounded-xl border border-neutral-800 p-5 flex flex-col h-full min-h-0 overflow-auto">
          <SkillsVisualizer
            activePath={path}
            content={content}
            triggerTerminalSimulate={triggerTerminalSimulate}
            openFile={openFile}
          />
        </div>
      );
    }

    return (
      <div className="py-2 pl-0 pr-4 select-text h-full overflow-auto custom-scrollbar">
        {renderCodeWithLineNumbers(content, activeTab.language || 'plaintext')}
      </div>
    );
  };

  return (
    <div
      className="flex-1 h-full flex flex-col min-h-0 overflow-auto relative select-none"
      style={{ backgroundColor: theme.editorBg }}
      id="editor-workspace-panel"
    >
      
      {/* TAB ROW */}
      <div 
        className="h-9 border-b flex items-center justify-between select-none overflow-x-auto whitespace-nowrap scrollbar-none"
        style={{ 
          backgroundColor: '#252526',
          borderColor: '#1a1a1a'
        }}
      >
        <div className="flex h-full items-center">
          {openTabs.map((tab) => {
            const isActive = tab.path === activeTabPath;
            return (
              <div
                key={tab.path}
                onClick={() => onSelectTab(tab.path)}
                className={`h-full px-4 flex items-center border-r transition-all duration-300 cursor-pointer relative group text-xs ${
                  isActive 
                    ? 'text-white font-medium' 
                    : 'text-neutral-400 hover:bg-[#2a2d2e] hover:text-[#cccccc]'
                }`}
                style={{ 
                  backgroundColor: isActive ? '#1e1e1e' : undefined,
                  borderRightColor: '#1a1a1a',
                  borderTop: isActive ? '2px solid #007acc' : '2px solid transparent'
                }}
              >
                {getFileIcon(tab.name)}
                <span className="font-mono text-[11.5px] select-none pr-1.5">{tab.name}</span>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.path);
                  }}
                  className="rounded-full hover:bg-neutral-800/80 p-0.5 text-neutral-500 hover:text-white transition-opacity shrink-0"
                  aria-label={`Close tab ${tab.name}`}
                >
                  <X className="w-3 h-3 stroke-[2.2]" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* BREADCRUMBS */}
      {activeTab && (
        <div 
          className="h-[24px] border-b flex items-center px-4 select-none text-[10.5px] font-mono whitespace-nowrap overflow-x-auto"
          style={{ 
            backgroundColor: theme.editorBg,
            borderColor: `${theme.activeBorder}10`,
            color: theme.textColor
          }}
        >
          <span className="opacity-45">SANJIB-BAYEN</span>
          <ChevronRight className="w-3 h-3 text-neutral-600 mx-1.5 shrink-0" />
          <span className="opacity-70 text-sky-400 font-semibold">{activeTab.path.split('/').slice(0, -1).join(' > ')}</span>
          <ChevronRight className="w-3 h-3 text-neutral-600 mx-1.5 shrink-0" />
          <span className="text-white font-medium">{activeTab.name}</span>
        </div>
      )}

      {/* EDITOR BODY */}
      <div className="flex-1 min-h-0 overflow-auto font-sans relative flex flex-col">
        {activeTab ? (
          <div className="w-full h-full flex flex-col relative min-h-0 overflow-auto">
            {renderViewer()}
          </div>
        ) : (
          /* WELCOME SCREEN */
          <div className="w-full max-w-2xl mx-auto flex flex-col justify-center h-full min-h-[450px] space-y-8 select-none text-left p-6">
            <div className="flex flex-col space-y-2">
              <span className="text-[11px] font-mono tracking-widest text-emerald-400 uppercase font-bold animate-pulse">● SYSTEMS ONLINE</span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white font-sans">
                Sanjib Bayen
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-lg leading-relaxed">
                VFS Workspace replica serving as a professional developer profile. Open files, run terminals, test configurations, or edit scripts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700/60 transition">
                <h3 className="font-bold text-white text-xs uppercase flex items-center mb-2">
                  <FileText className="w-4 h-4 text-emerald-400 mr-2" /> Start Exploring
                </h3>
                <p className="text-[11.5px] text-slate-400 leading-normal mb-3">
                  Open the file browser on the left. Click on README.md to read Sanjib's profile.
                </p>
                <button
                  onClick={() => openFile('about/README.md')}
                  className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-mono font-medium rounded border border-neutral-700 text-slate-200 transition"
                >
                  open about/README.md
                </button>
              </div>

              <div className="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700/60 transition">
                <h3 className="font-bold text-white text-xs uppercase flex items-center mb-2">
                  <Terminal className="w-4 h-4 text-sky-400 mr-2" /> Test Terminal
                </h3>
                <p className="text-[11.5px] text-slate-400 leading-normal mb-3">
                  Click the terminal at the bottom. Type commands like <code className="text-emerald-400">help</code>.
                </p>
                <button
                  onClick={() => triggerTerminalSimulate('help')}
                  className="w-full py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs font-mono font-medium rounded border border-neutral-700 text-slate-200 transition"
                >
                  help (Lists commands)
                </button>
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-6">
              <h4 className="text-[10px] tracking-wider uppercase font-bold text-slate-450 mb-3">Keyboard Shortcuts</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-[11px] font-mono text-slate-450">
                <div className="flex items-center justify-between border-b border-neutral-800/40 py-1">
                  <span>Show File Explorer</span>
                  <kbd className="bg-neutral-800/80 px-1.5 py-0.5 rounded border border-neutral-700 text-white text-[9px]">Ctrl + E</kbd>
                </div>
                <div className="flex items-center justify-between border-b border-neutral-800/40 py-1">
                  <span>Open Terminal</span>
                  <kbd className="bg-neutral-800/80 px-1.5 py-0.5 rounded border border-neutral-700 text-white text-[9px]">Ctrl + `</kbd>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}