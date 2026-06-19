/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult, CommandOutputLine } from '../types/terminal';
import { VFS_DATA } from '@/shared/data/portfolioData';
import { VFSNode } from '@/types';

export const lsCommand: Command = {
  name: 'ls',
  description: 'Lists items located inside the current directory',
  aliases: ['dir'],
  execute: (ctx): CommandResult => {
    let targetList: VFSNode[] = VFS_DATA;
    for (const segment of ctx.currentPath) {
      const match = targetList.find(n => n.name === segment && n.type === 'folder');
      if (match && match.children) {
        targetList = match.children;
      }
    }

    const output: CommandOutputLine[] = [
      { text: `Directory listing: C:\\Projects\\Sanjib-Bayen${ctx.formatPromptPath()}`, type: 'success' }
    ];

    targetList.forEach(node => {
      const prefix = node.type === 'folder' ? '<DIR>   ' : '        ';
      output.push({ text: `${prefix}${node.name}`, type: 'output' });
    });

    return { output };
  }
};
