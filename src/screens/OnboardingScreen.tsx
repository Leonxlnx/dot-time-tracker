import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface OnboardingScreenProps {
    onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const dotScale = useRef(new Animated.Value(0)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Staggered entrance animation
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 800,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]),
            Animated.spring(dotScale, {
                toValue: 1,
                damping: 8,
                stiffness: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonOpacity, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return (
        <View style={styles.container}>
            {/* Background gradient */}
            <LinearGradient
                colors={['#000000', '#0A0A0A', '#000000']}
                style={StyleSheet.absoluteFill}
            />

            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    }
                ]}
            >
                {/* Animated Dot */}
                <Animated.View
                    style={[
                        styles.heroContainer,
                        { transform: [{ scale: dotScale }] }
                    ]}
                >
                    <LinearGradient
                        colors={['#FFE082', '#D4AF37', '#A67C00']}
                        start={{ x: 0.3, y: 0 }}
                        end={{ x: 0.7, y: 1 }}
                        style={styles.heroDot}
                    >
                        <View style={styles.dotHighlight} />
                    </LinearGradient>
                    <View style={styles.dotGlow} />
                </Animated.View>

                {/* Title */}
                <Text style={styles.title}>DotTime</Text>
                <Text style={styles.subtitle}>Visualize your time</Text>

                {/* Description */}
                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>
                        Every dot represents a unit of time.{'\n'}
                        Filled dots are time passed.{'\n'}
                        The golden dot is today.
                    </Text>
                </View>

                {/* Features */}
                <View style={styles.features}>
                    <View style={styles.featureRow}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Month · Year · Life views</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Home screen widgets</Text>
                    </View>
                    <View style={styles.featureRow}>
                        <View style={styles.featureDot} />
                        <Text style={styles.featureText}>Multiple color themes</Text>
                    </View>
                </View>
            </Animated.View>

            {/* Get Started Button */}
            <Animated.View style={[styles.buttonContainer, { opacity: buttonOpacity }]}>
                <TouchableOpacity
                    style={styles.button}
                    activeOpacity={0.9}
                    onPress={onComplete}
                >
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
        width: 100,
        height: 100,
        marginBottom: theme.spacing.xxl,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroDot: {
        width: 80,
        height: 80,
        borderRadius: 40,
        position: 'relative',
        overflow: 'hidden',
    },
    dotHighlight: {
        position: 'absolute',
        top: 12,
        left: 16,
        width: 24,
        height: 12,
        borderRadius: 6,
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    dotGlow: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#D4AF37',
        opacity: 0.2,
        zIndex: -1,
    },
    title: {
        fontSize: 48,
        fontWeight: '200',
        color: '#FFFFFF',
        letterSpacing: -2,
        marginBottom: theme.spacing.xs,
    },
    subtitle: {
        fontSize: theme.fontSize.md,
        color: 'rgba(255,255,255,0.4)',
        letterSpacing: 0.5,
        marginBottom: theme.spacing.xxl,
    },
    descriptionContainer: {
        marginBottom: theme.spacing.xxl,
    },
    description: {
        fontSize: theme.fontSize.md,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 26,
    },
    features: {
        alignItems: 'flex-start',
        gap: theme.spacing.md,
    },
    featureRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    featureDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    featureText: {
        fontSize: theme.fontSize.sm,
        color: 'rgba(255,255,255,0.5)',
        letterSpacing: 0.3,
    },
    buttonContainer: {
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: theme.spacing.xxxl,
    },
    button: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 18,
        borderRadius: 50,
        alignItems: 'center',
    },
    buttonText: {
        color: '#000000',
        fontSize: theme.fontSize.md,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
});

export default OnboardingScreen;
