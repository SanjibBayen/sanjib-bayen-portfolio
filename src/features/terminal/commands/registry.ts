/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * Command Registry for routing execution to the correct modules
 */

import { Command } from '../types/terminal';

export class CommandRegistry {
  private commands = new Map<string, Command>();
  private aliases = new Map<string, string>();

  register(command: Command) {
    this.commands.set(command.name.toLowerCase(), command);
    if (command.aliases) {
      for (const alias of command.aliases) {
        this.aliases.set(alias.toLowerCase(), command.name.toLowerCase());
      }
    }
  }

  getCommand(name: string): Command | undefined {
    const nameLower = name.toLowerCase();
    const resolvedName = this.aliases.get(nameLower) || nameLower;
    return this.commands.get(resolvedName);
  }

  getAllCommands(): Command[] {
    return Array.from(this.commands.values());
  }

  getCommandNames(): string[] {
    const names = Array.from(this.commands.keys());
    const aliasNames = Array.from(this.aliases.keys());
    return [...names, ...aliasNames].sort();
  }
}

export const registry = new CommandRegistry();
