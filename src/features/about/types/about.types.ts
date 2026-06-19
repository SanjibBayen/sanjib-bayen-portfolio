/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

export interface SocialLink {
  url: string;
  handle: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  duration: string;
}

export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  bullets: string[];
}

export interface Technologies {
  languages: string[];
  frameworks: string[];
  backend: string[];
  database: string[];
  aiAndDataScience: string[];
  coreCS: string[];
  tools: string[];
}

export interface ProfileData {
  avatarUrl: string;
  name: string;
  handle: string;
  email: string;
  phone: string;
  location: string;
  github: SocialLink[];
  linkedin: SocialLink[];
  instagram: SocialLink[];
  twitter: SocialLink[];
  facebook: SocialLink[];
  bio: string;
  roles: string[];
  focus: string[];
  philosophy: string;
  currentlyBuilding: string[];
  researchAreas: string[];
  activeProjects: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: string[];
  technologies: Technologies;
  hobbies: string[];
  mission: string;
}

export interface TerminalDataQuery {
  type: 'whoami' | 'skills' | 'specs' | 'projects' | 'tech' | 'education' | 'experience' | 'research' | 'contact' | 'profile' | 'stats';
  filter?: string;
}
