import React from 'react';
import { View } from 'react-native';
import { useResponsive } from '../utils/useResponsive';

export const Row = ({ children, spacing = 16 }) => {
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
        <View style={{ padding: spacing / 2 }}>
          {child}
        </View>
      ))}
    </View>
  );
}; 