import React, { useEffect, useRef, useMemo } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Easing,
    Dimensions,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

interface OnboardingScreenProps {
    onComplete: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const DOT_COUNT = 35;

interface DotData {
    x: number;
    y: number;
    size: number;
    opacity: number;
    delay: number;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const titleTranslate = useRef(new Animated.Value(40)).current;
    const subtitleTranslate = useRef(new Animated.Value(40)).current;
    const buttonScale = useRef(new Animated.Value(0)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;
    const dotsOpacity = useRef(new Animated.Value(0)).current;
    const glowScale = useRef(new Animated.Value(0.8)).current;
    const glowOpacity = useRef(new Animated.Value(0)).current;

    // Generate random dot positions
    const dots = useMemo<DotData[]>(() => {
        const items: DotData[] = [];
        for (let i = 0; i < DOT_COUNT; i++) {
            items.push({
                x: Math.random() * SCREEN_WIDTH * 0.8 + SCREEN_WIDTH * 0.1,
                y: Math.random() * SCREEN_HEIGHT * 0.4 + SCREEN_HEIGHT * 0.15,
                size: 4 + Math.random() * 6,
                opacity: 0.15 + Math.random() * 0.4,
                delay: Math.random() * 200,
            });
        }
        return items;
    }, []);

    useEffect(() => {
        // Premium staggered entrance
        Animated.parallel([
            // Fade in background
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            // Dots all at once
            Animated.timing(dotsOpacity, {
                toValue: 1,
                duration: 800,
                delay: 200,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            // Center glow
            Animated.parallel([
                Animated.timing(glowOpacity, {
                    toValue: 1,
                    duration: 1000,
                    delay: 100,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.spring(glowScale, {
                    toValue: 1,
                    damping: 15,
                    stiffness: 80,
                    delay: 100,
                    useNativeDriver: true,
                }),
            ]),
            // Title
            Animated.parallel([
                Animated.timing(titleTranslate, {
                    toValue: 0,
                    duration: 700,
                    delay: 400,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]),
            // Subtitle
            Animated.timing(subtitleTranslate, {
                toValue: 0,
                duration: 700,
                delay: 550,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            // Button
            Animated.parallel([
                Animated.spring(buttonScale, {
                    toValue: 1,
                    damping: 14,
                    stiffness: 160,
                    delay: 700,
                    useNativeDriver: true,
                }),
                Animated.timing(buttonOpacity, {
                    toValue: 1,
                    duration: 400,
                    delay: 700,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const handleStart = () => {
        // Exit animation
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 300,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start(() => {
            onComplete();
        });
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* Premium gradient background */}
            <LinearGradient
                colors={['#0a0a0f', '#0f1015', '#0a0a0f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
            />

            {/* Subtle center glow */}
            <Animated.View
                style={[
                    styles.glow,
                    {
                        opacity: glowOpacity,
                        transform: [{ scale: glowScale }],
                    }
                ]}
            />

            {/* White dots - all at once */}
            <Animated.View style={[styles.dotsContainer, { opacity: dotsOpacity }]}>
                {dots.map((dot, index) => (
                    <View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                left: dot.x,
                                top: dot.y,
                                width: dot.size,
                                height: dot.size,
                                opacity: dot.opacity,
                            },
                        ]}
                    />
                ))}
            </Animated.View>

            {/* Content */}
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Animated.Text
                        style={[
                            styles.title,
                            { transform: [{ translateY: titleTranslate }] }
                        ]}
                    >
                        DotTime
                    </Animated.Text>

                    <Animated.Text
                        style={[
                            styles.subtitle,
                            { transform: [{ translateY: subtitleTranslate }] }
                        ]}
                    >
                        Visualize your time.{'\n'}Make every day count.
                    </Animated.Text>
                </View>

                <Animated.View
                    style={[
                        styles.buttonContainer,
                        {
                            opacity: buttonOpacity,
                            transform: [{ scale: buttonScale }],
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.8}
                        onPress={handleStart}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    glow: {
        position: 'absolute',
        top: SCREEN_HEIGHT * 0.15,
        left: SCREEN_WIDTH * 0.5 - SCREEN_WIDTH * 0.4,
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_WIDTH * 0.8,
        borderRadius: SCREEN_WIDTH * 0.4,
        backgroundColor: 'rgba(255, 255, 255, 0.015)',
    },
    dotsContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    dot: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
        borderRadius: 50,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingTop: SCREEN_HEIGHT * 0.55,
        paddingBottom: Platform.OS === 'ios' ? 60 : 40,
        paddingHorizontal: theme.spacing.xl,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 42,
        fontWeight: '200',
        color: '#FFFFFF',
        letterSpacing: 2,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 17,
        fontWeight: '300',
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center',
        lineHeight: 26,
        letterSpacing: 0.5,
    },
    buttonContainer: {
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        paddingVertical: 18,
        paddingHorizontal: 48,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
});

export default OnboardingScreen;
