/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * Dynamic vector graphic generator for custom VS Code-like folders and file-extension indicators.
 */

import React from 'react';
import { FileText } from 'lucide-react';

export const getFolderIcon = (folderName: string, isExpanded: boolean) => {
  const nm = folderName.toLowerCase();
  
  const drawCustomFolder = (folderColor: string, accentColor: string, innerIcon?: React.ReactNode) => {
    return (
      <div className="w-[18px] h-[18px] mr-1.5 shrink-0 relative flex items-center justify-center select-none">
        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {isExpanded ? (
            <>
              <path d="M10 20 C10 16, 14 14, 18 14 H40 L52 28 H82 C86 28, 90 32, 90 36 V45 H10 Z" fill={accentColor} />
              <rect x="10" y="40" width="80" height="42" rx="6" fill="#1e1e24" opacity="0.4" />
              <path d="M10 44 H90 V76 C90 82, 86 86, 80 86 H20 C14 86, 10 82, 10 76 Z" fill={folderColor} />
            </>
          ) : (
            <>
              <path d="M10 20 C10 16, 14 14, 18 14 H40 L52 28 H82 C86 28, 90 32, 90 36 V76 C90 82, 86 86, 80 86 H20 C14 86, 10 82, 10 76 Z" fill={folderColor} />
              <path d="M10 32 H90 v46 C90 82, 86 86, 80 86 H20 C14 86, 10 82, 10 76 Z" fill={folderColor} opacity="0.9" />
              <path d="M10 32 H90" stroke={accentColor} strokeWidth="4" opacity="0.5" />
            </>
          )}
        </svg>
        {innerIcon && (
          <div className="absolute inset-0 flex items-center justify-center pt-2 pl-0.5 pointer-events-none scale-[0.65]">
            {innerIcon}
          </div>
        )}
      </div>
    );
  };

  if (nm === 'about') {
    return drawCustomFolder(
      '#00bcd4', 
      '#0097a7',
      <svg viewBox="0 0 100 100" className="w-[45px] h-[45px] text-white" fill="currentColor">
        <circle cx="50" cy="35" r="18" />
        <path d="M20 80 C 20 60, 80 60, 80 80 Z" />
      </svg>
    );
  }
  if (nm === 'projects') {
    return drawCustomFolder(
      '#ff5722', 
      '#e64a19',
      <svg viewBox="0 0 100 100" className="w-[40px] h-[40px] text-white" fill="none" stroke="currentColor" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="30,25 10,50 30,75" />
        <polyline points="70,25 90,50 70,75" />
      </svg>
    );
  }
  if (nm === 'skills') {
    return drawCustomFolder(
      '#9c27b0', 
      '#7b1fa2',
      <svg viewBox="0 0 100 100" className="w-[40px] h-[40px] text-white" fill="currentColor">
        <path d="M50 35 a15 15 0 1 0 0 30 a15 15 0 1 0 0 -30 Z M50 20 l4 8 M50 80 l4 -8 M20 50 l8 4 M80 50 l-8 4" stroke="currentColor" strokeWidth="8" />
      </svg>
    );
  }
  if (nm === 'connect') {
    return drawCustomFolder(
      '#4caf50', 
      '#388e3c',
      <svg viewBox="0 0 100 100" className="w-[45px] h-[45px] text-white" fill="currentColor">
        <rect x="20" y="30" width="60" height="40" rx="6" />
        <path d="M20 35 L50 55 L80 35" stroke="#388e3c" strokeWidth="8" strokeLinecap="round" />
      </svg>
    );
  }
  if (nm === 'research') {
    return drawCustomFolder(
      '#3f51b5', 
      '#303f9f',
      <svg viewBox="0 0 100 100" className="w-[40px] h-[40px] text-white" fill="currentColor">
        <polygon points="50,15 80,45 65,45 65,85 35,85 35,45 20,45" />
      </svg>
    );
  }
  if (nm === 'achievements') {
    return drawCustomFolder(
      '#ffb300', 
      '#ff8f00',
      <svg viewBox="0 0 100 100" className="w-[45px] h-[45px] text-white" fill="currentColor">
        <path d="M30 30 H70 V55 C70 65, 60 75, 50 75 C40 75, 30 65, 30 55 Z" />
        <path d="M45 75 H55 V85 H45 Z" />
        <path d="M35 85 H65 V92 H35 Z" />
        <path d="M30 38 H20 V48 C20 54, 25 58, 30 58 Z" />
        <path d="M70 38 H80 V48 C80 54, 75 58, 70 58 Z" />
      </svg>
    );
  }

  return drawCustomFolder('#e2b544', '#bca232');
};

