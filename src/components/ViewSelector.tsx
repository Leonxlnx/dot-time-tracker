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

const TAB_WIDTH = 80;

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange }) => {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const indicatorPosition = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: 1,
            damping: 14,
            stiffness: 150,
            delay: 200,
            useNativeDriver: true,
        }).start();
    }, []);

    // Smooth indicator animation when view changes
    useEffect(() => {
        const index = views.findIndex(v => v.type === currentView);
        Animated.spring(indicatorPosition, {
            toValue: index * TAB_WIDTH,
            damping: 18,
            stiffness: 180,
            useNativeDriver: true,
        }).start();
    }, [currentView]);

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
                    transform: [{ translateY }],
                }
            ]}
        >
            <View style={styles.selector}>
                {/* Animated sliding indicator */}
                <Animated.View
                    style={[
                        styles.indicator,
                        { transform: [{ translateX: indicatorPosition }] }
                    ]}
                />

                {views.map((view) => {
                    const isActive = currentView === view.type;
                    return (
                        <TouchableOpacity
                            key={view.type}
                            style={styles.tab}
                            onPress={() => onViewChange(view.type)}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                {view.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
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
    selector: {
        flexDirection: 'row',
        backgroundColor: 'rgba(30, 30, 30, 0.9)',
        borderRadius: 28,
        padding: 6,
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    indicator: {
        position: 'absolute',
        width: TAB_WIDTH - 4,
        height: 44,
        backgroundColor: '#FFFFFF',
        borderRadius: 22,
        top: 6,
        left: 8,
        shadowColor: '#FFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    tab: {
        width: TAB_WIDTH,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    tabText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.45)',
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    activeTabText: {
        color: '#000000',
        fontWeight: '700',
    },
});

export default ViewSelector;
