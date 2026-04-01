import React from 'react';
import { View, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import { components, colors, categoryConfig, CategoryKey } from '../theme';
import { Text } from './Text';

interface BadgeProps {
  label: string;
}

// The core "Flat Identity" badge (e.g. "B-204")
export function FlatBadge({ label }: BadgeProps) {
  return (
    <View style={components.flatBadge}>
      <Text variant="sm" weight="semibold" color={colors.neutral[800]}>
        {label}
      </Text>
    </View>
  );
}

// Category filter chip
export interface CategoryChipProps extends TouchableOpacityProps {
  category: CategoryKey;
  isActive?: boolean;
}

export function CategoryChip({ category, isActive = false, style, ...props }: CategoryChipProps) {
  const config = categoryConfig[category];
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        components.categoryChip,
        isActive 
          ? { backgroundColor: config.color }
          : { backgroundColor: colors.neutral[150] },
        style,
      ]}
      {...props}
    >
      <Text 
        variant="sm" 
        weight="semibold" 
        color={isActive ? colors.neutral[0] : colors.neutral[600]}
      >
        {config.emoji} {config.label}
      </Text>
    </TouchableOpacity>
  );
}

// Countdown timer badge used on Alerts
export function CountdownBadge({ label }: BadgeProps) {
  return (
    <View style={components.countdownBadge}>
      <Text variant="xs" weight="medium" color={colors.category.alert}>
        {label}
      </Text>
    </View>
  );
}
