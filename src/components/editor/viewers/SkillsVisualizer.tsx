/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * SkillsVisualizer - Interactive tech stack dependency graph
 */

import React, { 
  useState, 
  useMemo, 
  useEffect, 
  useRef, 
  useCallback,
  memo,
  type KeyboardEvent,
  type WheelEvent
} from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Network, 
  Cpu, 
  Database, 
  Code2, 
  Layers, 
  Search, 
  Award, 
  Terminal, 
  Play, 
  Activity, 
  Sparkles,
  ChevronRight,
  Info,
  Copy,
  Check,
  Wrench,
  Settings,
  Radar,
  X,
  Trash2,
  Maximize2,
  Minimize2,
  HelpCircle
} from 'lucide-react';
import { techGraphNodes, techGraphLinks, type TechNode, type TechLink } from '@/features/skills';
import { PROJECTS_DATA, type Project } from '@/features/projects';

// ─── Constants ──────────────────────────────────────────────

const ZOOM = {
  MIN: 0.4,
  MAX: 2.0,
  STEP: 0.1,
  DEFAULT_ALL: 0.75,
  DEFAULT_FILTERED: 0.95,
} as const;

const LAYOUT = {
  NODE_WIDTH_ALL: 112,
  NODE_HEIGHT_ALL: 42,
  NODE_WIDTH_FILTERED: 136,
  NODE_HEIGHT_FILTERED: 58,
  PADDING_X: 25,
  PADDING_Y: 35,
  CELL_COLS: 3,
  CELL_ROWS: 2,
  COLLISION_ITERATIONS: 50,
  MIN_SPACING_X: 15,
  MIN_SPACING_Y: 10,
} as const;

const COLORS = {
  BACKGROUND: '#1e1e1e',
  PANEL_BG: '#181818',
  BORDER: '#2d2d2d',
  TEXT_PRIMARY: '#ffffff',
  TEXT_SECONDARY: '#858585',
  TEXT_DIM: '#a0a0a0',
  ACCENT: '#007acc',
  GREEN: '#27c93f',
  YELLOW: '#ffbd2e',
  RED: '#ff5f56',
} as const;

const CATEGORY_LAYOUT: readonly ('AI/ML' | 'Frontend' | 'Backend' | 'Database' | 'Core CS' | 'Tools')[] = [
  'AI/ML', 'Tools', 'Frontend',
  'Backend', 'Database', 'Core CS',
];

const CATEGORY_STYLES: Record<string, string> = {
  'AI/ML': '#3776AB',
  'Tools': '#FCC624',
  'Frontend': '#61DAFB',
  'Backend': '#44B78B',
  'Database': '#FFCA28',
  'Core CS': '#E91E63',
};

// ─── Type Definitions ──────────────────────────────────────

interface Coords {
  x: number;
  y: number;
}

interface CoordsMap {
  [key: string]: Coords;
}

interface DragState {
  nodeId: string;
  startClient: { clientX: number; clientY: number };
  distance: number;
}

interface NodeStyle {
  backgroundColor: string;
  borderColor: string;
  borderStyle: 'solid' | 'dashed';
  boxShadow: string;
  textColor: string;
  accentColor: string;
  opacity: number;
  signalPulse: boolean;
  isRelated: boolean;
}

// ─── Utility Functions ─────────────────────────────────────

const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex || hex.length < 4) return `rgba(0,0,0,${alpha})`;
  
  try {
    const cleanHex = hex.replace('#', '');
    let r = 0, g = 0, b = 0;
    
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0]! + cleanHex[0]!, 16);
      g = parseInt(cleanHex[1]! + cleanHex[1]!, 16);
      b = parseInt(cleanHex[2]! + cleanHex[2]!, 16);
    } else if (cleanHex.length >= 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }
    
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return `rgba(16, 185, 129, ${alpha})`; // Fallback green
  }
};

const clamp = (value: number, min: number, max: number): number => 
  Math.max(min, Math.min(max, value));

const resolveCollisions = (
  nodes: CoordsMap,
  nodeWidth: number,
  nodeHeight: number,
  minSpacingX: number,
  minSpacingY: number,
  iterations: number = LAYOUT.COLLISION_ITERATIONS,
  bounds?: { minX: number; maxX: number; minY: number; maxY: number }
): void => {
  const keys = Object.keys(nodes);
  const minDistanceX = nodeWidth + minSpacingX;
  const minDistanceY = nodeHeight + minSpacingY;
  
  for (let iter = 0; iter < iterations; iter++) {
    let shifted = false;
    
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const n1 = nodes[keys[i]!];
        const n2 = nodes[keys[j]!];
        if (!n1 || !n2) continue;
        
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);
        
        const overlapX = minDistanceX - absDx;
        const overlapY = minDistanceY - absDy;
        
        if (overlapX > 0 && overlapY > 0) {
          shifted = true;
          
          const pushX = dx === 0 ? (Math.random() > 0.5 ? 1 : -1) : Math.sign(dx);
          const pushY = dy === 0 ? (Math.random() > 0.5 ? 1 : -1) : Math.sign(dy);
          
          const pushAmountX = overlapX * 0.5;
          const pushAmountY = overlapY * 0.5;
          
          n1.x -= pushAmountX * pushX;
          n1.y -= pushAmountY * pushY;
          n2.x += pushAmountX * pushX;
          n2.y += pushAmountY * pushY;
        }
      }
    }
    
    // Contain nodes within bounds
    if (bounds) {
      for (const key of keys) {
        const node = nodes[key];
        if (node) {
          node.x = clamp(node.x, bounds.minX, bounds.maxX);
          node.y = clamp(node.y, bounds.minY, bounds.maxY);
        }
      }
    }
    
    if (!shifted) break;
  }
};

