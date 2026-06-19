/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { VFSNode } from '@/types';
import { ProfileData, TerminalDataQuery, SocialLink, Technologies } from '../types/about.types';
import { PROJECTS_DATA } from '@/features/projects';
import { techGraphNodes } from '@/features/skills';
import { researchPapersData } from '@/features/research';

// ─── Technology Extraction Engine ─────────────────────────────

/**
 * Extract unique technology names from techGraphNodes based on filters
 */
export const extractTechNames = (
  filters: Partial<Record<'category' | 'type' | 'excludeIds', string | string[]>>
): string[] => {
  const entries = Object.values(techGraphNodes);
  
  const filtered = entries.filter(node => {
    if (filters.category && node.category !== filters.category) return false;
    
    if (filters.type) {
      const types = Array.isArray(filters.type) ? filters.type : [filters.type];
      if (!types.includes(node.type)) return false;
    }
    
    if (filters.excludeIds) {
      const excludeIds = Array.isArray(filters.excludeIds) ? filters.excludeIds : [filters.excludeIds];
      if (excludeIds.includes(node.id)) return false;
    }
    
    return true;
  });

  const sorted = filtered.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  return [...new Set(sorted.map(node => node.name))];
};

// ─── Dynamic Data Builders ────────────────────────────────────

const buildTechnologies = (): Technologies => ({
  languages: extractTechNames({ type: 'language' }),
  frameworks: extractTechNames({ 
    category: 'Frontend', 
    type: ['framework', 'library'] 
  }),
  backend: extractTechNames({ 
    category: 'Backend',
    excludeIds: extractTechNames({ category: 'Backend', type: 'language' })
  }),
  database: extractTechNames({ category: 'Database' }),
  aiAndDataScience: extractTechNames({ 
    category: 'AI/ML',
    excludeIds: 'Python'
  }),
  coreCS: extractTechNames({ 
    category: 'Core CS',
    excludeIds: extractTechNames({ category: 'Core CS', type: 'language' })
  }),
  tools: extractTechNames({ category: 'Tools' }),
});

const buildResearchAreas = (): string[] => {
  const areas = new Set<string>([
    "Explainable AI",
    "Physics-Aware AI",
    "Computer Vision",
    "Remote Sensing",
    "Edge AI",
  ]);
  
  for (const paper of researchPapersData) {
    if (paper.category === "Cardiovascular") {
       areas.add("Healthcare AI");
    } else if (paper.category) {
       areas.add(paper.category);
    }
  }
  
  return [...areas].sort();
};

const getActiveProjects = (): string[] => {
  return PROJECTS_DATA
    .filter(p => p.status === 'DEPLOYED' || p.status === 'IN_PROGRESS')
    .map(p => p.name);
};

// ─── PROFILE_DATA - Main Export ──────────────────────────────

