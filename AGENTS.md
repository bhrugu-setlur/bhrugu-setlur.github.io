# Notes for agents

## Facts confirmed by the owner

- **The 8-bit CPU ran on a physical Basys 3 FPGA board.** The owner confirmed this on
  2026-09-14. Do not remove or soften the Basys 3 claim on the site, the resume, or the
  `cpu-design` repo docs.
- The Sky130 GDS is project-deck verified only. No chip has been fabricated or foundry
  signed off.
- If the owner states a fact about their own work, take it as true. Do not go verify it.

## Resume

- Source: `resume/SetlurBhrugu_resume.tex`. Build with `tectonic`, then copy the PDF to
  the repo root. It must stay one page.
- `tests/portfolio-content.test.js` pins the PDF's SHA-256, so update it after every rebuild.
- Plain hyphens are deliberate for ATS parsing. Do not change them to en or em dashes.
