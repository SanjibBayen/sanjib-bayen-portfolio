/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  BookOpen, 
  CheckCircle2,
  Activity,
  Terminal,
  Database,
  Layers,
  ChevronRight,
  ChevronDown,
  Info,
  Copy,
  LineChart,
  HardDrive,
  RefreshCw,
  ExternalLink,
  Check,
  Code2,
  FileText,
  ChevronLeft,
  Menu,
  MoreVertical,
  Settings,
  Table,
  BarChart3,
  Sparkles,
  Folder,
  File,
  Plus,
  Users,
  Award,
  Heart,
  Brain,
  Cpu,
  Zap,
  Calendar
} from 'lucide-react';
import { VSCodeTheme } from '@/types';
import { researchPapersData, ResearchPaper } from '@/features/research';
import { toast } from '@/shared/utils/toast';

interface JupyterNotebookViewerProps {
  theme: VSCodeTheme;
  content: string;
  triggerTerminalSimulate?: (msg: string) => void;
}

/**
 * A highly precise, robust Python syntax colorizer for Jupyter Code cell visualization.
 * It simulates typical VS Code and Colab color tokens.
 */
function colorizePythonLine(line: string): React.ReactNode {
  if (!line) return <span>&nbsp;</span>;
  if (line.trim().startsWith('#')) {
    return <span className="text-[#6a9955] italic font-mono">{line}</span>;
  }

  // Split line so inline comments can be handled at the end
  let commentIndex = line.indexOf('#');
  let insideSingle = false;
  let insideDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "'" && !insideDouble) insideSingle = !insideSingle;
    else if (ch === '"' && !insideSingle) insideDouble = !insideDouble;
    if (ch === '#' && !insideSingle && !insideDouble) {
      commentIndex = i;
      break;
    }
  }

  const codePart = commentIndex !== -1 ? line.substring(0, commentIndex) : line;
  const commentPart = commentIndex !== -1 ? line.substring(commentIndex) : '';

  const tokens: React.ReactNode[] = [];
  const keywordRegex = /\b(import|from|as|def|class|return|print|for|in|if|elif|else|while|try|except|with|and|or|not|in|is|lambda|pass|global|assert|break|continue|None|True|False)\b/g;
  const stringRegex = /(["'])(?:(?!\1|\\).|\\.)*\1/g;
  const numberRegex = /\s*(\b\d+\.?\d*)\b/g;
  const functionRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)(?=\()/g;

  // Track matched string ranges to avoid overlaps
  const stringRanges: { start: number; end: number; text: string }[] = [];
  let match;
  while ((match = stringRegex.exec(codePart)) !== null) {
    stringRanges.push({
      start: match.index,
      end: match.index + match[0].length,
      text: match[0],
    });
  }

  const highlights: { start: number; end: number; type: 'keyword' | 'function' | 'number'; text: string }[] = [];

  keywordRegex.lastIndex = 0;
  while ((match = keywordRegex.exec(codePart)) !== null) {
    highlights.push({ start: match.index, end: match.index + match[0].length, type: 'keyword', text: match[0] });
  }

  functionRegex.lastIndex = 0;
  while ((match = functionRegex.exec(codePart)) !== null) {
    highlights.push({ start: match.index, end: match.index + match[0].length, type: 'function', text: match[0] });
  }

  numberRegex.lastIndex = 0;
  while ((match = numberRegex.exec(codePart)) !== null) {
    highlights.push({ start: match.index, end: match.index + match[0].length, type: 'number', text: match[0] });
  }

  const allIntervals = [
    ...stringRanges.map(s => ({ ...s, type: 'string' as const })),
    ...highlights
  ];

  allIntervals.sort((a, b) => a.start - b.start);

  const nonOverlapping: { start: number; end: number; type: 'string' | 'keyword' | 'function' | 'number'; text: string }[] = [];
  let currentEnd = 0;
  for (const interval of allIntervals) {
    if (interval.start >= currentEnd) {
      nonOverlapping.push(interval);
      currentEnd = interval.end;
    }
  }

  let lastIdx = 0;
  nonOverlapping.forEach((interval, idx) => {
    if (interval.start > lastIdx) {
      tokens.push(<span key={`text-${idx}`}>{codePart.substring(lastIdx, interval.start)}</span>);
    }
    let colorClass = '';
    if (interval.type === 'string') colorClass = 'text-[#ce9178]';
    else if (interval.type === 'keyword') {
      colorClass = ['import', 'from', 'as', 'def', 'class'].includes(interval.text)
        ? 'text-[#c586c0] font-bold'
        : 'text-[#569cd6] font-medium';
    }
    else if (interval.type === 'function') colorClass = 'text-[#dcdcaa]';
    else if (interval.type === 'number') colorClass = 'text-[#b5cea8]';

    tokens.push(
      <span key={`highlight-${idx}`} className={colorClass}>
        {interval.text}
      </span>
    );
    lastIdx = interval.end;
  });

  if (lastIdx < codePart.length) {
    tokens.push(<span key="text-end">{codePart.substring(lastIdx)}</span>);
  }

  if (commentPart) {
    tokens.push(<span key="comment-end" className="text-[#6a9955] italic">{commentPart}</span>);
  }

  return <span className="font-mono">{tokens}</span>;
}

export default function JupyterNotebookViewer({ theme, content, triggerTerminalSimulate }: JupyterNotebookViewerProps) {
  const [kernelState, setKernelState] = useState<'idle' | 'busy'>('idle');
  const [isFileBrowserOpen, setIsFileBrowserOpen] = useState<boolean>(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(true);
  const [activeRunningId, setActiveRunningId] = useState<string | null>(null);
  const [runSequenceProgress, setRunSequenceProgress] = useState<number>(-1);
  
  // Track execution index counts
  const [executionIndexes, setExecutionIndexes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = { 'intro': 1 };
    researchPapersData.forEach((paper, pIdx) => {
      initial[`${paper.id}-load`] = pIdx * 4 + 2;
      initial[`${paper.id}-data`] = pIdx * 4 + 3;
      initial[`${paper.id}-metrics`] = pIdx * 4 + 4;
      initial[`${paper.id}-visual`] = pIdx * 4 + 5;
    });
    return initial;
  });

  // Track visibility of cell outputs
  const [cellOutputsVisible, setCellOutputsVisible] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = { 'intro': true };
    researchPapersData.forEach(paper => {
      initial[`${paper.id}-load`] = true;
      initial[`${paper.id}-data`] = true;
      initial[`${paper.id}-metrics`] = true;
      initial[`${paper.id}-visual`] = true;
    });
    return initial;
  });

  const [activeSectionId, setActiveSectionId] = useState<string>('portfolio-intro');
  const [focusedCellId, setFocusedCellId] = useState<string | null>(null);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);
  const [collapsedJsonTrees, setCollapsedJsonTrees] = useState<Record<string, boolean>>({});

  const handleRunCell = (cellKey: string) => {
    setActiveRunningId(cellKey);
    setKernelState('busy');

    if (triggerTerminalSimulate) {
      triggerTerminalSimulate(`python run_cell.py --notebook research.ipynb --cell "${cellKey}"`);
    }

    setTimeout(() => {
      setActiveRunningId(null);
      setKernelState('idle');
      
      setExecutionIndexes(prev => ({ ...prev, [cellKey]: (prev[cellKey] || 0) + 1 }));
      setCellOutputsVisible(prev => ({ ...prev, [cellKey]: true }));
    }, 2800);
  };

  const handleRunAllCells = () => {
    setKernelState('busy');
    setRunSequenceProgress(0);

    if (triggerTerminalSimulate) {
      triggerTerminalSimulate(`python run_cell.py --notebook research.ipynb --all`);
    }

    const cellSequence = ['intro'];
    researchPapersData.forEach(paper => {
      cellSequence.push(`${paper.id}-load`);
      cellSequence.push(`${paper.id}-data`);
      cellSequence.push(`${paper.id}-metrics`);
      cellSequence.push(`${paper.id}-visual`);
    });

    let currentIdx = 0;
    const runNext = () => {
      if (currentIdx >= cellSequence.length) {
        setKernelState('idle');
        setRunSequenceProgress(-1);
        toast.success('All cells executed successfully!');
        return;
      }
      
      const key = cellSequence[currentIdx];
      setActiveRunningId(key);
      setRunSequenceProgress(Math.round(((currentIdx + 1) / cellSequence.length) * 100));

      setTimeout(() => {
        setExecutionIndexes(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
        setCellOutputsVisible(prev => ({ ...prev, [key]: true }));
        currentIdx++;
        runNext();
      }, 600);
    };
    
    setTimeout(() => {
      runNext();
    }, 2000);
  };

  const handleClearAllOutputs = () => {
    setKernelState('idle');
    setRunSequenceProgress(-1);
    setCellOutputsVisible({});
    setExecutionIndexes({});
    toast.info('All cell outputs cleared');
  };

  const handleCopyClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedValue(label);
    setTimeout(() => setCopiedValue(null), 1500);
  };

  const toggleJsonTree = (key: string) => {
    setCollapsedJsonTrees(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <span className="px-2 py-0.5 bg-green-500/15 text-green-400 border border-green-500/25 rounded text-[9px] font-mono">COMPLETED</span>;
      case 'Under Review':
        return <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 border border-blue-500/25 rounded text-[9px] font-mono">UNDER REVIEW</span>;
      case 'In Progress':
        return <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded text-[9px] font-mono">IN PROGRESS</span>;
      default:
        return <span className="px-2 py-0.5 bg-gray-500/15 text-gray-400 border border-gray-500/25 rounded text-[9px] font-mono">{status.toUpperCase()}</span>;
    }
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSectionId(sectionId);
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Generate 100% original, dynamic code based on individual paper datasets and parameters, removing hardcoding.
  const generateLoadCellCode = (paper: ResearchPaper) => {
    return `# Import necessary libraries for ${paper.category} research
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Load ${paper.category} research dataset
print("Loading ${paper.category} research data...")
print(f"Research Title: ${paper.title}")
print(f"Status: ${paper.status}")
print(f"Year: ${paper.year}")`;
  };

  const generateDataCellCode = (paper: ResearchPaper) => {
    return `# Data preprocessing and exploration for ${paper.title}
print("Dataset loaded successfully")
print(f"Number of records: ${paper.dataset.length} data sources")

# Dataset sources:
for idx, source in enumerate(${JSON.stringify(paper.dataset)}):
    print(f"  {idx + 1}. {source}")

print("\\n=== Pipeline Diagnostics ===")
print("Standardized features scaling applied in runtime")`;
  };

  const generateMetricsCellCode = (paper: ResearchPaper) => {
    const bestModel = paper.bestModel || 'AdaBoost Classifier';
    const stages = paper.pipelineStages || [
      'Data Imbalance Correction',
      'Feature Standardization',
      'Ensemble Learning pipeline'
    ];
    return `# Preprocessing pipeline and performance metrics for ${paper.title}
print("=== Custom Preprocessing stages ===")
pipeline_stages = ${JSON.stringify(stages)}
for stage in pipeline_stages:
    print(f"- {stage}")

print("\\n=== Performance Metrics ===")
for metric in ${JSON.stringify(paper.metrics)}:
    print(f"  {metric['label']}: {metric['value']}")

print("\\n=== Model Selection ===")
print(f"Best Performing Model: {bestModel}")`;
  };

  const generateVisualCellCode = (paper: ResearchPaper) => {
    return `# Display research authors and affiliations
authors = ${JSON.stringify(paper.authors || ['Sanjib Bayen'])}
print("=== Research Authors ===")
for author in authors:
    print(f"[Author] {author}")

print("\\n=== Publication Details ===")
print(f"Journal: ${paper.journal || 'Under Review'}")
print(f"DOI: ${paper.doi || 'Pending'}")`;
  };

  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #1e1e1e; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #424242; border-radius: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #4e4e4e; }
    .custom-scrollbar::-webkit-scrollbar-corner { background: #1e1e1e; }
  `;

  return (
    <div className="flex-1 w-full h-full flex flex-col overflow-hidden bg-[#1e1e1e] text-[#d4d4d4]">
      <style>{scrollbarStyles}</style>
      
      {/* TOP BAR - Google Colab Style */}
      <div className="bg-[#1e1e1e] border-b border-[#2d2d2d] px-3 py-1.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <svg width="40" height="40" viewBox="0 0 100 100" className="text-[#f9ab00]">
              <path d="M 33 50 C 33 60, 48 60, 50 50 C 52 40, 67 40, 67 50 C 67 60, 52 60, 50 50 C 48 40, 33 40, 33 50 Z" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
              <path d="M 50 50 C 52 60, 67 60, 67 50 C 67 40, 54 40, 50 50" fill="none" stroke="#f57c00" strokeWidth="10" strokeLinecap="round"/>
            </svg>
            <span className="text-[14px] font-semibold text-[#e8eaed]">Colab</span>
          </div>
          <div className="flex items-center gap-2 pl-2 border-l border-[#3c3c3c]">
            <span className="text-[13px] font-medium text-[#e8eaed]">research.ipynb</span>
            <div className="flex items-center gap-1.5 bg-[#2d2d2d] px-1.5 py-0.5 rounded text-[9.5px]">
              <HardDrive className="w-3 h-3 text-[#9aa0a6]" />
              <span className="text-[#9aa0a6]">Google Drive</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-2 py-1 bg-[#2d2d2d] rounded text-[11px]">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>RAM: 12.7 GB</span>
            <span className="text-[#9aa0a6]">|</span>
            <span>Disk: 78 GB</span>
          </div>
          <button className="p-1.5 hover:bg-[#2d2d2d] rounded-full transition">
            <Settings className="w-4 h-4 text-[#9aa0a6]" />
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SIDEBAR */}
        <div className={`bg-[#252526] border-r border-[#2d2d2d] flex flex-col shrink-0 transition-all duration-200 ${isFileBrowserOpen ? 'w-80' : 'w-0 overflow-hidden'}`}>
          <div className="p-2 border-b border-[#2d2d2d] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#e8eaed]">
              <Folder className="w-4 h-4 text-[#9aa0a6]" />
              <span>Files & Research</span>
            </div>
            <button onClick={() => setIsFileBrowserOpen(false)} className="p-0.5 hover:bg-[#3c3c3c] rounded">
              <ChevronLeft className="w-3.5 h-3.5 text-[#9aa0a6]" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
            <div className="px-2 py-1 text-[10px] text-[#9aa0a6] uppercase font-semibold">WORKSPACE</div>
            <div className="flex items-center gap-2 px-2 py-1.5 mx-1 my-0.5 bg-[#2d2d2d] rounded cursor-pointer">
              <FileText className="w-3.5 h-3.5 text-[#f9ab00]" />
              <span className="text-[11px] font-medium">research.ipynb</span>
            </div>
            
            <div className="px-2 py-1 text-[10px] text-[#9aa0a6] uppercase font-semibold mt-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#f9ab00]" />
                <span>RESEARCH PAPERS</span>
              </div> 
              <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="p-0.5 hover:bg-[#3c3c3c] rounded">
                {isSidebarExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
              </button>
            </div>
            
            {isSidebarExpanded && (
              <div className="space-y-0.5 mt-1">
                {researchPapersData.map((paper) => (
                  <button
                    key={paper.id}
                    onClick={() => scrollToSection(paper.id)}
                    className={`w-full text-left flex items-center gap-2 px-2 py-1.5 mx-1 my-0.5 rounded transition ${
                      activeSectionId === paper.id ? 'bg-[#1a73e8]/20 border-l-2 border-[#1a73e8]' : 'hover:bg-[#2d2d2d]'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${paper.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-medium truncate">{paper.title.substring(0, 45)}...</div>
                      <div className="text-[9px] text-[#9aa0a6] truncate">{paper.category}</div>
                    </div>
                    <span className="text-[8px] text-[#6c7086] shrink-0">{paper.year}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* NOTEBOOK CONTENT */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
          
          {/* TOOLBAR */}
          <div className="bg-[#252526] border-b border-[#2d2d2d] px-4 py-2 flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setIsFileBrowserOpen(!isFileBrowserOpen)}
              className="p-1.5 hover:bg-[#3c3c3c] rounded transition"
              title={isFileBrowserOpen ? "Close sidebar" : "Open sidebar"}
            >
              <Menu className="w-4 h-4 text-[#9aa0a6]" />
            </button>

            <div className="h-5 w-px bg-[#3c3c3c]" />

            <button onClick={handleRunAllCells} disabled={kernelState === 'busy'} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1a73e8] hover:bg-[#1a66c9] disabled:bg-[#3c3c3c] text-white text-[12px] font-medium rounded transition">
              <Play className="w-3.5 h-3.5" /> Run all
            </button>
            <button onClick={handleClearAllOutputs} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#3c3c3c] hover:bg-[#4e4e4e] text-[#e8eaed] text-[12px] font-medium rounded transition">
              <RotateCcw className="w-3.5 h-3.5" /> Clear outputs
            </button>
            <div className="h-5 w-px bg-[#3c3c3c]" />
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent hover:bg-[#3c3c3c] text-[#e8eaed] text-[12px] font-medium rounded transition">
              <Plus className="w-3.5 h-3.5" /> Code
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-transparent hover:bg-[#3c3c3c] text-[#e8eaed] text-[12px] font-medium rounded transition">
              <Plus className="w-3.5 h-3.5" /> Text
            </button>
           
            <div className="flex-1" />
            {kernelState === 'busy' && (
              <div className="flex items-center gap-2 text-[11px] text-[#f9ab00]">
                <div className="w-2 h-2 rounded-full bg-[#f9ab00] animate-pulse" />
                <span>Running...</span>
              </div>
            )}
            
            <div className="flex items-center gap-1 text-[10px] text-[#9aa0a6]">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span>Python 3.10</span>
            </div>
          </div>

          {/* SCROLLABLE NOTEBOOK AREA */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
            
            {/* INTRO CELL */}
            <div id="portfolio-intro" className="bg-[#252526] rounded-lg overflow-hidden border border-[#2d2d2d]">
              <div className="bg-[#2d2d2d] px-3 py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-[#9aa0a6]">[ ]</span>
                  <span className="text-[10px] font-mono text-[#9aa0a6]">Markdown</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-6 h-6 text-[#1a73e8]" />
                  <h1 className="text-2xl font-bold text-[#e8eaed]">Research Portfolio Notebook</h1>
                </div>
                <p className="text-[#9aa0a6] text-sm mb-4">
                  Interactive Jupyter notebook containing research papers on {researchPapersData.map(p => p.category).join(', ')}.
                </p>
                <div className="grid grid-cols-4 gap-3 pt-2">
                  <div className="bg-[#1e1e1e] p-2 rounded border border-[#2d2d2d]">
                    <div className="text-[9px] text-[#9aa0a6] uppercase">Principal Investigator</div>
                    <div className="text-[12px] font-semibold text-[#e8eaed]">Sanjib Bayen</div>
                  </div>
                  <div className="bg-[#1e1e1e] p-2 rounded border border-[#2d2d2d]">
                    <div className="text-[9px] text-[#9aa0a6] uppercase">Research Papers</div>
                    <div className="text-[12px] font-semibold text-[#f9ab00]">{researchPapersData.length}</div>
                  </div>
                  <a 
                    href="https://scholar.google.com/citations?view_op=search_authors&mauthors=Sanjib+Bayen" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#1e1e1e] p-2 rounded border border-[#2d2d2d] hover:border-[#1a73e8]/40 transition group block"
                  >
                    <div className="text-[9px] text-[#9aa0a6] uppercase group-hover:text-[#1a73e8] transition">Google Scholar</div>
                    <div className="text-[12px] font-semibold text-emerald-400 group-hover:text-emerald-300 transition flex items-center gap-1 mt-0.5">
                      <span>Scholar Profile</span>
                      <ExternalLink className="w-3 h-3 text-emerald-400 shrink-0" />
                    </div>
                  </a>
                  <div className="bg-[#1e1e1e] p-2 rounded border border-[#2d2d2d]">
                    <div className="text-[9px] text-[#9aa0a6] uppercase">Last Updated</div>
                    <div className="text-[12px] font-semibold text-[#e8eaed]">{new Date().getFullYear()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RESEARCH PAPERS - Dynamically Generated for ALL papers */}
            {researchPapersData.map((paper, paperIdx) => {
              const paperNum = String(paperIdx + 1).padStart(2, '0');
              const loadKey = `${paper.id}-load`;
              const dataKey = `${paper.id}-data`;
              const metricsKey = `${paper.id}-metrics`;
              const visualKey = `${paper.id}-visual`;

              return (
                <div key={paper.id} id={paper.id} className="space-y-4 pt-4 border-t border-[#2d2d2d]/60">
                  
                  {/* MARKDOWN CELL - Section Header */}
                  <div className="bg-[#252526] rounded-lg overflow-hidden border border-[#2d2d2d]">
                    <div className="bg-[#2d2d2d] px-3 py-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#9aa0a6]">[ ]</span>
                        <span className="text-[10px] font-mono text-[#9aa0a6]">Markdown</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="text-[10px] font-mono text-[#f9ab00] mb-1">RESEARCH PAPER {paperNum}</div>
                      <h2 className="text-lg font-bold text-[#e8eaed] mb-2">{paper.title}</h2>
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[#1e1e1e] border border-[#2d2d2d] rounded text-[10px] text-[#9aa0a6]">
                          <Folder className="w-3.5 h-3.5 text-blue-400" />
                          <span>{paper.category}</span>
                        </span>
                        {getStatusBadge(paper.status)}
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[#1e1e1e] border border-[#2d2d2d] rounded text-[10px] text-[#9aa0a6]">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{paper.year}</span>
                        </span>
                      </div>
                      <p className="text-[#9aa0a6] text-sm leading-relaxed border-l-2 border-[#f9ab00] pl-3 italic">{paper.summary}</p>
                    </div>
                  </div>

                  {/* CODE CELL 1 - Load Research Assets */}
                  <div className={`bg-[#1e1e1e] rounded-lg overflow-hidden border transition-all ${focusedCellId === loadKey ? 'border-[#1a73e8] shadow-md' : 'border-[#2d2d2d]'}`} onClick={() => setFocusedCellId(loadKey)}>
                    <div className="bg-[#2d2d2d] px-3 py-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <button onClick={(e) => { e.stopPropagation(); handleRunCell(loadKey); }} disabled={kernelState === 'busy'} className="p-1 hover:bg-[#3c3c3c] rounded transition">
                            {activeRunningId === loadKey ? <div className="w-3.5 h-3.5 border-2 border-[#f9ab00] border-t-transparent rounded-full animate-spin" /> : <Play className="w-3.5 h-3.5 text-[#9aa0a6]" />}
                          </button>
                          <span className="text-[10px] font-mono text-[#9aa0a6]">[{executionIndexes[loadKey] !== undefined ? executionIndexes[loadKey] : ' '}]</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#9aa0a6]">Code</span>
                      </div>
                    </div>
                    <div className="p-4 font-mono text-[12px] bg-[#1e1e1e] overflow-x-auto select-text custom-scrollbar space-y-0.5 border-l-2 border-[#1a73e8]">
                      {generateLoadCellCode(paper).split('\n').map((line, idx) => (
                        <div key={idx} className="flex gap-4 hover:bg-[#252526] rounded-sm px-1 leading-snug">
                          <span className="text-neutral-600 select-none text-[10px] text-right w-5 inline-block font-sans">{idx + 1}</span>
                          <span className="flex-1 whitespace-pre">{colorizePythonLine(line)}</span>
                        </div>
                      ))}
                    </div>
                    
                    {cellOutputsVisible[loadKey] && (
                      <div className="border-t border-[#2d2d2d] bg-[#1e1e1e] p-4 font-mono">
                        <div className="text-[10px] text-[#9aa0a6] mb-2">[Output]</div>
                        <div className="space-y-1 text-[11px]">
                          <div className="text-green-500 font-semibold">[OK] Loaded telemetry profile successfully.</div>
                          <div><span className="text-[#9cdcfe]">Title:</span> {paper.title}</div>
                          <div><span className="text-[#9cdcfe]">Status:</span> {paper.status}</div>
                          <div><span className="text-[#9cdcfe]">Year:</span> {paper.year}</div>
                          {paper.accuracy && <div><span className="text-[#9cdcfe]">Best Accuracy:</span> <span className="text-[#f9ab00]">{paper.accuracy}</span></div>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CODE CELL 2 - Dataset & Preprocessing */}
                  <div className={`bg-[#1e1e1e] rounded-lg overflow-hidden border transition-all ${focusedCellId === dataKey ? 'border-[#1a73e8] shadow-md' : 'border-[#2d2d2d]'}`} onClick={() => setFocusedCellId(dataKey)}>
                    <div className="bg-[#2d2d2d] px-3 py-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <button onClick={(e) => { e.stopPropagation(); handleRunCell(dataKey); }} disabled={kernelState === 'busy'} className="p-1 hover:bg-[#3c3c3c] rounded transition">
                            {activeRunningId === dataKey ? <div className="w-3.5 h-3.5 border-2 border-[#f9ab00] border-t-transparent rounded-full animate-spin" /> : <Play className="w-3.5 h-3.5 text-[#9aa0a6]" />}
                          </button>
                          <span className="text-[10px] font-mono text-[#9aa0a6]">[{executionIndexes[dataKey] !== undefined ? executionIndexes[dataKey] : ' '}]</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#9aa0a6]">Code</span>
                      </div>
                    </div>
                    <div className="p-4 font-mono text-[12px] bg-[#1e1e1e] overflow-x-auto select-text custom-scrollbar space-y-0.5 border-l-2 border-[#1a73e8]">
                      {generateDataCellCode(paper).split('\n').map((line, idx) => (
                        <div key={idx} className="flex gap-4 hover:bg-[#252526] rounded-sm px-1 leading-snug">
                          <span className="text-neutral-600 select-none text-[10px] text-right w-5 inline-block font-sans">{idx + 1}</span>
                          <span className="flex-1 whitespace-pre">{colorizePythonLine(line)}</span>
                        </div>
                      ))}
                    </div>
                    
                    {cellOutputsVisible[dataKey] && (
                      <div className="border-t border-[#2d2d2d] bg-[#1e1e1e] p-4">
                        <div className="text-[10px] text-[#9aa0a6] mb-2">[Output]</div>
                        <div className="bg-[#1e1e1e] rounded font-mono text-[11px]">
                          <div className="flex items-center gap-1 text-[#9cdcfe]">
                            <span>{collapsedJsonTrees[paper.id] ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}</span>
                            <span onClick={() => toggleJsonTree(paper.id)} className="cursor-pointer hover:opacity-80">"dataset"</span>
                            <span>: [{paper.dataset.length} items]</span>
                          </div>
                          {!collapsedJsonTrees[paper.id] && (
                            <div className="pl-5 border-l border-[#2d2d2d] ml-1.5 mt-1 space-y-1">
                              {paper.dataset.map((dataName, idx) => (
                                <div key={idx} className="flex items-center justify-between py-0.5">
                                  <div><span className="text-[#f9ab00]">{idx}:</span><span className="text-[#ce9178] ml-2">"{dataName}"</span>{idx < paper.dataset.length - 1 && <span className="text-[#9aa0a6]">,</span>}</div>
                                  <button onClick={() => handleCopyClipboard(dataName, `${paper.id}-${idx}`)} className="opacity-0 hover:opacity-100 p-0.5" title="Copy item text">
                                    {copiedValue === `${paper.id}-${idx}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-[#6c7086]" />}
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CODE CELL 3 - Metrics & Evaluation */}
                  <div className={`bg-[#1e1e1e] rounded-lg overflow-hidden border transition-all ${focusedCellId === metricsKey ? 'border-[#1a73e8] shadow-md' : 'border-[#2d2d2d]'}`} onClick={() => setFocusedCellId(metricsKey)}>
                    <div className="bg-[#2d2d2d] px-3 py-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <button onClick={(e) => { e.stopPropagation(); handleRunCell(metricsKey); }} disabled={kernelState === 'busy'} className="p-1 hover:bg-[#3c3c3c] rounded transition">
                            {activeRunningId === metricsKey ? <div className="w-3.5 h-3.5 border-2 border-[#f9ab00] border-t-transparent rounded-full animate-spin" /> : <Play className="w-3.5 h-3.5 text-[#9aa0a6]" />}
                          </button>
                          <span className="text-[10px] font-mono text-[#9aa0a6]">[{executionIndexes[metricsKey] !== undefined ? executionIndexes[metricsKey] : ' '}]</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#9aa0a6]">Code</span>
                      </div>
                    </div>
                    <div className="p-4 font-mono text-[12px] bg-[#1e1e1e] overflow-x-auto select-text custom-scrollbar space-y-0.5 border-l-2 border-[#1a73e8]">
                      {generateMetricsCellCode(paper).split('\n').map((line, idx) => (
                        <div key={idx} className="flex gap-4 hover:bg-[#252526] rounded-sm px-1 leading-snug">
                          <span className="text-neutral-600 select-none text-[10px] text-right w-5 inline-block font-sans">{idx + 1}</span>
                          <span className="flex-1 whitespace-pre">{colorizePythonLine(line)}</span>
                        </div>
                      ))}
                    </div>
                    
                    {cellOutputsVisible[metricsKey] && (
                      <div className="border-t border-[#2d2d2d] bg-[#1e1e1e] p-4 text-[11px] font-mono">
                        <div className="text-[10px] text-[#9aa0a6] mb-2 font-sans">[Output]</div>
                        
                        {/* Interactive Pipeline Steps */}
                        <div className="mb-4">
                          <div className="text-[#9cdcfe] font-semibold mb-1">Preprocessing Sequence:</div>
                          <div className="space-y-1 text-slate-300">
                            {(paper.pipelineStages || [
                              'Data Imbalance Correction',
                              'Feature Standardization',
                              'Ensemble learning model training'
                            ]).map((stage, sIdx) => (
                              <div key={sIdx} className="flex items-center gap-2">
                                <span className="text-neutral-500 font-sans">{sIdx + 1}.</span>
                                <span>{stage}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Metrics Table */}
                        <div className="overflow-x-auto max-w-full">
                          <table className="min-w-full text-left font-mono border-collapse">
                            <thead>
                              <tr className="border-b border-[#2d2d2d]">
                                <th className="p-2 text-[#9cdcfe] font-sans font-medium text-[10px] uppercase tracking-wider">Evaluation Marker</th>
                                <th className="p-2 text-right text-[#9cdcfe] font-sans font-medium text-[10px] uppercase tracking-wider">Calculated Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paper.metrics.map((metric, idx) => (
                                <tr key={idx} className="border-b border-[#2d2d2d] hover:bg-[#252526]">
                                  <td className="p-2 text-[#d4d4d4] font-medium">{metric.label}</td>
                                  <td className="p-2 text-right text-[#f9ab00] font-bold">{metric.value}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-3 text-emerald-400 font-semibold">[INFO] Selected Model: {paper.bestModel || 'AdaBoost Classifier'} (Optimal Performance)</div>
                      </div>
                    )}
                  </div>

                  {/* CODE CELL 4 - Authors & Publication */}
                  <div className={`bg-[#1e1e1e] rounded-lg overflow-hidden border transition-all ${focusedCellId === visualKey ? 'border-[#1a73e8] shadow-md' : 'border-[#2d2d2d]'}`} onClick={() => setFocusedCellId(visualKey)}>
                    <div className="bg-[#2d2d2d] px-3 py-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <button onClick={(e) => { e.stopPropagation(); handleRunCell(visualKey); }} disabled={kernelState === 'busy'} className="p-1 hover:bg-[#3c3c3c] rounded transition">
                            {activeRunningId === visualKey ? <div className="w-3.5 h-3.5 border-2 border-[#f9ab00] border-t-transparent rounded-full animate-spin" /> : <Play className="w-3.5 h-3.5 text-[#9aa0a6]" />}
                          </button>
                          <span className="text-[10px] font-mono text-[#9aa0a6]">[{executionIndexes[visualKey] !== undefined ? executionIndexes[visualKey] : ' '}]</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#9aa0a6]">Code</span>
                      </div>
                    </div>
                    <div className="p-4 font-mono text-[12px] bg-[#1e1e1e] overflow-x-auto select-text custom-scrollbar space-y-0.5 border-l-2 border-[#1a73e8]">
                      {generateVisualCellCode(paper).split('\n').map((line, idx) => (
                        <div key={idx} className="flex gap-4 hover:bg-[#252526] rounded-sm px-1 leading-snug">
                          <span className="text-neutral-600 select-none text-[10px] text-right w-5 inline-block font-sans">{idx + 1}</span>
                          <span className="flex-1 whitespace-pre">{colorizePythonLine(line)}</span>
                        </div>
                      ))}
                    </div>
                    
                    {cellOutputsVisible[visualKey] && (
                      <div className="border-t border-[#2d2d2d] bg-[#1e1e1e] p-4 text-[11px] font-mono space-y-4">
                        <div className="text-[10px] text-[#9aa0a6] mb-1 font-sans">[Output]</div>
                        
                        {/* Interactive Console Simulation of python standard outputs */}
                        {/* Highly professional, codish and polished publication visual tracker panel */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                          
                          {/* Codish Authors Panel */}
                          <div className="bg-[#181818] rounded border border-[#2d2d2d] p-3 text-slate-300 font-mono">
                            <div className="flex items-center justify-between border-b border-[#2d2d2d]/60 pb-1.5 mb-2.5">
                              <div className="flex items-center gap-1.5 text-slate-200 font-medium font-sans text-xs">
                                {/* <Brain className="w-3.5 h-3.5 text-[#f9ab00] shrink-0" /> */}
                               <span className="text-[#4ec9b0] font-semibold">Research Authors</span>
                              </div>
                              <span className="text-[10px] text-neutral-500 bg-[#252526] px-1.5 py-0.5 rounded font-mono">Array[{(paper.authors || ['Sanjib Bayen']).length}]</span>
                            </div>
                            
                            <div className="space-y-1 pl-1 text-[11px] font-mono leading-relaxed select-text">
                              <div><span className="text-purple-400">authors</span>: <span className="text-blue-400">list</span>[<span className="text-teal-400">str</span>] = [</div>
                              {(paper.authors || ['Sanjib Bayen']).map((author, idx) => (
                            <div key={idx} className="text-[#9cdcfe] pl-4 font-mono">[Author] {author}</div>
                          ))}
                              <div>]</div>
                            </div>
                          </div>

                          {/* Codish Publication Details Panel */}
                          <div className="bg-[#181818] rounded border border-[#2d2d2d] p-3 text-slate-300 font-mono">
                            <div className="flex items-center gap-1.5 text-slate-200 font-medium mb-2.5 border-b border-[#2d2d2d]/60 pb-1.5 font-sans text-xs">
                              {/* <FileText className="w-3.5 h-3.5 text-[#4ec9b0] shrink-0" /> */}
                              <span className="text-[#4ec9b0] font-semibold ">Publication Details</span>
                            </div>
                            <div className="space-y-2.5 text-[11px] pl-1 font-mono">
                              <div className="leading-relaxed">
                                <span className="text-[#569cd6]">journal</span>: <span className="text-teal-400">string</span> = <span className="text-[#ce9178]">"{paper.journal || 'Under Peer Review'}"</span>
                              </div>
                              <div className="leading-relaxed">
                                <span className="text-[#569cd6]">digital_object_identifier</span>: <span className="text-neutral-400">Optional</span>[<span className="text-teal-400">str</span>] = {paper.doi ? (
                                  <a href={paper.doi} target="_blank" rel="noopener noreferrer" className="text-[#4ec9b0] hover:underline underline-offset-2 hover:text-[#4ec9b0]/80">
                                    <span className="text-[#ce9178]">"{paper.doi}"</span>
                                  </a>
                                ) : (
                                  <span className="text-[#569cd6]">None</span>
                                )}
                              </div>
                              <div className="leading-relaxed flex items-center gap-1.5 flex-wrap">
                                <span className="text-[#569cd6]">status</span>: <span className="text-teal-400">str</span> = <span className={`text-[10px] px-1.5 py-px rounded font-mono ${
                                  paper.status === 'Completed' ? 'bg-green-950/40 text-green-400 border border-green-900/30' : 'bg-blue-950/40 text-blue-400 border border-blue-900/30'
                                }`}>"{paper.status.toUpperCase()}"</span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>

                  {/* RESOURCES CELL */}
                  <div className="bg-[#252526] rounded-lg overflow-hidden border border-[#2d2d2d]">
                    <div className="bg-[#2d2d2d] px-3 py-1.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-[#9aa0a6]">[ ]</span>
                        <span className="text-[10px] font-mono text-[#9aa0a6]">Resources</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-4">
                      {/* Technologies Section */}
                      <div className="space-y-2">
                        {/* <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200 uppercase tracking-widest font-sans">
                          <Cpu className="w-3.5 h-3.5 text-[#4ec9b0]" />
                          <span>Technology Stack</span>
                        </div> */}
                        <div className="flex flex-wrap gap-1.5">
                          {paper.technologies.map((tech, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-[#1e1e1e] border border-[#2d2d2d] rounded text-[10px] font-mono text-[#9cdcfe] select-all">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Links Section */}
                      {paper.links && paper.links.length > 0 && (
                        <div className="pt-3 border-t border-[#2d2d2d]/60">
                          {/* <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#f9ab00] uppercase tracking-widest font-sans">
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>External Links</span>
                          </div> */}
                          <div className="flex flex-wrap gap-2">
                            {paper.links.map((link, idx) => (
                              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1 bg-[#1e1e1e] border border-[#2d2d2d] rounded text-[11px] text-[#f9ab00] hover:border-[#f9ab00] transition font-mono hover:text-white">
                                <ExternalLink className="w-3 h-3 text-[#f9ab00]" /> {link.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
