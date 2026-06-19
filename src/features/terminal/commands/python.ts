/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { Command, CommandResult, CommandOutputLine } from '../types/terminal';
import { PROFILE_DATA } from '../../about';

export const pythonCommand: Command = {
  name: 'python',
  description: 'Executes python script simulations for ipynb cells',
  execute: (ctx): CommandResult => {
    const pyMatch = ctx.rawCommand.match(/python\s+run_cell\.py\s+--notebook\s+research\.ipynb\s+(?:--cell\s+"([^"]+)"|(--all))/i);
    const output: CommandOutputLine[] = [];

    if (pyMatch) {
      const cellKey = pyMatch[1];
      const isAll = !cellKey && !!pyMatch[2];
      
      if (isAll) {
        output.push(
          { text: '[JUPYTER] Initializing python-3.11 conda environment...', type: 'system' },
          { text: '[JUPYTER] Loading research.ipynb notebook structure...', type: 'system' },
          { text: '[JUPYTER] Running full sequence execution...', type: 'output' },
          { text: '  - Executing Cell [intro] (Markdown/Setup): OK', type: 'success' },
          { text: '  - Executing Cell [lunar-landslide-detection-load] (Model Load): Complete in 0.4s', type: 'success' },
          { text: '  - Executing Cell [healthcare-diagnosis-risk] (Data Munging): Complete in 0.2s', type: 'success' },
          { text: '  - Executing Cell [drone-swarm-lora-simulation] (Network Compile): Complete in 0.5s', type: 'success' },
          { text: '[JUPYTER] Kernels shut down. WebAssembly data payload updated.', type: 'success' }
        );
      } else if (cellKey) {
        output.push({ text: `[JUPYTER] Running cell code block: "${cellKey}"...`, type: 'system' });
        if (cellKey === 'intro') {
          output.push(
            { text: '>>> import matplotlib.pyplot as plt', type: 'output' },
            { text: '>>> import pandas as pd', type: 'output' },
            { text: `>>> print("${PROFILE_DATA.name} Research System: Online")`, type: 'output' },
            { text: `${PROFILE_DATA.name} Research System: Online`, type: 'success' }
          );
        } else if (cellKey.includes('load')) {
          output.push(
            { text: '>>> Loading PyTorch neural model checkpoint...', type: 'output' },
            { text: '>>> Device assigned: NVIDIA Ampere CUDA core (32 Tensor Cores active)', type: 'output' },
            { text: '>>> Convolutional layers dimensions successfully allocated in cache.', type: 'success' }
          );
        } else {
          output.push(
            { text: `>>> Running interactive calculations for ${cellKey}...`, type: 'output' },
            { text: `✔ Task finished. Process exit code: 0`, type: 'success' }
          );
        }
      }
    } else {
      output.push({ text: `python: Sandbox restrictions prevent generic python script executions.`, type: 'error' });
    }

    return { output };
  }
};
