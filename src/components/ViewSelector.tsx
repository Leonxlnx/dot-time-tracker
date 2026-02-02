import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange }) => {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 600,
                delay: 400,
                easing: Easing.out(Easing.back(1.3)),
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                damping: 12,
                stiffness: 120,
                delay: 400,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [80, 0],
    });

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    opacity: slideAnim,
                    transform: [{ translateY }, { scale: scaleAnim }],
                }
            ]}
        >
            <View style={styles.glassContainer}>
                {/* Liquid glass background */}
                <LinearGradient
                    colors={['rgba(40,40,40,0.9)', 'rgba(20,20,20,0.85)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.glassGradient}
                />
                {/* Top highlight */}
                <View style={styles.topHighlight} />

                <View style={styles.selector}>
                    {views.map((view) => {
                        const isActive = currentView === view.type;
                        return (
                            <TouchableOpacity
                                key={view.type}
                                style={[styles.tab, isActive && styles.activeTab]}
                                onPress={() => onViewChange(view.type)}
                                activeOpacity={0.8}
                            >
                                {isActive && (
                                    <LinearGradient
                                        colors={['rgba(255,255,255,1)', 'rgba(240,240,240,1)']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 0, y: 1 }}
                                        style={styles.activeTabGradient}
                                    />
                                )}
                                <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                    {view.label}
                                </Text>
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
        left: theme.spacing.xl,
        right: theme.spacing.xl,
        alignItems: 'center',
    },
    glassContainer: {
        borderRadius: 28,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.5,
        shadowRadius: 24,
        elevation: 12,
    },
    glassGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    topHighlight: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    selector: {
        flexDirection: 'row',
        padding: 6,
    },
    tab: {
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 22,
        overflow: 'hidden',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeTab: {
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    activeTabGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 22,
    },
    tabText: {
        fontSize: theme.fontSize.sm,
        color: 'rgba(255, 255, 255, 0.45)',
        fontWeight: '600',
        letterSpacing: 0.3,
        zIndex: 1,
    },
    activeTabText: {
        color: '#000000',
        fontWeight: '700',
    },
});

export default ViewSelector;
