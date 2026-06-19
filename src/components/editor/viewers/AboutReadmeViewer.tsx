/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *Copyright 2026 Sanjib Bayen
 * VS Code Professional README - Engineering Excellence Edition
 */

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Terminal,
  Cpu,
  Activity,
  Sparkles,
  Code2,
  Mail,
  Github,
  ChevronRight,
  User,
  ExternalLink,
  GraduationCap,
  MapPin,
  Zap,
  Coffee,
  Rocket,
  Brain,
  Globe,
  Star,
  Award,
  Command,
  CornerDownRight,
  Binary,
  Database,
  Server,
  Shield,
  Package,
  GitBranch,
  CheckCircle2,
  FileCode2,
  BookOpen,
  Linkedin,
  Code,
  Compass,
} from "lucide-react";
import { VSCodeTheme } from "../../../shared/types";
import { PROFILE_DATA } from "../../../features/about";
import { PROJECTS_DATA, Project } from "../../../features/projects";

interface AboutReadmeViewerProps {
  theme: VSCodeTheme;
  content: string;
  openFile: (path: string) => void;
  triggerTerminalSimulate: (msg: string) => void;
}

// Professional statistics
const ENGINEER_STATS = [
  { icon: Brain, label: "AI Models Deployed", value: "25+", color: "#569cd6" },
  { icon: Code2, label: "Lines of Code", value: "250K+", color: "#4ec9b0" },
  { icon: Package, label: "NPM Packages", value: "15+", color: "#ce9178" },
  { icon: GitBranch, label: "Contributions", value: "2K+", color: "#c586c0" },
  {
    icon: CheckCircle2,
    label: "Tests Passing",
    value: "100%",
    color: "#6a9955",
  },
  { icon: Coffee, label: "Sessions", value: "∞", color: "#dcdcaa" },
];

// Professional work principles
const WORK_PRINCIPLES = [
  {
    icon: Shield,
    title: "Reliability First",
    desc: "Systems designed with fault tolerance and graceful degradation patterns",
  },
  {
    icon: Binary,
    title: "Clean Architecture",
    desc: "Separation of concerns, dependency injection, and modular design principles",
  },
  {
    icon: Zap,
    title: "Performance Critical",
    desc: "Optimized algorithms, lazy loading, and efficient resource utilization",
  },
];

