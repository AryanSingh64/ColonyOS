import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet } from 'react-native';
import { components, colors, reactionConfig, ReactionKey, spacing } from '../theme';
import { Text } from './Text';

export interface ReactionProps extends TouchableOpacityProps {
  type: ReactionKey;
  count: number;
  isActive?: boolean;
}

export function ReactionButton({
  type,
  count,
  isActive = false,
  style,
  ...props
}: ReactionProps) {
  const config = reactionConfig[type];

  // Active state styling rules from theme logic
  const activeStyle = isActive
    ? {
        backgroundColor: colors.primary[50],
        borderColor: colors.primary[500],
      }
    : null;

  const textColor = isActive ? colors.primary[700] : colors.neutral[700];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        components.reactionButton,
        activeStyle,
        styles.row,
        style,
      ]}
      {...props}
    >
      <Text variant="base" style={{ marginRight: spacing.xs }}>
        {config.emoji}
      </Text>
      <Text variant="md" weight="medium" color={textColor}>
        {count}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
