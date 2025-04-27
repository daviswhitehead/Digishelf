import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const PlayIcon: React.FC<IconProps> = ({ size = 24, color = '#000' }) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Path d='M8 5v14l11-7z' fill={color} />
  </Svg>
);

export const PauseIcon: React.FC<IconProps> = ({ size = 24, color = '#000' }) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Path d='M6 19h4V5H6v14zm8-14v14h4V5h-4z' fill={color} />
  </Svg>
);

export const MenuIcon: React.FC<IconProps> = ({ size = 24, color = '#000' }) => (
  <Svg width={size} height={size} viewBox='0 0 24 24' fill='none'>
    <Path d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' fill={color} />
  </Svg>
);
