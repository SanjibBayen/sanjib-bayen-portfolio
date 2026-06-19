/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

export interface ResearchMetric {
  label: string;
  value: string;
}

export interface ResearchLink {
  label: string;
  url: string;
}

export interface ResearchPaper {
  id: string;
  title: string;
  category: string;
  status: 'Completed' | 'In Progress'| 'Under Review' | 'Draft';
  year: number;
  summary: string;
  description?: string;
  accuracy?: string;
  dataset: string[];
  metrics: ResearchMetric[];
  technologies: string[];
  links?: ResearchLink[];
  notebookOutputs?: string[];
  authors?: string[];
  journal?: string;
  doi?: string;
  conference?: string;
  bestModel?: string;
  pipelineStages?: string[];
}
