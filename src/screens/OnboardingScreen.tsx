import React, { useEffect, useRef } from 'react';
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
import { SafeAreaView } from 'react-native';
import { theme } from '../theme';

interface OnboardingScreenProps {
    onComplete: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Generate preview dots
const generatePreviewDots = () => {
    const dots = [];
    for (let i = 0; i < 28; i++) {
        dots.push({
            index: i,
            isPassed: i < 2,
            isToday: i === 2,
        });
    }
    return dots;
};

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;
    const dotsOpacity = useRef(new Animated.Value(0)).current;
    const dotsScale = useRef(new Animated.Value(0.9)).current;
    const buttonOpacity = useRef(new Animated.Value(0)).current;
    const buttonSlide = useRef(new Animated.Value(20)).current;

    const previewDots = generatePreviewDots();

    useEffect(() => {
        // Staggered entrance animation
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    damping: 20,
                    stiffness: 150,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(dotsOpacity, {
                    toValue: 1,
                    duration: 350,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.spring(dotsScale, {
                    toValue: 1,
                    damping: 18,
                    stiffness: 180,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(buttonOpacity, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.spring(buttonSlide, {
                    toValue: 0,
                    damping: 20,
                    stiffness: 200,
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
                duration: 200,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(dotsScale, {
                toValue: 1.05,
                duration: 200,
                easing: Easing.in(Easing.cubic),
                useNativeDriver: true,
            }),
        ]).start(() => onComplete());
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                {/* Header */}
                <Animated.View
                    style={[
                        styles.header,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        }
                    ]}
                >
                    <Text style={styles.title}>DotTime</Text>
                    <Text style={styles.subtitle}>Visualize your time</Text>
                </Animated.View>

                {/* Preview Dots */}
                <Animated.View
                    style={[
                        styles.dotsPreview,
                        {
                            opacity: dotsOpacity,
                            transform: [{ scale: dotsScale }],
                        }
                    ]}
                >
                    <View style={styles.dotsGrid}>
                        {previewDots.map((dot, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    dot.isPassed && styles.dotPassed,
                                    dot.isToday && styles.dotToday,
                                ]}
                            >
                                {dot.isToday && <View style={styles.dotTodayInner} />}
                            </View>
                        ))}
                    </View>
                    <Text style={styles.dotsCaption}>Each dot is a day</Text>
                </Animated.View>

                {/* Button */}
                <Animated.View
                    style={[
                        styles.buttonContainer,
                        {
                            opacity: buttonOpacity,
                            transform: [{ translateY: buttonSlide }],
                        }
                    ]}
                >
                    <TouchableOpacity
                        style={styles.startButton}
                        activeOpacity={0.8}
                        onPress={handleStart}
                    >
                        <Text style={styles.startButtonText}>Get Started</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </SafeAreaView>
    );
};

const DOT_SIZE = 28;
const DOT_GAP = 10;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xxxl,
    },
    title: {
        fontSize: 44,
        fontWeight: '200',
        color: '#FFFFFF',
        letterSpacing: -1,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: 8,
        letterSpacing: 0.3,
    },
    dotsPreview: {
        alignItems: 'center',
        marginBottom: theme.spacing.xxxl,
    },
    dotsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: (DOT_SIZE + DOT_GAP) * 7,
        justifyContent: 'flex-start',
    },
    dot: {
        width: DOT_SIZE,
        height: DOT_SIZE,
        borderRadius: DOT_SIZE / 2,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        marginRight: DOT_GAP,
        marginBottom: DOT_GAP,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotPassed: {
        backgroundColor: '#C9A962',
    },
    dotToday: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#C9A962',
    },
    dotTodayInner: {
        width: DOT_SIZE * 0.5,
        height: DOT_SIZE * 0.5,
        borderRadius: DOT_SIZE * 0.25,
        backgroundColor: '#C9A962',
    },
    dotsCaption: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.35)',
        marginTop: theme.spacing.lg,
        letterSpacing: 0.2,
    },
    buttonContainer: {
        width: '100%',
        paddingHorizontal: theme.spacing.lg,
    },
    startButton: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        letterSpacing: 0.2,
    },
});

export default OnboardingScreen;
