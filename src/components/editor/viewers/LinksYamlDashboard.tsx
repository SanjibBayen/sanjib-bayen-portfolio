/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React, { useState, useEffect } from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  Copy,
  Check,
  Instagram,
  Facebook,
  Phone,
  MapPin,
  Briefcase,
  Code2,
  AtSign,
  Tag,
  Clock,
  Link2,
  FileCode,
  Power,
} from "lucide-react";
import { VSCodeTheme } from "../../../shared/types";
import { PROFILE_DATA } from "../../../features/about";

interface SocialCard {
  platform: string;
  username: string;
  icon: React.ReactNode;
  url: string;
  handle: string;
  description: string;
  tags: string[];
  color: string; // border/glow hover
  bgColor: string; // background color theme
  logoColor: string; // color class of the logo text
  logoBg: string; // background color of the logo container
  btnClass: string; // full-color button matching nature theme
  natureLabel: string; // nature element label
}

const CONNECTIONS_DATA: SocialCard[] = [
  {
    platform: "GitHub",
    username: PROFILE_DATA.github[0]?.handle ,
    icon: <Github className="w-5 h-5" />,
    url: PROFILE_DATA.github[0]?.url,
    description: "Open-source repositories, research code, ROS2 nodes, and edge AI implementations.",
    tags: ["Open Source", "Research"],
    color: "hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    bgColor: "bg-[#0f1914] border-emerald-950/40",
    logoColor: "text-[#4ec9b0]",
    logoBg: "bg-[#4ec9b0]/10 border-[#4ec9b0]/24",
    btnClass: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/10 border border-emerald-500/20",
    natureLabel: "Emerald Foliage",
    handle: ""
  },
  {
    platform: "LinkedIn",
    username: PROFILE_DATA.linkedin[0]?.handle ,
    icon: <Linkedin className="w-5 h-5" />,
    url: `${PROFILE_DATA.linkedin[0]?.url}`,
    description: "Professional journey, research publications, co-founding ventures, and technical insights.",
    tags: ["Professional", "Research", "500+ Connections"],
    color: "hover:border-sky-500/50 hover:shadow-[0_0_20px_rgba(14,165,233,0.15)]",
    bgColor: "bg-[#0c1622] border-sky-950/40",
    logoColor: "text-[#0a66c2]",
    logoBg: "bg-[#0a66c2]/10 border-[#0a66c2]/24",
    btnClass: "bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-505 text-white shadow-lg shadow-blue-900/10 border border-blue-500/20",
    natureLabel: "Ocean Depths",
    handle: ""
  },
  {
    platform: "Twitter / X",
    username: `${PROFILE_DATA.twitter[0]?.handle }`,
    icon: <Twitter className="w-5 h-5" />,
    url: `${PROFILE_DATA.twitter[0]?.url}`,
    description: "Tech threads, AI insights, hardware acceleration, and daily developer logs.",
    tags: ["Tech Threads", "AI Insights", "Daily"],
    color: "hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]",
    bgColor: "bg-[#0a1620] border-cyan-950/40",
    logoColor: "text-[#1da1f2]",
    logoBg: "bg-[#1da1f2]/10 border-[#1da1f2]/24",
    btnClass: "bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white shadow-lg shadow-cyan-900/10 border border-cyan-500/20",
    natureLabel: "Sky Stratosphere",
    handle: ""
  },
  {
    platform: "Instagram",
    username: `${PROFILE_DATA.instagram[0]?.handle}`,
    icon: <Instagram className="w-5 h-5" />,
    url: `${PROFILE_DATA.instagram[0]?.url}`,
    description: "Behind the scenes, tech events, travel diaries, and personal moments.",
    tags: ["Personal", "Tech Events", "Travel"],
    color: "hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]",
    bgColor: "bg-[#201017] border-rose-950/40",
    logoColor: "text-[#e4405f]",
    logoBg: "bg-[#e4405f]/10 border-[#e4405f]/24",
    btnClass: "bg-gradient-to-r from-pink-600 via-rose-650 to-orange-500 hover:from-pink-500 hover:via-rose-500 hover:to-orange-450 text-white shadow-lg shadow-rose-900/10 border border-rose-500/20",
    natureLabel: "Flora Sunset",
    handle: ""
  },
  {
    platform: "Facebook",
    username: PROFILE_DATA.facebook[0]?.handle,
    icon: <Facebook className="w-5 h-5" />,
    url: `${PROFILE_DATA.facebook[0]?.url}`,
    description: "Connect and follow for updates, tech news, and community engagement.",
    tags: ["Social", "Community", "Updates"],
    color: "hover:border-[#1877F2]/50 hover:shadow-[0_0_20px_rgba(24,119,242,0.15)]",
    bgColor: "bg-[#091523] border-[#1877F2]/10",
    logoColor: "text-[#1877F2]",
    logoBg: "bg-[#1877F2]/10 border-[#1877F2]/24",
    btnClass: "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-900/10 border border-indigo-500/20",
    natureLabel: "River Current",
    handle: ""
  },
  {
    platform: "Email",
    username: PROFILE_DATA.email,
    icon: <Mail className="w-5 h-5" />,
    url: `mailto:${PROFILE_DATA.email}`,
    description: "Direct email for collaborations, project proposals, and research inquiries.",
    tags: ["Direct", "Collaboration", "24hr Reply"],
    color: "hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]",
    bgColor: "bg-[#1e0f0f] border-red-950/40",
    logoColor: "text-[#ea4335]",
    logoBg: "bg-[#ea4335]/10 border-[#ea4335]/24",
    btnClass: "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-900/10 border border-rose-500/20",
    natureLabel: "Magma Volcanic",
    handle: ""
  },
];

interface LinksYamlDashboardProps {
  theme: VSCodeTheme;
  content: string;
}

export default function LinksYamlDashboard({
  theme,
  content,
}: LinksYamlDashboardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);
  const [copiedPhone, setCopiedPhone] = useState<boolean>(false);
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const date = new Date();
    setCurrentDate(
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    );
  }, []);

  const handleCopyText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE_DATA.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 1500);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(PROFILE_DATA.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 1500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] overflow-hidden">
      {/* Global Styles for Custom Scrollbar - Applied to main scroll container */}
      <style>{`
        /* ENTIRE PAGE SCROLL CONTAINER */
        .page-scroll {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          min-height: 0;
        }
        
        /* Custom Scrollbar for the entire page */
        .page-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .page-scroll::-webkit-scrollbar-track {
          background: #252526;
          border-left: 1px solid #3c3c3c;
        }
        .page-scroll::-webkit-scrollbar-thumb {
          background: #424242;
          border-radius: 0px;
        }
        .page-scroll::-webkit-scrollbar-thumb:hover {
          background: #4e4e4e;
        }
        .page-scroll::-webkit-scrollbar-corner {
          background: #1e1e1e;
        }
        
        /* Cards grid */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 1rem;
        }
        
        /* YAML code block - NO internal scroll, just expands */
        .yaml-code {
          overflow-x: auto;
          white-space: pre-wrap;
          word-break: break-word;
        }
        
        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .card-animate {
          animation: fadeInUp 0.3s ease-out forwards;
        }
        
        .cursor-blink {
          animation: blink 1s step-end infinite;
        }
        
        /* PowerShell cursor */
        .ps-cursor {
          display: inline-block;
          width: 8px;
          height: 14px;
          background-color: #4ec9b0;
          animation: blink 1s step-end infinite;
          margin-left: 2px;
        }
      `}</style>

      {/* ==================== HEADER (Fixed) ==================== */}
      {/* <div className="bg-[#252526] border-b border-[#3c3c3c] px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Menu className="w-4 h-4 text-[#cccccc] hover:text-white cursor-pointer" />
          <div className="flex items-center gap-2 text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-[#4ec9b0]" />
            <span className="text-[#cccccc]">PowerShell</span>
            <span className="text-[#6a6a6a]">—</span>
            <span className="text-[#cccccc]">~/portfolio/connect</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Minimize2 className="w-3.5 h-3.5 text-[#cccccc] hover:text-white cursor-pointer" />
          <Square className="w-3 h-3 text-[#cccccc] hover:text-white cursor-pointer" />
          <X className="w-3.5 h-3.5 text-[#cccccc] hover:text-white cursor-pointer" />
        </div>
      </div> */}

      {/* ==================== SCROLLABLE PAGE CONTENT ==================== */}
      <div className="page-scroll">
        <div className="p-4">
          {/* PowerShell Prompt Section */}
          <div className="mb-3">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-[#4ec9b0] font-bold">PS</span>
              <span className="text-[#9cdcfe]">
                C:\Users\Sanjib\portfolio\connect&gt;
              </span>
              <span className="ps-cursor" />
            </div>
          </div>

          <div className="flex items-center gap-2 text-[11px] mb-3">
            <span className="text-[#4ec9b0]">❯</span>
            <span className="text-white">
              Get-Content .\links.yml | Select-Object -First 30
            </span>
            <span className="text-[#6a6a6a] text-[10px]">
              (6 connections found)
            </span>
          </div>

          {/* YAML Code Block - NO internal scroll, expands with page */}
          <div className="bg-[#1a1a1a] rounded border border-[#3c3c3c] overflow-hidden mb-4 flex flex-col h-[400px] ">
            {/* Header */}
            <div className="bg-[#252526] px-3 py-1.5 flex items-center justify-between border-b border-[#3c3c3c] flex-shrink-0">
              <div className="flex items-center gap-2">
                <FileCode className="w-3 h-3 text-[#4ec9b0]" />
                <span className="text-[9px] font-mono text-[#6a6a6a] uppercase tracking-wider">
                  links.yml - PowerShell ISE
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#4ec9b0] cursor-blink" />
                <span className="text-[8px] text-[#6a6a6a]">valid</span>
                <span className="text-[8px] text-[#6a6a6a]">|</span>
                <span className="text-[8px] text-[#6a6a6a]">YAML</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-none p-4 yaml-code">
              <pre className="text-[10px] font-mono leading-relaxed whitespace-pre-wrap break-words">
                <span className="text-[#569cd6]">connections:</span>
                <br />

                <span className="text-[#6a6a6a] ml-2">total:</span>
                <span className="text-[#b5cea8]">
                  {" "}
                  {CONNECTIONS_DATA.length}
                </span>
                <br />

                <span className="text-[#6a6a6a] ml-2">status:</span>
                <span className="text-[#ce9178]"> "active"</span>
                <br />

                <span className="text-[#6a6a6a] ml-2">last_sync:</span>
                <span className="text-[#ce9178]"> "{currentDate}"</span>
                <br />

                <span className="text-[#6a6a6a] ml-2">platforms:</span>
                <br />

                {CONNECTIONS_DATA.map((card, idx) => (
                  <div key={idx} className="ml-4">
                    <span className="text-[#9cdcfe]">
                      - {card.platform.toLowerCase().replace(" / x", "_x")}:
                    </span>
                    <br />

                    <span className="text-[#6a6a6a] ml-6">username:</span>
                    <span className="text-[#ce9178]"> "{card.username}"</span>
                    <br />

                    <span className="text-[#6a6a6a] ml-6">status:</span>
                    <span className="text-[#b5cea8]"> active</span>
                    <br />
                  </div>
                ))}

                <span className="text-[#6a6a6a] ml-2">response_time:</span>
                <span className="text-[#ce9178]"> "&lt;24h"</span>
                <br />

                <span className="text-[#569cd6]">metadata:</span>
                <br />

                <span className="text-[#6a6a6a] ml-2">version:</span>
                <span className="text-[#ce9178]"> "1.0.0"</span>
                <br />

                <span className="text-[#6a6a6a] ml-2">environment:</span>
                <span className="text-[#ce9178]"> "production"</span>
                <br />

                <span className="text-[#6a6a6a] ml-2">region:</span>
                <span className="text-[#ce9178]"> "Kolkata, India (IST)"</span>
              </pre>
            </div>

            {/* Footer */}
            <div className="bg-[#252526] px-3 py-1 flex items-center justify-between border-t border-[#3c3c3c] flex-shrink-0">
              <div className="flex items-center gap-2 text-[8px] text-[#6a6a6a]">
                <Clock className="w-2.5 h-2.5" />
                <span>Last sync: {currentDate}</span>
              </div>

              <div className="flex items-center gap-1">
                <Power className="w-2 h-2 text-[#4ec9b0]" />
                <span className="text-[8px] text-[#6a6a6a]">ACTIVE</span>
              </div>
            </div>
          </div>

          {/* Profile Header */}
          {/* <div className="bg-[#252526] rounded-lg border border-[#3c3c3c] p-4 mb-4">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded bg-gradient-to-br from-[#007acc] to-[#4ec9b0] flex items-center justify-center shadow-lg">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-lg font-bold text-white">SANJIB BAYEN</h1>
                    <span className="text-[8px] bg-[#4ec9b0]/20 text-[#4ec9b0] border border-[#4ec9b0]/30 px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                      <Shield className="w-2.5 h-2.5" /> VERIFIED
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[10px] text-[#6a6a6a]">
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span className="font-mono">sanjibayen04@gmail.com</span>
                      <button onClick={handleCopyEmail} className="ml-0.5 p-0.5 hover:bg-[#3c3c3c] rounded transition">
                        {copiedEmail ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                      </button>
                    </div>
                    <div className="w-px h-3 bg-[#3c3c3c]" />
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span className="font-mono">+91 7477743793</span>
                      <button onClick={handleCopyPhone} className="ml-0.5 p-0.5 hover:bg-[#3c3c3c] rounded transition">
                        {copiedPhone ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
                      </button>
                    </div>
                    <div className="w-px h-3 bg-[#3c3c3c]" />
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>Kolkata, India (IST)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e1e] rounded border border-[#3c3c3c]">
                  <Briefcase className="w-3 h-3 text-[#4ec9b0]" />
                  <span className="text-[9px] text-[#6a6a6a] uppercase">Role</span>
                  <span className="text-[10px] text-white font-medium">AI Research Engineer</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e1e] rounded border border-[#3c3c3c]">
                  <Users className="w-3 h-3 text-[#4ec9b0]" />
                  <span className="text-[9px] text-[#6a6a6a] uppercase">Status</span>
                  <span className="text-[10px] text-white font-medium">Open for Collab</span>
                </div>
              </div>
            </div>
          </div> */}

          {/* Section Title */}
          <div className="flex items-center gap-2 mb-4">
            <Link2 className="w-4 h-4 text-[#4ec9b0]" />
            <h2 className="text-[11px] font-bold text-[#6a6a6a] uppercase tracking-wider">
              Active Connections
            </h2>
            <div className="flex-1 h-px bg-[#3c3c3c]" />
            <span className="text-[9px] text-[#4ec9b0] font-mono">
              {CONNECTIONS_DATA.length} endpoints
            </span>
          </div>

          {/* Cards Grid */}
          <div className="cards-grid mb-5">
            {CONNECTIONS_DATA.map((card, idx) => (
              <div
                key={idx}
                className={`card-animate group rounded-xl border ${card.bgColor} ${card.color} transition-all duration-300 hover:bg-[#1a1c23]/30 overflow-hidden relative shadow-lg hover:-translate-y-1`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Visual nature ambient bloom blur backdrop decor */}
                <div
                  className={`absolute top-0 right-0 w-24 h-24 rounded-full filter blur-3xl opacity-10 group-hover:opacity-15 transition-opacity duration-300 pointer-events-none -mr-4 -mt-4 ${card.logoColor}`}
                />

                <div className="p-5 relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2.5 rounded-xl border transition-all duration-300 group-hover:scale-110 flex items-center justify-center ${card.logoBg} ${card.logoColor}`}
                      >
                        {card.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white text-sm tracking-tight">
                            {card.platform}
                          </h3>
                          <span
                            className={`text-[7.5px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded border ${card.logoBg} ${card.logoColor} tracking-widest`}
                          >
                            {card.natureLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <AtSign className="w-2.5 h-2.5 text-[#888899]" />
                          <span className="text-[9.5px] text-[#888899] font-mono truncate max-w-[150px]">
                            {card.username}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopyText(card.username, idx)}
                      className="p-1.5 bg-neutral-900/40 hover:bg-neutral-850 border border-neutral-800 rounded-lg transition"
                      title="Copy username"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-[#888]" />
                      )}
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-[10.5px] text-zinc-300 leading-relaxed mb-4 min-h-[40px] font-sans">
                    {card.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {card.tags.map((tag, ti) => (
                      <span
                        key={ti}
                        className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 uppercase tracking-wider ${card.logoBg} ${card.logoColor}`}
                      >
                        <Tag className="w-2.5 h-2.5 shrink-0" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <a
                    href={card.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between w-full py-2 px-3.5 rounded-lg transition-all duration-200 group/btn font-mono text-[9.5px] tracking-wider uppercase font-semibold transform active:scale-95 cursor-pointer ${card.btnClass}`}
                  >
                    <span>Connect → {card.platform}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-white/90 group-hover/btn:translate-x-0.5 transition-transform" />
                  </a>
                </div>

                {/* Progress Bar Decoration */}
                <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-rose-500 w-0 group-hover:w-full transition-all duration-500" />
              </div>
            ))}
          </div>

          {/* Contact Info Section */}

          {/* Bottom spacer */}
          <div className="h-4" />
        </div>
      </div>

      {/* ==================== STATUS BAR (Fixed) ==================== */}
      {/* <div className="bg-[#007acc] px-3 py-1 flex items-center justify-between text-[9px] text-white font-mono shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3 h-3" />
            <span>PowerShell</span>
          </div>
          <div className="w-px h-3 bg-white/30" />
          <span>YAML</span>
          <div className="w-px h-3 bg-white/30" />
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4ec9b0]" />
            <span>{CONNECTIONS_DATA.length} Connections Active</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-2.5 h-2.5" />
          <span>{new Date().toLocaleDateString()}</span>
          <div className="w-px h-3 bg-white/30" />
          <span>UTF-8</span>
          <div className="w-px h-3 bg-white/30" />
          <span>LF</span>
          <div className="w-px h-3 bg-white/30" />
          <span>YAML</span>
        </div>
      </div> */}
    </div>
  );
}
