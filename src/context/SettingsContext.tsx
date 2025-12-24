import React, { createContext, useContext, useState, useEffect } from 'react';
import { AudioEngine } from '../services/AudioEngine';

type SoundMode = 'silent' | 'minimal' | 'rich';

interface SettingsContextType {
    soundMode: SoundMode;
    setSoundMode: (mode: SoundMode) => void;
    volume: number;
    setVolume: (vol: number) => void;
    hapticEnabled: boolean;
    setHapticEnabled: (enabled: boolean | ((prev: boolean) => boolean)) => void;
    officeMode: boolean;
    setOfficeMode: (enabled: boolean | ((prev: boolean) => boolean)) => void;
    sleepMode: boolean;
    setSleepMode: (enabled: boolean | ((prev: boolean) => boolean)) => void;
    focusMode: boolean; // Managed here for global UI control? Or local to App?
    setFocusMode: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [soundMode, setSoundMode] = useState<SoundMode>('minimal');
    const [volume, setVolume] = useState(0.5);
    const [hapticEnabled, setHapticEnabled] = useState(true);
    const [officeMode, setOfficeMode] = useState(false);
    const [sleepMode, setSleepMode] = useState(false);
    const [focusMode, setFocusMode] = useState(false);

    // Sync volume with AudioEngine
    useEffect(() => {
        const effectiveVolume = soundMode === 'silent' ? 0 : volume;
        AudioEngine.setVolume(effectiveVolume);
    }, [soundMode, volume]);

    const handleSetOfficeMode = (enabled: boolean | ((prev: boolean) => boolean)) => {
        setOfficeMode((prev) => {
            const next = typeof enabled === 'function' ? enabled(prev) : enabled;
            if (next) {
                setSoundMode('minimal');
                setVolume((v) => Math.min(v, 0.3));
                setHapticEnabled(false);
            }
            return next;
        });
    };

    const value = React.useMemo(() => ({
        soundMode,
        setSoundMode,
        volume,
        setVolume,
        hapticEnabled,
        setHapticEnabled,
        officeMode,
        setOfficeMode: handleSetOfficeMode,
        sleepMode,
        setSleepMode,
        focusMode,
        setFocusMode,
    }), [soundMode, volume, hapticEnabled, officeMode, sleepMode, focusMode]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
