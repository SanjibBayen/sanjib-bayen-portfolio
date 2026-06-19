/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult } from '../types/terminal';
import { techGraphNodes } from '../../skills';
import { PROFILE_DATA } from '../../about';

export const catManifestCommand: Command = {
  name: 'cat_manifest',
  description: 'Dump complete skills layout as JSON list',
  execute: (): CommandResult => {
    const listNames = Object.values(techGraphNodes as any).map((node: any) => `"${node.name}"`).join(", ");
    const categories = [...new Set(Object.values(techGraphNodes as any).map((n: any) => n.category))];
    
    return {
      output: [
        { text: `{`, type: 'output' },
        { text: `  "workspace": "${PROFILE_DATA.name} Portfolio v4",`, type: 'output' },
        { text: `  "catalogCount": ${Object.keys(techGraphNodes).length},`, type: 'output' },
        { text: `  "categories": ${JSON.stringify(categories)},`, type: 'output' },
        { text: `  "dependencies": [`, type: 'output' },
        { text: `    ${listNames}`, type: 'output' },
        { text: `  ]`, type: 'output' },
        { text: `}`, type: 'output' }
      ]
    };
  }
};
