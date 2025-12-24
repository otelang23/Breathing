import { useState, useMemo } from 'react';
import { EVENING_MANDATORY_THRESHOLDS } from '../data/thresholds';

interface DailyLog {
    [date: string]: {
        techSeconds: Record<string, number>;
        protocolCompleted: boolean;
    };
}



export const useDailyLog = () => {
    const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

    const [dailyLog, setDailyLog] = useState<DailyLog>(() => {
        if (typeof window === 'undefined') return {};
        try {
            const raw = window.localStorage.getItem('nebraBreathLog');
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    });

    // Helper to calculate compliance for a given set of tech seconds
    const checkCompliance = (secondsMap: Record<string, number>) => {
        const mandatoryIds = Object.keys(EVENING_MANDATORY_THRESHOLDS);
        let doneCount = 0;
        mandatoryIds.forEach((id) => {
            const threshold = (EVENING_MANDATORY_THRESHOLDS as Record<string, number>)[id];
            if ((secondsMap[id] || 0) >= threshold) doneCount += 1;
        });
        return {
            doneCount,
            total: mandatoryIds.length,
            completed: doneCount === mandatoryIds.length
        };
    };

    const persistLog = (log: DailyLog) => {
        if (typeof window === 'undefined') return;
        try {
            window.localStorage.setItem('nebraBreathLog', JSON.stringify(log));
        } catch {
            // ignore
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

            persistLog(updatedLog);
            return updatedLog;
        });
    };

    const resetData = () => {
        setDailyLog({});
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('nebraBreathLog');
        }
    };

    const todayLog = useMemo(() => dailyLog[todayKey] || { techSeconds: {}, protocolCompleted: false }, [dailyLog, todayKey]);

    // Memoize compliance for UI display
    const compliance = useMemo(() => checkCompliance(todayLog.techSeconds), [todayLog.techSeconds]);

    return { dailyLog, todayLog, logSeconds, resetData, compliance };
};
