

export const FilterButton = ({
    active,
    label,
    icon: Icon,
    onClick,
}: {
    active: boolean;
    label: string;
    icon: React.ElementType;
    onClick: () => void;
}) => (
    <button
        onClick={onClick}
        aria-pressed={active ? "true" : "false"}
        aria-label={label}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${active
            ? 'bg-slate-200 text-slate-900 shadow-lg shadow-white/10'
            : 'bg-slate-900/70 text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent hover:border-slate-700'
            }`}
    >
        {Icon && <Icon className="w-3 h-3" />}
        {label}
    </button>
);