const computeDynamicCoords = (
  filter: string,
  containerWidth: number,
  containerHeight: number
): CoordsMap => {
  const updatedCoords: CoordsMap = {};
  const width = Math.max(containerWidth, 800);
  const height = Math.max(containerHeight, 400);
  
  if (filter === "All Stacks") {
    const { PADDING_X, PADDING_Y, CELL_COLS, CELL_ROWS, NODE_WIDTH_ALL, NODE_HEIGHT_ALL } = LAYOUT;
    const cols = CELL_COLS;
    const rows = CELL_ROWS;
    const safeRangeX = width - PADDING_X * 2;
    const safeRangeY = height - PADDING_Y * 2;
    const cellWidth = safeRangeX / cols;
    const cellHeight = safeRangeY / rows;
    
    // Group nodes by category
    const nodesByCategory: Record<string, string[]> = {};
    for (const cat of CATEGORY_LAYOUT) {
      nodesByCategory[cat] = [];
    }
    
    for (const [key, node] of Object.entries(techGraphNodes)) {
      const cat = node.category ?? 'Tools';
      if (nodesByCategory[cat]) {
        nodesByCategory[cat]!.push(key);
      } else {
        nodesByCategory['Tools']!.push(key);
      }
    }
    
    CATEGORY_LAYOUT.forEach((cat, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const centerX = PADDING_X + col * cellWidth + cellWidth / 2;
      const centerY = PADDING_Y + row * cellHeight + cellHeight / 2 + 25;
      
      const nodeKeys = nodesByCategory[cat] ?? [];
      const count = nodeKeys.length;
      
      if (count === 0) return;
      
      if (count === 1) {
        updatedCoords[nodeKeys[0]!] = { x: centerX, y: centerY };
      } else {
        const maxRadiusX = cellWidth * 0.42;
        const maxRadiusY = cellHeight * 0.32;
        
        nodeKeys.forEach((key, i) => {
          const radiusX = count > 6 
            ? (i % 2 === 0 ? maxRadiusX : maxRadiusX * 0.65) 
            : maxRadiusX * 0.82;
          const radiusY = count > 6 
            ? (i % 2 === 0 ? maxRadiusY : maxRadiusY * 0.65) 
            : maxRadiusY * 0.82;
          
          const angle = (i * 2 * Math.PI) / count - Math.PI / 2 + 0.15;
          const x = Math.round(centerX + radiusX * Math.cos(angle));
          const y = Math.round(centerY + radiusY * Math.sin(angle));
          updatedCoords[key] = { x, y };
        });
      }
      
      const cellBounds = {
        minX: PADDING_X + col * cellWidth + 15,
        maxX: PADDING_X + (col + 1) * cellWidth - 15,
        minY: PADDING_Y + row * cellHeight + 52,
        maxY: PADDING_Y + (row + 1) * cellHeight - 15,
      };
      
      const catCoords: CoordsMap = {};
      for (const k of nodeKeys) {
        if (updatedCoords[k]) {
          catCoords[k] = updatedCoords[k]!;
        }
      }
      
      resolveCollisions(catCoords, NODE_WIDTH_ALL, NODE_HEIGHT_ALL, LAYOUT.MIN_SPACING_X, LAYOUT.MIN_SPACING_Y, 45, cellBounds);
      
      for (const k of nodeKeys) {
        if (catCoords[k]) {
          updatedCoords[k] = catCoords[k]!;
        }
      }
    });
  } else {
    // Filtered view: polar arrangement
    const primaryKeys: string[] = [];
    const relatedSet = new Set<string>();
    
    for (const [key, node] of Object.entries(techGraphNodes)) {
      if (node.category === filter) {
        primaryKeys.push(key);
      }
    }
    
    const primarySet = new Set(primaryKeys);
    for (const link of techGraphLinks) {
      if (primarySet.has(link.source) && !primarySet.has(link.target)) {
        relatedSet.add(link.target);
      }
      if (primarySet.has(link.target) && !primarySet.has(link.source)) {
        relatedSet.add(link.source);
      }
    }
    
    const relatedKeys = Array.from(relatedSet);
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Position primary nodes in inner ring
    const np = primaryKeys.length;
    if (np > 0) {
      const innerRadius = Math.min(width * 0.22, height * 0.26);
      primaryKeys.forEach((key, i) => {
        const angle = (i * 2 * Math.PI) / np - Math.PI / 2;
        updatedCoords[key] = {
          x: Math.round(centerX + innerRadius * Math.cos(angle)),
          y: Math.round(centerY + innerRadius * Math.sin(angle)),
        };
      });
    }
    
    // Position related nodes in outer ring
    const nr = relatedKeys.length;
    if (nr > 0) {
      const outerRadius = Math.min(width * 0.42, height * 0.44);
      relatedKeys.forEach((key, i) => {
        const angle = (i * 2 * Math.PI) / nr + Math.PI / 4;
        updatedCoords[key] = {
          x: Math.round(centerX + outerRadius * Math.cos(angle)),
          y: Math.round(centerY + outerRadius * Math.sin(angle)),
        };
      });
    }
    
    // Hide unused nodes
    for (const key of Object.keys(techGraphNodes)) {
      if (!updatedCoords[key]) {
        updatedCoords[key] = { x: -1000, y: -1000 };
      }
    }
    
    // Resolve collisions for active nodes
    const activeKeys = [...primaryKeys, ...relatedKeys];
    const activeCoords: CoordsMap = {};
    for (const k of activeKeys) {
      if (updatedCoords[k]) {
        activeCoords[k] = updatedCoords[k]!;
      }
    }
    
    const viewBounds = {
      minX: 80,
      maxX: width - 80,
      minY: 80,
      maxY: height - 85,
    };
    
    resolveCollisions(activeCoords, LAYOUT.NODE_WIDTH_FILTERED, LAYOUT.NODE_HEIGHT_FILTERED, 25, 18, 50, viewBounds);
    
    for (const k of activeKeys) {
      if (activeCoords[k]) {
        updatedCoords[k] = activeCoords[k]!;
      }
    }
  }
  
  return updatedCoords;
};

