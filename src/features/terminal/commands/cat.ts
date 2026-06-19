/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult, CommandOutputLine } from '../types/terminal';
import { VFS_DATA } from '../../../shared/data/portfolioData';

export const catCommand: Command = {
  name: 'cat',
  description: 'Renders raw file content directly in PowerShell',
  execute: (ctx): CommandResult => {
    const filenameArg = ctx.args[0];
    const output: CommandOutputLine[] = [];

    if (filenameArg) {
      const lookupName = filenameArg.toLowerCase();
      let currentLevel = VFS_DATA;
      for (const seg of ctx.currentPath) {
        const f = currentLevel.find(n => n.name === seg && n.type === 'folder');
        if (f && f.children) {
          currentLevel = f.children;
        }
      }
      const fileIndex = currentLevel.find(n => n.name.toLowerCase() === lookupName && n.type === 'file');
      if (fileIndex && fileIndex.content) {
        output.push({ text: `--- RENDER OUT: ${fileIndex.name} ---`, type: 'success' });
        fileIndex.content.split('\n').forEach(l => {
          output.push({ text: l, type: 'output' });
        });
      } else {
        output.push({ text: `cat: Target file not found inside current directory: "${filenameArg}"`, type: 'error' });
      }
    } else {
      output.push({ text: 'Error: Provide file parameter target (e.g. "cat api.ts")', type: 'error' });
    }

    return { output };
  }
};
