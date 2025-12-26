import type { HealthServiceAdapter, HealthSession } from './types';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const SCOPES = [
    'https://www.googleapis.com/auth/fitness.activity.write'
];

export class GoogleFitAdapter implements HealthServiceAdapter {
    id = 'google' as const;
    private token: string | null = null;

    isAvailable(): boolean {
        // Technically available on any web browser
        return true;
    }

    async connect(): Promise<boolean> {
        try {
            const provider = new GoogleAuthProvider();
            SCOPES.forEach(scope => provider.addScope(scope));

            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);

            if (credential?.accessToken) {
                this.token = credential.accessToken;
                return true;
            }
            return false;
        } catch (error) {
            console.error("Google Fit Auth Error:", error);
            return false;
        }
    }

    async disconnect(): Promise<void> {
        this.token = null;
    }

    async isConnected(): Promise<boolean> {
        return !!this.token;
    }

    async saveSession(session: HealthSession): Promise<void> {
        if (!this.token) throw new Error("Not connected to Google Fit");

        const startTimeMillis = session.startTime.getTime();
        const endTimeMillis = session.endTime.getTime();
        const sessionId = `nebra_session_${startTimeMillis}`;

        // Fitness API: Create Session
        const sessionBody = {
            id: sessionId,
            startTimeMillis: startTimeMillis,
            endTimeMillis: endTimeMillis,
            name: `Breathing: ${session.techniqueName}`,
            description: "Mindful breathing session via Nebra",
            activityType: 115, // "Meditation" (closest match to breathing)
            application: {
                detailsUrl: "https://nebra.app",
                name: "Nebra Breath",
                version: "1.0"
            }
        };

        const response = await fetch('https://www.googleapis.com/fitness/v1/users/me/sessions/' + sessionId, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sessionBody)
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Google Fit API Error: ${err}`);
        }
    }
}
