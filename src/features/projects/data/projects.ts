/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { VFSNode } from '@/types';
import { Project } from '../types/project.types';

export const PROJECTS_DATA: Project[] = [
  {
    id: 1,
    name: "Prediction of Health & Lifestyle Diseases",
    category: "Personal Project",
    startDate: "2025",
    endDate: null,
    status: "DEPLOYED",
    summary:
      "AI-powered healthcare prediction platform using FastAPI, React, and Machine Learning for assessing disease risks and providing personalized health insights.",
    description:
      "Developed a full-stack healthcare prediction system featuring FastAPI backend APIs and a React + Vite frontend. Implemented machine learning models for Diabetes, Hypertension, Cardiovascular Disease, Stroke, Asthma, Sleep Disorders, and Mental Health analysis. Integrated NLP-based mental health prediction using Transformers and deployed the platform using Render and Vercel.",
    techStack: [
      "Python",
      "FastAPI",
      "Scikit-Learn",
      "XGBoost",
      "Transformers",
      "React",
      "TypeScript",
      "Vite",
      "TailwindCSS",
      "Docker",
      "Render",
      "Vercel"
    ],
    architectureDiagram:
      "[React + Vite Frontend] -> [FastAPI Backend] -> [ML/NLP Models] -> [Prediction & Recommendation Engine]",
    metrics: {
      Models: "7",
      Frontend: "React + TypeScript",
      Backend: "FastAPI",
      Deployment: "Render + Vercel"
    },
    githubUrl: "https://github.com/SanjibBayen/disease-prediction",
    liveDemoUrl: "https://disease-prediction-beige.vercel.app",
    documentationUrl: "https://disease-prediction-72fh.onrender.com/docs"
  },
  {
    id: 2,
    name: "AI-Based Intelligent Chess System",
    category: "Personal Project",
    startDate: "2025",
    endDate: null,
    status: "DEPLOYED",
    summary:
      "Online chess platform with multiplayer gameplay, Firebase authentication, real-time synchronization, and AI opponent support.",
    description:
      "Built a Chess.com-inspired chess application using React, TypeScript, Firebase, and Node.js. Implemented authentication, matchmaking, legal move validation, game state synchronization, leaderboards, and AI opponent functionality.",
    techStack: [
      "React",
      "TypeScript",
      "Firebase",
      "Node.js",
      "Express",
      "TailwindCSS"
    ],
    architectureDiagram:
      "[React Client] <-> [Firebase Authentication] <-> [Realtime Database] <-> [Game Engine]",
    githubUrl: "https://github.com/SanjibBayen/intelligent-chess",
    liveDemoUrl: "https://chess-sanjib-bayen.vercel.app/"
  },
  {
    id: 3,
    name: "Hybrid AI System for Lunar Landslide & Boulder Detection",
    category: "Personal Project",
    startDate: "2025",
    endDate: null,
    status: "IN_PROGRESS",
    summary:
      "Physics-aware AI system for detecting lunar landslides and boulders using Chandrayaan imagery and terrain data.",
    description:
      "Developing a hybrid AI framework combining Computer Vision, CNN models, terrain analysis, and physics-aware reasoning for lunar hazard detection. The system processes Chandrayaan TMC, OHRC, and DTM datasets to identify landslides, detect boulders, estimate dimensions, and generate explainable geological reports.",
    techStack: [
      "Python",
      "PyTorch",
      "OpenCV",
      "NumPy",
      "Pandas",
      "Rasterio",
      "Matplotlib"
    ],
    architectureDiagram:
      "[Chandrayaan Data] -> [Preprocessing] -> [CNN Detection] -> [Terrain Analysis] -> [Explainable Hazard Reports]",
    githubUrl: "https://github.com/SanjibBayen/lunar-hazard-detection"
  },
  {
    id: 4,
    name: "MBC Chicken Express",
    category: "Works",
    startDate: "2025",
    endDate: null,
    status: "DEPLOYED",
    summary:
      "Modern poultry e-commerce platform supporting product browsing, cart management, scheduled deliveries, payments, and smart recommendations.",
    description:
      "Developed a responsive e-commerce platform for fresh chicken delivery. Features include product catalog management, shopping cart, checkout workflows, delivery scheduling, order tracking, customer reviews, and recommendation systems.",
    techStack: [
      "Next.js",
      "React",
      "TypeScript",
      "Firebase",
      "Firestore",
      "TailwindCSS"
    ],
    architectureDiagram:
      "[Next.js Frontend] -> [Firebase Services] -> [Firestore Database] -> [Order Management System]",
    githubUrl: "https://github.com/SanjibBayen/MBC_Chiken"
  }
];

export const projectsFolder: VFSNode = {
  name: "projects",
  type: "folder",
  path: "projects",
  children: [
    {
      name: "portfolio.db",
      type: "file",
      path: "projects/portfolio.db",
      language: "sql",
      content: `-- Oracle Database (ORCL) SELECT statement for Projects\nSELECT id, name, category, status, tech_stack\nFROM projects\nORDER BY id ASC;\n\n/* \nNote: Click any project row to execute a sub-query\nand fetch detailed technical metrics, system architecture \ndiagrams, or interactive mock API endpoints.\n*/`
    }
  ]
};
