'use client';

import React from 'react';
import { View } from 'react-native';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeProps {
  url: string;
  size?: number;
}

const QRCode: React.FC<QRCodeProps> = ({ url, size = 100 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.qrContainer}>
        <QRCodeSVG
          value={url}
          size={size}
          bgColor='#ffffff'
          fgColor='#000000'
          level='L'
          includeMargin={false}
        />
      </View>
    </View>
  );
};

const styles = {
  container: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: 'white',
  },
  qrContainer: {
    padding: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
} as const;

export default QRCode;
