/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React from 'react';
import { User, Settings } from 'lucide-react';
import { VSCodeTheme } from '../../../../shared/types';

interface ProfileSectionProps {
  theme: VSCodeTheme;
  avatarUrl: string;
  activeView: string;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  onViewChange: (view: any) => void;
}

export default function ProfileSection({
  theme,
  avatarUrl,
  activeView,
  showSettings,
  setShowSettings,
  onViewChange
}: ProfileSectionProps) {
  return (
    <div className="flex flex-col items-center space-y-2 w-full">
      {/* Quick Contacts Avatar / User Section */}
      <div className="relative group w-full flex items-center justify-center">
        <button
          className={`w-9 h-9 rounded-full overflow-hidden border transition cursor-pointer flex items-center justify-center ${
            activeView === 'explorer' && !showSettings ? 'border-sky-500 scale-102' : 'border-neutral-700 hover:border-white'
          }`}
          onClick={() => {
            onViewChange('explorer');
            setShowSettings(false);
          }}
        >
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt="" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <User className="w-5 h-5 text-neutral-400" />
          )}
        </button>
      </div>

      {/* Global Settings Toggle */}
      <div className="relative group w-full flex items-center justify-center">
        <div 
          className={`absolute left-0 w-[2.5px] h-7 bg-sky-500 transition-all rounded-r ${
            showSettings ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-50'
          }`}
          style={{ backgroundColor: theme.activeBorder }}
        />
        <button
          className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer transition ${
            showSettings ? 'text-white bg-white/10' : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Settings"
        >
          <Settings className={`w-5 h-5 stroke-[1.6] transition-transform duration-700 ${showSettings ? 'rotate-90 text-white' : ''}`} />
        </button>
        
        <div className="absolute left-[58px] rounded px-2.5 py-1 text-[11px] whitespace-nowrap bg-neutral-900 font-sans border border-neutral-850 text-white shadow-xl opacity-0 scale-75 origin-left group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none z-50">
          Settings (Ctrl+,)
        </div>
      </div>
    </div>
  );
}
