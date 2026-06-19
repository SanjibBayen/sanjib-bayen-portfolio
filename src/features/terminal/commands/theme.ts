/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult, CommandOutputLine } from '../types/terminal';

export const themeCommand: Command = {
  name: 'theme',
  description: 'Switches IDE color theme dynamically (e.g. dracula)',
  execute: (ctx): CommandResult => {
    const themeArg = ctx.args[0];
    const output: CommandOutputLine[] = [];

    if (themeArg) {
      const tId = themeArg.toLowerCase();
      if (['default', 'dark', 'standard'].includes(tId)) {
        ctx.onThemeSelect('dark-default');
        output.push({ text: 'Theme parsed. Scheme swapped to Dark+ (Default)', type: 'success' });
      } else if (tId === 'dracula') {
        ctx.onThemeSelect('dracula');
        output.push({ text: 'Theme parsed. Scheme swapped to Dracula', type: 'success' });
      } else if (['one-dark', 'onedark'].includes(tId)) {
        ctx.onThemeSelect('one-dark');
        output.push({ text: 'Theme parsed. Scheme swapped to One Dark Pro', type: 'success' });
      } else if (tId === 'monokai') {
        ctx.onThemeSelect('monokai');
        output.push({ text: 'Theme parsed. Scheme swapped to Monokai Retro', type: 'success' });
      } else {
        output.push({ text: `Theme "${themeArg}" not in register. Try path names: [default, dracula, one-dark, monokai]`, type: 'error' });
      }
    } else {
      output.push({ text: 'Error: Provide targeted scheme path (e.g. "theme dracula")', type: 'error' });
    }

    return { output };
  }
};
