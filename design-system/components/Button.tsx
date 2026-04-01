import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, View } from 'react-native';
import { components, colors, spacing, radius } from '../theme';
import { Text } from './Text';

export interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  fullWidth?: boolean;
}

export function Button({
  label,
  variant = 'primary',
  fullWidth = false,
  style,
  ...props
}: ButtonProps) {
  
  // Select the base style from theme component tokens
  const baseStyle = 
    variant === 'primary' ? components.primaryButton :
    variant === 'secondary' ? components.secondaryButton :
    components.ghostButton;

  // Determine text color based on variant
  const textColor = 
    variant === 'primary' ? colors.neutral[900] :
    variant === 'secondary' ? colors.neutral[0] :
    colors.neutral[700];

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        baseStyle,
        styles.center,
        fullWidth && styles.fullWidth,
        style,
      ]}
      {...props}
    >
      <Text weight="bold" variant="md" color={textColor}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
});
