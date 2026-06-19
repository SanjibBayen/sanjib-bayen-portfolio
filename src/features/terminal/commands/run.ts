/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult, CommandOutputLine } from '../types/terminal';

export const runCommand: Command = {
  name: 'run',
  description: 'Execute simulation',
  execute: (ctx): CommandResult => {
    const configVal = ctx.args.join(' ');
    const output: CommandOutputLine[] = [];

    if (configVal) {
      output.push(
        { text: `Executing debug configuration: "${configVal}" on Orin compiler...`, type: 'system' },
        { text: `✔ Run successful. Check the interactive UI tabs for active triggers.`, type: 'success' }
      );
    } else {
      output.push({ text: 'Error: Provide debugger configuration path (e.g. "run Drone Swarm")', type: 'error' });
    }

    return { output };
  }
};
