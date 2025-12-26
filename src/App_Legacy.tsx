import { useState, useMemo, useEffect } from 'react';
import { Wind, Volume2, Smartphone, Shield, Moon, ListChecks, Eye, Trash2, RotateCcw, Pause, Play, Square, EyeOff, Headphones, CloudRain, Activity } from 'lucide-react';
import { Tooltip } from './components/ui/Tooltip';


import { TECHNIQUES } from './data/techniques';
import { FILTERS } from './data/filters';
import { PRESETS } from './data/presets';

import { SettingsProvider } from './context/SettingsContext';
import { useSettings } from './hooks/useSettings';
import { useDailyLog } from './hooks/useDailyLog';
import { useBreathingSession } from './hooks/useBreathingSession';
import type { SoundMode } from './context/SettingsContextDefinition';
import type { Technique } from './types';
import { HealthProviderComponent } from './services/health/HealthContext';

import { BreathingOrb } from './components/ui/BreathingOrb';
import { StatCard } from './components/ui/StatCard';
import { FilterButton } from './components/ui/FilterButton';
import { TechniqueList } from './components/features/TechniqueList';
import { TechniqueDetail } from './components/features/TechniqueDetail';
import { InfoModal } from './components/modals/InfoModal';
import { ProtocolModal } from './components/modals/ProtocolModal';

// Mobile Components
import { MobileNav } from './components/layout/MobileNav';
import { BreatheView } from './components/views/BreatheView';
import { DiscoverView } from './components/views/DiscoverView';
import { JourneyView } from './components/views/JourneyView';

