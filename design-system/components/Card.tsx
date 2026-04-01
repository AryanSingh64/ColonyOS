import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { components, colors, categoryConfig, CategoryKey, spacing, radius } from '../theme';
import { Text } from './Text';
import { FlatBadge, CountdownBadge } from './Badge';

export interface PostCardProps extends ViewProps {
  category: CategoryKey;
  flat: string;
  title: string;
  timestamp: string;
  countdown?: string;
  body?: string;
}

export function PostCard({
  category,
  flat,
  title,
  timestamp,
  countdown,
  body,
  style,
  children, // For rendering reactions/comments below
  ...props
}: PostCardProps) {
  const config = categoryConfig[category];

  // Pick the right banner style based on category, otherwise fallback to standard post card
  let cardStyle = components.postCard;
  if (category === 'alert') cardStyle = components.alertBanner;
  if (category === 'notice') cardStyle = components.noticeBanner;

  return (
    <View
      style={[
        cardStyle,
        { borderLeftColor: config.color }, // Dynamic border color
        style,
      ]}
      {...props}
    >
      {/* Header logic */}
      <View style={styles.header}>
        <View style={styles.row}>
          <Text variant="sm" weight="semibold" color={config.color}>
            {config.emoji} {config.label}
          </Text>
          <View style={styles.spacer} />
          {countdown && category === 'alert' && (
            <CountdownBadge label={countdown} />
          )}
        </View>

        <View style={[styles.row, { marginTop: spacing.sm }]}>
          <FlatBadge label={flat} />
          <Text variant="xs" color={colors.neutral[500]} style={{ marginLeft: spacing.sm }}>
            • {timestamp}
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <Text variant="lg" weight="bold" color={colors.neutral[900]} style={styles.title}>
        {title}
      </Text>

      {body && (
        <Text variant="base" color={colors.neutral[700]} style={styles.bodyText}>
          {body}
        </Text>
      )}

      {/* Reactions injection area */}
      {children && <View style={styles.footer}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  title: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  bodyText: {
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: spacing.base,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
