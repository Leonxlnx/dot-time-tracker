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

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
    const [viewType, setViewType] = useState<ViewType>('month');
    const [birthYear, setBirthYear] = useState<number>(1990);
    const [colorPreset, setColorPreset] = useState<DotColorPreset>('default');
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [tempBirthYear, setTempBirthYear] = useState('');

    // Animations
    const headerOpacity = useRef(new Animated.Value(0)).current;
    const headerTranslate = useRef(new Animated.Value(-30)).current;
    const numberScale = useRef(new Animated.Value(0.7)).current;

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

                // Smooth entrance
                Animated.parallel([
                    Animated.timing(headerOpacity, {
                        toValue: 1,
                        duration: 700,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.timing(headerTranslate, {
                        toValue: 0,
                        duration: 700,
                        easing: Easing.out(Easing.cubic),
                        useNativeDriver: true,
                    }),
                    Animated.spring(numberScale, {
                        toValue: 1,
                        damping: 10,
                        stiffness: 80,
                        delay: 150,
                        useNativeDriver: true,
                    }),
                ]).start();
            }
        };

        loadPreferences();
    }, []);

    // Animate number on view change
    useEffect(() => {
        numberScale.setValue(0.85);
        Animated.spring(numberScale, {
            toValue: 1,
            damping: 10,
            stiffness: 180,
            useNativeDriver: true,
        }).start();
    }, [viewType]);

    const handleViewChange = useCallback(async (view: ViewType) => {
        LayoutAnimation.configureNext({
            duration: 350,
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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000000" translucent />

            {/* Ultra-clean Header */}
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

            {/* Centered Dots Grid */}
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
                                        placeholderTextColor="rgba(255,255,255,0.2)"
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
        paddingTop: Platform.OS === 'android' ? theme.spacing.xxl + 10 : theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
    },
    headerContent: {
        flex: 1,
    },
    headerNumber: {
        fontSize: 96,
        fontWeight: '100',
        color: '#FFFFFF',
        lineHeight: 96,
        letterSpacing: -8,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
    },
    headerLabel: {
        fontSize: theme.fontSize.sm,
        color: 'rgba(255, 255, 255, 0.35)',
        marginTop: theme.spacing.xxs,
        letterSpacing: 0.8,
        textTransform: 'lowercase',
    },
    settingsButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
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
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    gridContainer: {
        flex: 1,
        marginTop: -theme.spacing.md, // Pull grid up
        marginBottom: 100, // Space for ViewSelector
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalDismiss: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#0C0C0C',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingBottom: theme.spacing.xxxl,
        maxHeight: '70%',
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        alignSelf: 'center',
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    modalHeader: {
        paddingHorizontal: theme.spacing.xl,
        marginBottom: theme.spacing.md,
    },
    modalTitle: {
        fontSize: 22,
        color: '#FFFFFF',
        fontWeight: '500',
        letterSpacing: -0.5,
    },
    settingSection: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    },
    sectionLabel: {
        fontSize: theme.fontSize.md,
        color: '#FFFFFF',
        fontWeight: '500',
        marginBottom: 4,
    },
    sectionDescription: {
        fontSize: theme.fontSize.sm,
        color: 'rgba(255, 255, 255, 0.35)',
        marginBottom: theme.spacing.md,
    },
    birthYearRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
    },
    birthYearInput: {
        flex: 1,
        fontSize: 40,
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 16,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        textAlign: 'center',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
    },
    saveButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: theme.spacing.md + 4,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: 50,
    },
    saveButtonText: {
        color: '#000000',
        fontSize: theme.fontSize.md,
        fontWeight: '600',
    },
});

export default HomeScreen;