// ─── Sub-components ────────────────────────────────────────

interface BreadcrumbProps {
  path?: string;
}

const Breadcrumb = memo(function Breadcrumb({ path = 'SkillsVisualizer.tsx' }: BreadcrumbProps) {
  return (
    <div className="hidden lg:flex items-center gap-1 font-mono text-[11px] text-[#a0a0a0]">
      <span>src</span>
      <ChevronRight className="w-3 h-3 text-[#555555]" />
      <span>components</span>
      <ChevronRight className="w-3 h-3 text-[#555555]" />
      <span>viewers</span>
      <ChevronRight className="w-3 h-3 text-[#555555]" />
      <span className="text-white hover:underline cursor-pointer">{path}</span>
    </div>
  );
});

interface StatsBarProps {
  nodeCount: number;
  linkCount: number;
}

const StatsBar = memo(function StatsBar({ nodeCount, linkCount }: StatsBarProps) {
  return (
    <div className="flex items-center gap-3 bg-[#252526]/85 px-3 py-1 rounded-md border border-[#2d2d2d] font-mono text-[11px]">
      <span className="text-sky-400 font-bold">{nodeCount} Nodes</span>
      <span className="text-[#444444]">|</span>
      <span className="text-emerald-400 font-bold">{linkCount} Links</span>
    </div>
  );
});

interface SimulationButtonProps {
  isSimulating: boolean;
  onClick: () => void;
}

const SimulationButton = memo(function SimulationButton({ isSimulating, onClick }: SimulationButtonProps) {
  return (
    <button 
      onClick={onClick}
      disabled={isSimulating}
      className={`px-3 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all outline-none select-none hover:scale-[1.02] ${
        isSimulating 
          ? 'bg-[#252526] text-[#666666] border border-[#2d2d2d] cursor-not-allowed'
          : 'bg-[#0e639c] hover:bg-[#1177bb] border border-[#1177bb]/50 text-white cursor-pointer shadow-md'
      }`}
    >
      <Play className={`w-3 h-3 ${isSimulating ? '' : 'fill-current animate-pulse'} text-white`} />
      <span>{isSimulating ? "Traced" : "Trace Graph"}</span>
    </button>
  );
});

interface CategoryTabProps {
  category: string;
  isActive: boolean;
  onClick: () => void;
  accentColor: string;
}

