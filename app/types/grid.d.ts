import { ReactNode } from 'react';

export interface RowProps {
  children: ReactNode;
  spacing?: number;
}

export interface GridProps {
  children: ReactNode;
  columns?: number;
  spacing?: number;
}
