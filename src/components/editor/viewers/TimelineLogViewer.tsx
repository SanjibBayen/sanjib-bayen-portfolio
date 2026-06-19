/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * VS Code Terminal-Style Achievement Log Viewer
 * Professional log viewer with Raw Log & Parsed views
 */

import React, { useState, useMemo, useRef } from 'react';
import { 
  Terminal, 
  Search, 
  X,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Users,
  Hash,
  TrendingUp,
  Award,
  Copy,
  Check,
  FileText,
  LayoutList,
  ScrollText,
} from 'lucide-react';
import { VSCodeTheme } from '@/types';
import { Achievement, achievementsData } from '@/features/about';

interface TimelineLogViewerProps {
  theme: VSCodeTheme;
  content: string;
}

// ─── Color Helpers ─────────────────────────────────────────────

const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex || hex.length < 7) return `rgba(30, 30, 30, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const adjustColor = (hex: string, amount: number): string => {
  if (!hex || hex.length < 7) return '#333333';
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
};

// ─── Constants ─────────────────────────────────────────────────

const LEVEL_COLORS: Record<string, string> = {
  hackathon: '#fbbf24',
  certification: '#4ade80',
  publication: '#c084fc',
  competition: '#f97316',
  rank: '#38bdf8',
  project: '#f472b6',
  milestone: '#a78bfa',
  research: '#60a5fa',
};

const getLevelColor = (category: string): string => {
  return LEVEL_COLORS[category] || '#60a5fa';
};

const formatLogLine = (achievement: Achievement): string => {
  const date = achievement.timestamp.split(' ')[0];
  const time = achievement.timestamp.split(' ')[1] || '00:00:00';
  return `[${date} ${time}] [${achievement.category.toUpperCase()}] ${achievement.title} - ${achievement.description}`;
};

// ─── Component ─────────────────────────────────────────────────

export default function TimelineLogViewer({ theme, content }: TimelineLogViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [showRawLog, setShowRawLog] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // ─── Theme-Derived Colors ────────────────────────────────────
  
  const C = {
    bg: theme.panelBg,
    bgSecondary: adjustColor(theme.panelBg, 3),
    bgTertiary: adjustColor(theme.panelBg, 6),
    border: hexToRgba(theme.activeBorder, 0.15),
    borderLight: hexToRgba(theme.activeBorder, 0.08),
    text: theme.textColor,
    textSecondary: hexToRgba(theme.textColor, 0.65),
    textMuted: hexToRgba(theme.textColor, 0.4),
    textDim: hexToRgba(theme.textColor, 0.2),
    accent: theme.activeBorder,
    accentBg: hexToRgba(theme.activeBorder, 0.08),
    hover: hexToRgba(theme.textColor, 0.04),
    hoverStrong: hexToRgba(theme.textColor, 0.08),
    inputBg: adjustColor(theme.panelBg, 6),
    inputBorder: hexToRgba(theme.activeBorder, 0.2),
    inputFocus: theme.activeBorder,
    
    // Terminal syntax colors (keep these for log view authenticity)
    syntaxGreen: '#b5cea8',
    syntaxBlue: '#9cdcfe',
    syntaxCyan: '#4ec9b0',
    syntaxPurple: '#c586c0',
    syntaxOrange: '#ce9178',
    syntaxPink: '#d16969',
  };

  // ─── Derived Data ────────────────────────────────────────────

  const yearsList = useMemo(() => {
    const years = new Set<string>();
    achievementsData.forEach(item => {
      const year = item.date.split('-')[0];
      if (year) years.add(year);
    });
    return Array.from(years).sort((a, b) => b.localeCompare(a));
  }, []);

  const levels = ['ALL', 'HACKATHON', 'CERTIFICATION', 'PUBLICATION', 'COMPETITION', 'RANK', 'PROJECT', 'MILESTONE', 'RESEARCH'];

  const filteredAchievements = useMemo(() => {
    let result = [...achievementsData];

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.metadata?.organization || '').toLowerCase().includes(query)
      );
    }

    if (selectedLevel !== 'ALL') {
      result = result.filter(item => item.category.toUpperCase() === selectedLevel);
    }

    if (selectedYear !== 'ALL') {
      result = result.filter(item => item.date.startsWith(selectedYear));
    }

    return result.sort((a, b) => b.date.localeCompare(a.date));
  }, [searchTerm, selectedLevel, selectedYear]);

  // ─── Stats ───────────────────────────────────────────────────

  const stats = useMemo(() => ({
    total: achievementsData.length,
    filtered: filteredAchievements.length,
    certifications: achievementsData.filter(a => a.category === 'certification').length,
    hackathons: achievementsData.filter(a => a.category === 'hackathon').length,
    publications: achievementsData.filter(a => a.category === 'publication').length,
    ranks: achievementsData.filter(a => a.category === 'rank').length,
    research: achievementsData.filter(a => a.category === 'research').length,
  }), [filteredAchievements.length]);

  // ─── Handlers ────────────────────────────────────────────────

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyLine = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLevel('ALL');
    setSelectedYear('ALL');
  };

  const hasActiveFilters = searchTerm || selectedLevel !== 'ALL' || selectedYear !== 'ALL';

  // ─── Render ──────────────────────────────────────────────────

  return (
    <div 
      className="flex-1 w-full h-full flex flex-col font-mono text-left select-text overflow-hidden relative"
      style={{ backgroundColor: C.bg, color: C.text }}
    >
      
      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: ${hexToRgba(theme.textColor, 0.15)}; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: ${hexToRgba(theme.textColor, 0.25)}; }
        .custom-scrollbar::-webkit-scrollbar-corner { background: transparent; }
        
        .log-line:hover { background-color: ${C.hoverStrong} !important; }
        .log-line:hover .copy-btn { opacity: 1 !important; }
        
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(-2px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-entry {
          animation: fadeSlide 0.15s ease-out;
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HEADER BAR */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div 
        className="flex items-center justify-between px-3 py-1.5 shrink-0 border-b"
        style={{ backgroundColor: C.bgSecondary, borderColor: C.border }}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5" style={{ color: C.textSecondary }} />
          <span className="text-[11px] font-semibold tracking-wide" style={{ color: C.text }}>
            ACHIEVEMENTS.LOG
          </span>
          <span className="text-[10px]" style={{ color: C.textMuted }}>
            — {stats.filtered} of {stats.total} entries
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div 
            className="flex rounded overflow-hidden text-[9px] border"
            style={{ borderColor: C.border }}
          >
            <button
              onClick={() => setShowRawLog(true)}
              className="px-2 py-1 transition font-mono flex items-center gap-1"
              style={{
                backgroundColor: showRawLog ? C.accentBg : 'transparent',
                color: showRawLog ? C.accent : C.textMuted,
                borderRight: `1px solid ${C.border}`,
              }}
            >
              <ScrollText className="w-3 h-3" />
              RAW LOG
            </button>
            <button
              onClick={() => setShowRawLog(false)}
              className="px-2 py-1 transition font-mono flex items-center gap-1"
              style={{
                backgroundColor: !showRawLog ? C.accentBg : 'transparent',
                color: !showRawLog ? C.accent : C.textMuted,
              }}
            >
              <LayoutList className="w-3 h-3" />
              PARSED
            </button>
          </div>

          <span className="text-[9px]" style={{ color: C.textDim }}>
            UTF-8 | LF | zsh
          </span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FILTER BAR */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div 
        className="flex items-center gap-2 px-3 py-1.5 shrink-0 border-b"
        style={{ backgroundColor: C.bgSecondary, borderColor: C.borderLight }}
      >
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3 h-3 absolute left-2 top-1/2 -translate-y-1/2" style={{ color: C.textMuted }} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter (e.g., hackathon, space, certification)..."
            className="w-full pl-7 pr-3 py-1 rounded text-[10px] font-mono outline-none border transition-colors"
            style={{
              backgroundColor: C.inputBg,
              borderColor: C.inputBorder,
              color: C.text,
            }}
            onFocus={(e) => { e.target.style.borderColor = C.inputFocus; }}
            onBlur={(e) => { e.target.style.borderColor = C.inputBorder; }}
          />
        </div>

        {/* Level Filter */}
        <select
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
          className="px-2 py-1 rounded text-[10px] font-mono outline-none border cursor-pointer"
          style={{
            backgroundColor: C.inputBg,
            borderColor: C.inputBorder,
            color: C.text,
          }}
        >
          {levels.map(level => (
            <option key={level} value={level}>
              {level === 'ALL' ? 'All Levels' : level}
            </option>
          ))}
        </select>

        {/* Year Filter */}
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="px-2 py-1 rounded text-[10px] font-mono outline-none border cursor-pointer"
          style={{
            backgroundColor: C.inputBg,
            borderColor: C.inputBorder,
            color: C.text,
          }}
        >
          <option value="ALL">All Years</option>
          {yearsList.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-mono transition border"
            style={{ color: C.textMuted, borderColor: C.border }}
            onMouseEnter={(e) => { e.currentTarget.style.color = C.text; e.currentTarget.style.borderColor = C.textSecondary; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.borderColor = C.border; }}
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto custom-scrollbar"
      >
        <div className="p-4">
          
          {/* Terminal Prompt */}
         

          {showRawLog ? (
            /* ═══════════════════════════════════════════════════ */
            /* RAW LOG VIEW */
            /* ═══════════════════════════════════════════════════ */
            <div className="overflow-x-auto custom-scrollbar w-full pb-2">
              <div className="min-w-max space-y-0.5 font-mono">
                
                {/* Begin Reading Marker */}
                <div className="text-[10px] mb-2 select-none flex items-center gap-2" style={{ color: C.textDim }}>
                  <span style={{ color: C.syntaxBlue, fontWeight: 'bold' }}>▶</span>
                  <span>--- BEGIN READING achievements.log ---</span>
                </div>

                {filteredAchievements.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <FileText className="w-10 h-10 mb-3" style={{ color: C.textDim }} />
                    <p className="text-[11px] font-mono" style={{ color: C.textMuted }}>
                      No log entries match your filters
                    </p>
                    <button
                      onClick={clearFilters}
                      className="mt-2 px-3 py-1 rounded text-[10px] font-mono transition border"
                      style={{ color: C.accent, borderColor: C.border }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.accentBg; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  filteredAchievements.map((item, idx) => {
                    const logLine = formatLogLine(item);
                    const isCopied = copiedId === item.id;
                    const levelColor = getLevelColor(item.category);

                    return (
                      <div 
                        key={item.id}
                        className="log-line group flex items-center gap-4 py-0.5 px-2 rounded text-[11px] cursor-pointer transition-colors whitespace-nowrap animate-entry"
                        style={{ backgroundColor: 'transparent' }}
                        onClick={() => toggleExpand(item.id)}
                      >
                        {/* Line Number */}
                        <div className="flex items-center shrink-0 select-none w-12 justify-end border-r pr-3.5" style={{ color: C.textDim, borderColor: C.borderLight }}>
                          <span>{idx + 1}</span>
                        </div>

                        {/* Log Content */}
                        <div className="flex items-center gap-2 font-mono flex-1 min-w-0">
                          <span style={{ color: C.textMuted }}>[</span>
                          <span style={{ color: C.syntaxGreen }}>{item.timestamp}</span>
                          <span style={{ color: C.textMuted }}>]</span>

                          <span style={{ color: C.textMuted }}>[</span>
                          <span style={{ color: levelColor, fontWeight: 'bold' }}>
                            {item.category.toUpperCase().padEnd(13)}
                          </span>
                          <span style={{ color: C.textMuted }}>]</span>

                          <span style={{ color: C.text }} className="font-medium group-hover:font-bold transition-all">
                            {item.title}
                          </span>
                          <span className="select-none px-1" style={{ color: C.textDim }}>|</span>
                          <span style={{ color: C.syntaxBlue }} className="truncate">
                            {item.description}
                          </span>
                        </div>

                        {/* Copy Button */}
                        <button
                          onClick={(e) => { e.stopPropagation(); copyLine(logLine, item.id); }}
                          className="copy-btn shrink-0 opacity-0 px-2 py-0.5 rounded text-[9px] font-mono transition-all border"
                          style={{ 
                            color: isCopied ? '#4ade80' : C.textMuted, 
                            borderColor: isCopied ? hexToRgba('#4ade80', 0.3) : C.border,
                            backgroundColor: isCopied ? hexToRgba('#4ade80', 0.08) : 'transparent',
                          }}
                        >
                          {isCopied ? (
                            <span className="flex items-center gap-1"><Check className="w-2.5 h-2.5" /> Copied</span>
                          ) : 'COPY'}
                        </button>

                        {/* Expand Icon */}
                        <div className="shrink-0 w-4">
                          {expandedItems.has(item.id) ? (
                            <ChevronDown className="w-3 h-3" style={{ color: C.textSecondary }} />
                          ) : (
                            <ChevronRight className="w-3 h-3" style={{ color: C.textDim }} />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}

                {/* End of File Marker */}
                {filteredAchievements.length > 0 && (
                  <div className="text-[10px] mt-3 select-none flex items-center gap-2" style={{ color: C.textDim }}>
                    <span style={{ color: C.syntaxPurple, fontWeight: 'bold' }}>▲</span>
                    <span>--- END OF FILE: {stats.filtered} of {stats.total} entries shown ---</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ═══════════════════════════════════════════════════ */
            /* PARSED VIEW - Table Layout */
            /* ═══════════════════════════════════════════════════ */
            <div className="space-y-0 border rounded overflow-hidden" style={{ borderColor: C.border }}>
              
              {/* Table Header */}
              <div 
                className="px-3 py-2 flex items-center gap-4 text-[9px] font-mono font-bold uppercase tracking-wider select-none border-b"
                style={{ backgroundColor: C.bgSecondary, borderColor: C.border, color: C.textMuted }}
              >
                <span className="w-24 shrink-0">TIMESTAMP</span>
                <span className="w-28 shrink-0">LEVEL</span>
                <span className="flex-1">ENTRY</span>
                <span className="w-16 text-right shrink-0">DETAILS</span>
              </div>
              
              {/* Table Rows */}
              {filteredAchievements.length === 0 ? (
                <div className="px-3 py-12 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: C.textDim }} />
                  <p className="text-[11px] font-mono" style={{ color: C.textMuted }}>
                    No log entries match your filters
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-2 px-3 py-1 rounded text-[10px] font-mono transition border"
                    style={{ color: C.accent, borderColor: C.border }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.accentBg; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                filteredAchievements.map((item, idx) => {
                  const isExpanded = expandedItems.has(item.id);
                  const levelColor = getLevelColor(item.category);
                  const isLast = idx === filteredAchievements.length - 1;
                  
                  return (
                    <div key={item.id} className="animate-entry">
                      {/* Row */}
                      <div 
                        className={`group px-3 py-2 flex items-center gap-4 text-[10px] font-mono cursor-pointer transition-colors ${!isLast ? 'border-b' : ''}`}
                        style={{ borderColor: C.borderLight }}
                        onClick={() => toggleExpand(item.id)}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.hover; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {/* Timestamp */}
                        <span className="w-24 shrink-0" style={{ color: C.textMuted }}>
                          {item.timestamp.split(' ')[0]}
                        </span>

                        {/* Level Badge */}
                        <span 
                          className="w-28 shrink-0 text-[8px] font-bold font-mono px-1.5 py-0.5 rounded uppercase tracking-wider text-center"
                          style={{ 
                            color: levelColor, 
                            backgroundColor: hexToRgba(levelColor, 0.1),
                            border: `1px solid ${hexToRgba(levelColor, 0.2)}`,
                          }}
                        >
                          {item.category}
                        </span>

                        {/* Title */}
                        <span className="flex-1 truncate font-medium" style={{ color: C.text }}>
                          {item.title}
                        </span>

                        {/* Expand + Rank */}
                        <div className="w-16 flex items-center justify-end gap-2 shrink-0">
                          {item.metadata?.rank && (
                            <span className="text-[8px] font-bold" style={{ color: levelColor }}>
                              {item.metadata.rank}
                            </span>
                          )}
                          {isExpanded ? (
                            <ChevronDown className="w-3 h-3" style={{ color: C.textSecondary }} />
                          ) : (
                            <ChevronRight className="w-3 h-3" style={{ color: C.textDim }} />
                          )}
                        </div>
                      </div>
                      
                      {/* Expanded Details */}
                      {isExpanded && (
                        <div 
                          className="px-3 py-3 border-b"
                          style={{ 
                            backgroundColor: C.bgSecondary, 
                            borderColor: C.borderLight,
                            borderLeft: `3px solid ${levelColor}`,
                            marginLeft: '0',
                          }}
                        >
                          <div className="ml-[12.5rem] space-y-2">
                            <p className="text-[10px] leading-relaxed" style={{ color: C.textSecondary }}>
                              {item.description}
                            </p>
                            
                            {(item.metadata?.organization || item.metadata?.credential || item.metadata?.score || item.metadata?.rank) && (
                              <div className="flex flex-wrap gap-3 pt-1 text-[9px] font-mono">
                                {item.metadata?.organization && (
                                  <div className="flex items-center gap-1.5" style={{ color: C.textMuted }}>
                                    <Users className="w-3 h-3" />
                                    <span>{item.metadata.organization}</span>
                                  </div>
                                )}
                                {item.metadata?.credential && (
                                  <div className="flex items-center gap-1.5" style={{ color: C.textMuted }}>
                                    <Hash className="w-3 h-3" />
                                    <span>{item.metadata.credential}</span>
                                  </div>
                                )}
                                {item.metadata?.score && (
                                  <div className="flex items-center gap-1.5" style={{ color: C.textMuted }}>
                                    <TrendingUp className="w-3 h-3" />
                                    <span>{item.metadata.score}</span>
                                  </div>
                                )}
                                {item.metadata?.rank && (
                                  <div className="flex items-center gap-1.5 font-bold" style={{ color: levelColor }}>
                                    <Award className="w-3 h-3" />
                                    <span>{item.metadata.rank}</span>
                                  </div>
                                )}
                              </div>
                            )}

                            {item.metadata?.link && (
                              <a
                                href={item.metadata.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 pt-1 text-[10px] hover:underline"
                                style={{ color: C.accent }}
                              >
                                <ExternalLink className="w-3 h-3" />
                                View Reference
                              </a>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* STATUS BAR / FOOTER */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div 
        className="flex items-center justify-between px-3 py-1 shrink-0 border-t text-[9px] font-mono"
        style={{ backgroundColor: C.bgSecondary, borderColor: C.border, color: C.textMuted }}
      >
        <div className="flex items-center gap-3">
          <span>📄 achievements.log</span>
          <span style={{ color: C.textDim }}>|</span>
          <span>{stats.filtered} of {stats.total} entries</span>
          <span style={{ color: C.textDim }}>|</span>
          <span>zsh</span>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Category indicators */}
          <div className="flex items-center gap-1" title="Certifications">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LEVEL_COLORS.certification }} />
            <span>{stats.certifications}</span>
          </div>
          <div className="flex items-center gap-1" title="Hackathons">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LEVEL_COLORS.hackathon }} />
            <span>{stats.hackathons}</span>
          </div>
          <div className="flex items-center gap-1" title="Publications">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LEVEL_COLORS.publication }} />
            <span>{stats.publications}</span>
          </div>
          <div className="flex items-center gap-1" title="Ranks">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LEVEL_COLORS.rank }} />
            <span>{stats.ranks}</span>
          </div>
          <div className="flex items-center gap-1" title="Research">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: LEVEL_COLORS.research }} />
            <span>{stats.research}</span>
          </div>
          <span style={{ color: C.textDim }}>|</span>
          <button
            onClick={() => setShowRawLog(!showRawLog)}
            className="hover:underline cursor-pointer"
            style={{ color: C.accent }}
          >
            {showRawLog ? 'Switch to Parsed' : 'Switch to Raw Log'}
          </button>
        </div>
      </div>
    </div>
  );
}