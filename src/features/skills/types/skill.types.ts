/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

export interface TechNode {
  id: string;
  name: string;
  category: 'AI/ML' | 'Frontend' | 'Backend' | 'Database' | 'Core CS' | 'Tools';
  type: 'language' | 'framework' | 'library' | 'paradigm' | 'application' | 'frontend' | 'backend' | 'database' | 'tool';
  description: string;
  projects: string[];
  coords: { x: number; y: number };
  color: string;
}

export interface TechLink {
  source: string;
  target: string;
  type: 'hierarchical' | 'linear';
}
