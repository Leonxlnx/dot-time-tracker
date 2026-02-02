import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme, DotColorPreset } from '../theme';

interface ColorPickerProps {
    currentColor: DotColorPreset;
    onColorChange: (color: DotColorPreset) => void;
}

const colorOptions: { key: DotColorPreset; label: string }[] = [
    { key: 'default', label: 'Gold' },
    { key: 'ocean', label: 'Ocean' },
    { key: 'mint', label: 'Mint' },
    { key: 'rose', label: 'Rose' },
    { key: 'purple', label: 'Purple' },
];

const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onColorChange }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Color Theme</Text>
            <View style={styles.options}>
                {colorOptions.map((option) => {
                    const isActive = currentColor === option.key;
                    const previewColor = theme.colors.dotPresets[option.key].today;

                    return (
                        <TouchableOpacity
                            key={option.key}
                            style={[
                                styles.option,
                                isActive && styles.activeOption,
                            ]}
                            onPress={() => onColorChange(option.key)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.colorDot, { backgroundColor: previewColor }]} />
                            <Text style={[styles.optionText, isActive && styles.activeText]}>
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
    },
    label: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: theme.spacing.md,
    },
    options: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.surfaceGlass,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeOption: {
        borderColor: theme.colors.text,
        backgroundColor: theme.colors.surfaceHover,
    },
    colorDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: theme.spacing.xs,
    },
    optionText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    activeText: {
        color: theme.colors.text,
        fontWeight: '600',
    },
});

export default ColorPicker;
