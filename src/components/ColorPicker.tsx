import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme, DotColorPreset } from '../theme';

interface ColorPickerProps {
    currentColor: DotColorPreset;
    onColorChange: (preset: DotColorPreset) => void;
}

const colorOptions: { preset: DotColorPreset; name: string; colors: string[] }[] = [
    { preset: 'default', name: 'Gold', colors: ['#FFE082', '#D4AF37', '#A67C00'] },
    { preset: 'ocean', name: 'Ocean', colors: ['#80D8FF', '#40C4FF', '#0288D1'] },
    { preset: 'mint', name: 'Mint', colors: ['#A7FFEB', '#64FFDA', '#00BFA5'] },
    { preset: 'rose', name: 'Rose', colors: ['#FF8A80', '#FF5252', '#D32F2F'] },
    { preset: 'purple', name: 'Violet', colors: ['#EA80FC', '#E040FB', '#9C27B0'] },
];

const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onColorChange }) => {
    return (
        <View style={styles.container}>
            {colorOptions.map((option) => {
                const isSelected = currentColor === option.preset;
                return (
                    <TouchableOpacity
                        key={option.preset}
                        style={[
                            styles.colorOption,
                            isSelected && styles.selectedOption,
                        ]}
                        activeOpacity={0.7}
                        onPress={() => onColorChange(option.preset)}
                    >
                        <View style={styles.colorCircleContainer}>
                            <LinearGradient
                                colors={option.colors as [string, string, ...string[]]}
                                start={{ x: 0.3, y: 0 }}
                                end={{ x: 0.7, y: 1 }}
                                style={styles.colorCircle}
                            >
                                {/* Highlight effect */}
                                <View style={styles.highlight} />
                            </LinearGradient>
                            {isSelected && <View style={styles.glowRing} />}
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
        paddingTop: theme.spacing.sm,
    },
    colorOption: {
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 4,
        borderRadius: 12,
        flex: 1,
    },
    selectedOption: {
        // Selected styling handled by glow
    },
    colorCircleContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.sm,
    },
    colorCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    highlight: {
        position: 'absolute',
        top: 6,
        left: 8,
        width: 14,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.45)',
    },
    glowRing: {
        position: 'absolute',
        width: 52,
        height: 52,
        borderRadius: 26,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.25)',
    },
    colorName: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '500',
        letterSpacing: 0.2,
    },
    selectedName: {
        color: 'rgba(255,255,255,0.8)',
    },
});

export default ColorPicker;
