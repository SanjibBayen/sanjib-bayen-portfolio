/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';
import { queryTerminalData } from '../../about';

export const experienceCommand: Command = {
  name: 'experience',
  description: 'Display professional experience',
  execute: (): CommandResult => {
    const data = queryTerminalData({ type: 'experience' });
    return {
      output: data.map(line => ({ text: line, type: 'output' }))
    };
  }
};
