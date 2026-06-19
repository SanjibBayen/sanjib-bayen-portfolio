/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { VFSNode } from '@/types';
import { TechNode, TechLink } from '../types/skill.types';

export const techGraphNodes: Record<string, TechNode> = {
  // 1. AI & Data Science (Top Left Grid)
  "Python": {
    id: "Python",
    name: "Python",
    category: "AI/ML",
    type: "language",
    color: "#3776AB",
    description: "Versatile programming language widely used for artificial intelligence, machine learning, data engineering, and backend microservices.",
    projects: ["Disease Prediction AI", "Hybrid AI System for Lunar Landslide & Boulder Detection"],
    coords: { x: 65, y: 90 }
  },
  "Scikit": {
    id: "Scikit",
    name: "Scikit-learn",
    category: "AI/ML",
    type: "library",
    color: "#F7931E",
    description: "State-of-the-art machine learning library for predictive data analysis including Random Forest, SVM, gradient boosting, and clustering.",
    projects: ["Disease Prediction AI"],
    coords: { x: 65, y: 170 }
  },
  "Pandas": {
    id: "Pandas",
    name: "Pandas",
    category: "AI/ML",
    type: "library",
    color: "#3852D4",
    description: "High-performance data manipulation and analysis library using DataFrame structures for structured clinical and space imagery files.",
    projects: ["Disease Prediction AI", "Hybrid AI System for Lunar Landslide & Boulder Detection"],
    coords: { x: 225, y: 90 }
  },
  "NumPy": {
    id: "NumPy",
    name: "NumPy",
    category: "AI/ML",
    type: "library",
    color: "#4DABCF",
    description: "Fundamental package for scientific computing with powerful N-dimensional array processing and advanced matrix calculations.",
    projects: ["Disease Prediction AI", "Hybrid AI System for Lunar Landslide & Boulder Detection"],
    coords: { x: 145, y: 90 }
  },
  "Matplotlib": {
    id: "Matplotlib",
    name: "Matplotlib",
    category: "AI/ML",
    type: "library",
    color: "#11557c",
    description: "Comprehensive scientific charting library for generating high-quality publications, charts, heatmaps, and spatial risk indices.",
    projects: ["Disease Prediction AI", "Hybrid AI System for Lunar Landslide & Boulder Detection"],
    coords: { x: 65, y: 250 }
  },
  "PyTorch": {
    id: "PyTorch",
    name: "PyTorch",
    category: "AI/ML",
    type: "library",
    color: "#EE4C2C",
    description: "Deep learning framework for training neural network classifiers, convolutional layers (CNNs), and spatial terrain anomaly estimators.",
    projects: ["Hybrid AI System for Lunar Landslide & Boulder Detection"],
    coords: { x: 145, y: 170 }
  },
  "OpenCV": {
    id: "OpenCV",
    name: "OpenCV",
    category: "AI/ML",
    type: "library",
    color: "#279632",
    description: "Real-time computer vision toolkit for lunar imagery processing, feature matching, boulder masking, and landslide segmentations.",
    projects: ["Hybrid AI System for Lunar Landslide & Boulder Detection"],
    coords: { x: 225, y: 170 }
  },
  "SMOTE": {
    id: "SMOTE",
    name: "SMOTE & Imbalanced Data Handling",
    category: "AI/ML",
    type: "paradigm",
    color: "#a21caf",
    description: "Advanced techniques for balancing minority labels in medical datasets to maximize neural prediction stability and clinical recall levels.",
    projects: ["Disease Prediction AI"],
    coords: { x: 145, y: 250 }
  },
  "FeatureEngineering": {
    id: "FeatureEngineering",
    name: "Feature Engineering",
    category: "AI/ML",
    type: "paradigm",
    color: "#0369a1",
    description: "Extracting mathematical features from physiological parameters and lunar terrain data to amplify model metrics.",
    projects: ["Disease Prediction AI", "Hybrid AI System for Lunar Landslide & Boulder Detection"],
    coords: { x: 105, y: 320 }
  },
  "DataPreprocessing": {
    id: "DataPreprocessing",
    name: "Data Preprocessing",
    category: "AI/ML",
    type: "paradigm",
    color: "#1d4ed8",
    description: "Robust data cleaning pipelines to normalize input vectors, fill blank parameters, and format clinical profiles for model training.",
    projects: ["Disease Prediction AI", "Hybrid AI System for Lunar Landslide & Boulder Detection"],
    coords: { x: 185, y: 320 }
  },

  // 2. Frontend (Top Right Grid)
  "JavaScript": {
    id: "JavaScript",
    name: "JavaScript",
    category: "Frontend",
    type: "language",
    color: "#F7DF1E",
    description: "Core scripting engine enabling modern interactive client environments, asynchronous flows, and responsive UI behaviors.",
    projects: ["AI-Based Intelligent Chess System", "ShutterSync Studios"],
    coords: { x: 575, y: 160 }
  },
  "TypeScript": {
    id: "TypeScript",
    name: "TypeScript",
    category: "Frontend",
    type: "language",
    color: "#3178C6",
    description: "Typed superset of JavaScript providing compile-time type-safety models, strict interfaces, and durable codebase architecture.",
    projects: ["AI-Based Intelligent Chess System", "Disease Prediction AI"],
    coords: { x: 695, y: 160 }
  },
  "HTML": {
    id: "HTML",
    name: "HTML",
    category: "Frontend",
    type: "language",
    color: "#E34F26",
    description: "Standard markup schema structuring standard DOM layouts, visual headers, interactive canvases, and safe iframe blocks.",
    projects: ["AI-Based Intelligent Chess System", "Disease Prediction AI", "ShutterSync Studios"],
    coords: { x: 575, y: 90 }
  },
  "CSS": {
    id: "CSS",
    name: "CSS",
    category: "Frontend",
    type: "language",
    color: "#1572B6",
    description: "Design orchestration files compiling custom animations, flexible flexbox structures, and layout styling metrics.",
    projects: ["AI-Based Intelligent Chess System", "Disease Prediction AI"],
    coords: { x: 695, y: 90 }
  },
  "React": {
    id: "React",
    name: "React.js",
    category: "Frontend",
    type: "framework",
    color: "#61DAFB",
    description: "Component-based declarative frontend library for designing highly reactive user interfaces and advanced web apps.",
    projects: ["AI-Based Intelligent Chess System", "Disease Prediction AI"],
    coords: { x: 575, y: 230 }
  },
  "Nextjs": {
    id: "Nextjs",
    name: "Next.js",
    category: "Frontend",
    type: "framework",
    color: "#000000",
    description: "Powerful React framework supporting server-side rendering (SSR), static site generation, and optimized image processing modules.",
    projects: ["ShutterSync Studios"],
    coords: { x: 695, y: 230 }
  },
  "Tailwind": {
    id: "Tailwind",
    name: "TailwindCSS",
    category: "Frontend",
    type: "library",
    color: "#06B6D4",
    description: "Utility-first CSS framework for rapid interface development, allowing robust layout creation directly in HTML markup.",
    projects: ["AI-Based Intelligent Chess System", "Disease Prediction AI", "ShutterSync Studios"],
    coords: { x: 575, y: 300 }
  },
  "Bootstrap": {
    id: "Bootstrap",
    name: "Bootstrap",
    category: "Frontend",
    type: "library",
    color: "#7952B3",
    description: "Classic frontend toolkit for fast mobile-responsive layouts using pre-compiled grids, containers, and component styles.",
    projects: ["Disease Prediction AI"],
    coords: { x: 695, y: 300 }
  },

  // 3. Backend & Server-Side (Bottom Left Grid)
  "Nodejs": {
    id: "Nodejs",
    name: "Node.js",
    category: "Backend",
    type: "backend",
    color: "#339933",
    description: "Asynchronous event-driven JavaScript runtime executing server-side logic and highly parallel microservice APIs.",
    projects: ["AI-Based Intelligent Chess System"],
    coords: { x: 75, y: 390 }
  },
  "Expressjs": {
    id: "Expressjs",
    name: "Express.js",
    category: "Backend",
    type: "framework",
    color: "#c0c0c0",
    description: "Minimalist and flexible web framework for Node.js powering secure API gateway endpoints and custom middleware routers.",
    projects: ["AI-Based Intelligent Chess System"],
    coords: { x: 175, y: 390 }
  },
  "Webhooks": {
    id: "Webhooks",
    name: "Webhooks",
    category: "Backend",
    type: "paradigm",
    color: "#EA580C",
    description: "Automated real-time event alerts triggered by database modifications or external communication requests.",
    projects: ["AI-Based Intelligent Chess System"],
    coords: { x: 75, y: 460 }
  },
  "FastAPI": {
    id: "FastAPI",
    name: "FastAPI",
    category: "Backend",
    type: "framework",
    color: "#059669",
    description: "High-performance Python web API framework featuring asynchronous coroutines, type checking via Pydantic, and automatic Swagger docs.",
    projects: ["Disease Prediction AI"],
    coords: { x: 175, y: 460 }
  },
  "Java": {
    id: "Java",
    name: "Java",
    category: "Backend",
    type: "language",
    color: "#5382a1",
    description: "Object-oriented programming language designed for platform-independent enterprise backend applications and server clusters.",
    projects: ["AI-Based Intelligent Chess System"],
    coords: { x: 125, y: 520 }
  },

  // 4. Database (Bottom Middle Cluster)
  "Firestore": {
    id: "Firestore",
    name: "Firestore",
    category: "Database",
    type: "database",
    color: "#FFA000",
    description: "Flexible, serverless NoSQL document database that enables live data synchronization, secure authorization rules, and offline caching.",
    projects: ["AI-Based Intelligent Chess System", "ShutterSync Studios"],
    coords: { x: 330, y: 390 }
  },
  "SQL": {
    id: "SQL",
    name: "SQL",
    category: "Database",
    type: "database",
    color: "#00758F",
    description: "Relational database querying for structuring normalized tables, complex multi-key joins, index triggers, and secure transaction logs.",
    projects: ["Disease Prediction AI"],
    coords: { x: 450, y: 390 }
  },
  "Oracle": {
    id: "Oracle",
    name: "Oracle Database",
    category: "Database",
    type: "database",
    color: "#F1110E",
    description: "Enterprise-grade multi-model relational database cluster with robust ACID guarantees, spatial capabilities, and PL/SQL procedures.",
    projects: ["Disease Prediction AI"],
    coords: { x: 390, y: 480 }
  },

  // 5. Core CS (Bottom Right Grid)
  "DSA": {
    id: "DSA",
    name: "Data Structures & Algorithms",
    category: "Core CS",
    type: "paradigm",
    color: "#E91E63",
    description: "Core algorithms including graphs, binary trees, sorting algorithms, Minimax evaluation trees, and Big O computational optimization.",
    projects: ["AI-Based Intelligent Chess System"],
    coords: { x: 575, y: 390 }
  },
  "OOP": {
    id: "OOP",
    name: "OOP",
    category: "Core CS",
    type: "paradigm",
    color: "#9C27B0",
    description: "Object-oriented principles (Inheritance, Polymorphism, Abstraction, and Encapsulation) that organize production software patterns.",
    projects: ["AI-Based Intelligent Chess System", "Disease Prediction AI"],
    coords: { x: 695, y: 390 }
  },
  "SysDesign": {
    id: "SysDesign",
    name: "System Design Basics",
    category: "Core CS",
    type: "paradigm",
    color: "#673AB7",
    description: "Designing low-latency client-server flows, horizontal scaling routes, cache proxies, and concurrent session storage engines.",
    projects: ["AI-Based Intelligent Chess System", "Disease Prediction AI"],
    coords: { x: 575, y: 460 }
  },
  "DbDesign": {
    id: "DbDesign",
    name: "Database Design Principles",
    category: "Core CS",
    type: "paradigm",
    color: "#3F51B5",
    description: "Designing properly normalized database schemas, primary-foreign index keys, query constraints, and robust table layout logic.",
    projects: ["Disease Prediction AI", "AI-Based Intelligent Chess System"],
    coords: { x: 695, y: 460 }
  },
  "C": {
    id: "C",
    name: "C",
    category: "Core CS",
    type: "language",
    color: "#A8B9CC",
    description: "Procedural system programming language providing manual heap/stack pointers, low assembly overhead and direct system bindings.",
    projects: ["AI-Powered Autonomous Drone Systems"],
    coords: { x: 575, y: 525 }
  },
  "Cpp": {
    id: "Cpp",
    name: "C++",
    category: "Core CS",
    type: "language",
    color: "#00599C",
    description: "Object-oriented systems compile-to-metal language widely used in fast game loops, embedded systems, and machine learning matrices.",
    projects: ["AI-Powered Autonomous Drone Systems"],
    coords: { x: 695, y: 525 }
  },

  // 6. Developer Tools (Top Middle Grid)
  "Git": {
    id: "Git",
    name: "Git & GitHub",
    category: "Tools",
    type: "tool",
    color: "#F05032",
    description: "Distributed version control system to coordinate task changes in source trees, review request branches, and coordinate automated pipelines.",
    projects: ["Disease Prediction AI", "AI-Based Intelligent Chess System", "Hybrid AI System for Lunar Landslide & Boulder Detection"],
    coords: { x: 335, y: 110 }
  },
  "Vercel": {
    id: "Vercel",
    name: "Vercel",
    category: "Tools",
    type: "tool",
    color: "#000000",
    description: "Cloud serverless platform tailored for instant frontend deployments, edge servers, routes proxying, and quick routing mappings.",
    projects: ["AI-Based Intelligent Chess System", "Disease Prediction AI"],
    coords: { x: 445, y: 110 }
  },
  "Jupyter": {
    id: "Jupyter",
    name: "Jupyter Notebook",
    category: "Tools",
    type: "tool",
    color: "#F37626",
    description: "Interactive notebook workspace where developers compile Markdown explanations, write Python codes, and visualize charts inline.",
    projects: ["Disease Prediction AI", "Hybrid AI System for Lunar Landslide & Boulder Detection"],
    coords: { x: 335, y: 215 }
  },
  "Linux": {
    id: "Linux",
    name: "Linux",
    category: "Tools",
    type: "tool",
    color: "#FCC624",
    description: "Standard terminal environments for executing process controllers, system dæmons, cron timing sheets, and network bindings.",
    projects: ["AI-Powered Autonomous Drone Systems", "Disease Prediction AI"],
    coords: { x: 445, y: 215 }
  }
};

