

export const StatCard = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
    <div className="bg-surface/70 border border-white/10 backdrop-blur-md p-3 md:p-4 rounded-2xl flex flex-col items-center justify-center w-full">
        <span className="text-text-muted text-[10px] md:text-xs uppercase tracking-wider font-semibold mb-1">
            {label}
        </span>
        <span className="text-xl md:text-2xl font-bold text-text-main font-mono">{value}</span>
        {sub && <span className="text-[10px] md:text-xs text-text-muted mt-1">{sub}</span>}
    </div>
);
