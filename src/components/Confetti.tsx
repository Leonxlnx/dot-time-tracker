import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Easing } from 'react-native';

interface ConfettiProps {
    onComplete?: () => void;
    duration?: number;
    colors?: string[];
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CONFETTI_COUNT = 40;
const PARTICLE_COLORS = [
    '#C9A962', // Gold
    '#FFFFFF', // White
    '#5B9BD5', // Blue
    '#9D8EC9', // Lavender
    '#6ABF69', // Green
];

interface Particle {
    x: Animated.Value;
    y: Animated.Value;
    rotation: Animated.Value;
    scale: Animated.Value;
    opacity: Animated.Value;
    color: string;
    size: number;
    startX: number;
    delay: number;
}

const Confetti: React.FC<ConfettiProps> = ({
    onComplete,
    duration = 3000,
    colors = PARTICLE_COLORS
}) => {
    const particles = useRef<Particle[]>([]);

    // Initialize particles
    if (particles.current.length === 0) {
        for (let i = 0; i < CONFETTI_COUNT; i++) {
            particles.current.push({
                x: new Animated.Value(0),
                y: new Animated.Value(-50),
                rotation: new Animated.Value(0),
                scale: new Animated.Value(0),
                opacity: new Animated.Value(1),
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 4 + Math.random() * 6,
                startX: Math.random() * SCREEN_WIDTH,
                delay: Math.random() * 500,
            });
        }
    }

    useEffect(() => {
        const animations = particles.current.map((particle) => {
            const xOffset = (Math.random() - 0.5) * 150;

            return Animated.parallel([
                // Fall down
                Animated.timing(particle.y, {
                    toValue: SCREEN_HEIGHT + 100,
                    duration: duration + Math.random() * 1000,
                    delay: particle.delay,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                // Horizontal sway
                Animated.timing(particle.x, {
                    toValue: xOffset,
                    duration: duration + Math.random() * 1000,
                    delay: particle.delay,
                    easing: Easing.bezier(0.5, 0, 0.5, 1),
                    useNativeDriver: true,
                }),
                // Rotation
                Animated.timing(particle.rotation, {
                    toValue: Math.random() * 720 - 360,
                    duration: duration + Math.random() * 1000,
                    delay: particle.delay,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                // Scale in
                Animated.sequence([
                    Animated.timing(particle.scale, {
                        toValue: 1,
                        duration: 200,
                        delay: particle.delay,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.timing(particle.scale, {
                        toValue: 0.6,
                        duration: duration - 200,
                        easing: Easing.in(Easing.cubic),
                        useNativeDriver: true,
                    }),
                ]),
                // Fade out
                Animated.timing(particle.opacity, {
                    toValue: 0,
                    duration: duration,
                    delay: particle.delay + duration * 0.6,
                    easing: Easing.in(Easing.quad),
                    useNativeDriver: true,
                }),
            ]);
        });

        Animated.parallel(animations).start(() => {
            if (onComplete) {
                onComplete();
            }
        });
    }, []);

    return (
        <View style={styles.container} pointerEvents="none">
            {particles.current.map((particle, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.particle,
                        {
                            width: particle.size,
                            height: particle.size,
                            borderRadius: particle.size / 2,
                            backgroundColor: particle.color,
                            left: particle.startX,
                            transform: [
                                { translateX: particle.x },
                                { translateY: particle.y },
                                {
                                    rotate: particle.rotation.interpolate({
                                        inputRange: [0, 360],
                                        outputRange: ['0deg', '360deg'],
                                    })
                                },
                                { scale: particle.scale },
                            ],
                            opacity: particle.opacity,
                        },
                    ]}
                />
            ))}
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
        top: 0,
    },
});

export default Confetti;
