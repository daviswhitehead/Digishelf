import React from 'react';
import {
  View as RNView,
  Text as RNText,
  Pressable as RNPressable,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

// Define SSR-compatible props
interface SSRViewProps extends Omit<React.ComponentProps<typeof RNView>, 'style'> {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

interface SSRPressableProps extends Omit<React.ComponentProps<typeof RNPressable>, 'style'> {
  children?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

interface SSRTextProps extends Omit<React.ComponentProps<typeof RNText>, 'style'> {
  children?: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

const View = React.forwardRef<typeof RNView, SSRViewProps>((props, ref) => {
  return <RNView {...props} ref={ref} />;
});
View.displayName = 'View';

const Pressable = React.forwardRef<typeof RNPressable, SSRPressableProps>((props, ref) => {
  return <RNPressable {...props} ref={ref} />;
});
Pressable.displayName = 'Pressable';

const Text = React.forwardRef<typeof RNText, SSRTextProps>((props, ref) => {
  return <RNText {...props} ref={ref} />;
});
Text.displayName = 'Text';

export { View, Text, Pressable };
