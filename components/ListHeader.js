import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ListHeader = ({ title, isPlaying, onPlayPausePress }) => {
  return (
    <View style={styles.container}>
      <View style={[styles.background, { height: '100%' }]} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Pressable
          onPress={onPlayPausePress}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.iconButtonPressed,
          ]}
        >
          <Icon
            name={isPlaying ? 'pause-outline' : 'play-outline'}
            size={20}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'fixed',
    top: 20,
    left: 20,
    zIndex: 1000,
    
    height: 'auto',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    opacity: 0.8,
    clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 2,
    padding: 20,
    marginRight: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 10,
    whiteSpace: 'nowrap',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonPressed: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});

export default ListHeader; 