import { useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { HealthProvider, HealthSession, HealthServiceAdapter } from './types';
import { GoogleFitAdapter } from './GoogleFitAdapter';
import { AppleHealthMockAdapter } from './AppleHealthAdapter';
import { HealthContext } from './HealthContextDefinition';

export const HealthProviderComponent = ({ children }: { children: ReactNode }) => {
    const [activeProvider, setActiveProvider] = useState<HealthProvider | null>(null);

    // Initialize Adapters once
    const adapters = useMemo<Record<HealthProvider, HealthServiceAdapter>>(() => ({
        google: new GoogleFitAdapter(),
        apple: new AppleHealthMockAdapter()
    }), []);

    const isAvailable = useMemo(() => ({
        google: adapters.google.isAvailable(),
        apple: adapters.apple.isAvailable()
    }), [adapters]);

    const connect = async (providerId: HealthProvider) => {
        const adapter = adapters[providerId];
        const success = await adapter.connect();
        if (success) {
            setActiveProvider(providerId);
            localStorage.setItem('nebra_health_provider', providerId);
        }
    };

    const disconnect = async () => {
        if (activeProvider) {
            await adapters[activeProvider].disconnect();
            setActiveProvider(null);
            localStorage.removeItem('nebra_health_provider');
        }
    };

    const saveSession = async (session: HealthSession) => {
        if (!activeProvider) return;
        try {
            await adapters[activeProvider].saveSession(session);
            console.log(`Session saved to ${activeProvider}`);
        } catch (err) {
            console.error(`Failed to save session to ${activeProvider}:`, err);
        }
    };

    // Auto-connect from local storage
    useEffect(() => {
        const checkAutoConnect = async () => {
            const saved = localStorage.getItem('nebra_health_provider') as HealthProvider;
            if (saved && adapters[saved]) {
                const connected = await adapters[saved].isConnected();
                if (connected) {
                    setActiveProvider(saved);
                }
            }
        };
        checkAutoConnect();
    }, [adapters]);

    return (
        <HealthContext.Provider value={{ activeProvider, isAvailable, connect, disconnect, saveSession }}>
            {children}
        </HealthContext.Provider>
    );
};

export const useHealth = () => {
    const context = useContext(HealthContext);
    if (!context) throw new Error("useHealth must be used within HealthProvider");
    return context;
};
