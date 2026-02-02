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

const Dot: React.FC<DotProps> = ({ cell, size, gap, colorPreset = 'gold' }) => {
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const colors = theme.colors.dotPresets[colorPreset];

  useEffect(() => {
    const delay = Math.min(cell.index * 4, 300);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 18,
        stiffness: 280,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [cell.index]);

  const isToday = cell.isToday;
  const isPassed = cell.isPassed;

  // Today dot: same color as passed + ring
  if (isToday) {
    return (
      <Animated.View
        style={[
          styles.dotWrapper,
          {
            width: size,
            height: size,
            marginRight: gap,
            marginBottom: gap,
            opacity,
            transform: [{ scale }],
          },
        ]}
      >
        {/* Outer ring */}
        <View
          style={[
            styles.ring,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: colors.accent,
            }
          ]}
        />
        {/* Inner dot - slightly smaller */}
        <View
          style={[
            styles.innerDot,
            {
              width: size * 0.55,
              height: size * 0.55,
              borderRadius: size * 0.275,
              backgroundColor: colors.accent,
            }
          ]}
        />
      </Animated.View>
    );
  }

  // Passed dots: solid accent color
  if (isPassed) {
    return (
      <Animated.View
        style={[
          styles.solidDot,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.passed,
            marginRight: gap,
            marginBottom: gap,
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
    );
  }

  // Future dots: empty/subtle
  return (
    <Animated.View
      style={[
        styles.emptyDot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: colors.empty,
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
  dotWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    borderWidth: 1.5,
  },
  innerDot: {
    position: 'absolute',
  },
  solidDot: {},
  emptyDot: {},
});

export default React.memo(Dot);
