import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Camera, Activity, Info } from 'lucide-react';
import { Orb2 } from '../ui/Orb2';
import { SoundMenu } from '../ui/SoundMenu';
import { BiofeedbackEngine } from '../../services/BiofeedbackEngine';
import { GenerativeAudio } from '../../services/GenerativeAudio';
import { cn } from '../../lib/utils';

import { useSettings } from '../../hooks/useSettings';
import { GRADIENTS } from '../../constants/themes';

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
    sessionRemaining?: string;
}

export const BreatheView = ({
    isActive,
    currentStep,
    currentStepIndex,
    selectedTech,
    stepProgress,
    displaySeconds,
    sessionStats,
    controls,
    sessionRemaining
}: BreatheViewProps) => {
    // Local State
    const { theme } = useSettings();
    const currentGradient = GRADIENTS[theme];

    const [bioEnabled, setBioEnabled] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [showDetails, setShowDetails] = useState(false); // New Details State
    const [hr, setHr] = useState<number | null>(null);

    // ... (keep engines) ...
    const bioEngine = useRef<BiofeedbackEngine | null>(null);
    const audioEngine = useRef<GenerativeAudio | null>(null);

    // Initialize Engines
    useEffect(() => {
        bioEngine.current = new BiofeedbackEngine((newBpm) => {
            setHr(newBpm);
        });

        audioEngine.current = new GenerativeAudio();

        return () => {
            bioEngine.current?.stop();
            audioEngine.current?.stop();
        };
    }, []);

    // ... (keep Audio State Updates) ...
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

    const { totalSeconds, cycleCount } = sessionStats;

    return (
        <div className="relative w-full h-full flex flex-col p-6">

            {/* Top Bar: Floating Tools */}
            <div className="w-full flex justify-between z-20 mb-4">
                <div className="flex gap-6">
                    {/* Biofeedback Toggle */}
                    <div className="flex flex-col items-center gap-1">
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
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Bio</span>
                    </div>

                    {/* Sound Menu */}
                    <div className="flex flex-col items-center gap-1">
                        <SoundMenu
                            engine={audioEngine.current}
                            isEnabled={audioEnabled}
                            onToggle={toggleAudio}
                        />
                        <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">Audio</span>
                    </div>
                </div>

                {/* Stats Pill - Premium Glass */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-3 px-5 py-2.5 glass-panel rounded-full text-xs font-medium tracking-wide text-white/80"
                >
                    <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--primary))]" />
                        {sessionRemaining || new Date((totalSeconds || 0) * 1000).toISOString().substr(14, 5)}
                    </span>
                    <span className="w-px h-3 bg-white/10" />
                    <span>{cycleCount || 0} Cycles</span>
                </motion.div>
            </div>

            {/* Main Center Stage */}
            <div className="flex-1 flex flex-col items-center justify-center w-full z-10 min-h-0">
                {/* Orb Container */}
                <div className="relative z-10 scale-90 sm:scale-100">
                    <Orb2
                        isActive={isActive}
                        phase={currentStep.action}
                        progress={stepProgress}
                        color={selectedTech.color}
                        segments={selectedTech.steps.map(s => s.duration)}
                        currentStepIndex={currentStepIndex}
                        gradientColors={currentGradient}
                    />
                </div>

                {/* Panic Button (Hidden if Active) */}
                <AnimatePresence>
                    {!isActive && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex flex-col items-center gap-2"
                        >
                            <span className="text-[10px] items-center tracking-[0.2em] font-medium text-white/40 uppercase">
                                Panic Button
                            </span>
                            <span className="text-[10px] items-center tracking-[0.1em] font-medium text-[hsl(var(--primary))] uppercase opacity-60">
                                REC: 1-3 MINUTES
                            </span>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Technique Name & Info */}
                <div className="text-center space-y-1 relative group">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-3"
                    >
                        <h2 className="text-4xl font-extralight tracking-tight text-white mb-1">
                            {selectedTech.name}
                        </h2>
                        {!isActive && (
                            <button
                                onClick={() => setShowDetails(true)}
                                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
                            >
                                <Info className="w-5 h-5" />
                            </button>
                        )}
                    </motion.div>
                </div>

                {/* 2. Typography & Instructions */}
                <div className="text-center space-y-4">
                    <AnimatePresence mode="wait">
                        <motion.h2
                            key={currentStep.text}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-4xl md:text-5xl font-thin tracking-wide text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
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
                            <span className="text-5xl font-mono font-light text-white/90 tabular-nums drop-shadow-lg">
                                {displaySeconds}
                            </span>

                            <div className="flex items-center gap-2">
                                {hr && (
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-100 text-xs font-bold border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.2)]"
                                    >
                                        ♥ {hr} BPM
                                    </motion.div>
                                )}
                                {selectedTech.id === 'box' && ( // Example check for logic if needed
                                    <div className="px-2 py-0.5 rounded bg-white/10 text-white/50 text-[10px] font-bold border border-white/10">
                                        PAS
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Main Controls - Premium Glass Buttons */}
            <div className="w-full flex justify-center gap-8 z-20 pb-28 md:pb-12 shrink-0">
                <AnimatePresence mode="wait">
                    {!isActive ? (
                        <motion.button
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={controls.toggle}
                            className="w-24 h-24 rounded-[32px] bg-white text-black flex flex-col items-center justify-center shadow-[0_0_40px_hsla(var(--primary)/0.3)] hover:shadow-[0_0_60px_hsla(var(--primary)/0.5)] transition-shadow duration-500"
                        >
                            <Play className="w-8 h-8 ml-1 mb-1" fill="currentColor" />
                            <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">Start</span>
                        </motion.button>
                    ) : (
                        <>
                            <motion.button
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                onClick={controls.reset}
                                className="w-16 h-16 rounded-full glass-button flex flex-col items-center justify-center text-white/60 hover:text-white"
                            >
                                <RotateCcw className="w-5 h-5 mb-0.5" />
                                <span className="text-[9px] font-medium tracking-wider uppercase">Reset</span>
                            </motion.button>

                            <motion.button
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={controls.toggle}
                                className="w-24 h-24 rounded-[32px] glass-panel bg-white/10 text-white flex flex-col items-center justify-center border-white/20"
                            >
                                <Pause className="w-8 h-8 mb-1" fill="currentColor" />
                                <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">Pause</span>
                            </motion.button>
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Details Drawer / Modal */}
            <AnimatePresence>
                {showDetails && (
                    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowDetails(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                            className="relative w-full max-w-md bg-[#0f172a] rounded-t-3xl p-8 border-t border-white/10 shadow-2xl space-y-6"
                        >
                            <div className="w-12 h-1 rounded-full bg-white/20 mx-auto" />

                            <div>
                                <h3 className="text-2xl font-light text-white">{selectedTech.name}</h3>
                                <p className="text-sm text-white/60 mt-2 leading-relaxed">
                                    {selectedTech.id === 'box' ? "Used by Navy SEALs to regain focus and reduce acute stress instantly." :
                                        selectedTech.id === 'sleep_478' ? "Dr. Andrew Weil's famous technique for falling asleep in under 60 seconds." :
                                            selectedTech.id === 'coherent' ? "Aligns heart and brain rhythms to enter a state of flow and balance." :
                                                "A powerful technique to regulate your nervous system."}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">Technique Pattern</h4>
                                <div className="flex gap-2">
                                    {selectedTech.steps.map((s, i) => (
                                        <div key={i} className="flex-1 p-3 rounded-xl bg-white/5 border border-white/5 flex flex-col items-center gap-1">
                                            <span className="text-xs text-white/50 uppercase">{s.action}</span>
                                            <span className="text-xl font-mono text-white">{s.duration}s</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => setShowDetails(false)}
                                className="w-full py-4 rounded-xl bg-white text-black font-bold tracking-widest uppercase text-xs hover:bg-white/90 transition-colors"
                            >
                                Close
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
