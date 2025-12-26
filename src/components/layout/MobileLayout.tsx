import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LiquidNav } from './LiquidNav';
import { BreatheView } from '../views/BreatheView';
import { DiscoverView } from '../views/DiscoverView';
import { JourneyView } from '../views/JourneyView';

import type { Technique, SessionStats, DailyLogEntry } from '../../types';

interface LayoutProps {
    isActive: boolean;
    selectedTech: Technique;
    currentStep: {
        text: string;
        action: string;
        duration: number;
    };
    currentStepIndex: number;
    stepProgress: number;
    displaySeconds: string;
    sessionStats: SessionStats;
    controls: { toggle: () => void; reset: () => void; stop: () => void; }; // Keep any for now if controls type is complex, or define it
    todayLog: DailyLogEntry;
    compliance: { doneCount: number; total: number; completed: boolean; };
    onChangeTechnique: (t: Technique) => void;
    onRunPreset: (id: string) => void;
    techniques: Technique[];
    saveRoutine: (t: Technique) => void;
    deleteRoutine: (id: string) => void;
}

export const MobileLayout = ({
    isActive,
    selectedTech,
    currentStep,
    currentStepIndex,
    stepProgress,
    displaySeconds,
    sessionStats,
    controls,
    todayLog,
    compliance,
    onChangeTechnique,
    onRunPreset,
    techniques,
    saveRoutine,
    deleteRoutine
}: LayoutProps) => {
    const props = { isActive, selectedTech, currentStep, currentStepIndex, stepProgress, displaySeconds, sessionStats, controls, todayLog, compliance, onChangeTechnique, onRunPreset, techniques, saveRoutine, deleteRoutine };
    const [activeTab, setActiveTab] = useState<'breathe' | 'discover' | 'journey'>('breathe');

    return (
        <div className="relative w-full h-full flex flex-col">
            <main className="relative z-10 w-full h-full flex flex-col">
                <AnimatePresence mode="wait">
                    {activeTab === 'breathe' && (
                        <motion.div
                            key="breathe"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col"
                        >
                            <BreatheView
                                isActive={isActive}
                                currentStep={currentStep}
                                selectedTech={selectedTech}
                                stepProgress={stepProgress}
                                displaySeconds={displaySeconds}
                                sessionStats={sessionStats}
                                controls={controls}
                                currentStepIndex={props.currentStepIndex}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'discover' && (
                        <motion.div
                            key="discover"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex-1 overflow-hidden"
                        >
                            <DiscoverView
                                techniques={props.techniques}
                                onSelectTech={(t) => { onChangeTechnique(t); setActiveTab('breathe'); }}
                                onRunPreset={(pid) => { onRunPreset(pid); setActiveTab('breathe'); }}
                                saveRoutine={saveRoutine}
                            />
                        </motion.div>
                    )}

                    {activeTab === 'journey' && (
                        <motion.div
                            key="journey"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex-1 overflow-hidden"
                        >
                            <JourneyView
                                compliance={compliance}
                                dailyLog={todayLog}
                                onChangeTechnique={() => { }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            <LiquidNav activeTab={activeTab} onChange={setActiveTab} />
        </div>
    );
};
