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
                        const totalSecs = Object.values(val.techSeconds || {}).reduce((a: number, b: unknown) => a + (b as number), 0);
                        dataMap[days[i].date] = Math.floor(totalSecs / 60);
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
                            const totalSecs = Object.values(entry.techSeconds || {}).reduce((a: number, b: unknown) => a + (b as number), 0);
                            dataMap[d.date] = Math.floor(totalSecs / 60);
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
        };

        fetchStats();
    }, [user]);

    return { stats, userStats };
};
