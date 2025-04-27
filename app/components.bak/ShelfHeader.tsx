import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { PlayIcon, PauseIcon, MenuIcon } from './icons';

export interface ShelfHeaderProps {
  title: string;
  subtitle: string;
  isPlaying: boolean;
  onPlayPausePress: () => void;
  scrollPosition: number;
  onMenuToggle: () => void;
  isPanelVisible: boolean;
}

export const ShelfHeader: React.FC<ShelfHeaderProps> = ({
  title,
  subtitle,
  isPlaying,
  onPlayPausePress,
  scrollPosition,
  onMenuToggle,
  isPanelVisible,
}) => {
  const opacity = Math.max(0, Math.min(1, 1 - scrollPosition / 100));

  return (
    <View style={[styles.container, { opacity }]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.controls}>
          <Pressable onPress={onPlayPausePress} style={styles.button}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </Pressable>
          <Pressable
            onPress={onMenuToggle}
            style={[styles.button, isPanelVisible && styles.buttonActive]}
          >
            <MenuIcon />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 10,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  buttonActive: {
    backgroundColor: '#e0e0e0',
  },
});
