import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { theme } from '../theme';
import { BackgroundPreset } from '../utils/storage';

interface BackgroundPickerProps {
    currentBackground: BackgroundPreset;
    onBackgroundChange: (preset: BackgroundPreset) => void;
    onUploadPress: () => void;
    customBackgroundUri?: string | null;
    overlayOpacity?: number;
    onOverlayChange?: (opacity: number) => void;
}

// Background color themes - premium subtle colors
const backgrounds: { preset: BackgroundPreset; name: string; color: string }[] = [
    { preset: 'none', name: 'None', color: 'transparent' },
    { preset: 'aurora', name: 'Aurora', color: 'rgba(45, 80, 140, 0.5)' },
    { preset: 'marble', name: 'Marble', color: 'rgba(50, 50, 55, 0.7)' },
    { preset: 'mesh', name: 'Ocean', color: 'rgba(20, 60, 100, 0.5)' },
    { preset: 'stars', name: 'Night', color: 'rgba(10, 10, 30, 0.8)' },
    { preset: 'waves', name: 'Deep', color: 'rgba(25, 40, 70, 0.6)' },
    { preset: 'gold', name: 'Warm', color: 'rgba(120, 90, 40, 0.4)' },
    { preset: 'glass', name: 'Frost', color: 'rgba(80, 80, 100, 0.35)' },
];

export const getBackgroundSource = (_preset: BackgroundPreset): any => {
    return null; // Using color backgrounds
};

export const getBackgroundColor = (preset: BackgroundPreset): string => {
    const bg = backgrounds.find(b => b.preset === preset);
    return bg?.color || 'transparent';
};

const BackgroundPicker: React.FC<BackgroundPickerProps> = ({
    currentBackground,
    onBackgroundChange,
    onUploadPress,
    customBackgroundUri,
    overlayOpacity = 0.4,
    onOverlayChange
}) => {
    return (
        <View style={styles.container}>
            {/* Background options */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {backgrounds.map((bg) => {
                    const isSelected = currentBackground === bg.preset;
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
                                    <View style={[styles.colorPreview, { backgroundColor: bg.color }]} />
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

            {/* Dark overlay slider - only show for custom backgrounds */}
            {currentBackground === 'custom' && customBackgroundUri && onOverlayChange && (
                <View style={styles.sliderContainer}>
                    <Text style={styles.sliderLabel}>Darkness</Text>
                    <View style={styles.sliderRow}>
                        <Text style={styles.sliderValue}>☀️</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={0}
                            maximumValue={0.8}
                            value={overlayOpacity}
                            onValueChange={onOverlayChange}
                            minimumTrackTintColor="rgba(255, 255, 255, 0.4)"
                            maximumTrackTintColor="rgba(255, 255, 255, 0.1)"
                            thumbTintColor="#FFFFFF"
                        />
                        <Text style={styles.sliderValue}>🌙</Text>
                    </View>
                </View>
            )}
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
    sliderContainer: {
        marginTop: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
    },
    sliderLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.4)',
        marginBottom: 8,
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    sliderValue: {
        fontSize: 14,
    },
});

export default BackgroundPicker;
