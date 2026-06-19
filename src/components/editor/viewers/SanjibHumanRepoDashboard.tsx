/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import React, { useState } from "react";
import {
  GitBranch,
  GitPullRequest,
  AlertCircle,
  Terminal,
  Users,
  Award,
  Bug,
  Coffee,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Settings,
  Clock,
  Check,
  Bot,
  Code,
  BookOpen,
  Github,
  Folder,
  FileCode,
  Star,
  Eye,
  GitFork,
  Search,
  RotateCcw,
  Shield,
  Sliders,
  HelpCircle,
  Lock,
  Bell,
  Plus,
  MessageSquare,
  FileText,
  Workflow,
  Sparkles,
  GitMerge,
  Info,
} from "lucide-react";
import { toast } from "../../../shared/utils/toast";
import { PROFILE_DATA, achievementsData } from "../../../features/about";
import { PROJECTS_DATA } from "../../../features/projects";
import { researchPapersData } from "../../../features/research";

interface SanjibHumanRepoDashboardProps {
  openFile?: (path: string) => void;
}

const BRANCH_DESCRIPTIONS: Record<string, string> = {
  main: "Production branch. Mostly stable, runs on coffee and high ambition. Prone to sleep-deprivation anomalies.",
  "hotfix/caffeine-recovery":
    "Emergency patch. Injecting double-espresso vectors to correct 3:00 AM temporal calculation anomalies.",
};

