import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../theme';
import { ViewType } from '../utils/timeUtils';

interface ViewSelectorProps {
    currentView: ViewType;
    onViewChange: (view: ViewType) => void;
}

const views: { type: ViewType; label: string }[] = [
    { type: 'month', label: 'Month' },
    { type: 'year', label: 'Year' },
    { type: 'life', label: 'Life' },
];

const TAB_WIDTH = 72;
const TAB_HEIGHT = 38;

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange }) => {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const indicatorPosition = useRef(new Animated.Value(0)).current;
    const indicatorScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 1,
            damping: 18,
            stiffness: 180,
            delay: 150,
            useNativeDriver: true,
        }).start();
    }, []);

    // Smooth liquid indicator animation
    useEffect(() => {
        const index = views.findIndex(v => v.type === currentView);

        // Squish effect during transition
        Animated.sequence([
            Animated.timing(indicatorScale, {
                toValue: 0.92,
                duration: 80,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.spring(indicatorPosition, {
                    toValue: index * TAB_WIDTH,
                    damping: 20,
                    stiffness: 200,
                    useNativeDriver: true,
                }),
                Animated.spring(indicatorScale, {
                    toValue: 1,
                    damping: 15,
                    stiffness: 300,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, [currentView]);

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [50, 0],
    });

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: slideAnim,
                    transform: [{ translateY }],
                }
            ]}
        >
            <View style={styles.outerWrapper}>
                {/* Liquid glass background */}
                <View style={styles.glassBackground}>
                    <View style={styles.glassInner} />
                    {/* Top edge highlight */}
                    <View style={styles.topHighlight} />
                    {/* Bottom shadow line */}
                    <View style={styles.bottomShadow} />
                </View>

                <View style={styles.selector}>
                    {/* Animated sliding indicator - liquid pill */}
                    <Animated.View
                        style={[
                            styles.indicator,
                            {
                                transform: [
                                    { translateX: indicatorPosition },
                                    { scale: indicatorScale },
                                ]
                            }
                        ]}
                    >
                        {/* Inner glow */}
                        <View style={styles.indicatorInner} />
                    </Animated.View>

                    {views.map((view) => {
                        const isActive = currentView === view.type;
                        return (
                            <TouchableOpacity
                                key={view.type}
                                style={styles.tab}
                                onPress={() => onViewChange(view.type)}
                                activeOpacity={0.6}
                            >
                                <Animated.Text
                                    style={[
                                        styles.tabText,
                                        isActive && styles.activeTabText
                                    ]}
                                >
                                    {view.label}
                                </Animated.Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: theme.spacing.xxl,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    outerWrapper: {
        position: 'relative',
        borderRadius: 26,
        overflow: 'hidden',
    },
    glassBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(20, 20, 22, 0.85)',
        borderRadius: 26,
    },
    glassInner: {
        position: 'absolute',
        top: 1,
        left: 1,
        right: 1,
        bottom: 1,
        backgroundColor: 'rgba(30, 30, 32, 0.6)',
        borderRadius: 25,
    },
    topHighlight: {
        position: 'absolute',
        top: 0,
        left: 24,
        right: 24,
        height: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
    },
    bottomShadow: {
        position: 'absolute',
        bottom: 0,
        left: 24,
        right: 24,
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    selector: {
        flexDirection: 'row',
        padding: 5,
        position: 'relative',
    },
    indicator: {
        position: 'absolute',
        width: TAB_WIDTH - 4,
        height: TAB_HEIGHT,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        top: 5,
        left: 7,
        // Soft shadow for depth
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    indicatorInner: {
        position: 'absolute',
        top: 1,
        left: 1,
        right: 1,
        bottom: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 19,
    },
    tab: {
        width: TAB_WIDTH,
        height: TAB_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    tabText: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.4)',
        fontWeight: '600',
        letterSpacing: 0.1,
    },
    activeTabText: {
        color: '#000000',
        fontWeight: '700',
    },
});

export default ViewSelector;
