import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View, StyleSheet } from 'react-native';
import { theme, DotColorPreset } from '../theme';
import { DotCell } from '../utils/timeUtils';
import { LinearGradient } from 'expo-linear-gradient';

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
        const delay = Math.min(cell.index * 10, 500);

        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                damping: 14,
                stiffness: 200,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 250,
                delay,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start();
    }, [cell.index]);

    const isToday = cell.isToday;
    const isPassed = cell.isPassed;

    // Liquid glass effect for today
    if (isToday) {
        return (
            <Animated.View
                style={[
                    styles.dotContainer,
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
                <View style={[styles.glassOuter, { borderRadius: size / 2, backgroundColor: colors.today }]}>
                    <LinearGradient
                        colors={['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)', 'rgba(0,0,0,0.1)']}
                        locations={[0, 0.5, 1]}
                        start={{ x: 0.3, y: 0 }}
                        end={{ x: 0.7, y: 1 }}
                        style={[styles.glassGradient, { borderRadius: size / 2 }]}
                    />
                    {/* Highlight */}
                    <View
                        style={[
                            styles.highlight,
                            {
                                width: size * 0.35,
                                height: size * 0.2,
                                top: size * 0.12,
                                left: size * 0.15,
                                borderRadius: size * 0.1,
                            }
                        ]}
                    />
                </View>
                {/* Glow */}
                <View style={[styles.glow, {
                    width: size * 1.4,
                    height: size * 1.4,
                    borderRadius: size * 0.7,
                    backgroundColor: colors.today,
                }]} />
            </Animated.View>
        );
    }

    // Passed dots - subtle glass
    if (isPassed) {
        return (
            <Animated.View
                style={[
                    styles.dotContainer,
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
                <View style={[styles.passedDot, { borderRadius: size / 2, backgroundColor: colors.passed }]}>
                    <LinearGradient
                        colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)', 'rgba(0,0,0,0.05)']}
                        locations={[0, 0.4, 1]}
                        start={{ x: 0.2, y: 0 }}
                        end={{ x: 0.8, y: 1 }}
                        style={[styles.glassGradient, { borderRadius: size / 2 }]}
                    />
                </View>
            </Animated.View>
        );
    }

    // Future dots - empty glass
    return (
        <Animated.View
            style={[
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: colors.empty,
                    marginRight: gap,
                    marginBottom: gap,
                    opacity,
                    transform: [{ scale }],
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.04)',
                },
            ]}
        />
    );
};

const styles = StyleSheet.create({
    dotContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    glassOuter: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
    },
    glassGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    highlight: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    glow: {
        position: 'absolute',
        zIndex: -1,
        opacity: 0.3,
    },
    passedDot: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
});

export default React.memo(Dot);