const CategoryTab = memo(function CategoryTab({ category, isActive, onClick, accentColor }: CategoryTabProps) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-2 text-[11.5px] font-mono font-medium flex items-center gap-1.5 border-r border-[#252526] transition-all outline-none whitespace-nowrap cursor-pointer ${
        isActive 
          ? 'bg-[#1e1e1e] text-white font-bold border-t border-t-[#007acc]' 
          : 'bg-[#2d2d2d]/30 text-[#858585] hover:text-[#cccccc] hover:bg-[#2d2d2d]/10'
      }`}
      style={{
        borderTopWidth: isActive ? '2px' : '0px',
        borderTopColor: '#007acc'
      }}
    >
      <div 
        className="w-2 h-2 rounded-full" 
        style={{ backgroundColor: isActive ? '#007acc' : accentColor }} 
      />
      <span>{category.toUpperCase()}</span>
      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#007acc] ml-1 shrink-0" />}
    </button>
  );
});

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchInput = memo(function SearchInput({ value, onChange }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && value) {
        onChange('');
        inputRef.current?.blur();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [value, onChange]);
  
  return (
    <div className="relative w-full md:w-56">
      <Search className="w-3.5 h-3.5 text-[#858585] absolute left-2.5 top-1/2 -translate-y-1/2" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search dependencies..."
        className="w-full bg-[#3c3c3c]/50 border border-[#3c3c3c] focus:border-[#007acc] rounded-sm pl-8 pr-3 py-1 text-[11.5px] text-white outline-none placeholder-[#858585] font-mono transition"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] hover:text-white text-[#858585] rounded font-mono px-1 bg-[#252526]/85 border border-neutral-700/50"
          title="Clear search (Esc)"
        >
          ESC
        </button>
      )}
    </div>
  );
});

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const ZoomControls = memo(function ZoomControls({ zoom, onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-1.5 bg-[#1a1a1a]/95 p-1.5 rounded-lg border border-[#2d2d2d] shadow-2xl z-20 select-none">
      <button
        onClick={onZoomIn}
        className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-[#2d2d2d] text-white rounded border border-[#3c3c3c] transition hover:scale-105 active:scale-95 cursor-pointer bg-[#252526]"
        title="Zoom In"
        aria-label="Zoom in"
      >
        +
      </button>
      
      <span className="text-[10px] text-[#858585] font-mono w-10 text-center select-none font-bold">
        {Math.round(zoom * 100)}%
      </span>
      
      <button
        onClick={onZoomOut}
        className="w-7 h-7 flex items-center justify-center text-xs font-bold hover:bg-[#2d2d2d] text-white rounded border border-[#3c3c3c] transition hover:scale-105 active:scale-95 cursor-pointer bg-[#252526]"
        title="Zoom Out"
        aria-label="Zoom out"
      >
        −
      </button>
      
      <div className="w-px h-4 bg-[#2d2d2d] mx-0.5" />
      
      <button
        onClick={onReset}
        className="px-2 h-7 text-[9px] font-mono font-bold hover:bg-[#2d2d2d] text-[#858585] hover:text-white rounded border border-[#3c3c3c] transition uppercase tracking-wider cursor-pointer bg-[#252526]"
        title="Reset Zoom"
      >
        Reset
      </button>
    </div>
  );
});

interface NodeCardProps {
  node: TechNode;
  coords: Coords;
  style: NodeStyle;
  isAllStacks: boolean;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const NodeCard = memo(function NodeCard({ 
  node, coords, style, isAllStacks, isSelected, onMouseDown, onMouseEnter, onMouseLeave 
}: NodeCardProps) {
  const nodeWidth = isAllStacks ? 'w-[112px]' : 'w-32 md:w-[136px]';
  const nodeHeight = isAllStacks ? 'h-[42px]' : 'h-[58px]';
  const padding = isAllStacks ? 'p-1.5' : 'p-2.5';
  const nameSize = isAllStacks ? 'text-[10px]' : 'text-[11.5px]';
  const typeSize = isAllStacks ? 'text-[7.5px]' : 'text-[8.5px]';
  const dotSize = isAllStacks ? 'w-[5px] h-[5px]' : 'w-[6px] h-[6px]';
  const signalSize = isAllStacks ? 'w-[3px] h-[3px]' : 'w-[4px] h-[4px]';
  
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute flex flex-col justify-between rounded-lg border cursor-grab select-none transition-all duration-300 z-20 ${nodeWidth} ${nodeHeight} ${padding} ${
        isSelected ? 'scale-105 z-30 shadow-2xl' : 'hover:scale-[1.03]'
      }`}
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        transform: 'translate(-50%, -50%)',
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        borderStyle: style.borderStyle,
        boxShadow: style.boxShadow,
        opacity: style.opacity,
      }}
      role="button"
      tabIndex={0}
      aria-label={`${node.name} - ${node.type}`}
    >
      <div className="flex items-center justify-between gap-1 w-full">
        <div className="flex items-center gap-1 truncate max-w-[85%] font-sans">
          <span 
            className={`rounded-full shrink-0 ${dotSize}`}
            style={{ backgroundColor: style.accentColor }}
          />
          <span 
            className={`font-bold tracking-wide font-mono leading-none truncate ${nameSize}`}
            style={{ color: style.textColor }}
          >
            {node.name}
          </span>
        </div>
        
        <span 
          className={`rounded-full shrink-0 ${signalSize} ${style.signalPulse ? 'animate-ping' : ''}`}
          style={{ backgroundColor: style.accentColor }}
        />
      </div>
      
      <div 
        className={`flex items-center text-[#858585] font-mono select-none ${typeSize}`}
        style={{ marginTop: isAllStacks ? '2px' : '6px' }}
      >
        <span className="uppercase tracking-wider truncate">{node.type}</span>
      </div>
    </div>
  );
});

// ─── Custom Hooks ──────────────────────────────────────────

function useContainerSize(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 800, height: 560 });
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
        setSize({ 
          width: entry.contentRect.width, 
          height: entry.contentRect.height 
        });
      }
    });
    
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef]);
  
  return size;
}

