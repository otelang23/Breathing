import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface HeatmapProps {
    data: Record<string, number>; // date (YYYY-MM-DD) -> minutes
}

export const Heatmap = ({ data }: HeatmapProps) => {
    // Generate last 365 days
    const weeks = useMemo(() => {

        const today = new Date();

        // Align to end of week (Saturday) just like GitHub or similar
        // Or simpler: Just last 52 weeks back from today

        // Let's generate days backwards from today
        const allDays: { date: string; minutes: number }[] = [];
        for (let i = 364; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateKey = d.toISOString().slice(0, 10);
            allDays.push({
                date: dateKey,
                minutes: data[dateKey] || 0
            });
        }

        // Chunk into weeks (Vertical columns usually 7 days)
        // If we simply list row-by-row like GitHub (which is col-by-col actually)
        // GitHub: Columns are weeks. Rows are Mon-Sun.

        // We need to group by week index.
        // Let's verify start day. 
        // Iterate and start a new week column when day is Sunday?





        return allDays;
    }, [data]);

    const getColor = (minutes: number) => {
        if (minutes === 0) return 'bg-white/5';
        if (minutes < 15) return 'bg-emerald-500/20';
        if (minutes < 30) return 'bg-emerald-500/40';
        if (minutes < 60) return 'bg-emerald-500/60';
        return 'bg-emerald-400';
    };

    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="flex gap-1 min-w-max">
                {/*  We need to render columns of weeks. 
                      Since we have a flat list of 365 days, we can slice them.
                      To align strictly to Days of Week (Sun-Sat), we might need padding at start.
                 */}
            </div>
            {/* 
                Actually, simpler approach:
                Grid with 7 rows (Mon-Sun) and auto-flow column.
             */}
            <div className="grid grid-rows-7 grid-flow-col gap-1 w-fit">
                {/* Generate cells. We need to skip empty days at start if we want correct alignment */}
                {weeks.map((day) => (
                    <motion.div
                        key={day.date}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.001 * Math.random() }} // staggered load
                        className={`w-3 h-3 rounded-sm ${getColor(day.minutes)}`}
                        title={`${day.date}: ${day.minutes} mins`}
                    />
                ))}
            </div>
        </div>
    );
};
