import React, { useCallback, useMemo, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import samplePDF from './Black–Scholes_equation.pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import './App.css';

pdfjs.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL || ''}/pdf.worker.min.mjs`;

const DEFAULT_QUERY = 'equation derivative';

export function normalizeTerms(value) {
  const terms = Array.isArray(value) ? value : String(value || '').split(/[\s,]+/);
  return [...new Set(terms.map((term) => term.trim()).filter(Boolean))];
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function highlightPattern(text, rawTerms) {
  const terms = normalizeTerms(rawTerms);
  const safeText = escapeHtml(String(text || ''));
  if (terms.length === 0) return safeText;

  const pattern = terms.map(escapeRegExp).join('|');
  return safeText.replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>');
}

export default function App() {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [loadError, setLoadError] = useState('');

  const terms = useMemo(() => normalizeTerms(query), [query]);
  const textRenderer = useCallback(
    (textItem) => highlightPattern(textItem.str, terms),
    [terms],
  );
  const onDocumentLoadSuccess = useCallback(({ numPages: loadedPages }) => {
    setNumPages(loadedPages);
    setPageNumber(1);
    setLoadError('');
  }, []);
  const onDocumentLoadError = useCallback((error) => {
    setNumPages(0);
    setPageNumber(1);
    setLoadError(error instanceof Error ? error.message : 'The bundled PDF could not be loaded.');
  }, []);

  const canGoBack = pageNumber > 1;
  const canGoForward = numPages > 0 && pageNumber < numPages;

  return (
    <main className="App">
      <header className="viewer-header">
        <p className="eyebrow">Megaminds PDF</p>
        <h1>Inspect and highlight a bundled technical paper</h1>
        <p>
          Search terms are highlighted in the PDF text layer. Navigation is bounded to the loaded
          document; no OCR, annotation persistence, upload, or AI analysis is claimed.
        </p>
      </header>

      <section className="viewer-controls" aria-label="PDF controls">
        <label htmlFor="search-terms">Highlight terms</label>
        <input
          id="search-terms"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="equation derivative"
        />
        <span aria-live="polite">{terms.length} active term{terms.length === 1 ? '' : 's'}</span>

        <div className="page-controls">
          <button
            type="button"
            disabled={!canGoBack}
            onClick={() => setPageNumber((current) => Math.max(1, current - 1))}
          >
            Previous page
          </button>
          <span aria-live="polite">
            Page {numPages === 0 ? 0 : pageNumber} of {numPages}
          </span>
          <button
            type="button"
            disabled={!canGoForward}
            onClick={() => setPageNumber((current) => Math.min(numPages, current + 1))}
          >
            Next page
          </button>
        </div>
      </section>

      {loadError ? <p role="alert">{loadError}</p> : null}

      <section className="pdf-frame" aria-label="PDF document">
        <Document
          file={samplePDF}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={<p>Loading bundled PDF…</p>}
        >
          {numPages > 0 ? (
            <Page
              pageNumber={pageNumber}
              customTextRenderer={textRenderer}
              renderAnnotationLayer
              renderTextLayer
            />
          ) : null}
        </Document>
      </section>
    </main>
  );
}
