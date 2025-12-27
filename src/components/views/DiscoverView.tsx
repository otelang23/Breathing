import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind, Moon, Heart, Zap, Clock, Filter, type LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { RoutineCreatorModal } from '../modals/RoutineCreatorModal';
import { useSettings } from '../../hooks/useSettings';

import type { Technique } from '../../types';

// Icons map
const ICONS: Record<string, LucideIcon> = {
    sigh: Wind,
    coherent: Heart,
    sleep_478: Moon,
    box: Zap,
    bhramari: Zap,
    voo: Wind // or something else
};

interface DiscoverViewProps {
    techniques: Technique[];
    onSelectTech: (t: Technique) => void;
    onRunPreset: (id: string) => void;
    saveRoutine: (t: Technique) => void;
}

export const DiscoverView = ({
    techniques,
    onSelectTech,
    onRunPreset,
    saveRoutine,
}: DiscoverViewProps) => {

    const { dailyGoal } = useSettings();
    const [isCreatorOpen, setIsCreatorOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('all');

    const sortedTechniques = useMemo<Technique[]>(() => {
        if (activeFilter === 'protocol') {
            if (!dailyGoal || dailyGoal.length === 0) return [];
            return dailyGoal.map(goal => {
                const originalTech = techniques.find(t => t.id === goal.techniqueId);
                if (!originalTech) return null;
                return {
                    ...originalTech,
                    meta: {
                        ...originalTech.meta,
                        speed: `${goal.targetMinutes} min`
                    },
                    targetDurationSec: goal.targetMinutes * 60
                } as Technique;
            }).filter((t): t is Technique => t !== null);
        }

        let filtered = [...techniques];
        if (activeFilter !== 'all') {
            filtered = filtered.filter(t => t.categories?.includes(activeFilter));
        }
        return filtered.sort((a, b) => {
            if (activeFilter !== 'all' && a.ranks?.[activeFilter]) {
                return a.ranks[activeFilter] - b.ranks[activeFilter];
            }
            return (a.ranks?.pas || 99) - (b.ranks?.pas || 99);
        });
    }, [techniques, activeFilter, dailyGoal]);


    return (
        <div className="w-full h-full overflow-y-auto pb-32 pt-12 px-6">
            <div className="max-w-md mx-auto space-y-10">

                {/* Header */}
                <h1 className="text-3xl font-bold text-white tracking-tight">Discover</h1>
                <p className="text-white/40 text-sm">Find your rhythm.</p>
            </div>

            {/* Filter Tabs - Horizontal Scroll */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 shrink-0">
                    <Filter className="w-3 h-3 text-white/50" />
                </div>
                {[
                    { id: 'all', label: 'All' },
                    { id: 'protocol', label: 'Daily Protocol' },
                    { id: 'custom', label: 'Custom', icon: '✨' },
                    { id: 'manifestation', label: 'LOA', icon: '🌌' }, // Added LOA
                    { id: 'hrv', label: 'HRV', icon: '❤️' },
                    { id: 'sleep', label: 'Sleep', icon: '🌙' },
                    { id: 'stress', label: 'Stress', icon: '🧘' },
                    { id: 'focus', label: 'Focus', icon: '⚡' },
                    { id: 'panic', label: 'Panic', icon: '🚨' },
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setActiveFilter(f.id)}
                        className={cn(
                            "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors border",
                            activeFilter === f.id
                                ? "bg-white text-black border-white"
                                : "bg-white/5 text-white/50 border-white/5 hover:border-white/20"
                        )}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Featured Carousel (Techniques) */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Techniques</h3>
                    {activeFilter === 'custom' && (
                        <button
                            onClick={() => setIsCreatorOpen(true)}
                            className="text-xs font-bold text-emerald-400 uppercase tracking-widest hover:text-emerald-300 transition-colors"
                        >
                            + Create New
                        </button>
                    )}
                </div>

                <div className="flex flex-col gap-4">
                    <AnimatePresence mode="popLayout">
                        {sortedTechniques.map((tech, index) => {
                            const Icon = ICONS[tech.id] || Wind;
                            const uniqueKey = activeFilter === 'protocol' ? `${tech.id}-${index}` : tech.id;

                            return (
                                <motion.div
                                    layout
                                    key={uniqueKey}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => {
                                        if (navigator.vibrate) navigator.vibrate(10);
                                        onSelectTech(tech);
                                    }}
                                    className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition-colors cursor-pointer active:scale-95 duration-200"
                                >
                                    {/* Background Gradient Splash */}
                                    <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${tech.color} opacity-20 blur-3xl group-hover:opacity-30 transition-opacity`} />

                                    <div className="relative z-10 flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`p-2 rounded-full bg-white/5`}>
                                                    <Icon className="w-4 h-4 text-white/80" />
                                                </div>
                                                <span className="text-xs font-mono text-white/40 uppercase tracking-wider">{tech.tagline}</span>
                                            </div>
                                            <h4 className="text-xl font-semibold text-white">{tech.name}</h4>
                                            <p className="text-sm text-white/50 leading-relaxed max-w-[80%]">
                                                {tech.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between gap-4 text-xs font-mono text-white/40">
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>{tech.meta?.speed || '5 min'}</span>
                                            </div>
                                            {tech.pas && (
                                                <div className="px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-bold">
                                                    PAS {tech.pas}
                                                </div>
                                            )}
                                        </div>
                                        {activeFilter !== 'all' && tech.ranks?.[activeFilter] && (
                                            <span className="text-white/20">#{tech.ranks[activeFilter]}</span>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </section>

            <RoutineCreatorModal
                isOpen={isCreatorOpen}
                onClose={() => setIsCreatorOpen(false)}
                onSave={saveRoutine}
            />

            {/* Presets Grid */}
            <section>
                <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Daily Routines</h3>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: 'morning_ramp', label: 'Morning Ramp', desc: 'Wake up', icon: Zap },
                        { id: 'sleep_descent', label: 'Sleep Descent', desc: 'Drift off', icon: Moon },
                    ].map((preset, i) => (
                        <motion.button
                            key={preset.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            onClick={() => {
                                if (navigator.vibrate) navigator.vibrate(10);
                                onRunPreset(preset.id);
                            }}
                            className="flex flex-col items-start p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 active:scale-95 transition-all text-left"
                        >
                            <preset.icon className="w-5 h-5 text-white/60 mb-3" />
                            <span className="text-sm font-semibold text-white">{preset.label}</span>
                            <span className="text-xs text-white/40 mt-1">{preset.desc}</span>
                        </motion.button>
                    ))}
                </div>
            </section>
        </div>

    );
};
