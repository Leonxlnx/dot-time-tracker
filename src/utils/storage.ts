import AsyncStorage from '@react-native-async-storage/async-storage';
import { DotColorPreset } from '../theme';

const BIRTH_YEAR_KEY = '@dottime_birth_year';
const VIEW_TYPE_KEY = '@dottime_view_type';
const COLOR_PRESET_KEY = '@dottime_color_preset';

export const saveBirthYear = async (year: number): Promise<void> => {
    try {
        await AsyncStorage.setItem(BIRTH_YEAR_KEY, year.toString());
    } catch (e) {
        console.warn('Failed to save birth year', e);
    }
};

export const getBirthYear = async (): Promise<number | null> => {
    try {
        const value = await AsyncStorage.getItem(BIRTH_YEAR_KEY);
        return value ? parseInt(value, 10) : null;
    } catch (e) {
        console.warn('Failed to get birth year', e);
        return null;
    }
};

export const saveViewType = async (viewType: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(VIEW_TYPE_KEY, viewType);
    } catch (e) {
        console.warn('Failed to save view type', e);
    }
};

export const getViewType = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(VIEW_TYPE_KEY);
    } catch (e) {
        console.warn('Failed to get view type', e);
        return null;
    }
};

export const saveColorPreset = async (preset: DotColorPreset): Promise<void> => {
    try {
        await AsyncStorage.setItem(COLOR_PRESET_KEY, preset);
    } catch (e) {
        console.warn('Failed to save color preset', e);
    }
};

export const getColorPreset = async (): Promise<DotColorPreset | null> => {
    try {
        const value = await AsyncStorage.getItem(COLOR_PRESET_KEY);
        return value as DotColorPreset | null;
    } catch (e) {
        console.warn('Failed to get color preset', e);
        return null;
    }
};
