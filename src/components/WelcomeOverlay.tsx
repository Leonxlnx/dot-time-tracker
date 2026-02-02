import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { theme } from '../theme';
import Confetti from './Confetti';

interface WelcomeOverlayProps {
    visible: boolean;
    onComplete: () => void;
}

const MESSAGES = [
    "Welcome back ✨",
    "Your time matters 💫",
    "Make today count ⭐",
    "Keep going 🚀",
    "You've got this 💪",
    "Stay focused 🎯",
    "Every day is a gift 🎁",
    "Carpe diem ☀️",
];

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const WelcomeOverlay: React.FC<WelcomeOverlayProps> = ({ visible, onComplete }) => {
    const overlayOpacity = useRef(new Animated.Value(1)).current;
    const messageOpacity = useRef(new Animated.Value(0)).current;
    const messageScale = useRef(new Animated.Value(0.8)).current;
    const [showConfetti, setShowConfetti] = useState(true);

    const message = useRef(MESSAGES[Math.floor(Math.random() * MESSAGES.length)]).current;

    useEffect(() => {
        if (!visible) return;

        // Animate message in
        Animated.parallel([
            Animated.timing(messageOpacity, {
                toValue: 1,
                duration: 400,
                delay: 300,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.spring(messageScale, {
                toValue: 1,
                damping: 15,
                stiffness: 150,
                delay: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto-dismiss after delay
        const timeout = setTimeout(() => {
            Animated.parallel([
                Animated.timing(overlayOpacity, {
                    toValue: 0,
                    duration: 400,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(messageOpacity, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]).start(() => {
                onComplete();
            });
        }, 2500);

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
            {showConfetti && (
                <Confetti
                    onComplete={() => setShowConfetti(false)}
                    duration={2500}
                />
            )}

            <Animated.View
                style={[
                    styles.messageContainer,
                    {
                        opacity: messageOpacity,
                        transform: [{ scale: messageScale }],
                    }
                ]}
            >
                <Text style={styles.message}>{message}</Text>
            </Animated.View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    messageContainer: {
        paddingHorizontal: theme.spacing.xxl,
    },
    message: {
        fontSize: 28,
        fontWeight: '300',
        color: '#FFFFFF',
        textAlign: 'center',
        letterSpacing: 0.5,
    },
});

export default WelcomeOverlay;
