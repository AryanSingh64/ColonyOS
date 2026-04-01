import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { typography, colors } from '../theme';

export interface TextProps extends RNTextProps {
  variant?: keyof typeof typography.size;
  weight?: keyof typeof typography.fontFamily;
  color?: string;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
}

export function Text({
  variant = 'base',
  weight = 'regular',
  color = colors.neutral[900],
  align = 'left',
  style,
  ...props
}: TextProps) {
  return (
    <RNText
      style={[
        {
          fontSize: typography.size[variant],
          fontFamily: typography.fontFamily[weight],
          color,
          textAlign: align,
        },
        style,
      ]}
      {...props}
    />
  );
}

// Pre-configured Heading component
export function Heading({ variant = 'xl', weight = 'bold', ...props }: TextProps) {
  return <Text variant={variant} weight={weight} {...props} />;
}
