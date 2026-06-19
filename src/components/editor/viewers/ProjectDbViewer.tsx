/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Activity, 
  Filter,
  Cpu,
  X,
  Github,
  Globe,
  BookOpen,
  FileJson,
  AlertCircle,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
  Award,
  Terminal,
  Grid,
  Zap,
  Code,
  Database,
  Shield,
  HardDrive,
  Table,
  Key,
  Lock,
  RefreshCw,
  Server,
  ChevronRight,
  FolderTree,
  BarChart3,
  Briefcase,
  Eye,
  ArrowLeft,
  MoreHorizontal,
  Clock,
  GitBranch,
  Star,
  Users,
  Package,
  Settings,
  PlayCircle,
  Upload,
  Download,
  Radio,
  Wifi,
  Signal,
  Info,
  Link,
  Cpu as CpuIcon,
} from 'lucide-react';
import { VSCodeTheme } from '@/types';
import { Project, PROJECTS_DATA } from '@/features/projects';
import { toast } from '@/shared/utils/toast';

interface ProjectDbViewerProps {
  theme: VSCodeTheme;
  content: string;
  triggerTerminalSimulate?: (msg: string) => void;
}

// ─── Color Helpers ─────────────────────────────────────────────

const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex || hex.length < 7) return `rgba(30, 30, 46, ${alpha})`;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const adjustColor = (hex: string, amount: number): string => {
  if (!hex || hex.length < 7) return '#313244';
  const num = parseInt(hex.slice(1), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
};

export default function ProjectDbViewer({ theme, content, triggerTerminalSimulate }: ProjectDbViewerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedProject, setSelectedProjectState] = useState<Project | null>(null);
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [limitCount, setLimitCount] = useState<number>(20);
  const [activeProjectTab, setActiveProjectTab] = useState<'overview' | 'technical' | 'metrics' | 'api'>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  // ─── Theme-Derived Colors ────────────────────────────────────
  
  const C = {
    // Oracle brand colors (keep these)
    orange: '#f97316',
    orangeLight: '#fb923c',
    orangeBg: 'rgba(249, 115, 22, 0.1)',
    orangeBorder: 'rgba(249, 115, 22, 0.3)',
    orangeHover: 'rgba(249, 115, 22, 0.2)',
    
    // Theme-derived colors
    bg: theme.panelBg,
    bgSecondary: adjustColor(theme.panelBg, 5),
    bgTertiary: adjustColor(theme.panelBg, 10),
    border: hexToRgba(theme.activeBorder, 0.15),
    borderLight: hexToRgba(theme.activeBorder, 0.08),
    text: theme.textColor,
    textSecondary: hexToRgba(theme.textColor, 0.6),
    textMuted: hexToRgba(theme.textColor, 0.4),
    textDim: hexToRgba(theme.textColor, 0.25),
    accent: theme.activeBorder,
    accentBg: hexToRgba(theme.activeBorder, 0.1),
    accentBorder: hexToRgba(theme.activeBorder, 0.2),
    hover: hexToRgba(theme.textColor, 0.06),
    hoverStrong: hexToRgba(theme.textColor, 0.12),
    
    // Status colors (keep vibrant)
    emerald: '#4ade80',
    emeraldBg: 'rgba(74, 222, 128, 0.1)',
    emeraldBorder: 'rgba(74, 222, 128, 0.2)',
    amber: '#fbbf24',
    amberBg: 'rgba(251, 191, 36, 0.1)',
    blue: '#60a5fa',
    blueBg: 'rgba(96, 165, 250, 0.1)',
    purple: '#c084fc',
    purpleBg: 'rgba(192, 132, 252, 0.08)',
    yellow: '#fde047',
    yellowBg: 'rgba(253, 224, 71, 0.1)',
    red: '#f87171',
  };

  const setSelectedProject = (proj: Project | null) => {
    setSelectedProjectState(proj);
    setActiveProjectTab('overview');
  };

  const filteredProjects = useMemo(() => {
    let result = [...PROJECTS_DATA];

    if (filterQuery.trim()) {
      const query = filterQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.summary.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.techStack.some(tech => tech.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== 'ALL') {
      result = result.filter(p => p.category.toUpperCase() === selectedCategory);
    }

    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'id') comparison = a.id - b.id;
      else if (sortField === 'name') comparison = a.name.localeCompare(b.name);
      else if (sortField === 'status') comparison = a.status.localeCompare(b.status);
      else if (sortField === 'category') comparison = a.category.localeCompare(b.category);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    if (limitCount > 0 && result.length > limitCount) {
      result = result.slice(0, limitCount);
    }

    return result;
  }, [filterQuery, selectedCategory, sortField, sortOrder, limitCount]);

  React.useEffect(() => {
    try {
      const savedId = localStorage.getItem('selectedProjectId');
      if (savedId) {
        const projectId = parseInt(savedId, 10);
        const matchedProj = PROJECTS_DATA.find(p => p.id === projectId);
        if (matchedProj) {
          setSelectedProject(matchedProj);
        }
        localStorage.removeItem('selectedProjectId');
      }
    } catch (e) {
      console.warn("Storage unreachable:", e);
    }
  }, []);

  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'DEPLOYED':
        return (
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-400 text-[9px] font-bold font-mono tracking-wide">ACTIVE</span>
          </div>
        );
      case 'PRIVATE':
        return (
          <div className="flex items-center gap-1.5">
            <Lock className="w-2.5 h-2.5 text-blue-400" />
            <span className="text-blue-400 text-[9px] font-bold font-mono tracking-wide">PRIVATE</span>
          </div>
        );
      case 'IN_PROGRESS':
        return (
          <div className="flex items-center gap-1.5">
            <Activity className="w-2.5 h-2.5 text-amber-400" />
            <span className="text-amber-400 text-[9px] font-bold font-mono tracking-wide">DEVELOPMENT</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5">
            <Clock className="w-2.5 h-2.5" style={{ color: C.textMuted }} />
            <span className="text-[9px] font-bold font-mono tracking-wide" style={{ color: C.textMuted }}>STAGED</span>
          </div>
        );
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toUpperCase()) {
      case 'PERSONAL PROJECT': return <CpuIcon className="w-3 h-3" />;
      case 'WORKS': return <Briefcase className="w-3 h-3" />;
      default: return <Database className="w-3 h-3" />;
    }
  };

  const clearAllFilters = () => {
    setFilterQuery('');
    setSelectedCategory('ALL');
    setSortField('id');
    setSortOrder('asc');
    setLimitCount(20);
  };

  const goBackToList = () => {
    setSelectedProject(null);
  };

  return (
    <div 
      className="flex-1 w-full h-full flex flex-col font-sans overflow-hidden select-text text-left relative"
      style={{ backgroundColor: C.bg, color: C.text }}
    >
      
      {/* ═══════════════════════════════════════════════════════ */}
      {/* TOP HEADER - Oracle IDE Theme */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div 
        className="px-4 py-2 flex items-center justify-between shrink-0 border-b"
        style={{ backgroundColor: C.bgSecondary, borderColor: C.border }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-7 h-7 rounded-md flex items-center justify-center shadow-md"
              style={{ background: `linear-gradient(135deg, ${C.orange}, #ea580c)`, boxShadow: `0 0 12px ${C.orangeBg}` }}
            >
              <Database className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold font-mono tracking-wide" style={{ color: C.text }}>
                Portfolio_db.Projects
              </span>
            </div>
          </div>
          <div className="h-4 w-px" style={{ backgroundColor: C.border }} />
          <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: C.textSecondary }}>
            <Server className="w-3 h-3" />
            <span>oracle:1521/ORCLPDP</span>
          </div>
          <div className="h-4 w-px" style={{ backgroundColor: C.border }} />
          <div className="flex items-center gap-1.5 text-[10px] font-mono" style={{ color: C.textSecondary }}>
            <Shield className="w-3 h-3" />
            <span>sanjib_bayen</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-[9px] font-mono" style={{ color: C.textSecondary }}>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" style={{ boxShadow: '0 0 6px rgba(74, 222, 128, 0.5)' }} />
            <span className="tracking-wide">READ-WRITE</span>
          </div>
          <div className="h-3 w-px" style={{ backgroundColor: C.border }} />
          <div className="flex items-center gap-1">
            <Package className="w-3 h-3" />
            <span>Oracle 23C</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* MAIN CONTAINER */}
      {/* ═══════════════════════════════════════════════════════ */}
      <div className="flex-1 w-full flex overflow-hidden">
        
        {/* LEFT SIDEBAR */}
        <div 
          className="flex flex-col shrink-0 transition-all duration-200 border-r"
          style={{ 
            backgroundColor: C.bgSecondary, 
            borderColor: C.border,
            width: sidebarCollapsed ? '36px' : '224px'
          }}
        >
          <div className="p-1.5 flex items-center justify-between" style={{ borderColor: C.border }}>
            {!sidebarCollapsed && (
              <div className="flex items-center gap-1">
                <FolderTree className="w-3 h-3" style={{ color: C.orange }} />
                <span className="text-[8px] font-mono font-bold uppercase tracking-wider" style={{ color: C.orange }}>SCHEMA</span>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-0.5 rounded transition cursor-pointer"
              style={{ color: C.textSecondary }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.hoverStrong; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <ChevronRight className={`w-3 h-3 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {!sidebarCollapsed && (
            <div className="flex-1 overflow-y-auto p-1.5 space-y-2 text-[9px] font-mono">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 px-1 py-0.5" style={{ color: C.accent }}>
                  <Table className="w-3 h-3" />
                  <span>Tables (12)</span>
                </div>
                <div className="pl-4 space-y-0.5">
                  <div 
                    className="flex items-center gap-1.5 px-1 py-0.5 rounded"
                    style={{ color: C.emerald, backgroundColor: C.emeraldBg }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.emerald }} />
                    <span>PROJECTS</span>
                    <span className="text-[7px] ml-auto" style={{ color: C.textMuted }}>{PROJECTS_DATA.length}</span>
                  </div>
                  <div 
                    className="flex items-center gap-1.5 px-1 py-0.5 cursor-pointer"
                    style={{ color: C.textMuted }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = C.text; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.textMuted }} />
                    <span>USERS</span>
                  </div>
                  <div 
                    className="flex items-center gap-1.5 px-1 py-0.5 cursor-pointer"
                    style={{ color: C.textMuted }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = C.text; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = C.textMuted; }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.textMuted }} />
                    <span>AUDIT_LOG</span>
                  </div>
                </div>
              </div>
              <div className="space-y-0.5 pt-2 border-t" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-1 px-1 py-0.5" style={{ color: C.textMuted }}>
                  <Key className="w-3 h-3" />
                  <span>Sequences</span>
                </div>
                <div className="flex items-center gap-1 px-1 py-0.5" style={{ color: C.textMuted }}>
                  <Package className="w-3 h-3" />
                  <span>Packages</span>
                </div>
                <div className="flex items-center gap-1 px-1 py-0.5" style={{ color: C.textMuted }}>
                  <Terminal className="w-3 h-3" />
                  <span>Procedures</span>
                </div>
              </div>
            </div>
          )}
          
          {!sidebarCollapsed && (
            <div className="p-1.5 border-t" style={{ borderColor: C.border }}>
              <div className="flex items-center justify-center gap-1.5 text-[8px] font-mono" style={{ color: C.textMuted }}>
                <Signal className="w-2.5 h-2.5" style={{ color: C.emerald }} />
                <span>Oracle 23C</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden" style={{ backgroundColor: C.bg }}>
          
          {/* ═══════════════════════════════════════════════════════ */}
          {/* QUERY/FILTER BAR */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div 
            className="p-2 flex flex-col space-y-2 shrink-0 border-b"
            style={{ backgroundColor: C.bgSecondary, borderColor: C.border }}
          >
            <div className="flex items-center gap-2">
              <div 
                className="flex items-center gap-1.5 px-2 py-1 rounded border"
                style={{ 
                  color: C.orange, 
                  backgroundColor: C.orangeBg, 
                  borderColor: C.orangeBorder 
                }}
              >
                <Terminal className="w-3 h-3" />
                <span className="text-[9px] font-mono font-bold">SQL&gt;</span>
              </div>
              <div 
                className="flex-1 flex items-center gap-2 rounded px-3 py-1.5 border transition-colors"
                style={{ 
                  backgroundColor: C.bg, 
                  borderColor: C.border,
                }}
              >
                <Search className="w-3.5 h-3.5" style={{ color: C.textMuted }} />
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="WHERE name LIKE '%...%' OR category = 'AI'"
                  className="flex-1 bg-transparent border-0 outline-none text-[10px] font-mono"
                  style={{ color: C.text }}
                />
              </div>
              
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="px-2 py-1.5 rounded text-[9px] font-mono cursor-pointer outline-none border"
                style={{ 
                  backgroundColor: C.bg, 
                  borderColor: C.border, 
                  color: C.text 
                }}
              >
                <option value="id">ORDER BY ID</option>
                <option value="name">ORDER BY NAME</option>
                <option value="category">ORDER BY CATEGORY</option>
                <option value="status">ORDER BY STATUS</option>
              </select>
              
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="px-2 py-1.5 rounded text-[9px] font-mono cursor-pointer outline-none border"
                style={{ 
                  backgroundColor: C.bg, 
                  borderColor: C.border, 
                  color: C.text 
                }}
              >
                <option value="asc">ASC</option>
                <option value="desc">DESC</option>
              </select>
              
              <input
                type="number"
                value={limitCount}
                onChange={(e) => setLimitCount(parseInt(e.target.value, 10) || 20)}
                min={1}
                max={50}
                placeholder="ROWNUM"
                className="w-16 px-2 py-1.5 rounded text-[9px] font-mono outline-none text-center border"
                style={{ 
                  backgroundColor: C.bg, 
                  borderColor: C.border, 
                  color: C.text 
                }}
              />
              
              <button
                onClick={clearAllFilters}
                className="px-3 py-1.5 font-mono text-[9px] rounded transition border"
                style={{ 
                  backgroundColor: C.hoverStrong, 
                  color: C.text, 
                  borderColor: C.border 
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.hover; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.hoverStrong; }}
              >
                RESET
              </button>
              
              <button
                onClick={() => {
                  let sql = "SELECT * FROM PROJECTS";
                  const clauses: string[] = [];
                  if (selectedCategory !== 'ALL') {
                    clauses.push(`category = '${selectedCategory}'`);
                  }
                  if (filterQuery.trim()) {
                    clauses.push(`name LIKE '%${filterQuery.trim()}%'`);
                  }
                  if (clauses.length > 0) {
                    sql += " WHERE " + clauses.join(" AND ");
                  }
                  sql += ` ORDER BY ${sortField.toUpperCase()} ${sortOrder.toUpperCase()}`;
                  if (limitCount < 20) {
                    sql += ` LIMIT ${limitCount}`;
                  }
                  sql += ";";

                  const sqliteCommand = `sqlite3 portfolio.db "${sql}"`;
                  if (triggerTerminalSimulate) {
                    triggerTerminalSimulate(sqliteCommand);
                  } else {
                    toast.success(`Executed virtual query: ${sqliteCommand}`);
                  }
                }}
                className="px-3 py-1.5 font-mono text-[9px] font-bold rounded transition border flex items-center gap-1"
                style={{ 
                  color: C.orange, 
                  backgroundColor: C.orangeBg, 
                  borderColor: C.orangeBorder 
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.orangeHover; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.orangeBg; }}
              >
                <PlayCircle className="w-3 h-3" />
                RUN
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="flex items-center gap-1">
                  <Filter className="w-2.5 h-2.5" style={{ color: C.textMuted }} />
                  <span className="text-[7px] font-mono font-bold uppercase tracking-wider" style={{ color: C.textMuted }}>CATEGORY:</span>
                </div>
                {['ALL', 'PERSONAL PROJECT', 'WORKS'].map((cat) => {
                  const isActive = selectedCategory === cat.toUpperCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat.toUpperCase());
                        if (cat === 'ALL') setFilterQuery('');
                      }}
                      className="px-1.5 py-0.5 rounded text-[7px] font-mono border transition cursor-pointer"
                      style={isActive 
                        ? { 
                            backgroundColor: C.orangeBg, 
                            borderColor: C.orangeBorder, 
                            color: C.orange, 
                            fontWeight: 'bold' 
                          }
                        : { 
                            backgroundColor: C.bg, 
                            borderColor: C.border, 
                            color: C.textMuted 
                          }
                      }
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = C.text;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.color = C.textMuted;
                        }
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
              
              <div className="flex items-center gap-2 text-[8px] font-mono" style={{ color: C.textMuted }}>
                <div className="flex items-center gap-1">
                  <Radio className="w-2.5 h-2.5" style={{ color: C.emerald }} />
                  <span>FETCHED</span>
                </div>
                <span style={{ color: C.orange, fontWeight: 'bold' }}>{filteredProjects.length}</span>
                <span>row(s) in 0.012 sec</span>
              </div>
            </div>

            <div 
              className="px-2 py-1 rounded border text-[8px] font-mono flex items-center gap-2 overflow-x-auto"
              style={{ backgroundColor: C.bg, borderColor: C.border, color: C.textMuted }}
            >
              <span className="shrink-0" style={{ color: C.orange }}>SQL&gt;</span>
              <span className="whitespace-nowrap">SELECT * FROM PROJECTS</span>
              {filterQuery && <span className="whitespace-nowrap" style={{ color: C.emerald }}>WHERE {filterQuery}</span>}
              {selectedCategory !== 'ALL' && <span className="whitespace-nowrap" style={{ color: C.emerald }}>AND CATEGORY = '{selectedCategory}'</span>}
              <span className="whitespace-nowrap">ORDER BY {sortField} {sortOrder}</span>
              {limitCount < 50 && <span className="whitespace-nowrap">FETCH FIRST {limitCount} ROWS ONLY</span>}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* CONTENT AREA */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div className="flex-1 overflow-auto custom-scrollbar">
            
            {selectedProject ? (
              /* DETAIL VIEW */
              <div className="h-full flex flex-col">
                <div 
                  className="px-4 py-2 flex items-center gap-3 sticky top-0 z-10 border-b"
                  style={{ backgroundColor: C.bgSecondary, borderColor: C.border }}
                >
                  <button
                    onClick={goBackToList}
                    className="flex items-center gap-1.5 px-2 py-1 rounded text-[9px] font-mono transition border"
                    style={{ backgroundColor: C.hoverStrong, color: C.text, borderColor: C.border }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.hover; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.hoverStrong; }}
                  >
                    <ArrowLeft className="w-3 h-3" />
                    BACK
                  </button>
                  <div className="h-4 w-px" style={{ backgroundColor: C.border }} />
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-5 h-5 rounded flex items-center justify-center border"
                      style={{ backgroundColor: C.orangeBg, borderColor: C.orangeBorder }}
                    >
                      <Database className="w-3 h-3" style={{ color: C.orange }} />
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color: C.text }}>{selectedProject.name}</span>
                    {getStatusBadge(selectedProject.status)}
                  </div>
                </div>

                <div className="flex px-4 gap-1 border-b" style={{ backgroundColor: C.bgSecondary, borderColor: C.border }}>
                  {['overview', 'technical', ...(selectedProject.metrics && Object.keys(selectedProject.metrics).length > 0 ? ['metrics'] : []), ...(selectedProject.apiEndpoints && selectedProject.apiEndpoints.length > 0 ? ['api'] : [])].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveProjectTab(tab as any)}
                      className="px-3 py-2 text-[9px] font-bold font-mono uppercase tracking-wider transition relative"
                      style={{
                        color: activeProjectTab === tab ? C.orange : C.textMuted,
                        borderBottom: activeProjectTab === tab ? `2px solid ${C.orange}` : '2px solid transparent'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  
                  {activeProjectTab === 'overview' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: C.bgSecondary, borderColor: C.border }}>
                          <div 
                            className="px-3 py-2 border-b text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-2"
                            style={{ backgroundColor: hexToRgba(C.bgTertiary, 0.3), borderColor: C.border, color: C.orange }}
                          >
                            <Info className="w-3 h-3" />
                            BASIC INFORMATION
                          </div>
                          <div className="p-3 space-y-2.5">
                            {[
                              ['PROJECT_ID', `#${selectedProject.id}`, C.yellow],
                              ['CATEGORY', selectedProject.category, C.emerald],
                              ['TIMELINE', `${selectedProject.startDate} → ${selectedProject.endDate || 'Present'}`, C.text],
                            ].map(([label, value, color]) => (
                              <div key={label} className="flex justify-between items-center text-[10px]">
                                <span className="font-mono" style={{ color: C.textMuted }}>{label}</span>
                                <span className="font-mono font-bold" style={{ color }}>{value}</span>
                              </div>
                            ))}
                            <div className="flex justify-between items-center text-[10px]">
                              <span className="font-mono" style={{ color: C.textMuted }}>STATUS</span>
                              <div>{getStatusBadge(selectedProject.status)}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: C.bgSecondary, borderColor: C.border }}>
                          <div 
                            className="px-3 py-2 border-b text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-2"
                            style={{ backgroundColor: hexToRgba(C.bgTertiary, 0.3), borderColor: C.border, color: C.orange }}
                          >
                            <FileJson className="w-3 h-3" />
                            DESCRIPTION
                          </div>
                          <div className="p-3">
                            <p className="text-[10px] leading-relaxed" style={{ color: C.text }}>{selectedProject.description}</p>
                          </div>
                        </div>
                      </div>

                      {selectedProject.architectureDiagram && (
                        <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: C.bgSecondary, borderColor: C.border }}>
                          <div 
                            className="px-3 py-2 border-b text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-2"
                            style={{ backgroundColor: hexToRgba(C.bgTertiary, 0.3), borderColor: C.border, color: C.purple }}
                          >
                            <Layers className="w-3 h-3" />
                            SYSTEM ARCHITECTURE
                          </div>
                          <div className="p-3">
                            <pre className="text-[8px] font-mono overflow-x-auto whitespace-pre-wrap" style={{ color: '#94e2d5' }}>
                              {selectedProject.architectureDiagram.trim()}
                            </pre>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {activeProjectTab === 'technical' && (
                    <div className="space-y-4">
                      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: C.bgSecondary, borderColor: C.border }}>
                        <div 
                          className="px-3 py-2 border-b text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-2"
                          style={{ backgroundColor: hexToRgba(C.bgTertiary, 0.3), borderColor: C.border, color: C.orange }}
                        >
                          <Cpu className="w-3 h-3" />
                          TECH STACK
                        </div>
                        <div className="p-3 flex flex-wrap gap-1.5">
                          {selectedProject.techStack.map((tech, idx) => (
                            <span 
                              key={idx} 
                              className="text-[8px] font-mono px-1.5 py-0.5 rounded border"
                              style={{ backgroundColor: C.bg, borderColor: C.border, color: C.emerald }}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: C.bgSecondary, borderColor: C.border }}>
                        <div 
                          className="px-3 py-2 border-b text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-2"
                          style={{ backgroundColor: hexToRgba(C.bgTertiary, 0.3), borderColor: C.border, color: C.orange }}
                        >
                          <Terminal className="w-3 h-3" />
                          DEVELOPMENT LOGS
                        </div>
                        <div className="p-3 space-y-1.5">
                          {selectedProject.screenshots && selectedProject.screenshots.length > 0 ? (
                            selectedProject.screenshots.map((shot, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-[9px] font-mono" style={{ color: C.text }}>
                                <CheckCircle2 className="w-2.5 h-2.5 mt-0.5 shrink-0" style={{ color: C.emerald }} />
                                <span>{shot}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-[9px]" style={{ color: C.textMuted }}>No development logs available</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resources Section */}
                  <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: C.bgSecondary, borderColor: C.border }}>
                    <div 
                      className="px-3 py-2 border-b text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-2"
                      style={{ backgroundColor: hexToRgba(C.bgTertiary, 0.3), borderColor: C.border, color: C.orange }}
                    >
                      <Link className="w-3 h-3" />
                      EXTERNAL RESOURCES
                    </div>
                    <div className="p-3 flex flex-wrap gap-2">
                      {selectedProject.githubUrl && (
                        <a href={selectedProject.githubUrl} target="_blank" rel="noopener noreferrer" 
                          className="flex items-center gap-1.5 px-2 py-1 rounded text-[8px] border transition"
                          style={{ backgroundColor: C.bg, borderColor: C.border, color: C.text }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.orange; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
                        >
                          <Github className="w-3 h-3" /> GitHub
                        </a>
                      )}
                      {selectedProject.liveDemoUrl && (
                        <a href={selectedProject.liveDemoUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-2 py-1 rounded text-[8px] border transition"
                          style={{ backgroundColor: C.bg, borderColor: C.border, color: C.emerald }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.emerald; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
                        >
                          <Globe className="w-3 h-3" /> Live Demo
                        </a>
                      )}
                      {selectedProject.documentationUrl && (
                        <a href={selectedProject.documentationUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-2 py-1 rounded text-[8px] border transition"
                          style={{ backgroundColor: C.bg, borderColor: C.border, color: C.yellow }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = C.yellow; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = C.border; }}
                        >
                          <BookOpen className="w-3 h-3" /> Documentation
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* TABLE VIEW */
              <div className="p-3">
                {filteredProjects.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Database className="w-12 h-12 mb-3" style={{ color: C.textDim }} />
                    <span className="text-[10px] font-mono" style={{ color: C.textMuted }}>No records found</span>
                    <button 
                      onClick={clearAllFilters} 
                      className="mt-2 px-3 py-1 rounded text-[8px] font-mono border"
                      style={{ backgroundColor: C.hoverStrong, color: C.text, borderColor: C.border }}
                    >
                      RESET FILTERS
                    </button>
                  </div>
                ) : (
                  <div className="space-y-0.5">
                    <div 
                      className="grid grid-cols-12 gap-2 px-3 py-2 border rounded-t-md text-[8px] font-mono font-bold uppercase tracking-wider"
                      style={{ backgroundColor: C.bgSecondary, borderColor: C.border, color: C.textMuted }}
                    >
                      <div className="col-span-1">ID</div>
                      <div className="col-span-3">PROJECT NAME</div>
                      <div className="col-span-2">CATEGORY</div>
                      <div className="col-span-3">TECH STACK</div>
                      <div className="col-span-2">STATUS</div>
                      <div className="col-span-1 text-center">DETAILS</div>
                    </div>

                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="grid grid-cols-12 gap-2 px-3 py-2.5 border-x border-b text-[9px] font-mono transition duration-150 cursor-pointer group relative overflow-hidden"
                        style={{ borderColor: C.border }}
                        onClick={() => setSelectedProject(project)}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.hover; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-0.5 scale-y-0 group-hover:scale-y-100 transition-transform duration-150 origin-center" style={{ backgroundColor: C.orange }} />
                        
                        <div className="col-span-1 font-semibold transition pl-1.5 flex items-center" style={{ color: C.orange }}>#{project.id}</div>
                        <div className="col-span-3 font-medium truncate transition flex items-center" style={{ color: C.text }}>{project.name}</div>
                        <div className="col-span-2 flex items-center">
                          <span 
                            className="flex items-center gap-1.5 text-[8px] px-2 py-0.5 rounded border font-bold uppercase"
                            style={{ backgroundColor: C.purpleBg, borderColor: hexToRgba(C.purple, 0.1), color: C.purple }}
                          >
                             {/*  {getCategoryIcon(project.category)} */}
                            {project.category}
                          </span>
                        </div>
                        <div className="col-span-3 text-[8px] truncate flex items-center gap-1.5">
                          {project.techStack.slice(0, 3).map((tech, tIdx) => (
                            <span 
                              key={tIdx} 
                              className="px-1.5 py-0.5 rounded border text-[7px]"
                              style={{ backgroundColor: C.bg, borderColor: hexToRgba(C.emerald, 0.1), color: C.emerald }}
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 3 && <span className="text-[7.5px] font-bold" style={{ color: C.textMuted }}>+{project.techStack.length - 3}</span>}
                        </div>
                        <div className="col-span-2 flex items-center">{getStatusBadge(project.status)}</div>
                        <div className="col-span-1 flex items-center justify-center">
                          <Eye className="w-3.5 h-3.5 transition transform group-hover:scale-110" style={{ color: C.textMuted }} />
                        </div>
                      </div>
                    ))}

                    <div 
                      className="px-3 py-2 border rounded-b-md text-[8px] font-mono flex justify-between items-center"
                      style={{ backgroundColor: C.bgSecondary, borderColor: C.border, color: C.textMuted }}
                    >
                      <div className="flex items-center gap-3">
                        <span>Rows 1-{filteredProjects.length} of {PROJECTS_DATA.length}</span>
                        <div className="h-3 w-px" style={{ backgroundColor: C.border }} />
                        <span>Commit point: 0</span>
                        <div className="h-3 w-px" style={{ backgroundColor: C.border }} />
                        <span>Autocommit: OFF</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <RefreshCw className="w-2.5 h-2.5" />
                        <span>Fetched at {new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}