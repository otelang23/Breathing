import { useState, useMemo } from 'react';
import { Wind, Volume2, Smartphone, Shield, Moon, ListChecks, Eye, Trash2, Info, RotateCcw, Pause, Play, Square, EyeOff, Headphones, CloudRain, Activity } from 'lucide-react';


import { TECHNIQUES } from './data/techniques';
import { FILTERS } from './data/filters';
import { PRESETS } from './data/presets';

import { SettingsProvider, useSettings } from './context/SettingsContext';
import { useDailyLog } from './hooks/useDailyLog';
import { useBreathingSession } from './hooks/useBreathingSession';

import { BreathingOrb } from './components/ui/BreathingOrb';
import { StatCard } from './components/ui/StatCard';
import { FilterButton } from './components/ui/FilterButton';
import { TechniqueList } from './components/features/TechniqueList';
import { TechniqueDetail } from './components/features/TechniqueDetail';
import { InfoModal } from './components/modals/InfoModal';
import { ProtocolModal } from './components/modals/ProtocolModal';

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
      const rankA = (a.ranks as any)[filter] ?? 99;
      const rankB = (b.ranks as any)[filter] ?? 99;
      return rankA - rankB;
    });
  }, [filter]);

  const selectedFilterLabel = FILTERS.find((f) => f.id === filter)?.label || 'PAS Score';
  const todayKey = new Date().toISOString().slice(0, 10);

  // Calculate remaining time for the current step
  const remainingSeconds = Math.ceil((currentStep.duration * (1 - stepProgress / 100)) / 1000);
  const displaySeconds = remainingSeconds > 0 ? remainingSeconds : 1; // Prevent 0 flash

  return (
    <div className={`h-screen w-screen bg-background text-text-main font-sans selection:bg-primary/30 relative flex flex-col overflow-y-auto theme-${theme}`}>
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
      <div
        className={`absolute top-0 left-0 right-0 h-[55vh] bg-gradient-to-b ${selectedTech.color} to-transparent opacity-10 blur-3xl transition-all duration-700 pointer-events-none`}
      />

      {/* HEADER */}
      <header
        className={`w-full p-4 md:p-6 flex justify-between items-center z-20 relative transition-all duration-400 ${focusMode ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'}`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-text-muted flex items-center justify-center shadow-lg shadow-white/10">
            <Wind className="text-background w-5 h-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-text-main">Nebra</span>
            <span className="text-[10px] text-text-muted font-mono tracking-widest">
              v5.2
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Sound mode selector */}
          <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/10 hover:border-white/20 transition-colors">
            {['silent', 'minimal', 'rich'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSoundMode(mode as any)}
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-[0.16em] ${soundMode === mode
                  ? 'bg-white text-slate-900'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
              >
                {mode === 'silent' && 'Off'}
                {mode === 'minimal' && 'Min'}
                {mode === 'rich' && 'Rich'}
              </button>
            ))}


            {/* Theme Toggle */}
            <button
              onClick={() => {
                const themes: typeof theme[] = ['midnight', 'ocean', 'forest', 'sunset'];
                const nextIdx = (themes.indexOf(theme) + 1) % themes.length;
                setTheme(themes[nextIdx]);
              }}
              className="p-1 rounded-full transition-colors text-text-muted hover:text-text-main"
              title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
            >
              <div className={`w-4 h-4 rounded-full border border-current ${theme === 'midnight' ? 'bg-slate-900' :
                  theme === 'ocean' ? 'bg-blue-900' :
                    theme === 'forest' ? 'bg-green-900' : 'bg-red-900'
                }`} />
            </button>

            <div className="w-px h-4 bg-white/10 mx-1" />

            {/* Audio Variant Toggle */}
            <button
              onClick={() => {
                const next = audioVariant === 'standard' ? 'binaural' : audioVariant === 'binaural' ? 'noise' : 'standard';
                setAudioVariant(next);
              }}
              className={`p-1 rounded-full transition-colors ${audioVariant !== 'standard' ? 'text-primary bg-primary/20' : 'text-text-muted hover:text-text-main'}`}
              title={`Audio: ${audioVariant.charAt(0).toUpperCase() + audioVariant.slice(1)}`}
            >
              {audioVariant === 'standard' && <Activity className="w-4 h-4" />}
              {audioVariant === 'binaural' && <Headphones className="w-4 h-4" />}
              {audioVariant === 'noise' && <CloudRain className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-1 ml-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={soundMode === 'silent' ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-white"
                aria-label="Volume"
              />
            </div>
          </div>

          <button
            onClick={() => setHapticEnabled((prev) => !prev)}
            className={`p-2 rounded-full transition-colors hidden md:block ${hapticEnabled ? 'text-teal-400 bg-teal-900/20' : 'text-slate-500 hover:bg-white/10'}`}
            title="Toggle Haptic Feedback"
          >
            <Smartphone className="w-5 h-5" />
          </button>

          <button
            onClick={() => setOfficeMode((p) => !p)}
            className={`p-2 rounded-full transition-colors ${officeMode ? 'bg-slate-200 text-slate-900' : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800'}`}
            title="Office / Discreet Mode"
          >
            <Shield className="w-5 h-5" />
          </button>

          <button
            onClick={() => setSleepMode((p) => !p)}
            className={`p-2 rounded-full transition-colors ${sleepMode ? 'bg-indigo-500 text-white' : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800'}`}
            title="Sleep Mode (Auto fade audio)"
          >
            <Moon className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowProtocol(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white bg-white/10 border border-white/20 shadow-lg shadow-white/5"
            title="Evening Protocol"
          >
            <ListChecks className="w-5 h-5" />
          </button>

          <button
            onClick={() => setFocusMode(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            title="Enter Focus Mode"
            aria-label="Enter Focus Mode"
          >
            <Eye className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset all daily progress?')) resetData();
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-red-400"
            title="Reset All Data"
            aria-label="Reset All Data"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowInfo(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Open Technique Guide"
          >
            <Info className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* FILTER BAR */}
      <div className={`w-full z-20 px-4 mb-2 flex justify-center transition-all duration-400 ${focusMode ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 max-w-full">
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

      {/* MAIN */}
      <main className="relative z-10 flex-1 flex flex-col items-center p-4 min-h-0">
        <section className="flex-1 flex flex-col items-center justify-center w-full gap-6 md:gap-8">
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

              {/* Phase labels row */}
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
      </main>

      {showInfo && <InfoModal techniques={sortedTechniques} filterId={filter} filterLabel={selectedFilterLabel} onClose={() => setShowInfo(false)} />}
      {showProtocol && <ProtocolModal todayLog={todayLog} onChangeTechnique={(tech) => { changeTechnique(tech); setShowProtocol(false); }} onClose={() => setShowProtocol(false)} />}
    </div>
  );
};

const App = () => (
  <SettingsProvider>
    <AppContent />
  </SettingsProvider>
);

export default App;