const AppContent = () => {
  const {
    soundMode, setSoundMode,
    volume, setVolume,
    hapticEnabled, setHapticEnabled,
    officeMode, setOfficeMode,
    sleepMode, setSleepMode,
    focusMode, setFocusMode,
    audioVariant, setAudioVariant,
    theme, setTheme
  } = useSettings();

  const { todayLog, logSeconds, resetData, compliance } = useDailyLog();

  // Mobile Navigation State
  const [activeTab, setActiveTab] = useState<'breathe' | 'discover' | 'journey'>('breathe');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [filter, setFilter] = useState('pas');
  const [showInfo, setShowInfo] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);

  const {
    isActive,
    selectedTech,
    currentStep,
    currentStepIndex,
    stepProgress,
    totalSeconds,
    cycleCount,
    activePresetId,
    presetSegmentIndex,
    activePreset,
    toggleSession,
    resetSession,
    stopSession,
    changeTechnique,
    startPreset,
  } = useBreathingSession({
    initialTech: TECHNIQUES[0],
    soundMode,
    audioVariant,
    hapticEnabled,
    onTick: (techId) => logSeconds(techId, 1),
    onSleepTrigger: () => {
      if (sleepMode && soundMode !== 'silent') {
        setSoundMode('silent');
        setHapticEnabled(false);
      }
    }
  });

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const sortedTechniques = useMemo(() => {
    return [...TECHNIQUES].sort((a, b) => {
      const rankA = (a.ranks as Record<string, number>)?.[filter] ?? 99;
      const rankB = (b.ranks as Record<string, number>)?.[filter] ?? 99;
      return rankA - rankB;
    });
  }, [filter]);

  const selectedFilterLabel = FILTERS.find((f) => f.id === filter)?.label || 'PAS Score';
  const todayKey = new Date().toISOString().slice(0, 10);

  const rawRemaining = (currentStep.duration * (1 - stepProgress / 100)) / 1000;
  const displaySeconds = Math.max(0, rawRemaining).toFixed(1);

  // --- MOBILE RENDER ---
  if (isMobile) {
    return (
      <div className={`h-[100dvh] w-screen bg-background text-text-main font-sans overflow-hidden theme-${theme} relative`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
        <div className={`absolute top-0 left-0 right-0 h-[60vh] bg-gradient-to-b ${selectedTech.color} to-transparent opacity-10 blur-3xl transition-all duration-700 pointer-events-none`} />

        <main className="h-full w-full flex flex-col relative z-10 transition-all duration-300">
          {activeTab === 'breathe' && (
            <BreatheView
              isActive={isActive}
              currentStep={currentStep}
              selectedTech={selectedTech}
              stepProgress={stepProgress}
              displaySeconds={displaySeconds}
              currentStepIndex={currentStepIndex}
              sessionStats={{ totalSeconds, cycleCount, formatTime }}
              controls={{ toggle: toggleSession, reset: resetSession, stop: stopSession }}
            />
          )}

          {activeTab === 'discover' && (
            <div className="h-full overflow-hidden">
              <DiscoverView
                techniques={sortedTechniques}
                onSelectTech={(t) => { changeTechnique(t); setActiveTab('breathe'); }}
                onRunPreset={(pid) => { startPreset(pid); setActiveTab('breathe'); }}
                saveRoutine={() => { }}
              />
            </div>
          )}

          {activeTab === 'journey' && (
            <div className="h-full overflow-hidden">
              <JourneyView
                compliance={compliance}
                dailyLog={todayLog}
                onChangeTechnique={(t: Technique) => { changeTechnique(t as Technique); setActiveTab('breathe'); }}
              />
            </div>
          )}
        </main>

        <MobileNav activeTab={activeTab} onChange={setActiveTab} />
      </div>
    );
  }

  // --- DESKTOP RENDER (Original Layout) ---
  return (
    <div className={`h-screen w-screen bg-background text-text-main font-sans selection:bg-primary/30 relative flex flex-col md:flex-row overflow-hidden theme-${theme}`}>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
      <div
        className={`absolute top-0 left-0 right-0 h-[55vh] bg-gradient-to-b ${selectedTech.color} to-transparent opacity-10 blur-3xl transition-all duration-700 pointer-events-none`}
      />

      {/* HEADER / SIDEBAR */}
      <aside className={`
        fixed z-50 transition-all duration-500 ease-spring
        md:top-0 md:left-0 md:h-full md:w-24 md:flex-col md:border-r
        top-0 left-0 w-full h-16 flex-row border-b overflow-x-auto no-scrollbar md:overflow-y-auto
        flex items-center justify-start md:justify-between px-4 gap-4 md:py-8
        ${theme === 'midnight' ? 'bg-slate-950/60 border-slate-800/50' :
          theme === 'ocean' ? 'bg-blue-950/60 border-blue-900/50' :
            theme === 'forest' ? 'bg-green-950/60 border-green-900/50' : 'bg-red-950/60 border-red-900/50'}
        backdrop-blur-xl shadow-2xl
      `}>
        <div className="flex shrink-0">
          <Tooltip content="About & Guide" side="right">
            <button
              onClick={() => setShowInfo(true)}
              className="group relative p-1 rounded-2xl transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shadow-lg shadow-black/20 ring-1 ring-white/10 group-hover:ring-white/30
               ${theme === 'midnight' ? 'bg-gradient-to-br from-teal-400 to-indigo-600' :
                  theme === 'ocean' ? 'bg-gradient-to-br from-cyan-400 to-blue-600' :
                    theme === 'forest' ? 'bg-gradient-to-br from-emerald-400 to-green-600' : 'bg-gradient-to-br from-orange-400 to-red-600'}
            `}>
                <Wind className="text-white w-6 h-6 drop-shadow-md" />
              </div>
            </button>
          </Tooltip>
        </div>

        <div className="flex shrink-0 md:flex-col items-center gap-3 md:gap-6">
          <div className="flex md:flex-col items-center gap-1 bg-black/20 rounded-full p-1 border border-white/5 shadow-inner">
            {['silent', 'minimal', 'rich'].map((mode) => (
              <Tooltip key={mode} content={`Sound Mode: ${mode.charAt(0).toUpperCase() + mode.slice(1)}`} side="right">
                <button
                  onClick={() => setSoundMode(mode as SoundMode)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${soundMode === mode
                    ? 'bg-white/90 text-slate-900 shadow-sm scale-105'
                    : 'text-white/40 hover:text-white hover:bg-white/10'
                    }`}
                >
                  {mode === 'silent' && <span className="text-[10px] font-bold">OFF</span>}
                  {mode === 'minimal' && <span className="text-[10px] font-bold">MIN</span>}
                  {mode === 'rich' && <span className="text-[10px] font-bold">MAX</span>}
                </button>
              </Tooltip>
            ))}
          </div>

          <div className="w-px h-8 md:w-8 md:h-px bg-white/10" />

          <Tooltip content={`Current Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`} side="right">
            <button
              onClick={() => {
                const themes: typeof theme[] = ['midnight', 'ocean', 'forest', 'sunset'];
                const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
                setTheme(themes[nextIdx]);
              }}
              className="group p-2.5 rounded-full transition-all duration-300 text-white/50 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10"
            >
              <div className={`w-5 h-5 rounded-full shadow-lg ring-2 ring-white/20 transition-transform group-hover:rotate-45 ${theme === 'midnight' ? 'bg-indigo-500 shadow-indigo-500/50' :
                theme === 'ocean' ? 'bg-cyan-500 shadow-cyan-500/50' :
                  theme === 'forest' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-orange-500 shadow-orange-500/50'
                }`} />
            </button>
          </Tooltip>

          <Tooltip content={`Audio: ${audioVariant.charAt(0).toUpperCase() + audioVariant.slice(1)}`} side="right">
            <button
              onClick={() => {
                const next = audioVariant === 'standard' ? 'binaural' : audioVariant === 'binaural' ? 'noise' : 'standard';
                setAudioVariant(next);
              }}
              className={`p-2.5 rounded-full transition-all duration-300 border border-transparent hover:border-white/10 hover:bg-white/10 ${audioVariant !== 'standard' ? 'text-primary' : 'text-white/50 hover:text-white'}`}
            >
              {audioVariant === 'standard' && <Activity className="w-5 h-5" />}
              {audioVariant === 'binaural' && <Headphones className="w-5 h-5" />}
              {audioVariant === 'noise' && <CloudRain className="w-5 h-5" />}
            </button>
          </Tooltip>
        </div>

        <div className="flex shrink-0 md:flex-col items-center gap-3 md:gap-6">
          <div className="group flex items-center justify-center p-2 rounded-2xl hover:bg-white/5 transition-colors relative" title="Volume Control">
            <Volume2 className={`w-5 h-5 transition-colors ${volume === 0 ? 'text-white/30' : 'text-white/70 group-hover:text-white'}`} />
            <div className="absolute hidden md:flex md:items-center md:justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/90 backdrop-blur-md rounded-full border border-white/10 shadow-xl"
              style={{
                height: '140px',
                width: '40px',
                top: '50%',
                left: '120%',
                transform: 'translateY(-50%)'
              }}
            >
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={soundMode === 'silent' ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-white/20 rounded-full appearance-none cursor-pointer accent-white -rotate-90 origin-center"
                aria-label="Volume"
              />
            </div>
          </div>

          <Tooltip content="Haptic Feedback" side="right">
            <button
              onClick={() => setHapticEnabled((prev) => !prev)}
              className={`p-2.5 rounded-full transition-all duration-300 hidden md:block ${hapticEnabled ? 'text-teal-400 bg-teal-500/10 ring-1 ring-teal-500/50' : 'text-white/40 hover:bg-white/10 hover:text-white'}`}
            >
              <Smartphone className="w-5 h-5" />
            </button>
          </Tooltip>

          <div className="flex md:flex-col gap-3 md:gap-4">
            <Tooltip content="Office Mode (No Flashing)" side="right">
              <button
                onClick={() => setOfficeMode((p) => !p)}
                className={`p-2.5 rounded-full transition-all duration-300 ${officeMode ? 'bg-white text-slate-900 shadow-lg shadow-white/20' : 'text-white/40 hover:bg-white/10 hover:text-white'}`}
              >
                <Shield className="w-5 h-5" />
              </button>
            </Tooltip>

            <Tooltip content="Sleep Mode (Auto-Fade)" side="right">
              <button
                onClick={() => setSleepMode((p) => !p)}
                className={`p-2.5 rounded-full transition-all duration-300 ${sleepMode ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40' : 'text-white/40 hover:bg-white/10 hover:text-white'}`}
              >
                <Moon className="w-5 h-5" />
              </button>
            </Tooltip>

            <Tooltip content="Evening Protocol" side="right">
              <button
                onClick={() => setShowProtocol(true)}
                className="p-2.5 rounded-full transition-all duration-300 text-white/40 hover:text-white hover:bg-white/10"
              >
                <ListChecks className="w-5 h-5" />
              </button>
            </Tooltip>

            <Tooltip content="Focus Mode" side="right">
              <button
                onClick={() => setFocusMode(true)}
                className="p-2.5 rounded-full transition-all duration-300 text-white/40 hover:text-white hover:bg-white/10"
              >
                <Eye className="w-5 h-5" />
              </button>
            </Tooltip>

            <Tooltip content="Reset Progress" side="right">
              <button
                onClick={() => {
                  if (window.confirm('Reset all daily progress?')) resetData();
                }}
                className="p-2.5 rounded-full transition-all duration-300 text-white/40 hover:text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </Tooltip>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col md:ml-24 md:h-screen overflow-hidden relative">
        <div className="h-20 md:hidden" />

        <div className={`w-full z-20 px-4 mb-4 flex justify-center transition-all duration-500 ease-out ${focusMode ? 'opacity-0 -translate-y-4 pointer-events-none' : 'opacity-1000 translate-y-0'}`}>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar max-w-full shadow-2xl">
            {FILTERS.map((f) => (
              <FilterButton
                key={f.id}
                active={filter === f.id}
                label={f.label}
                icon={f.icon}
                onClick={() => setFilter(f.id)}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col items-center p-4 min-h-0 w-full max-w-7xl mx-auto overflow-y-auto custom-scrollbar">
          <section className="flex-1 flex flex-col items-center justify-start w-full gap-6 md:gap-8 pb-20">
            <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center gap-6 relative">
              <div className="hidden md:block" />

              <div className="flex flex-col items-center justify-center">
                <BreathingOrb
                  scale={currentStep.scale}
                  color={selectedTech.color}
                  isActive={isActive}
                  action={currentStep.action}
                  duration={currentStep.duration}
                  progress={stepProgress}
                />

                <div className="mt-4 flex gap-2 text-[10px] uppercase tracking-[0.14em]">
                  {['Inhale', 'Hold', 'Exhale', 'Hold2'].map((phase, idx) => {
                    const match =
                      (phase === 'Hold' && currentStep.action === 'Hold') ||
                      (phase === 'Inhale' && (currentStep.action === 'Inhale' || currentStep.action === 'Inhale2')) ||
                      (phase === 'Exhale' && currentStep.action === 'Exhale');
                    return (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded-full border text-[10px] font-mono ${match
                          ? 'border-primary text-primary bg-primary/10'
                          : 'border-white/10 text-text-muted'
                          }`}
                      >
                        {phase === 'Hold2' ? 'Hold' : phase}
                      </span>
                    );
                  })}
                </div>

                <div className="mt-3 text-center space-y-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                    {currentStep.text}
                  </h2>
                  {isActive && (
                    <p className="text-4xl font-mono font-light text-white my-2">
                      {displaySeconds}
                    </p>
                  )}
                  <p className="text-xs md:text-sm text-slate-400 font-mono tracking-[0.16em] uppercase">
                    Step {currentStepIndex + 1} / {selectedTech.steps.length} · PAS {selectedTech.pas}
                  </p>
                  {activePreset && (
                    <p className="text-[11px] text-text-muted mt-1">
                      Preset: <span className="text-text-main font-semibold">{activePreset.label}</span> · Segment {presetSegmentIndex + 1}/{activePreset.segments.length}
                    </p>
                  )}
                  {!isActive && !activePreset && (
                    <p className="text-[11px] text-slate-500 mt-1">
                      Choose a technique or tap a preset below, then press <span className="font-semibold text-slate-200">Start</span>.
                    </p>
                  )}
                </div>

                {focusMode && (
                  <button
                    onClick={() => setFocusMode(false)}
                    className="mt-6 p-3 rounded-full bg-surface/80 text-text-muted hover:text-text-main hover:bg-surface backdrop-blur transition-all"
                    aria-label="Exit Focus Mode"
                  >
                    <EyeOff className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="hidden md:flex justify-start">
                <TechniqueDetail selectedTech={selectedTech} filterId={filter} filterLabel={selectedFilterLabel} />
              </div>
            </div>

            <div className={`w-full flex flex-col items-center gap-6 pb-4 transition-all duration-400 ${focusMode ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
              <div className="flex items-center gap-4">
                <button
                  onClick={resetSession}
                  className="group p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-all active:scale-95 shadow-md"
                  title="Reset Session"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>

                <button
                  onClick={toggleSession}
                  className={`group relative flex items-center justify-center gap-3 w-40 h-14 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl ${isActive ? 'bg-slate-900 text-slate-200 border border-slate-700' : 'bg-white text-slate-900'}`}
                  aria-label={isActive ? 'Pause' : 'Start'}
                  title={isActive ? 'Pause Session' : 'Start Session'}
                >
                  {isActive ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
                  <span className="font-bold text-lg">{isActive ? 'Pause' : 'Start'}</span>
                  {!isActive && <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-lg animate-pulse" />}
                </button>

                <button
                  onClick={stopSession}
                  className="group p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:bg-red-900/40 hover:text-red-300 hover:border-red-800/70 transition-all active:scale-95 shadow-md"
                  title="Stop & Center"
                >
                  <Square className="w-5 h-5 fill-current" />
                </button>
              </div>

              <div className="w-full max-w-3xl grid grid-cols-2 md:grid-cols-3 gap-3">
                <div className="col-span-1 md:col-span-1">
                  <StatCard label="Time" value={formatTime(totalSeconds)} />
                </div>
                <div className="col-span-1 md:col-span-1">
                  <StatCard label="Cycles" value={cycleCount} sub={`PAS ${selectedTech.pas}`} />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <StatCard label="Evening Protocol" value={`${compliance.doneCount}/${compliance.total}`} sub={compliance.completed ? 'v85-PNS.0 ✓' : 'In progress'} />
                </div>
              </div>

              <div className="w-full max-w-4xl">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs text-text-muted font-bold uppercase tracking-widest">Preset Routines</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {PRESETS.map((preset) => {
                    const Icon = preset.icon;
                    const active = activePresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        onClick={() => startPreset(preset.id)}
                        className={`flex items-start gap-2 p-3 rounded-xl border text-left transition-all ${active ? 'bg-primary/20 border-primary text-text-main' : 'bg-surface/70 border-white/5 text-text-main hover:border-white/10 hover:bg-surface'}`}
                        title={preset.description}
                      >
                        <div className={`p-1.5 rounded-lg ${active ? 'bg-primary text-background' : 'bg-white/10 text-text-muted'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-xs font-semibold">{preset.label}</div>
                          <div className="text-[11px] text-text-muted mt-1">{preset.description}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="w-full">
                <div className="flex justify-between items-end mb-3 ml-1">
                  <h3 className="text-text-muted text-xs font-bold uppercase tracking-widest">Techniques · Sorted by {selectedFilterLabel}</h3>
                  <span className="text-[10px] text-text-muted font-mono">Log: {todayKey}</span>
                </div>
                <TechniqueList
                  techniques={sortedTechniques}
                  selectedId={selectedTech.id}
                  filterId={filter}
                  dailyLog={todayLog}
                  onSelect={(tech) => changeTechnique(tech)}
                />
              </div>
            </div>
          </section>
        </div>
      </main>

      {showInfo && <InfoModal techniques={sortedTechniques} filterId={filter} filterLabel={selectedFilterLabel} onClose={() => setShowInfo(false)} />}
      {showProtocol && <ProtocolModal todayLog={todayLog} onChangeTechnique={(tech) => { changeTechnique(tech); setShowProtocol(false); }} onClose={() => setShowProtocol(false)} />}
    </div>
  );
};

const App = () => (
  <SettingsProvider>
    <HealthProviderComponent>
      <AppContent />
    </HealthProviderComponent>
  </SettingsProvider>
);

export default App;