export const getFileIcon = (fileName: string) => {
  const fnLower = fileName.toLowerCase();
  
  if (fnLower.endsWith('readme.md')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="44" fill="#0277bd" />
        <rect x="44" y="42" width="12" height="34" rx="2" fill="#ffffff" />
        <circle cx="50" cy="26" r="7" fill="#ffffff" />
      </svg>
    );
  }
  if (fnLower.endsWith('.pkt')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="18" fill="#1352a2" />
        <line x1="25" y1="70" x2="50" y2="35" stroke="#ffffff" strokeWidth="6" strokeDasharray="3,3" />
        <line x1="75" y1="70" x2="50" y2="35" stroke="#ffffff" strokeWidth="6" strokeDasharray="3,3" />
        <line x1="25" y1="70" x2="75" y2="70" stroke="#ffffff" strokeWidth="6" />
        
        <circle cx="50" cy="35" r="14" fill="#00b4d8" stroke="#ffffff" strokeWidth="4" />
        <path d="M44 35 H56 M47 31 L44 35 L47 39 M53 31 L56 35 L53 39" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        <circle cx="25" cy="70" r="10" fill="#10b981" stroke="#ffffff" strokeWidth="3" />
        <circle cx="75" cy="70" r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="3" />
      </svg>
    );
  }
  if (fnLower.endsWith('.gitignore') || fnLower === '.gitignore') {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="18" fill="#ef5138" />
        <g transform="translate(15, 15) scale(0.7)">
          <path d="M50 10 L90 50 L50 90 L10 50 Z" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinejoin="round" />
          <circle cx="35" cy="35" r="8" fill="#ffffff" />
          <circle cx="35" cy="65" r="8" fill="#ffffff" />
          <path d="M35 43 V57" stroke="#ffffff" strokeWidth="8" />
          <circle cx="65" cy="50" r="8" fill="#ffffff" />
          <path d="M35 50 C50 50 50 50 65 50" stroke="#ffffff" strokeWidth="8" fill="none" />
        </g>
        <line x1="25" y1="25" x2="75" y2="75" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
        <line x1="25" y1="25" x2="75" y2="75" stroke="#ef5138" strokeWidth="6" strokeLinecap="round" />
      </svg>
    );
  }
  if (fnLower.includes('license')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="18" fill="#df2a2a" />
        <rect x="25" y="20" width="50" height="60" rx="5" fill="#ffffff" />
        <path d="M35 34 H65 M35 46 H65 M35 58 H52" stroke="#df2a2a" strokeWidth="6" strokeLinecap="round" />
        <circle cx="62" cy="65" r="9" fill="#ffb300" />
        <polygon points="59,71 62,81 65,71" fill="#ff8f00" />
        <polygon points="64,71 67,81 70,71" fill="#ff8f00" />
        <circle cx="62" cy="65" r="5" fill="#ffa000" />
      </svg>
    );
  }

  if (fnLower.endsWith('.json')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="15" fill="#caa410"/>
        <text x="50" y="68" fill="#ffffff" fontSize="56" fontWeight="900" fontFamily="monospace" textAnchor="middle">&#123;&#125;</text>
      </svg>
    );
  }
  if (fnLower.endsWith('.tsx')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="18" fill="#1e1e24"/>
        <g stroke="#00d8ff" strokeWidth="5.5" fill="none">
          <ellipse cx="50" cy="50" rx="36" ry="13" transform="rotate(0 50 50)" />
          <ellipse cx="50" cy="50" rx="36" ry="13" transform="rotate(60 50 50)" />
          <ellipse cx="50" cy="50" rx="36" ry="13" transform="rotate(120 50 50)" />
        </g>
        <circle cx="50" cy="50" r="5" fill="#00d8ff" />
      </svg>
    );
  }
  if (fnLower.endsWith('.ts')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="15" fill="#3178c6"/>
        <text x="50" y="70" fill="#ffffff" fontSize="48" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">TS</text>
      </svg>
    );
  }
  if (fnLower.endsWith('.jsx')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="15" fill="#f7df1e"/>
        <text x="50" y="72" fill="#000000" fontSize="42" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">JSX</text>
      </svg>
    );
  }
  if (fnLower.endsWith('.js')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="15" fill="#f7df1e"/>
        <text x="50" y="70" fill="#000000" fontSize="48" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">JS</text>
      </svg>
    );
  }
  if (fnLower.endsWith('.py')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M49.6 14C32.1 14 33.3 21.6 33.3 21.6l.1 7.8h16.7v2.4H26.7s-10.4-.9-10.4 14.9c0 15.8 9.1 15.3 9.1 15.3h5.4v-7.7s-.2-9.2 8.9-9.2h17.1s8.8.3 8.8-8.3V27c0-8.6-6.5-13-15.3-13z" fill="#387eb8"/>
        <path d="M50.4 86C67.9 86 66.7 78.4 66.7 78.4l-.1-7.8H49.9v-2.4h23.4s10.4.9 10.4-14.9c0-15.8-9.1-15.3-9.1-15.3l-5.4.1v7.7s.2 9.2-8.9 9.2H43.2s-8.8-.3-8.8 8.3v10.1c0 8.6 6.5 13 15.3 13z" fill="#ffe052"/>
        <circle cx="41.5" cy="21.5" r="3.5" fill="#f8fafc" />
        <circle cx="58.5" cy="78.5" r="3.5" fill="#121212" />
      </svg>
    );
  }
  if (fnLower.endsWith('.html')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="15" fill="#e44d26"/>
        <text x="50" y="70" fill="#ffffff" fontSize="56" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">&lt;&gt;</text>
      </svg>
    );
  }
  if (fnLower.endsWith('.css')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="15" fill="#1572b6"/>
        <text x="50" y="72" fill="#ffffff" fontSize="60" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">#</text>
      </svg>
    );
  }
  if (fnLower.endsWith('.yml') || fnLower.endsWith('.yaml')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="18" fill="#cb171e"/>
        <path d="M25 32 H50 M25 50 H38 M46 50 H75 M38 68 H65" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" />
        <circle cx="25" cy="50" r="4.5" fill="#ffffff" />
        <circle cx="38" cy="68" r="4.5" fill="#ffffff" />
      </svg>
    );
  }
  if (fnLower.endsWith('.md')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="15" fill="#083fa6"/>
        <text x="50" y="68" fill="#ffffff" fontSize="50" fontWeight="950" fontFamily="sans-serif" textAnchor="middle">M↓</text>
      </svg>
    );
  }
  if (fnLower.endsWith('.txt')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="15" fill="#78909c"/>
        <text x="50" y="70" fill="#ffffff" fontSize="46" fontWeight="900" fontFamily="monospace" textAnchor="middle">TXT</text>
      </svg>
    );
  }
  if (fnLower.endsWith('.db') || fnLower.endsWith('.dvb')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="18" fill="#ea1c24" />
        <path d="M25 34 C25 27, 75 27, 75 34 C75 41, 25 41, 25 34" fill="#ffffff" fillOpacity="0.3" stroke="#ffffff" strokeWidth="6" />
        <path d="M25 34 V49 C25 56, 75 56, 75 49 V34" fill="#ffffff" fillOpacity="0.2" stroke="#ffffff" strokeWidth="6" strokeLinejoin="round" />
        <path d="M25 49 V64 C25 71, 75 71, 75 64 V49" fill="#ffffff" fillOpacity="0.2" stroke="#ffffff" strokeWidth="6" strokeLinejoin="round" />
        <ellipse cx="50" cy="49" rx="14" ry="7" fill="none" stroke="#ffffff" strokeWidth="5.5" />
      </svg>
    );
  }
  if (fnLower.endsWith('.log')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="15" fill="#78909c"/>
        <rect x="20" y="30" width="60" height="8" rx="2" fill="#ffffff" />
        <rect x="20" y="46" width="45" height="8" rx="2" fill="#ffffff" opacity="0.8" />
        <rect x="20" y="62" width="55" height="8" rx="2" fill="#ffffff" opacity="0.9" />
        <circle cx="74" cy="48" r="7" fill="#4caf50" />
      </svg>
    );
  }
  if (fnLower.endsWith('.ipynb')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="100" rx="18" fill="#1e1e24" />
        <path d="M42 32 C28 32, 22 42, 22 50 C22 58, 28 68, 42 68 C52 68, 58 60, 58 50" stroke="#f9ab00" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M58 68 C72 68, 78 58, 78 50 C78 42, 72 32, 58 32 C48 32, 42 40, 42 50" stroke="#e06000" strokeWidth="10" strokeLinecap="round" fill="none" />
      </svg>
    );
  }
  if (fnLower.startsWith('.')) {
    return (
      <svg className="w-4 h-4 mr-1.5 shrink-0 select-none rounded-[3px]" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="120" height="120" rx="15" fill="#f14e32" />
        <path d="M60 18 L102 60 L60 102 L18 60 Z" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="45" cy="45" r="9" fill="#ffffff" />
        <circle cx="45" cy="78" r="9" fill="#ffffff" />
        <circle cx="75" cy="52" r="9" fill="#ffffff" />
        <path d="M45 54 L45 69" stroke="#ffffff" strokeWidth="8" />
        <path d="M45 60 Q75 60 75 60" stroke="#ffffff" strokeWidth="8" fill="none" />
      </svg>
    );
  }
  return <FileText className="w-4 h-4 text-slate-350 mr-1.5 shrink-0" />;
};
