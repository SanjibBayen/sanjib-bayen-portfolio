/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React, { useState, useMemo } from "react";
import { Search, ChevronRight, ChevronDown, X } from "lucide-react";
import { VSCodeTheme } from "../../../../shared/types";
import { VFS_DATA, VFSNode } from "../../../../shared/data/portfolioData";
import { getFileIcon, getFolderIcon } from "./SidebarIcons";

interface GitStatus {
  badge: "M" | "U";
  bg: string;
}

interface FileExplorerViewProps {
  theme: VSCodeTheme;
  openFile: (path: string) => void;
  activeFilePath?: string;
  avatarUrl: string;
  gitCommitted: boolean;
}

export default function FileExplorerView({
  theme,
  openFile,
  activeFilePath,
  avatarUrl,
  gitCommitted,
}: FileExplorerViewProps) {
  const [expandedFolders, setExpandedFolders] = useState<
    Record<string, boolean>
  >({
    about: true,
    projects: true,
    skills: true,
    connect: true,
    startup: true,
    research: true,
    achievements: true,
  });

  const [explorerFilter, setExplorerFilter] = useState("");
  const [isProfilerExpanded, setIsProfilerExpanded] = useState<boolean>(false);

  const filteredVFSData = useMemo(() => {
    if (!explorerFilter.trim()) return VFS_DATA;
    const query = explorerFilter.toLowerCase();

    const filterNode = (node: VFSNode): VFSNode | null => {
      if (node.type === "file") {
        if (node.name.toLowerCase().includes(query)) {
          return node;
        }
        return null;
      } else {
        const filteredChildren = node.children
          ? node.children
              .map((child) => filterNode(child))
              .filter((c): c is VFSNode => c !== null)
          : [];

        if (
          node.name.toLowerCase().includes(query) ||
          filteredChildren.length > 0
        ) {
          return {
            ...node,
            children: filteredChildren,
          };
        }
        return null;
      }
    };

    return VFS_DATA.map((node) => filterNode(node)).filter(
      (n): n is VFSNode => n !== null,
    );
  }, [explorerFilter]);

  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  const getGitStatus = (path: string): GitStatus | null => {
    return null;
  };

  const renderVFSNode = (node: VFSNode, depth = 0) => {
    const isFolder = node.type === "folder";
    const hasActiveFilter = !!explorerFilter.trim();
    const isExpanded = hasActiveFilter ? true : !!expandedFolders[node.name];
    const isSelectedFile = activeFilePath === node.path;

    if (isFolder) {
      return (
        <div key={node.path} className="flex flex-col font-mono select-none">
          <button
            className="w-full text-left py-1 text-xs hover:bg-[#2a2d2e] flex items-center transition cursor-pointer text-slate-300 hover:text-white"
            onClick={() => toggleFolder(node.name)}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 shrink-0 text-slate-400 mr-0.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 shrink-0 text-slate-400 mr-0.5" />
            )}
            {getFolderIcon(node.name, isExpanded)}
            <span className="font-semibold">{node.name}</span>
          </button>

          {isExpanded && node.children && (
            <div className="flex flex-col">
              {node.children.map((child) => renderVFSNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    } else {
      const gitStatus = getGitStatus(node.path);
      const isModified = gitStatus?.badge === "M";
      const isUntracked = gitStatus?.badge === "U";

      let fileColorClass = "text-slate-400 hover:text-slate-200";
      if (!isSelectedFile) {
        if (isModified) fileColorClass = "text-amber-400 hover:text-amber-200";
        else if (isUntracked)
          fileColorClass = "text-cyan-400 hover:text-cyan-200";
      }

      return (
        <button
          key={node.path}
          className={`w-full text-left py-1 text-xs flex items-center justify-between transition cursor-pointer font-mono ${
            isSelectedFile
              ? theme.id === "dark-default"
                ? "bg-[#37373d] text-white"
                : "bg-neutral-800 text-sky-400 border-l border-sky-500"
              : `hover:bg-[#2a2d2e] ${fileColorClass}`
          }`}
          onClick={() => openFile(node.path)}
          style={{ paddingLeft: `${depth * 12 + 10}px`, paddingRight: "8px" }}
        >
          <div className="flex items-center truncate">
            {getFileIcon(node.name)}
            <span className={isSelectedFile ? "font-medium" : ""}>
              {node.name}
            </span>
          </div>
          {gitStatus && (
            <span
              className={`text-[8px] font-bold font-mono px-1 py-[0.5px] rounded scale-90 ${gitStatus.bg}`}
            >
              {gitStatus.badge}
            </span>
          )}
        </button>
      );
    }
  };

  return (
    <div className="flex flex-col h-full w-full min-h-0 justify-between">
      {/* Real-time Explorer Filter Search Box */}
      <div className="p-2 pb-1 border-b border-neutral-800/20">
        <div className="relative">
          <input
            type="text"
            placeholder="Filter files (e.g. read, .ts, ai)..."
            value={explorerFilter}
            onChange={(e) => setExplorerFilter(e.target.value)}
            className="w-full px-2.5 py-1 pl-7 rounded text-[11px] bg-black/20 border border-neutral-800 focus:border-sky-500 focus:outline-none text-slate-200 placeholder-neutral-500 font-sans"
          />
          <Search className="w-3 h-3 absolute left-2.5 top-2 opacity-40 text-slate-300 pointer-events-none" />
          {explorerFilter && (
            <button
              onClick={() => setExplorerFilter("")}
              className="absolute right-2.5 top-1.5 hover:text-white"
            >
              <X className="w-3 h-3 shrink-0 opacity-40 hover:opacity-100" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Folder Tree Section */}
      <div className="flex-1 overflow-y-auto custom-scrollbar text-xs py-1 min-h-0">
        <div className="p-2 border-b border-neutral-800/30 font-bold opacity-60 text-[10px] uppercase flex items-center">
          <ChevronDown className="w-3 h-3 mr-1" /> WORKSPACE FOLDERS
        </div>

        {/* Folder Tree */}
        <div className="py-2 flex flex-col">
          {filteredVFSData.length > 0 ? (
            filteredVFSData.map((node) => renderVFSNode(node, 0))
          ) : (
            <div className="p-4 text-center text-neutral-500 font-mono text-[11px]">
              No matches found
            </div>
          )}
        </div>
      </div>

      {/* STICKY OUTLINE PORTFOLIO AVATAR */}
      <div className="bg-black/15 shrink-0 select-none pb-1 font-sans">
        <button
          onClick={() => setIsProfilerExpanded(!isProfilerExpanded)}
          className="w-full text-left p-2 border-b border-neutral-800/20 font-bold opacity-65 text-[10px] uppercase flex items-center justify-between hover:bg-neutral-800/20 transition cursor-pointer"
        >
          <span className="flex items-center">
            {isProfilerExpanded ? (
              <ChevronDown className="w-3 h-3 mr-1 text-slate-400" />
            ) : (
              <ChevronRight className="w-3 h-3 mr-1 text-slate-400" />
            )}
            Sanjib's Profiler
          </span>
        </button>

        {isProfilerExpanded && (
          <div className="p-3.5 flex flex-col items-center text-center space-y-2">
            <div className="relative group/avatar">
              <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full blur opacity-25 group-hover/avatar:opacity-60 transition duration-700" />
              <div className="relative w-16 h-16 rounded-full overflow-hidden border border-sky-400 bg-neutral-900 shadow-xl">
                <img
                  src={avatarUrl}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-0.5 animate-fade-in">
              <h4 className="font-bold text-white text-xs">Sanjib Bayen</h4>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
