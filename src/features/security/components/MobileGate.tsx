/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */
import React, { useState, useEffect, useRef } from "react";
import {
  Terminal,
  Monitor,
  Info,
  ChevronRight,
  ShieldAlert,
  Smartphone,
  Tablet,
  Cpu,
  User,
  Code,
  Briefcase,
  MapPin,
  Sparkles,
  Github,
  Linkedin,
  Mail
} from "lucide-react";
import { PROFILE_DATA } from "@/features/about";
import { PROJECTS_DATA } from "@/features/projects";

interface MobileGateProps {
  onOverride: () => void;
}

interface DeviceMetrics {
  width: number;
  height: number;
  pixelRatio: number;
  userAgent: string;
  isMobile: boolean;
  isTablet: boolean;
}

export default function MobileGate({ onOverride }: MobileGateProps) {
  const [deviceMetrics, setDeviceMetrics] = useState<DeviceMetrics | null>(null);
  const [activeCommand, setActiveCommand] = useState<string>("welcome");
  const [terminalOutput, setTerminalOutput] = useState<React.ReactNode[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Initialize and track device metrics
  useEffect(() => {
    const checkMetrics = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pixelRatio = window.devicePixelRatio || 1;
      const ua = navigator.userAgent;
      
      const mobileRegex = /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
      const tabletRegex = /iPad|Tablet|PlayBook|Silk|Kindle|Nexus 7|Nexus 10|KFAPWI/i;
      const isMobile = mobileRegex.test(ua) || (width < 768);
      const isTablet = tabletRegex.test(ua) || (width >= 768 && width < 1024);

      setDeviceMetrics({
        width,
        height,
        pixelRatio,
        userAgent: ua,
        isMobile,
        isTablet
      });
    };

    checkMetrics();
    window.addEventListener("resize", checkMetrics);
    return () => window.removeEventListener("resize", checkMetrics);
  }, []);

  // Format and execute commands inside the simulated console
  const runCommand = (command: string) => {
    if (isTyping) return;
    setActiveCommand(command);
    setIsTyping(true);

    let content: React.ReactNode = null;

    switch (command) {
      case "profile":
        content = (
          <div className="space-y-3 animate-fade-in text-neutral-300">
            <div className="flex items-center gap-3 border-b border-[#21262d] pb-2">
              <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center">
                <User className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">{PROFILE_DATA.name}</h4>
                <p className="text-[10.5px] text-sky-400 font-mono">@{PROFILE_DATA.handle}</p>
              </div>
            </div>
            <div className="space-y-1.5 text-[11px] leading-relaxed">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <MapPin className="w-3 h-3 text-red-400 shrink-0" />
                <span>{PROFILE_DATA.location} • {PROFILE_DATA.email}</span>
              </div>
              <p className="border-l-2 border-sky-500/40 pl-2 text-neutral-300 italic py-0.5">
                "{PROFILE_DATA.philosophy}"
              </p>
              <div className="pt-2">
                <span className="text-white font-bold block mb-1">🎯 Core Focus:</span>
                <div className="flex flex-wrap gap-1">
                  {PROFILE_DATA.focus.map((f, i) => (
                    <span key={i} className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-1.5 py-0.5 rounded text-[9.5px] font-mono">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="pt-1.5">
                <span className="text-white font-bold block mb-1">⚡ Building:</span>
                <ul className="list-disc list-inside space-y-0.5 pl-1 text-[10.5px]">
                  {PROFILE_DATA.currentlyBuilding.map((b, i) => (
                    <li key={i} className="text-neutral-300">{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );
        break;

      case "skills":
        content = (
          <div className="space-y-3 animate-fade-in text-neutral-300">
            <h4 className="text-white font-bold text-xs border-b border-[#21262d] pb-1 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              Primary Stack & Technologies
            </h4>
            <div className="grid grid-cols-1 gap-2.5 max-h-56 overflow-y-auto pr-1">
              <div className="p-2 bg-[#0d1117] rounded border border-[#21262d]">
                <span className="text-emerald-400 font-mono text-[10px] font-bold block mb-1">🖥️ AI/ML & Core CS:</span>
                <p className="text-[10.5px] text-neutral-300 leading-snug">
                  Python, PyTorch, TensorFlow, OpenCV, Scikit-learn, Pandas, NumPy, Explainable AI (Grad-CAM), Physics-Aware AI structures.
                </p>
              </div>
              <div className="p-2 bg-[#0d1117] rounded border border-[#21262d]">
                <span className="text-indigo-400 font-mono text-[10px] font-bold block mb-1">🌐 Web Engineering:</span>
                <p className="text-[10.5px] text-neutral-300 leading-snug">
                  React 19, TypeScript, Vite, Node.js, Express, FastAPI, Tailwind CSS, WebSockets.
                </p>
              </div>
              <div className="p-3 bg-[#0d1117] rounded border border-[#21262d]">
                <span className="text-amber-400 font-mono text-[10px] font-bold block mb-1">💾 Infrastructure & Databases:</span>
                <p className="text-[10.5px] text-neutral-300 leading-snug">
                  PostgreSQL, Redis, Cloud SQL, Firebase, git/GitHub, Docker, Linux administration.
                </p>
              </div>
            </div>
          </div>
        );
        break;

      case "projects":
        content = (
          <div className="space-y-3 animate-fade-in text-neutral-300">
            <h4 className="text-white font-bold text-xs border-b border-[#21262d] pb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
              Featured Projects ({PROJECTS_DATA.length})
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {PROJECTS_DATA.map((p) => (
                <div key={p.id} className="p-2 bg-[#0d1117] rounded border border-[#21262d] hover:border-neutral-750 transition">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-white font-bold font-mono text-[11px] truncate">{p.name}</span>
                    <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1 py-0.2 rounded text-[8px] tracking-wider font-mono">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-relaxed mb-1.5">
                    {p.summary}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {p.techStack.slice(0, 4).map((tech, i) => (
                      <span key={i} className="text-[9px] px-1 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700/60 font-mono">
                        {tech}
                      </span>
                    ))}
                    {p.techStack.length > 4 && (
                      <span className="text-[8.5px] text-neutral-500 font-mono self-center">+{p.techStack.length - 4} more</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        break;

      case "diagnostics":
        content = (
          <div className="space-y-2.5 animate-fade-in text-neutral-300 leading-relaxed font-mono text-[10.5px]">
            <div className="text-amber-400 flex items-center gap-1.5 border-b border-[#21262d] pb-1.5 mb-2">
              <Cpu className="w-3.5 h-3.5" />
              <span>SYSTEM LOG PROBE: ONLINE</span>
            </div>
            <div className="space-y-1">
              <p className="text-sky-400">[BOOT] Virtual Kernel OS version 4.1.0 loaded successfully.</p>
              <p className="text-indigo-400">[INFO] Available memory channels: virtual sandbox heap pool.</p>
              <p className="text-neutral-400">
                [PORT] Port 3000 mapping: <span className="text-emerald-400">SUCCESS</span> (Active Tunnel)
              </p>
              <div className="border border-neutral-800 rounded p-1.5 my-1.5 bg-neutral-950/40 text-[9.5px]">
                <p className="text-white font-bold opacity-90">SPECIFICATIONS REPORT:</p>
                <div className="grid grid-cols-2 gap-1 mt-1 text-neutral-400">
                  <span>- Display Width:</span> <span className="text-indigo-300 font-bold">{deviceMetrics?.width}px</span>
                  <span>- Device Type:</span> <span className="text-indigo-300 font-bold">{deviceMetrics?.isMobile ? "Mobile" : "Tablet"}</span>
                  <span>- User Agent:</span> <span className="text-neutral-450 truncate max-w-[150px]">{deviceMetrics?.userAgent}</span>
                  <span>- Pixel Ratio:</span> <span className="text-indigo-300 font-bold">{deviceMetrics?.pixelRatio}x</span>
                  <span>- Workspace Support:</span> <span className="text-red-400 font-extrabold font-mono">DESKTOP WORKSTATION REQUIRED</span>
                </div>
              </div>
              <p className="text-amber-400">
                [WARN] Touch-input and compact viewport dimensions detected.
              </p>
              <p className="text-indigo-300 leading-relaxed font-sans mt-2 italic text-[11px]">
                "To explore my advanced interactive IDE workspace complete with virtual terminal simulators, custom code editor grids, interactive d3 skills graph, and full repository panels, please use a desktop, laptop, or widescreen monitor browser."
              </p>
            </div>
          </div>
        );
        break;

      case "welcome":
      default:
        content = (
          <div className="space-y-2.5 animate-fade-in text-neutral-300">
            <div className="flex items-center gap-2 text-indigo-400 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold text-xs uppercase tracking-wider font-mono">Terminal Console Loaded</span>
            </div>
            <p className="text-[11.5px] leading-relaxed">
              Hello! This portfolio is designed as an interactive, fully full-featured **dual-panel IDE emulation suite** that requires significant desktop screen area (1024px+ widths) to render.
            </p>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              While we encourage accessing this workspace from a **PC or Laptop** for the full compiler simulation, I have compiled my core profile data, skills graph, and projects right here!
            </p>
            <div className="p-2 bg-[#0d1117] rounded border border-indigo-500/10 text-[10.5px] text-indigo-300 flex items-start gap-2">
              <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                Tap any fast command chip below to fetch my professional statistics directly in this mobile terminal panel!
              </span>
            </div>
          </div>
        );
        break;
    }

    setTimeout(() => {
      if (terminalOutput.length > 5) {
        setTerminalOutput([content]);
      } else {
        setTerminalOutput(prev => [...prev, content]);
      }
      setIsTyping(false);
    }, 400);
  };

  // Run welcome on mount
  useEffect(() => {
    runCommand("welcome");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll terminal automatically
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalOutput, isTyping]);

  const deviceLabel = deviceMetrics?.isMobile ? "Mobile Setup" : "Tablet View";
  const DeviceIndicatorIcon = deviceMetrics?.isMobile ? Smartphone : Tablet;

  // Let landscape tablets override if they have large widths
  const isEligibleForOverride = deviceMetrics && (deviceMetrics.width >= 1024);

  return (
    <div className="fixed inset-0 bg-[#070a0f] text-[#c9d1d9] font-sans flex items-center justify-center p-3 sm:p-5 z-50 select-none overflow-y-auto">
      {/* Background Dots */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(#8b949e_1px,transparent_1px)] bg-[size:16px_16px]" />

      <div className="max-w-md w-full relative z-10 flex flex-col gap-4 my-auto">
        
        {/* Sleek Alert Panel */}
        <div className="border border-red-500/20 bg-[#161b22]/90 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
          
          {/* Windows-style Header Decoration */}
          <div className="bg-[#1c2129] px-3.5 py-2 flex items-center justify-between border-b border-[#21262d]">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-[10.5px] text-[#8b949e] font-mono tracking-wide font-medium">
                WorkspaceValidator.exe
              </span>
            </div>
            
            {/* Windows Window Controls */}
            <div className="flex items-center gap-1 font-mono text-[11px] text-[#58a6ff]/70 select-none">
              <span className="w-5.5 h-5.5 flex items-center justify-center hover:bg-[#30363d]/60 rounded cursor-pointer transition">─</span>
              <span className="w-5.5 h-5.5 flex items-center justify-center hover:bg-[#30363d]/60 rounded cursor-pointer transition">❑</span>
              <span className="w-5.5 h-5.5 flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 rounded cursor-pointer transition">✕</span>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {/* Screen Resolution Block */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-[#0d1117] rounded-lg border border-red-500/10">
              <div className="w-9 h-9 rounded bg-[#1c2129] border border-red-500/20 flex items-center justify-center shrink-0">
                <DeviceIndicatorIcon className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[12.5px] font-bold text-white leading-none">
                    Unsupported Viewport ({deviceLabel})
                  </span>
                </div>
                <p className="text-[10px] text-neutral-400 font-mono">
                  {deviceMetrics?.width || 0}×{deviceMetrics?.height || 0} @ {deviceMetrics?.pixelRatio || 1}x pixel ratio
                </p>
              </div>
            </div>

            {/* Warning Details text */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-bold text-white mb-0.5">Desktop Environment Required</h3>
                <p className="text-[11.5px] text-neutral-400 leading-relaxed">
                  Workspace sandbox uses multi-panel code editor buffers, mock compilers, git trees, and complex canvases designed for laptop/PC display scales.
                </p>
              </div>
            </div>

            {/* Interactive Terminal Screen */}
            <div className="border border-[#21262d] bg-[#0c0e14] rounded-lg shadow-inner overflow-hidden flex flex-col h-56">
              {/* Slate tab header */}
              <div className="bg-[#10141d] px-3 py-1.5 border-b border-[#21262d] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[9px] text-[#8b949e] font-mono tracking-wider">sanjib-os://cli-sandbox</span>
                </div>
                <span className="text-[8px] text-[#484f58] font-mono select-none">ASCII utf-8</span>
              </div>

              {/* Terminal Logs Area */}
              <div className="p-3 font-mono text-[10.5px] space-y-2 overflow-y-auto flex-1 leading-normal scrollbar-none">
                {terminalOutput.map((out, index) => (
                  <div key={index} className="border-b border-[#21262d]/20 pb-2 last:border-0 last:pb-0">
                    {out}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-1.5 text-[#8b949e]">
                    <span className="inline-block w-1.5 h-3.5 bg-sky-400 animate-pulse" />
                    <span className="text-[9.5px]">Fetching dataset...</span>
                  </div>
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>

            {/* Quick Action Interactive Chips */}
            <div className="mt-3.5">
              <span className="text-[10px] text-neutral-400 font-mono block mb-1.5 uppercase tracking-wider text-center">
                Interactive Commands (Tap to inspect)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => runCommand("profile")}
                  disabled={isTyping}
                  className={`py-1.5 px-3 rounded text-[11px] font-mono border flex items-center justify-center gap-1.5 transition select-none cursor-pointer ${
                    activeCommand === "profile"
                      ? "bg-sky-500/10 border-sky-500 text-sky-400"
                      : "bg-[#1c2129] border-[#30363d] hover:bg-[#252b35] text-neutral-300"
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>bio.md</span>
                </button>

                <button
                  type="button"
                  onClick={() => runCommand("skills")}
                  disabled={isTyping}
                  className={`py-1.5 px-3 rounded text-[11px] font-mono border flex items-center justify-center gap-1.5 transition select-none cursor-pointer ${
                    activeCommand === "skills"
                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                      : "bg-[#1c2129] border-[#30363d] hover:bg-[#252b35] text-neutral-300"
                  }`}
                >
                  <Code className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>skills.json</span>
                </button>

                <button
                  type="button"
                  onClick={() => runCommand("projects")}
                  disabled={isTyping}
                  className={`py-1.5 px-3 rounded text-[11px] font-mono border flex items-center justify-center gap-1.5 transition select-none cursor-pointer ${
                    activeCommand === "projects"
                      ? "bg-indigo-500/10 border-indigo-500 text-indigo-400"
                      : "bg-[#1c2129] border-[#30363d] hover:bg-[#252b35] text-neutral-300"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>projects.log</span>
                </button>

                <button
                  type="button"
                  onClick={() => runCommand("diagnostics")}
                  disabled={isTyping}
                  className={`py-1.5 px-3 rounded text-[11px] font-mono border flex items-center justify-center gap-1.5 transition select-none cursor-pointer ${
                    activeCommand === "diagnostics"
                      ? "bg-amber-500/10 border-amber-500 text-amber-400"
                      : "bg-[#1c2129] border-[#30363d] hover:bg-[#252b35] text-neutral-300"
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>hardware.log</span>
                </button>
              </div>
            </div>

            {/* Optional Continue Override ONLY for wide screens */}
            {isEligibleForOverride && (
              <div className="mt-4 pt-3.5 border-t border-[#21262d] flex justify-end">
                <button
                  type="button"
                  onClick={onOverride}
                  className="flex items-center gap-1.5 px-4  py-1.5 text-xs text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/20 rounded font-semibold transition select-none cursor-pointer"
                >
                  <span>Bypass Gateway</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            
            {/* Visual feedback on bottom for tiny screen mobile phones */}
            {!isEligibleForOverride && (
              <div className="mt-4 pt-3 border-t border-[#21262d] flex justify-center text-center">
                <span className="text-[10.5px] text-neutral-500 flex items-center gap-1 justify-center">
                  <Monitor className="w-3 h-3 text-sky-400 shrink-0" />
                  Access from desktop/laptop computer to test standard workspaces.
                </span>
              </div>
            )}

          </div>
        </div>

        {/* Dynamic retro brand footer */}
        <div className="flex items-center justify-center gap-4 text-[10.5px] text-neutral-500 select-none">
          <a href={PROFILE_DATA.github[0]?.url || "https://github.com"} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition flex items-center gap-1">
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <span>•</span>
          <a href={PROFILE_DATA.linkedin[0]?.url || "https://linkedin.com"} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-400 transition flex items-center gap-1">
            <Linkedin className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>
          <span>•</span>
          <a href={`mailto:${PROFILE_DATA.email}`} className="hover:text-indigo-400 transition flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </a>
        </div>
        
      </div>
    </div>
  );
}
