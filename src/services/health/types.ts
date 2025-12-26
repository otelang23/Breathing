export type HealthProvider = 'apple' | 'google';

export interface HealthSession {
    startTime: Date;
    endTime: Date;
    durationSeconds: number;
    techniqueName: string;
    techniqueId: string;
    caloriesBurned?: number; // Optional estimate
}

export interface HealthServiceAdapter {
    id: HealthProvider;
    isAvailable: () => boolean;
    connect: () => Promise<boolean>;
    disconnect: () => Promise<void>;
    isConnected: () => Promise<boolean>;
    saveSession: (session: HealthSession) => Promise<void>;
}

export interface HealthContextType {
    activeProvider: HealthProvider | null;
    isAvailable: Record<HealthProvider, boolean>;
    connect: (provider: HealthProvider) => Promise<void>;
    disconnect: () => Promise<void>;
    saveSession: (session: HealthSession) => Promise<void>;
}
