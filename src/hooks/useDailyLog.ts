import { useState, useMemo, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useSettings } from './useSettings';

interface DailyLog {
    [date: string]: {
        techSeconds: Record<string, number>;
        protocolCompleted: boolean;
    };
}

export const useDailyLog = () => {
    const { user } = useAuth();
    const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

    // Initialize from LocalStorage
    const [dailyLog, setDailyLog] = useState<DailyLog>(() => {
        if (typeof globalThis.window === 'undefined') return {};
        try {
            const raw = globalThis.window.localStorage.getItem('nebraBreathLog');
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    });

    const { dailyGoal } = useSettings();

    // Helper to calculate compliance (Based on Configured Goals)
    const checkCompliance = (secondsMap: Record<string, number>) => {
        if (!dailyGoal || dailyGoal.length === 0) return { doneCount: 0, total: 0, completed: true };

        let goalsMet = 0;

        dailyGoal.forEach(goal => {
            let currentSeconds = 0;
            if (goal.techniqueId === 'any') {
                currentSeconds = Object.values(secondsMap).reduce((a, b) => a + b, 0);
            } else {
                currentSeconds = secondsMap[goal.techniqueId] || 0;
            }

            if (currentSeconds >= goal.targetMinutes * 60) {
                goalsMet++;
            }
        });

        return {
            doneCount: goalsMet,
            total: dailyGoal.length,
            completed: goalsMet === dailyGoal.length
        };
    };

    // 1. Persist to LocalStorage whenever dailyLog changes
    useEffect(() => {
        if (typeof globalThis.window === 'undefined') return;
        try {
            globalThis.window.localStorage.setItem('nebraBreathLog', JSON.stringify(dailyLog));
        } catch {
            // ignore
        }
    }, [dailyLog]);

    // 2. Sync FROM Cloud on Auth Login (Merge Logic)
    useEffect(() => {
        if (!user) return;

        const syncFromCloud = async () => {
            // For now, we only sync TODAY's log to ensure real-time progress across devices.
            // Full history sync would require a collection fetch. 
            // We prioritize immediate "Evening Protocol" syncing.
            const docRef = doc(db, 'users', user.uid, 'dailyLogs', todayKey);
            try {
                const snap = await getDoc(docRef);
                if (snap.exists()) {
                    const cloudData = snap.data();
                    // Merge Cloud -> Local
                    setDailyLog(prev => {
                        const localDay = prev[todayKey] || { techSeconds: {}, protocolCompleted: false };
                        const mergedSeconds = { ...localDay.techSeconds };

                        // Take max of local vs cloud to avoid overwrite race conditions (simple CRDT-ish)
                        Object.entries(cloudData.techSeconds || {}).forEach(([tId, secs]) => {
                            mergedSeconds[tId] = Math.max(mergedSeconds[tId] || 0, secs as number);
                        });

                        const { completed } = checkCompliance(mergedSeconds);

                        return {
                            ...prev,
                            [todayKey]: {
                                techSeconds: mergedSeconds,
                                protocolCompleted: completed
                            }
                        };
                    });
                }
            } catch (e) {
                console.error("Sync Error", e);
            }
        };

        syncFromCloud();
    }, [user, todayKey]);

    // 3. Sync TO Cloud (Debounced or immediate? Immediate for now)
    const syncToCloud = async (log: DailyLog) => {
        if (!user) return;

        const dayData = log[todayKey];
        if (!dayData) return;

        const docRef = doc(db, 'users', user.uid, 'dailyLogs', todayKey);
        try {
            await setDoc(docRef, dayData, { merge: true });
        } catch (e) {
            console.error("Save Error", e);
        }
    };

    const logSeconds = (techId: string, seconds: number) => {
        setDailyLog((prev: DailyLog) => {
            const day = prev[todayKey] || { techSeconds: {}, protocolCompleted: false };
            const techSec = { ...day.techSeconds };
            techSec[techId] = (techSec[techId] || 0) + seconds;

            // Check compliance immediately
            const { completed } = checkCompliance(techSec);

            const updatedDay = {
                techSeconds: techSec,
                protocolCompleted: completed, // Update immediately
            };

            const updatedLog = {
                ...prev,
                [todayKey]: updatedDay,
            };

            // Trigger cloud sync
            syncToCloud(updatedLog); // Fire and forget

            return updatedLog;
        });
    };

    const resetData = () => {
        setDailyLog({});
        if (typeof globalThis.window !== 'undefined') {
            globalThis.window.localStorage.removeItem('nebraBreathLog');
        }
    };

    const todayLog = useMemo(() => dailyLog[todayKey] || { techSeconds: {}, protocolCompleted: false }, [dailyLog, todayKey]);

    // Memoize compliance for UI display
    const compliance = useMemo(() => checkCompliance(todayLog.techSeconds), [todayLog.techSeconds, dailyGoal]);

    return { dailyLog, todayLog, logSeconds, resetData, compliance };
};
