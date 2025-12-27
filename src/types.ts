import type { ElementType } from 'react';

export interface TechniqueSteps {
    action: string;
    duration: number;
    scale: number;
    text: string;
    vibration: number[];
    pan?: number; // -1 (Left) to 1 (Right)
}

export interface Technique {
    id: string;
    name: string;
    tagline: string;
    description: string;
    optimalDuration?: string;
    tip: string;
    audioProfile?: {
        baseFreq: number;
        binauralBeat: number; // Hz difference
    };
    strength: string;
    science?: {
        mechanism: string;
        benefits: string[];
    };
    transition?: {
        nextTechId: string;
        condition: string;
    };
    pas: number;
    ranks: {
        pas: number;
        stress: number;
        speed: number;
        hrv: number;
        sleep: number;
        deepSleep: number;
        discreet: number;
        [key: string]: number;
    };
    meta: Record<string, string | undefined>;
    color: string;
    entrainmentFreq?: number;
    steps: TechniqueSteps[];
    categories?: string[];
    isCustom?: boolean;
    targetDurationSec?: number;
}

export interface PresetSegment {
    techId: string;
    durationSec: number;
}

export interface Preset {
    id: string;
    label: string;
    description: string;
    icon: ElementType; // Lucide icon type is complex, leaving explicit any or React.ElementType if possible but usually any in data
    segments: PresetSegment[];
}

export interface Filter {
    id: string;
    label: string;
    icon: ElementType;
}

export interface SessionStats {
    totalSeconds: number;
    cycleCount: number;
    formatTime: (s: number) => string;
}

export interface DailyLogEntry {
    techSeconds: Record<string, number>;
    protocolCompleted: boolean;
}

export interface DailyLogMap {
    [date: string]: DailyLogEntry;
}

export interface UserStats {
    streak: number;
    totalMinutes: number;
}
