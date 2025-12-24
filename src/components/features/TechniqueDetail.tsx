
import { Zap } from 'lucide-react';
import { getTechniqueIcon } from '../../utils/icons';
import type { Technique } from '../../types';

export const TechniqueDetail = ({
    selectedTech,
    filterId,
    filterLabel,
}: {
    selectedTech: Technique;
    filterId: string;
    filterLabel: string;
}) => {
    return (
        <aside className="flex flex-col w-full max-w-xs bg-surface/70 border border-white/5 rounded-2xl p-4 gap-3 shadow-lg shadow-black/40">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-white/10 text-text-main">
                        {getTechniqueIcon(selectedTech.id)}
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-text-main">
                            {selectedTech.name}
                        </h3>
                        <p className="text-[11px] text-text-muted uppercase tracking-[0.16em]">
                            {selectedTech.tagline}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] text-text-muted uppercase tracking-[0.16em]">
                        PAS
                    </span>
                    <span className="text-lg font-mono font-bold text-primary">
                        {selectedTech.pas}
                    </span>
                </div>
            </div>
            <p className="text-xs text-text-main/80 leading-relaxed">
                {selectedTech.description}
            </p>
            <div className="flex items-start gap-2 mt-1">
                <Zap className="w-3 h-3 text-primary mt-[3px]" />
                <p className="text-xs text-primary-light">{selectedTech.strength}</p>
            </div>
            <div className="mt-2 text-[11px] text-text-muted">
                <span className="font-mono uppercase tracking-[0.16em] text-text-muted">
                    Sorted by {filterLabel}
                </span>
                <div className="mt-1 text-xs">
                    Rank{' '}
                    <span className="font-mono font-semibold text-text-main">
                        #{selectedTech.ranks[filterId as keyof typeof selectedTech.ranks] ?? '–'}
                    </span>{' '}
                    ·{' '}
                    <span className="text-primary">
                        {selectedTech.meta?.[filterId] || selectedTech.tagline}
                    </span>
                </div>
            </div>
        </aside>
    );
};
