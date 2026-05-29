import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Theme } from '@/src/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export default function Button({ title, onPress, variant = 'primary', isLoading, disabled, style, textStyle, icon }: ButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { bg: Theme.colors.surface, text: Theme.colors.primary };
      case 'outline':
        return { bg: 'transparent', text: Theme.colors.primary, border: Theme.colors.primary };
      default:
        return { bg: Theme.colors.primary, text: '#FFFFFF' };
    }
  };

  const vStyles = getVariantStyles();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: vStyles.bg },
        vStyles.border && { borderWidth: 1, borderColor: vStyles.border },
        (disabled || isLoading) && styles.disabled,
        style
      ]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={vStyles.text} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[styles.text, { color: vStyles.text }, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: Theme.borderRadius.md,
    gap: Theme.spacing.sm,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
  }
});
