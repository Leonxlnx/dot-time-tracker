import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { theme, DotColorPreset } from '../theme';
import { DotCell } from '../utils/timeUtils';

interface DotProps {
    cell: DotCell;
    size: number;
    gap: number;
    colorPreset?: DotColorPreset;
}

const Dot: React.FC<DotProps> = ({ cell, size, gap, colorPreset = 'default' }) => {
    const scale = useRef(new Animated.Value(0.3)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const colors = theme.colors.dotPresets[colorPreset];

    useEffect(() => {
        // Staggered entrance with smooth spring
        const delay = Math.min(cell.index * 12, 600);

        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                damping: 12,
                stiffness: 180,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                delay,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, [cell.index]);

    // Color logic
    let backgroundColor = colors.empty;
    let shadowStyle = {};

    if (cell.isPassed) {
        backgroundColor = colors.passed;
    }

    if (cell.isToday) {
        backgroundColor = colors.today;
        shadowStyle = {
            shadowColor: colors.today,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.7,
            shadowRadius: size * 0.6,
            elevation: 8,
        };
    }

    return (
        <Animated.View
            style={[
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor,
                    marginRight: gap,
                    marginBottom: gap,
                    opacity,
                    transform: [{ scale }],
                },
                shadowStyle,
            ]}
        />
    );
};

export default React.memo(Dot);
