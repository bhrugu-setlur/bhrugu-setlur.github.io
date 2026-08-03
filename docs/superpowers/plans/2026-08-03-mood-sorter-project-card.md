# Mood Sorter Project Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Mood Sorter as the first software project and sixth project core without changing the portfolio's established presentation.

**Architecture:** Keep the static site architecture unchanged. Extend `index.html` with one existing-format project row and one chip-floorplan tile, copy the repository-owned dashboard image into local portfolio assets, and protect the rendered content contract with a Node test.

**Tech Stack:** Static HTML/CSS, Node.js built-in test runner, local PNG asset

## Global Constraints

- Preserve the existing chip-floorplan design, project-row format, navigation, and interactions.
- Use `/Users/bhrugusetlur/dev/spotify-project` as the source of truth.
- Link to `https://github.com/bhrugusetlur-art/spotify-sorting`.
- Do not modify `styles.css` or `script.js`.
- Reuse the existing responsive `work-row work-row-media` structure.

---

### Task 1: Add the Mood Sorter project entry

**Files:**
- Create: `tests/portfolio-content.test.js`
- Create: `images/mood-sorter-dashboard.png`
- Modify: `index.html:72-80`
- Modify: `index.html:314-342`

**Interfaces:**
- Consumes: the Projects chip block and Software subsection in `index.html`; the source dashboard image at `/Users/bhrugusetlur/dev/spotify-project/docs/images/mood-sorter-dashboard.png`
- Produces: a six-core Projects chip and a locally illustrated Mood Sorter project row linking to the GitHub repository

- [ ] **Step 1: Write the failing content test**

Create `tests/portfolio-content.test.js` using Node's built-in test runner. Read `index.html`, isolate the Projects chip button, and assert that it advertises six cores, contains six `.core` tiles including `MOOD·SORT`, and places the Mood Sorter heading after the Software eyebrow but before LineLab. Assert the repository URL and `./images/mood-sorter-dashboard.png` reference, and require the referenced image to exist.

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

test("projects chip exposes Mood Sorter as its sixth core", () => {
  const projectsButton = html.match(
    /<button class="block b-proj"[\s\S]*?<\/button>/
  )?.[0];

  assert.ok(projectsButton, "Projects chip button is missing");
  assert.match(projectsButton, /GPU · 6 CORES/);
  assert.equal((projectsButton.match(/<span class="core">/g) || []).length, 6);
  assert.match(projectsButton, /MOOD·SORT/);
});

test("Mood Sorter leads software projects with its repository and local image", () => {
  const softwareIndex = html.indexOf('<p class="mono eyebrow-sub">Software</p>');
  const moodSorterIndex = html.indexOf("<h2>Mood Sorter</h2>");
  const lineLabIndex = html.indexOf("<h2>LineLab</h2>");

  assert.ok(softwareIndex < moodSorterIndex && moodSorterIndex < lineLabIndex);
  assert.match(html, /https:\/\/github\.com\/bhrugusetlur-art\/spotify-sorting/);
  assert.match(html, /src="\.\/images\/mood-sorter-dashboard\.png"/);
  assert.ok(fs.existsSync(path.join(root, "images/mood-sorter-dashboard.png")));
});
```

- [ ] **Step 2: Run the test and verify RED**

Run: `node --test tests/portfolio-content.test.js`

Expected: both tests fail because the sixth core and Mood Sorter row do not exist.

- [ ] **Step 3: Add the local image and minimal HTML**

Copy the source PNG to `images/mood-sorter-dashboard.png`. In the Projects chip, change the subtitle to `GPU · 6 CORES` and append:

```html
<span class="core"><i>MOOD·SORT</i></span>
```

Immediately below the Software eyebrow, add an existing-format `work-row work-row-media` article. Use the `Web App` tag, `Mood Sorter` heading, a factual paragraph covering the five private mood playlists, deterministic sorting, safe reruns, PKCE, and encrypted stored tokens, the configured repository link, and a `work-media` figure containing the copied screenshot with descriptive alternative text.

- [ ] **Step 4: Run the focused and full tests**

Run: `node --test tests/portfolio-content.test.js`

Expected: 2 tests pass.

Run: `node --test tests/*.test.js`

Expected: all portfolio tests pass with zero failures.

- [ ] **Step 5: Verify scope and request independent review**

Run: `git diff --check && git diff -- index.html tests/portfolio-content.test.js && git status --short`

Confirm the PNG exists, `styles.css` and `script.js` are unchanged, and the diff contains only the approved project content, asset, test, and planning document. Dispatch an independent reviewer with the approved design, implementation plan, and diff range; address all Critical and Important findings before final verification.
