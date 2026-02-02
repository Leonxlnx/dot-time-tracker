import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';
import Confetti from './Confetti';

interface WelcomeOverlayProps {
    visible: boolean;
    onComplete: () => void;
}

const MESSAGES = [
    "Welcome back",
    "Your time matters",
    "Make today count",
    "Keep going",
    "You've got this",
    "Stay focused",
    "Every day is a gift",
    "Carpe diem",
    "Seize the moment",
    "Time is precious",
];

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ visible, onComplete }) => {
    const overlayOpacity = useRef(new Animated.Value(1)).current;
    const messageOpacity = useRef(new Animated.Value(0)).current;
    const messageTranslate = useRef(new Animated.Value(30)).current;
    const glowOpacity = useRef(new Animated.Value(0)).current;
    const [showConfetti, setShowConfetti] = useState(true);

    const message = useRef(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]).current;

    useEffect(() => {
        if (!visible) return;

        // Premium entrance animation
        Animated.sequence([
            Animated.delay(400),
            Animated.parallel([
                // Message fade in with slide
                Animated.timing(messageOpacity, {
                    toValue: 1,
                    duration: 600,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(messageTranslate, {
                    toValue: 0,
                    duration: 700,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                // Subtle glow pulse
                Animated.timing(glowOpacity, {
                    toValue: 0.6,
                    duration: 800,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Auto-dismiss
        const timeout = setTimeout(() => {
            Animated.parallel([
                Animated.timing(overlayOpacity, {
                    toValue: 0,
                    duration: 600,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(messageOpacity, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(glowOpacity, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                onComplete();
            });
        }, 3200);

        return () => clearTimeout(timeout);
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                { opacity: overlayOpacity }
            ]}
            pointerEvents="none"
        >
            {/* Gradient background */}
            <View style={styles.gradientBg} />

            {showConfetti && (
                <Confetti
                    onComplete={() => setShowConfetti(false)}
                    duration={3200}
                />
            )}

            {/* Center glow */}
            <Animated.View
                style={[
                    styles.glow,
                    { opacity: glowOpacity }
                ]}
            />

            {/* Message */}
            <Animated.View
                style={[
                    styles.messageContainer,
                    {
                        opacity: messageOpacity,
                        transform: [{ translateY: messageTranslate }],
                    }
                ]}
            >
                <Text style={styles.message}>{message}</Text>
                <Text style={styles.subMessage}>✨</Text>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    gradientBg: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
    },
    glow: {
        position: 'absolute',
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_WIDTH * 0.8,
        borderRadius: SCREEN_WIDTH * 0.4,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
    },
    messageContainer: {
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xxl,
    },
    message: {
        fontSize: 32,
        fontWeight: '200',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 1,
        lineHeight: 42,
    },
    subMessage: {
        fontSize: 24,
        marginTop: 16,
        opacity: 0.8,
    },
});

export default WelcomeOverlay;
