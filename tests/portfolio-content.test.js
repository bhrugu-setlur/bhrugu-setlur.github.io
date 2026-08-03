const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("projects chip exposes Mood Sorter as its sixth core", () => {
  const projectsButton = html.match(
    /<button class="block b-proj"[\s\S]*?<\/button>/
  )?.[0];

  assert.ok(projectsButton, "Projects chip button is missing");
  assert.match(projectsButton, /GPU · 6 CORES/);
  assert.equal((projectsButton.match(/<span class="core">/g) || []).length, 6);
  assert.match(projectsButton, /MOOD·SORT/);
});

test("projects GPU grid reserves a full cell for every core", () => {
  const projectsButton = html.match(
    /<button class="block b-proj"[\s\S]*?<\/button>/
  )?.[0];
  const gridRule = css.match(
    /\.cores-gpu\s*{[\s\S]*?grid-template-columns:\s*repeat\((\d+),\s*1fr\);[\s\S]*?grid-template-rows:\s*repeat\((\d+),\s*1fr\);[\s\S]*?}/
  );
  const flagshipRule = css.match(
    /\.cores-gpu \.core:first-child\s*{\s*grid-area:\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*\/\s*(\d+)\s*;/
  );

  assert.ok(projectsButton, "Projects chip button is missing");
  assert.ok(gridRule, "Projects GPU grid dimensions are missing");
  assert.ok(flagshipRule, "Projects flagship core placement is missing");

  const coreCount = (projectsButton.match(/<span class="core">/g) || []).length;
  const gridCells = Number(gridRule[1]) * Number(gridRule[2]);
  const flagshipCells =
    (Number(flagshipRule[3]) - Number(flagshipRule[1])) *
    (Number(flagshipRule[4]) - Number(flagshipRule[2]));
  const requiredCells = coreCount - 1 + flagshipCells;

  assert.ok(
    gridCells >= requiredCells,
    `${coreCount} cores need ${requiredCells} cells, but the GPU grid only defines ${gridCells}`
  );
});

test("Mood Sorter leads software projects with its repository and local image", () => {
  const softwareIndex = html.indexOf('<p class="mono eyebrow-sub">Software</p>');
  const moodSorterIndex = html.indexOf("<h2>Mood Sorter</h2>");
  const lineLabIndex = html.indexOf("<h2>LineLab</h2>");
  const moodSorterArticleStart = html.lastIndexOf("<article", moodSorterIndex);
  const moodSorterArticleEnd = html.indexOf("</article>", moodSorterIndex);

  assert.notEqual(softwareIndex, -1, "Software subsection is missing");
  assert.notEqual(moodSorterIndex, -1, "Mood Sorter project is missing");
  assert.notEqual(lineLabIndex, -1, "LineLab project is missing");
  assert.ok(softwareIndex < moodSorterIndex && moodSorterIndex < lineLabIndex);
  assert.notEqual(moodSorterArticleStart, -1, "Mood Sorter article start is missing");
  assert.notEqual(moodSorterArticleEnd, -1, "Mood Sorter article end is missing");

  const moodSorterArticle = html.slice(moodSorterArticleStart, moodSorterArticleEnd);
  assert.match(
    moodSorterArticle,
    /https:\/\/github\.com\/bhrugusetlur-art\/spotify-sorting/
  );
  assert.match(moodSorterArticle, /src="\.\/images\/mood-sorter-dashboard\.png"/);
  assert.match(
    moodSorterArticle,
    /alt="Mood Sorter dashboard showing five generated Spotify playlists"/
  );
  assert.ok(fs.existsSync(path.join(root, "images/mood-sorter-dashboard.png")));
});
