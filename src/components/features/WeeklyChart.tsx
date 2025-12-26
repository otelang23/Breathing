import { motion } from 'framer-motion';

interface WeeklyChartProps {
    data: { dayName: string; minutes: number }[];
}

export const WeeklyChart = ({ data }: WeeklyChartProps) => {
    const maxVal = Math.max(...data.map(d => d.minutes), 20); // Scale to at least 20m

    return (
        <div className="flex items-end justify-between h-32 w-full gap-2">
            {data.map((d, i) => {
                const heightPct = (d.minutes / maxVal) * 100;
                return (
                    <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <div className="w-full relative flex items-end h-full">
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPct}%` }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className={`w-full rounded-t-sm transition-colors ${d.minutes > 0 ? 'bg-emerald-500/50' : 'bg-white/5'}`}
                            />
                        </div>
                        <span className="text-[10px] text-white/40 uppercase">{d.dayName}</span>
                    </div>
                );
            })}
        </div>
    );
};
