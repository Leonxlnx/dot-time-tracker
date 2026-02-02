import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { theme } from '../theme';
import { FontPreset } from '../utils/storage';

interface FontPickerProps {
    currentFont: FontPreset;
    onFontChange: (font: FontPreset) => void;
}

const fonts: { preset: FontPreset; name: string; preview: string; fontFamily: string }[] = [
    { preset: 'system', name: 'System', preview: 'Aa', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' },
    { preset: 'inter', name: 'Inter', preview: 'Aa', fontFamily: 'Inter' },
    { preset: 'roboto', name: 'Roboto', preview: 'Aa', fontFamily: 'Roboto' },
    { preset: 'outfit', name: 'Outfit', preview: 'Aa', fontFamily: 'Outfit' },
    { preset: 'space', name: 'Space', preview: 'Aa', fontFamily: 'SpaceGrotesk' },
];

export const getFontFamily = (preset: FontPreset): string => {
    const font = fonts.find(f => f.preset === preset);
    return font?.fontFamily || (Platform.OS === 'ios' ? 'System' : 'sans-serif');
};

const FontPicker: React.FC<FontPickerProps> = ({ currentFont, onFontChange }) => {
    return (
        <View style={styles.container}>
            {fonts.map((font) => {
                const isSelected = currentFont === font.preset;
                return (
                    <TouchableOpacity
                        key={font.preset}
                        style={[styles.fontOption, isSelected && styles.selectedOption]}
                        activeOpacity={0.7}
                        onPress={() => onFontChange(font.preset)}
                    >
                        <View style={[styles.preview, isSelected && styles.selectedPreview]}>
                            <Text style={[styles.previewText, { fontFamily: font.fontFamily }]}>
                                {font.preview}
                            </Text>
                        </View>
                        <Text style={[styles.fontName, isSelected && styles.selectedName]}>
                            {font.name}
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
    },
    fontOption: {
        alignItems: 'center',
        flex: 1,
    },
    selectedOption: {
        // Selected state
    },
    preview: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedPreview: {
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    previewText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: '400',
    },
    fontName: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.3)',
        marginTop: 6,
        fontWeight: '500',
    },
    selectedName: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
});

export default FontPicker;
