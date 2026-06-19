/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';
import { queryTerminalData } from '../../about';

export const whoamiCommand: Command = {
  name: 'whoami',
  description: 'Display detailed developer profile card',
  execute: (): CommandResult => {
    const data = queryTerminalData({ type: 'whoami' });
    return {
      output: data.map(line => ({ text: line, type: 'success' }))
    };
  }
};
