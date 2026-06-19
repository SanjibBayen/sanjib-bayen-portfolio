/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * Custom Hook for Workspace portfolio business logic
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import { usePortfolioStore } from '@/store/portfolioStore';
import { ActivityView, THEMES } from '@/types';

export function usePortfolio() {
  const store = usePortfolioStore();
  const [isMobileOrTablet, setIsMobileOrTablet] = useState<boolean>(false);

  // Tablet/Mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Run initial workspace setup
  useEffect(() => {
    store.handleRefreshWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close the main terminal/command panel if the CMD sandbox dashboard is opened
  useEffect(() => {
    if (store.activeView === 'cmd' && store.isTerminalOpen) {
      store.setIsTerminalOpen(false);
    }
  }, [store.activeView, store.isTerminalOpen, store.setIsTerminalOpen]);

  // Adjust terminal panel height to prioritize portfolio database table visibility
  useEffect(() => {
    if (store.activeTabPath === 'projects/portfolio.db') {
      if (store.panelHeight > 180) {
        store.setPanelHeight(200);
      }
    }
  }, [store.activeTabPath, store.panelHeight, store.setPanelHeight]);

  // Toggle sidebar tab views in standard VS Code click/toggle style
  const handleActivityViewChange = useCallback((view: ActivityView) => {
    if (store.showSettings) {
      store.setShowSettings(false);
      store.setIsSidebarOpen(view !== 'cmd');
      store.setActiveView(view);
    } else if (store.activeView === view) {
      if (view === 'cmd' || view === 'git') {
        store.setActiveView('explorer');
        store.setIsSidebarOpen(true);
      } else {
        store.setIsSidebarOpen(!store.isSidebarOpen);
      }
    } else {
      store.setIsSidebarOpen(view !== 'cmd');
      store.setActiveView(view);
    }
  }, [store]);

  // Extracted active file's language type
  const activeLanguage = useMemo(() => {
    return store.openTabs.find(t => t.path === store.activeTabPath)?.language;
  }, [store.openTabs, store.activeTabPath]);

  // Hook up global hotkeys for interactive immersion
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle terminal on Ctrl + J or Ctrl + ` (VS Code style)
      if (e.ctrlKey && (e.key === '`' || e.key === 'j' || e.key === 'J')) {
        e.preventDefault();
        if (e.shiftKey) {
          // Focus terminal
          store.setIsTerminalOpen(true);
          setTimeout(() => {
            const inputEl = document.querySelector('input[aria-label="PowerShell Input"]') as HTMLInputElement;
            inputEl?.focus();
          }, 120);
        } else {
          // Toggle open / closed state
          store.setIsTerminalOpen(!store.isTerminalOpen);
        }
        return;
      }

      // Toggle sidebar on Ctrl + b (VS Code style)
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        store.setIsSidebarOpen(!store.isSidebarOpen);
        return;
      }

      // Allow only key triggers with Alt modifiers
      if (e.altKey) {
        const key = e.key.toLowerCase();
        
        if (key === 'e') {
          e.preventDefault();
          store.setActiveView('explorer');
          store.setShowSettings(false);
        }
        else if (key === 's') {
          e.preventDefault();
          store.setActiveView('search');
          store.setShowSettings(false);
        }
        else if (key === 't') {
          e.preventDefault();
          // Toggle terminal panel focus
          store.setPanelHeight(store.panelHeight > 100 ? 50 : 220);
        }
        else if (key === 'd') {
          e.preventDefault();
          const currentId = store.activeThemeId;
          const nextId = currentId === 'dracula' ? 'dark-default' : 'dracula';
          store.setActiveThemeId(nextId);
        }
        else if (key === 'c') {
          e.preventDefault();
          store.handleOpenFile('connect/api.tsx');
        }
        else if (key === 'r') {
          e.preventDefault();
          store.handleRefreshWorkspace();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [store]);

  return {
    ...store,
    isMobileOrTablet,
    activeLanguage,
    handleActivityViewChange,
  };
}