export const PROFILE_DATA: ProfileData = {
  avatarUrl: "/sanjib.jpg",
  name: "Sanjib Bayen",
  handle: "sanjibbayen",
  email: "sanjibayen04@gmail.com",
  phone: "+91 7477743793",
  location: "West Bengal, India",
  philosophy: "Build systems that are maintainable, performant, and solve real problems. Specializing in AI-driven solutions for space exploration, medical diagnostics, and intelligent automation.",
  
  github: [
    {
      url: "https://github.com/SanjibBayen",
      handle: "SanjibBayen"
    }
  ],
  
  linkedin: [
    {
      url: "https://www.linkedin.com/in/sanjibbayen/",
      handle: "sanjibbayen"
    }
  ],
  
  instagram: [
    {
      url: "https://www.instagram.com/bayen04x/",
      handle: "bayen04x"
    }
  ],
  
  twitter: [
    {
      url: "https://x.com/sanjibbayen",
      handle: "sanjibbayen"
    }
  ],
  
  facebook: [
    {
      url: "https://www.facebook.com/sanjibbayen100",
      handle: "sanjibbayen100"
    }
  ],

  bio: "Computer Science Engineering student specializing in Artificial Intelligence, Machine Learning, Computer Vision, and Full-Stack Development. Passionate about building intelligent systems for healthcare, scientific research, robotics, and space exploration.",

  roles: [
    "AI/ML Developer",
    "Full-Stack Developer",
    "Research Enthusiast"
  ],

  focus: [
    "Artificial Intelligence",
    "Machine Learning",
    "Computer Vision",
    "Space Technology",
    "Software Engineering"
  ],

  currentlyBuilding: getActiveProjects(),

  researchAreas: buildResearchAreas(),

  activeProjects: getActiveProjects(),

  education: [
    {
      institution: "Brainware University, Barasat",
      degree: "B.Tech in Computer Science and Engineering",
      duration: "2023 – 2027"
    },
    {
      institution: "Keshabpur Jalpai G.J.M. Vidyapith (H.S.)",
      degree: "Higher Secondary (Class 12)",
      duration: "2020 – 2022"
    },
    {
      institution: "Keshabpur Jalpai G.J.M. Vidyapith (H.S.)",
      degree: "Secondary (Class 10)",
      duration: "2019 – 2020"
    }
  ],

  experience: [
    {
      role: "Head of Engineering",
      company: "Creatiq Media",
      duration: "Jul 2025 – Dec 2025",
      bullets: [
        "Led a cross-functional team of developers, designers, and content creators in the development of web applications and digital products.",
        "Designed and managed scalable full-stack architectures using React, Next.js, TypeScript, Firebase, and modern web technologies.",
        "Established engineering standards, development workflows, code review processes, and deployment pipelines.",
        "Collaborated with product, design, and business teams to translate requirements into production-ready solutions.",
        "Oversaw project planning, task allocation, technical decision-making, and delivery timelines across multiple client projects.",
        "Integrated AI-powered features and automation workflows into client-facing applications to improve user experience and operational efficiency.",
        "Mentored junior developers and contributed to technical documentation, system design, and engineering best practices."
      ]
    }
  ],

  projects: PROJECTS_DATA.map(p => p.name),

  technologies: buildTechnologies(),

  hobbies: [
    "Exploring emerging technologies",
    "Competitive problem solving",
    "Traveling",
    "Listening to music",
    "Learning about space technologies"
  ],

  mission: "Leveraging Artificial Intelligence and Software Engineering to solve real-world problems in healthcare, robotics, and space technology."
};

// ─── Terminal Data Query System ───────────────────────────────

/**
 * Query system for terminal commands - returns formatted string arrays
 */
export const queryTerminalData = (query: TerminalDataQuery): string[] => {
  switch (query.type) {
    case 'whoami':
      return formatWhoAmI();
      
    case 'skills':
      return formatSkills();
      
    case 'specs':
      return formatSpecs();
      
    case 'projects':
      return formatProjects(query.filter);
      
    case 'tech':
      return formatTechDetails(query.filter);
      
    case 'education':
      return formatEducation();
      
    case 'experience':
      return formatExperience();
      
    case 'research':
      return formatResearch();
      
    case 'contact':
      return formatContact();
      
    case 'profile':
      return formatFullProfile();
      
    case 'stats':
      return formatStats();
      
    default:
      return ['Error: Unknown query type'];
  }
};

// ─── Terminal Formatting Functions ────────────────────────────

const formatWhoAmI = (): string[] => [
  '==================== USER PROFILE CARD ====================',
  `User Name    : ${PROFILE_DATA.name}`,
  `Handle       : ${PROFILE_DATA.handle}`,
  'Current Role : AI Research Engineer & Embedded Systems Toolkit Expert',
  'Target Field : Deep Learning, Computer Vision, Space Robotics Pathfinder',
  `Github Link  : ${PROFILE_DATA.github[0]?.url || 'N/A'}`,
  `Email        : ${PROFILE_DATA.email}`,
  `Location     : ${PROFILE_DATA.location}`,
  `Mission      : ${PROFILE_DATA.mission}`,
  '===========================================================',
];

