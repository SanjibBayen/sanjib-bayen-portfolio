/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';
import { queryTerminalData } from '../../about';

export const educationCommand: Command = {
  name: 'education',
  description: 'Show educational background',
  execute: (): CommandResult => {
    const data = queryTerminalData({ type: 'education' });
    return {
      output: data.map(line => ({ text: line, type: 'output' }))
    };
  }
};
