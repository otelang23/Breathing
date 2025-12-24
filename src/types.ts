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
    strength: string;
    pas: number;
    ranks: {
        pas: number;
        stress: number;
        speed: number;
        hrv: number;
        sleep: number;
        deepSleep: number;
        discreet: number;
    };
    meta: Record<string, string | undefined>;
    color: string;
    entrainmentFreq?: number;
    steps: TechniqueSteps[];
}

export interface PresetSegment {
    techId: string;
    durationSec: number;
}

export interface Preset {
    id: string;
    label: string;
    description: string;
    icon: any; // Lucide icon type is complex, leaving explicit any or React.ElementType if possible but usually any in data
    segments: PresetSegment[];
}

export interface Filter {
    id: string;
    label: string;
    icon: any;
}
