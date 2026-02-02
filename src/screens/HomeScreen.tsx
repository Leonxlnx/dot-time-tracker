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
} from 'react-native';
import { theme, DotColorPreset } from '../theme';
import { ViewType, getTimeData } from '../utils/timeUtils';
import { getBirthYear, saveBirthYear, getViewType, saveViewType, getColorPreset, saveColorPreset, getOnboardingComplete, setOnboardingComplete } from '../utils/storage';
import { getNotificationSettings, saveNotificationSettings, requestNotificationPermissions } from '../utils/notifications';
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

    // Notification settings
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [notificationHour, setNotificationHour] = useState(8);
    const [notificationMinute, setNotificationMinute] = useState(0);

    // Animations
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const numberScale = useRef(new Animated.Value(0.8)).current;

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const [savedView, savedBirthYear, savedColor, onboardingDone, notifSettings] = await Promise.all([
                    getViewType(),
                    getBirthYear(),
                    getColorPreset(),
                    getOnboardingComplete(),
                    getNotificationSettings(),
                ]);

                if (savedView) setViewType(savedView as ViewType);
                if (savedBirthYear) setBirthYear(savedBirthYear);
                if (savedColor) setColorPreset(savedColor);

                setNotificationsEnabled(notifSettings.enabled);
                setNotificationHour(notifSettings.hour);
                setNotificationMinute(notifSettings.minute);

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
                        duration: 350,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.spring(numberScale, {
                        toValue: 1,
                        damping: 14,
                        stiffness: 130,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        };

        loadPreferences();
    }, []);

    useEffect(() => {
        numberScale.setValue(0.92);
        Animated.spring(numberScale, {
            toValue: 1,
            damping: 14,
            stiffness: 200,
            useNativeDriver: true,
        }).start();
    }, [viewType]);

    const handleOnboardingComplete = async () => {
        await setOnboardingComplete(true);
        setShowOnboarding(false);
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
            if (!hasPermission) {
                return;
            }
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
                                        placeholderTextColor="rgba(255,255,255,0.2)"
                                        selectTextOnFocus
                                        onBlur={handleSaveBirthYear}
                                    />
                                </View>
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
                                        trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(255,255,255,0.3)' }}
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
                                                activeOpacity={0.7}
                                            >
                                                <Text style={styles.timeButtonText}>−</Text>
                                            </TouchableOpacity>
                                            <Text style={styles.timeValue}>{formatTime(notificationHour, notificationMinute)}</Text>
                                            <TouchableOpacity
                                                style={styles.timeButton}
                                                onPress={() => adjustTime(1)}
                                                activeOpacity={0.7}
                                            >
                                                <Text style={styles.timeButtonText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>

                            {/* Color Theme */}
                            <View style={styles.section}>
                                <Text style={styles.sectionLabel}>Theme</Text>
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
        paddingTop: Platform.OS === 'android' ? theme.spacing.xxl + 10 : theme.spacing.lg,
        paddingBottom: theme.spacing.xs,
    },
    headerContent: {
        flex: 1,
    },
    headerNumber: {
        fontSize: 72,
        fontWeight: '100',
        color: '#FFFFFF',
        lineHeight: 72,
        letterSpacing: -4,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
    },
    headerLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.4)',
        marginTop: 6,
        letterSpacing: 0.4,
        textTransform: 'lowercase',
    },
    settingsButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
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
        backgroundColor: 'rgba(255, 255, 255, 0.45)',
    },
    gridContainer: {
        flex: 1,
        marginTop: theme.spacing.md,
        marginBottom: 90,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'flex-end',
    },
    modalDismiss: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#0A0A0A',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingBottom: theme.spacing.xxxl + 24,
        maxHeight: '70%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.06)',
        borderBottomWidth: 0,
    },
    modalHandle: {
        width: 36,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
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
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.35)',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        marginBottom: theme.spacing.md,
    },
    birthYearRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    birthYearInput: {
        flex: 1,
        fontSize: 40,
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: theme.spacing.xl,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
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
        color: 'rgba(255, 255, 255, 0.5)',
    },
    timeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    timeButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timeButtonText: {
        fontSize: 20,
        color: '#FFFFFF',
        fontWeight: '300',
    },
    timeValue: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: '300',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
        minWidth: 70,
        textAlign: 'center',
    },
});

export default HomeScreen;
