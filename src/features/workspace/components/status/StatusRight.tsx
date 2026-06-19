/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React from 'react';
import { Mail } from 'lucide-react';
import { PROFILE_DATA } from '../../../../features/about';

interface StatusRightProps {
  activeLanguage: string;
}

export default function StatusRight({ activeLanguage }: StatusRightProps) {
  // Format long files into short clean language tags
  const getLanguageLabel = (lang: string) => {
    if (lang === 'markdown') return 'Markdown';
    if (lang === 'typescript') return 'TypeScript';
    if (lang === 'json') return 'JSON';
    return 'Plain Text';
  };

  return (
    <div className="flex items-center space-x-3 h-full pr-1 font-mono text-[10.5px]">
      {/* Coordinates */}
      <div className="hover:bg-white/10 px-1.5 h-full flex items-center transition select-text">
        <span>Ln 14, Col 2</span>
      </div>
      
      {/* Indentation */}
      <div className="hidden sm:flex hover:bg-white/10 px-1.5 h-full items-center transition">
        <span>Spaces: 2</span>
      </div>

      {/* Encoding */}
      <div className="hidden sm:flex hover:bg-white/10 px-1.5 h-full items-center transition">
        <span>UTF-8</span>
      </div>

      {/* CRLF */}
      <div className="hidden md:flex hover:bg-white/10 px-1.5 h-full items-center transition">
        <span>LF</span>
      </div>

      {/* Format */}
      <div className="hover:bg-white/10 px-1.5 h-full flex items-center transition">
        <span>{getLanguageLabel(activeLanguage)}</span>
      </div>

      {/* Clickable Social Indicator */}
      <a
        href={`mailto:${PROFILE_DATA.email}`}
        className="hover:bg-white/15 px-2 bg-black/10 py-0.5 rounded flex items-center space-x-1 transition cursor-pointer text-white font-sans text-[10px]"
        title="Direct Mail Connection"
      >
        <Mail className="w-3 h-3" />
        <span className="hidden xs:inline">{PROFILE_DATA.email}</span>
      </a>
    </div>
  );
}
