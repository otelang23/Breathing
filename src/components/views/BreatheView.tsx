import { Play, Pause, Square, RotateCcw, EyeOff, Activity, Camera, Music, VideoOff } from 'lucide-react';
import { BreathingOrb } from '../ui/BreathingOrb';
import { StatCard } from '../ui/StatCard';
import { useSettings } from '../../context/SettingsContext';
import { BiofeedbackEngine } from '../../services/BiofeedbackEngine';
import { GenerativeAudio } from '../../services/GenerativeAudio';
import { useEffect, useRef, useState } from 'react';

interface BreatheViewProps {
    isActive: boolean;
    currentStep: any;
    selectedTech: any;
    stepProgress: number;
    displaySeconds: string;
    currentStepIndex: number;
    sessionStats: {
        totalSeconds: number;
        cycleCount: number;
        formatTime: (s: number) => string;
    };
    controls: {
        toggle: () => void;
        reset: () => void;
        stop: () => void;
    };
}

export const BreatheView = ({
    isActive,
    currentStep,
    selectedTech,
    stepProgress,
    displaySeconds,
    currentStepIndex,
    sessionStats,
    controls
}: BreatheViewProps) => {
    const { focusMode, setFocusMode } = useSettings();

    // Feature States
    const [bioEnabled, setBioEnabled] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [hr, setHr] = useState<number | null>(null);

    // Engine Refs
    const bioEngine = useRef<BiofeedbackEngine | null>(null);
    const audioEngine = useRef<GenerativeAudio | null>(null);

    // Initialize Engines
    useEffect(() => {
        bioEngine.current = new BiofeedbackEngine((newBpm) => {
            setHr(newBpm);
            if (audioEngine.current) {
                audioEngine.current.updateFromBiofeedback(newBpm);
            }
        });

        audioEngine.current = new GenerativeAudio();

        return () => {
            bioEngine.current?.stop();
            audioEngine.current?.stop();
        };
    }, []);

    // Toggle Biofeedback
    const toggleBio = async () => {
        if (!bioEnabled) {
            try {
                await bioEngine.current?.start();
                setBioEnabled(true);
            } catch (err) {
                alert('Camera access denied. Cannot start Biofeedback.');
            }
        } else {
            bioEngine.current?.stop();
            setBioEnabled(false);
            setHr(null);
        }
    };

    // Toggle Audio
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

    // Sync Audio State
    useEffect(() => {
        if (isActive && audioEnabled) {
            // Ensure running if session active
            // audioEngine.current?.start(); 
        } else if (!isActive && audioEnabled) {
            // Maybe fade out? For now keep running if enabled manually
        }
    }, [isActive, audioEnabled]);

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full min-h-0 pt-8 pb-24 px-6 relative">

            {/* Focus Mode Exit */}
            {focusMode && (
                <button
                    onClick={() => setFocusMode(false)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-surface/80 text-text-muted hover:text-white backdrop-blur"
                >
                    <EyeOff className="w-5 h-5" />
                </button>
            )}

            {/* Next-Gen Toggles (Top Left) */}
            {!focusMode && (
                <div className="absolute top-4 left-4 flex gap-3">
                    <button
                        onClick={toggleBio}
                        className={`p-2 rounded-full border transition-all ${bioEnabled ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-surface/50 border-white/10 text-text-muted'}`}
                        title="Enable Camera Biofeedback"
                    >
                        {bioEnabled ? <Activity className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={toggleAudio}
                        className={`p-2 rounded-full border transition-all ${audioEnabled ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' : 'bg-surface/50 border-white/10 text-text-muted'}`}
                        title="Enable Generative Audio"
                    >
                        {audioEnabled ? <Music className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                        {/* VideoOff icon used as placeholder for 'muted' state if desired, but Music icon logic works */}
                    </button>
                </div>
            )}

            {/* Orb & Timer Section */}
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm mx-auto min-h-[40vh]">
                <BreathingOrb
                    scale={currentStep.scale}
                    color={selectedTech.color}
                    isActive={isActive}
                    action={currentStep.action}
                    duration={currentStep.duration}
                    progress={stepProgress}
                />

                <div className="mt-8 text-center space-y-2 z-10">
                    <h2 className="text-3xl font-bold text-white tracking-wide animate-pulse-slow">
                        {currentStep.text}
                    </h2>
                    {isActive ? (
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-6xl font-mono font-light text-white tabular-nums drop-shadow-lg">
                                {displaySeconds}
                            </p>
                            {hr && (
                                <span className="text-xs font-mono text-red-400 bg-red-900/20 px-2 py-0.5 rounded animate-in fade-in">
                                    ♥ {hr} BPM
                                </span>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-text-muted font-mono uppercase tracking-widest mt-4">
                            {selectedTech.name}
                        </p>
                    )}

                    <p className="text-xs text-slate-400 font-mono tracking-[0.2em] uppercase opacity-70">
                        Step {currentStepIndex + 1}/{selectedTech.steps.length}
                    </p>
                </div>
            </div>

            {/* Controls - Floating Bar */}
            <div className={`flex items-center gap-6 z-20 transition-all duration-500 ${focusMode ? 'opacity-0 translate-y-10 pointer-events-none' : 'opacity-100'}`}>
                <button
                    onClick={controls.reset}
                    className="p-4 rounded-full bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>

                <button
                    onClick={controls.toggle}
                    className={`flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300 shadow-2xl ${isActive
                            ? 'bg-transparent border-2 border-white/20 text-white'
                            : 'bg-white text-slate-900 border-none hover:scale-105'
                        }`}
                >
                    {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>

                <button
                    onClick={controls.stop}
                    className="p-4 rounded-full bg-white/5 border border-white/10 text-white/40 hover:bg-red-500/20 hover:text-red-300 transition-all active:scale-95"
                >
                    <Square className="w-5 h-5 fill-current" />
                </button>
            </div>

            {/* Quick Stats Footer */}
            {!focusMode && isActive && (
                <div className="w-full grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <StatCard label="Time" value={sessionStats.formatTime(sessionStats.totalSeconds)} />
                    <StatCard label="Cycles" value={sessionStats.cycleCount} sub="Counts" />
                </div>
            )}
        </div>
    );
};
