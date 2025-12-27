import { createContext } from 'react';

export type Theme =
    | 'midnight' | 'ocean' | 'forest' | 'fire' | 'sunset'
    | 'lavender' | 'charcoal' | 'aurora' | 'gold' | 'arctic'
    | 'nebula' | 'earth' | 'zen' | 'plasma' | 'void';

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
    dailyGoal: DailyGoal[];
    setDailyGoal: (goals: DailyGoal[]) => void;
}

export interface DailyGoal {
    id: string;
    techniqueId: string; // 'any' or specific ID like '4-7-8'
    targetMinutes: number;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);
