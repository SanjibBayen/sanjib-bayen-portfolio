/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

export interface ProjectApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
}

export interface Project {
  id: number;
  name: string;
  category: string;
  startDate: string;
  endDate: string | null;
  status: 'DEPLOYED' | 'PRIVATE' | 'IN_PROGRESS' | 'STAGED';
  summary: string;
  description: string;
  architectureDiagram?: string;
  techStack: string[];
  screenshots?: string[];
  metrics?: Record<string, string>;
  apiEndpoints?: ProjectApiEndpoint[];
  githubUrl?: string;
  liveDemoUrl?: string;
  documentationUrl?: string;
}
