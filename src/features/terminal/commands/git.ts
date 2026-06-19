/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult, CommandOutputLine } from '../types/terminal';

export const gitCommand: Command = {
  name: 'git',
  description: 'Evaluates currently unstaged local virtual files (git status)',
  execute: (ctx): CommandResult => {
    const gitSubArg = ctx.args[0] ? ctx.args[0].toLowerCase() : '';
    const output: CommandOutputLine[] = [];

    if (gitSubArg === 'status') {
      output.push(
        { text: 'On branch: main', type: 'output' },
        { text: "Your branch is up to date with 'origin/main'.", type: 'output' },
        { text: 'Changes not staged for commit:', type: 'output' },
        { text: '  (use "git stage <file>..." to update what will be committed)', type: 'system' },
        { text: '      modified:   connect/api.tsx', type: 'error' },
        { text: 'Uncommitted Files:', type: 'output' },
        { text: '      untracked:  about/README.md', type: 'error' }
      );
    } else {
      output.push({ text: `git ${ctx.args.join(' ')}: Sandbox git execution is restricted to "git status".`, type: 'error' });
    }

    return { output };
  }
};
