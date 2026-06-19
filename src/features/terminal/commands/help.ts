/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';

export const helpCommand: Command = {
  name: 'help',
  description: 'Available interactive sandboxed PowerShell commands',
  execute: (): CommandResult => {
    return {
      output: [
        { text: 'Available interactive sandboxed PowerShell commands:', type: 'success' },
        { text: '', type: 'output' },
        { text: ' PROFILE COMMANDS:', type: 'success' },
        { text: '  whoami              - Display detailed developer profile card', type: 'output' },
        { text: '  skills              - Show technical capability ratings', type: 'output' },
        { text: '  specs               - Display embedded system specifications', type: 'output' },
        { text: '  education           - Show educational background', type: 'output' },
        { text: '  experience          - Display professional experience', type: 'output' },
        { text: '  research            - List research papers', type: 'output' },
        { text: '  contact             - Show contact information', type: 'output' },
        { text: '  profile             - Full profile overview', type: 'output' },
        { text: '  stats               - Portfolio statistics dashboard', type: 'output' },
        { text: '', type: 'output' },
        { text: ' EXPLORATION COMMANDS:', type: 'success' },
        { text: '  projects [filter]   - List projects (optional: filter by name/category)', type: 'output' },
        { text: '  tech [filter]       - Browse technology stack (optional: filter by name)', type: 'output' },
        { text: '  inspect <node_id>   - Fetch metadata of a tech node', type: 'output' },
        { text: '  cat_manifest        - Dump complete skills layout as JSON', type: 'output' },
        { text: '  diagnose            - Run comprehensive system check', type: 'output' },
        { text: '  trace [--source=X]  - Trace dependency connections', type: 'output' },
        { text: '', type: 'output' },
        { text: ' DATABASE COMMANDS:', type: 'success' },
        { text: '  sqlite3 portfolio.db "<SQL>" - Run SQL queries on projects', type: 'output' },
        { text: '  python run_cell.py [args]    - Execute notebook cells', type: 'output' },
        { text: '', type: 'output' },
        { text: ' FILESYSTEM COMMANDS:', type: 'success' },
        { text: '  ls / dir            - List directory contents', type: 'output' },
        { text: '  cd <dir>            - Change directory', type: 'output' },
        { text: '  cat <file>          - Display file contents', type: 'output' },
        { text: '', type: 'output' },
        { text: ' SYSTEM COMMANDS:', type: 'success' },
        { text: '  theme <name>        - Switch color theme (dracula, one-dark, monokai)', type: 'output' },
        { text: '  date                - Display current UTC timestamp', type: 'output' },
        { text: '  clear / cls         - Clear terminal history', type: 'output' },
        { text: '  git status          - Show virtual git status', type: 'output' },
        { text: '  curl <endpoint>     - Simulate API calls', type: 'output' },
        { text: '  secrets             - Display classified metrics', type: 'output' },
        { text: '  run <config>        - Execute simulation', type: 'output' }
      ]
    };
  }
};
