const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const css = fs.readFileSync(path.join(root, "styles.css"), "utf8");

test("resume links serve the current resume PDF", () => {
  const expectedSha256 =
    "693e56cc72f123d8a157bd985f3239750b74c194e293ee40311ec8e89ba82434";
  const resumePaths = [
    path.join(root, "SetlurBhrugu_resume.pdf"),
    path.join(root, "resume", "SetlurBhrugu_resume.pdf"),
  ];

  assert.equal(
    (html.match(/href="\.\/SetlurBhrugu_resume\.pdf"/g) || []).length,
    2,
    "Both site resume links should open the supplied resume"
  );

  for (const resumePath of resumePaths) {
    const actualSha256 = crypto
      .createHash("sha256")
      .update(fs.readFileSync(resumePath))
      .digest("hex");

    assert.equal(actualSha256, expectedSha256, `${resumePath} is not the supplied resume`);
  }
});

test("contact section shows and opens the full LinkedIn profile URL", () => {
  const contactPanel = html.match(
    /<section class="panel" id="panel-contact"[\s\S]*?<\/section>/
  )?.[0];

  assert.ok(contactPanel, "Contact panel is missing");
  assert.match(
    contactPanel,
    /<a href="https:\/\/www\.linkedin\.com\/in\/bhrugu-setlur-931997348"[^>]*>https:\/\/www\.linkedin\.com\/in\/bhrugu-setlur-931997348<\/a>/
  );
});

test("VIP experience identifies Google Cloud Platform", () => {
  const experiencePanel = html.match(
    /<section class="panel" id="panel-experience"[\s\S]*?<\/section>/
  )?.[0];
  const vipEntry = experiencePanel?.match(
    /<h2>VIP: High Performance Computing at NYU<\/h2>[\s\S]*?<\/li>/
  )?.[0];

  assert.ok(vipEntry, "VIP experience entry is missing");
  assert.match(vipEntry, /Google Cloud Platform \(GCP\)/);
});

test("mobile About portrait is centered in its stacked layout", () => {
  const mobileStart = css.indexOf("@media (max-width: 820px)");
  const mobileEnd = css.indexOf("@media (max-width: 700px)", mobileStart);
  const mobileCss = css.slice(mobileStart, mobileEnd);
  const aboutPhotoRule = mobileCss.match(/\.about-photo\s*{([\s\S]*?)}/)?.[1];

  assert.notEqual(mobileStart, -1, "Mobile breakpoint is missing");
  assert.notEqual(mobileEnd, -1, "Next mobile breakpoint is missing");
  assert.ok(aboutPhotoRule, "Mobile About portrait rule is missing");
  assert.match(aboutPhotoRule, /display:\s*block;/);
  assert.match(aboutPhotoRule, /margin-inline:\s*auto;/);
});

test("projects chip exposes Mood Sorter as its sixth core", () => {
  const projectsButton = html.match(
    /<button class="block b-proj"[\s\S]*?<\/button>/
  )?.[0];

  assert.ok(projectsButton, "Projects chip button is missing");
  assert.equal((projectsButton.match(/<span class="core">/g) || []).length, 6);
  assert.match(projectsButton, /MOOD·SORT/);
});

test("projects GPU grid gives all six cores equal-sized cells", () => {
  const projectsButton = html.match(
    /<button class="block b-proj"[\s\S]*?<\/button>/
  )?.[0];
  const gridRule = css.match(
    /\.cores-gpu\s*{[\s\S]*?grid-template-columns:\s*repeat\((\d+),\s*1fr\);[\s\S]*?grid-template-rows:\s*repeat\((\d+),\s*1fr\);[\s\S]*?}/
  );

  assert.ok(projectsButton, "Projects chip button is missing");
  assert.ok(gridRule, "Projects GPU grid dimensions are missing");

  const coreCount = (projectsButton.match(/<span class="core">/g) || []).length;
  const gridCells = Number(gridRule[1]) * Number(gridRule[2]);

  assert.equal(
    gridCells,
    coreCount,
    `${coreCount} equal cores require exactly ${coreCount} grid cells`
  );
  assert.doesNotMatch(
    css,
    /\.cores-gpu \.core:first-child\s*{[^}]*grid-area:/,
    "Projects grid must not give the first core a larger span"
  );
});

test("Mood Sorter leads software projects with its repository and demo video", () => {
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
  assert.match(moodSorterArticle, /src="\.\/videos\/mood-sorter-demo\.mp4"/);
  assert.match(moodSorterArticle, /poster="\.\/images\/poster-mood-sorter-demo\.jpg"/);
  assert.ok(fs.existsSync(path.join(root, "videos/mood-sorter-demo.mp4")));
  assert.ok(fs.existsSync(path.join(root, "images/poster-mood-sorter-demo.jpg")));
});
