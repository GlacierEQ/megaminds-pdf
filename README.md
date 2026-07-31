# Megaminds PDF — Focused Technical Document Viewer

> A React PDF viewer for navigating a bundled Black–Scholes paper and highlighting literal search terms in its text layer.

[![PDF viewer verification](https://github.com/GlacierEQ/megaminds-pdf/actions/workflows/ci.yml/badge.svg)](https://github.com/GlacierEQ/megaminds-pdf/actions/workflows/ci.yml)

**Canonical repository:** `GlacierEQ/megaminds-pdf`  
**Canonical branch:** `master`  
**Current posture:** `VITE_MIGRATION_PENDING_LOCKED_VERIFICATION`  
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

### Proof path

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

Promotion requires all four commands to pass against the regenerated lockfile. A successful build alone is insufficient while a high or critical production dependency finding remains.

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
  state: VITE_MIGRATION_PENDING_LOCKED_VERIFICATION
  evidence_level: FUNCTION_VERIFIED_SECURITY_RECHECK_REQUIRED
  preserved_proof:
    - four viewer behavior tests passed before toolchain migration
    - production bundle built before toolchain migration
  required_promotion_proof:
    - regenerated package-lock.json
    - npm ci
    - Vitest behavior suite
    - Vite production build
    - zero high or critical production audit findings
toolchain:
  runtime: React 18
  development_and_build: Vite 8
  tests: Vitest 4 + Testing Library
  pdf_renderer: react-pdf 10
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

PR #3 preserves the functional viewer hardening and carries this measured toolchain migration. The Dependabot branch must be compared after the new lockfile is verified; it should not be merged merely because it updates packages, nor deleted before its unique delta is classified.
