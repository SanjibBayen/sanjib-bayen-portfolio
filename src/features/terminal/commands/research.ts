/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';
import { queryTerminalData } from '../../about';

export const researchCommand: Command = {
  name: 'research',
  description: 'List research papers',
  execute: (): CommandResult => {
    const data = queryTerminalData({ type: 'research' });
    return {
      output: data.map(line => ({ text: line, type: 'output' }))
    };
  }
};
