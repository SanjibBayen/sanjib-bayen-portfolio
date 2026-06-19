/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React, { useState } from 'react';
import { VSCodeTheme } from '../../../../shared/types';
import { toast } from '../../../../shared/utils/toast';
import { PROFILE_DATA } from '../../../../features/about';

interface TitleMenuProps {
  theme: VSCodeTheme;
  allThemes: VSCodeTheme[];
  onRefresh: () => void;
  onThemeSelect: (themeId: string) => void;
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (open: boolean) => void;
  isTerminalOpen?: boolean;
  setIsTerminalOpen?: (open: boolean) => void;
}

export default function TitleMenu({
  theme,
  allThemes,
  onRefresh,
  onThemeSelect,
  isSidebarOpen = true,
  setIsSidebarOpen,
  isTerminalOpen = true,
  setIsTerminalOpen
}: TitleMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = [
    {
      name: 'File',
      items: [
        { label: 'New File', shortcut: 'Ctrl+N', action: () => toast.warning("Sanjib's Virtual Workspace is read-only. For editing or compiling custom microcontrollers, please fork locally.") },
        { label: 'Save', shortcut: 'Ctrl+S', action: () => toast.success("Workspace configuration status successfully sync'ed with localStorage.") },
        { label: 'Reload Window', shortcut: 'Ctrl+R', action: onRefresh },
        { label: 'Exit Portfolio', shortcut: 'Alt+F4', action: () => toast.info("To exit the IDE session, simply close or dismiss this browser tab.") }
      ]
    },
    {
      name: 'Edit',
      items: [
        { label: 'Undo', shortcut: 'Ctrl+Z', disabled: true },
        { label: 'Cut', shortcut: 'Ctrl+X', disabled: true },
        { label: 'Copy Tagline', shortcut: 'Ctrl+C', action: () => {
          navigator.clipboard.writeText(`${PROFILE_DATA.name} — AI Research Engineer & Full-Stack Developer`);
          toast.success("Sanjib's tagline successfully copied to your clipboard!");
        } },
        { label: 'Find In Files', shortcut: 'Ctrl+Shift+F', disabled: true }
      ]
    },
    {
      name: 'Selection',
      items: [
        { label: 'Select All', shortcut: 'Ctrl+A' },
        { label: 'Expand Selection', shortcut: 'Shift+Alt+Right' }
      ]
    },
    {
      name: 'View',
      items: [
        { label: 'Toggle Sidebar', shortcut: 'Ctrl+B', action: () => setIsSidebarOpen?.(!isSidebarOpen) },
        { label: 'Toggle Terminal Panel', shortcut: 'Ctrl+`', action: () => setIsTerminalOpen?.(!isTerminalOpen) }
      ]
    },
    {
      name: 'Go',
      items: [
        { label: 'Back', shortcut: 'Alt+Left', action: () => toast.info("You are already at the home terminal root.") },
        { label: 'Forward', shortcut: 'Alt+Right' },
        { label: 'Go to Settings', action: () => toast.info("Click the Settings cog indicator in the bottom-left Activity Bar!") }
      ]
    },
    {
      name: 'Run',
      items: [
        { label: 'Start Debugging', shortcut: 'F5', action: () => toast.success("Booting interactive GCC/GCE debugging pipeline in output pane!") },
        { label: 'Run Active Config', shortcut: 'Ctrl+F5', action: () => toast.success("Executing target simulator profile pipeline.") }
      ]
    },
    {
      name: 'Terminal',
      items: [
        { label: 'Toggle Console', shortcut: 'Ctrl+`', action: () => setIsTerminalOpen?.(!isTerminalOpen) },
        { label: 'Reset Shell Pipeline', action: onRefresh }
      ]
    },
    {
      name: 'Help',
      items: [
        { label: 'About Sanjib Bayen', action: () => toast.info(`${PROFILE_DATA.name} is ${PROFILE_DATA.philosophy}`) },
        { label: 'Visit Github Profile', action: () => window.open(PROFILE_DATA.github[0]?.url, '_blank') },
        { label: 'LinkedIn Profile', action: () => window.open(PROFILE_DATA.linkedin[0]?.url, '_blank') }
      ]
    }
  ];

  const handleMenuClick = (menuName: string) => {
    if (activeMenu === menuName) {
      setActiveMenu(null);
    } else {
      setActiveMenu(menuName);
    }
  };

  const handleAction = (action?: () => void) => {
    if (action) action();
    setActiveMenu(null);
  };

  return (
    <div className="flex items-center space-x-0.5 select-none" id="nav-menus">
      {menus.map((menu) => (
        <div key={menu.name} className="relative">
          <button
            className={`py-1 px-2.5 rounded text-[12px] bg-transparent outline-none transition cursor-pointer font-sans select-none ${
              activeMenu === menu.name 
                ? 'bg-neutral-800/60 text-white font-medium' 
                : 'hover:bg-neutral-800/35 text-slate-350 hover:text-white'
            }`}
            onClick={() => handleMenuClick(menu.name)}
          >
            {menu.name}
          </button>

          {activeMenu === menu.name && (
            <>
              {/* Backdrop to dismiss menu */}
              <div 
                className="fixed inset-0 z-40 cursor-default" 
                onClick={() => setActiveMenu(null)}
              />
              <div
                className="absolute left-0 mt-1.5 w-60 rounded-[4px] shadow-2xl border flex flex-col z-50 py-1 font-sans ring-1 ring-black/40"
                style={{
                  backgroundColor: theme.sidebarBg,
                  borderColor: theme.id === 'dark-default' ? '#333333' : `${theme.activeBorder}40`,
                  color: theme.textColor
                }}
              >
                {menu.items.map((item, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left px-3.5 py-1.5 hover:bg-sky-600 hover:text-white flex items-center justify-between transition text-xs cursor-pointer select-none border-0"
                    onClick={() => handleAction(item.action)}
                  >
                    <span className="font-sans font-light">{item.label}</span>
                    {item.shortcut && (
                      <span className="text-[10px] opacity-50 font-mono tracking-tighter">{item.shortcut}</span>
                    )}
                  </button>
                ))}
                
                {menu.name === 'View' && (
                  <div className="border-t border-neutral-700/35 my-1 pt-1.5">
                    <div className="px-3.5 py-0.5 text-[9px] uppercase font-bold text-slate-450 opacity-55">Switch Color Scheme</div>
                    {allThemes.map((t) => (
                      <button
                        key={t.id}
                        className="w-full text-left px-5 py-1 hover:bg-sky-600 hover:text-white flex items-center justify-between text-xs cursor-pointer border-0"
                        onClick={() => {
                          onThemeSelect(t.id);
                          setActiveMenu(null);
                        }}
                      >
                        <span className={theme.id === t.id ? 'font-bold text-sky-400' : ''}>{t.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
