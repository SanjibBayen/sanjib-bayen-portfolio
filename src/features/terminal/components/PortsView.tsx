/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { toast } from '@/shared/utils/toast';

export default function PortsView() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar font-mono text-xs p-4 text-left select-text" id="terminal-ports-view">
      <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
        <span className="text-slate-400 font-bold">FORWARDED PORTS</span>
        <button 
          onClick={() => toast.success("Ports updated.")}
          className="p-1 hover:bg-neutral-850 rounded transition cursor-pointer bg-transparent border-0 text-inherit"
          title="Reload active handles"
          id="btn-ports-reload"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
      <table className="w-full text-[11px] text-slate-400">
        <thead>
          <tr className="text-neutral-500 border-b border-neutral-900">
            <th className="text-left py-1 font-semibold">Port</th>
            <th className="text-left py-1 font-semibold">Process</th>
            <th className="text-left py-1 font-semibold">Local Address</th>
            <th className="text-left py-1 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-neutral-850/30">
            <td className="py-1 text-sky-400 font-bold">3000</td>
            <td className="py-1 text-slate-300">Vite React Dev Server</td>
            <td className="py-1">http://127.0.0.1:3000</td>
            <td className="py-1 text-emerald-400">● Active Ingress</td>
          </tr>
          <tr className="hover:bg-neutral-850/30">
            <td className="py-1 text-amber-500 font-bold">5001</td>
            <td className="py-1 text-slate-300">Edge Simulation Loop</td>
            <td className="py-1">localhost/sim-serial</td>
            <td className="py-1 text-amber-400">● Pending Attach</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
