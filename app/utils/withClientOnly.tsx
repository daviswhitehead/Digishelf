import React from 'react';
import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export function withClientOnly<P extends object>(WrappedComponent: ComponentType<P>) {
  // Create a wrapper component that will be dynamically loaded
  const ClientComponent = (props: P) => <WrappedComponent {...props} />;

  // Use dynamic to load the wrapper component
  const DynamicComponent = dynamic(() => Promise.resolve(ClientComponent), {
    ssr: false,
  }) as ComponentType<P>;

  // Return the dynamic component directly
  return DynamicComponent;
}
