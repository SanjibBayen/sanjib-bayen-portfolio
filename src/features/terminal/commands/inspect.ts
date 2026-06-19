/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult, CommandOutputLine } from '../types/terminal';
import { techGraphNodes } from '../../skills';
import { PROJECTS_DATA } from '../../projects';

export const inspectCommand: Command = {
  name: 'inspect',
  description: 'Fetch rich metadata and raw source code of a tech node',
  execute: (ctx): CommandResult => {
    const queryVal = ctx.args.join(' ').trim();
    if (!queryVal) {
      return {
        output: [{ text: 'Error: inspect command requires a node ID or name (e.g., "inspect React" or "inspect PyTorch")', type: 'error' }]
      };
    }

    const node = Object.values(techGraphNodes as any).find(
      (n: any) => n.id.toLowerCase() === queryVal.toLowerCase() || n.name.toLowerCase() === queryVal.toLowerCase()
    ) as any;

    if (!node) {
      return {
        output: [
          { text: `Error: Could not locate dependency node matching query "${queryVal}".`, type: 'error' },
          { text: 'Type "cat_manifest" to browse all valid dependency records.', type: 'system' }
        ]
      };
    }

    const output: CommandOutputLine[] = [
      { text: `[sys] Querying registry index cache for record ID: ${node.id.toLowerCase()}`, type: 'system' },
      { text: `[sys] Connection established. Rendering dynamic node specification:`, type: 'system' },
      { text: ``, type: 'output' },
      { text: `┌────────────────────────────────────────────────────────┐`, type: 'success' },
      { text: `│  DEPENDENCY PROFILE: ${node.name.toUpperCase().padEnd(34)} │`, type: 'success' },
      { text: `├────────────────────────────────────────────────────────┤`, type: 'success' },
      { text: `  • Dependency ID  : ${node.id}`, type: 'output' },
      { text: `  • System Name    : ${node.name}`, type: 'output' },
      { text: `  • Category Group : ${node.category}`, type: 'output' },
      { text: `  • Architecture   : ${node.type.toUpperCase()}`, type: 'output' },
      { text: ``, type: 'output' },
      { text: `  [Registry Notes]`, type: 'success' },
      { text: `  ${node.description}`, type: 'output' },
      { text: ``, type: 'output' }
    ];

    const nodeIdLower = node.id.toLowerCase();
    const nodeNameLower = node.name.toLowerCase();
    const aliasMap: Record<string, string[]> = {
      "scikit": ["scikit-learn", "sklearn"],
      "react": ["react.js", "react"],
      "nextjs": ["next.js", "nextjs"],
      "tailwind": ["tailwind", "tailwindcss"],
      "nodejs": ["node.js", "nodejs", "node"],
      "expressjs": ["express.js", "expressjs", "express"],
      "firestore": ["firebase", "firestore"],
      "git": ["git", "github", "git & github"],
      "jupyter": ["jupyter", "jupyter notebooks"],
      "cpp": ["c++", "cpp"],
    };
    const targets = [nodeIdLower, nodeNameLower];
    if (aliasMap[nodeIdLower]) targets.push(...aliasMap[nodeIdLower]);

    const matching = PROJECTS_DATA.filter(project => {
      const inTechStack = project.techStack.some(tech => {
        const techLower = tech.toLowerCase();
        return targets.some(target => techLower.includes(target) || target.includes(techLower));
      });
      if (inTechStack) return true;
      const textToSearch = `${project.name} ${project.summary} ${project.description}`.toLowerCase();
      return targets.some(target => textToSearch.includes(target));
    });

    output.push(
      { text: `┌────────────────────────────────────────────────────────┐`, type: 'success' },
      { text: `│  LINKED PORTFOLIO PROJECTS (Click name below to view)   │`, type: 'success' },
      { text: `└────────────────────────────────────────────────────────┘`, type: 'success' }
    );
    if (matching.length > 0) {
      matching.forEach(p => {
        output.push({ text: `  * ${p.name} [Category: ${p.category}]`, type: 'link', projectId: p.id });
      });
    } else {
      output.push({ text: `  No matching projects indexed in current active manifest.`, type: 'output' });
    }

    return { output };
  }
};
