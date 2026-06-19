/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * Terminal system specific Zustand slice or settings store
 */

import { create } from 'zustand';

interface TerminalState {
  textColorAttribute: string;
  setTextColorAttribute: (color: string) => void;
  resetTextColorAttribute: () => void;
  autocompleteSuggestions: string[];
  setAutocompleteSuggestions: (suggestions: string[]) => void;
  clearAutocompleteSuggestions: () => void;
}

export const useTerminalStore = create<TerminalState>((set) => ({
  textColorAttribute: (() => {
    try {
      return localStorage.getItem('cmd_color') || 'text-neutral-300';
    } catch {
      return 'text-neutral-300';
    }
  })(),
  setTextColorAttribute: (color) => {
    try {
      localStorage.setItem('cmd_color', color);
    } catch (err) {
      console.warn("Storage unreachable:", err);
    }
    set({ textColorAttribute: color });
  },
  resetTextColorAttribute: () => {
    try {
      localStorage.removeItem('cmd_color');
    } catch (err) {
      console.warn("Storage unreachable:", err);
    }
    set({ textColorAttribute: 'text-neutral-300' });
  },
  autocompleteSuggestions: [],
  setAutocompleteSuggestions: (suggestions) => set({ autocompleteSuggestions: suggestions }),
  clearAutocompleteSuggestions: () => set({ autocompleteSuggestions: [] }),
}));
