/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult, CommandOutputLine } from '../types/terminal';
import { PROJECTS_DATA } from '../../projects';

export const sqlite3Command: Command = {
  name: 'sqlite3',
  description: 'Run SQL query rows directly on portfolio database',
  execute: (ctx): CommandResult => {
    const matchSql = ctx.rawCommand.match(/sqlite3\s+portfolio\.db\s+"([^"]+)"/i);
    const output: CommandOutputLine[] = [];

    if (matchSql) {
      const sqlQuery = matchSql[1];
      output.push(
        { text: `[DATABASE] Connecting virtual SQLite engine to portfolio.db...`, type: 'system' },
        { text: `[DATABASE] Optimizing indexes and executing schema query...`, type: 'system' },
        { text: ``, type: 'output' }
      );

      let results = [...PROJECTS_DATA];
      
      const catMatch = sqlQuery.match(/category\s*=\s*'([^']+)'/i);
      const nameMatch = sqlQuery.match(/name\s*LIKE\s*'%([^%]+)%'/i);
      
      if (catMatch) {
         const categoryVal = catMatch[1].toUpperCase();
         results = results.filter(p => p.category.toUpperCase() === categoryVal);
      }
      if (nameMatch) {
         const nameVal = nameMatch[1].toLowerCase();
         results = results.filter(p => p.name.toLowerCase().includes(nameVal));
      }

      const orderMatch = sqlQuery.match(/ORDER\s+BY\s+(\w+)\s+(ASC|DESC)/i);
      if (orderMatch) {
        const field = orderMatch[1].toLowerCase();
        const dir = orderMatch[2].toUpperCase();
        results.sort((a, b) => {
          let comparison = 0;
          if (field === 'id') comparison = a.id - b.id;
          else if (field === 'name') comparison = a.name.localeCompare(b.name);
          else if (field === 'category') comparison = a.category.localeCompare(b.category);
          else if (field === 'status') comparison = a.status.localeCompare(b.status);
          return dir === 'ASC' ? comparison : -comparison;
        });
      }

      if (results.length === 0) {
         output.push({ text: `(0 rows fetched)`, type: 'system' });
      } else {
         output.push(
           { text: `+----+--------------------------------------------+------------------+-------------+`, type: 'output' },
           { text: `| ID | PROJECT NAME                               | CATEGORY         | STATUS      |`, type: 'success' },
           { text: `+----+--------------------------------------------+------------------+-------------+`, type: 'output' }
         );
         
         results.forEach(p => {
           const idStr = String(p.id).padEnd(2);
           const nameStr = p.name.substring(0, 42).padEnd(42);
           const catStr = p.category.substring(0, 16).padEnd(16);
           const statusStr = p.status.substring(0, 11).padEnd(11);
           
           output.push({ text: `| ${idStr} | ${nameStr} | ${catStr} | ${statusStr} |`, type: 'output' });
         });

         output.push(
           { text: `+----+--------------------------------------------+------------------+-------------+`, type: 'output' },
           { text: `(${results.length} row(s) returned successfully)`, type: 'success' }
         );
      }
    } else {
      output.push({ text: `sqlite3: Invalid SQL container wrapper format. Usage: sqlite3 portfolio.db "[SELECT_QUERY]"`, type: 'error' });
    }

    return { output };
  }
};