const formatSkills = (): string[] => {
  const nodes = Object.values(techGraphNodes);
  const skills = nodes
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 15);
  
  const lines = [
    '--- SANJIB BAYEN - TECHNICAL CAPABILITY VECTORS ---',
    '',
  ];
  
  skills.forEach(skill => {
    lines.push(`• ${skill.name.padEnd(25)} [${skill.category}] - ${skill.type}`);
  });
  
  lines.push('', '---------------------------------------------------------');
  lines.push(`Total Skills Indexed: ${nodes.length} | Categories: ${new Set(nodes.map(n => n.category)).size}`);
  
  return lines;
};

const formatSpecs = (): string[] => [
  '--- EMBEDDED SYSTEM SPECIFICATIONS ---',
  '',
  'CPU Processor : ARMv8.2 Cortex-A76AE (6-Core Core processor)',
  'Mainboard     : Jetson Orin Nano Developer Architecture Module',
  'Memory Module : 8GB 128-bit LPDDR5 @ 2133MHz',
  'Device GPU    : NVIDIA Ampere w/ 1024 CUDA Cores, 32 Tensor Cores',
  'Sensors Mesh  : 6x IMX477 MIPI CSI, 1x RTK GPS, 2x Decawave DWM1000',
  'AI Accelerator: 32 Tensor Cores, 1024 CUDA Cores',
  'Connectivity  : Wi-Fi 6E, Bluetooth 5.2, Gigabit Ethernet',
  '',
  '--- DEVELOPMENT ENVIRONMENT ---',
  'Primary IDE   : VS Code',
  'OS            : Linux (Ubuntu) / Windows 11',
  'Shell         : PowerShell Core / Bash',
];

const formatProjects = (filter?: string): string[] => {
  let projects = PROJECTS_DATA;
  
  if (filter) {
    const lowerFilter = filter.toLowerCase();
    projects = projects.filter(p => 
      p.name.toLowerCase().includes(lowerFilter) ||
      p.category.toLowerCase().includes(lowerFilter) ||
      p.techStack.some(tech => tech.toLowerCase().includes(lowerFilter)) ||
      p.status.toLowerCase().includes(lowerFilter)
    );
  }
  
  const lines = [
    `=== PORTFOLIO PROJECTS (${projects.length} found) ===`,
    '',
  ];
  
  if (projects.length === 0) {
    lines.push('No projects match your filter criteria.');
    return lines;
  }
  
  projects.forEach((p, index) => {
    lines.push(`[${index + 1}] ${p.name}`);
    lines.push(`    Status: ${p.status} | Category: ${p.category}`);
    lines.push(`    Tech: ${p.techStack.slice(0, 4).join(', ')}${p.techStack.length > 4 ? '...' : ''}`);
    lines.push(`    Description: ${p.summary}`);
    lines.push('');
  });
  
  return lines;
};

const formatTechDetails = (filter?: string): string[] => {
  let nodes = Object.values(techGraphNodes);
  
  if (filter) {
    const lowerFilter = filter.toLowerCase();
    nodes = nodes.filter(node => 
      node.name.toLowerCase().includes(lowerFilter) ||
      node.category.toLowerCase().includes(lowerFilter) ||
      node.type.toLowerCase().includes(lowerFilter)
    );
  }
  
  const grouped: Record<string, typeof nodes> = {};
  nodes.forEach(node => {
     if (!grouped[node.category]) grouped[node.category] = [];
     grouped[node.category].push(node);
  });
  
  const lines = [`=== TECHNOLOGY STACK (${nodes.length} nodes) ===`, ''];
  
  Object.entries(grouped).forEach(([category, categoryNodes]) => {
    lines.push(`## ${category} (${categoryNodes.length})`);
    categoryNodes.forEach(node => {
      lines.push(`  • ${node.name} - ${node.type}`);
    });
    lines.push('');
  });
  
  return lines;
};

