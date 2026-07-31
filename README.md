# Megaminds PDF — Focused Technical Document Viewer

> A React PDF viewer for navigating a bundled Black–Scholes paper and highlighting literal search terms in its text layer.

[![PDF viewer verification](https://github.com/GlacierEQ/megaminds-pdf/actions/workflows/ci.yml/badge.svg)](https://github.com/GlacierEQ/megaminds-pdf/actions/workflows/ci.yml)

**Canonical repository:** `GlacierEQ/megaminds-pdf`  
**Canonical branch:** `master`  
**Current posture:** `HARDENING`  
**Identity note:** this is the closest repository match for the user-named “megamind,” but it remains a PDF-viewer project unless a separate intended repository is established.

## The document experience

### What it does

- loads the bundled `Black–Scholes_equation.pdf` with `react-pdf`;
- renders one page at a time instead of mounting every page;
- bounds previous/next navigation to the loaded document;
- accepts comma- or whitespace-separated search terms;
- removes duplicate and empty terms;
- escapes PDF text and regular-expression characters before highlighting;
- reports document-load failure explicitly;
- bundles the installed PDF.js worker into `public/` before start and build.

### Why it matters

The project is small, but the engineering boundary is useful: third-party document rendering, worker packaging, text-layer customization, search-state normalization, and accessible page controls must agree. The previous starter README concealed the actual product while the application kept unused pagination state and converted an array search value into a string that later code still treated as an array.

### Proof path

| Inspect or run | What it establishes |
|---|---|
| [`src/App.js`](src/App.js) | Viewer state, bounded page navigation, literal search normalization, safe highlighting, and load failure behavior. |
| [`src/App.test.js`](src/App.test.js) | Term normalization, safe highlighting, pagination, and search interaction contracts. |
| [`scripts/copy-pdf-worker.mjs`](scripts/copy-pdf-worker.mjs) | Deterministic local PDF.js worker preparation from the installed dependency. |
| [`src/Black–Scholes_equation.pdf`](src/Black–Scholes_equation.pdf) | Bundled demonstration document. |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Locked install, worker preparation, non-watch tests, and production build. |

## Engineering anatomy

```text
bundled technical PDF
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

This prevents malformed expressions from breaking rendering and prevents PDF text from being inserted as unescaped HTML.

### Worker packaging

`react-pdf` requires a PDF.js worker compatible with the installed package. The repository does not rely on an unrelated CDN version.

```bash
npm run prepare:pdf-worker
```

The script resolves the installed `pdfjs-dist` package and copies its worker into `public/pdf.worker.min.mjs`. `prestart` and `prebuild` execute the same preparation automatically.

### Build and verification

```bash
npm ci
npm run prepare:pdf-worker
npm run test:ci
npm run build
```

The CI workflow uses the checked-in lockfile and fails if tests or the production build do not execute successfully.

### Intentional limits

- The repository displays one bundled PDF; user uploads are not implemented.
- Highlighting is a text-layer projection, not persistent annotation.
- No OCR is performed on image-only pages.
- No AI summarization, extraction, citation generation, or equation solving is claimed.
- No backend, account system, document database, or collaboration layer is implemented.
- A successful local build is not a deployment receipt.

## Machine entrypoint

```yaml
schema: glaciereq.readme.v1
repository: GlacierEQ/megaminds-pdf
canonical_branch: master
purpose: >-
  Render a bundled technical PDF one page at a time and highlight normalized,
  literal search terms in the PDF text layer.
status:
  state: HARDENING
  evidence_level: UNVERIFIED_PENDING_BRANCH_CI
  candidate_proof:
    - locked npm install
    - deterministic PDF.js worker copy
    - React behavior tests
    - production build
  unverified_scope:
    - deployment
    - user-provided document ingestion
    - persistent annotations
    - OCR
    - AI document intelligence
inputs:
  document: src/Black–Scholes_equation.pdf
  search: comma or whitespace separated literal terms
outputs:
  - one rendered PDF page
  - bounded page status
  - highlighted text-layer matches
commands:
  install: npm ci
  prepare_worker: npm run prepare:pdf-worker
  test: npm run test:ci
  build: npm run build
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

The repository currently has `master` and one Dependabot branch. Dependency work is not obsolete merely because it is automated; it must be compared against this hardening branch after the application build is green. Merged or superseded work should then be closed and its remote branch ref separately retired.
