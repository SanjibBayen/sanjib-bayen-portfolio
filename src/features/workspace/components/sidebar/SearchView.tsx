/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React, { useState, useMemo } from 'react';
import { Search, X, FileText } from 'lucide-react';
import { VFS_DATA, VFSNode } from '../../../../shared/data/portfolioData';

interface SearchViewProps {
  openFile: (path: string) => void;
}

export default function SearchView({ openFile }: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Perform full-text search across all VFS nodes
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    interface SearchMatch {
      path: string;
      fileName: string;
      lineNum: number;
      text: string;
    }

    const matches: SearchMatch[] = [];
    const query = searchQuery.toLowerCase();

    // Traversal helper
    const traverse = (nodes: VFSNode[]) => {
      nodes.forEach(node => {
        if (node.type === 'file' && node.content) {
          const lines = node.content.split('\n');
          lines.forEach((line, index) => {
            if (line.toLowerCase().includes(query)) {
              matches.push({
                path: node.path,
                fileName: node.name,
                lineNum: index + 1,
                text: line.trim()
              });
            }
          });
        } else if (node.type === 'folder' && node.children) {
          traverse(node.children);
        }
      });
    };

    traverse(VFS_DATA);
    return matches;
  }, [searchQuery]);

  return (
    <div className="p-3 flex flex-col space-y-3 overflow-y-auto custom-scrollbar flex-1 min-h-0 text-left">
      <div className="relative">
        <input
          type="text"
          placeholder="Search text in files..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-1.5 pl-8 rounded text-xs bg-black/30 border border-neutral-700/60 focus:border-sky-500 focus:outline-none text-slate-200 placeholder-neutral-500"
        />
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 opacity-40 text-slate-300" />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-2 hover:text-white max-h-[20px]"
          >
            <X className="w-3.5 h-3.5 shrink-0 opacity-40 hover:opacity-100" />
          </button>
        )}
      </div>

      <div className="text-[10px] opacity-40 font-mono">
        {searchQuery ? `${searchResults.length} results returned in workspace` : "Type a keyword below (e.g. 'drone', 'ai', 'sync', 'react')"}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 max-h-[350px] custom-scrollbar">
        {searchResults.map((match, id) => (
          <button
            key={id}
            onClick={() => openFile(match.path)}
            className="w-full text-left p-2 rounded hover:bg-neutral-800/40 border border-transparent hover:border-neutral-800 transition flex flex-col space-y-1 block cursor-pointer"
          >
            <div className="flex items-center text-[10px] text-sky-400 font-mono font-bold">
              <FileText className="w-3 h-3 mr-1" />
              {match.fileName}
              <span className="text-neutral-500 ml-1.5">Line {match.lineNum}</span>
            </div>
            <div className="text-xs text-slate-300 font-mono truncate pl-4">
              {match.text}
            </div>
          </button>
        ))}
        {searchQuery && searchResults.length === 0 && (
          <div className="text-center py-6 text-xs text-neutral-500 font-mono">
            No matching files found.
          </div>
        )}
      </div>
    </div>
  );
}
