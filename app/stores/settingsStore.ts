
import { create } from 'zustand';
interface SettingsStore {
    // State
    isRTL: boolean;
    error: string;
    loading: boolean;
    lang: string;
    
    // Actions
    setLoading: (loading: boolean) => void;
    setError: (error: string) => void;
    setLang: (lang: string) => void;
    
    // Utility Actions
    initializeStore: (lang: string) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

const initialState = {
    isRTL: false,
    error: '',
    loading: false,
    lang: 'en',
};

export const useSettingStore = create<SettingsStore>()((set, get) => ({
    // Initial State
    ...initialState,

    // Basic Setters
    setError: (error) => set({ error }),
    setLoading: (loading) => set({ loading }),
    setLang: (lang) => {
        set({ lang, isRTL: lang === 'fa' || lang === 'ar' });
    },

    initializeStore: async (lang: string): Promise<void> => {
        set({ lang, isRTL: lang === 'fa' || lang === 'ar' });
    },

    // Utility Actions
    clearError: () => set({ error: '' }),

    // Reset function - restores all state to initial values
    reset: () => {
        set(initialState);
    }
}));

export const selectIsRTL = (state: SettingsStore) => state.isRTL;
export const selectError = (state: SettingsStore) => state.error;
export const selectLoading = (state: SettingsStore) => state.loading;

export default useSettingStore;