/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';
import { queryTerminalData } from '../../about';

export const techCommand: Command = {
  name: 'tech',
  description: 'Browse technology stack (optional: filter by name)',
  execute: (ctx): CommandResult => {
    const filter = ctx.args.join(' ') || undefined;
    const data = queryTerminalData({ type: 'tech', filter });
    return {
      output: data.map(line => ({ text: line, type: 'output' }))
    };
  }
};
