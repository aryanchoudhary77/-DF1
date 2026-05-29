import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { Theme } from '@/src/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export default function GlassCard({ children, style, intensity = 40 }: GlassCardProps) {
  return (
    <BlurView intensity={intensity} tint="light" style={[styles.card, style]}>
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: Theme.colors.surface,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderWidth: 1,
    padding: Theme.spacing.md,
  },
});
