
import { create } from 'zustand';
import { Dict } from '../types/dictionary';

// Add these interfaces if they don't exist in your types


interface DataStore {
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
    initializeStore: (lang: string, isAuthenticated: boolean, cartId?: number | null, userId?: number | null) => Promise<void>;
    clearError: () => void;
    reset: () => void;
}

const initialState = {
    isRTL: false,
    error: '',
    loading: false,
    lang: 'en',
};


const cookieManager = {
    get: (name: string) => {
        if (typeof window === 'undefined') return null;
        try {
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [key, value] = cookie.trim().split('=');
                if (key === name) return decodeURIComponent(value);
            }
            return null;
        } catch (error) {
            console.error('Error reading cookie:', error);
            return null;
        }
    },
    delete: (name: string, path: string = '/', domain?: string) => {
        if (typeof window === 'undefined') return;
        try {
            let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`;
            
            // Add domain if specified
            if (domain) {
                cookieString += ` domain=${domain};`;
            }
            
            document.cookie = cookieString;
        } catch (error) {
            console.error('Error deleting cookie:', error);
        }
    },
};

export const useDataStore = create<DataStore>()((set, get) => ({
    // Initial State
    ...initialState,

    // Basic Setters
    setError: (error) => set({ error }),
    setLoading: (loading) => set({ loading }),
    setLang: (lang) => {
        set({ lang, isRTL: lang === 'fa' || lang === 'ar' });
    },

    // Initialize Store (replaces your useEffect logic)
    initializeStore: async (lang: string) => {
        set({ lang, isRTL: lang === 'fa' || lang === 'ar' });
    },

    // Utility Actions
    clearError: () => set({ error: '' }),

    // Reset function - restores all state to initial values
    reset: () => {
        set(initialState);
    }
}));

export const selectIsRTL = (state: DataStore) => state.isRTL;
export const selectError = (state: DataStore) => state.error;
export const selectLoading = (state: DataStore) => state.loading;

export default useDataStore;