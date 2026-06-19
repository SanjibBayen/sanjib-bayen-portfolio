/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult, CommandOutputLine } from '../types/terminal';
import { PROFILE_DATA } from '../../about';

export const curlCommand: Command = {
  name: 'curl',
  description: 'Simulates connection probing (e.g., curl /v1/contact)',
  execute: (ctx): CommandResult => {
    const fullArg = ctx.args.join(' ');
    const output: CommandOutputLine[] = [];

    if (fullArg.includes('/api/v1/contact') || fullArg.includes('/v1/contact')) {
      output.push(
        { text: '  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current', type: 'system' },
        { text: '100   324  100   244  100    80    480    120 --:--:-- --:--:-- --:--:--   600', type: 'system' },
        { text: '* Connected to api.sanjib-bayen.dev (104.21.34.192) port 443 (#0)', type: 'system' },
        { text: '* SSL connection using TLSv1.3 / AEAD-AES256-GCM-SHA384', type: 'system' },
        { text: '> POST /v1/contact HTTP/2', type: 'system' },
        { text: '< HTTP/2 200', type: 'system' },
        { text: '{', type: 'success' },
        { text: '  "status": 200,', type: 'success' },
        { text: '  "success": true,', type: 'success' },
        { text: `  "message": "API POST SUCCESS: Message routed to ${PROFILE_DATA.email}",`, type: 'success' },
        { text: `  "timestamp": "${new Date().toISOString()}"`, type: 'success' },
        { text: '}', type: 'success' }
      );
    } else {
      output.push({ text: 'curl: API access outside of contact gateway is offline.', type: 'error' });
    }

    return { output };
  }
};
