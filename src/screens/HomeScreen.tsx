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
import { getBirthYear, saveBirthYear, getViewType, saveViewType, getColorPreset, saveColorPreset, getOnboardingComplete, setOnboardingComplete } from '../utils/storage';
import DotGrid from '../components/DotGrid';
import ViewSelector from '../components/ViewSelector';
import ColorPicker from '../components/ColorPicker';
import OnboardingScreen from './OnboardingScreen';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
    const [viewType, setViewType] = useState<ViewType>('month');
    const [birthYear, setBirthYear] = useState<number>(1990);
    const [colorPreset, setColorPreset] = useState<DotColorPreset>('default');
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [tempBirthYear, setTempBirthYear] = useState('');

    // Animations
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const numberScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const [savedView, savedBirthYear, savedColor, onboardingDone] = await Promise.all([
                    getViewType(),
                    getBirthYear(),
                    getColorPreset(),
                    getOnboardingComplete(),
                ]);

                if (savedView) setViewType(savedView as ViewType);
                if (savedBirthYear) setBirthYear(savedBirthYear);
                if (savedColor) setColorPreset(savedColor);

                if (!onboardingDone) {
                    setShowOnboarding(true);
                }
            } catch (error) {
                console.error('Error loading preferences:', error);
            } finally {
                setLoading(false);

                Animated.parallel([
                    Animated.timing(headerOpacity, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.spring(numberScale, {
                        toValue: 1,
                        damping: 12,
                        stiffness: 120,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        };

        loadPreferences();
    }, []);

    useEffect(() => {
        numberScale.setValue(0.9);
        Animated.spring(numberScale, {
            toValue: 1,
            damping: 12,
            stiffness: 200,
            useNativeDriver: true,
        }).start();
    }, [viewType]);

    const handleOnboardingComplete = async () => {
        await setOnboardingComplete(true);
        setShowOnboarding(false);
    };

    const handleViewChange = useCallback(async (view: ViewType) => {
        LayoutAnimation.configureNext({
            duration: 300,
            update: { type: 'easeInEaseOut' },
        });
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
            setShowSettings(false);
        }
    };

    const timeData = getTimeData(viewType, birthYear);

    if (loading) {
        return <View style={styles.container} />;
    }

    if (showOnboarding) {
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" translucent />

            {/* Header */}
            <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
                <View style={styles.headerContent}>
                    <Animated.Text style={[styles.headerNumber, { transform: [{ scale: numberScale }] }]}>
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
            <View style={styles.gridContainer}>
                <DotGrid timeData={timeData} viewType={viewType} colorPreset={colorPreset} />
            </View>

            {/* View Selector */}
            <ViewSelector currentView={viewType} onViewChange={handleViewChange} />

            {/* Settings Modal - Opens higher */}
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

                        {/* Birth Year - Top section, immediately visible */}
                        <View style={styles.birthYearSection}>
                            <Text style={styles.birthYearLabel}>Birth Year</Text>
                            <View style={styles.birthYearRow}>
                                <TextInput
                                    style={styles.birthYearInput}
                                    value={tempBirthYear}
                                    onChangeText={setTempBirthYear}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    placeholder="1990"
                                    placeholderTextColor="rgba(255,255,255,0.2)"
                                    selectTextOnFocus
                                />
                                <TouchableOpacity style={styles.saveButton} onPress={handleSaveBirthYear} activeOpacity={0.85}>
                                    <Text style={styles.saveButtonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Color Picker */}
                        <View style={styles.colorSection}>
                            <Text style={styles.sectionLabel}>Theme</Text>
                            <ColorPicker currentColor={colorPreset} onColorChange={handleColorChange} />
                        </View>
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
        paddingTop: Platform.OS === 'android' ? theme.spacing.xxl + 8 : theme.spacing.lg,
        paddingBottom: theme.spacing.xs,
    },
    headerContent: {
        flex: 1,
    },
    headerNumber: {
        fontSize: 80,
        fontWeight: '100',
        color: '#FFFFFF',
        lineHeight: 80,
        letterSpacing: -5,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
    },
    headerLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.35)',
        marginTop: 4,
        letterSpacing: 0.5,
        textTransform: 'lowercase',
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.sm,
    },
    settingsIcon: {
        flexDirection: 'column',
        gap: 4,
    },
    settingsDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    gridContainer: {
        flex: 1,
        marginTop: theme.spacing.lg,
        marginBottom: 85,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'flex-end',
    },
    modalDismiss: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#0D0D0D',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingBottom: theme.spacing.xxxl + 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        borderBottomWidth: 0,
    },
    modalHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        alignSelf: 'center',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    birthYearSection: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
    },
    birthYearLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: theme.spacing.md,
    },
    birthYearRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    birthYearInput: {
        flex: 1,
        fontSize: 48,
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 16,
        paddingVertical: theme.spacing.lg,
        paddingHorizontal: theme.spacing.xl,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
    },
    saveButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 22,
        paddingHorizontal: 32,
        borderRadius: 50,
    },
    saveButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
    },
    colorSection: {
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.04)',
    },
    sectionLabel: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.4)',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: theme.spacing.md,
    },
});

export default HomeScreen;
