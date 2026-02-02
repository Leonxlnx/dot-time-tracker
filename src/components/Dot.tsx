import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { theme } from '../theme';
import { DotCell } from '../utils/timeUtils';

interface DotProps {
    cell: DotCell;
    size: number;
}

const Dot: React.FC<DotProps> = ({ cell, size }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            delay: cell.index * 0.5, // Staggered fade in
            useNativeDriver: true,
        }).start();
    }, []);

    // Dynamic Styles
    let backgroundColor = theme.colors.dotEmpty;
    let shadowStyle = {};

    if (cell.isPassed) {
        backgroundColor = theme.colors.dotPassed;
    }

    if (cell.isToday) {
        backgroundColor = theme.colors.dotToday;
        shadowStyle = theme.shadows.glow;
    }

    return (
        <Animated.View
            style={[
                styles.dot,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor,
                    opacity,
                },
                shadowStyle,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    dot: {
        margin: 3, // slightly more spacing
    },
});

export default Dot;
