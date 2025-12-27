import React, { useState, useEffect } from 'react';
import { AudioEngine } from '../services/AudioEngine';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';
import { SettingsContext, type Theme, type SoundMode, type DailyGoal } from './SettingsContextDefinition';

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>('midnight');
    const [voiceEnabled, setVoiceEnabled] = useState(false);
    const [soundMode, setSoundMode] = useState<SoundMode>('minimal');
    const [volume, setVolume] = useState(0.5);
    const [hapticEnabled, setHapticEnabled] = useState(true);
    const [officeMode, setOfficeMode] = useState(false);
    const [sleepMode, setSleepMode] = useState(false);
    const [focusMode, setFocusMode] = useState(false);
    const [audioVariant, setAudioVariant] = useState<'standard' | 'binaural' | 'noise'>('standard');
    const [dailyGoal, setDailyGoal] = useState<DailyGoal[]>([{ id: 'default', techniqueId: 'any', targetMinutes: 10 }]);
    const [geminiApiKey, setGeminiApiKey] = useState<string>('');
    const { user } = useAuth(); // Access auth for sync

    // 1. Load Settings from Cloud
    useEffect(() => {
        if (!user) return;
        const loadSettings = async () => {
            try {
                const docRef = doc(db, 'users', user.uid, 'settings', 'preferences');
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const data = snap.data();
                    if (data.theme) setTheme(data.theme as Theme);
                    if (data.soundMode) setSoundMode(data.soundMode as SoundMode);
                    if (data.volume) setVolume(data.volume);
                    if (data.hapticEnabled !== undefined) setHapticEnabled(data.hapticEnabled);
                    if (data.officeMode !== undefined) setOfficeMode(data.officeMode);
                    if (data.sleepMode !== undefined) setSleepMode(data.sleepMode);
                    if (data.audioVariant) setAudioVariant(data.audioVariant as 'standard');
                    if (data.geminiApiKey) setGeminiApiKey(data.geminiApiKey);
                    if (data.dailyGoal) {
                        if (Array.isArray(data.dailyGoal)) {
                            setDailyGoal(data.dailyGoal);
                        } else if (typeof data.dailyGoal === 'number') {
                            // Migrate legacy number -> Array
                            setDailyGoal([{ id: 'legacy', techniqueId: 'any', targetMinutes: data.dailyGoal }]);
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load settings", error);
            }
        };
        loadSettings();
    }, [user]);

    // 2. Sync Settings to Cloud (Debounced)
    useEffect(() => {
        if (!user) return;

        const timeoutId = setTimeout(async () => {
            try {
                const docRef = doc(db, 'users', user.uid, 'settings', 'preferences');
                await setDoc(docRef, {
                    theme,
                    soundMode,
                    volume,
                    hapticEnabled,
                    officeMode,
                    sleepMode,
                    focusMode,
                    audioVariant,
                    voiceEnabled,
                    dailyGoal,
                    geminiApiKey // Sync API Key
                }, { merge: true });
            } catch (error) {
                console.error("Failed to save settings", error);
            }
        }, 1000); // 1s debounce

        return () => clearTimeout(timeoutId);
    }, [user, theme, soundMode, volume, hapticEnabled, officeMode, sleepMode, focusMode, audioVariant, voiceEnabled, dailyGoal, geminiApiKey]);

    // Sync volume with AudioEngine
    useEffect(() => {
        const effectiveVolume = soundMode === 'silent' ? 0 : volume;
        AudioEngine.setVolume(effectiveVolume);
    }, [soundMode, volume]);

    // FIX: Apply theme class to document element
    useEffect(() => {
        // Remove all previous theme classes
        document.documentElement.classList.forEach((cls) => {
            if (cls.startsWith('theme-')) {
                document.documentElement.classList.remove(cls);
            }
        });
        // Add new theme class
        if (theme !== 'midnight') {
            document.documentElement.classList.add(`theme-${theme}`);
        }
    }, [theme]);

    const handleSetOfficeMode = (enabled: boolean | ((prev: boolean) => boolean)) => {
        setOfficeMode((prev) => {
            const next = typeof enabled === 'function' ? enabled(prev) : enabled;
            if (next) {
                setSoundMode('minimal');
                setVolume((v) => Math.min(v, 0.3));
                setHapticEnabled(false);
                setAudioVariant('standard');
            }
            return next;
        });
    };

    const value = React.useMemo(() => ({
        theme,
        setTheme,
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
        audioVariant,
        setAudioVariant,
        voiceEnabled,
        setVoiceEnabled,
        dailyGoal,
        setDailyGoal,
        geminiApiKey,
        setGeminiApiKey
    }), [theme, soundMode, volume, hapticEnabled, officeMode, sleepMode, focusMode, audioVariant, voiceEnabled, dailyGoal, geminiApiKey]);

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};
