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
