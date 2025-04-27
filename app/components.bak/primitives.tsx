import React from 'react';
import {
  View as RNView,
  Text as RNText,
  TouchableOpacity as RNTouchableOpacity,
  ViewStyle,
  TextStyle,
  View as ViewType,
  Text as TextType,
  TouchableOpacity as TouchableOpacityType,
} from 'react-native';
import type { CSSProperties } from 'react';

// Define SSR-compatible props
interface SSRViewProps {
  children: React.ReactNode;
  style?: ViewStyle | CSSProperties;
  className?: string;
}

interface SSRTextProps extends SSRViewProps {
  style?: TextStyle | CSSProperties;
}

interface SSRTouchableOpacityProps extends SSRViewProps {
  onPress?: () => void;
}

const View = React.forwardRef<typeof ViewType, SSRViewProps>(({ style, ...props }, ref) => (
  <RNView {...props} style={style as CSSProperties} ref={ref} />
));
View.displayName = 'View';

const Text = React.forwardRef<typeof TextType, SSRTextProps>(({ style, ...props }, ref) => (
  <RNText {...props} style={style as CSSProperties} ref={ref} />
));
Text.displayName = 'Text';

const TouchableOpacity = React.forwardRef<typeof TouchableOpacityType, SSRTouchableOpacityProps>(
  ({ style, ...props }, ref) => (
    <RNTouchableOpacity {...props} style={style as CSSProperties} ref={ref} />
  )
);
TouchableOpacity.displayName = 'TouchableOpacity';

export { View, Text, TouchableOpacity };
