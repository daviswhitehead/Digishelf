import React from 'react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { View } from 'react-native';

// Dynamically import the AboutContent component with SSR disabled
const DynamicAboutContent = dynamic(() => import('../components/AboutContent'), {
  ssr: false,
  loading: () => null,
});

const About: NextPage = () => {
  return (
    <View style={styles.container}>
      <DynamicAboutContent />
    </View>
  );
};

const styles = {
  container: {
    height: '100%',
    width: '100%',
  },
} as const;

export default About;
