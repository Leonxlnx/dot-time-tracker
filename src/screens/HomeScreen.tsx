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
    Switch,
    ImageBackground,
    Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { theme, DotColorPreset } from '../theme';
import { ViewType, getTimeData } from '../utils/timeUtils';
import {
    getBirthYear, saveBirthYear, getViewType, saveViewType,
    getColorPreset, saveColorPreset, getOnboardingComplete, setOnboardingComplete,
    getBackground, saveBackground, getCustomBackground, saveCustomBackground,
    getFont, saveFont, getLastVisit, saveLastVisit, shouldShowWelcome,
    BackgroundPreset, FontPreset
} from '../utils/storage';
import { getNotificationSettings, saveNotificationSettings, requestNotificationPermissions } from '../utils/notifications';
import DotGrid from '../components/DotGrid';
import ViewSelector from '../components/ViewSelector';
import ColorPicker from '../components/ColorPicker';
import BackgroundPicker, { getBackgroundSource, getBackgroundColor } from '../components/BackgroundPicker';
import FontPicker from '../components/FontPicker';
import WelcomeOverlay from '../components/WelcomeOverlay';
import OnboardingScreen from './OnboardingScreen';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
    const [viewType, setViewType] = useState<ViewType>('month');
    const [birthYear, setBirthYear] = useState<number>(1990);
    const [colorPreset, setColorPreset] = useState<DotColorPreset>('gold');
    const [background, setBackground] = useState<BackgroundPreset>('none');
    const [customBackgroundUri, setCustomBackgroundUri] = useState<string | null>(null);
    const [fontPreset, setFontPreset] = useState<FontPreset>('system');
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [tempBirthYear, setTempBirthYear] = useState('');

    // Notification settings
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [notificationHour, setNotificationHour] = useState(8);
    const [notificationMinute, setNotificationMinute] = useState(0);

    // Animations
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const numberScale = useRef(new Animated.Value(0.85)).current;
    const numberTranslate = useRef(new Animated.Value(-10)).current;
    const settingsRotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const [
                    savedView, savedBirthYear, savedColor, onboardingDone, notifSettings,
                    savedBackground, savedCustomBg, savedFont, shouldWelcome
                ] = await Promise.all([
                    getViewType(),
                    getBirthYear(),
                    getColorPreset(),
                    getOnboardingComplete(),
                    getNotificationSettings(),
                    getBackground(),
                    getCustomBackground(),
                    getFont(),
                    shouldShowWelcome(),
                ]);

                if (savedView) setViewType(savedView as ViewType);
                if (savedBirthYear) setBirthYear(savedBirthYear);
                if (savedColor) setColorPreset(savedColor as DotColorPreset);
                if (savedBackground) setBackground(savedBackground);
                if (savedCustomBg) setCustomBackgroundUri(savedCustomBg);
                if (savedFont) setFontPreset(savedFont);

                setNotificationsEnabled(notifSettings.enabled);
                setNotificationHour(notifSettings.hour);
                setNotificationMinute(notifSettings.minute);

                if (!onboardingDone) {
                    setShowOnboarding(true);
                } else if (shouldWelcome) {
                    setShowWelcome(true);
                }

                // Save this visit
                await saveLastVisit();
            } catch (error) {
                console.error('Error loading preferences:', error);
            } finally {
                setLoading(false);

                // Smooth entrance animation
                Animated.parallel([
                    Animated.timing(headerOpacity, {
                        toValue: 1,
                        duration: 400,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.spring(numberScale, {
                        toValue: 1,
                        damping: 16,
                        stiffness: 150,
                        useNativeDriver: true,
                    }),
                    Animated.spring(numberTranslate, {
                        toValue: 0,
                        damping: 16,
                        stiffness: 150,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        };

        loadPreferences();
    }, []);

    // Smooth number transition on view change
    useEffect(() => {
        numberScale.setValue(0.92);
        numberTranslate.setValue(-8);

        Animated.parallel([
            Animated.spring(numberScale, {
                toValue: 1,
                damping: 18,
                stiffness: 220,
                useNativeDriver: true,
            }),
            Animated.spring(numberTranslate, {
                toValue: 0,
                damping: 18,
                stiffness: 220,
                useNativeDriver: true,
            }),
        ]).start();
    }, [viewType]);

    const handleOnboardingComplete = async () => {
        await setOnboardingComplete(true);
        setShowOnboarding(false);
        setShowWelcome(true); // Show welcome after onboarding
    };

    const handleViewChange = useCallback(async (view: ViewType) => {
        setViewType(view);
        await saveViewType(view);
    }, []);

    const handleColorChange = async (preset: DotColorPreset) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setColorPreset(preset);
        await saveColorPreset(preset);
    };

    const handleBackgroundChange = async (preset: BackgroundPreset) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setBackground(preset);
        await saveBackground(preset);
    };

    const handleFontChange = async (font: FontPreset) => {
        setFontPreset(font);
        await saveFont(font);
    };

    const handleUploadBackground = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [9, 16],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const uri = result.assets[0].uri;
                setCustomBackgroundUri(uri);
                setBackground('custom');
                await saveCustomBackground(uri);
                await saveBackground('custom');
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const handleSaveBirthYear = async () => {
        const year = parseInt(tempBirthYear, 10);
        if (year >= 1900 && year <= new Date().getFullYear()) {
            setBirthYear(year);
            await saveBirthYear(year);
        }
    };

    const handleNotificationToggle = async (value: boolean) => {
        if (value) {
            const hasPermission = await requestNotificationPermissions();
            if (!hasPermission) return;
        }

        setNotificationsEnabled(value);
        await saveNotificationSettings(value, notificationHour, notificationMinute);
    };

    const formatTime = (hour: number, minute: number): string => {
        const h = hour.toString().padStart(2, '0');
        const m = minute.toString().padStart(2, '0');
        return `${h}:${m}`;
    };

    const adjustTime = async (delta: number) => {
        let newHour = notificationHour + delta;
        if (newHour < 0) newHour = 23;
        if (newHour > 23) newHour = 0;

        setNotificationHour(newHour);
        if (notificationsEnabled) {
            await saveNotificationSettings(true, newHour, notificationMinute);
        }
    };

    const handleSettingsPress = () => {
        // Rotate animation on press
        Animated.sequence([
            Animated.timing(settingsRotate, {
                toValue: 1,
                duration: 200,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.timing(settingsRotate, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
            }),
        ]).start();

        setTempBirthYear(birthYear.toString());
        setShowSettings(true);
    };

    const timeData = getTimeData(viewType, birthYear);
    const settingsRotation = settingsRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
    });

    // Get background source
    const backgroundSource = background === 'custom' && customBackgroundUri
        ? { uri: customBackgroundUri }
        : getBackgroundSource(background);

    if (loading) {
        return <View style={styles.container} />;
    }

    if (showOnboarding) {
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
    }

    const MainContent = (
        <>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

            {/* Welcome Overlay with Confetti */}
            <WelcomeOverlay
                visible={showWelcome}
                onComplete={() => setShowWelcome(false)}
            />

            {/* Header */}
            <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
                <View style={styles.headerContent}>
                    <Animated.Text
                        style={[
                            styles.headerNumber,
                            {
                                transform: [
                                    { scale: numberScale },
                                    { translateY: numberTranslate },
                                ]
                            }
                        ]}
                    >
                        {timeData.remainingDays}
                    </Animated.Text>
                    <Text style={styles.headerLabel}>{timeData.label}</Text>
                </View>

                {/* Premium Settings Button */}
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.settingsButton}
                    onPress={handleSettingsPress}
                >
                    <Animated.View style={[styles.settingsIconContainer, { transform: [{ rotate: settingsRotation }] }]}>
                        <View style={styles.settingsGrid}>
                            <View style={styles.settingsGridItem} />
                            <View style={styles.settingsGridItem} />
                            <View style={styles.settingsGridItem} />
                            <View style={styles.settingsGridItem} />
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Animated.View>

            {/* Dots Grid */}
            <View style={styles.gridContainer}>
                <DotGrid
                    timeData={timeData}
                    viewType={viewType}
                    colorPreset={colorPreset}
                    parallaxEnabled={true}
                />
            </View>

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

                        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                            {/* Birth Year */}
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>Birth Year</Text>
                                <View style={styles.birthYearRow}>
                                    <TextInput
                                        style={styles.birthYearInput}
                                        value={tempBirthYear}
                                        onChangeText={setTempBirthYear}
                                        keyboardType="numeric"
                                        maxLength={4}
                                        placeholder="1990"
                                        placeholderTextColor="rgba(255,255,255,0.15)"
                                        selectTextOnFocus
                                        onBlur={handleSaveBirthYear}
                                    />
                                </View>
                            </View>

                            {/* Background */}
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>Background</Text>
                                <BackgroundPicker
                                    currentBackground={background}
                                    onBackgroundChange={handleBackgroundChange}
                                    onUploadPress={handleUploadBackground}
                                    customBackgroundUri={customBackgroundUri}
                                />
                            </View>

                            {/* Color Theme */}
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>Theme Color</Text>
                                <ColorPicker currentColor={colorPreset} onColorChange={handleColorChange} />
                            </View>

                            {/* Font */}
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>Font</Text>
                                <FontPicker currentFont={fontPreset} onFontChange={handleFontChange} />
                            </View>

                            {/* Notifications */}
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>Daily Reminder</Text>
                                <View style={styles.notificationRow}>
                                    <View style={styles.notificationLeft}>
                                        <Text style={styles.notificationTitle}>Motivational Quote</Text>
                                        <Text style={styles.notificationDesc}>Receive a daily reminder</Text>
                                    </View>
                                    <Switch
                                        value={notificationsEnabled}
                                        onValueChange={handleNotificationToggle}
                                        trackColor={{ false: 'rgba(255,255,255,0.08)', true: 'rgba(255,255,255,0.25)' }}
                                        thumbColor={notificationsEnabled ? '#FFFFFF' : '#666'}
                                    />
                                </View>

                                {notificationsEnabled && (
                                    <View style={styles.timeRow}>
                                        <Text style={styles.timeLabel}>Time</Text>
                                        <View style={styles.timeSelector}>
                                            <TouchableOpacity
                                                style={styles.timeButton}
                                                onPress={() => adjustTime(-1)}
                                                activeOpacity={0.6}
                                            >
                                                <Text style={styles.timeButtonText}>−</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.timeValue}>{formatTime(notificationHour, notificationMinute)}</Text>
                                            <TouchableOpacity
                                                style={styles.timeButton}
                                                onPress={() => adjustTime(1)}
                                                activeOpacity={0.6}
                                            >
                                                <Text style={styles.timeButtonText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );

    // Get background color (or use custom image)
    const bgColor = background === 'custom' ? undefined : getBackgroundColor(background);
    const hasCustomBg = background === 'custom' && customBackgroundUri;

    // Render with background
    if (hasCustomBg) {
        return (
            <ImageBackground
                source={{ uri: customBackgroundUri }}
                style={styles.container}
                resizeMode="cover"
            >
                <View style={styles.backgroundOverlay} />
                <SafeAreaView style={styles.safeArea}>
                    {MainContent}
                </SafeAreaView>
            </ImageBackground>
        );
    }

    return (
        <SafeAreaView style={[styles.container, bgColor && bgColor !== 'transparent' && { backgroundColor: bgColor }]}>
            {MainContent}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    safeArea: {
        flex: 1,
    },
    backgroundOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: theme.spacing.xl,
        paddingTop: Platform.OS === 'android' ? theme.spacing.xxl + 12 : theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
    },
    headerContent: {
        flex: 1,
    },
    headerNumber: {
        fontSize: 80,
        fontWeight: '100',
        color: '#FFFFFF',
        lineHeight: 80,
        letterSpacing: -3,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
    },
    headerLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.45)',
        marginTop: 4,
        letterSpacing: 0.3,
        textTransform: 'lowercase',
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: theme.spacing.sm,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    settingsIconContainer: {
        width: 20,
        height: 20,
    },
    settingsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: 18,
        height: 18,
        gap: 4,
    },
    settingsGridItem: {
        width: 7,
        height: 7,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    gridContainer: {
        flex: 1,
        marginBottom: 85,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'flex-end',
    },
    modalDismiss: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#0A0A0A',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingBottom: theme.spacing.xxxl + 20,
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        borderBottomWidth: 0,
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignSelf: 'center',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    section: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    },
    sectionLabel: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.3)',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: theme.spacing.md,
        fontWeight: '600',
    },
    birthYearRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    birthYearInput: {
        flex: 1,
        fontSize: 36,
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: theme.spacing.xl,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
        fontWeight: '200',
    },
    notificationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    notificationLeft: {
        flex: 1,
    },
    notificationTitle: {
        fontSize: 16,
        color: '#FFFFFF',
        fontWeight: '500',
        marginBottom: 2,
    },
    notificationDesc: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.35)',
    },
    timeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.04)',
    },
    timeLabel: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.45)',
    },
    timeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    timeButton: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeButtonText: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '300',
        lineHeight: 22,
    },
    timeValue: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '300',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
        minWidth: 65,
        textAlign: 'center',
    },
});

export default HomeScreen;
