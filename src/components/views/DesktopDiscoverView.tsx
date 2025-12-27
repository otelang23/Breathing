import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Moon, Heart, Zap, Clock, ArrowRight, Filter, User as UserIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { TechniqueDetailModal } from '../modals/TechniqueDetailModal';
import { RoutineCreatorModal } from '../modals/RoutineCreatorModal';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from '../../hooks/useSettings';

import { type LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
    sigh: Wind,
    coherent: Heart,
    sleep_478: Moon,
    box: Zap,
    bhramari: Zap,
    voo: Wind
};

// Legacy Filter IDs
const FILTERS = [
    { id: 'all', label: 'All' },
    { id: 'protocol', label: 'Daily Protocol', icon: '📅' },
    { id: 'custom', label: 'Custom', icon: '✨' },
    { id: 'manifestation', label: 'LOA', icon: '🌌' },
    { id: 'panic', label: 'Panic', icon: '🚨' },
    { id: 'interview', label: 'Interview', icon: '💼' },
    { id: 'sleep', label: 'Sleep', icon: '🌙' },
    { id: 'focus', label: 'Focus', icon: '⚡' },
    { id: 'stress', label: 'Stress', icon: '🧘' },
    { id: 'hrv', label: 'HRV', icon: '❤️' },
    { id: 'balance', label: 'Balance', icon: '⚖️' },
];

import type { Technique } from '../../types';

interface DesktopDiscoverViewProps {
    techniques: Technique[];
    onSelectTech: (tech: Technique) => void;
    // onRunPreset: (presetId: string) => void; // Unused
    saveRoutine: (technique: Technique) => void;
    deleteRoutine: (id: string) => void;
}

