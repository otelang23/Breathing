import type { HealthServiceAdapter } from './types';

export class AppleHealthMockAdapter implements HealthServiceAdapter {
    id = 'apple' as const;

    isAvailable(): boolean {
        // Not available on web without native wrapper
        return false;
    }

    async connect(): Promise<boolean> {
        console.warn("Apple Health is not supported on Web. Use Capacitor.");
        return false;
    }

    async disconnect(): Promise<void> {
        // No-op
    }

    async isConnected(): Promise<boolean> {
        return false;
    }

    async saveSession(): Promise<void> {
        console.warn("Cannot save to Apple Health on Web.");
    }
}