const formatEducation = (): string[] => {
  const lines = ['=== EDUCATION ===', ''];
  
  PROFILE_DATA.education.forEach((edu, index) => {
    lines.push(`[${index + 1}] ${edu.degree}`);
    lines.push(`    Institution: ${edu.institution}`);
    lines.push(`    Duration: ${edu.duration}`);
    lines.push('');
  });
  
  return lines;
};

const formatExperience = (): string[] => {
  const lines = ['=== PROFESSIONAL EXPERIENCE ===', ''];
  
  if (PROFILE_DATA.experience.length === 0) {
    lines.push('No professional experience listed yet.');
    return lines;
  }
  
  PROFILE_DATA.experience.forEach((exp, index) => {
    lines.push(`[${index + 1}] ${exp.role}`);
    lines.push(`    Company: ${exp.company}`);
    lines.push(`    Duration: ${exp.duration}`);
    lines.push('    Key Achievements:');
    exp.bullets.forEach(bullet => lines.push(`      • ${bullet}`));
    lines.push('');
  });
  
  return lines;
};

const formatResearch = (): string[] => {
  const papers = researchPapersData;
  const lines = [`=== RESEARCH PAPERS (${papers.length} total) ===`, ''];
  
  if (papers.length === 0) {
    lines.push('No research papers listed yet.');
    return lines;
  }
  
  papers.forEach((paper, index) => {
    lines.push(`[${index + 1}] ${paper.title}`);
    if (paper.category) lines.push(`    Category: ${paper.category}`);
    if (paper.year) lines.push(`    Year: ${paper.year}`);
    if (paper.authors) lines.push(`    Authors: ${paper.authors}`);
    lines.push('');
  });
  
  return lines;
};

const formatContact = (): string[] => [
  '=== CONTACT INFORMATION ===',
  '',
  `Name     : ${PROFILE_DATA.name}`,
  `Email    : ${PROFILE_DATA.email}`,
  `Phone    : ${PROFILE_DATA.phone}`,
  `Location : ${PROFILE_DATA.location}`,
  '',
  'Social Links:',
  `  GitHub    : ${PROFILE_DATA.github[0]?.url || 'N/A'}`,
  `  LinkedIn  : ${PROFILE_DATA.linkedin[0]?.url || 'N/A'}`,
  `  Instagram : ${PROFILE_DATA.instagram[0]?.url || 'N/A'}`,
  `  Twitter   : ${PROFILE_DATA.twitter[0]?.url || 'N/A'}`,
  `  Facebook  : ${PROFILE_DATA.facebook[0]?.url || 'N/A'}`,
  '',
  `Mission: ${PROFILE_DATA.mission}`,
];

const formatFullProfile = (): string[] => [
  ...formatWhoAmI(),
  '',
  ...formatEducation(),
  ...formatExperience(),
  ...formatContact(),
];

const formatStats = (): string[] => {
  const nodes = Object.values(techGraphNodes);
  const projects = PROJECTS_DATA;
  
  return [
    '=== PORTFOLIO STATISTICS ===',
    '',
    `Total Projects: ${projects.length}`,
    `  • Deployed: ${projects.filter(p => p.status === 'DEPLOYED').length}`,
    `  • In Progress: ${projects.filter(p => p.status === 'IN_PROGRESS').length}`,
    `  • STAGED: ${projects.filter(p => p.status === 'STAGED').length}`,
    `  • Private: ${projects.filter(p => p.status === 'PRIVATE').length}`,
    '',
    `Total Technologies: ${nodes.length}`,
    `  • Languages: ${extractTechNames({ type: 'language' }).length}`,
    `  • Frameworks: ${extractTechNames({ type: 'framework' }).length}`,
    `  • Libraries: ${extractTechNames({ type: 'library' }).length}`,
    `  • Tools: ${extractTechNames({ type: 'tool' }).length}`,
    '',
    `Research Papers: ${researchPapersData.length}`,
    `Education Levels: ${PROFILE_DATA.education.length}`,
    `Work Experiences: ${PROFILE_DATA.experience.length}`,
    '',
    `Categories Covered: ${new Set(nodes.map(n => n.category)).size}`,
  ];
};

