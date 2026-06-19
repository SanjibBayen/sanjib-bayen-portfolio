/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';
import { queryTerminalData } from '../../about';

export const specsCommand: Command = {
  name: 'specs',
  description: 'Display embedded system specifications',
  aliases: ['system'],
  execute: (): CommandResult => {
    const data = queryTerminalData({ type: 'specs' });
    return {
      output: data.map(line => ({ text: line, type: 'output' }))
    };
  }
};
