import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { theme } from '../theme';
import { BackgroundPreset } from '../utils/storage';

interface BackgroundPickerProps {
    currentBackground: BackgroundPreset;
    onBackgroundChange: (preset: BackgroundPreset) => void;
    onUploadPress: () => void;
    customBackgroundUri?: string | null;
}

// Temporarily disable static image loading to fix build
// Will use dynamic loading or asset URIs instead
const backgrounds: { preset: BackgroundPreset; name: string }[] = [
    { preset: 'none', name: 'None' },
    { preset: 'aurora', name: 'Aurora' },
    { preset: 'marble', name: 'Marble' },
    { preset: 'mesh', name: 'Mesh' },
    { preset: 'stars', name: 'Stars' },
    { preset: 'waves', name: 'Waves' },
    { preset: 'gold', name: 'Gold' },
    { preset: 'glass', name: 'Glass' },
];

// Color representations for each background (fallback while images disabled)
const backgroundColors: Record<string, string> = {
    'none': 'transparent',
    'aurora': 'rgba(45, 100, 180, 0.6)',
    'marble': 'rgba(40, 40, 42, 0.8)',
    'mesh': 'rgba(20, 80, 120, 0.6)',
    'stars': 'rgba(5, 5, 20, 0.9)',
    'waves': 'rgba(20, 40, 80, 0.7)',
    'gold': 'rgba(180, 140, 50, 0.5)',
    'glass': 'rgba(100, 100, 130, 0.4)',
};

export const getBackgroundSource = (_preset: BackgroundPreset): any => {
    // Temporarily return null - backgrounds disabled for build
    return null;
};

export const getBackgroundColor = (preset: BackgroundPreset): string => {
    return backgroundColors[preset] || 'transparent';
};

const BackgroundPicker: React.FC<BackgroundPickerProps> = ({
    currentBackground,
    onBackgroundChange,
    onUploadPress,
    customBackgroundUri
}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {backgrounds.map((bg) => {
                    const isSelected = currentBackground === bg.preset;
                    const bgColor = backgroundColors[bg.preset] || 'transparent';
                    return (
                        <TouchableOpacity
                            key={bg.preset}
                            style={[styles.bgOption, isSelected && styles.selectedOption]}
                            activeOpacity={0.7}
                            onPress={() => onBackgroundChange(bg.preset)}
                        >
                            <View style={[styles.preview, isSelected && styles.selectedPreview]}>
                                {bg.preset === 'none' ? (
                                    <View style={styles.nonePreview}>
                                        <Text style={styles.noneText}>∅</Text>
                                    </View>
                                ) : (
                                    <View style={[styles.colorPreview, { backgroundColor: bgColor }]} />
                                )}
                            </View>
                            <Text style={[styles.bgName, isSelected && styles.selectedName]}>
                                {bg.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}

                {/* Custom upload button */}
                <TouchableOpacity
                    style={[
                        styles.bgOption,
                        currentBackground === 'custom' && styles.selectedOption
                    ]}
                    activeOpacity={0.7}
                    onPress={onUploadPress}
                >
                    <View style={[
                        styles.preview,
                        styles.uploadPreview,
                        currentBackground === 'custom' && styles.selectedPreview
                    ]}>
                        {customBackgroundUri ? (
                            <Image source={{ uri: customBackgroundUri }} style={styles.previewImage} />
                        ) : (
                            <Text style={styles.uploadIcon}>+</Text>
                        )}
                    </View>
                    <Text style={[
                        styles.bgName,
                        currentBackground === 'custom' && styles.selectedName
                    ]}>
                        Upload
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: -theme.spacing.xl,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing.xl,
        gap: 12,
    },
    bgOption: {
        alignItems: 'center',
    },
    selectedOption: {
        // Selected state
    },
    preview: {
        width: 56,
        height: 56,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedPreview: {
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    colorPreview: {
        flex: 1,
    },
    nonePreview: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    noneText: {
        fontSize: 20,
        color: 'rgba(255, 255, 255, 0.3)',
    },
    uploadPreview: {
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 1,
    },
    uploadIcon: {
        fontSize: 24,
        color: 'rgba(255, 255, 255, 0.3)',
        fontWeight: '300',
    },
    bgName: {
        fontSize: 10,
        color: 'rgba(255, 255, 255, 0.3)',
        marginTop: 6,
        fontWeight: '500',
    },
    selectedName: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
});

export default BackgroundPicker;
