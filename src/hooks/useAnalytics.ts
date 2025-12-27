import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface DayStat {
    date: string; // YYYY-MM-DD
    dayName: string; // "Mon", "Tue"
    minutes: number;
}

export const useAnalytics = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState<DayStat[]>([]);
    const [heatmapData, setHeatmapData] = useState<Record<string, number>>({});
    const [userStats, setUserStats] = useState({ streak: 0, totalMinutes: 0 });
    const [techniqueStats, setTechniqueStats] = useState<Record<string, number>>({});

    useEffect(() => {

        const fetchStats = async () => {
            const dataMap: Record<string, number> = {};
            const techAgg: Record<string, number> = {}; // Aggregate seconds per technique

            if (user) {
                // 1. Fetch History (Last 365 days) from Collection
                try {
                    const logsRef = collection(db, 'users', user.uid, 'dailyLogs');
                    // IDs are YYYY-MM-DD, so lex order by ID desc gives us recent first
                    const q = query(logsRef, orderBy('__name__', 'desc'), limit(365));
                    const snapshot = await getDocs(q);

                    snapshot.forEach(doc => {
                        const val = doc.data();
                        const date = doc.id;
                        const dailyTechSeconds = val.techSeconds || {};
                        const totalSecs = Object.values(dailyTechSeconds).reduce((a: number, b: unknown) => a + (b as number), 0);
                        dataMap[date] = Math.floor(totalSecs / 60);

                        // Aggregate Technique Stats
                        Object.entries(dailyTechSeconds).forEach(([techId, secs]) => {
                            techAgg[techId] = (techAgg[techId] || 0) + (secs as number);
                        });
                    });

                    // 2. Fetch User Summary Stats
                    const summarySnap = await getDoc(doc(db, 'users', user.uid, 'stats', 'summary'));
                    if (summarySnap.exists()) {
                        const s = summarySnap.data();
                        setUserStats({
                            streak: s.currentStreak || 0,
                            totalMinutes: Math.floor(s.totalMinutes || 0)
                        });
                    } else {
                        // Fallback: Calculate from local aggregation if summary missing
                        // (Rough estimate as collection limit is 365)
                        const totalMins = Object.values(dataMap).reduce((a, b) => a + b, 0);
                        setUserStats({ streak: 0, totalMinutes: totalMins });
                    }

                } catch (e) {
                    console.error("Error fetching analytics", e);
                }

            } else {
                // Fetch from LocalStorage
                try {
                    const raw = localStorage.getItem('nebraBreathLog');
                    const updates = raw ? JSON.parse(raw) : {};
                    let localTotalSecs = 0;

                    Object.entries(updates).forEach(([date, day]) => {
                        const d = day as { techSeconds?: Record<string, number> };
                        const dailyTechSeconds = d.techSeconds || {};
                        const totalSecs = Object.values(dailyTechSeconds).reduce((a: number, b: unknown) => a + (b as number), 0);

                        dataMap[date] = Math.floor(totalSecs / 60);
                        localTotalSecs += totalSecs;

                        // Aggregate Technique Stats
                        Object.entries(dailyTechSeconds).forEach(([techId, secs]) => {
                            techAgg[techId] = (techAgg[techId] || 0) + (secs as number);
                        });
                    });

                    setUserStats({ streak: 0, totalMinutes: Math.floor(localTotalSecs / 60) });
                } catch {
                    // Ignore parsing errors
                }
            }

            setHeatmapData(dataMap);

            // Generate Last 7 Days for Chart
            const days: DayStat[] = [];
            const today = new Date();
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateKey = d.toISOString().slice(0, 10);
                days.push({
                    date: dateKey,
                    dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
                    minutes: dataMap[dateKey] || 0
                });
            }
            setStats(days);

            // Convert techAgg seconds to minutes
            const techMins: Record<string, number> = {};
            Object.entries(techAgg).forEach(([k, v]) => {
                techMins[k] = Math.floor(v / 60);
            });
            setTechniqueStats(techMins);
        };

        fetchStats();
    }, [user]);

    return { stats, userStats, techniqueStats, heatmapData };
};
