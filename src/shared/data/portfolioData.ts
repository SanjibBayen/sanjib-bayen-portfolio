/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { VFSNode } from '@/types';
import { aboutFolder, achievementsFolder, gitignoreFile, licenseFile } from '@/features/about';
import { projectsFolder } from '@/features/projects';
import { researchFolder } from '@/features/research';
import { skillsFolder } from '@/features/skills';
import { connectFolder } from '@/features/contact';

// Re-export VFSNode so legacy imports continue working seamlessly
export type { VFSNode };

export const VFS_DATA: VFSNode[] = [
  aboutFolder,
  projectsFolder,
  researchFolder,
  achievementsFolder,
  skillsFolder,
  connectFolder,
  gitignoreFile,
  licenseFile
];