export default function AboutReadmeViewer({
  theme,
  content,
  openFile,
  triggerTerminalSimulate,
}: AboutReadmeViewerProps) {
  const [typedTagline, setTypedTagline] = useState("");
  const [activeStatIndex, setActiveStatIndex] = useState(0);

  // Typewriter effect for professional tagline
  useEffect(() => {
    const tagline = `${PROFILE_DATA.roles.join(" · ")}`;
    let index = 0;
    const interval = setInterval(() => {
      if (index <= tagline.length) {
        setTypedTagline(tagline.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Rotate active stat highlight
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStatIndex((prev) => (prev + 1) % ENGINEER_STATS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Terminal command runner
  const runCommand = useCallback(
    (cmd: string) => {
      triggerTerminalSimulate(cmd);
    },
    [triggerTerminalSimulate],
  );

  // Get project icon by category
  const getProjectIcon = (project: Project) => {
    const name = project.name.toLowerCase();
    if (name.includes("lunar") || name.includes("space")) return Cpu;
    if (name.includes("chess")) return Brain;
    if (name.includes("risk") || name.includes("disease")) return Activity;
    if (name.includes("drone")) return Rocket;
    return Code2;
  };

  // Memoized project categories
  const projectCategories = useMemo(() => {
    return PROJECTS_DATA.reduce(
      (acc, project) => {
        const category = project.techStack[0] || "Other";
        if (!acc[category]) acc[category] = [];
        acc[category].push(project);
        return acc;
      },
      {} as Record<string, Project[]>,
    );
  }, []);

  // Showcase maximum top 6 projects in total, and maximum each section from top 3.
  // "if not available top 3 then can take top 3 from any section"
  const showcaseProjects = useMemo(() => {
    const grouped: Record<string, Project[]> = {};
    PROJECTS_DATA.forEach((p) => {
      const cat = p.category;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(p);
    });

    const selected: Project[] = [];
    const categories = Object.keys(grouped);
    const selectedIds = new Set<number>();

    // 1. Take up to 3 from each section/category
    categories.forEach((cat) => {
      const projs = grouped[cat];
      const take = projs.slice(0, 3);
      take.forEach((p) => {
        if (!selectedIds.has(p.id)) {
          selected.push(p);
          selectedIds.add(p.id);
        }
      });
    });

    // 2. If total selected is less than 6, backfill with remaining projects from any section
    if (selected.length < 6) {
      const remaining = PROJECTS_DATA.filter((p) => !selectedIds.has(p.id));
      for (const p of remaining) {
        if (selected.length >= 6) break;
        selected.push(p);
        selectedIds.add(p.id);
      }
    }

    return selected.sort((a, b) => a.id - b.id);
  }, []);

  return (
    <div className="w-full h-full flex flex-col bg-[#1e1e1e] overflow-y-auto custom-scrollbar font-sans text-left">
      {/* ==================== HERO SECTION ==================== */}
      <div className="relative w-full py-14 px-6 md:px-12 bg-[#1e1e1e] border-b border-[#2d2d2d] shrink-0 overflow-hidden">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
            <defs>
              <pattern
                id="readmeGrid"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="#569cd6"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#readmeGrid)" />
          </svg>
        </div>
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#569cd6]/3 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#4ec9b0]/3 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Title with VS Code syntax highlighting */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-mono">
              <span className="text-[#569cd6]">#</span>{" "}
              <span className="text-[#4ec9b0]">{PROFILE_DATA.name}</span>
            </h1>
          </motion.div>

          {/* Typed tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-2"
          >
            <p className="text-sm md:text-base text-[#dcdcaa] font-mono">
              <span className="text-[#6a9955]">/** </span>
              {typedTagline}
              <span className="animate-cursor ml-0.5">|</span>
              <span className="text-[#6a9955]"> */</span>
            </p>
          </motion.div>

          {/* Location & Education */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#858585] font-mono mb-8"
          >
            <span className="flex items-center text-center gap-1.5">
              {/* <MapPin className="w-3.5 h-3.5 text-[#569cd6]" /> */}
              <span>{PROFILE_DATA.location}</span>
            </span>
            <span className="text-[#555]">|</span>
            <span className="flex items-center gap-1.5">
              {/* <Compass className="w-3.5 h-3.5 text-[#569cd6]" /> */}
              <span >Chasing Curiosity</span>
            </span>
            <span className="text-[#555]">|</span>
            <span className="flex items-center gap-1.5">
              {/* <Mail className="w-3.5 h-3.5 text-[#569cd6]" /> */}
              <span >Solving Problems</span>
            </span>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex flex-wrap gap-3"
          >
            <button
              onClick={() => openFile("connect/api.tsx")}
              className="group px-5 py-2.5 bg-[#0e639c] hover:bg-[#1177bb] text-white text-xs font-semibold rounded transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Send Message</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <a
              href={PROFILE_DATA.github[0]?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#252526] hover:bg-[#2d2d2d] text-[#cccccc] text-xs font-semibold rounded border border-[#454545] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-[#858585]" />
            </a>

            <a
              href={PROFILE_DATA.linkedin[0]?.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-[#252526] hover:bg-[#2d2d2d] text-[#cccccc] text-xs font-semibold rounded border border-[#454545] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Linkedin className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 text-[#858585]" />
            </a>

            <button
              onClick={() => runCommand("whoami")}
              className="px-5 py-2.5 bg-[#252526] hover:bg-[#2d2d2d] text-[#cccccc] text-xs font-semibold rounded border border-[#454545] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-[#4ec9b0]" />
              <span>whoami</span>
              <span className="text-[#858585] text-[10px]">in terminal</span>
            </button>
          </motion.div>
        </div>
      </div>

      {/* ==================== MAIN CONTENT ==================== */}
      <div className="max-w-4xl w-full mx-auto p-6 md:p-12 space-y-10">
        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-[#569cd6] font-mono text-xl font-bold">
              ##
            </span>
            <h1 className="text-xl font-bold text-[#4ec9b0] font-mono uppercase tracking-wider">
              About
            </h1>
            <div className="flex-1 h-px bg-[#2d2d2d]" />
          </div>

          <div className="p-5 rounded-md bg-[#252526] border border-[#2d2d2d] border-l-[3px] border-l-[#569cd6]">
            <p className="text-xs text-[#cccccc] leading-relaxed font-mono">
              <span className="text-[#6a9955]">/*</span>
              <span className="text-[#dcdcaa]"> {PROFILE_DATA.philosophy}</span>
              <span className="text-[#6a9955]"> */</span>
            </p>
          </div>
        </motion.div>

        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-[#569cd6] font-mono text-xl font-bold">
              ##
            </span>
            <h2 className="text-xl font-bold text-[#4ec9b0] font-mono uppercase tracking-wider">
              Projects
            </h2>
            <span className="text-[10px] text-[#858585] font-mono">
              ({PROJECTS_DATA.length} repositories)
            </span>
            <div className="flex-1 h-px bg-[#2d2d2d]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {showcaseProjects.map((project, index) => {
              const IconComponent = getProjectIcon(project);

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="group p-5 rounded-md bg-[#252526] border border-[#2d2d2d] hover:border-[#454545] transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded bg-[#1e1e1e] border border-[#2d2d2d] group-hover:border-[#569cd6]/30 transition-colors">
                        <Code className="w-5 h-5 text-[#3fb950] group-hover/item:text-[#58a6ff] transition" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#4ec9b0] font-mono group-hover:text-[#569cd6] transition-colors">
                          {project.name}
                        </h3>
                        <p className="text-[10px] text-[#858585] font-mono">
                          {project.techStack.slice(0, 3).join(" · ")}
                        </p>
                      </div>
                    </div>
                    {project.liveDemoUrl && (
                      <span className="text-[9px] font-mono text-[#4ec9b0] bg-[#4ec9b0]/10 px-2 py-0.5 rounded border border-[#4ec9b0]/20">
                        LIVE
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#858585] leading-relaxed mb-3">
                    {project.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.techStack.map((tech, i) => (
                      <span
                        key={i}
                        className="text-[9px] font-mono px-1.5 py-0.5 bg-[#1e1e1e] rounded text-[#ce9178] border border-[#2d2d2d]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-[#2d2d2d]">
                    <button
                      onClick={() => openFile("projects/portfolio.db")}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono text-[#858585] hover:text-white bg-[#1e1e1e] hover:bg-[#2d2d2d] rounded border border-[#2d2d2d] transition-colors cursor-pointer"
                    >
                      <Database className="w-3 h-3 text-[#569cd6]" />
                      <span>View Details</span>
                    </button>
                    {project.liveDemoUrl && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 text-[10px] font-mono text-[#858585] hover:text-white bg-[#1e1e1e] hover:bg-[#2d2d2d] rounded border border-[#2d2d2d] transition-colors cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Workspace Files Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center  gap-2">
            <span className="text-[#569cd6] font-mono text-xl font-bold">
              ##
            </span>
            <h2 className="text-xl font-bold text-[#4ec9b0] font-mono uppercase tracking-wider">
              Workspace Explorer
            </h2>
            <div className="flex-1 h-px bg-[#2d2d2d]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              {
                path: "about/profile.yml",
                icon: FileText,
                color: "#ce9178",
                label: "profile.yml",
                desc: "Profile Schema",
                cmd: "cat about/profile.yml",
              },
              {
                path: "connect/api.tsx",
                icon: Globe,
                color: "#4ec9b0",
                label: "api.tsx",
                desc: "SMTP Gateway",
                cmd: "code connect/api.tsx",
              },
              {
                path: "research/research.ipynb",
                icon: BookOpen,
                color: "#dcdcaa",
                label: "research.ipynb",
                desc: "Research Papers",
                cmd: "jupyter research.ipynb",
              },
              {
                path: "achievements/timeline.log",
                icon: Award,
                color: "#c586c0",
                label: "timeline.log",
                desc: "Milestones",
                cmd: "tail achievements/timeline.log",
              },
            ].map((item, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                onClick={() => {
                  openFile(item.path);
                }}
                className="group p-4 text-left rounded-md bg-[#252526] border border-[#2d2d2d] hover:border-[#454545] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <item.icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: item.color }}
                  />
                  <span className="text-[11px] font-mono text-[#cccccc] group-hover:text-white transition-colors truncate">
                    {item.label}
                  </span>
                </div>
                <p className="text-[10px] text-[#858585] mb-2">{item.desc}</p>
                <div className="flex items-center gap-1 text-[9px] font-mono text-[#6a9955]">
                  <CornerDownRight className="w-2.5 h-2.5" />
                  <span className="truncate">{item.cmd}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Terminal Commands Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="text-[#569cd6] font-mono text-xl  font-bold">
              ##
            </span>
            <h2 className="text-xl font-bold text-[#4ec9b0] font-mono uppercase tracking-wider">
              Quick Commands
            </h2>
            <div className="flex-1 h-px bg-[#2d2d2d]" />
          </div>

          <div className="p-4 rounded-md bg-[#252526] border border-[#2d2d2d] space-y-3">
            <p className="text-[10px] text-[#858585] font-mono">
              <span className="text-[#6a9955]">
                // Execute these commands in the integrated terminal below
              </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                {
                  cmd: "whoami",
                  desc: "Display engineer profile",
                  key: "user",
                },
                {
                  cmd: "skills --list",
                  desc: "List technical competencies",
                  key: "skills",
                },
                { cmd: "secrets", desc: "Show secrets", key: "secrets" },
                {
                  cmd: "help",
                  desc: "Display all available commands",
                  key: "help",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 rounded bg-[#1e1e1e] border border-[#2d2d2d]"
                >
                  <div className="flex items-center gap-3">
                    <Terminal className="w-3.5 h-3.5 text-[#4ec9b0]" />
                    <div>
                      <code className="text-xs font-mono text-[#4ec9b0]">
                        {item.cmd}
                      </code>
                      <p className="text-[9px] text-[#858585]">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => runCommand(item.cmd)}
                    className="px-3 py-1.5 text-[10px] font-mono text-[#858585] hover:text-white bg-[#252526] hover:bg-[#0e639c] rounded border border-[#2d2d2d] hover:border-[#0e639c] transition-all cursor-pointer"
                  >
                    Run
                  </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-[#2d2d2d]"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            {/* <div className="flex items-center gap-3 text-[10px] font-mono text-[#858585]">
              <span className="text-[#6a9955]">●</span>
              <span>Build passing</span>
              <span className="text-[#555]">|</span>
              <span>Coverage 100%</span>
              <span className="text-[#555]">|</span>
              <span>Deployed on Vercel</span>
              <span className="text-[#6a9955]">●</span>
            </div> */}

            <div className="flex items-center gap-4">
              <a
                href={PROFILE_DATA.github[0]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#858585] hover:text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href={PROFILE_DATA.linkedin[0]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#858585] hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${PROFILE_DATA.email}`}
                className="text-[#858585] hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>

            <p className="text-[9px] font-mono text-[#555]">
              <span className="text-[#6a9955]">/*</span> ©{" "}
              {new Date().getFullYear()} {PROFILE_DATA.name} · Built with love &
              Engineering Excellence <span className="text-[#6a9955]">*/</span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Cursor animation style */}
      <style>{`
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .animate-cursor {
          animation: cursor-blink 1s infinite;
          color: #569cd6;
        }
      `}</style>
    </div>
  );
}
