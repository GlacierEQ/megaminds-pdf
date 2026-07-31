import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App, { highlightPattern, normalizeTerms } from './App';

jest.mock('react-pdf', () => {
  const React = require('react');
  return {
    pdfjs: {
      GlobalWorkerOptions: {},
    },
    Document: ({ children, onLoadSuccess }) => {
      React.useEffect(() => {
        onLoadSuccess({ numPages: 3 });
      }, [onLoadSuccess]);
      return <div data-testid="document">{children}</div>;
    },
    Page: ({ pageNumber, customTextRenderer }) => (
      <div data-testid="page" data-page-number={pageNumber}>
        {customTextRenderer({ str: 'Derivative equation' })}
      </div>
    ),
  };
});

jest.mock('./Black–Scholes_equation.pdf', () => 'black-scholes.pdf');

it('normalizes comma and whitespace separated terms without duplicates', () => {
  expect(normalizeTerms(' equation, derivative  equation ')).toEqual(['equation', 'derivative']);
});

it('escapes PDF text and treats search terms as literal text', () => {
  expect(highlightPattern('<equation>', ['equation', '.'])).toBe(
    '&lt;<mark>equation</mark>&gt;',
  );
});

it('loads one page at a time and bounds navigation to the document', async () => {
  render(<App />);

  await waitFor(() => expect(screen.getByText('Page 1 of 3')).toBeInTheDocument());
  expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  expect(screen.getByTestId('page')).toHaveAttribute('data-page-number', '1');

  fireEvent.click(screen.getByRole('button', { name: 'Next page' }));
  expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
  expect(screen.getByTestId('page')).toHaveAttribute('data-page-number', '2');
});

it('updates the active search-term count without breaking highlighting', async () => {
  render(<App />);
  await waitFor(() => expect(screen.getByText('2 active terms')).toBeInTheDocument());

  fireEvent.change(screen.getByLabelText('Highlight terms'), {
    target: { value: 'volatility' },
  });

  expect(screen.getByText('1 active term')).toBeInTheDocument();
});
