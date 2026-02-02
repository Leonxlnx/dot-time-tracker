import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { theme, DotColorPreset } from '../theme';
import { DotCell } from '../utils/timeUtils';

interface DotProps {
  cell: DotCell;
  size: number;
  gap: number;
  colorPreset?: DotColorPreset;
}

const Dot: React.FC<DotProps> = ({ cell, size, gap, colorPreset = 'default' }) => {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const colors = theme.colors.dotPresets[colorPreset];

  useEffect(() => {
    const delay = Math.min(cell.index * 8, 400);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 16,
        stiffness: 220,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [cell.index]);

  const isToday = cell.isToday;
  const isPassed = cell.isPassed;

  // Simple solid color for all dots - no special effects
  let dotColor: string;
  if (isToday) {
    dotColor = colors.today;
  } else if (isPassed) {
    dotColor = colors.passed;
  } else {
    dotColor = colors.empty;
  }

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: dotColor,
          marginRight: gap,
          marginBottom: gap,
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    // Simple dot, no special effects
  },
});

export default React.memo(Dot);
