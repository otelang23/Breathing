import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Camera, Music, Activity } from 'lucide-react';
import { Orb2 } from '../ui/Orb2';
import { BiofeedbackEngine } from '../../services/BiofeedbackEngine';
import { GenerativeAudio } from '../../services/GenerativeAudio';
import { cn } from '../../lib/utils';

import type { Technique, SessionStats } from '../../types';

interface BreatheViewProps {
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
}

export const BreatheView = ({
    isActive,
    currentStep,
    currentStepIndex,
    selectedTech,
    stepProgress,
    displaySeconds,
    sessionStats,
    controls
}: BreatheViewProps) => {
    // Local State
    const [bioEnabled, setBioEnabled] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [hr, setHr] = useState<number | null>(null);

    // Engines
    const bioEngine = useRef<BiofeedbackEngine | null>(null);
    const audioEngine = useRef<GenerativeAudio | null>(null);

    // Initialize Engines
    useEffect(() => {
        bioEngine.current = new BiofeedbackEngine((newBpm) => {
            setHr(newBpm);
            // Biofeedback modulation is handled internally or we can pass it to engine if needed
        });

        audioEngine.current = new GenerativeAudio();

        return () => {
            bioEngine.current?.stop();
            audioEngine.current?.stop();
        };
    }, []);

    // Audio State Updates
    useEffect(() => {
        if (!audioEnabled || !audioEngine.current) return;

        audioEngine.current.updateState({
            phase: isActive ? currentStep.action as 'Inhale' | 'Hold' | 'Exhale' | 'Idle' : 'Idle',
            progress: stepProgress / 100, // Normalize to 0-1
            techProfile: selectedTech.audioProfile
        });
    }, [isActive, currentStep, stepProgress, selectedTech, audioEnabled]);

    const toggleBio = async () => {
        if (!bioEnabled) {
            try {
                await bioEngine.current?.start();
                setBioEnabled(true);
            } catch (err) {
                console.warn("Camera denied or not found", err);
                // Optionally show UI feedback here
            }
        } else {
            bioEngine.current?.stop();
            setBioEnabled(false);
            setHr(null);
        }
    };

    const toggleAudio = async () => {
        if (!audioEnabled) {
            await audioEngine.current?.init();
            audioEngine.current?.start();
            setAudioEnabled(true);
        } else {
            audioEngine.current?.stop();
            setAudioEnabled(false);
        }
    };

    return (
        <div className="relative w-full h-full flex flex-col p-6">

            {/* Top Bar: Floating Tools */}
            <div className="absolute top-4 left-0 w-full flex justify-between px-6 z-20">
                <div className="flex gap-4">
                    {/* Biofeedback Toggle */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleBio}
                        className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border transition-colors",
                            bioEnabled ? "bg-rose-500/20 border-rose-500 text-rose-200" : "bg-white/5 border-white/10 text-white/40"
                        )}
                        title="Toggle Biofeedback (Camera)"
                    >
                        {bioEnabled ? <Activity className="w-5 h-5 animate-pulse" /> : <Camera className="w-5 h-5" />}
                    </motion.button>

                    {/* Music Toggle */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleAudio}
                        className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border transition-colors",
                            audioEnabled ? "bg-indigo-500/20 border-indigo-500 text-indigo-200" : "bg-white/5 border-white/10 text-white/40"
                        )}
                        title="Toggle Generative Audio"
                    >
                        <Music className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Stats Pill */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 px-4 py-2 bg-black/20 backdrop-blur-lg rounded-full border border-white/5 text-xs font-mono text-white/60"
                >
                    <span>{sessionStats.formatTime(sessionStats.totalSeconds)}</span>
                    <span className="w-px h-3 bg-white/10" />
                    <span>{sessionStats.cycleCount} Cycles</span>
                </motion.div>
            </div>

            {/* Main Center Stage */}
            <div className="flex-1 flex flex-col items-center justify-center w-full z-10 min-h-0">
                {/* 1. The Orb */}
                <div className="relative mb-8 transform scale-90 md:scale-100 transition-transform">
                    <Orb2
                        isActive={isActive}
                        phase={currentStep.action}
                        progress={stepProgress}
                        color={selectedTech.color}
                        currentStepIndex={currentStepIndex}
                        segments={selectedTech.steps?.map((s) => s.duration) || [4, 4, 4, 4]} // Fallback or proper steps
                    />
                </div>

                {/* New: Tagline & Duration */}
                <div className="text-center mb-6 space-y-1">
                    <p className="text-white/40 text-sm font-light tracking-wide">{selectedTech.tagline}</p>
                    {selectedTech.optimalDuration && (
                        <p className="text-[10px] text-white/30 font-mono uppercase tracking-wider">
                            Rec: {selectedTech.optimalDuration}
                        </p>
                    )}
                </div>

                {/* 2. Typography & Instructions */}
                <div className="text-center space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={currentStep.text}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-4xl md:text-5xl font-thin tracking-wide text-white drop-shadow-2xl"
                        >
                            {currentStep.text}
                        </motion.h2>
                    </AnimatePresence>

                    {isActive && (
                        <motion.div
                            className="flex flex-col items-center gap-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <span className="text-5xl font-mono font-light text-white/90 tabular-nums">
                                {displaySeconds}
                            </span>

                            <div className="flex items-center gap-2">
                                {hr && (
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 text-xs font-bold"
                                    >
                                        ♥ {hr} BPM
                                    </motion.div>
                                )}
                                {selectedTech.pas && (
                                    <div className="px-2 py-0.5 rounded bg-white/5 text-white/40 text-[10px] font-bold border border-white/5">
                                        PAS {selectedTech.pas}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Bottom Controls: Static Flex Block (No Overlap) */}
            <div className="w-full flex justify-center gap-8 z-20 pb-20 md:pb-8 shrink-0">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={controls.reset}
                    className="p-4 rounded-full bg-white/5 backdrop-blur border border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                >
                    <RotateCcw className="w-6 h-6" />
                </motion.button>

                <motion.button
                    layout
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={controls.toggle}
                    className={cn(
                        "flex items-center justify-center w-20 h-20 rounded-3xl backdrop-blur-xl shadow-2xl transition-all border",
                        isActive
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-white text-slate-900 border-white"
                    )}
                >
                    {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </motion.button>
            </div>
        </div>
    );
};
