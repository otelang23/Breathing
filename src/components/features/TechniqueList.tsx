
import { Activity, Wind, Heart, Moon, Zap, Mic, Box } from 'lucide-react';
import type { Technique } from '../../types';

const getTechniqueIcon = (id: string) => {
    switch (id) {
        case 'sigh': return <Wind className="w-5 h-5" />;
        case 'coherent': return <Heart className="w-5 h-5" />;
        case 'box': return <Box className="w-5 h-5" />;
        case 'sleep_478': return <Moon className="w-5 h-5" />;
        case 'bhramari': return <Zap className="w-5 h-5" />;
        case 'voo': return <Mic className="w-5 h-5" />;
        case 'deep_calm': return <Heart className="w-5 h-5" />;
        case 'tranquility': return <Moon className="w-5 h-5" />;
        default: return <Activity className="w-5 h-5" />;
    }
};

export const TechniqueList = ({
    techniques,
    selectedId,
    filterId,
    dailyLog,
    onSelect
}: {
    techniques: Technique[];
    selectedId: string;
    filterId: string;
    dailyLog: { techSeconds?: Record<string, number> };
    onSelect: (tech: Technique) => void;
}) => {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full max-h-[32vh] overflow-y-auto pr-2 custom-scrollbar">
            {techniques.map((tech) => {
                const isSelected = tech.id === selectedId;
                const metaText = tech.meta?.[filterId] || tech.tagline;
                const todaySeconds = dailyLog?.techSeconds?.[tech.id] ?? 0;

                return (
                    <button
                        key={tech.id}
                        onClick={() => onSelect(tech)}
                        className={`relative p-3 rounded-xl border transition-all duration-200 flex flex-col items-start gap-2 text-left group ${isSelected
                            ? 'bg-primary/20 border-primary shadow-lg shadow-black/40'
                            : 'bg-surface/60 border-white/5 hover:bg-surface hover:border-white/10'
                            }`}
                        aria-pressed={isSelected ? 'true' : 'false'}
                    >
                        <div className="flex justify-between w-full items-start gap-1">
                            <div
                                className={`p-1.5 rounded-lg ${isSelected
                                    ? 'bg-background text-primary'
                                    : 'bg-white/10 text-text-muted group-hover:text-text-main'
                                    }`}
                            >
                                {getTechniqueIcon(tech.id)}
                            </div>
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-background text-text-muted">
                                #{tech.ranks[filterId as keyof typeof tech.ranks] ?? '-'}
                            </span>
                        </div>
                        <div>
                            <div
                                className={`text-xs font-bold leading-tight ${isSelected ? 'text-primary' : 'text-text-main group-hover:text-white'
                                    }`}
                            >
                                {tech.name}
                            </div>
                            <div className="text-[10px] text-text-muted mt-1 truncate w-full">
                                <span className="text-primary/90">{metaText}</span>
                            </div>
                        </div>
                        <div className="mt-1 text-[10px] text-text-muted font-mono">
                            {todaySeconds > 0 && (
                                <span className="text-text-muted/80">
                                    Today: {Math.round(todaySeconds / 60)}m
                                </span>
                            )}
                        </div>
                        {isSelected && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-primary-light to-primary-dark rounded-b-xl" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};