export default function SanjibHumanRepoDashboard({
  openFile,
}: SanjibHumanRepoDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "code" | "issues" | "prs" | "actions"
  >("code");

  // Calculated stats from files
  const completedProjectsCount = PROJECTS_DATA.filter(
    (p) => p.status === "DEPLOYED",
  ).length;
  const completedResearchCount = researchPapersData.filter(
    (r) => r.status === "Completed",
  ).length;

  // Top 33 achievements sorted by date descending
  const sortedAchievements = [...achievementsData]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  // Dynamic metrics & state tracking
  const [starred, setStarred] = useState(true); // Matches "Starred 1" from the image
  const [starCount, setStarCount] = useState(999);
  const [forkCount, setForkCount] = useState(999);
  const [watcherCount, setWatcherCount] = useState(999);
  const [selectedBranch, setSelectedBranch] = useState("main");
  const [branchDetailOpen, setBranchDetailOpen] = useState(false);
  const [Curiosity] = useState(100);
  const [Engineering] = useState(90);
  const [Coffee_Buffer] = useState(1);
  // Issues and Pull Requests filters
  const [issueSearch, setIssueSearch] = useState("");
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [prSearch, setPrSearch] = useState("");
  const [selectedPRId, setSelectedPRId] = useState<string | null>(null);

  // Expanded card options
  const [readmeExpanded, setReadmeExpanded] = useState(true);
  const [logsExpanded, setLogsExpanded] = useState(true);
  const [bugsExpanded, setBugsExpanded] = useState(true);

  // Log streams - updated to match the actions & logs copy
  const [logMessages, setLogMessages] = useState<
    Array<{ type: string; text: string; style: string }>
  >([
    {
      type: "INFO",
      text: "Learning new technology...",
      style: "text-sky-400 font-mono",
    },
    {
      type: "SUCCESS",
      text: "Learned New",
      style: "text-emerald-450 font-bold font-mono",
    },
    {
      type: "INFO",
      text: "Starting research...",
      style: "text-sky-400 font-mono",
    },
    {
      type: "SUCCESS",
      text: "Published findings",
      style: "text-emerald-450 font-bold font-mono",
    },
    {
      type: "WARNING",
      text: "New idea detected",
      style: "text-amber-400 font-mono",
    },
    {
      type: "WARNING",
      text: "Another idea detected",
      style: "text-amber-400 font-mono",
    },
    { type: "ERROR", text: "Too many ideas", style: "text-red-400 font-mono" },
    {
      type: "CRITICAL",
      text: "User opened another browser tab about startups",
      style: "text-rose-500 font-bold font-mono",
    },
  ]);

  const handleStar = () => {
    if (!starred) {
      setStarCount((prev) => prev + 1);
      setStarred(true);
    } else {
      setStarCount((prev) => prev - 1);
      setStarred(false);
    }
  };

  const handleFork = () => {
    setForkCount((prev) => prev + 1);
  };

  const handleWatch = () => {
    setWatcherCount((prev) => prev + 1);
  };

  const handleFileAction = (fileName: string, suggestedPath: string) => {
    if (openFile) {
      openFile(suggestedPath);
    }
  };

  // Files schema matching the screenshot exactly - kept only 3 files requested by user
  const repositoryFiles = [
    {
      name: "ping_human.js",
      type: "file",
      message: "reduced response latency from 3 business days to 3 hours",
      time: "just now",
      path: "connect/api.tsx",
    },
    {
      name: "whoami.md",
      type: "file",
      message:
        "404: documentation unavailable, developer currently compiling ideas",
      time: "1 week ago",
      path: "about/README.md",
    },
    {
      name: "combat_stats.json",
      type: "file",
      message: "converted countless tutorials into usable knowledge",
      time: "last week",
      path: "skills/skills.pkt",
    },
  ];

  const issues = [
    {
      id: "#404",
      title: "Peace Not Found",
      author: "nature",
      time: "2 years ago",
      status: "Open",
      comments: 14,
      label: "critical",
      labelBg:
        "bg-[#da3637]/15 text-[#f85149] border border-[#f85149]/20 font-mono font-semibold",
    },
    {
      id: "#237",
      title: "Wants to build 15 projects simultaneously",
      author: "brain",
      time: "3 weeks ago",
      status: "Open",
      comments: 8,
      label: "assigned: me",
      labelBg:
        "bg-[#58a6ff]/15 text-[#58a6ff] border border-[#58a6ff]/20 font-mono font-semibold",
    },
    {
      id: "#421",
      title: "Needs 48 hours in a day",
      author: "physics",
      time: "1 month ago",
      status: "Open",
      comments: 42,
      label: "physics-bug",
      labelBg:
        "bg-[#ea4aaa]/15 text-[#f061c0] border border-[#f061c0]/20 font-mono font-semibold",
    },
    {
      id: "#502",
      title: "New idea generated while sleeping",
      author: "dream",
      time: "3 days ago",
      status: "Open",
      comments: 9,
      label: "caffeine",
      labelBg:
        "bg-[#bc8cff]/15 text-[#d3b6ff] border border-[#d3b6ff]/20 font-mono font-semibold",
    },
    {
      id: "#666",
      title: "Started another side project again",
      author: "adhd",
      time: "yesterday",
      status: "Open",
      comments: 3,
      label: "wontfix",
      labelBg:
        "bg-[#8b949e]/15 text-[#c9d1d9] border border-[#8b949e]/20 font-mono font-semibold",
    },
  ];

  const pullRequests = [
    {
      id: "#451",
      title: "Adding new skill set",
      author: "sanjib-bayen",
      time: "3 days ago",
      status: "Under Review",
      statusBg: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
    },
    {
      id: "#512",
      title: "Sleep before 2 AM",
      author: "health",
      time: "1 week ago",
      status: "Rejected",
      statusBg: "bg-[#f85149]/10 text-[#f85149] border border-[#f85149]/20",
    },
    {
      id: "#632",
      title: "Stop joining hackathons",
      author: "deadline",
      time: "4 days ago",
      status: "Merge Conflict",
      statusBg: "bg-rose-500/15 text-rose-400 border border-rose-500/20",
    },
    {
      id: "#721",
      title: "Touch grass occasionally",
      author: "friends",
      time: "12 hours ago",
      status: "Waiting Approval",
      statusBg: "bg-sky-500/15 text-sky-400 border border-sky-500/20",
    },
  ];

  const criticalBugs = [
    {
      code: "ERR_01",
      severity: "Medium",
      title: "Spends 8 hours debugging a 2-minute problem",
      desc: "Prone to refactoring entire systems when a simple semicolon or configuration typo is the actual root cause.",
      style:
        "bg-amber-500/10 text-amber-500 border border-amber-500/20 font-mono font-bold",
    },
    {
      code: "ERR_02",
      severity: "Critical",
      title: "Opens YouTube to learn. Ends up watching drone videos.",
      desc: "Starts looking up a quick tutorial on on-chip discrete waves and STM32 registers, gets recommended high-speed FPV landscape videos, and gets highly inspired.",
      style:
        "bg-red-500/10 text-rose-400 border border-red-500/20 font-mono font-bold",
    },
    {
      code: "ERR_03",
      severity: "Legendary",
      title: "Creates project folders faster than finished projects.",
      desc: "The workspace contains 47 different folder schemes starting with standard setup drafts. Waiting for weekend hack sessions to integrate.",
      style:
        "bg-purple-500/10 text-purple-400 border border-purple-500/20 font-mono font-bold",
    },
    {
      code: "ERR_04",
      severity: "Extreme",
      title: "Gets a new startup idea every 3 business minutes.",
      desc: "Sees an everyday operational friction and immediately drafts a full-stack architecture with a Cloud Spanner database and autonomous microservices.",
      style:
        "bg-orange-500/10 text-orange-400 border border-orange-500/20 font-mono font-bold",
    },
  ];

  return (
    <div className="w-full h-full bg-[#0d1117] text-[#c9d1d9] flex flex-col font-sans overflow-y-auto custom-scrollbar relative text-left">
      {/* REPOSITORY SUB-HEADER & NAVIGATION TABS */}
      <div className="bg-[#161b22] border-b border-[#30363d] px-6 pt-5 flex flex-col shrink-0 shadow-sm">
        {/* Repo Title and Header Right Control Widgets */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3">
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            {/* <svg
              className="w-5 h-5 text-[#8b949e]"
              viewBox="0 0 16 16"
              fill="currentColor"
            >
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 
  0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13
  -.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66
  .07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
  0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12
  0 0 .67-.21 2.2.82A7.65 7.65 0 0 1 8 4.84c.68 0 1.36.09 2 .27
  1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12
  .51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95
  .29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2
  0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg> */}
            <Github className="w-5 h-5 text-[#8b949e]" />
            <div className="flex items-center space-x-1">
              <a
                href={`${PROFILE_DATA.github[0]?.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#5af] text-xl hover:text-blue-400 hover:underline font-mono"
              >
                {PROFILE_DATA.handle}
              </a>
              <span className="text-[#30363d] font-light text-xl select-none font-mono">
                /
              </span>
              <a
                href={`${PROFILE_DATA.github[0]?.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#f0f6fc] text-xl tracking-tight hover:text-[#58a6ff] transition font-mono"
              >
                sanjib_human
              </a>
            </div>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full border border-[#30363d] text-[#8b949e] bg-[#21262d]/50 font-medium select-none font-mono tracking-wider uppercase ml-2">
              Private
            </span>
          </div>

          {/* Star, Watch, Fork counters */}
          <div className="flex items-center gap-2 select-none text-[12px] font-medium font-sans">
            {/* Watch Widget */}
            <div className="flex items-center shrink-0">
              <button
                onClick={handleWatch}
                className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] px-3 py-1.5 rounded-l-md flex items-center gap-1.5 transition text-xs font-semibold"
              >
                <Eye className="w-3.5 h-3.5 text-[#8b949e]" />
                <span>Watch</span>
                <ChevronDown className="w-3 h-3 text-[#8b949e]" />
              </button>
              <span className="bg-[#161b22] border border-l-0 border-[#30363d] px-3 py-1.5 rounded-r-md text-xs text-[#8b949e] font-mono">
                {watcherCount}
              </span>
            </div>

            {/* Fork Widget */}
            <div className="flex items-center shrink-0">
              <button
                onClick={handleFork}
                className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] px-3 py-1.5 rounded-l-md flex items-center gap-1.5 transition text-xs font-semibold"
              >
                <GitFork className="w-3.5 h-3.5 text-[#8b949e]" />
                <span>Fork</span>
                <ChevronDown className="w-3 h-3 text-[#8b949e]" />
              </button>
              <span className="bg-[#161b22] border border-l-0 border-[#30363d] px-3 py-1.5 rounded-r-md text-xs text-[#8b949e] font-mono">
                {forkCount}
              </span>
            </div>

            {/* Star Widget */}
            <div className="flex items-center shrink-0">
              <button
                onClick={handleStar}
                className={`bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] px-3 py-1.5 rounded-l-md flex items-center gap-1.5 transition text-xs font-semibold ${starred ? "text-[#e3b341] bg-[#30363d]/10" : "text-[#c9d1d9]"}`}
              >
                <Star
                  className={`w-3.5 h-3.5 ${starred ? "fill-[#e3b341] text-[#e3b341]" : "text-[#8b949e]"}`}
                />
                <span>{starred ? "Starred" : "Star"}</span>
                <ChevronDown className="w-3 h-3 text-[#8b949e]" />
              </button>
              <span className="bg-[#161b22] border border-l-0 border-[#30363d] px-3 py-1.5 rounded-r-md text-xs text-[#8b949e] font-mono">
                {starCount}
              </span>
            </div>
          </div>
        </div>

        {/* Humorous Metadata Dashboard Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pb-4 border-t border-[#30363d]/40 pt-3 text-xs select-none">
          <div className="flex items-center space-x-2 bg-[#0d1117]/60 px-3 py-2 rounded-md border border-[#30363d]/40">
            <span className="text-[#8b949e] font-mono text-[10px] uppercase tracking-wider">
              Status:
            </span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
              {/* <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> */}
              Mostly Stable
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-[#0d1117]/60 px-3 py-2 rounded-md border border-[#30363d]/40 min-w-0">
            <span className="text-[#8b949e] font-mono text-[10px] uppercase tracking-wider shrink-0 ">
              Last Commit:
            </span>
            <span
              className="text-[#ff7b72] font-mono text-[11px] truncate font-medium"
              title='"Fixed bug where I forgot to sleep"'
            >
              "Fixed bug where I forgot to sleep"
            </span>
          </div>
          <div className="flex items-center space-x-2 bg-[#0d1117]/60 px-3 py-2 rounded-md border border-[#30363d]/40">
            <span className="text-[#8b949e] font-mono text-[10px] uppercase tracking-wider">
              Build Pipeline:
            </span>
            <span className="text-amber-400 font-semibold flex items-center gap-1.5">
              {/* <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> */}
              Passing (some warnings)
            </span>
          </div>
        </div>

        {/* 3. TARGET-OPTIMIZED NAVIGATION TAB ITEMS */}
        <div className="flex items-center overflow-x-auto whitespace-nowrap pt-1.5 scrollbar-none -mb-px">
          {/* Code Tab */}
          <button
            onClick={() => {
              setActiveTab("code");
              setSelectedIssueId(null);
              setSelectedPRId(null);
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-medium font-sans transition ${
              activeTab === "code"
                ? "border-[#f78166] text-[#f0f6fc] font-semibold"
                : "border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#30363d]"
            }`}
          >
            <Code className="w-4 h-4 text-[#8b949e]" />
            <span>Code</span>
          </button>

          {/* Issues Tab */}
          <button
            onClick={() => {
              setActiveTab("issues");
              setSelectedIssueId(null);
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-medium font-sans transition ${
              activeTab === "issues"
                ? "border-[#f78166] text-[#f0f6fc] font-semibold"
                : "border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#30363d]"
            }`}
          >
            <AlertCircle className="w-4 h-4 text-[#8b949e]" />
            <span>Issues</span>
            <span className="bg-[#30363d]/80 text-[#c9d1d9] text-[10px] px-2 py-0.5 rounded-full font-semibold ml-1 border border-[#30363d]">
              {issues.length}
            </span>
          </button>

          {/* Pull requests Tab */}
          <button
            onClick={() => {
              setActiveTab("prs");
              setSelectedPRId(null);
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-medium font-sans transition ${
              activeTab === "prs"
                ? "border-[#f78166] text-[#f0f6fc] font-semibold"
                : "border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#30363d]"
            }`}
          >
            <GitPullRequest className="w-4 h-4 text-[#8b949e]" />
            <span>Pull Requests</span>
            <span className="bg-[#30363d]/80 text-[#c9d1d9] text-[10px] px-2 py-0.5 rounded-full font-semibold ml-1 border border-[#30363d]">
              {pullRequests.length}
            </span>
          </button>

          {/* Actions Tab */}
          <button
            onClick={() => {
              setActiveTab("actions");
            }}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 text-xs font-medium font-sans transition ${
              activeTab === "actions"
                ? "border-[#f78166] text-[#f0f6fc] font-semibold"
                : "border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:border-[#30363d]"
            }`}
          >
            <Terminal className="w-4 h-4 text-[#8b949e]" />
            <span>Actions & Logs</span>
          </button>
        </div>
      </div>

      {/* 4. CORE CONTROLS & CONTENT AREA */}
      <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* ==================== A. CODE EXPLORER VIEW ==================== */}
        {activeTab === "code" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            {/* LEFT 3 COLUMNS: Code branch selector, branch info & main files list */}
            <div className="lg:col-span-3 space-y-5">
              {/* Branch control action header strip */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                  <div className="relative">
                    <button
                      onClick={() => setBranchDetailOpen(!branchDetailOpen)}
                      className="bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] border border-[#30363d] px-3.5 py-1.5 rounded-md flex items-center gap-1.5 text-xs font-sans transition font-semibold"
                    >
                      <GitBranch className="w-3.5 h-3.5 text-[#8b949e]" />
                      <span>{selectedBranch}</span>
                      <ChevronDown className="w-3 h-3 text-[#8b949e]" />
                    </button>
                    {branchDetailOpen && (
                      <div className="absolute left-0 mt-1 w-64 bg-[#161b22] border border-[#30363d] rounded-md shadow-xl z-20 overflow-hidden font-mono text-[11px]">
                        <div className="px-3 py-2 border-b border-[#30363d] font-sans text-xs font-bold text-[#8b949e]">
                          Switch branches/tags
                        </div>
                        <div className="max-h-52 overflow-y-auto custom-scrollbar">
                          {Object.keys(BRANCH_DESCRIPTIONS).map((br) => (
                            <button
                              key={br}
                              onClick={() => {
                                setSelectedBranch(br);
                                setBranchDetailOpen(false);
                              }}
                              className={`w-full text-left px-3 py-2 hover:bg-[#1f242c] transition flex items-center justify-between ${
                                selectedBranch === br
                                  ? "text-[#58a6ff] bg-[#1f242c]/50 font-bold"
                                  : "text-[#c9d1d9]"
                              }`}
                            >
                              <span>{br}</span>
                              {selectedBranch === br && (
                                <Check className="w-3.5 h-3.5 text-[#58a6ff]" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Branch and tags counters */}
                  <div className="flex items-center space-x-3 text-xs text-[#8b949e] font-sans font-normal pl-1 flex-wrap gap-y-1">
                    <span className="hover:text-[#58a6ff] flex items-center gap-1 cursor-pointer">
                      <GitBranch className="w-3.5 h-3.5 text-[#8b949e]/80" />
                      <strong>2</strong> active branches
                    </span>
                    <span className="text-[#30363d] select-none">/</span>
                    <span className="hover:text-[#58a6ff] cursor-pointer">
                      <strong>999</strong> commits
                    </span>
                    {/* <span className="text-[#30363d] select-none">•</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard?.writeText("git clone https://github.com/SanjibBayen/disease-prediction.git");
                      }}
                      className="text-[#58a6ff] hover:underline cursor-pointer font-semibold flex items-center gap-1.5 bg-[#21262d] hover:bg-[#30363d] px-2.5 py-1 rounded border border-[#30363d] transition-colors"
                      title="Click to copy repository URL to clipboard"
                    >
                      <span>Clone / HTTPS Repo</span>
                    </button> */}
                  </div>
                </div>

                {/* Secondary controllers */}
                <div className="flex items-center space-x-2 text-xs font-sans">
                  <span className="bg-[#21262d] border border-[#30363d] px-3 py-1.5 rounded-md text-[#c9d1d9] hover:bg-[#30363d] transition cursor-pointer select-none">
                    Go to file
                  </span>
                  <span className="bg-[#21262d] border border-[#30363d] px-3 py-1.5 rounded-md text-[#c9d1d9] hover:bg-[#30363d] transition cursor-pointer select-none">
                    Add file
                  </span>
                  <button
                    onClick={() =>
                      handleFileAction("README.md", "about/README.md")
                    }
                    className="bg-[#238636] hover:bg-[#2ea043] text-white px-3.5 py-1.5 rounded-md font-semibold font-sans transition flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>View Docs</span>
                  </button>
                </div>
              </div>

              {/* Precise Active Branch Description Widget */}
              <div className="bg-[#151b23] border border-[#30363d]/80 rounded-lg p-3.5 flex items-start gap-3 text-xs leading-relaxed font-sans">
                <div className="bg-[#21262d] p-1.5 rounded border border-[#30363d] shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-[#58a6ff]" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-[10.5px] uppercase tracking-wider text-[#8b949e] font-mono font-bold flex items-center gap-1.5">
                    <span>git branch --description</span>
                    <span>•</span>
                    <span className="text-[#58a6ff] lowercase">
                      git checkout {selectedBranch}
                    </span>
                  </div>
                  <p className="text-[#c9d1d9] font-medium font-sans">
                    {BRANCH_DESCRIPTIONS[selectedBranch]}
                  </p>
                </div>
              </div>

              {/* FILES LIST TABLE  */}
              <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117] shadow-lg">
                {/* Commit Author Block Header Row */}
                <div className="px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between flex-wrap gap-4 text-xs font-sans">
                  <div className="flex items-center space-x-2.5">
                    <a
                      href={`${PROFILE_DATA.github[0]?.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 group"
                    >
                      <img
                        src={PROFILE_DATA.avatarUrl}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover border border-[#30363d] group-hover:scale-105 transition"
                      />
                    </a>

                    <div className="flex items-center space-x-1.5 flex-wrap">
                      <a
                        href={`${PROFILE_DATA.github[0]?.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-[#f0f6fc] hover:text-[#58a6ff] hover:underline cursor-pointer"
                      >
                        {PROFILE_DATA.handle}
                      </a>

                      {/* Dynamic message based on active branch, mimicking recent commit message */}
                      <span className="text-[#c9d1d9] pl-1.5 hover:text-[#58a6ff] cursor-pointer">
                        {selectedBranch === "main"
                          ? " Still shipping things."
                          : `The requested developer documentation could not be located.`}
                      </span>
                    </div>
                  </div>

                  {/* Hash, Time and commit log statistics */}
                  <div className="flex items-center space-x-3 text-[#8b949e] font-mono text-[11px]">
                    <span
                      className="text-[#c9d1d9] hover:text-[#58a6ff] cursor-pointer"
                      title="b302cce commit hash"
                    >
                      Eat
                    </span>
                    <span>•</span>
                    <span className="font-sans italic">Sleep</span>
                    <span>•</span>
                    <span className="text-[#f0f6fc] font-sans hover:text-[#58a6ff] cursor-pointer flex items-center gap-1 hover:underline">
                      {/* <Clock className="w-3.5 h-3.5" /> */}
                      Code
                    </span>
                  </div>
                </div>

                {/* Individual File Explorer Table Rows */}
                <div className="divide-y divide-[#30363d]/70 text-[13.5px] font-sans select-none">
                  {repositoryFiles.map((file) => {
                    const isFolder = file.type === "folder";
                    return (
                      <div
                        key={file.name}
                        onClick={() => handleFileAction(file.name, file.path)}
                        className="flex items-center justify-between px-4 py-2 hover:bg-[#1f242c]/65 transition cursor-pointer group"
                      >
                        {/* File Name + Logo Column */}
                        <div className="flex items-center space-x-3 w-1/3 min-w-[200px] truncate">
                          {isFolder ? (
                            <Folder className="w-4.5 h-4.5 text-[#8b949e] group-hover:text-amber-400 transition" />
                          ) : (
                            <FileCode className="w-4.5 h-4.5 text-[#8b949e] group-hover:text-sky-400 transition" />
                          )}
                          <span className="text-[#c9d1d9] font-medium group-hover:text-[#58a6ff] group-hover:underline truncate">
                            {file.name}
                          </span>
                        </div>

                        {/* Last Commit message Column */}
                        <div className="flex-1 text-[#8b949e] text-xs font-sans px-4 truncate max-w-[500px]">
                          <span className="hover:text-[#58a6ff] cursor-pointer">
                            {file.message}
                          </span>
                        </div>

                        {/* Commit age Column */}
                        <div className="text-right text-[#8b949e] text-xs font-sans w-24 shrink-0 font-light pr-1">
                          {file.time}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. VIRTUAL README CARD (Like a live repository layout) */}
              <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117] shadow-md ">
                <button
                  onClick={() => setReadmeExpanded(!readmeExpanded)}
                  className="w-full px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-left transition hover:bg-[#1f242c]"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4.5 h-4.5 text-[#8b949e]" />
                    <span className="font-bold font-sans text-sm text-[#f0f6fc]">
                      README.md
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8b949e] transition-transform duration-200 ${readmeExpanded ? "transform rotate-180" : ""}`}
                  />
                </button>

                {readmeExpanded && (
                  <div className="p-6 space-y-5 font-sans leading-relaxed text-[#c9d1d9]   select-text">
                    <div className="min-h-[400px]">
                      <div className="min-h-[400px] font-mono">
                        <h1 className="text-5xl font-bold text-[#f85149] mb-4">
                          404
                        </h1>

                        <p className="text-xl text-[#f0f6fc] mb-6">
                          README_NOT_FOUND
                        </p>

                        <div className="space-y-4 text-[#8b949e]">
                          <p>
                            The requested documentation could not be located.
                          </p>

                          <p>
                            Reason: Developer was redirected to another side
                            project before completing this file.
                          </p>

                          <div className="mt-8 p-4 border border-[#30363d] rounded-md bg-[#161b22]">
                            <p>$ whoami</p>
                            <p className="text-[#58a6ff]">Sanjib Bayen</p>

                            <br />

                            <p>$ cat mission.txt</p>
                            <p className="text-[#58a6ff]">
                              converting ideas into reality at unsafe speeds
                            </p>

                            <br />

                            <p>$ git status</p>
                            <p className="text-[#3fb950]">
                              Currently building...
                            </p>

                            <div className="mt-3.5 space-y-2 ml-1">
                              {PROFILE_DATA.currentlyBuilding
                                .slice(0, 3)
                                .map((project) => (
                                  <div
                                    key={project}
                                    className="flex items-center gap-2.5 text-[#c9d1d9] hover:text-[#58a6ff] transition group/item"
                                  >
                                    <div className="flex items-center justify-center w-5 h-5 rounded-md bg-[#21262d] border border-[#30363d] group-hover/item:border-[#58a6ff]/40 transition shadow-sm shrink-0">
                                      <Code className="w-3 h-3 text-[#3fb950] group-hover/item:text-[#58a6ff] transition" />
                                    </div>
                                    <span className="font-mono text-xs tracking-tight">
                                      {project}
                                    </span>
                                  </div>
                                ))}
                              {PROFILE_DATA.currentlyBuilding.length > 3 && (
                                <div className="text-[#8b949e] font-mono text-[10px] pl-7 italic">
                                  +{PROFILE_DATA.currentlyBuilding.length - 3}{" "}
                                  more projects currently compiling...
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-[#30363d]/60 pt-4 text-xs font-mono text-[#8b949e] flex items-center justify-between">
                      <span>Status: 404 USER NOT FOUND</span>
                      <span>Coordinates: 0.0.0.0</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 6. WITTY COMPILER LOGS STREAM & ACTIVE ISSUES COLLAPSIBLE (Keeps funny features accessible!) */}
              <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117] shadow-md">
                <button
                  onClick={() => setBugsExpanded(!bugsExpanded)}
                  className="w-full px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-left transition hover:bg-[#1f242c]"
                >
                  <div className="flex items-center gap-2">
                    <Bug className="w-4.5 h-4.5 text-[#f85149]" />
                    <span className="font-bold font-sans text-sm text-[#f0f6fc]">
                      Security Alerts: Brain Diagnostics File
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8b949e] transition-transform duration-200 ${bugsExpanded ? "transform rotate-180" : ""}`}
                  />
                </button>

                {bugsExpanded && (
                  <div className="divide-y divide-[#30363d]/70 bg-[#0d1117]">
                    {criticalBugs.map((bug, idx) => (
                      <div
                        key={idx}
                        className="p-4 hover:bg-[#161b22]/30 transition space-y-1.5 text-xs font-sans"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-[#f85149] font-bold">
                              ERR_EGO_0{idx + 1}
                            </span>
                            <h4 className="font-bold text-[#c9d1d9]">
                              {bug.title}
                            </h4>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${bug.style}`}
                          >
                            {bug.severity}
                          </span>
                        </div>
                        <p className="text-[#8b949e] leading-relaxed">
                          {bug.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Epoc dynamic simulator logs block */}
              <div className="border border-[#30363d] rounded-lg overflow-hidden bg-[#0d1117] shadow-md">
                <button
                  onClick={() => setLogsExpanded(!logsExpanded)}
                  className="w-full px-4 py-3 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between text-left transition hover:bg-[#1f242c]"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="w-4.5 h-4.5 text-[#58a6ff]" />
                    <span className="font-bold font-sans text-sm text-[#f0f6fc]">
                      Continuous Diagnostics: runtime.log
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8b949e] transition-transform duration-200 ${logsExpanded ? "transform rotate-180" : ""}`}
                  />
                </button>

                {logsExpanded && (
                  <div className="p-4 bg-[#0d1117] text-xs font-mono space-y-3 select-text max-h-72 overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between text-[10px] text-[#8b949e] border-b border-[#30363d] pb-2">
                      <span>
                        PROCESS:{" "}
                        {PROFILE_DATA.name.toUpperCase().replace(/\s+/g, "-")}
                        -NEURAL-CONTAINER
                      </span>
                      <span>100% HEALTH</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-center text-[11px]">
                      <div className="p-2 bg-[#161b22] border border-[#30363d] rounded">
                        <span className="block text-[9px] text-[#8b949e]">
                          Books
                        </span>
                        <strong className="text-emerald-400 font-bold">
                          100% loaded
                        </strong>
                      </div>
                      <div className="p-2 bg-[#161b22] border border-[#30363d] rounded">
                        <span className="block text-[9px] text-[#8b949e]">
                          Research
                        </span>
                        <strong className="text-emerald-400 font-bold">
                          {completedResearchCount} completed
                        </strong>
                      </div>
                      <div className="p-2 bg-[#161b22] border border-[#30363d] rounded">
                        <span className="block text-[9px] text-[#8b949e]">
                          Projects
                        </span>
                        <strong className="text-emerald-400 font-bold">
                          {completedProjectsCount} completed
                        </strong>
                      </div>
                      <div className="p-2 bg-[#161b22] border border-[#30363d] rounded">
                        <span className="block text-[9px] text-[#8b949e]">
                          Failures
                        </span>
                        <strong className="text-[#a5d6ff] font-bold">
                          Overcome
                        </strong>
                      </div>
                      <div className="p-2 bg-[#161b22] border border-[#30363d] rounded">
                        <span className="block text-[9px] text-[#8b949e]">
                          Espresso
                        </span>
                        <strong className="text-emerald-400 font-bold">
                          Continuous
                        </strong>
                      </div>
                    </div>

                    <div className="pt-2 space-y-1.5 text-[11px] text-[#8b949e]">
                      {sortedAchievements.map((ach, idx) => (
                        <div
                          key={ach.id}
                          className="flex justify-between items-center bg-[#161b22]/40 p-1 px-2 rounded gap-2"
                        >
                          <span className="shrink-0 font-mono text-[#58a6ff]">
                            Epoch {500 + idx}:
                          </span>
                          <span
                            className="italic text-[#c9d1d9] text-right flex-1 truncate"
                            title={`[${ach.date}] ${ach.title}`}
                          >
                            [{ach.date}] {ach.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDEBAR: Repository statistics, Releases, Packages, Contributors */}
            <div className="space-y-5 font-sans">
              {/* About Statistics Card */}
              <div className="bg-[#161b22]/20 border border-[#30363d]/80 rounded-lg p-4.5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#30363d]/60">
                  <h3 className="font-bold text-sm text-[#f0f6fc]">About</h3>
                  <Settings className="w-4 h-4 text-[#8b949e] cursor-pointer hover:text-[#58a6ff] transition" />
                </div>
                <p className="text-xs text-[#8b949e] leading-relaxed">
                  {PROFILE_DATA.philosophy}
                </p>

                <div className="space-y-3 pt-2 text-xs font-sans">
                  <span className="flex items-center gap-2.5 hover:text-[#58a6ff] cursor-pointer text-[#8b949e]">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f1e05a]" />
                    <span className="text-[#c9d1d9] font-medium">
                      Sleep Debt
                    </span>
                    <span>100%</span>
                  </span>

                  <div className="divide-y divide-[#30363d]/45 font-mono text-[11.5px] border-t border-[#30363d]/45 pt-1.5 space-y-2">
                    <div className="flex justify-between text-[#8b949e] pt-1">
                      <span>Curiosity</span>
                      <strong className="text-[#c9d1d9]">{Curiosity}%</strong>
                    </div>
                    <div className="flex justify-between text-[#8b949e] pt-1">
                      <span>Engineering</span>
                      <strong className="text-[#c9d1d9]">{Engineering}%</strong>
                    </div>
                    <div className="flex justify-between text-[#8b949e] pt-1">
                      <span>Coffee Buffer</span>
                      <strong className="text-[#c9d1d9]">
                        {Coffee_Buffer}%
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contributors widget - STYLED CLEANLY & LINKED DIRECTLY */}
              <div className="bg-[#161b22]/20 border border-[#30363d]/80 rounded-lg p-4.5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#30363d]/60">
                  <h3 className="font-bold text-sm text-[#f0f6fc] flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#8b949e]" />
                    <span>Contributors</span>
                  </h3>
                  <span className="text-xs bg-[#30363d] px-2 py-0.5 rounded-md font-mono text-[#c9d1d9] font-bold">
                    1
                  </span>
                </div>

                {/* Real Anchor Linking directly to Sanjib's authentic GitHub */}
                <a
                  href={`${PROFILE_DATA.github[0]?.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 bg-[#161b22]/40 rounded-lg border border-[#30363d]/80 hover:border-[#58a6ff]/40 transition group cursor-pointer block"
                >
                  <img
                    src={PROFILE_DATA.avatarUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-[#30363d] group-hover:scale-105 transition shadow-sm shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-[#f0f6fc] group-hover:text-[#58a6ff] group-hover:underline leading-none block">
                      {PROFILE_DATA.name}
                    </span>
                    <span className="text-[10px] text-[#8b949e] leading-tight block mt-1">
                      {PROFILE_DATA.handle} (100% commits)
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#58a6ff] transition mr-1" />
                </a>
              </div>

              {/* Staged Collaboration Pulses Box */}
              <div className="bg-[#161b22]/20 border border-[#30363d]/80 rounded-lg p-4.5 space-y-3">
                <span className="text-[10px] font-bold text-[#f78166] uppercase tracking-wider block border-b border-[#30363d]/60 pb-1.5 font-mono">
                  Collaboration Hub
                </span>

                <div className="space-y-2">
                  <button
                    onClick={() =>
                      handleFileAction("connect/api.tsx", "connect/api.tsx")
                    }
                    className="w-full flex items-center justify-between p-2 rounded bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] hover:border-[#58a6ff]/40 text-left text-[#c9d1d9] group transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Award className="w-4 h-4 text-amber-500 group-hover:scale-110 transition" />
                      <span className="font-semibold text-xs text-[#f0f6fc]">
                        Hire me
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#58a6ff] transition" />
                  </button>

                  <button
                    onClick={() =>
                      handleFileAction("connect/api.tsx", "connect/api.tsx")
                    }
                    className="w-full flex items-center justify-between p-2 rounded bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] hover:border-[#58a6ff]/40 text-left text-[#c9d1d9] group transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <GitPullRequest className="w-4 h-4 text-[#58a6ff] group-hover:scale-110 transition" />
                      <span className="font-semibold text-xs text-[#f0f6fc]">
                        Fork This Human
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#58a6ff] transition" />
                  </button>

                  <button
                    onClick={() =>
                      handleFileAction("connect/api.tsx", "connect/api.tsx")
                    }
                    className="w-full flex items-center justify-between p-2 rounded bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] hover:border-[#58a6ff]/40 text-left text-[#c9d1d9] group transition cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Coffee className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                      <span className="font-semibold text-xs text-[#f0f6fc]">
                        Sponsor Runtime
                      </span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#58a6ff] transition" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== B. ISSUES LOGS PANEL ==================== */}
        {activeTab === "issues" && (
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden shadow-lg">
            {/* Real Search Filter header */}
            <div className="p-4 bg-[#161b22] border-b border-[#30363d] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:max-w-md">
                <Search className="w-4 h-4 text-[#8b949e] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter client diagnostic issues..."
                  value={issueSearch}
                  onChange={(e) => setIssueSearch(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-1.5 pl-10 pr-4 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] transition"
                />
              </div>
              <span className="text-xs text-[#8b949e] font-sans font-medium">
                {
                  issues.filter((i) =>
                    i.title.toLowerCase().includes(issueSearch.toLowerCase()),
                  ).length
                }{" "}
                open anomalies flagged
              </span>
            </div>

            {/* List of active issues */}
            <div className="divide-y divide-[#30363d]/70 bg-[#0d1117]">
              {issues
                .filter((i) =>
                  i.title.toLowerCase().includes(issueSearch.toLowerCase()),
                )
                .map((issue) => {
                  const isOpen = selectedIssueId === issue.id;
                  return (
                    <div
                      key={issue.id}
                      className="p-4 hover:bg-[#161b22]/30 transition flex flex-col space-y-2"
                    >
                      <div
                        className="flex items-start justify-between gap-4 cursor-pointer"
                        onClick={() =>
                          setSelectedIssueId(isOpen ? null : issue.id)
                        }
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-4.5 h-4.5 text-[#3fb950] shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 flex-wrap text-left">
                              <span className="font-bold text-[#f0f6fc] hover:text-[#58a6ff] text-[13.5px] leading-tight md:text-sm">
                                {issue.title}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${issue.labelBg}`}
                              >
                                {issue.label}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#8b949e] font-sans mt-1">
                              {issue.id} opened {issue.time} by{" "}
                              <span className="font-semibold text-[#8b949e] hover:text-[#58a6ff]">
                                {issue.author}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-[#8b949e]">
                          {issue.comments > 0 && (
                            <span className="hover:text-[#58a6ff] transition font-mono flex items-center gap-1 bg-[#21262d] px-1.5 py-0.5 rounded border border-[#30363d]">
                              <MessageSquare className="w-3 h-3 text-[#8b949e]" />
                              <span>{issue.comments}</span>
                            </span>
                          )}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
                          />
                        </div>
                      </div>

                      {/* Display replies when toggled */}
                      {isOpen && (
                        <div className="pl-7 pt-3 border-t border-[#30363d]/40 mt-3 space-y-3 font-sans max-w-4xl text-left">
                          <div className="p-3 bg-[#161b22]/40 rounded-lg border border-[#30363d]/80">
                            <div className="flex justify-between items-center text-[11px] text-[#8b949e] mb-1.5 font-mono">
                              <span className="font-bold text-[#c9d1d9]">
                                @{issue.author} (Reporter)
                              </span>
                              <span>{issue.time}</span>
                            </div>
                            <p className="text-xs text-[#c9d1d9] leading-relaxed">
                              Anomalous compile state identified. Recommend
                              running caffeine modules to synchronize system
                              processes before buffer thresholds saturate.
                            </p>
                          </div>

                          <div className="p-3 bg-[#1f242c]/50 rounded-lg border border-[#38444d]/80 block">
                            <div className="flex justify-between items-center text-[11px] text-[#8b949e] mb-1.5 font-mono">
                              <div className="flex items-center space-x-1">
                                <span className="font-bold text-emerald-400">
                                  @sanjibbayen (Assignee)
                                </span>
                                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded px-1 text-[9px] font-bold">
                                  owner
                                </span>
                              </div>
                              <span>Just now</span>
                            </div>
                            <p className="text-xs text-[#c9d1d9] leading-relaxed italic">
                              "Compiling diagnostics. Reviewing local execution
                              traces. Staging double-espresso patch files inside
                              the branch index vector. Will push hotfixes
                              immediately."
                            </p>
                            <button
                              onClick={() => {}}
                              className="mt-3 px-3 py-1 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-[10px] font-semibold text-white hover:text-[#58a6ff] transition cursor-pointer"
                            >
                              Trigger Patch Pipeline
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ==================== C. PULL REQUESTS PANEL ==================== */}
        {activeTab === "prs" && (
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 bg-[#161b22] border-b border-[#30363d] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="relative w-full md:max-w-md">
                <Search className="w-4 h-4 text-[#8b949e] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter pull requests..."
                  value={prSearch}
                  onChange={(e) => setPrSearch(e.target.value)}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-md py-1.5 pl-10 pr-4 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff] transition"
                />
              </div>
              <span className="text-xs text-[#8b949e] font-sans font-medium">
                {
                  pullRequests.filter((p) =>
                    p.title.toLowerCase().includes(prSearch.toLowerCase()),
                  ).length
                }{" "}
                active branching merges
              </span>
            </div>

            <div className="divide-y divide-[#30363d]/70 bg-[#0d1117]">
              {pullRequests
                .filter((p) =>
                  p.title.toLowerCase().includes(prSearch.toLowerCase()),
                )
                .map((pr) => {
                  const isOpen = selectedPRId === pr.id;
                  return (
                    <div
                      key={pr.id}
                      className="p-4 hover:bg-[#161b22]/30 transition flex flex-col space-y-2"
                    >
                      <div
                        className="flex items-start justify-between gap-4 cursor-pointer"
                        onClick={() => setSelectedPRId(isOpen ? null : pr.id)}
                      >
                        <div className="flex items-start gap-3 text-left">
                          <GitPullRequest className="w-4.5 h-4.5 text-[#a371f7] shrink-0 mt-0.5" />
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-[#f0f6fc] hover:text-[#58a6ff] text-[13.5px] leading-tight md:text-sm">
                                {pr.title}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded font-mono font-medium ${pr.statusBg}`}
                              >
                                {pr.status}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#8b949e] font-sans mt-1">
                              {pr.id} opened {pr.time} by{" "}
                              <span className="font-semibold text-[#8b949e] hover:text-[#58a6ff]">
                                {pr.author}
                              </span>
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-[#8b949e] transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
                        />
                      </div>

                      {isOpen && (
                        <div className="pl-7 pt-3 border-t border-[#30363d]/45 mt-2 space-y-3 text-xs text-[#c9d1d9] font-sans max-w-4xl text-left leading-relaxed">
                          <div className="bg-[#161b22]/40 p-3 rounded-lg border border-[#30363d]/80">
                            {pr.id === "#451" && (
                              <p>
                                Configured memory buffers and parallel logic
                                systems dynamically to optimize clinical
                                prognosis trackers. Zero memory leaking detected
                                in compilation loops.
                              </p>
                            )}
                            {pr.id === "#512" && (
                              <p className="text-[#f85149] font-semibold italic">
                                Rejected: Sleep schedules processes disabled by
                                developer. Overrides declined by cognitive
                                priority daemon.
                              </p>
                            )}
                            {pr.id === "#632" && (
                              <p className="text-amber-500 font-semibold">
                                [Merge Conflict] Conflict blockages:
                                Participating in 3 high-intensity hardware
                                hackathons simultaneously collides with baseline
                                research compile capacities.
                              </p>
                            )}
                            {pr.id === "#721" && (
                              <p>
                                Waiting for approval from supervisor nodes.
                                Physical coordinates successfully traversed 300
                                meters into nearby green spaces (tested positive
                                for grass detection).
                              </p>
                            )}
                          </div>

                          {/* Actions / Buttons for pull requests */}
                          <div className="flex items-center gap-2 pt-1 font-sans">
                            {pr.status === "Merge Conflict" && (
                              <button
                                onClick={() => {}}
                                className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-[#d29922] border border-amber-500/35 rounded text-[10.5px] font-semibold transition cursor-pointer"
                              >
                                Force Merge Under Stress
                              </button>
                            )}
                            {pr.status === "Under Review" && (
                              <button
                                onClick={() => {}}
                                className="px-3 py-1 bg-[#2ea043]/15 hover:bg-[#2ea043]/25 text-emerald-400 border border-[#2ea043]/30 rounded text-[10.5px] font-semibold transition cursor-pointer"
                              >
                                Approve & Integrate Changes
                              </button>
                            )}
                            {pr.status === "Rejected" && (
                              <button
                                onClick={() => {}}
                                className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-[#f0f6fc] border border-neutral-700 rounded text-[10.5px] font-semibold transition cursor-pointer"
                              >
                                Force Re-Evaluate PR
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ==================== D. ACTIONS SYSTEM LOGS PANEL ==================== */}
        {activeTab === "actions" && (
          <div className="bg-[#0d1117] border border-[#30363d] rounded-lg overflow-hidden shadow-lg">
            <div className="p-4 bg-[#161b22] border-b border-[#30363d] flex items-center justify-between">
              <h3 className="font-sans font-bold text-sm text-[#f0f6fc] flex items-center gap-2">
                <Terminal className="w-4 h-4 text-sky-400 animate-pulse" />
                <span>Continuous Integration Diagnostics Console (stdout)</span>
              </h3>

              <button
                onClick={() => {
                  setLogMessages([
                    {
                      type: "INFO",
                      text: "Flushed buffer logs cleanly.",
                      style: "text-sky-400",
                    },
                    {
                      type: "SUCCESS",
                      text: "System tracking online. Awaiting telemetry.",
                      style: "text-emerald-400 font-semibold",
                    },
                  ]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-xs text-[#c9d1d9] transition font-sans cursor-pointer font-semibold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear Output</span>
              </button>
            </div>

            {/* Interactive logs console displaying actions */}
            <div className="p-5 bg-[#000000]/60 font-mono text-xs text-[#c9d1d9] space-y-2 h-96 overflow-y-auto custom-scrollbar border-b border-[#30363d] select-text">
              <div className="flex items-center justify-between text-[10px] text-[#8b949e] border-b border-[#30363d]/50 pb-2 mb-3.5">
                <span className="flex items-center gap-1">
                  <Terminal className="w-3 h-3 text-sky-400" /> STDOUT CONSOLE
                  STREAM
                </span>
                <span>BASED-CONTAINER: cloud-run-3000</span>
              </div>

              <div className="space-y-1.5 text-left font-mono">
                {logMessages.map((log, idx) => (
                  <div
                    key={idx}
                    className="flex items-start text-xs leading-relaxed hover:bg-[#21262d]/20 px-2 py-0.5 rounded transition"
                  >
                    <span
                      className={`px-2 py-px bg-[#161b22] border border-[#30363d] rounded text-[9px] font-bold mr-3 tracking-wider font-sans shrink-0 uppercase ${log.style}`}
                    >
                      {log.type}
                    </span>
                    <span className="font-mono text-[#c9d1d9] text-[12.5px]">
                      {log.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Run Actions interactive buttons */}
            <div className="p-4 bg-[#161b22] flex items-center gap-3 flex-wrap">
              <span className="text-xs text-[#8b949e] font-sans">
                Trigger Cognitive Simulation:
              </span>
              <button
                onClick={() => {
                  setLogMessages((prev) => [
                    ...prev,
                    {
                      type: "WARNING",
                      text: `Caffeine injection script loaded. Injecting espresso pipeline at timestamp: ${new Date().toLocaleTimeString()}`,
                      style: "text-amber-400 font-semibold",
                    },
                  ]);
                  if (openFile) {
                    openFile("connect/api.tsx");
                  }
                }}
                className="p-1 px-4 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-xs font-semibold text-white hover:text-[#58a6ff] hover:border-[#58a6ff]/40 transition cursor-pointer"
              >
                Brew Coffee Modules
              </button>

              <button
                onClick={() => {
                  setLogMessages((prev) => [
                    ...prev,
                    {
                      type: "SUCCESS",
                      text: `Compiling neural codebase vectors... Success! Error index is 0. All 15 projects are stable.`,
                      style: "text-emerald-400 font-bold",
                    },
                  ]);
                  if (openFile) {
                    openFile("about/profile.yml");
                  }
                }}
                className="p-1 px-4 bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] rounded text-xs font-semibold text-white hover:text-emerald-400 hover:border-emerald-500/20 transition cursor-pointer"
              >
                Compile Codebase Vectors
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
