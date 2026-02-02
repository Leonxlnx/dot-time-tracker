import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme, DotColorPreset } from '../theme';

interface ColorPickerProps {
    currentColor: DotColorPreset;
    onColorChange: (preset: DotColorPreset) => void;
}

const colorOptions: { preset: DotColorPreset; name: string; color: string }[] = [
    { preset: 'gold', name: 'Gold', color: '#C9A962' },
    { preset: 'silver', name: 'Silver', color: '#A0A0A0' },
    { preset: 'white', name: 'White', color: '#FFFFFF' },
    { preset: 'blue', name: 'Blue', color: '#5B9BD5' },
    { preset: 'green', name: 'Green', color: '#6ABF69' },
    { preset: 'rose', name: 'Rose', color: '#D4767C' },
    { preset: 'lavender', name: 'Lavender', color: '#9D8EC9' },
    { preset: 'coral', name: 'Coral', color: '#E07B53' },
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
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 4,
    },
    colorOption: {
        alignItems: 'center',
        paddingVertical: 8,
        width: '25%',
    },
    colorCircleContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 6,
        width: 44,
        height: 44,
    },
    colorCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    selectedCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
    },
    selectedRing: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        opacity: 0.5,
    },
    colorName: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.3)',
        fontWeight: '500',
    },
    selectedName: {
        color: 'rgba(255,255,255,0.7)',
    },
});

export default ColorPicker;
