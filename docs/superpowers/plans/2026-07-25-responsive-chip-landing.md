# Responsive Chip Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep the complete interactive chip landing composition visible and proportionally scaled on iPad landscape and other phone, tablet, laptop, and desktop viewports.

**Architecture:** Replace the stage's guessed viewport-height subtraction with a three-row layout whose middle row represents the chip's real available space. A small pure sizing function will fit the package against that row's width and height, while a `ResizeObserver` keeps it synchronized with rotation, browser chrome, and font/layout changes.

**Tech Stack:** Static HTML, CSS, browser JavaScript, Node.js built-in test runner

## Global Constraints

- Change only the interactive landing stage and chip sizing.
- Preserve the 5:4 desktop/tablet and 4:5 phone portrait aspect ratios.
- Preserve all chip content, navigation, focus behavior, animation, and panel layouts.
- Do not add dependencies or target device names.
- Remove the approved design spec after implementation, as requested by the user.
- Preserve unrelated working-tree changes.

---

### Task 1: Add Tested Chip Geometry

**Files:**
- Create: `chip-layout.js`
- Create: `tests/chip-layout.test.js`

**Interfaces:**
- Consumes: `{ availableWidth, availableHeight, aspectRatio, maxWidth?, widthFraction? }`
- Produces: `calculateChipSize(options) -> { width: number, height: number }`

- [ ] **Step 1: Write the failing geometry tests**

Create `tests/chip-layout.test.js`:

```js
const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateChipSize } = require("../chip-layout.js");

const closeTo = (actual, expected) => {
  assert.ok(Math.abs(actual - expected) < 0.001, `${actual} != ${expected}`);
};

test("fits a 5:4 chip to the available iPad landscape height", () => {
  const size = calculateChipSize({
    availableWidth: 960,
    availableHeight: 609,
    aspectRatio: 5 / 4,
  });

  closeTo(size.width, 761.25);
  closeTo(size.height, 609);
});

test("honors the desktop maximum without changing the aspect ratio", () => {
  const size = calculateChipSize({
    availableWidth: 1600,
    availableHeight: 1000,
    aspectRatio: 5 / 4,
  });

  closeTo(size.width, 1020);
  closeTo(size.height, 816);
});

test("fits a 4:5 phone chip to the available width", () => {
  const size = calculateChipSize({
    availableWidth: 358,
    availableHeight: 651,
    aspectRatio: 4 / 5,
  });

  closeTo(size.width, 336.52);
  closeTo(size.height, 420.65);
});

test("returns an empty size when no usable row space exists", () => {
  assert.deepEqual(
    calculateChipSize({
      availableWidth: 0,
      availableHeight: 609,
      aspectRatio: 5 / 4,
    }),
    { width: 0, height: 0 }
  );
});
```

- [ ] **Step 2: Run the test and verify the missing module fails**

Run: `node --test tests/chip-layout.test.js`

Expected: FAIL because `../chip-layout.js` does not exist.

- [ ] **Step 3: Implement the pure sizing function**

Create `chip-layout.js`:

```js
(function exposeChipLayout(root) {
  function calculateChipSize({
    availableWidth,
    availableHeight,
    aspectRatio,
    maxWidth = 1020,
    widthFraction = 0.94,
  }) {
    if (
      availableWidth <= 0 ||
      availableHeight <= 0 ||
      aspectRatio <= 0
    ) {
      return { width: 0, height: 0 };
    }

    const width = Math.min(
      availableWidth * widthFraction,
      availableHeight * aspectRatio,
      maxWidth
    );

    return { width, height: width / aspectRatio };
  }

  const api = { calculateChipSize };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  } else {
    root.ChipLayout = api;
  }
})(typeof window !== "undefined" ? window : globalThis);
```

- [ ] **Step 4: Run the tests and verify all geometry cases pass**

Run: `node --test tests/chip-layout.test.js`

Expected: 4 tests pass and 0 fail.

### Task 2: Fit the Landing Chip to Its Real Layout Row

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `script.js`

**Interfaces:**
- Consumes: `window.ChipLayout.calculateChipSize` from Task 1
- Produces: inline package width and height synchronized to the measured `.die-scene`

- [ ] **Step 1: Load the sizing helper before the interaction script**

In `index.html`, load `chip-layout.js` immediately before `script.js`:

```html
<script src="./chip-layout.js"></script>
<script src="./script.js"></script>
```

- [ ] **Step 2: Replace the guessed stage sizing with real remaining space**

In `styles.css`:

```css
.stage {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  justify-content: normal;
}

.die-scene {
  min-width: 0;
  min-height: 0;
  align-items: center;
  padding-top: 0;
}

.die-pkg {
  width: min(94%, 1020px);
  max-height: 100%;
}

@media (orientation: landscape) and (max-height: 850px) {
  .stage {
    padding-top: 0.65rem;
    padding-bottom: 0.55rem;
    gap: 0.5rem;
  }

  .subline {
    margin-top: 0.2rem;
  }

  .hint {
    margin-top: 0;
    padding-block: 0.5rem;
  }
}
```

Remove the old `calc((100dvh - 130px) * 1.25)` and phone equivalent.

- [ ] **Step 3: Synchronize the package with the measured scene**

In `script.js`, select `.die-pkg`, calculate 5:4 or 4:5 geometry, apply its
pixel dimensions, and observe the scene:

```js
const chipPackage = document.querySelector(".die-pkg");
const phoneLayout = window.matchMedia("(max-width: 700px)");

function fitChipPackage() {
  if (!chipPackage) return;
  const bounds = scene.getBoundingClientRect();
  const aspectRatio = phoneLayout.matches ? 4 / 5 : 5 / 4;
  const size = window.ChipLayout.calculateChipSize({
    availableWidth: bounds.width,
    availableHeight: bounds.height,
    aspectRatio,
  });

  chipPackage.style.width = `${size.width}px`;
  chipPackage.style.height = `${size.height}px`;
}

fitChipPackage();
new ResizeObserver(fitChipPackage).observe(scene);
document.fonts?.ready.then(fitChipPackage);
```

Call `fitChipPackage()` before recalculating an open panel's zoom inside the
existing resize handler.

- [ ] **Step 4: Run the geometry regression suite**

Run: `node --test tests/chip-layout.test.js`

Expected: 4 tests pass and 0 fail.

### Task 3: Cleanup and Full Verification

**Files:**
- Delete: `docs/superpowers/specs/2026-07-25-responsive-chip-landing-design.md`
- Verify: `chip-layout.js`, `tests/chip-layout.test.js`, `index.html`, `styles.css`, `script.js`

**Interfaces:**
- Consumes: completed responsive landing implementation
- Produces: final working tree without the temporary design spec

- [ ] **Step 1: Remove the temporary design spec**

Delete `docs/superpowers/specs/2026-07-25-responsive-chip-landing-design.md`.

- [ ] **Step 2: Run the complete automated test**

Run: `node --test tests/chip-layout.test.js`

Expected: 4 tests pass and 0 fail.

- [ ] **Step 3: Run syntax and whitespace checks**

Run:

```bash
node --check chip-layout.js
node --check script.js
git diff --check
```

Expected: all commands exit 0 with no diagnostics.

- [ ] **Step 4: Review the scoped diff**

Run:

```bash
git diff -- chip-layout.js tests/chip-layout.test.js index.html styles.css script.js docs/superpowers/specs/2026-07-25-responsive-chip-landing-design.md
git status --short
```

Expected: only the planned responsive files, temporary-spec deletion, and
pre-existing unrelated working-tree changes are present.

