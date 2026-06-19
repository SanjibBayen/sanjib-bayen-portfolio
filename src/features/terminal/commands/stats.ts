/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';
import { queryTerminalData } from '../../about';

export const statsCommand: Command = {
  name: 'stats',
  description: 'Portfolio statistics dashboard',
  execute: (): CommandResult => {
    const data = queryTerminalData({ type: 'stats' });
    return {
      output: data.map(line => ({ text: line, type: 'output' }))
    };
  }
};
