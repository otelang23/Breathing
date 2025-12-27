import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Info, Wind, Clock } from 'lucide-react';
import { Orb2 } from '../ui/Orb2';
import { cn } from '../../lib/utils';;

import { useSettings } from '../../hooks/useSettings';
import { GRADIENTS } from '../../constants/themes';

import type { Technique, SessionStats } from '../../types';

interface DesktopBreatheViewProps {
    isActive: boolean;
    currentStep: {
        text: string;
        action: string;
        duration: number;
    };
    currentStepIndex: number;
    selectedTech: Technique;
    stepProgress: number;
    displaySeconds: string;
    sessionStats: SessionStats;
    controls: {
        toggle: () => void;
        reset: () => void;
        stop: () => void;
    };
    sessionRemaining?: string;
}

export const DesktopBreatheView = ({
    isActive,
    currentStep,
    currentStepIndex,
    selectedTech,
    stepProgress,
    displaySeconds,
    sessionStats,
    controls,
    sessionRemaining
}: DesktopBreatheViewProps) => {
    const { theme } = useSettings();
    const currentGradient = GRADIENTS[theme];

    // Simple interaction state
    const [hoveredControl, setHoveredControl] = useState<string | null>(null);

    return (
        <div className="w-full h-full p-8 grid grid-cols-12 gap-8 items-center relative overflow-hidden">

            {/* Left Column: Context & Stats */}
            <div className="col-span-3 flex flex-col justify-center space-y-12 z-10">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60 tracking-wider uppercase">
                            <Wind className="w-3 h-3" />
                            <span>{selectedTech.name}</span>
                        </div>
                        {/* PAS Score Badge */}
                        {selectedTech.pas && (
                            <div className="px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20 text-[10px] font-mono font-bold tracking-tight">
                                PAS {selectedTech.pas}
                            </div>
                        )}
                    </div>
                    {/* Tagline */}
                    <div className="text-white/40 text-sm font-light tracking-wide">{selectedTech.tagline}</div>

                    {/* Optimal Duration */}
                    {selectedTech.optimalDuration && (
                        <div className="flex items-center gap-2 text-xs text-white/30 font-mono uppercase tracking-wider">
                            <Clock className="w-3 h-3" />
                            <span>Rec: {selectedTech.optimalDuration}</span>
                        </div>
                    )}

                    {/* Science / Benefits */}
                    {selectedTech.science && (
                        <div className="pt-4 border-t border-white/5">
                            <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">Benefit</h4>
                            <p className="text-sm text-white/80 font-light leading-relaxed">
                                {selectedTech.science.mechanism}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {selectedTech.science.benefits?.slice(0, 2).map((b: string) => (
                                    <span key={b} className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/50 border border-white/5">{b}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Proportional Cycle Progress Bar */}
                <div className="space-y-2 w-full max-w-xs">
                    <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Cycle Progress</span>
                    <div className="flex items-center gap-1 w-full h-2 rounded-full overflow-hidden bg-white/5">
                        {selectedTech.steps.map((step, i) => {
                            const isActive = i === currentStepIndex;
                            const isPast = i < currentStepIndex;
                            const totalDuration = selectedTech.steps.reduce((acc, s) => acc + s.duration, 0);
                            const flexGrow = step.duration / totalDuration;

                            return (
                                <div
                                    key={i}
                                    style={{ flex: `${flexGrow} 1 0%` }}
                                    className="h-full relative bg-white/5"
                                >
                                    {/* Fill Layer */}
                                    <div
                                        className="absolute inset-y-0 left-0 bg-white shadow-[0_0_10px_white]"
                                        style={{
                                            width: isActive ? `${stepProgress}%` : (isPast ? '100%' : '0%'),
                                            transition: isActive ? 'none' : 'width 0.3s ease'
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                    {/* Step Labels */}
                    <div className="flex justify-between w-full text-[9px] text-white/40 font-mono uppercase">
                        {selectedTech.steps.map((step, i) => {
                            // Only show label if meaningful space or just action name
                            // Simplified label logic to avoid clutter
                            const totalDuration = selectedTech.steps.reduce((acc, s) => acc + s.duration, 0);
                            const pct = step.duration / totalDuration;
                            // Only label if segment is > 15% width to prevent overlap
                            return (
                                <div key={i} style={{ flex: `${pct} 1 0%` }} className="text-center overflow-hidden text-ellipsis whitespace-nowrap px-0.5">
                                    {pct > 0.15 ? step.action.replace(/\d+$/, '') : ''}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Live Stats Block */}
                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4">
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Session Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-3xl font-thin text-white font-mono tracking-tighter">
                                {sessionRemaining ? sessionRemaining : sessionStats.formatTime(sessionStats.totalSeconds)}
                            </div>
                            <div className="text-xs text-white/40 font-medium">
                                {sessionRemaining ? 'Remaining' : 'Duration'}
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-thin text-white font-mono tracking-tighter">{sessionStats.cycleCount}</div>
                            <div className="text-xs text-white/40 font-medium">Cycles</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Center Column: The Orb */}
            <div className="col-span-6 flex flex-col items-center justify-center relative gap-6">
                <h1 className="text-6xl font-thin text-white tracking-widest uppercase drop-shadow-lg text-center h-24 flex items-end">
                    {isActive ? currentStep.text : "Breathe"}
                </h1>

                <div className="relative w-[380px] h-[380px] flex items-center justify-center">
                    <Orb2
                        isActive={isActive}
                        phase={currentStep.action}
                        progress={stepProgress}
                        segments={selectedTech.steps ? selectedTech.steps.map(s => s.duration) : undefined}
                        currentStepIndex={currentStepIndex}
                        color={selectedTech.color}
                        gradientColors={currentGradient}
                    />
                </div>

                {/* Timer Moved BELOW Orb */}
                <AnimatePresence mode="wait">
                    {isActive ? (
                        <motion.div
                            key="timer"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="text-center z-20"
                        >
                            <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">Remaining</div>
                            <span className="text-7xl font-thin text-white font-mono tracking-tighter">
                                {displaySeconds}
                            </span>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="h-20 flex flex-col items-center justify-center text-white/20 font-light text-lg mt-4"
                        >
                            <span>Ready to Begin?</span>
                            <span className="text-xs opacity-50 mt-1">Press Play</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Right Column: Controls & Settings */}
            <div className="col-span-3 flex flex-col items-end justify-center gap-6 z-10 pl-12">

                {/* Play/Pause Giant Button */}
                <div className="relative group">
                    <motion.button
                        layout
                        onClick={controls.toggle}
                        onMouseEnter={() => setHoveredControl('play')}
                        onMouseLeave={() => setHoveredControl(null)}
                        className={cn(
                            "w-24 h-24 rounded-full flex items-center justify-center backdrop-blur-xl border transition-all duration-300 shadow-2xl",
                            isActive
                                ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                                : "bg-white text-slate-900 border-white hover:scale-105"
                        )}
                        aria-label={isActive ? "Pause Session" : "Start Session"}
                    >
                        {isActive ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current ml-1" />}
                    </motion.button>
                    {/* Using the built-in Tooltip logic from previous code or simplistic absolute for now as per this file's pattern */}
                    <AnimatePresence>
                        {hoveredControl === 'play' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                                className="absolute right-full mr-6 top-1/2 -translate-y-1/2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-sm text-white whitespace-nowrap"
                            >
                                {isActive ? "Pause Breathing" : "Start Session"}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Reset Button */}
                <div className="relative group">
                    <motion.button
                        onClick={controls.reset}
                        onMouseEnter={() => setHoveredControl('reset')}
                        onMouseLeave={() => setHoveredControl(null)}
                        className="p-4 rounded-full bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                        aria-label="Reset Session"
                    >
                        <RotateCcw className="w-6 h-6" />
                    </motion.button>

                    <AnimatePresence>
                        {hoveredControl === 'reset' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                                className="absolute right-full mr-6 top-1/2 -translate-y-1/2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-sm text-white whitespace-nowrap"
                            >
                                Reset Timer
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Info Card - Dynamic Tip */}
                <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 w-full hover:bg-white/10 transition-colors cursor-help group text-right">
                    <div className="flex items-center justify-end gap-3 mb-2 text-white/80">
                        <span className="font-semibold text-sm tracking-wide">Technique Tip</span>
                        <Info className="w-5 h-5 text-indigo-400" />
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
                        {selectedTech.tip || "Focus on your breath and let go of tension."}
                    </p>
                </div>

            </div>

        </div>
    );
};