export const techGraphLinks: TechLink[] = [
  // AI & Data Science
  { source: "Python", target: "Scikit", type: "hierarchical" },
  { source: "Python", target: "PyTorch", type: "hierarchical" },
  { source: "Python", target: "FastAPI", type: "hierarchical" },
  { source: "Scikit", target: "SMOTE", type: "hierarchical" },
  { source: "Scikit", target: "FeatureEngineering", type: "hierarchical" },
  { source: "Scikit", target: "DataPreprocessing", type: "hierarchical" },
  { source: "NumPy", target: "Pandas", type: "linear" },
  { source: "Pandas", target: "Matplotlib", type: "hierarchical" },
  { source: "PyTorch", target: "OpenCV", type: "linear" },

  // Frontend connections
  { source: "JavaScript", target: "TypeScript", type: "linear" },
  { source: "TypeScript", target: "React", type: "hierarchical" },
  { source: "React", target: "Nextjs", type: "hierarchical" },
  { source: "HTML", target: "CSS", type: "linear" },
  { source: "React", target: "Tailwind", type: "linear" },
  { source: "React", target: "Bootstrap", type: "linear" },

  // Backend links
  { source: "Nodejs", target: "Expressjs", type: "hierarchical" },
  { source: "Expressjs", target: "Webhooks", type: "hierarchical" },
  { source: "TypeScript", target: "Nodejs", type: "linear" },

  // Database connections
  { source: "SQL", target: "Oracle", type: "linear" },
  { source: "Expressjs", target: "Firestore", type: "linear" },
  { source: "FastAPI", target: "SQL", type: "linear" },

  // Core CS
  { source: "DSA", target: "OOP", type: "linear" },
  { source: "OOP", target: "Java", type: "hierarchical" },
  { source: "OOP", target: "Cpp", type: "hierarchical" },
  { source: "C", target: "Cpp", type: "hierarchical" },
  { source: "SysDesign", target: "DbDesign", type: "linear" },

  // Tools
  { source: "Git", target: "Vercel", type: "linear" },
  { source: "Jupyter", target: "Python", type: "linear" },
  { source: "Linux", target: "C", type: "linear" }
];

export const skillsFolder: VFSNode = {
  name: "skills",
  type: "folder",
  path: "skills",
  children: [
    {
      name: "skills.pkt",
      type: "file",
      path: "skills/skills.pkt",
      language: "pkt",
      content: `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Network, Cpu, Database, Layout } from 'lucide-react';

export default function ConnectedGraph() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  return (
    <div className="p-6 bg-[#090d16] text-white rounded-2xl border border-[#1e293b] shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <Network className="text-emerald-400 w-6 h-6 animate-pulse" />
        <h2 className="text-xl font-bold tracking-tight">Tech Stack Connected Graph</h2>
      </div>
      <p className="text-neutral-400 text-sm mb-6 leading-relaxed">
        Space Telemetry Network.
      </p>
    </div>
  );
}`
    }
  ]
};

export default techGraphNodes;
