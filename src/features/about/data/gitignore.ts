/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Copyright 2026 Sanjib Bayen
 */

import { VFSNode } from '@/types';

export const gitignoreFile: VFSNode = {
  name: ".gitignore",
  type: "file",
  path: ".gitignore",
  language: "plaintext",
  content: `
# ─────────────────────────────────────────────
# mindignore
# Things excluded from active processing
# ───────────────────────────────────────────── 
# External noise
comparison-with-others/
viral-trends/
random-negativity/
imposter-syndrome/temp/
# Unnecessary system processes
what-if-i-fail/
perfect-time-to-start/
waiting-for-motivation/
overthinking/
# Archive completed doubts
past-mistakes/
missed-opportunities/
old-regrets/
# Keep active
!learning/
!building/
!research/
!experimentation/
# Current missions
!lunar-intelligence/
!healthcare-ai/
!shuttersync-studios/
!future-ventures/
# Emergency fallback
if (stuck) {
goto learning;
}
if (overwhelmed) {
goto build_small;
}
if (successful) {
stay_humble();
}
# ─────────────────────────────────────────────
# Actual project exclusions
# ─────────────────────────────────────────────
# dependencies
node_modules/
.pnpm-store/
build outputs
.next/
dist/
build/
# secrets
.env
.env.local
*.pem
*.key
# generated files
coverage/
.cache/
# system files
.DS_Store
Thumbs.db
# editor
.vscode/*
!.vscode/settings.json
.idea/

# Mission Status:
  Learning...  ████████████ 100%
  Building...  ████████░░░░ 68%
  Finished?    false

# Portfolio Rule:
  1. Commit source.
  2. Ignore noise.
  3. Ship often.

$ git commit -m "build something worth remembering"

# ─────────────────────────────────────────────
# EOF --- Sanjib Bayen
`
};
