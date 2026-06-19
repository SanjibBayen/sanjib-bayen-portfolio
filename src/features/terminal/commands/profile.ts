/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';
import { queryTerminalData } from '../../about';

export const profileCommand: Command = {
  name: 'profile',
  description: 'Full profile overview',
  execute: (): CommandResult => {
    const data = queryTerminalData({ type: 'profile' });
    return {
      output: data.map(line => ({ text: line, type: 'output' }))
    };
  }
};