// ─── YAML Generator ────────────────────────────────────────────

const escapeYaml = (value: string): string => {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
};

const formatYamlList = (items: string[], indent: number = 2): string => {
  if (items.length === 0) return `${' '.repeat(indent)}[]`;
  return items.map(item => `${' '.repeat(indent)}- "${escapeYaml(item)}"`).join('\n');
};

const formatYamlInlineList = (items: string[]): string => {
  if (items.length === 0) return '[]';
  return `[${items.map(item => `"${escapeYaml(item)}"`).join(', ')}]`;
};

export const generateProfileYaml = (): string => {
  const lines: string[] = [
    `# Profile: ${PROFILE_DATA.name}`,
    `# Generated: ${new Date().toISOString().split('T')[0]}`,
    '',
    '---',
    '',
    `name: "${escapeYaml(PROFILE_DATA.name)}"`,
    `handle: "${escapeYaml(PROFILE_DATA.handle)}"`,
    `email: "${escapeYaml(PROFILE_DATA.email)}"`,
    `phone: "${escapeYaml(PROFILE_DATA.phone)}"`,
    `location: "${escapeYaml(PROFILE_DATA.location)}"`,
    '',
    `bio: "${escapeYaml(PROFILE_DATA.bio)}"`,
    '',
    '# Professional Identity',
    'roles:',
    formatYamlList(PROFILE_DATA.roles),
    '',
    'focus:',
    formatYamlList(PROFILE_DATA.focus),
    '',
    'currentlyBuilding:',
    formatYamlList(PROFILE_DATA.currentlyBuilding),
    '',
    '# Social Links',
    'github:',
    ...PROFILE_DATA.github.map(g => `  - url: "${escapeYaml(g.url)}"\n    handle: "${escapeYaml(g.handle)}"`),
    'linkedin:',
    ...PROFILE_DATA.linkedin.map(l => `  - url: "${escapeYaml(l.url)}"\n    handle: "${escapeYaml(l.handle)}"`),
    'instagram:',
    ...PROFILE_DATA.instagram.map(i => `  - url: "${escapeYaml(i.url)}"\n    handle: "${escapeYaml(i.handle)}"`),
    'twitter:',
    ...PROFILE_DATA.twitter.map(t => `  - url: "${escapeYaml(t.url)}"\n    handle: "${escapeYaml(t.handle)}"`),
    'facebook:',
    ...PROFILE_DATA.facebook.map(f => `  - url: "${escapeYaml(f.url)}"\n    handle: "${escapeYaml(f.handle)}"`),
    '',
    '# Research',
    'researchAreas:',
    formatYamlList(PROFILE_DATA.researchAreas),
    '',
    'activeProjects:',
    formatYamlList(PROFILE_DATA.activeProjects),
    '',
    '# Education',
    'education:',
    ...PROFILE_DATA.education.map(edu => [
      `  - institution: "${escapeYaml(edu.institution)}"`,
      `    degree: "${escapeYaml(edu.degree)}"`,
      `    duration: "${escapeYaml(edu.duration)}"`,
    ].join('\n')),
    '',
    '# Experience',
    'experience:',
    PROFILE_DATA.experience.length === 0 
      ? '  []'
      : PROFILE_DATA.experience.map(exp => [
          `  - role: "${escapeYaml(exp.role)}"`,
          `    company: "${escapeYaml(exp.company)}"`,
          `    duration: "${escapeYaml(exp.duration)}"`,
          '    bullets:',
          formatYamlList(exp.bullets, 6),
        ].join('\n')).join('\n'),
    '',
    '# Technology Stack',
    'technologies:',
    `  languages: ${formatYamlInlineList(PROFILE_DATA.technologies.languages)}`,
    `  frameworks: ${formatYamlInlineList(PROFILE_DATA.technologies.frameworks)}`,
    `  database: ${formatYamlInlineList(PROFILE_DATA.technologies.database)}`,
    `  backend: ${formatYamlInlineList(PROFILE_DATA.technologies.backend)}`,
    `  aiAndDataScience: ${formatYamlInlineList(PROFILE_DATA.technologies.aiAndDataScience)}`,
    `  coreCS: ${formatYamlInlineList(PROFILE_DATA.technologies.coreCS)}`,
    `  tools: ${formatYamlInlineList(PROFILE_DATA.technologies.tools)}`,
    '',
    '# Personal',
    'hobbies:',
    formatYamlList(PROFILE_DATA.hobbies),
    '',
    `mission: "${escapeYaml(PROFILE_DATA.mission)}"`,
    '',
  ];

  return lines.join('\n');
};

