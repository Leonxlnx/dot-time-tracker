import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { theme } from '../theme';
import { ViewType } from '../utils/timeUtils';
import { BlurView } from 'expo-blur';

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
    return (
        <View style={styles.container}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: theme.spacing.xl,
        left: theme.spacing.xl,
        right: theme.spacing.xl,
        alignItems: 'center',
    },
    glassContainer: {
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
        backgroundColor: theme.colors.surfaceGlass,
        borderWidth: 1,
        borderColor: theme.colors.border,
        ...theme.shadows.glass,
    },
    selector: {
        flexDirection: 'row',
        padding: 6,
    },
    tab: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: theme.borderRadius.full,
    },
    activeTab: {
        backgroundColor: theme.colors.text, // White pill
    },
    tabText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        fontWeight: '600',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    activeTabText: {
        color: theme.colors.background, // Black text on white pill
        fontWeight: '700',
    },
});

export default ViewSelector;
