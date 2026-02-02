import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { theme } from '../theme';
import { FontPreset } from '../utils/storage';

interface FontPickerProps {
    currentFont: FontPreset;
    onFontChange: (font: FontPreset) => void;
}

// 5 completely distinct fonts with very different styles
const fonts: { preset: FontPreset; name: string; preview: string; fontFamily: string; style: 'serif' | 'sans' | 'mono' | 'display' | 'handwriting' }[] = [
    {
        preset: 'system',
        name: 'System',
        preview: 'Aa',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
        style: 'sans'
    },
    {
        preset: 'inter',
        name: 'Serif',
        preview: 'Aa',
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        style: 'serif'
    },
    {
        preset: 'roboto',
        name: 'Mono',
        preview: 'Aa',
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        style: 'mono'
    },
    {
        preset: 'outfit',
        name: 'Round',
        preview: 'Aa',
        fontFamily: Platform.OS === 'ios' ? 'Avenir-Light' : 'sans-serif-light',
        style: 'display'
    },
    {
        preset: 'space',
        name: 'Thin',
        preview: 'Aa',
        fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-UltraLight' : 'sans-serif-thin',
        style: 'display'
    },
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
                            <Text style={[
                                styles.previewText,
                                { fontFamily: font.fontFamily },
                                font.style === 'mono' && styles.monoText,
                                font.style === 'serif' && styles.serifText,
                            ]}>
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
    monoText: {
        fontSize: 16,
        letterSpacing: -1,
    },
    serifText: {
        fontStyle: 'italic',
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
