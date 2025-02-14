import React from 'react';
import { View, StyleSheet } from 'react-native';
import { QRCodeSVG } from 'qrcode.react';

const QRCodeComponent = ({ url, size = 100 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.qrContainer}>
        <QRCodeSVG
          value={url}
          size={size}
          bgColor="#ffffff"
          fgColor="#000000"
          level="L"
          includeMargin={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'fixed',
    top: 20,
    right: 20,
    zIndex: 1000,
    height: 'auto',
    opacity: 0.8,
    backgroundColor: 'white',
  },
  qrContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QRCodeComponent; 