export const DesktopDiscoverView = ({
    techniques,
    onSelectTech,
    saveRoutine,
    deleteRoutine
}: DesktopDiscoverViewProps) => {

    const { user, signInWithGoogle, signOut } = useAuth();
    const { dailyGoal } = useSettings();
    const [activeFilter, setActiveFilter] = useState('all');
    const [viewDetailTech, setViewDetailTech] = useState<Technique | null>(null);
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);

    const sortedTechniques = useMemo<Technique[]>(() => {
        // Special Case: Daily Protocol
        if (activeFilter === 'protocol') {
            if (!dailyGoal || dailyGoal.length === 0) return [];

            return dailyGoal.map(goal => {
                const originalTech = techniques.find(t => t.id === goal.techniqueId);
                // Handle "Any Technique" if needed, or skip. Assuming 'any' maps to nothing or handled elsewhere.
                // If ID is 'any', we might want to show a generic placeholder or filter it out here.
                if (!originalTech) return null;

                // Return a modified copy with the goal duration
                return {
                    ...originalTech,
                    meta: {
                        ...originalTech.meta,
                        speed: `${goal.targetMinutes} min` // Override duration string
                    },
                    targetDurationSec: goal.targetMinutes * 60 // Inject target seconds
                } as Technique;
            }).filter((t): t is Technique => t !== null);
        }

        let filtered = [...techniques];

        // 1. Filter by Category (if not 'all')
        if (activeFilter !== 'all') {
            filtered = filtered.filter(t => t.categories?.includes(activeFilter));
        }

        // 2. Sort results (Priority: Category match > Rank)
        return filtered.sort((a, b) => {
            // If we are filtering by something that is also a rank (e.g. sleep), sort by that rank
            if (activeFilter !== 'all' && a.ranks?.[activeFilter]) {
                return a.ranks[activeFilter] - b.ranks[activeFilter];
            }
            // Default sort by PAS for 'all' or non-rank filters
            return (a.ranks?.pas || 99) - (b.ranks?.pas || 99);
        });
    }, [techniques, activeFilter, dailyGoal]);

    return (
        <div className="w-full h-full p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header & Account */}
                <div className="flex items-end justify-between border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-thin tracking-wider text-white uppercase drop-shadow-md">Discover</h1>
                        <p className="text-white/40 text-sm font-light mt-2 tracking-wide">Explore techniques to shift your state.</p>
                    </div>

                    {/* Quick Account Status in Header */}
                    <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <div className="text-right">
                            <div className="text-sm font-medium text-white">{user ? user.displayName : 'Guest User'}</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-wider">{user ? 'Sync Active' : 'Local Storage'}</div>
                        </div>
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-white/20" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-white/50" />
                            </div>
                        )}
                        <button
                            onClick={user ? signOut : signInWithGoogle}
                            className="text-xs text-indigo-300 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors"
                        >
                            {user ? 'Log Out' : 'Sign In'}
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-4 w-full">
                    <div className="flex items-center gap-2 p-1 rounded-full bg-white/5 border border-white/10 overflow-x-auto max-w-full no-scrollbar">
                        <div className="px-3 opacity-50"><Filter className="w-4 h-4 text-white" /></div>
                        {FILTERS.map((f) => {
                            const isActive = activeFilter === f.id;
                            return (
                                <button
                                    key={f.id}
                                    onClick={() => setActiveFilter(f.id)}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider transition-all whitespace-nowrap",
                                        isActive
                                            ? "bg-white text-slate-900 shadow-lg scale-105"
                                            : "text-white/50 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    {f.label}
                                </button>
                            );
                        })}
                    </div>

                    {activeFilter === 'custom' && (
                        <button
                            onClick={() => setIsCreatorOpen(true)}
                            className="px-6 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-xs font-bold uppercase tracking-wider hover:bg-emerald-500 hover:text-white transition-all ml-auto"
                        >
                            + Create New
                        </button>
                    )}
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-24">
                    <AnimatePresence mode="popLayout">
                        {sortedTechniques.map((tech, index) => {
                            // Ensure tech is not null (TS should know due to filter, but defensive coding helps)
                            if (!tech) return null;
                            const Icon = ICONS[tech.id] || Wind;
                            // Protocol goals allow duplicates. So we should use a composite key for protocol view, or just index.
                            const uniqueKey = activeFilter === 'protocol' ? `${tech.id}-${index}` : tech.id;

                            return (
                                <motion.button
                                    key={uniqueKey}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    onClick={() => onSelectTech(tech)}
                                    className="group relative flex flex-col items-start p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left overflow-hidden min-h-[300px] backdrop-blur-sm"
                                >
                                    {/* Hover Gradient */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${tech.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                                    {/* Header */}
                                    <div className="flex justify-between w-full mb-6 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-white/10 transition-colors backdrop-blur-md border border-white/5">
                                                <Icon className="w-6 h-6 text-white/80" />
                                            </div>
                                            {/* PAS Score Badge */}
                                            {!!tech.pas && (
                                                <div className="px-2 py-1 rounded-lg bg-green-500/10 text-green-300 border border-green-500/20 text-[10px] font-mono font-bold">
                                                    PAS {tech.pas}
                                                </div>
                                            )}
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-4 group-hover:translate-x-0">
                                            <div className="px-3 py-1 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                                Start <ArrowRight className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="relative z-10 flex-1">
                                        <h4 className="text-3xl font-thin text-white mb-3 tracking-wide">{tech.name}</h4>
                                        <p className="text-sm text-white/50 leading-relaxed font-light">
                                            {tech.description}
                                        </p>
                                    </div>

                                    {/* Footer */}
                                    <div className="mt-6 flex items-center justify-between w-full pt-6 border-t border-white/5 group-hover:border-white/10 transition-colors relative z-10">
                                        <div className="flex items-center gap-2 text-xs font-mono text-white/40">
                                            <Clock className="w-3 h-3" />
                                            <span>{tech.meta?.speed || '5 min'}</span>
                                        </div>

                                        {/* Info Button */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setViewDetailTech(tech); }}
                                            className="px-3 py-1 rounded-full border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-wider text-white/40 hover:text-white transition-colors"
                                        >
                                            Details
                                        </button>
                                    </div>
                                </motion.button>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {viewDetailTech && (
                    <TechniqueDetailModal
                        technique={viewDetailTech}
                        onClose={() => setViewDetailTech(null)}
                        onStart={() => { onSelectTech(viewDetailTech); setViewDetailTech(null); }}
                        onDelete={deleteRoutine}
                    />
                )}
            </AnimatePresence>

            <RoutineCreatorModal
                isOpen={isCreatorOpen}
                onClose={() => setIsCreatorOpen(false)}
                onSave={saveRoutine}
            />
        </div>
    );
};
