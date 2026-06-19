/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */
import { ProfileData } from '../../features/about';

export function generateCVContent(profile: ProfileData): string {
  const nameUpper = profile.name.toUpperCase();
  const focusList = profile.focus.map(f => `• ${f}`).join('\n');
  
  const eduList = profile.education.map(edu => 
    `• ${edu.institution} (${edu.degree}, ${edu.duration})`
  ).join('\n');
  
  const expList = profile.experience.map(exp => 
    `${exp.role} @ ${exp.company} (${exp.duration})\n${exp.bullets.map(b => `  - ${b}`).join('\n')}`
  ).join('\n\n');

  const langList = profile.technologies.languages.join(', ');
  const frameworkList = profile.technologies.frameworks.join(', ');
  const backendList = profile.technologies.backend.join(', ');
  const databaseList = profile.technologies.database.join(', ');
  const aiList = profile.technologies.aiAndDataScience.join(', ');
  const toolList = profile.technologies.tools.join(', ');

  return `======================================================================
                     ${nameUpper} - CV & RESUME
======================================================================
Email: ${profile.email}
Phone: ${profile.phone}
Location: ${profile.location}
GitHub: ${profile.github[0]?.url || 'N/A'}
LinkedIn: ${profile.linkedin[0]?.url || 'N/A'}

----------------------------------------------------------------------
BIOGRAPHY & PROFESSIONAL SUMMARY
----------------------------------------------------------------------
${profile.bio}

----------------------------------------------------------------------
CORE SPECIALIZATIONS & FOCUS VECTORS
----------------------------------------------------------------------
${focusList}

----------------------------------------------------------------------
ACADEMICS & EDUCATION
----------------------------------------------------------------------
${eduList}

----------------------------------------------------------------------
PROFESSIONAL EXPERIENCE
----------------------------------------------------------------------
${expList}

----------------------------------------------------------------------
TECHNICAL HARDWARE & SOFTWARE STACK
----------------------------------------------------------------------
• Languages:       ${langList}
• Frameworks:      ${frameworkList}
• Backend:         ${backendList}
• Databases:       ${databaseList}
• AI/Data Science: ${aiList}
• Developer Tools: ${toolList}

======================================================================
Generated dynamically via ${profile.name} Interactive Portfolio. 
Feel free to contact at ${profile.email} to collaborate!
======================================================================`;
}
