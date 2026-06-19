/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Mail, 
  BookOpen, 
  Target, 
  CheckCircle2, 
  Compass, 
  GraduationCap, 
  Share2, 
  Copy, 
  Check,
  FileCode,
  Tag,
  Code2,
  Workflow
} from 'lucide-react';
import { VSCodeTheme } from '@/types';
import { PROFILE_DATA } from '@/features/about';

interface AboutProfileYamlViewerProps {
  theme: VSCodeTheme;
  content: string;
  codeContentNode: React.ReactNode;
}

export default function AboutProfileYamlViewer({
  theme,
  content,
  codeContentNode
}: AboutProfileYamlViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE_DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // Dynamically resolve profile values from our centralized about.ts model
  const profile = {
    name: PROFILE_DATA.name,
    handle: PROFILE_DATA.handle,
    location: PROFILE_DATA.location,
    roles: PROFILE_DATA.roles,
    focus: PROFILE_DATA.focus,
    bio: PROFILE_DATA.bio,
    currentlyBuilding: PROFILE_DATA.currentlyBuilding,
    researchAreas: PROFILE_DATA.researchAreas,
    activeProjects: PROFILE_DATA.activeProjects,
    education: PROFILE_DATA.education[0]?.degree || "B.Tech Computer Science & Engineering",
    mission: PROFILE_DATA.mission
    ,
    philosophy: PROFILE_DATA.philosophy
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row bg-[#1e1e1e] overflow-hidden select-text">
      
      {/* LEFT COLUMN: Clean YAML RAW syntax display */}
      <div className="flex-1 border-b md:border-b-0 md:border-r border-neutral-800/80 p-4 overflow-y-auto custom-scrollbar flex flex-col min-h-[300px]">
        <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-3 border-b border-neutral-850 pb-2 select-none">
          <span className="flex items-center gap-1.5 font-bold">
            <FileCode className="w-3.5 h-3.5 text-[#ce9178]" />
            YAML Raw Content
          </span>
          <span className="text-emerald-400 font-bold">Valid YAML</span>
        </div>
        <div className="flex-1 font-mono text-xs select-text">
          {codeContentNode}
        </div>
      </div>

      {/* RIGHT COLUMN: Polished Bento Dashboard Representation */}
      <div className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar bg-neutral-900/10 space-y-6 select-text max-w-2xl font-sans">
        
        {/* Module Header */}
        <div className="flex items-center justify-between text-[10px] uppercase font-mono tracking-wider text-slate-400 pb-2 border-b border-neutral-850 select-none">
          <span className="flex items-center gap-1.5 font-bold">
            <User className="w-3.5 h-3.5 text-[#4ec9b0]" />
            Profile Dashboard Visualizer
          </span>
          <span className="text-sky-400 font-mono text-[9px] lowercase">interpreter active</span>
        </div>

        {/* Profile Card Header */}
        <div className="p-5 rounded-2xl bg-[#1b1b1c] border border-neutral-800 shadow-xl flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-xl font-extrabold text-white leading-none font-sans flex items-center gap-2">
                {profile.name}
              </h1>
              <p className="text-[#9cdcfe] font-mono text-[10.5px]">@{profile.handle}</p>
            </div>
            
            <div className="flex items-center text-[10.5px] font-mono text-slate-400 bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-800">
              <MapPin className="w-3 h-3 text-red-500 mr-1 shrink-0" />
              <span>{profile.location}</span>
            </div>
          </div>
          
          <hr className="border-neutral-850" />

          {/* Bio statement */}
          <p className="text-xs text-slate-300 leading-relaxed font-sans">{profile.bio}</p>

          {/* Social Links info inside a bento slot */}
          <div className="flex flex-wrap gap-2 pt-1.5 select-none">
            <button 
              onClick={handleCopyEmail}
              className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-slate-300 hover:text-white text-[10px] font-mono font-medium rounded border border-neutral-800 hover:border-neutral-700 transition flex items-center space-x-1.5 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Mail className="w-3 h-3 text-red-400 shrink-0" />
                  <span>{PROFILE_DATA.email}</span>
                  <Copy className="w-2.5 h-2.5 text-neutral-500 scale-90" />
                </>
              )}
            </button>
            <div className="px-3 py-1 bg-emerald-500/5 text-emerald-400 text-[10px] font-mono rounded border border-emerald-500/10 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Open to Collaborate</span>
            </div>
          </div>
        </div>

        {/* Roles & Tech Specializations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#1b1b1c] border border-neutral-850 space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#4ec9b0] font-sans flex items-center">
              <Code2 className="w-3.5 h-3.5 mr-1.5 text-[#4ec9b0]" /> Tech Roles
            </h3>
            <div className="flex flex-wrap gap-1.5 select-none">
              {profile.roles.map((role: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, i: React.Key | null | undefined) => (
                <span key={i} className="text-[10px] bg-neutral-900 text-slate-200 px-2.5 py-1 rounded border border-neutral-800">
                  {role}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#1b1b1c] border border-neutral-850 space-y-3">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-sky-400 font-sans flex items-center">
              <Workflow className="w-3.5 h-3.5 mr-1.5 text-sky-400" /> Focus Vectors
            </h3>
            <div className="flex flex-wrap gap-1.5 select-none animate-fade-in">
              {profile.focus.map((tag: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, i: React.Key | null | undefined) => (
                <span key={i} className="text-[9.5px] bg-neutral-900 text-sky-300 px-2 py-0.5 rounded border border-neutral-800 font-mono">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Currently Building */}
        <div className="p-5 rounded-xl bg-[#1b1b1c] border border-neutral-850 space-y-4">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#ce9178] font-sans flex items-center border-b border-neutral-800 pb-2">
            <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-[#ce9178]" /> Currently Building & Scaling
          </h3>
          <div className="space-y-3">
            {profile.currentlyBuilding.map((item: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, i: React.Key | null | undefined) => (
              <div key={i} className="flex items-start space-x-2 text-[11px] text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-emerald-500 shrink-0 select-none" />
                <span className="font-sans leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Core Mission Statements */}
        <div className="p-5 rounded-xl bg-[#1b1b1c] border border-neutral-850 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center select-none font-sans">
                <BookOpen className="w-3 h-3 mr-1" /> Academics
              </h4>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed">{profile.education}</p>
            </div>
            
            <div className="space-y-20 p-px">
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center select-none font-sans">
                  <Target className="w-3 h-3 mr-1" /> philosophy
                </h4>
                <p className="text-[11.5px] text-slate-350 italic font-sans leading-relaxed">
                  {profile.philosophy}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
