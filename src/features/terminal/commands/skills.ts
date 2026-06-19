/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';
import { queryTerminalData } from '../../about';

export const skillsCommand: Command = {
  name: 'skills',
  description: 'Show technical capability ratings',
  execute: (): CommandResult => {
    const data = queryTerminalData({ type: 'skills' });
    return {
      output: data.map(line => ({ text: line, type: 'output' }))
    };
  }
};
