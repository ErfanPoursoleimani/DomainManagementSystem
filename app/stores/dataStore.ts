
import { create } from 'zustand';
import { Dict, Lang } from '../types/dictionary';
import axios from 'axios';
import { Domain } from '../types/domain';

// Add these interfaces if they don't exist in your types


interface DataStore {
    // State
    domains: Domain[],
    dict: Dict,
    error: string,
    loading: boolean,
    
    // Configuration
    lang: string,
    
    // Actions
    setDomains: (domains: Domain[]) => void,
    setLoading: (loading: boolean) => void,
    setDict: (dict: Dict) => void,
    setError: (error: string) => void,
    
    // API Actions
    fetchDict: (lang: string) => Promise<void>,
    fetchDomains: () => Promise<void>,
    deleteDomain: (id: string) => Promise<void>,
    updateDomain: (id: string, domain: Partial<Domain>) => Promise<void>,
    createDomain: (domain: Omit<Domain, 'id'>) => Promise<void>,
    
    // Utility Actions
    initializeStore: (lang: Lang) => Promise<void>,
    clearError: () => void,
    reset: () => void,
}

const initialDict: Dict = {
    
};

const initialState = {
    dict: initialDict,
    domains: [],
    error: '',
    loading: false,
    lang: 'en',
};


const apiHandler = {

    getDomains: async (): Promise<Domain[]> => {
        const { data } = await axios.get(`https://domain-danajo.liara.run/api/Domain/`);
        return data.results;
    },
    deleteDomain: async (id: string): Promise<void> => {
        await axios.delete(`https://domain-danajo.liara.run/api/Domain/${id}`);
    },
    updateDomain: async (id: string, domain: Partial<Domain>): Promise<Domain> => {
        const { data } = await axios.put(`https://domain-danajo.liara.run/api/Domain/${id}`, domain);
        return data.results;
    },
    createDomain: async (domain: Omit<Domain, 'id' | 'created'>): Promise<Domain> => {
        const { data } = await axios.post(`https://domain-danajo.liara.run/api/Domain/`, domain);
        return data;
    }

}

export const useDataStore = create<DataStore>()((set, get) => ({
    // Initial State
    ...initialState,

    // Basic Setters
    
    setDict: (dict: Dict) => set({ dict }),
    setDomains: (domains: Domain[]) => set({ domains }),
    setError: (error) => set({ error }),
    setLoading: (loading) => set({ loading }),

    // API Actions
    
    deleteDomain: async (id: string) => {
        try {
            set({ loading: true });
            await apiHandler.deleteDomain(id);
            set({ loading: false });
        } catch (err) {
            set({ error: err as string, loading: false });
        }
    },
    updateDomain: async (id: string, domain: Partial<Domain>) => {
        try {
            set({ loading: true });
            await apiHandler.updateDomain(id, domain);
            set({ loading: false });
        } catch (err) {
            set({ error: err as string, loading: false });
        }
    },
    createDomain: async (domain: Omit<Domain, 'id' | 'created'>) => {
        try {
            set({ loading: true });
            await apiHandler.createDomain(domain);
            set({ loading: false });
        } catch (err) {
            set({ error: err as string, loading: false });
        }
    },
    fetchDomains: async () => {
        try {
            set({ loading: true });
            const domains = await apiHandler.getDomains();
            set({ domains, loading: false });
        } catch (err) {
            set({ error: err as string, loading: false });
        }
    },
    fetchDict: async (lang: string) => {
        try {
            set({ loading: true });
            const { data } = await axios.get(`/${lang}/api/dictionary?locale=${lang}`);
            set({ dict: data, loading: false });
        } catch (err) {
            set({ error: err as string, loading: false });
        }
    },

    // Initialize Store (replaces your useEffect logic)
    initializeStore: async (lang: Lang) => {
        set({ lang });
        
        // Fetch all data in parallel
        const promises = [
            get().fetchDict(lang),
            get().fetchDomains(),
        ];

        try {
            await Promise.all(promises);
        } catch (error) {
            console.error('Error initializing store:', error);
            set({ error: 'Failed to initialize store', loading: false });
        }
    },

    // Utility Actions
    clearError: () => set({ error: '' }),

    // Reset function - restores all state to initial values (no localStorage clearing)
    reset: () => {
        set(initialState);
    }
}));

export const selectDict = (state: DataStore) => state.dict;
export const selectError = (state: DataStore) => state.error;
export const selectLoading = (state: DataStore) => state.loading;

export default useDataStore;