function useDragging(
  containerRef: React.RefObject<HTMLDivElement | null>,
  zoom: number,
  virtualW: number,
  virtualH: number,
  setCoords: React.Dispatch<React.SetStateAction<CoordsMap>>
) {
  const dragStateRef = useRef<DragState | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  
  const handleMouseDown = useCallback((nodeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggedNodeId(nodeId);
    dragStateRef.current = {
      nodeId,
      startClient: { clientX: e.clientX, clientY: e.clientY },
      distance: 0,
    };
  }, []);
  
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const dragState = dragStateRef.current;
    const container = containerRef.current;
    if (!dragState || !container) return;
    
    const dx = e.clientX - dragState.startClient.clientX;
    const dy = e.clientY - dragState.startClient.clientY;
    dragState.distance += Math.hypot(dx, dy);
    dragState.startClient = { clientX: e.clientX, clientY: e.clientY };
    
    const rect = container.getBoundingClientRect();
    const offsetX = (e.clientX - rect.left - rect.width / 2) / zoom;
    const offsetY = (e.clientY - rect.top - rect.height / 2) / zoom;
    
    const scaledX = Math.round(virtualW / 2 + offsetX);
    const scaledY = Math.round(virtualH / 2 + offsetY);
    
    const boundedX = clamp(scaledX, 50, virtualW - 50);
    const boundedY = clamp(scaledY, 50, virtualH - 50);
    
    setCoords(prev => ({
      ...prev,
      [dragState.nodeId]: { x: boundedX, y: boundedY },
    }));
  }, [containerRef, zoom, virtualW, virtualH, setCoords]);
  
  const handleMouseUp = useCallback((): string | null => {
    if (dragStateRef.current && dragStateRef.current.distance < 5) {
      return dragStateRef.current.nodeId;
    }
    return null;
  }, []);
  
  const resetDrag = useCallback(() => {
    setDraggedNodeId(null);
    dragStateRef.current = null;
  }, []);
  
  return {
    draggedNodeId,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    resetDrag,
  };
}

function useSimulation(triggerTerminalSimulate?: (msg: string) => void) {
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const runSimulation = useCallback(() => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    setProgress(0);
    triggerTerminalSimulate?.("diagnose");
    
    let step = 0;
    const interval = setInterval(() => {
      step += 10;
      setProgress(step);
      if (step >= 100) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 150);
    
    return () => clearInterval(interval);
  }, [isSimulating, triggerTerminalSimulate]);
  
  return { isSimulating, progress, runSimulation };
}

// ─── Main Component ────────────────────────────────────────

interface SkillsVisualizerProps {
  activePath?: string;
  content: string;
  triggerTerminalSimulate?: (msg: string) => void;
  openFile?: (path: string) => void;
}