// ─── VFS Node Generator ───────────────────────────────────────

export const aboutFolder: VFSNode = {
  name: "about",
  type: "folder",
  path: "about",
  children: [
    {
      name: "README.md",
      type: "file",
      path: "about/README.md",
      language: "markdown",
      content: [
        `# ${PROFILE_DATA.name}`,
        '',
        `> ${PROFILE_DATA.bio}`,
        '',
        '## 🎯 Focus Areas',
        '',
        ...PROFILE_DATA.focus.map(f => `- ${f}`),
        '',
        '## 🚀 Currently Building',
        '',
        ...PROFILE_DATA.currentlyBuilding.map(b => `- ${b}`),
        '',
        '## 📚 Education',
        '',
        ...PROFILE_DATA.education.map(e => 
          `- **${e.degree}** — ${e.institution} (${e.duration})`
        ),
        '',
        '## 🛠️ Tech Stack',
        '',
        `- **Languages:** ${PROFILE_DATA.technologies.languages.join(', ')}`,
        `- **Frameworks:** ${PROFILE_DATA.technologies.frameworks.join(', ')}`,
        `- **Backend:** ${PROFILE_DATA.technologies.backend.join(', ')}`,
        `- **Databases:** ${PROFILE_DATA.technologies.database.join(', ')}`,
        `- **AI/Data Science:** ${PROFILE_DATA.technologies.aiAndDataScience.join(', ')}`,
        `- **Core CS:** ${PROFILE_DATA.technologies.coreCS.join(', ')}`,
        `- **Tools:** ${PROFILE_DATA.technologies.tools.join(', ')}`,
        '',
        '## 💼 Experience',
        '',
        ...PROFILE_DATA.experience.map(exp => [
          `### ${exp.role} - ${exp.company}`,
          `*${exp.duration}*`,
          '',
          ...exp.bullets.map(b => `- ${b}`),
          '',
        ].join('\n')),
        '',
        '## 🔬 Research Areas',
        '',
        ...PROFILE_DATA.researchAreas.map(r => `- ${r}`),
        '',
        '## 🌐 Connect',
        '',
        ...PROFILE_DATA.github.map(g => `- [GitHub](${g.url})`),
        ...PROFILE_DATA.linkedin.map(l => `- [LinkedIn](${l.url})`),
        ...PROFILE_DATA.twitter.map(t => `- [Twitter](${t.url})`),
        '',
        `> *"${PROFILE_DATA.mission}"*`,
      ].join('\n'),
    },
    {
      name: "profile.yml",
      type: "file",
      path: "about/profile.yml",
      language: "yaml",
      content: generateProfileYaml(),
    },
  ],
};
