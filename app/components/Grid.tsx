import React from 'react';
import { View } from 'react-native';
import { useResponsive } from '../utils/useResponsive';
import type { RowProps, GridProps } from '../types/grid';

export const Row: React.FC<RowProps> = ({ children, spacing = 16 }) => {
  const { isMobile } = useResponsive();

  return (
    <View
      style={{
        flexDirection: isMobile ? 'column' : 'row',
        margin: -spacing / 2,
        flexWrap: 'wrap',
      }}
    >
      {React.Children.map(children, child => (
        <View style={{ padding: spacing / 2 }}>{child}</View>
      ))}
    </View>
  );
};

export const Grid: React.FC<GridProps> = ({ children, columns = 1, spacing = 16 }) => {
  const { isMobile } = useResponsive();
  const columnWidth = `${100 / (isMobile ? 1 : columns)}%`;

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: -spacing / 2,
      }}
    >
      {React.Children.map(children, child => (
        <View
          style={{
            width: columnWidth,
            padding: spacing / 2,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
};
