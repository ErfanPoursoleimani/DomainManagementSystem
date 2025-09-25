'use client'
import { useEffect, useRef, useState } from 'react';
import { useDataStore } from '../stores/dataStore';
import { Lang } from '../types/dictionary';

interface DataInitializerProps {
    children: React.ReactNode;
    lang?: Lang;
}

export const StoreInitializer: React.FC<DataInitializerProps> = ({
    children,
    lang = 'en',
}) => {

    const hasInitializedRef = useRef(false);
    
    // Data store selectors
    const initializeStore = useDataStore((state) => state.initializeStore);
    const dataLoading = useDataStore((state) => state.loading);
    const dataReset = useDataStore((state) => state.reset);

    const [hasHydrated, setHasHydrated] = useState(false);
    const [isDataInitialized, setIsDataInitialized] = useState(false);

    useEffect(() => {
        setHasHydrated(true);
    }, []);

    // Main effect that handles initialization and reinitialization
    useEffect(() => {

        // Detect if this is the first initialization or if auth state changed
        const isFirstInit = !hasInitializedRef.current;

        const shouldInitialize = isFirstInit;

        if (shouldInitialize) {
            const init = async () => {
                try {
                    // Initialize/reinitialize the store
                    await initializeStore(lang);
                    
                    // Update ref state after successful initialization
                    hasInitializedRef.current = true;

                    setIsDataInitialized(true)
                    
                } catch (error) {
                    console.error('Data store initialization failed:', error);
                }
            };

            init();
        }
    }, [
        initializeStore,
        dataReset,
        lang
    ]);

    if (!hasHydrated/*  || dataLoading */ || !isDataInitialized) {
        return (
        <>
            <div className="flex items-center justify-center fixed top-0 left-0 min-h-screen min-w-screen z-10000 bg-white/60">
                <div className='flex flex-col items-center justify-center bg-white gap-10 rounded-2xl p-10'>
                    <div className="animate-spin rounded-full h-15 w-15 border-b-3 text-[var(--theme)]"></div>
                    <p className='font-bold text-[var(--theme)]'>Danajou</p>
                </div>
            </div>
            {children}
        </>
        );
    }

    return <>{children}</>;
};