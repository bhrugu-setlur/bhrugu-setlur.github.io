# Responsive Chip Landing Design

## Goal

Make the interactive chip landing page fit cleanly on iPad landscape and scale
across phone, tablet, laptop, and desktop viewports without changing the visual
identity, floorplan content, or zoom interaction.

## Root Cause

The chip package currently derives its width from
`calc((100dvh - 130px) * 1.25)`. At a 1024 by 768 viewport, the header, hint,
stage padding, and flex gaps consume roughly 160 pixels rather than the assumed
130 pixels. The package therefore requests more vertical space than the chip
area has available. The flex layout and `max-height` constraint must then
reconcile conflicting dimensions, which makes the landing composition appear
compressed or misaligned.

The existing width breakpoints also do not address this failure directly:
iPad landscape remains on the desktop floorplan because its width exceeds 700
pixels, even though its limited height is the binding constraint.

## Design

### Layout

Change the landing stage from a vertically centered flex stack to three
explicit rows:

1. The top bar uses its natural height.
2. The chip scene receives all remaining height with `minmax(0, 1fr)`.
3. The interaction hint uses its natural height.

The chip package will size itself against both dimensions of the middle row.
It will preserve the existing 5:4 desktop and tablet aspect ratio, remain
capped at its current desktop maximum, and shrink uniformly whenever either
available width or available height becomes the limiting dimension.

The existing portrait phone floorplan will retain its 4:5 aspect ratio. Its
size will also come from the available chip row rather than a viewport-height
subtraction.

### Compact Landscape Behavior

Add a height-based compact-landscape rule for short landscape viewports. It
will reduce only the stage padding and vertical gaps needed to preserve clear
outer margins. It will not alter the floorplan grid, hide labels, or introduce
device-specific rules.

The rule will use viewport height and orientation because those values describe
the actual constraint. It will not target `iPad`, Safari, or a specific screen
width.

### Interaction

The chip blocks, hover and focus states, breathing glow, deep links, panel
opening, and zoom animation remain unchanged. Because the package keeps a
stable aspect ratio, the existing JavaScript geometry and transform-origin
calculation will continue to use accurate block bounds.

### Scope

Only the interactive landing stage and chip sizing are in scope. Content panel
layouts, portfolio copy, media, and navigation behavior will not change.

## Responsive Requirements

- No chip, header, top link, or hint may overlap or leave the visible viewport.
- The complete chip package must remain visible with balanced outer margins.
- The package must preserve its intended aspect ratio rather than stretch.
- All interactive blocks must retain usable touch targets.
- The compact rule must respond to available height, not device identity.
- Existing phone portrait and desktop compositions must remain visually
  consistent with the current design.
- Rotation and resize events must leave the zoom calculation aligned with the
  rendered block geometry.

## Validation

Verify the landing page at these representative CSS viewport sizes:

- 390 by 844: phone portrait
- 844 by 390: phone landscape
- 768 by 1024: tablet portrait
- 1024 by 768: iPad landscape
- 1180 by 820: modern iPad landscape
- 1366 by 768: short laptop
- 1440 by 900: desktop

At each size, check:

- the header, chip, hint, and top links remain visible;
- the chip is centered and not clipped or distorted;
- block labels do not collide with the expand glyph;
- every chip block can be activated;
- opening and closing a panel keeps the zoom centered;
- no horizontal or vertical page scrolling is introduced on the landing view.

Also verify reduced-motion behavior and resize the viewport across the compact
landscape threshold to catch discontinuities.

