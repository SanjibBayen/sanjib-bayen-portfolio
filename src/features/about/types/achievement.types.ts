/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

export interface Achievement {
  id: string;
  date: string;
  timestamp: string;
  category: 'hackathon' | 'certification' | 'publication' | 'milestone' | 'competition' | 'rank' | 'project' | 'research' | 'founder' | 'ai';
  title: string;
  description: string;
  metadata?: {
    rank?: string;
    organization?: string;
    credential?: string;
    link?: string;
    score?: string;
  };
}
