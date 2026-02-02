import React, { useState, useEffect, useCallback } from 'react';
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
} from 'react-native';
import { theme } from '../theme';
import { ViewType, getTimeData } from '../utils/timeUtils';
import { getBirthYear, saveBirthYear, getViewType, saveViewType } from '../utils/storage';
import DotGrid from '../components/DotGrid';
import ViewSelector from '../components/ViewSelector';
import * as DefaultPreference from 'react-native-default-preference';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const HomeScreen: React.FC = () => {
    const [viewType, setViewType] = useState<ViewType>('month');
    const [birthYear, setBirthYear] = useState<number>(1990);
    const [loading, setLoading] = useState(true);
    const [showBirthYearModal, setShowBirthYearModal] = useState(false);
    const [tempBirthYear, setTempBirthYear] = useState('');

    // ---------- NATIVE WIDGET UPDATE LOGIC ----------
    const updateWidgetData = useCallback(async (currentView: ViewType, year: number) => {
        try {
            const data = getTimeData(currentView, year);

            await DefaultPreference.setName('group.com.dottime.widget'); // Shared Group
            await DefaultPreference.set('widget_remaining', data.remainingDays.toString());
            await DefaultPreference.set('widget_total', data.totalDays.toString());
            await DefaultPreference.set('widget_label', data.label);
            await DefaultPreference.set('widget_view', currentView);

            // Force update intent could be sent here if native module existed
        } catch (e) {
            // Silently fail if native module not linked yet
        }
    }, []);
    // ------------------------------------------------

    useEffect(() => {
        const loadPreferences = async () => {
            try {
                const savedView = await getViewType();
                const savedBirthYear = await getBirthYear();

                const finalView = (savedView as ViewType) || 'month';
                const finalYear = savedBirthYear || 1990;

                setViewType(finalView);
                if (savedBirthYear) setBirthYear(savedBirthYear);

                updateWidgetData(finalView, finalYear);
            } catch (error) {
                console.error('Error loading preferences:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPreferences();
    }, [updateWidgetData]);

    const handleViewChange = useCallback(
        async (view: ViewType) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            if (view === 'life') {
                const savedBirthYear = await getBirthYear();
                if (!savedBirthYear) {
                    setShowBirthYearModal(true);
                }
            }
            setViewType(view);
            await saveViewType(view);
            updateWidgetData(view, birthYear);
        },
        [birthYear, updateWidgetData]
    );

    const handleSaveBirthYear = async () => {
        const year = parseInt(tempBirthYear, 10);
        if (year >= 1900 && year <= new Date().getFullYear()) {
            setBirthYear(year);
            await saveBirthYear(year);
            setShowBirthYearModal(false);
            updateWidgetData(viewType, year);
        }
    };

    const timeData = getTimeData(viewType, birthYear);

    if (loading) return <View style={styles.container} />;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

            <View style={styles.header}>
                <View>
                    <Text style={styles.headerNumber}>{timeData.remainingDays}</Text>
                    <Text style={styles.headerLabel}>{timeData.label}</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.settingsButton}
                    onPress={() => {
                        setTempBirthYear(birthYear.toString());
                        setShowBirthYearModal(true);
                    }}
                >
                    <Text style={styles.settingsIcon}>⋮</Text>
                </TouchableOpacity>
            </View>

            <DotGrid timeData={timeData} viewType={viewType} />

            <ViewSelector currentView={viewType} onViewChange={handleViewChange} />

            <Modal
                visible={showBirthYearModal}
                animationType="fade"
                transparent
                onRequestClose={() => setShowBirthYearModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter Birth Year</Text>
                        <TextInput
                            style={styles.input}
                            value={tempBirthYear}
                            onChangeText={setTempBirthYear}
                            keyboardType="numeric"
                            maxLength={4}
                            placeholder="1990"
                            placeholderTextColor={theme.colors.textSecondary}
                            autoFocus
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.modalButton}
                                onPress={() => setShowBirthYearModal(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleSaveBirthYear}>
                                <Text style={[styles.buttonText, styles.saveButtonText]}>Confirm</Text>
                            </TouchableOpacity>
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
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.xxl, // More top padding
        paddingBottom: theme.spacing.xl,
    },
    headerNumber: {
        fontSize: theme.fontSize.hero,
        fontWeight: '200',
        color: theme.colors.text,
        lineHeight: theme.fontSize.hero,
        letterSpacing: -2,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-light',
    },
    headerLabel: {
        fontSize: theme.fontSize.lg,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
        textTransform: 'lowercase',
        letterSpacing: 0.5,
    },
    settingsButton: {
        padding: theme.spacing.sm,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.full,
    },
    settingsIcon: {
        fontSize: 20,
        color: theme.colors.textSecondary,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: 300,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.surfaceGlass,
    },
    modalTitle: {
        fontSize: theme.fontSize.lg,
        color: theme.colors.text,
        marginBottom: theme.spacing.lg,
        fontWeight: '300',
    },
    input: {
        fontSize: theme.fontSize.xxl,
        color: theme.colors.text,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.textTertiary,
        width: '100%',
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        paddingVertical: theme.spacing.sm,
        fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-thin',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        width: '100%',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.surfaceGlass,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: theme.colors.text, // White button
    },
    buttonText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        fontWeight: '500',
    },
    saveButtonText: {
        color: theme.colors.background, // Black text
        fontWeight: '600',
    },
});

export default HomeScreen;
