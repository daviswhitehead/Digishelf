import React from 'react';
import { render as rtlRender, RenderOptions } from '@testing-library/react';

interface WrapperProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<WrapperProps> = ({ children }) => {
  return <>{children}</>;
};

const customRender = (
  ui: Parameters<typeof rtlRender>[0],
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return rtlRender(ui, {
    wrapper: AllTheProviders,
    ...options,
  } as RenderOptions);
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
