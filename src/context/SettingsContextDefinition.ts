import { createContext } from 'react';

export type Theme = 'midnight' | 'ocean' | 'forest' | 'sunset';

export type SoundMode = 'silent' | 'minimal' | 'rich';

export interface SettingsContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
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
    focusMode: boolean;
    setFocusMode: (enabled: boolean) => void;
    audioVariant: 'standard' | 'binaural' | 'noise';
    setAudioVariant: (variant: 'standard' | 'binaural' | 'noise') => void;
    voiceEnabled: boolean;
    setVoiceEnabled: (enabled: boolean) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