export default function SkillsVisualizer({ 
  activePath, 
  content, 
  triggerTerminalSimulate,
  openFile 
}: SkillsVisualizerProps) {
  // ─── State ─────────────────────────────────────────────
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>("All Stacks");
  const [coords, setCoords] = useState<CoordsMap>({});
  const [zoom, setZoom] = useState<number>(ZOOM.DEFAULT_ALL); //  explicit number type
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerSimulateRef = useRef(triggerTerminalSimulate);
  
  useEffect(() => {
    triggerSimulateRef.current = triggerTerminalSimulate;
  }, [triggerTerminalSimulate]);
  
  // ─── Custom Hooks ──────────────────────────────────────
  const containerSize = useContainerSize(containerRef);
  const { isSimulating, progress, runSimulation } = useSimulation(triggerTerminalSimulate);
  
  const virtualW = useMemo(() => {
    return Math.max(containerSize.width, activeFilter === "All Stacks" ? 1150 : 1000);
  }, [containerSize.width, activeFilter]);

  const virtualH = useMemo(() => {
    return Math.max(containerSize.height, activeFilter === "All Stacks" ? 640 : 540);
  }, [containerSize.height, activeFilter]);

  const { draggedNodeId, handleMouseDown, handleMouseMove, handleMouseUp, resetDrag } = useDragging(
    containerRef, zoom, virtualW, virtualH, setCoords
  );
  
  // ─── Derived Data ──────────────────────────────────────
  const categoriesList = useMemo(() => {
    const catsSet = new Set<string>();
    for (const node of Object.values(techGraphNodes)) {
      if (node.category) catsSet.add(node.category);
    }
    return ["All Stacks", ...Array.from(catsSet)];
  }, []);
  
  // Validate active filter
  useEffect(() => {
    if (!categoriesList.includes(activeFilter)) {
      setActiveFilter("All Stacks");
    }
  }, [categoriesList, activeFilter]);
  
  // Update layout when filter or container size changes
  useEffect(() => {
    setZoom(activeFilter === "All Stacks" ? ZOOM.DEFAULT_ALL : ZOOM.DEFAULT_FILTERED);
    const updatedCoords = computeDynamicCoords(activeFilter, virtualW, virtualH);
    setCoords(updatedCoords);
  }, [activeFilter, virtualW, virtualH]);
  
  // Filter nodes based on search and category
  const filteredNodes = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    
    const matchingNodes = Object.values(techGraphNodes).filter(node => {
      if (!searchLower) return true;
      return node.name.toLowerCase().includes(searchLower) || 
             node.id.toLowerCase().includes(searchLower) ||
             node.description.toLowerCase().includes(searchLower);
    });
    
    if (activeFilter === "All Stacks") return matchingNodes;
    
    const primaryNodeIds = new Set(
      matchingNodes
        .filter(node => node.category === activeFilter)
        .map(node => node.id)
    );
    
    const relatedNodeIds = new Set<string>();
    for (const link of techGraphLinks) {
      if (primaryNodeIds.has(link.source) && !primaryNodeIds.has(link.target)) {
        relatedNodeIds.add(link.target);
      }
      if (primaryNodeIds.has(link.target) && !primaryNodeIds.has(link.source)) {
        relatedNodeIds.add(link.source);
      }
    }
    
    return matchingNodes.filter(node => 
      node.category === activeFilter || relatedNodeIds.has(node.id)
    );
  }, [searchQuery, activeFilter]);
  
  // Filter links
  const filteredLinks = useMemo(() => {
    const activeNodeIds = new Set(filteredNodes.map(n => n.id));
    return techGraphLinks.filter(link => 
      activeNodeIds.has(link.source) && activeNodeIds.has(link.target)
    );
  }, [filteredNodes]);
  
  // Selected node details
  const activeNodeDetails = useMemo(() => {
    if (!selectedNodeId) return null;
    return techGraphNodes[selectedNodeId] ?? null;
  }, [selectedNodeId]);
  
  // Matching projects
  const matchingProjects = useMemo(() => {
    if (!activeNodeDetails) return [];
    
    const nodeIdLower = activeNodeDetails.id.toLowerCase();
    const nodeNameLower = activeNodeDetails.name.toLowerCase();
    
    const aliasMap: Record<string, string[]> = {
      "scikit": ["scikit-learn", "sklearn"],
      "react": ["react.js", "react"],
      "nextjs": ["next.js", "nextjs"],
      "tailwind": ["tailwind", "tailwindcss"],
      "nodejs": ["node.js", "nodejs", "node"],
      "expressjs": ["express.js", "expressjs", "express"],
      "firestore": ["firebase", "firestore"],
      "git": ["git", "github", "git & github"],
      "jupyter": ["jupyter", "jupyter notebooks"],
      "cpp": ["c++", "cpp"],
    };
    
    const targets = [nodeIdLower, nodeNameLower, ...(aliasMap[nodeIdLower] ?? [])];
    
    return PROJECTS_DATA.filter(project => {
      const inTechStack = project.techStack.some(tech => {
        const techLower = tech.toLowerCase();
        return targets.some(target => techLower.includes(target) || target.includes(techLower));
      });
      if (inTechStack) return true;
      
      const textToSearch = `${project.name} ${project.summary} ${project.description} ${(project.screenshots ?? []).join(' ')}`.toLowerCase();
      return targets.some(target => textToSearch.includes(target));
    });
  }, [activeNodeDetails]);
  
  // ─── Event Handlers ────────────────────────────────────
  
  const handleMouseUpOrLeave = useCallback(() => {
    const clickedNodeId = handleMouseUp();
    if (clickedNodeId) {
      setSelectedNodeId(clickedNodeId);
    }
    resetDrag();
  }, [handleMouseUp, resetDrag]);
  
  const handleNodeHover = useCallback((nodeId: string | null) => {
    setHoveredNodeId(nodeId);
  }, []);
  
  const handleProjectClick = useCallback((project: Project) => {
    try {
      localStorage.setItem('selectedProjectId', project.id.toString());
    } catch {
      console.warn("Storage unreachable");
    }
    openFile?.('projects/portfolio.db');
  }, [openFile]);
  
  const copyCodeToClipboard = useCallback((code: string) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  }, []);
  
  // Auto-inspect in terminal when node selected
  useEffect(() => {
    if (!selectedNodeId) return;
    const node = techGraphNodes[selectedNodeId];
    if (node && triggerSimulateRef.current) {
      triggerSimulateRef.current(`inspect ${node.id}`);
    }
  }, [selectedNodeId]);
  
  // Wheel zoom support
  const handleWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey) {
      e.preventDefault();
      setZoom((prev: number) => clamp(
        prev + (e.deltaY > 0 ? -ZOOM.STEP : ZOOM.STEP),
        ZOOM.MIN,
        ZOOM.MAX
      ));
    }
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNodeId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // ─── Zoom handlers ─────────────────────────────────────
  
  const handleZoomIn = useCallback(() => {
    setZoom((prev: number) => clamp(prev + ZOOM.STEP, ZOOM.MIN, ZOOM.MAX));
  }, []);
  
  const handleZoomOut = useCallback(() => {
    setZoom((prev: number) => clamp(prev - ZOOM.STEP, ZOOM.MIN, ZOOM.MAX));
  }, []);
  
  const handleZoomReset = useCallback(() => {
    setZoom(activeFilter === "All Stacks" ? ZOOM.DEFAULT_ALL : ZOOM.DEFAULT_FILTERED);
  }, [activeFilter]);
  
  // ─── Render Helpers ────────────────────────────────────
  
  const getNodeStyle = useCallback((node: TechNode): NodeStyle => {
    const isSelected = selectedNodeId === node.id;
    const isHovered = hoveredNodeId === node.id;
    const brandingColor = node.color || '#10b981';
    const isRelated = activeFilter !== "All Stacks" && node.category !== activeFilter;
    
    const glowColor = hexToRgba(brandingColor, 0.7);
    const innerGlow = hexToRgba(brandingColor, 0.35);
    
    return {
      backgroundColor: isRelated ? '#1c1c1d' : '#252526',
      borderColor: isRelated ? hexToRgba(brandingColor, 0.4) : brandingColor,
      borderStyle: isRelated ? 'dashed' : 'solid',
      boxShadow: (isSelected || isHovered)
        ? `0 0 12px ${glowColor}, inset 0 0 6px ${innerGlow}`
        : isRelated
          ? `0 0 2px ${hexToRgba(brandingColor, 0.05)}`
          : `0 0 4px ${hexToRgba(brandingColor, 0.2)}`,
      textColor: isRelated ? '#bebebe' : '#ffffff',
      accentColor: brandingColor,
      opacity: isRelated ? (isHovered || isSelected ? 1.0 : 0.7) : 1.0,
      signalPulse: isSelected || isHovered,
      isRelated,
    };
  }, [selectedNodeId, hoveredNodeId, activeFilter]);
  
  const renderLinkLine = useCallback((link: TechLink, idx: number) => {
    const sourceCoord = coords[link.source];
    const targetCoord = coords[link.target];
    if (!sourceCoord || !targetCoord) return null;
    
    const sourceNode = techGraphNodes[link.source];
    const sourceColor = sourceNode?.color || '#38bdf8';
    
    const isFocused = hoveredNodeId === link.source || 
                      hoveredNodeId === link.target ||
                      selectedNodeId === link.source || 
                      selectedNodeId === link.target;
    
    const x1 = sourceCoord.x;
    const y1 = sourceCoord.y;
    const x2 = targetCoord.x;
    const y2 = targetCoord.y;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const dist = Math.hypot(dx, dy) || 1;
    
    const isSameCategory = techGraphNodes[link.source]?.category === techGraphNodes[link.target]?.category;
    const bend = isSameCategory ? dist * 0.08 : dist * 0.18;
    
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const px = -dy / dist;
    const py = dx / dist;
    
    let cx = mx + px * bend;
    let cy = my + py * bend;
    
    // Manual overrides for specific problematic links
    const linkKey = `${link.source}->${link.target}`;
    const overrides: Record<string, { cx: number; cy: number }> = {
      'TypeScript->Nodejs': { cx: mx, cy: my - 120 },
      'SysDesign->REST APIs': { cx: mx, cy: my + 110 },
      'Jupyter->Python': { cx: mx - 45, cy: my - 55 },
      'Expressjs->Firebase': { cx: mx + 20, cy: my - 10 },
    };
    
    const override = overrides[linkKey];
    if (override) {
      cx = override.cx;
      cy = override.cy;
    }
    
    const pathData = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
    const strokeWidth = isFocused ? 2.5 : 1.5;
    
    return (
      <g key={`link-${idx}`}>
        {isFocused && (
          <path
            d={pathData}
            stroke={sourceColor}
            strokeWidth={strokeWidth + 5}
            strokeOpacity="0.25"
            strokeLinecap="round"
            fill="none"
          />
        )}
        
        <path
          d={pathData}
          stroke={sourceColor}
          strokeWidth={strokeWidth}
          strokeDasharray={link.type === 'hierarchical' ? 'none' : '4 4'}
          strokeOpacity={isFocused ? 0.9 : 0.45}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-300"
        />
        
        <circle r="3" fill={sourceColor}>
          <animateMotion
            dur={isSimulating ? "0.8s" : "3.5s"}
            repeatCount="indefinite"
            path={pathData}
          />
        </circle>
      </g>
    );
  }, [coords, hoveredNodeId, selectedNodeId, isSimulating]);
  
  // ─── Render ─────────────────────────────────────────────
  
  const isAllStacks = activeFilter === "All Stacks";
  const nodeCount = Object.keys(techGraphNodes).length;
  const linkCount = techGraphLinks.length;
  const gridPatternId = "editorGrid";
  
  return (
    <>
      {/* VS Code Header Panel */}
      <div className="bg-[#181818] border-b border-[#2d2d2d] px-4 py-2 shrink-0 flex items-center justify-between select-none z-10 text-[12px] text-[#cccccc]">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[#858585] hidden md:inline">sanjib_bayen_workspace</span>
          <span className="text-[#858585] hidden md:inline">/</span>
          <span className="font-mono text-white flex items-center gap-1.5 bg-[#252526] px-2.5 py-0.5 rounded border border-[#2d2d2d]">
            <Code2 className="w-3.5 h-3.5 text-sky-400" />
            <span>skills..pkt</span>
          </span>
        </div>
        
        <Breadcrumb />
        
        <div className="flex items-center gap-3">
          <StatsBar nodeCount={nodeCount} linkCount={linkCount} />
          <SimulationButton isSimulating={isSimulating} onClick={runSimulation} />
        </div>
      </div>
      
      {/* Category Tabs & Search */}
      <div className="bg-[#181818] border-b border-[#2d2d2d] shrink-0 flex flex-col md:flex-row items-stretch justify-between select-none z-10">
        <div className="flex items-end overflow-x-auto max-w-full custom-scrollbar scrollbar-none bg-[#181818] pl-2 pt-1">
          {categoriesList.map(category => {
            const accentColor = category === "All Stacks" 
              ? '#858585' 
              : (CATEGORY_STYLES[category] ?? '#858585');
            
            return (
              <CategoryTab
                key={category}
                category={category}
                isActive={activeFilter === category}
                onClick={() => setActiveFilter(category)}
                accentColor={accentColor}
              />
            );
          })}
        </div>
        
        <div className="p-1 px-3 flex items-center bg-[#181818] self-center w-full md:w-auto">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>
      
      {/* Graph Canvas */}
      <div className="flex-1 flex flex-col min-h-0 relative bg-[#1e1e1e]">
        <div className="flex-1 min-h-0 relative p-2 flex flex-col bg-[#1e1e1e] group select-none">
          <div className="flex items-center justify-between text-[10px] text-[#858585] font-mono select-none px-2 mb-1.5 pointer-events-none">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#007acc]" />
              <span>DEPENDENCY VISUALIZER GRAPH MAP</span>
            </span>
            {draggedNodeId ? (
              <span className="text-[#e2c08d] font-bold">DRAGGING: {draggedNodeId.toUpperCase()}</span>
            ) : (
              <span>INTERACTIVE MODE: ACTIVE</span>
            )}
          </div>
          
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onWheel={handleWheel}
            className="flex-1 w-full bg-[#1b1b1b] rounded border border-[#2d2d2d] overflow-hidden relative shadow-inner cursor-grab active:cursor-grabbing px-2"
            style={{ minHeight: '440px' }}
          >
            {/* Background Grid */}
            <div className="absolute inset-0 select-none pointer-events-none opacity-[0.25]">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id={gridPatternId} width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#3c3c3e" strokeWidth="0.8" />
                    <circle cx="0" cy="0" r="1.0" fill="#4c4c50" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${gridPatternId})`} />
              </svg>
            </div>
            
            {/* Zoomable Container */}
            <div 
              className="absolute transition-all duration-300 ease-out origin-center"
              style={{ 
                width: `${virtualW}px`,
                height: `${virtualH}px`,
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) scale(${zoom})`,
              }}
            >
              {/* Category Watermarks */}
              <div className="absolute inset-0 select-none pointer-events-none opacity-80 z-0">
                <svg 
                  width={virtualW} 
                  height={virtualH} 
                  viewBox={`0 0 ${virtualW} ${virtualH}`} 
                  className="w-full h-full"
                >
                  <g className="opacity-30 pointer-events-none">
                    {isAllStacks ? (
                      CATEGORY_LAYOUT.map((cat, i) => {
                        const col = i % LAYOUT.CELL_COLS;
                        const row = Math.floor(i / LAYOUT.CELL_COLS);
                        const cellW = (virtualW - LAYOUT.PADDING_X * 2) / LAYOUT.CELL_COLS;
                        const cellH = (virtualH - LAYOUT.PADDING_Y * 2) / LAYOUT.CELL_ROWS;
                        const cx = LAYOUT.PADDING_X + col * cellW + cellW / 2;
                        const cy = LAYOUT.PADDING_Y + row * cellH + 25;
                        const color = CATEGORY_STYLES[cat] ?? '#ffffff';
                        
                        return (
                          <g key={`wm-${i}`}>
                            <text x={cx} y={cy} textAnchor="middle" fill={color} fontSize="13" fontWeight="900" fontFamily="monospace" letterSpacing="1">
                              [{cat}]
                            </text>
                            <line x1={cx - 70} y1={cy + 8} x2={cx + 70} y2={cy + 8} stroke={color} strokeWidth="1.5" strokeOpacity="0.25" />
                          </g>
                        );
                      })
                    ) : (
                      <g>
                        <text 
                          x={virtualW / 2} 
                          y={virtualH / 2 - 15} 
                          fill="#ffffff" 
                          textAnchor="middle" 
                          fontSize="26" 
                          fontWeight="900" 
                          fontFamily="monospace" 
                          opacity="0.08" 
                          letterSpacing="4"
                        >
                          {activeFilter.toUpperCase()}
                        </text>
                        <text 
                          x={virtualW / 2} 
                          y={virtualH / 2 + 20} 
                          fill="#ffffff" 
                          textAnchor="middle" 
                          fontSize="16" 
                          fontWeight="900" 
                          fontFamily="monospace" 
                          opacity="0.06" 
                          letterSpacing="6"
                        >
                          STACK ENVIRONMENT
                        </text>
                      </g>
                    )}
                  </g>
                </svg>
              </div>
              
              {/* Connection Lines */}
              <svg 
                viewBox={`0 0 ${virtualW} ${virtualH}`} 
                width={virtualW}
                height={virtualH}
                className="absolute inset-0 select-none pointer-events-none z-10"
              >
                {filteredLinks.map((link, idx) => renderLinkLine(link, idx))}
              </svg>
              
              {/* Nodes */}
              {filteredNodes.map(node => {
                const ndCoord = coords[node.id] ?? node.coords;
                const nodeStyle = getNodeStyle(node);
                
                return (
                  <NodeCard
                    key={node.id}
                    node={node}
                    coords={ndCoord}
                    style={nodeStyle}
                    isAllStacks={isAllStacks}
                    isSelected={selectedNodeId === node.id}
                    onMouseDown={(e) => handleMouseDown(node.id, e)}
                    onMouseEnter={() => handleNodeHover(node.id)}
                    onMouseLeave={() => handleNodeHover(null)}
                  />
                );
              })}
            </div>
            
            {/* Info Tip */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-[#1e1e1e]/95 p-2 text-[7px] text-[#cccccc] rounded border border-[#2d2d2d] select-none pointer-events-none font-mono">
              <Info className="w-3.5 h-3.5 text-[#007acc] shrink-0" />
              <span>Left-click + Drag any node to reposition. Ctrl+Scroll to zoom.</span>
            </div>
            
            {/* Zoom Controls */}
            <div className="absolute bottom-3 right-3">
              <ZoomControls
                zoom={zoom}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onReset={handleZoomReset}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}