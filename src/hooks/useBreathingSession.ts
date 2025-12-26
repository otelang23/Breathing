import { useState, useEffect, useRef } from 'react';
import { useHealth } from '../services/health/HealthContext';
import { AudioEngine } from '../services/AudioEngine';
import { PRESETS } from '../data/presets';
import { TECHNIQUES } from '../data/techniques';
import type { Technique } from '../types';

interface UseBreathingSessionProps {
    initialTech: Technique;
    soundMode: 'silent' | 'minimal' | 'rich';
    audioVariant: 'standard' | 'binaural' | 'noise';
    hapticEnabled: boolean;
    onTick?: (techId: string) => void;
    onSleepTrigger?: () => void;
}

export const useBreathingSession = ({
    initialTech,
    soundMode,
    audioVariant,
    hapticEnabled,
    onTick,
    onSleepTrigger,
}: UseBreathingSessionProps) => {
    const [selectedTech, setSelectedTech] = useState(initialTech);
    const [isActive, setIsActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [cycleCount, setCycleCount] = useState(0);
    const [totalSeconds, setTotalSeconds] = useState(0);
    const [stepProgress, setStepProgress] = useState(0);

    // Preset state
    const [activePresetId, setActivePresetId] = useState<string | null>(null);
    const [presetSegmentIndex, setPresetSegmentIndex] = useState(0);
    const [presetSegmentStartSec, setPresetSegmentStartSec] = useState(0);

    const currentStep = selectedTech.steps[currentStepIndex];

    // Animation Loop
    useEffect(() => {
        if (!isActive) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const duration = currentStep.duration;

        const animate = (timestamp: number) => {
            if (startTime === null) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min((elapsed / duration) * 100, 100);
            setStepProgress(progress);

            if (elapsed < duration) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                // Step finished
                if (currentStepIndex < selectedTech.steps.length - 1) {
                    setCurrentStepIndex((prev) => prev + 1);
                } else {
                    setCurrentStepIndex(0);
                    setCycleCount((prev) => prev + 1);
                }
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [isActive, currentStep.duration, currentStepIndex, selectedTech.steps.length]);

    // Audio & Haptic Effects on Step Change
    useEffect(() => {
        if (!isActive) return;

        // Audio
        AudioEngine.playStepSound({
            techId: selectedTech.id,
            action: currentStep.action,
            durationMs: currentStep.duration,
            soundMode,
            audioVariant,
            entrainmentFreq: selectedTech.entrainmentFreq,
            pan: currentStep.pan,
        });

        // Haptics
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (hapticEnabled && typeof navigator !== 'undefined' && (navigator as any).vibrate) {
            const pattern = currentStep.vibration || 40;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (navigator as any).vibrate(pattern);
        }
    }, [currentStepIndex, isActive, selectedTech.id, soundMode, audioVariant, selectedTech.entrainmentFreq, hapticEnabled, currentStep.action, currentStep.duration, currentStep.vibration, currentStep.pan]);

    // Drone Management
    useEffect(() => {
        if (isActive) {
            AudioEngine.startDrone(soundMode, audioVariant);
        } else {
            AudioEngine.stopDrone();
        }
        return () => {
            AudioEngine.stopDrone();
        };
    }, [isActive, soundMode, audioVariant]);

    // Use refs for callbacks to keep interval stable
    const onTickRef = useRef(onTick);
    const onSleepTriggerRef = useRef(onSleepTrigger);

    useEffect(() => {
        onTickRef.current = onTick;
        onSleepTriggerRef.current = onSleepTrigger;
    }, [onTick, onSleepTrigger]);

    // Health Integration
    const { saveSession } = useHealth();

    // Helper to save data
    const persistSession = (secs: number, tech: Technique) => {
        if (secs >= 30) { // Minimum 30s to record
            saveSession({
                startTime: new Date(Date.now() - secs * 1000),
                endTime: new Date(),
                durationSeconds: secs,
                techniqueName: tech.name,
                techniqueId: tech.id,
                caloriesBurned: Math.floor(secs * 0.05) // approx
            }).catch(e => console.error("Auto-save failed:", e));
        }
    };

    // Global Timer & Logic
    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setTotalSeconds((prev) => prev + 1);
            if (onTickRef.current) onTickRef.current(selectedTech.id);

            // Preset Logic
            if (activePresetId) {
                const preset = PRESETS.find((p) => p.id === activePresetId);
                if (preset) {
                    const segment = preset.segments[presetSegmentIndex];
                    if (segment) {
                        const elapsedInSegment = totalSeconds + 1 - presetSegmentStartSec;
                        if (elapsedInSegment >= segment.durationSec) {
                            // Move to next or finish
                            if (presetSegmentIndex < preset.segments.length - 1) {
                                const nextIndex = presetSegmentIndex + 1;
                                const nextSeg = preset.segments[nextIndex];
                                const nextTech = TECHNIQUES.find((t) => t.id === nextSeg.techId);
                                if (nextTech) {
                                    setSelectedTech(nextTech);
                                    setCurrentStepIndex(0);
                                }
                                setPresetSegmentIndex(nextIndex);
                                setPresetSegmentStartSec(totalSeconds + 1);
                                setCycleCount(0);
                            } else {
                                // Preset finished
                                persistSession(totalSeconds + 1, selectedTech); // Save Health Data
                                setActivePresetId(null);
                                setIsActive(false);
                            }
                        }
                    }
                }
            }

            // We rely on parent to handle Sleep Mode "soundMode" change via onSleepTrigger
            if (onSleepTriggerRef.current) {
                // Logic handled in separate effect below for threshold check, 
                // but if we wanted to do it here we could.
                // Let's stick to the separate effect for the trigger logic as it depends on totalSeconds.
            }
        }, 1000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isActive, activePresetId, presetSegmentIndex, presetSegmentStartSec, selectedTech.id]); // Removed callbacks from deps 

    // Separate effect for Sleep Mode trigger to avoid interval churn
    useEffect(() => {
        if (isActive && onSleepTrigger && totalSeconds >= 420) { // 7 mins
            onSleepTrigger();
        }
    }, [totalSeconds, isActive, onSleepTrigger]);

    // Helper Actions
    const toggleSession = () => {
        AudioEngine.init();
        if (isActive) {
            setIsActive(false);
            setStepProgress(0);
            AudioEngine.stopDrone();
        } else {
            setIsActive(true);
            if (activePresetId && presetSegmentStartSec === 0) {
                setPresetSegmentStartSec(0);
            }
        }
    };

    const resetSession = () => {
        if (totalSeconds > 0) persistSession(totalSeconds, selectedTech); // Save on reset
        setIsActive(false);
        setCurrentStepIndex(0);
        setCycleCount(0);
        setTotalSeconds(0);
        setStepProgress(0);
        setActivePresetId(null);
        setPresetSegmentIndex(0);
        setPresetSegmentStartSec(0);
    };

    const stopSession = () => {
        setIsActive(false);
        setCurrentStepIndex(0);
        setStepProgress(0);
    };

    const changeTechnique = (tech: Technique) => {
        resetSession();
        setSelectedTech(tech);
    };

    const startPreset = (presetId: string) => {
        const preset = PRESETS.find((p) => p.id === presetId);
        if (!preset) return;
        const first = preset.segments[0];
        const tech = TECHNIQUES.find((t) => t.id === first.techId);
        if (!tech) return;

        resetSession();
        setActivePresetId(presetId);
        setPresetSegmentIndex(0);
        setPresetSegmentStartSec(0);
        setSelectedTech(tech);
        setIsActive(true);
    };

    return {
        isActive,
        selectedTech,
        currentStep,
        currentStepIndex,
        stepProgress,
        totalSeconds,
        cycleCount,
        activePresetId,
        presetSegmentIndex,
        activePreset: activePresetId ? PRESETS.find(p => p.id === activePresetId) : null,
        toggleSession,
        resetSession,
        stopSession,
        changeTechnique,
        startPreset,
    };
};
