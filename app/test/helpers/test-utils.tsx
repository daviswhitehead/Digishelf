import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import { UserProvider } from '../../hooks/useUser';

function render(ui: React.ReactNode, options: Omit<RenderOptions, 'wrapper'> = {}) {
  return rtlRender(<UserProvider>{ui}</UserProvider>, {
    ...options,
  });
}

export * from '@testing-library/react';
export { render };
