import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    Text,
    Modal,
    TextInput,
    LayoutAnimation,
    Platform,
    UIManager,
    ScrollView,
    Animated,
    Easing,
    Dimensions,
} from 'react-native';
import { theme, DotColorPreset } from '../theme';
import { ViewType, getTimeData } from '../utils/timeUtils';
import { getBirthYear, saveBirthYear, getViewType, saveViewType, getColorPreset, saveColorPreset } from '../utils/storage';
import DotGrid from '../components/DotGrid';
import ViewSelector from '../components/ViewSelector';
import ColorPicker from '../components/ColorPicker';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
    const [viewType, setViewType] = useState<ViewType>('month');
    const [birthYear, setBirthYear] = useState<number>(1990);
    const [colorPreset, setColorPreset] = useState<DotColorPreset>('default');
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [tempBirthYear, setTempBirthYear] = useState('');

    // Animations
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const headerTranslate = useRef(new Animated.Value(-20)).current;
    const numberScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const [savedView, savedBirthYear, savedColor] = await Promise.all([
                    getViewType(),
                    getBirthYear(),
                    getColorPreset(),
                ]);

                if (savedView) setViewType(savedView as ViewType);
                if (savedBirthYear) setBirthYear(savedBirthYear);
                if (savedColor) setColorPreset(savedColor);
            } catch (error) {
                console.error('Error loading preferences:', error);
            } finally {
                setLoading(false);

                // Entrance animations
                Animated.parallel([
                    Animated.timing(headerOpacity, {
                        toValue: 1,
                        duration: 600,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.timing(headerTranslate, {
                        toValue: 0,
                        duration: 600,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.spring(numberScale, {
                        toValue: 1,
                        damping: 12,
                        stiffness: 100,
                        delay: 100,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        };

        loadPreferences();
    }, []);

    // Animate number change
    useEffect(() => {
        numberScale.setValue(0.9);
        Animated.spring(numberScale, {
            toValue: 1,
            damping: 8,
            stiffness: 200,
            useNativeDriver: true,
        }).start();
    }, [viewType]);

    const handleViewChange = useCallback(async (view: ViewType) => {
        LayoutAnimation.configureNext({
            duration: 300,
            update: { type: 'easeInEaseOut' },
        });

        if (view === 'life') {
            const savedBirthYear = await getBirthYear();
            if (!savedBirthYear) {
                setTempBirthYear('');
                setShowSettings(true);
            }
        }
        setViewType(view);
        await saveViewType(view);
    }, []);

    const handleColorChange = async (preset: DotColorPreset) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setColorPreset(preset);
        await saveColorPreset(preset);
    };

    const handleSaveBirthYear = async () => {
        const year = parseInt(tempBirthYear, 10);
        if (year >= 1900 && year <= new Date().getFullYear()) {
            setBirthYear(year);
            await saveBirthYear(year);
        }
    };

    const timeData = getTimeData(viewType, birthYear);

    if (loading) {
        return <View style={styles.container} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" translucent />

            {/* Premium Header */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        opacity: headerOpacity,
                        transform: [{ translateY: headerTranslate }],
                    }
                ]}
            >
                <View style={styles.headerContent}>
                    <Animated.Text
                        style={[
                            styles.headerNumber,
                            { transform: [{ scale: numberScale }] }
                        ]}
                    >
                        {timeData.remainingDays}
                    </Animated.Text>
                    <Text style={styles.headerLabel}>{timeData.label}</Text>
                </View>

                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.settingsButton}
                    onPress={() => {
                        setTempBirthYear(birthYear.toString());
                        setShowSettings(true);
                    }}
                >
                    <View style={styles.settingsIcon}>
                        <View style={styles.settingsDot} />
                        <View style={styles.settingsDot} />
                        <View style={styles.settingsDot} />
                    </View>
                </TouchableOpacity>
            </Animated.View>

            {/* Dots Grid */}
            <DotGrid timeData={timeData} viewType={viewType} colorPreset={colorPreset} />

            {/* View Selector */}
            <ViewSelector currentView={viewType} onViewChange={handleViewChange} />

            {/* Settings Modal */}
            <Modal
                visible={showSettings}
                animationType="slide"
                transparent
                statusBarTranslucent
                onRequestClose={() => setShowSettings(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalDismiss}
                        activeOpacity={1}
                        onPress={() => setShowSettings(false)}
                    />
                    <View style={styles.modalContent}>
                        <View style={styles.modalHandle} />

                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Settings</Text>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                            {/* Birth Year */}
                            <View style={styles.settingSection}>
                                <Text style={styles.sectionLabel}>Birth Year</Text>
                                <Text style={styles.sectionDescription}>Used for life view calculations</Text>
                                <View style={styles.birthYearRow}>
                                    <TextInput
                                        style={styles.birthYearInput}
                                        value={tempBirthYear}
                                        onChangeText={setTempBirthYear}
                                        keyboardType="numeric"
                                        maxLength={4}
                                        placeholder="1990"
                                        placeholderTextColor={theme.colors.textTertiary}
                                    />
                                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveBirthYear}>
                                        <Text style={styles.saveButtonText}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Color Picker */}
                            <View style={styles.settingSection}>
                                <ColorPicker currentColor={colorPreset} onColorChange={handleColorChange} />
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: theme.spacing.xl,
        paddingTop: Platform.OS === 'android' ? theme.spacing.xxxl : theme.spacing.xl,
        paddingBottom: theme.spacing.md,
    },
    headerContent: {
        flex: 1,
    },
    headerNumber: {
        fontSize: 88,
        fontWeight: '100',
        color: '#FFFFFF',
        lineHeight: 88,
        letterSpacing: -6,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
    },
    headerLabel: {
        fontSize: theme.fontSize.md,
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: theme.spacing.xs,
        letterSpacing: 0.5,
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.md,
    },
    settingsIcon: {
        flexDirection: 'column',
        gap: 4,
    },
    settingsDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'flex-end',
    },
    modalDismiss: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#0A0A0A',
        borderTopLeftRadius: theme.borderRadius.xl,
        borderTopRightRadius: theme.borderRadius.xl,
        paddingBottom: theme.spacing.xxxl,
        maxHeight: '75%',
    },
    modalHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignSelf: 'center',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    modalHeader: {
        paddingHorizontal: theme.spacing.xl,
        marginBottom: theme.spacing.md,
    },
    modalTitle: {
        fontSize: theme.fontSize.xl,
        color: '#FFFFFF',
        fontWeight: '600',
        letterSpacing: -0.5,
    },
    settingSection: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    sectionLabel: {
        fontSize: theme.fontSize.md,
        color: '#FFFFFF',
        fontWeight: '500',
        marginBottom: theme.spacing.xs,
    },
    sectionDescription: {
        fontSize: theme.fontSize.sm,
        color: 'rgba(255, 255, 255, 0.4)',
        marginBottom: theme.spacing.md,
    },
    birthYearRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    birthYearInput: {
        flex: 1,
        fontSize: theme.fontSize.xxl,
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        borderRadius: theme.borderRadius.lg,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
    },
    saveButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.full,
    },
    saveButtonText: {
        color: '#000000',
        fontSize: theme.fontSize.md,
        fontWeight: '600',
    },
});

export default HomeScreen;
