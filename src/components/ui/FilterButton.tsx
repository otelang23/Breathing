

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
            ? 'bg-primary text-background shadow-lg shadow-white/10'
            : 'bg-surface/70 text-text-muted hover:bg-surface hover:text-text-main border border-transparent hover:border-white/10'
            }`}
    >
        {Icon && <Icon className="w-3 h-3" />}
        {label}
    </button>
);
