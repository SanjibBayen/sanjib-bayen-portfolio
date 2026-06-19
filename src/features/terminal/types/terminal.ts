/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * Terminal system types
 */

import { TerminalLine } from '@/types';

export interface CommandContext {
  args: string[];
  rawCommand: string;
  currentPath: string[];
  setCurrentPath: (path: string[] | ((prev: string[]) => string[])) => void;
  setTerminalHistory: React.Dispatch<React.SetStateAction<TerminalLine[]>>;
  setTerminalInput: (val: string) => void;
  onThemeSelect: (themeId: string) => void;
  openFile?: (path: string) => void;
  handleProjectLink: (projectId: number) => void;
  clearHistory: () => void;
  commandQueue: string[];
  setCommandQueue: React.Dispatch<React.SetStateAction<string[]>>;
  queuePointer: number;
  setQueuePointer: React.Dispatch<React.SetStateAction<number>>;
  formatPromptPath: () => string;
}

export type CommandOutputLine = TerminalLine;

export interface CommandResult {
  output: CommandOutputLine[];
  nextPath?: string[];
  clearHistory?: boolean;
}

export interface Command {
  name: string;
  description: string;
  aliases?: string[];
  execute: (ctx: CommandContext) => Promise<CommandResult> | CommandResult;
}
