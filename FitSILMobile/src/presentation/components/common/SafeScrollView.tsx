// src/presentation/components/common/SafeScrollView.tsx
import React from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';

interface SafeScrollViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  showsVerticalScrollIndicator?: boolean;
}

export const SafeScrollView: React.FC<SafeScrollViewProps> = ({
  children,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
}) => {
  return (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100, // ✅ Espacio para el Tab Bar
  },
});