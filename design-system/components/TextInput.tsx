import React, { useState } from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps, View, StyleSheet } from 'react-native';
import { components, colors, typography, radius } from '../theme';
import { Text } from './Text';

export interface TextInputProps extends RNTextInputProps {
  label?: string;
  error?: string;
}

export function TextInput({
  label,
  error,
  style,
  onFocus,
  onBlur,
  ...props
}: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      {label && (
        <Text variant="sm" weight="semibold" color={colors.neutral[700]} style={styles.label}>
          {label}
        </Text>
      )}
      
      <RNTextInput
        style={[
          components.inputField,
          {
            fontFamily: typography.fontFamily.regular,
            fontSize: typography.size.md,
            color: colors.neutral[900],
            borderColor: error 
              ? colors.category.alert 
              : isFocused 
                ? colors.primary[500] 
                : colors.neutral[200],
          },
          style,
        ]}
        placeholderTextColor={colors.neutral[400]}
        onFocus={(e) => {
          setIsFocused(true);
          onFocus && onFocus(e);
        }}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur && onBlur(e);
        }}
        {...props}
      />
      
      {error && (
        <Text variant="xs" weight="medium" color={colors.category.alert} style={styles.error}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
  },
  error: {
    marginTop: 4,
  },
});
