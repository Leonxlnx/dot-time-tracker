import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { theme, DotColorPreset } from '../theme';
import { DotCell } from '../utils/timeUtils';

interface DotProps {
  cell: DotCell;
  size: number;
  gap: number;
  colorPreset?: DotColorPreset;
}

const Dot: React.FC<DotProps> = ({ cell, size, gap, colorPreset = 'default' }) => {
  const scale = useRef(new Animated.Value(0.6)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const colors = theme.colors.dotPresets[colorPreset];

  useEffect(() => {
    const delay = Math.min(cell.index * 6, 350);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 20,
        stiffness: 250,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [cell.index]);

  const isToday = cell.isToday;
  const isPassed = cell.isPassed;

  // Premium minimal design - clean circles with subtle depth
  let dotColor: string;
  let shadowStyle = {};

  if (isToday) {
    dotColor = colors.today;
    // Subtle glow for today
    shadowStyle = {
      shadowColor: colors.today,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.4,
      shadowRadius: size * 0.3,
      elevation: 3,
    };
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
          ...shadowStyle,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dot: {
    // Clean minimal dot
  },
});

export default React.memo(Dot);
