/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';
import { queryTerminalData } from '../../about';

export const contactCommand: Command = {
  name: 'contact',
  description: 'Show contact information',
  execute: (): CommandResult => {
    const data = queryTerminalData({ type: 'contact' });
    return {
      output: data.map(line => ({ text: line, type: 'output' }))
    };
  }
};
