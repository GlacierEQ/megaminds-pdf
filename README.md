# Megaminds PDF — Focused Technical Document Viewer

> A React PDF viewer for navigating a bundled Black–Scholes paper and highlighting literal search terms in its text layer.

[![PDF viewer verification](https://github.com/GlacierEQ/megaminds-pdf/actions/workflows/ci.yml/badge.svg)](https://github.com/GlacierEQ/megaminds-pdf/actions/workflows/ci.yml)

**Canonical repository:** `GlacierEQ/megaminds-pdf`  
**Canonical branch:** `master`  
**Current posture:** `VERIFIED`  
**Identity note:** this is a focused PDF-viewer project; its name does not establish ownership by `mastermind` or any broader intelligence system.

## The document experience

### What it does

- loads the bundled `Black–Scholes_equation.pdf` with `react-pdf`;
- renders one page at a time instead of mounting every page;
- bounds previous/next navigation to the loaded document;
- accepts comma- or whitespace-separated search terms;
- removes duplicate and empty terms;
- escapes PDF text and regular-expression characters before highlighting;
- reports document-load failure explicitly;
- resolves the installed PDF.js worker through `import.meta.url` in the same module as `Document` and `Page`.

### Why the migration matters

The viewer behavior was already proven, but the previous production tree remained coupled to Create React App through `react-scripts@5.0.1`. That dependency owned development, build, tests, lint assumptions, and a large transitive tree. The migration replaces that shell with Vite and Vitest while preserving React 18 and the existing viewer contract.

The following packages and compatibility layers are intentionally removed:

- `react-scripts`;
- unused `react-pdf-highlighter`;
- unused `copy-webpack-plugin`;
- unused `web-vitals`;
- CRA HTML, entrypoint, Jest setup, and report hook;
- the copied-worker script and public worker artifact boundary.

### Verified proof

The clean lock transaction at commit `a654f6ed7872c66954c99f252c05d31711e3d8c4` established:

- regenerated npm lockfile: passed;
- fresh `npm ci`: passed with zero vulnerabilities;
- Vitest behavior suite: **4 passed, 0 failed**;
- Vite production build: passed;
- production dependency audit: **0 vulnerabilities**;
- one-shot lock workflow: removed after success.

The migration was squash-merged into canonical `master` at `5ddcdc40c9b2bb625d39ddf49e3f44e2e892a773`. The durable machine receipt is [`receipts/vite-migration-verification-2026-07-31.json`](receipts/vite-migration-verification-2026-07-31.json), with full command output preserved under [`.audit/vite-lock-transaction/`](.audit/vite-lock-transaction/).

| Inspect or run | What it establishes |
|---|---|
| [`src/App.jsx`](src/App.jsx) | Viewer state, bounded navigation, literal search normalization, safe highlighting, load failure behavior, and the PDF.js worker boundary. |
| [`src/App.test.jsx`](src/App.test.jsx) | Term normalization, safe highlighting, pagination, and search interaction contracts under Vitest. |
| [`vite.config.js`](vite.config.js) | React transform and jsdom test environment. |
| [`src/Black–Scholes_equation.pdf`](src/Black–Scholes_equation.pdf) | Bundled demonstration document. |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Locked install, behavior tests, production build, and high-severity production audit gate. |

## Engineering anatomy

```text
Vite HTML entry
      │
      ▼
React 18 application
      │
      ▼
react-pdf Document load
      │
      ├── failure ──► explicit alert
      │
      ▼
page count + bounded page state
      │
      ▼
single Page render
      │
      ├── PDF.js worker resolved from installed package
      │
      ▼
PDF text item
      │
      ▼
escape text + normalize literal terms
      │
      ▼
text-layer highlight projection
```

### Search contract

The viewer treats search input as literal terms, not arbitrary regular expressions.

```text
" equation, derivative  equation "
        │
        ▼
["equation", "derivative"]
        │
        ▼
escaped case-insensitive alternation
        │
        ▼
<mark> matches in escaped PDF text
```

### Worker contract

`react-pdf` requires a PDF.js worker compatible with its installed `pdfjs-dist` dependency. `src/App.jsx` configures that worker through:

```js
new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url)
```

No unrelated CDN version or copied public worker is claimed.

### Build and verification

Node.js 22.12 or newer is required by the selected Vite boundary.

```bash
npm ci
npm run test:ci
npm run build
npm run audit:prod
```

All four commands passed against the checked-in regenerated lockfile. A successful build alone remains insufficient if a future high or critical production dependency finding appears.

The production build emits a non-fatal chunk-size warning because the renderer and worker are substantial browser assets. That is an optimization opportunity, not a failed correctness or security gate.

### Intentional limits

- The repository displays one bundled PDF; user uploads are not implemented.
- Highlighting is a text-layer projection, not persistent annotation.
- No OCR is performed on image-only pages.
- No AI summarization, extraction, citation generation, or equation solving is claimed.
- No backend, account system, document database, or collaboration layer is implemented.
- A successful repository build is not a deployment receipt.

## Machine entrypoint

```yaml
schema: glaciereq.readme.v1
repository: GlacierEQ/megaminds-pdf
canonical_branch: master
purpose: >-
  Render a bundled technical PDF one page at a time and highlight normalized,
  literal search terms in the PDF text layer.
status:
  state: VERIFIED
  evidence_level: FUNCTION_BUILD_AND_PRODUCTION_SECURITY_VERIFIED
  canonical_merge: 5ddcdc40c9b2bb625d39ddf49e3f44e2e892a773
  verified_lock_commit: a654f6ed7872c66954c99f252c05d31711e3d8c4
  proof:
    locked_install: pass
    viewer_tests: 4_passed
    production_build: pass
    production_audit_vulnerabilities: 0
    one_shot_workflow_removed: true
  unverified_scope:
    - deployment
    - user-provided document ingestion
    - persistent annotations
    - OCR
    - AI document intelligence
toolchain:
  runtime: React 18.2.0
  development_and_build: Vite 8.1.5
  tests: Vitest 4.1.10 + Testing Library
  pdf_renderer: react-pdf 10.4.1
inputs:
  document: src/Black–Scholes_equation.pdf
  search: comma or whitespace separated literal terms
outputs:
  - one rendered PDF page
  - bounded page status
  - highlighted text-layer matches
commands:
  install: npm ci
  start: npm start
  test: npm run test:ci
  build: npm run build
  production_audit: npm run audit:prod
relationships:
  - target: GlacierEQ/mastermind
    relation: IDENTITY_REVIEW_PENDING
    boundary: Name similarity does not establish component ownership or runtime integration.
  - target: GlacierEQ/job-app-helix
    relation: PORTFOLIO_EVIDENCE_CANDIDATE
    boundary: Helix may evaluate receipts but does not replace repository-native tests.
limits:
  - bundled demonstration document only
  - text-layer highlighting only
  - no external services or providers
```

## Branch hygiene

`master` is canonical at the merged Vite migration. The historical PR branch is squash-merged obsolete. The remaining Dependabot branch was generated against the removed CRA lock graph and must be classified as stale unless a current-main comparison proves independently useful package work.
