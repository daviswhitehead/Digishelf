import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { RenderOptions } from '@testing-library/react';

// Add any providers here
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => rtlRender(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render }; 