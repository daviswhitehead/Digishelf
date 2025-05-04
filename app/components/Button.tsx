import React from 'react';
import { Text, StyleSheet, StyleProp, ViewStyle } from 'react-native-web';
import { Pressable } from './primitives';

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: StyleProp<ViewStyle>;
}

const Button = ({ onPress, title, style }: ButtonProps) => (
  <Pressable style={[styles.button, style]} onPress={onPress}>
    <Text style={styles.text}>{title}</Text>
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;
