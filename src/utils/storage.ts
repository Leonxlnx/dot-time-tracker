import AsyncStorage from '@react-native-async-storage/async-storage';
import { DotColorPreset } from '../theme';

const BIRTH_YEAR_KEY = '@dottime_birth_year';
const VIEW_TYPE_KEY = '@dottime_view_type';
const COLOR_PRESET_KEY = '@dottime_color_preset';
const ONBOARDING_KEY = '@dottime_onboarding_complete';
const BACKGROUND_KEY = '@dottime_background';
const CUSTOM_BACKGROUND_KEY = '@dottime_custom_background';
const FONT_KEY = '@dottime_font';
const LAST_VISIT_KEY = '@dottime_last_visit';

export type BackgroundPreset = 'none' | 'aurora' | 'marble' | 'mesh' | 'stars' | 'waves' | 'gold' | 'glass' | 'custom';
export type FontPreset = 'system' | 'inter' | 'roboto' | 'outfit' | 'space';

export const saveBirthYear = async (year: number): Promise<void> => {
    try {
        await AsyncStorage.setItem(BIRTH_YEAR_KEY, year.toString());
    } catch (error) {
        console.error('Error saving birth year:', error);
    }
};

export const getBirthYear = async (): Promise<number | null> => {
    try {
        const value = await AsyncStorage.getItem(BIRTH_YEAR_KEY);
        return value ? parseInt(value, 10) : null;
    } catch (error) {
        console.error('Error getting birth year:', error);
        return null;
    }
};

export const saveViewType = async (viewType: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(VIEW_TYPE_KEY, viewType);
    } catch (error) {
        console.error('Error saving view type:', error);
    }
};

export const getViewType = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(VIEW_TYPE_KEY);
    } catch (error) {
        console.error('Error getting view type:', error);
        return null;
    }
};

export const saveColorPreset = async (preset: DotColorPreset): Promise<void> => {
    try {
        await AsyncStorage.setItem(COLOR_PRESET_KEY, preset);
    } catch (error) {
        console.error('Error saving color preset:', error);
    }
};

export const getColorPreset = async (): Promise<DotColorPreset | null> => {
    try {
        const value = await AsyncStorage.getItem(COLOR_PRESET_KEY);
        return value as DotColorPreset | null;
    } catch (error) {
        console.error('Error getting color preset:', error);
        return null;
    }
};

export const setOnboardingComplete = async (complete: boolean): Promise<void> => {
    try {
        await AsyncStorage.setItem(ONBOARDING_KEY, complete.toString());
    } catch (error) {
        console.error('Error saving onboarding state:', error);
    }
};

export const getOnboardingComplete = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        return value === 'true';
    } catch (error) {
        console.error('Error getting onboarding state:', error);
        return false;
    }
};

// Background settings
export const saveBackground = async (preset: BackgroundPreset): Promise<void> => {
    try {
        await AsyncStorage.setItem(BACKGROUND_KEY, preset);
    } catch (error) {
        console.error('Error saving background:', error);
    }
};

export const getBackground = async (): Promise<BackgroundPreset> => {
    try {
        const value = await AsyncStorage.getItem(BACKGROUND_KEY);
        return (value as BackgroundPreset) || 'none';
    } catch (error) {
        console.error('Error getting background:', error);
        return 'none';
    }
};

export const saveCustomBackground = async (uri: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(CUSTOM_BACKGROUND_KEY, uri);
    } catch (error) {
        console.error('Error saving custom background:', error);
    }
};

export const getCustomBackground = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(CUSTOM_BACKGROUND_KEY);
    } catch (error) {
        console.error('Error getting custom background:', error);
        return null;
    }
};

// Font settings
export const saveFont = async (font: FontPreset): Promise<void> => {
    try {
        await AsyncStorage.setItem(FONT_KEY, font);
    } catch (error) {
        console.error('Error saving font:', error);
    }
};

export const getFont = async (): Promise<FontPreset> => {
    try {
        const value = await AsyncStorage.getItem(FONT_KEY);
        return (value as FontPreset) || 'system';
    } catch (error) {
        console.error('Error getting font:', error);
        return 'system';
    }
};

// Last visit tracking (for confetti)
export const saveLastVisit = async (): Promise<void> => {
    try {
        await AsyncStorage.setItem(LAST_VISIT_KEY, Date.now().toString());
    } catch (error) {
        console.error('Error saving last visit:', error);
    }
};

export const getLastVisit = async (): Promise<number | null> => {
    try {
        const value = await AsyncStorage.getItem(LAST_VISIT_KEY);
        return value ? parseInt(value, 10) : null;
    } catch (error) {
        console.error('Error getting last visit:', error);
        return null;
    }
};

export const shouldShowWelcome = async (): Promise<boolean> => {
    try {
        const lastVisit = await getLastVisit();
        if (!lastVisit) return true; // First visit

        const now = Date.now();
        const hoursSinceLastVisit = (now - lastVisit) / (1000 * 60 * 60);

        // Show welcome if more than 6 hours since last visit
        return hoursSinceLastVisit > 6;
    } catch (error) {
        return false;
    }
};
