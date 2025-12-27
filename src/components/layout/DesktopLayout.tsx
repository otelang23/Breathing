import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SidebarNav } from './SidebarNav';
import { DesktopBreatheView } from '../views/DesktopBreatheView';
import { DesktopDiscoverView } from '../views/DesktopDiscoverView';
import { DesktopJourneyView } from '../views/DesktopJourneyView';
import { AboutModal } from '../modals/AboutModal';
import { SettingsModal } from '../modals/SettingsModal';
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
    controls: { toggle: () => void; reset: () => void; stop: () => void; };
    todayLog: DailyLogEntry;
    compliance: { doneCount: number; total: number; completed: boolean; };
    onChangeTechnique: (t: Technique) => void;
    onRunPreset: (id: string) => void;
    techniques: Technique[];
    saveRoutine: (t: Technique) => void;
    deleteRoutine: (id: string) => void;
    sessionRemaining?: string;
}

export const DesktopLayout = ({
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
    deleteRoutine,
    sessionRemaining
}: LayoutProps) => {
    const props = { isActive, selectedTech, currentStep, currentStepIndex, stepProgress, displaySeconds, sessionStats, controls, todayLog, compliance, onChangeTechnique, onRunPreset, techniques, saveRoutine, deleteRoutine, sessionRemaining };
    const [activeTab, setActiveTab] = useState<'breathe' | 'discover' | 'journey'>('breathe');
    const [showAbout, setShowAbout] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="relative w-full h-full flex">
            {/* Sidebar */}
            <SidebarNav
                activeTab={activeTab}
                onChange={setActiveTab}
                onLogoClick={() => setShowAbout(true)}
                onToggleSettings={() => setShowSettings(true)}
            />

            {/* Modals */}
            <AnimatePresence>
                {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
                {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
            </AnimatePresence>

            {/* Main Content Dashboard */}
            <main className="ml-24 flex-1 h-full overflow-hidden p-4">
                <AnimatePresence mode="wait">
                    {activeTab === 'breathe' && (
                        <motion.div
                            key="breathe"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.4 }}
                            className="w-full h-full flex items-center justify-center bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-sm shadow-2xl overflow-hidden"
                        >
                            {/* Desktop Breathe View Wrapper - Widened */}
                            <div className="w-full max-w-7xl h-full">
                                <DesktopBreatheView
                                    isActive={isActive}
                                    currentStep={currentStep}
                                    currentStepIndex={currentStepIndex}
                                    selectedTech={selectedTech}
                                    stepProgress={stepProgress}
                                    displaySeconds={displaySeconds}
                                    sessionStats={sessionStats}
                                    controls={controls}
                                    sessionRemaining={props.sessionRemaining}
                                />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'discover' && (
                        <motion.div
                            key="discover"
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                            className="w-full h-full"
                        >
                            <div className="max-w-5xl mx-auto h-full">
                                <DesktopDiscoverView
                                    techniques={techniques}
                                    onSelectTech={(t) => { onChangeTechnique(t); setActiveTab('breathe'); }}
                                    saveRoutine={props.saveRoutine}
                                    deleteRoutine={props.deleteRoutine}
                                />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'journey' && (
                        <motion.div
                            key="journey"
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="w-full h-full"
                        >
                            {/* Desktop Journey uses a wider container */}
                            <div className="w-full h-full">
                                <DesktopJourneyView
                                    compliance={compliance}
                                    dailyLog={todayLog}
                                    onChangeTechnique={() => { }}
                                    onOpenSettings={() => setShowSettings(true)}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};
