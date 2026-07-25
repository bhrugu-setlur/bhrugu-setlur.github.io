# Generex Portfolio Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stale second Generex paragraph with clear, evidence-backed wording that describes only completed work, then commit and push the current project changes to `main`.

**Architecture:** Keep the existing static-site structure and first Generex paragraph unchanged. Update only the second paragraph, using the current `dev/STM32/els-g071` README, acceptance record, and passing host suite as sources of truth; publish the already completed responsive work and existing tracked-file deletions in the same branch update.

**Tech Stack:** Static HTML5, Git, GitHub Pages

## Global Constraints

- Keep the wording understandable to a general technical reader without removing meaningful engineering evidence.
- Describe only completed work; do not list open tasks or blockers.
- Preserve the existing Generex heading, role, dates, first paragraph, and HTML structure.
- Keep the exact verified figures: 8,316 automated checks, 125,323 captured frames, and 36,429 live internal-temperature readings.
- Do not claim that the custom G071 board has been built or hardware-verified.
- Do not publish `.DS_Store` or `.claude/settings.local.json`.
- Preserve and include the existing tracked-file deletions requested by the user.

---

### Task 1: Refresh the Generex Evidence Paragraph

**Files:**
- Modify: `index.html:211-219`

**Interfaces:**
- Consumes: verified milestones from `/Users/bhrugusetlur/dev/STM32/els-g071/README.md`, `AGENTS.md`, and `boards/f401-devkit/ACCEPTANCE.md`
- Produces: one updated paragraph inside the existing Generex experience entry

- [ ] **Step 1: Confirm the current paragraph is stale**

Run:

```bash
rg -n -C 2 "7,737 passing host checks|G071 memory and electrical integration" index.html
```

Expected: both stale statements are present in the second Generex paragraph.

- [ ] **Step 2: Replace only the second paragraph**

Use this approved copy:

```html
<p>
  Built the firmware in portable C with 8,316 automated checks under strict
  compiler warnings. Matched BACS messages and CRCs across 125,323 frames
  captured from official Generex tools, then ran the firmware on an F401
  dev kit that the official Module Reader could poll like a normal sensor
  module. Hardware tests also confirmed address assignment and saved
  settings, safe recovery from a failed save, three-sensor ranging, and
  36,429 live internal-temperature readings without failure.
</p>
```

- [ ] **Step 3: Verify the old claims are gone and approved evidence is present**

Run:

```bash
if rg -n "7,737 passing host checks|G071 memory and electrical integration" index.html; then exit 1; fi
rg -n "8,316 automated checks|125,323 frames|official Module Reader|safe recovery from a failed save|three-sensor ranging|36,429 live internal-temperature" index.html
```

Expected: the stale search has no matches and every approved milestone appears.

### Task 2: Prepare and Publish the Complete Workspace

**Files:**
- Create: `.gitignore`
- Delete: `Bhrugu-Face.jpeg`
- Delete: `favicon.png`
- Commit: all tracked and planned project changes

**Interfaces:**
- Consumes: completed responsive landing commits, refreshed Generex copy, and current tracked-file deletions
- Produces: an updated `origin/main` with local-only artifacts excluded

- [ ] **Step 1: Exclude local-only files**

Create `.gitignore`:

```gitignore
.DS_Store
.claude/
```

- [ ] **Step 2: Run final content and code verification**

Run:

```bash
node --test tests/chip-layout.test.js
node --check chip-layout.js
node --check script.js
git diff --check
```

Expected: 4 tests pass, both syntax checks exit 0, and the diff check is clean.

- [ ] **Step 3: Review and stage all publishable changes**

Run:

```bash
git status --short
git add -A
git status --short
```

Expected: `.DS_Store` and `.claude/` remain ignored; the Generex copy,
`.gitignore`, tracked image deletions, and plan are staged.

- [ ] **Step 4: Commit the complete workspace**

Run:

```bash
git commit -m "content: refresh Generex portfolio milestones"
```

Expected: the commit succeeds on `main`.

- [ ] **Step 5: Push `main`**

Run:

```bash
git push origin main
```

Expected: `origin/main` advances to the new commit and includes the three
earlier responsive-layout commits.
