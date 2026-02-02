import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
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
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        // Entrance animation
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 500,
                delay: 300,
                easing: Easing.out(Easing.back(1.5)),
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                damping: 15,
                stiffness: 150,
                delay: 300,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [60, 0],
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
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
        backgroundColor: 'rgba(20, 20, 20, 0.85)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        ...theme.shadows.glass,
    },
    selector: {
        flexDirection: 'row',
        padding: 5,
    },
    tab: {
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: theme.borderRadius.full,
    },
    activeTab: {
        backgroundColor: '#FFFFFF',
    },
    tabText: {
        fontSize: theme.fontSize.sm,
        color: 'rgba(255, 255, 255, 0.5)',
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    activeTabText: {
        color: '#000000',
        fontWeight: '700',
    },
});

export default ViewSelector;
