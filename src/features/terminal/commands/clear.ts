/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';

export const clearCommand: Command = {
  name: 'clear',
  description: 'Clears terminal scrollback history buffers',
  aliases: ['cls', 'clean'],
  execute: (ctx): CommandResult => {
    ctx.clearHistory();
    ctx.setTerminalInput('');
    return {
      output: [],
      clearHistory: true
    };
  }
};
