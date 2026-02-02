import AsyncStorage from '@react-native-async-storage/async-storage';

const BIRTH_YEAR_KEY = '@dottime_birth_year';
const VIEW_TYPE_KEY = '@dottime_view_type';

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
