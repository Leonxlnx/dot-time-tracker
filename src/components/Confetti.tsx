import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';

interface ConfettiProps {
    onComplete?: () => void;
    duration?: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Premium color palette - soft pastels
const COLORS = [
    '#FFD4E5', // soft pink
    '#D4F1F9', // soft cyan
    '#E8D4FF', // soft lavender
    '#FFF4D4', // soft gold
    '#D4FFE8', // soft mint
    '#FFE4D4', // soft peach
    '#FFFFFF', // white
    '#F0F0F0', // light gray
];

interface Particle {
    x: Animated.Value;
    y: Animated.Value;
    rotate: Animated.Value;
    scale: Animated.Value;
    opacity: Animated.Value;
    color: string;
    size: number;
    shape: 'circle' | 'square' | 'star';
    initialX: number;
}

const Confetti: React.FC<ConfettiProps> = ({ onComplete, duration = 3000 }) => {
    const particles = useMemo(() => {
        const items: Particle[] = [];
        const count = 60; // More particles for premium feel

        for (let i = 0; i < count; i++) {
            const startX = Math.random() * SCREEN_WIDTH;
            const endX = startX + (Math.random() - 0.5) * 200;

            items.push({
                x: new Animated.Value(startX),
                y: new Animated.Value(-50 - Math.random() * 100),
                rotate: new Animated.Value(0),
                scale: new Animated.Value(0),
                opacity: new Animated.Value(0),
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                size: 6 + Math.random() * 8,
                shape: ['circle', 'square', 'star'][Math.floor(Math.random() * 3)] as any,
                initialX: startX,
            });
        }

        return items;
    }, []);

    useEffect(() => {
        const animations = particles.map((particle, index) => {
            const delay = index * 25; // Staggered start
            const fallDuration = 2000 + Math.random() * 1500;

            return Animated.sequence([
                Animated.delay(delay),
                Animated.parallel([
                    // Fall with physics-like curve
                    Animated.timing(particle.y, {
                        toValue: SCREEN_HEIGHT + 100,
                        duration: fallDuration,
                        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
                        useNativeDriver: true,
                    }),
                    // Gentle sway
                    Animated.timing(particle.x, {
                        toValue: particle.initialX + (Math.random() - 0.5) * 150,
                        duration: fallDuration,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    // Rotation
                    Animated.timing(particle.rotate, {
                        toValue: 3 + Math.random() * 4,
                        duration: fallDuration,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    // Scale in
                    Animated.sequence([
                        Animated.spring(particle.scale, {
                            toValue: 1,
                            damping: 12,
                            stiffness: 180,
                            useNativeDriver: true,
                        }),
                    ]),
                    // Opacity
                    Animated.sequence([
                        Animated.timing(particle.opacity, {
                            toValue: 1,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                        Animated.delay(fallDuration - 800),
                        Animated.timing(particle.opacity, {
                            toValue: 0,
                            duration: 600,
                            useNativeDriver: true,
                        }),
                    ]),
                ]),
            ]);
        });

        Animated.parallel(animations).start(() => {
            if (onComplete) onComplete();
        });
    }, []);

    const renderShape = (shape: string, size: number, color: string) => {
        if (shape === 'circle') {
            return (
                <View style={[styles.circle, { width: size, height: size, backgroundColor: color }]} />
            );
        } else if (shape === 'star') {
            return (
                <View style={[styles.star, { borderBottomColor: color }]} />
            );
        } else {
            return (
                <View style={[styles.square, { width: size * 0.8, height: size * 0.8, backgroundColor: color }]} />
            );
        }
    };

    return (
        <View style={styles.container} pointerEvents="none">
            {particles.map((particle, index) => {
                const rotate = particle.rotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.particle,
                            {
                                transform: [
                                    { translateX: particle.x },
                                    { translateY: particle.y },
                                    { rotate },
                                    { scale: particle.scale },
                                ],
                                opacity: particle.opacity,
                            },
                        ]}
                    >
                        {renderShape(particle.shape, particle.size, particle.color)}
                    </Animated.View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
    },
    particle: {
        position: 'absolute',
    },
    circle: {
        borderRadius: 50,
    },
    square: {
        borderRadius: 2,
    },
    star: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 12,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
});

export default Confetti;
