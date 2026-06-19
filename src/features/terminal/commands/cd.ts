/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult, CommandOutputLine } from '../types/terminal';
import { VFS_DATA } from '../../../shared/data/portfolioData';
import { VFSNode } from '../../../shared/types';

export const cdCommand: Command = {
  name: 'cd',
  description: 'Traverses into designated virtual relative directory',
  execute: (ctx): CommandResult => {
    const targetPathArg = ctx.args[0];
    const output: CommandOutputLine[] = [];

    if (!targetPathArg || targetPathArg === '~' || targetPathArg === '/') {
      ctx.setCurrentPath([]);
      output.push({ text: 'Returned to project workspace root: .\\', type: 'output' });
    } else if (targetPathArg === '..') {
      if (ctx.currentPath.length > 0) {
        ctx.setCurrentPath(prev => prev.slice(0, -1));
      }
    } else {
      const target = targetPathArg.replace('\\', '/').split('/');
      let nodeToSearch: VFSNode[] = VFS_DATA;
      let pathBuild: string[] = [];
      let success = true;

      for (const step of target) {
        if (!step || step === '.') continue;
        const match = nodeToSearch.find(n => n.name.toLowerCase() === step.toLowerCase() && n.type === 'folder');
        if (match && match.children) {
          nodeToSearch = match.children;
          pathBuild.push(match.name);
        } else {
          success = false;
          break;
        }
      }

      if (success) {
        ctx.setCurrentPath(pathBuild);
      } else {
        output.push({ text: `Error: CD path directory cannot be verified: "${targetPathArg}"`, type: 'error' });
      }
    }

    return { output };
  }
};
