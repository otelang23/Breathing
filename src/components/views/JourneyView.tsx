import { StatCard } from '../ui/StatCard';
import { useSettings } from '../../context/SettingsContext';
import { Volume2, Smartphone, Shield, Moon, Eye, Trash2, Activity, Headphones, CloudRain, ListChecks } from 'lucide-react';
import { ProtocolModal } from '../modals/ProtocolModal';
import { useState } from 'react';

export const JourneyView = ({ compliance, dailyLog, onChangeTechnique }: any) => {
    const {
        volume, setVolume, soundMode, setSoundMode,
        hapticEnabled, setHapticEnabled,
        officeMode, setOfficeMode,
        sleepMode, setSleepMode,
        theme, setTheme,
        audioVariant, setAudioVariant
    } = useSettings();

    const [showProtocol, setShowProtocol] = useState(false);

    // Calculate total minutes today
    const totalMins = Object.values(dailyLog?.techSeconds || {}).reduce((a: any, b: any) => a + b, 0) as number / 60;

    return (
        <div className="flex-1 w-full flex flex-col pt-4 pb-24 px-4 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Your Journey</h1>
                    <p className="text-xs text-text-muted mt-0.5 uppercase tracking-wider">Stats & Settings</p>
                </div>
                <div className="p-2 bg-white/5 rounded-full">
                    <div className={`w-3 h-3 rounded-full ${compliance.completed ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-orange-500'}`} />
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-3 mb-8">
                <StatCard
                    label="Today's Focus"
                    value={`${Math.round(totalMins)}m`}
                    sub="Total Practice"
                />
                <StatCard
                    label="Protocol"
                    value={`${compliance.doneCount}/${compliance.total}`}
                    sub={compliance.completed ? 'Completed' : 'In Progress'}
                    onClick={() => setShowProtocol(true)}
                />
            </div>

            {/* Settings Sections */}
            <div className="space-y-6">

                {/* Audio Section */}
                <section className="bg-surface/40 rounded-2xl p-4 border border-white/5">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Volume2 className="w-3 h-3" /> Audio & Haptics
                    </h3>

                    <div className="mb-4">
                        <div className="flex justify-between text-xs mb-2 text-white/70">
                            <span>Master Volume</span>
                            <span>{Math.round(volume * 100)}%</span>
                        </div>
                        <input
                            type="range"
                            min="0" max="1" step="0.05"
                            value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-full appearance-none accent-white"
                        />
                    </div>

                    <div className="flex justify-between gap-2">
                        <div className="flex bg-black/20 rounded-lg p-1">
                            {['silent', 'minimal', 'rich'].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setSoundMode(m as any)}
                                    className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all ${soundMode === m ? 'bg-white text-black shadow-sm' : 'text-white/40'
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setHapticEnabled(!hapticEnabled)}
                            className={`p-2 rounded-lg border transition-all ${hapticEnabled ? 'bg-teal-500/20 border-teal-500 text-teal-400' : 'border-white/10 text-white/40'}`}
                        >
                            <Smartphone className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex gap-2 mt-3">
                        {['standard', 'binaural', 'noise'].map((v) => (
                            <button
                                key={v}
                                onClick={() => setAudioVariant(v as any)}
                                className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 border transition-all ${audioVariant === v ? 'bg-primary/20 border-primary text-primary' : 'bg-white/5 border-transparent text-white/40'
                                    }`}
                            >
                                {v === 'standard' && <Activity className="w-4 h-4" />}
                                {v === 'binaural' && <Headphones className="w-4 h-4" />}
                                {v === 'noise' && <CloudRain className="w-4 h-4" />}
                            </button>
                        ))}
                    </div>
                </section>

                {/* Appearance & Modes */}
                <section className="bg-surface/40 rounded-2xl p-4 border border-white/5 gap-4 grid grid-cols-1">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                        <Eye className="w-3 h-3" /> Experience
                    </h3>

                    <div className="grid grid-cols-4 gap-2">
                        {['midnight', 'ocean', 'forest', 'sunset'].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTheme(t as any)}
                                className={`h-12 rounded-xl border-2 transition-all ${theme === t ? 'border-white scale-105 shadow-lg' : 'border-transparent opacity-60'
                                    }`}
                                style={{
                                    backgroundColor:
                                        t === 'midnight' ? '#6366f1' : // Indigo
                                            t === 'ocean' ? '#06b6d4' : // Cyan
                                                t === 'forest' ? '#10b981' : // Emerald
                                                    '#f97316' // Orange
                                }}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <button
                            onClick={() => setOfficeMode(!officeMode)}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${officeMode ? 'bg-white text-black border-white' : 'bg-white/5 border-white/10 text-white/60'}`}
                        >
                            <Shield className="w-5 h-5" />
                            <span className="text-[10px] font-bold uppercase">Office</span>
                        </button>
                        <button
                            onClick={() => setSleepMode(!sleepMode)}
                            className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${sleepMode ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-white/5 border-white/10 text-white/60'}`}
                        >
                            <Moon className="w-5 h-5" />
                            <span className="text-[10px] font-bold uppercase">Sleep</span>
                        </button>
                        <button
                            onClick={() => setShowProtocol(true)}
                            className="p-3 rounded-xl border border-white/10 bg-white/5 text-white/60 flex flex-col items-center gap-2"
                        >
                            <ListChecks className="w-5 h-5" />
                            <span className="text-[10px] font-bold uppercase">Protocol</span>
                        </button>
                    </div>
                </section>

                <button
                    onClick={() => { if (confirm('Reset all progress?')) window.location.reload(); }} // Simple reload/reset for now
                    className="w-full py-4 text-xs text-red-400/60 font-mono hover:text-red-400 flex items-center justify-center gap-2"
                >
                    <Trash2 className="w-4 h-4" /> Reset Application Data
                </button>
            </div>

            {showProtocol && <ProtocolModal todayLog={dailyLog} onChangeTechnique={(tech: any) => { onChangeTechnique(tech); setShowProtocol(false); }} onClose={() => setShowProtocol(false)} />}
        </div>
    );
};
