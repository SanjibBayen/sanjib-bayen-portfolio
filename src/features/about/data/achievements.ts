/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { VFSNode } from '@/types';
import { Achievement } from '../types/achievement.types';

export const achievementsData: Achievement[] = [
  {
    id: 'studies-commencement',
    date: '2024-03-10',
    timestamp: '2024-03-10 10:00:00',
    category: 'milestone',
    title: 'Advanced Studies in AI & Machine Learning',
    description: 'Began focused study and development in Artificial Intelligence, Machine Learning, and Computer Vision.',
    metadata: {
      organization: 'Brainware University'
    }
  },
  {
    id: 'esp32-embedded-systems',
    date: '2024-06-20',
    timestamp: '2024-06-20 14:15:00',
    category: 'project',
    title: 'ESP32 Embedded Systems Development',
    description: 'Developed multiple embedded systems prototypes using Arduino and ESP32 platforms.',
    metadata: {
      organization: 'Personal Project'
    }
  },
  {
    id: 'esp32-flappy-bird',
    date: '2024-09-05',
    timestamp: '2024-09-05 18:30:00',
    category: 'project',
    title: 'ESP32 Flappy Bird Game',
    description: 'Built a Flappy Bird style game running entirely on ESP32 hardware.',
    metadata: {
      organization: 'Personal Project'
    }
  },
  {
    id: 'smart-bengal-hackathon',
    date: '2025-03-29',
    timestamp: '2025-03-29 11:00:00',
    category: 'hackathon',
    title: 'Smart Bengal Hackathon 2025',
    description: 'Participated in Smart Bengal Hackathon 2025 with Explainable AI project "AI That Explains Itself: No More Black Boxes".',
    metadata: {
      organization: 'Smart Bengal Hackathon'
    }
  },
  {
    id: 'msme-idea-hackathon',
    date: '2025-04-29',
    timestamp: '2025-04-29 09:45:00',
    category: 'hackathon',
    title: 'MSME Idea Hackathon 3.0',
    description: 'Submitted AI-Powered Disaster Rescue Drone proposal for MSME Idea Hackathon 3.0.',
    metadata: {
      organization: 'MSME'
    }
  },
  {
    id: 'chess-platform',
    date: '2025-05-06',
    timestamp: '2025-05-06 15:00:00',
    category: 'project',
    title: 'Online Chess Platform',
    description: 'Developed a Chess.com-inspired platform using React, TypeScript, and Firebase.',
    metadata: {
      organization: 'Personal Project'
    }
  },
  {
    id: 'college-management-system',
    date: '2025-05-07',
    timestamp: '2025-05-07 16:00:00',
    category: 'project',
    title: 'College Management System',
    description: 'Designed and developed a student-teacher management platform with attendance and communication features.',
    metadata: {
      organization: 'Academic Project'
    }
  },
  {
    id: 'autonomous-drones',
    date: '2025-06-24',
    timestamp: '2025-06-24 13:20:00',
    category: 'project',
    title: 'Autonomous Drone Systems',
    description: 'Started development of autonomous drone systems using ESP32 and BLDC motors.',
    metadata: {
      organization: 'Robotics Project'
    }
  },
  {
    id: 'isro-lunar-ai',
    date: '2025-07-04',
    timestamp: '2025-07-04 10:00:00',
    category: 'research',
    title: 'Lunar Landslide & Boulder Detection AI',
    description: 'Developed a Hybrid Physics-Aware AI system for lunar landslide and boulder detection using Chandrayaan datasets.',
    metadata: {
      organization: 'ISRO Hackathon Research'
    }
  },
  {
    id: 'ensemble-ml-pipeline',
    date: '2025-07-14',
    timestamp: '2025-07-14 16:40:00',
    category: 'ai',
    title: 'Advanced Ensemble Machine Learning Pipeline',
    description: 'Developed an ensemble machine learning pipeline using Random Forest, XGBoost, LightGBM, and MLP models.',
    metadata: {
      organization: 'Machine Learning Research'
    }
  },
  {
    id: 'iccret-publication',
    date: '2026-06-05',
    timestamp: '2026-06-05 10:30:00',
    category: 'publication',
    title: 'ICCRET 2026 Research Publication',
    description: 'Published research paper in ICCRET 2026 proceedings.',
    metadata: {
      organization: 'ICCRET 2026'
    }
  }
];

const generateTimelineLogContent = (data: Achievement[]): string => {
  return data.map(item => `[${item.timestamp}] [${item.category.toUpperCase()}] ${item.description}`).join('\n') + '\n';
};

export const achievementsFolder: VFSNode = {
  name: "achievements",
  type: "folder",
  path: "achievements",
  children: [
    {
      name: "timeline.log",
      type: "file",
      path: "achievements/timeline.log",
      language: "plaintext",
      content: generateTimelineLogContent(achievementsData)
    }
  ]
};
