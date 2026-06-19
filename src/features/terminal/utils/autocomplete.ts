/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * Tab autocomplete engine
 */

import { VFS_DATA } from '@/shared/data/portfolioData';
import { VFSNode } from '@/types';
import { registry } from '../commands';

export function getAutocompletedInput(
  input: string,
  currentPath: string[]
): { text: string; suggestions?: string[] } {
  const trimmed = input.trimStart();
  if (!trimmed) {
    // If empty input, suggest list of popular commands on Tab
    return { text: input, suggestions: registry.getCommandNames().slice(0, 10) };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    // Autocomplete command name or alias
    const prefix = parts[0].toLowerCase();
    const commandNames = registry.getCommandNames();
    const matches = commandNames.filter(name => name.startsWith(prefix));
    
    if (matches.length === 1) {
      return { text: matches[0] + ' ' };
    } else if (matches.length > 1) {
      return { text: input, suggestions: matches };
    }
  } else {
    const cmd = parts[0].toLowerCase();
    const lastPart = parts[parts.length - 1];
    
    if (cmd === 'cd' || cmd === 'cat') {
      // Find files/folders in the current directory
      let currentLevel: VFSNode[] = VFS_DATA;
      for (const seg of currentPath) {
        const item = currentLevel.find(n => n.name === seg && n.type === 'folder');
        if (item && item.children) {
          currentLevel = item.children;
        }
      }

      const isFolderOnly = cmd === 'cd';
      const possibleNodes = currentLevel.filter(n => !isFolderOnly || n.type === 'folder');
      const matches = possibleNodes
        .map(n => n.name)
        .filter(name => name.toLowerCase().startsWith(lastPart.toLowerCase()));

      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        return { text: parts.join(' ') };
      } else if (matches.length > 1) {
        return { text: input, suggestions: matches };
      }
    }
  }

  return { text: input };
}
