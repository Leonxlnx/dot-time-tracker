import AsyncStorage from '@react-native-async-storage/async-storage';
import { DotColorPreset } from '../theme';

const BIRTH_YEAR_KEY = '@dottime_birth_year';
const VIEW_TYPE_KEY = '@dottime_view_type';
const COLOR_PRESET_KEY = '@dottime_color_preset';
const ONBOARDING_KEY = '@dottime_onboarding_complete';

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
