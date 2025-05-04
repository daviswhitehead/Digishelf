import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 600,
    marginHorizontal: 'auto',
    color: '#fff',
  },
});

export default AboutContent;
