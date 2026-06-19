/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ActivityView, VSCodeTheme } from '../../../../shared/types';

interface ActivityItemProps {
  id: ActivityView;
  icon: React.ComponentType<any>;
  label: string;
  notification: string | null;
  isActive: boolean;
  theme: VSCodeTheme;
  onClick: () => void;
  key?: React.Key;
}

export default function ActivityItem({
  id,
  icon: Icon,
  label,
  notification,
  isActive,
  theme,
  onClick
}: ActivityItemProps) {
  return (
    <div className="relative group w-full flex items-center justify-center">
      {/* Active Tab Left Border Highlight */}
      <div 
        className={`absolute left-0 w-[2.5px] h-7 bg-sky-500 transition-all rounded-r ${
          isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-50 group-hover:opacity-60'
        }`}
        style={{ backgroundColor: theme.activeBorder }}
      />

      <button
        className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer transition ${
          isActive 
            ? 'text-white bg-white/10' 
            : 'text-neutral-400 hover:text-white hover:bg-white/5'
        }`}
        onClick={onClick}
        aria-label={label}
      >
        <Icon className="w-5 h-5 stroke-[1.6]" />
        
        {notification && (
          <span className="absolute bottom-1 right-2 bg-sky-500 text-white font-mono text-[9px] w-4 h-4 rounded-full flex items-center justify-center scale-90 border border-neutral-900" style={{ backgroundColor: theme.activeBorder }}>
            {notification}
          </span>
        )}
      </button>

      {/* Tooltip */}
      <div className="absolute left-[58px] rounded px-2.5 py-1 text-[11px] whitespace-nowrap bg-neutral-900 font-sans border border-neutral-800 text-white shadow-xl opacity-0 scale-75 origin-left group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none z-50">
        {label}
      </div>
    </div>
  );
}
