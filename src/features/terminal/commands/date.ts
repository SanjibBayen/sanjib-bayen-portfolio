/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';

export const dateCommand: Command = {
  name: 'date',
  description: 'Outputs UTC standard chronos timestamp',
  execute: (): CommandResult => {
    return {
      output: [{ text: `GMT UTC Timestamp: ${new Date().toUTCString()}`, type: 'output' }]
    };
  }
};
