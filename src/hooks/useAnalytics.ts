import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface DayStat {
    date: string; // YYYY-MM-DD
    dayName: string; // "Mon", "Tue"
    minutes: number;
}

export const useAnalytics = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<DayStat[]>([]);
    const [userStats, setUserStats] = useState({ streak: 0, totalMinutes: 0 });
    const [techniqueStats, setTechniqueStats] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchStats = async () => {
            const days: { date: string; dayName: string; obj: Date }[] = [];
            const today = new Date();

            // Generate last 7 days keys
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                days.push({
                    date: d.toISOString().slice(0, 10),
                    dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
                    obj: d
                });
            }

            const dataMap: Record<string, number> = {};
            const techAgg: Record<string, number> = {}; // Aggregate seconds per technique

            if (user) {
                // 1. Fetch Weekly Data
                const promises = days.map(d => {
                    const docId = d.date.replaceAll('/', '-');
                    return getDoc(doc(db, 'users', user.uid, 'dailyLogs', docId));
                });

                // 2. Fetch User Summary Stats
                const summaryPromise = getDoc(doc(db, 'users', user.uid, 'stats', 'summary'));

                const [summarySnap, ...snapshots] = await Promise.all([summaryPromise, ...promises]);

                // Process Summary
                if (summarySnap.exists()) {
                    const s = summarySnap.data();
                    setUserStats({
                        streak: s.currentStreak || 0,
                        totalMinutes: Math.floor(s.totalMinutes || 0)
                    });
                } else {
                    setUserStats({ streak: 0, totalMinutes: 0 });
                }

                snapshots.forEach((snap, i) => {
                    if (snap.exists()) {
                        const val = snap.data();
                        const dailyTechSeconds = val.techSeconds || {};
                        const totalSecs = Object.values(dailyTechSeconds).reduce((a: number, b: unknown) => a + (b as number), 0);
                        dataMap[days[i].date] = Math.floor(totalSecs / 60);

                        // Aggregate Technique Stats
                        Object.entries(dailyTechSeconds).forEach(([techId, secs]) => {
                            techAgg[techId] = (techAgg[techId] || 0) + (secs as number);
                        });
                    }
                });

            } else {
                // Fetch from LocalStorage
                try {
                    const raw = localStorage.getItem('nebraBreathLog');
                    const updates = raw ? JSON.parse(raw) : {};
                    let localTotalSecs = 0;

                    Object.values(updates).forEach((day: unknown) => {
                        const d = day as { techSeconds?: Record<string, number> };
                        localTotalSecs += Object.values(d.techSeconds || {}).reduce((a: number, b: unknown) => a + (b as number), 0);
                    });

                    days.forEach(d => {
                        const entry = updates[d.date] as { techSeconds?: Record<string, number> } | undefined;
                        if (entry) {
                            const dailyTechSeconds = entry.techSeconds || {};
                            const totalSecs = Object.values(dailyTechSeconds).reduce((a: number, b: unknown) => a + (b as number), 0);
                            dataMap[d.date] = Math.floor(totalSecs / 60);

                            // Aggregate Technique Stats
                            Object.entries(dailyTechSeconds).forEach(([techId, secs]) => {
                                techAgg[techId] = (techAgg[techId] || 0) + (secs as number);
                            });
                        }
                    });

                    setUserStats({ streak: 0, totalMinutes: Math.floor(localTotalSecs / 60) });
                } catch {
                    // Ignore parsing errors
                }
            }

            setStats(days.map(d => ({
                date: d.date,
                dayName: d.dayName,
                minutes: dataMap[d.date] || 0
            })));

            // Convert techAgg seconds to minutes
            const techMins: Record<string, number> = {};
            Object.entries(techAgg).forEach(([k, v]) => {
                techMins[k] = Math.floor(v / 60);
            });
            setTechniqueStats(techMins);
        };

        fetchStats();
    }, [user]);

    return { stats, userStats, techniqueStats };
};
