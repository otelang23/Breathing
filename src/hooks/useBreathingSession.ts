import { useState, useEffect } from 'react';
import { AudioEngine } from '../services/AudioEngine';
import { PRESETS } from '../data/presets';
import { TECHNIQUES } from '../data/techniques';
import type { Technique } from '../types';

interface UseBreathingSessionProps {
    initialTech: Technique;
    soundMode: 'silent' | 'minimal' | 'rich';
    hapticEnabled: boolean;
    onTick?: (techId: string) => void;
    onSleepTrigger?: () => void;
}

export const useBreathingSession = ({
    initialTech,
    soundMode,
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
        });

        // Haptics
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (hapticEnabled && typeof navigator !== 'undefined' && (navigator as any).vibrate) {
            const pattern = currentStep.vibration || 40;
            (navigator as any).vibrate(pattern);
        }
    }, [currentStepIndex, isActive, selectedTech.id, soundMode, hapticEnabled, currentStep.action, currentStep.duration, currentStep.vibration]);

    // Drone Management
    useEffect(() => {
        if (isActive) {
            AudioEngine.startDrone(soundMode);
        } else {
            AudioEngine.stopDrone();
        }
        return () => {
            AudioEngine.stopDrone();
        };
    }, [isActive, soundMode]);

    // Global Timer & Logic
    useEffect(() => {
        if (!isActive) return;

        const interval = setInterval(() => {
            setTotalSeconds((prev) => prev + 1);
            if (onTick) onTick(selectedTech.id);

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
                                setActivePresetId(null);
                                setIsActive(false);
                            }
                        }
                    }
                }
            }

            // We rely on parent to handle Sleep Mode "soundMode" change via onSleepTrigger
            if (onSleepTrigger && totalSeconds + 1 >= 420) {
                onSleepTrigger();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isActive, activePresetId, presetSegmentIndex, presetSegmentStartSec, totalSeconds, selectedTech.id, onTick, onSleepTrigger]);

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
