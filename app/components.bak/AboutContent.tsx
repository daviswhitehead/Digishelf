import React from 'react';
import { View, Text } from 'react-native';

const AboutContent = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>About Digishelf</Text>
        <Text style={styles.description}>
          Digishelf is your personal digital library management system, helping you organize and
          track your collection across multiple platforms.
        </Text>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginBottom: 20,
    textAlign: 'center' as const,
    color: '#fff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center' as const,
    lineHeight: 24,
    maxWidth: 600,
    marginHorizontal: 'auto' as any,
    color: '#fff',
  },
} as const;

export default AboutContent;
