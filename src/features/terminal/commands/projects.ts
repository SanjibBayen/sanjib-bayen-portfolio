/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';
import { queryTerminalData } from '../../about';

export const projectsCommand: Command = {
  name: 'projects',
  description: 'List projects (optional: filter by name/category)',
  execute: (ctx): CommandResult => {
    const filter = ctx.args.join(' ') || undefined;
    const data = queryTerminalData({ type: 'projects', filter });
    return {
      output: data.map(line => ({ text: line, type: 'output' }))
    };
  }
};
