import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
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

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_WIDTH = (SCREEN_WIDTH - theme.spacing.xl * 2 - 8) / 3;

const ViewSelector: React.FC<ViewSelectorProps> = ({ currentView, onViewChange }) => {
    const indicatorPosition = useRef(new Animated.Value(getTabIndex(currentView) * TAB_WIDTH)).current;
    const indicatorScale = useRef(new Animated.Value(1)).current;
    const tabScales = useRef(views.map(() => new Animated.Value(1))).current;

    function getTabIndex(view: ViewType): number {
        return views.findIndex(v => v.type === view);
    }

    useEffect(() => {
        const newIndex = getTabIndex(currentView);

        // Smooth spring animation with slight scale bounce
        Animated.parallel([
            Animated.spring(indicatorPosition, {
                toValue: newIndex * TAB_WIDTH,
                damping: 20,
                stiffness: 250,
                mass: 0.8,
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.timing(indicatorScale, {
                    toValue: 0.95,
                    duration: 80,
                    useNativeDriver: true,
                }),
                Animated.spring(indicatorScale, {
                    toValue: 1,
                    damping: 12,
                    stiffness: 200,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, [currentView]);

    const handlePress = (view: ViewType, index: number) => {
        // Subtle press feedback
        Animated.sequence([
            Animated.timing(tabScales[index], {
                toValue: 0.92,
                duration: 60,
                useNativeDriver: true,
            }),
            Animated.spring(tabScales[index], {
                toValue: 1,
                damping: 15,
                stiffness: 300,
                useNativeDriver: true,
            }),
        ]).start();

        onViewChange(view);
    };

    return (
        <View style={styles.wrapper}>
            <BlurView intensity={40} tint="dark" style={styles.container}>
                <View style={styles.innerContainer}>
                    {/* Sliding indicator */}
                    <Animated.View
                        style={[
                            styles.indicator,
                            {
                                transform: [
                                    { translateX: indicatorPosition },
                                    { scaleX: indicatorScale },
                                ],
                            }
                        ]}
                    />

                    {/* Tab buttons */}
                    {views.map((view, index) => {
                        const isActive = currentView === view.type;
                        return (
                            <Animated.View
                                key={view.type}
                                style={[
                                    styles.tabWrapper,
                                    { transform: [{ scale: tabScales[index] }] }
                                ]}
                            >
                                <TouchableOpacity
                                    style={styles.tab}
                                    activeOpacity={0.8}
                                    onPress={() => handlePress(view.type, index)}
                                >
                                    <Text style={[
                                        styles.tabText,
                                        isActive && styles.tabTextActive
                                    ]}>
                                        {view.label}
                                    </Text>
                                </TouchableOpacity>
                            </Animated.View>
                        );
                    })}
                </View>
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 40,
        left: theme.spacing.xl,
        right: theme.spacing.xl,
    },
    container: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    innerContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 20,
        padding: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    indicator: {
        position: 'absolute',
        top: 4,
        left: 4,
        width: TAB_WIDTH,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 16,
    },
    tabWrapper: {
        flex: 1,
    },
    tab: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.4)',
        letterSpacing: 0.5,
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
});

export default ViewSelector;
