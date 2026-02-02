import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme, DotColorPreset } from '../theme';

interface ColorPickerProps {
    currentColor: DotColorPreset;
    onColorChange: (preset: DotColorPreset) => void;
}

const colorOptions: { preset: DotColorPreset; name: string; color: string }[] = [
    { preset: 'default', name: 'Gold', color: '#C9A962' },
    { preset: 'silver', name: 'Silver', color: '#E8E8E8' },
    { preset: 'ocean', name: 'Ocean', color: '#64B5F6' },
    { preset: 'mint', name: 'Mint', color: '#81C784' },
    { preset: 'rose', name: 'Rose', color: '#E57373' },
    { preset: 'purple', name: 'Violet', color: '#B39DDB' },
];

const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onColorChange }) => {
    return (
        <View style={styles.container}>
            {colorOptions.map((option) => {
                const isSelected = currentColor === option.preset;
                return (
                    <TouchableOpacity
                        key={option.preset}
                        style={styles.colorOption}
                        activeOpacity={0.7}
                        onPress={() => onColorChange(option.preset)}
                    >
                        <View style={styles.colorCircleContainer}>
                            <View
                                style={[
                                    styles.colorCircle,
                                    { backgroundColor: option.color },
                                    isSelected && styles.selectedCircle,
                                ]}
                            />
                            {isSelected && (
                                <View
                                    style={[
                                        styles.selectedRing,
                                        { borderColor: option.color }
                                    ]}
                                />
                            )}
                        </View>
                        <Text style={[styles.colorName, isSelected && styles.selectedName]}>
                            {option.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: theme.spacing.xs,
    },
    colorOption: {
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 2,
        flex: 1,
    },
    colorCircleContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.sm,
        width: 48,
        height: 48,
    },
    colorCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    selectedCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    selectedRing: {
        position: 'absolute',
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        opacity: 0.5,
    },
    colorName: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.35)',
        fontWeight: '500',
        letterSpacing: 0.1,
    },
    selectedName: {
        color: 'rgba(255,255,255,0.7)',
    },
});

export default ColorPicker;
