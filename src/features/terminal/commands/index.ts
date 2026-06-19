/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 * Commands auto-registration module
 */

import { registry } from './registry';

import { helpCommand } from './help';
import { whoamiCommand } from './whoami';
import { skillsCommand } from './skills';
import { specsCommand } from './specs';
import { educationCommand } from './education';
import { experienceCommand } from './experience';
import { researchCommand } from './research';
import { contactCommand } from './contact';
import { profileCommand } from './profile';
import { statsCommand } from './stats';
import { projectsCommand } from './projects';
import { techCommand } from './tech';
import { inspectCommand } from './inspect';
import { catManifestCommand } from './cat_manifest';
import { diagnoseCommand } from './diagnose';
import { traceCommand } from './trace';
import { sqlite3Command } from './sqlite3';
import { pythonCommand } from './python';
import { lsCommand } from './ls';
import { cdCommand } from './cd';
import { catCommand } from './cat';
import { themeCommand } from './theme';
import { dateCommand } from './date';
import { clearCommand } from './clear';
import { gitCommand } from './git';
import { curlCommand } from './curl';
import { secretsCommand } from './secrets';
import { runCommand } from './run';

// Register all modular commands
registry.register(helpCommand);
registry.register(whoamiCommand);
registry.register(skillsCommand);
registry.register(specsCommand);
registry.register(educationCommand);
registry.register(experienceCommand);
registry.register(researchCommand);
registry.register(contactCommand);
registry.register(profileCommand);
registry.register(statsCommand);
registry.register(projectsCommand);
registry.register(techCommand);
registry.register(inspectCommand);
registry.register(catManifestCommand);
registry.register(diagnoseCommand);
registry.register(traceCommand);
registry.register(sqlite3Command);
registry.register(pythonCommand);
registry.register(lsCommand);
registry.register(cdCommand);
registry.register(catCommand);
registry.register(themeCommand);
registry.register(dateCommand);
registry.register(clearCommand);
registry.register(gitCommand);
registry.register(curlCommand);
registry.register(secretsCommand);
registry.register(runCommand);

export { registry };
export * from './registry';
