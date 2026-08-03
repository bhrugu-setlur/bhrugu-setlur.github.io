# Mood Sorter Portfolio Project Card

## Goal

Add Mood Sorter to the portfolio's Projects section while preserving the
site's existing chip-floorplan design, project-row format, navigation, and
interactions.

## Source of Truth

Use the project documentation and dashboard image from
`/Users/bhrugusetlur/dev/spotify-project`. Link the portfolio entry to the
project's configured GitHub remote:
`https://github.com/bhrugusetlur-art/spotify-sorting`.

## Portfolio Changes

- Update the Projects block subtitle from `GPU · 5 CORES` to
  `GPU · 6 CORES`.
- Add a sixth project core labeled `MOOD·SORT` and expand the existing GPU
  core grid from 4×2 to 3×3. This preserves the 2×2 flagship CPU core while
  giving all five remaining projects a full cell.
- Add Mood Sorter as the first item in the Software subsection, before LineLab.
- Use the existing `work-row work-row-media` structure, with a `Web App` tag,
  project title, concise description, repository link, and dashboard image.
- Copy the source dashboard image into the portfolio's `images` directory so
  the site does not depend on an external image URL.

## Content

The description will state that Mood Sorter organizes a user's liked Spotify
songs into five private playlists—Chill, Hype, Focus, Sad, and Happy—using a
deterministic classifier. It will also summarize its safe repeat-run behavior
and server-side Spotify authentication with PKCE and encrypted stored tokens.
All claims must remain supported by the source repository's README and code.

## Layout and Behavior

The only CSS change is the existing GPU core grid's explicit dimensions; no
new visual system or component styling is introduced. The added project will
reuse the current responsive two-column media row, which already collapses to
one column on smaller screens. The dashboard image will include descriptive
alternative text. Existing navigation and zoom behavior remain unchanged.

## Verification

- Add a Node test that reads `index.html` and verifies the six-core subtitle,
  Mood Sorter core label, placement before LineLab, repository URL, and local
  dashboard image path.
- Run the test before implementation and confirm that it fails for the missing
  content.
- Implement only the required HTML, image, and GPU-grid changes, then rerun all
  tests.
- Validate that the referenced image exists and review the final diff to
  confirm that JavaScript is unchanged and CSS changes are limited to the
  approved 3×3 GPU grid.
