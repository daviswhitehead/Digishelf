import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Add any providers here
function AllTheProviders({ children }: { children: React.ReactNode }): JSX.Element {
  return <>{children}</>;
}

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
