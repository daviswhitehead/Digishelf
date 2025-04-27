import React from 'react';
import { View, StyleSheet } from 'react-native';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeComponentProps {
  url: string;
  size?: number;
}

const QRCodeComponent: React.FC<QRCodeComponentProps> = ({ url, size = 100 }) => {
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

const styles = StyleSheet.create({
  container: {
    position: 'fixed',
    top: 20,
    right: 20,
    zIndex: 1000,
    height: 'auto',
    backgroundColor: 'white',
  },
  qrContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QRCodeComponent;
