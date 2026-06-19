/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * Refactored Modular Terminal Core Hook using Command Registry Pattern
 */

import { useState, useRef, useEffect, useCallback, Dispatch, SetStateAction, KeyboardEvent } from 'react';
import { TerminalLine, VFSNode } from '@/types';
import { PROFILE_DATA } from '@/features/about';
import { registry } from '../commands';
import { getAutocompletedInput } from '../utils/autocomplete';

interface UseTerminalCoreProps {
  onThemeSelect: (themeId: string) => void;
  openFile?: (path: string) => void;
  externalHistory?: TerminalLine[];
  setExternalHistory?: Dispatch<SetStateAction<TerminalLine[]>>;
  externalPath?: string[];
  setExternalPath?: Dispatch<SetStateAction<string[]>>;
  externalQueue?: string[];
  setExternalQueue?: Dispatch<SetStateAction<string[]>>;
  externalPointer?: number;
  setExternalPointer?: Dispatch<SetStateAction<number>>;
  simulateTrigger?: string;
  setSimulateTrigger?: (trigger: string) => void;
}

const HISTORY_STORAGE_KEY = 'terminal_command_queue';

const getStoredQueue = (): string[] => {
  try {
    const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const storeQueue = (queue: string[]) => {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.warn("Storage unreachable:", err);
  }
};

export function useTerminalCore({
  onThemeSelect,
  openFile,
  externalHistory,
  setExternalHistory,
  externalPath,
  setExternalPath,
  externalQueue,
  setExternalQueue,
  externalPointer,
  setExternalPointer,
  simulateTrigger,
  setSimulateTrigger,
}: UseTerminalCoreProps) {
  
  // Local state (fallbacks when no external state provided)
  const [localHistory, setLocalHistory] = useState<TerminalLine[]>([
    { text: 'Sanjib OS v4.1.0 (Windows PowerShell Core Sandbox Edition)', type: 'system' },
    { text: `Copyright (c) 2026 ${PROFILE_DATA.name}. All professional rights reserved.`, type: 'system' },
    { text: '', type: 'output' },
    { text: 'Type "help" to list comprehensive interactive commands!', type: 'success' },
    { text: '', type: 'output' },
  ]);
  
  const [localPath, setLocalPath] = useState<string[]>([]);
  const [localQueue, setLocalQueue] = useState<string[]>(() => getStoredQueue());
  const [localPointer, setLocalPointer] = useState<number>(-1);
  
  // Use external or local state
  const history = externalHistory ?? localHistory;
  const setHistory = setExternalHistory ?? setLocalHistory;
  const currentPath = externalPath ?? localPath;
  const setCurrentPath = setExternalPath ?? setLocalPath;
  const commandQueue = externalQueue ?? localQueue;
  const setCommandQueue = setExternalQueue ?? setLocalQueue;
  const queuePointer = externalPointer ?? localPointer;
  const setQueuePointer = setExternalPointer ?? setLocalPointer;

  const [terminalInput, setTerminalInput] = useState('');
  const [typingCommandText, setTypingCommandText] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Sync external queue with stored queue if external queue is loaded empty
  useEffect(() => {
    if (externalQueue && externalQueue.length === 0) {
      const saved = getStoredQueue();
      if (saved.length > 0) {
        setCommandQueue(saved);
      }
    }
  }, [externalQueue, setCommandQueue]);

  // ─── Prompt Path Formatter ──────────────────────────────────
  
  const formatPromptPath = useCallback(() => {
    if (currentPath.length === 0) return '';
    return '\\' + currentPath.join('\\');
  }, [currentPath]);

  // ─── Typewriter Simulation ──────────────────────────────────
  
  useEffect(() => {
    if (simulateTrigger && setSimulateTrigger) {
      const fullCmd = simulateTrigger.includes('::')
        ? simulateTrigger.substring(0, simulateTrigger.indexOf('::'))
        : simulateTrigger;
      setSimulateTrigger('');
      setTerminalInput('');
      setTypingCommandText(fullCmd);
      setIsTyping(true);
    }
  }, [simulateTrigger, setSimulateTrigger]);

  useEffect(() => {
    if (!typingCommandText) return;

    let index = 0;
    setTerminalInput('');
    
    const randomDelays = [40, 50, 65, 35, 75, 45, 55, 60];
    
    const typeNextChar = () => {
      if (index < typingCommandText.length) {
        setTerminalInput(typingCommandText.substring(0, index + 1));
        index++;
        const delay = randomDelays[index % randomDelays.length];
        setTimeout(typeNextChar, delay);
      } else {
        setTimeout(() => {
          executeCommand(typingCommandText);
          setTerminalInput('');
          setTypingCommandText(null);
          setIsTyping(false);
        }, 280);
      }
    };

    const initialBuffer = setTimeout(typeNextChar, 250);
    return () => clearTimeout(initialBuffer);
  }, [typingCommandText]);

  // ─── Auto Scroll ────────────────────────────────────────────
  
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  // ─── Project Link Handler ───────────────────────────────────
  
  const handleProjectLink = useCallback((projectId: number) => {
    try {
      localStorage.setItem('selectedProjectId', String(projectId));
    } catch (err) {
      console.warn("Storage unreachable:", err);
    }
    if (openFile) {
      openFile('projects/portfolio.db');
    }
  }, [openFile]);

  // ─── Clear Handler ──────────────────────────────────────────
  
  const clearHistory = useCallback(() => {
    setHistory([]);
    if (terminalRef.current) {
      terminalRef.current.scrollTop = 0;
    }
  }, [setHistory]);

  // ─── Command Execution ──────────────────────────────────────
  
  const executeCommand = useCallback(async (rawCmd: string) => {
    const text = rawCmd.trim();
    if (!text) {
      setHistory(prev => [...prev, { text: `PS C:\\Projects\\Sanjib-Bayen${formatPromptPath()}>`, type: 'input' }]);
      return;
    }

    setCommandQueue(prev => {
      const updated = [...prev, text];
      storeQueue(updated);
      return updated;
    });
    setQueuePointer(-1);

    const parts = text.split(/\s+/);
    const commandName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newHistory: TerminalLine[] = [
      { text: `PS C:\\Projects\\Sanjib-Bayen${formatPromptPath()}> ${text}`, type: 'input' }
    ];

    const cmdInstance = registry.getCommand(commandName);
    if (cmdInstance) {
      try {
        const result = await cmdInstance.execute({
          args,
          rawCommand: text,
          currentPath,
          setCurrentPath,
          setTerminalHistory: setHistory,
          setTerminalInput,
          onThemeSelect,
          openFile,
          handleProjectLink,
          clearHistory,
          commandQueue,
          setCommandQueue,
          queuePointer,
          setQueuePointer,
          formatPromptPath,
        });

        if (result.clearHistory) {
          return;
        }

        if (result.nextPath !== undefined) {
          setCurrentPath(result.nextPath);
        }

        if (result.output && result.output.length > 0) {
          newHistory.push(...result.output);
        }
      } catch (err) {
        console.error("Shell execution error:", err);
        newHistory.push([
          { text: `System execution error running "${commandName}".`, type: 'error' as const }
        ][0]);
      }
    } else {
      newHistory.push({ text: `Term: "${commandName}" is unrecognized inside sandbox PowerShell. Type "help" to list instructions.`, type: 'error' });
    }

    setHistory(prev => [...prev, ...newHistory]);
    setTerminalInput('');
  }, [currentPath, formatPromptPath, onThemeSelect, setHistory, setCommandQueue, setQueuePointer, setCurrentPath, openFile, handleProjectLink, clearHistory, commandQueue, queuePointer]);

  // ─── Keyboard Handler ───────────────────────────────────────
  
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(terminalInput);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const autocompleted = getAutocompletedInput(terminalInput, currentPath);
      
      if (autocompleted.suggestions && autocompleted.suggestions.length > 0) {
        const suggestionsText = autocompleted.suggestions.join('    ');
        setHistory(prev => [
          ...prev,
          { text: `PS C:\\Projects\\Sanjib-Bayen${formatPromptPath()}> ${terminalInput}`, type: 'input' },
          { text: suggestionsText, type: 'system' }
        ]);
        if (autocompleted.text !== terminalInput) {
          setTerminalInput(autocompleted.text);
        }
      } else if (autocompleted.text !== terminalInput) {
        setTerminalInput(autocompleted.text);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandQueue.length > 0) {
        const newPointer = queuePointer < commandQueue.length - 1 ? queuePointer + 1 : queuePointer;
        setQueuePointer(newPointer);
        setTerminalInput(commandQueue[commandQueue.length - 1 - newPointer] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (queuePointer > 0) {
        const newPointer = queuePointer - 1;
        setQueuePointer(newPointer);
        setTerminalInput(commandQueue[commandQueue.length - 1 - newPointer] || '');
      } else if (queuePointer === 0) {
        setQueuePointer(-1);
        setTerminalInput('');
      }
    }
  }, [terminalInput, commandQueue, queuePointer, executeCommand, setQueuePointer, currentPath, formatPromptPath, setHistory]);

  return {
    // State
    terminalInput,
    setTerminalInput,
    history,
    currentPath,
    commandQueue,
    queuePointer,
    isTyping,
    typingCommandText,
    
    // Refs
    inputRef,
    terminalRef,
    
    // Functions
    executeCommand,
    handleKeyDown,
    handleProjectLink,
    clearHistory,
    formatPromptPath,
    setHistory,
    setCurrentPath,
    setCommandQueue,
    setQueuePointer,
  };
}
