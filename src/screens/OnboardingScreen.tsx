import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingScreenProps {
    onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const dotScale = useRef(new Animated.Value(0.5)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fast, snappy entrance
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.spring(dotScale, {
                toValue: 1,
                damping: 12,
                stiffness: 200,
                useNativeDriver: true,
            }),
            Animated.timing(buttonOpacity, {
                toValue: 1,
                duration: 400,
                delay: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                {/* Simple Dot */}
                <Animated.View style={[styles.heroContainer, { transform: [{ scale: dotScale }] }]}>
                    <LinearGradient
                        colors={['#FFE082', '#D4AF37', '#A67C00']}
                        start={{ x: 0.3, y: 0 }}
                        end={{ x: 0.7, y: 1 }}
                        style={styles.heroDot}
                    >
                        <View style={styles.dotHighlight} />
                    </LinearGradient>
                </Animated.View>

                {/* Title */}
                <Text style={styles.title}>DotTime</Text>
                <Text style={styles.subtitle}>visualize your time</Text>

                {/* Simple dots grid preview */}
                <View style={styles.dotsPreview}>
                    {[...Array(21)].map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.previewDot,
                                i < 12 && styles.previewDotFilled,
                                i === 12 && styles.previewDotToday,
                            ]}
                        />
                    ))}
                </View>
            </Animated.View>

            {/* Get Started */}
            <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
                <TouchableOpacity style={styles.button} activeOpacity={0.85} onPress={onComplete}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    heroContainer: {
        marginBottom: theme.spacing.xxl,
    },
    heroDot: {
        width: 64,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
    },
    dotHighlight: {
        position: 'absolute',
        top: 10,
        left: 14,
        width: 18,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    title: {
        fontSize: 42,
        fontWeight: '200',
        color: '#FFFFFF',
        letterSpacing: -1.5,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.35)',
        letterSpacing: 0.3,
        marginBottom: theme.spacing.xxl,
    },
    dotsPreview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 140,
        justifyContent: 'center',
        gap: 6,
    },
    previewDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    previewDotFilled: {
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    previewDotToday: {
        backgroundColor: '#D4AF37',
    },
    buttonContainer: {
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: theme.spacing.xxxl,
    },
    button: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        borderRadius: 50,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default OnboardingScreen;
