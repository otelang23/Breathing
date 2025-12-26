import { useState, useEffect } from 'react';

// Context & Logic
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { useSettings } from './hooks/useSettings';
import { useDailyLog } from './hooks/useDailyLog';
import { useBreathingSession } from './hooks/useBreathingSession';
import { TECHNIQUES } from './data/techniques';

import { useCustomRoutines } from './hooks/useCustomRoutines';
import { AuroraBackground } from './components/layout/AuroraBackground';
import { MobileLayout } from './components/layout/MobileLayout';
import { DesktopLayout } from './components/layout/DesktopLayout';

const AppContent = () => {
    const {
        soundMode,
        audioVariant,
        hapticEnabled,
        theme: userTheme // Pull user theme
    } = useSettings();

    // Core Logic
    const { todayLog, logSeconds, compliance } = useDailyLog();

    const {
        isActive,
        selectedTech,
        currentStep,
        currentStepIndex, // Added this
        stepProgress,
        totalSeconds,
        cycleCount,
        changeTechnique,
        toggleSession,
        resetSession,
        stopSession,
        startPreset
    } = useBreathingSession({
        initialTech: TECHNIQUES[0],
        soundMode,
        audioVariant,
        hapticEnabled,
        onTick: (id) => logSeconds(id, 1),
        onSleepTrigger: () => { }
    });

    // Helper for time
    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const remainingSecs = secs % 60;
        return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
    };
    const rawRemaining = (currentStep.duration * (1 - stepProgress / 100)) / 1000;
    const displaySeconds = Math.max(0, rawRemaining).toFixed(1);

    // Responsive Check
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Theme Logic: User Preference (Idle) vs Technique (Active)
    const getActiveTheme = () => {
        if (isActive) {
            // Active Session: Use Technique Color
            if (selectedTech.id === 'sigh') return 'fire';
            if (selectedTech.id === 'box') return 'forest';
            if (selectedTech.id === 'coherent') return 'ocean';
            if (selectedTech.id === 'sleep_478') return 'calm';
            if (selectedTech.id === 'bhramari') return 'fire'; // Added mapping
            return 'default';
        }
        // Idle: Use User Setting, ensuring we map "sunset" -> "fire" etc correctly
        if (userTheme === 'sunset') return 'fire';
        if (userTheme === 'forest') return 'forest';
        if (userTheme === 'ocean') return 'ocean';
        if (userTheme === 'midnight') return 'calm';
        return 'default';
    };

    const { customTechniques, saveRoutine, deleteRoutine } = useCustomRoutines();
    const allTechniques = [...TECHNIQUES, ...customTechniques];

    // Common Props for Layouts
    const layoutProps = {
        isActive,
        selectedTech,
        currentStep,
        currentStepIndex, // Added this
        stepProgress,
        displaySeconds,
        sessionStats: { totalSeconds, cycleCount, formatTime },
        controls: { toggle: toggleSession, reset: resetSession, stop: stopSession },
        todayLog,
        compliance,
        onChangeTechnique: changeTechnique,
        onRunPreset: startPreset,
        techniques: allTechniques,
        saveRoutine,
        deleteRoutine
    };

    return (
        <div className={`relative w-full h-[100dvh] overflow-hidden bg-black text-white font-sans selection:bg-white/30`}>
            {/* 1. Unified Background Layer */}
            <AuroraBackground
                theme={getActiveTheme()}
            />

            {/* 2. Responsive Layout Switcher */}
            <div className="relative z-10 w-full h-full">
                {isMobile ? (
                    <MobileLayout {...layoutProps} />
                ) : (
                    <DesktopLayout {...layoutProps} />
                )}
            </div>

        </div>
    );
};

import { HealthProviderComponent } from './services/health/HealthContext';

const App = () => (
    <AuthProvider>
        <SettingsProvider>
            <HealthProviderComponent>
                <AppContent />
            </HealthProviderComponent>
        </SettingsProvider>
    </AuthProvider>
);

export default App;
