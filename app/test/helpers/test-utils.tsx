import { ReactElement } from 'react';
import { render, RenderResult } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';

const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
): RenderResult => render(ui, { ...options });

export * from '@testing-library/react';
export { renderWithProviders as render };
