import { motion } from 'framer-motion';
import { Moon, Volume2, Smartphone, RotateCcw, CheckCircle2, TrendingUp, Calendar, Settings, User as UserIcon } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useAuth } from '../../hooks/useAuth';
import { useAnalytics } from '../../hooks/useAnalytics';
import { WeeklyChart } from '../features/WeeklyChart';
import { cn } from '../../lib/utils';
import { useDailyLog } from '../../hooks/useDailyLog';

import { type DailyLogEntry, type Technique } from '../../types';
import { type Theme } from '../../context/SettingsContextDefinition';

interface JourneyViewProps {
    compliance: { doneCount: number; total: number; completed: boolean; };
    dailyLog: DailyLogEntry;
    onChangeTechnique: (t: Technique) => void;
}

// Helper for Settings Row
interface SettingRowProps {
    icon: React.ElementType;
    label: string;
    value: string;
    onClick: () => void;
    active: boolean;
}

const SettingRow = ({ icon: Icon, label, value, onClick, active }: SettingRowProps) => (
    <button
        onClick={() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (typeof navigator !== 'undefined' && (navigator as any).vibrate) (navigator as any).vibrate(5);
            onClick();
        }}
        className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border-b border-white/5 last:border-0 transition-colors"
    >
        <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-full bg-white/5", active ? "text-white" : "text-white/50")}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm text-white/80">{label}</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">{value}</span>
            <div className={cn("w-8 h-5 rounded-full relative transition-colors", active ? "bg-emerald-500/50" : "bg-white/10")}>
                <div className={cn("absolute top-1 bottom-1 w-3 rounded-full bg-white transition-all", active ? "left-4" : "left-1")} />
            </div>
        </div>
    </button>
);

export const DesktopJourneyView = ({ compliance, dailyLog }: JourneyViewProps) => {
    const { user, signInWithGoogle, signOut } = useAuth();
    const { stats, userStats } = useAnalytics();
    const {
        theme, setTheme,
        soundMode, setSoundMode,
        hapticEnabled, setHapticEnabled,
        sleepMode, setSleepMode,
        audioVariant, setAudioVariant
    } = useSettings();

    const { resetData } = useDailyLog();

    const todayMinutes = Math.floor(Object.values(dailyLog?.techSeconds || {}).reduce((a: number, b: number) => a + b, 0) / 60);

    return (
        <div className="w-full h-full p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="flex items-end justify-between border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-thin tracking-wider text-white uppercase drop-shadow-md">Journey</h1>
                        <p className="text-white/40 text-sm font-light mt-2 tracking-wide">Your path to coherence & mastery.</p>
                    </div>

                    {/* Quick Account Status in Header */}
                    <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                        <div className="text-right">
                            <div className="text-sm font-medium text-white">{user ? user.displayName : 'Guest User'}</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-wider">{user ? 'Sync Active' : 'Local Storage'}</div>
                        </div>
                        {user?.photoURL ? (
                            <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-white/20" />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <UserIcon className="w-5 h-5 text-white/50" />
                            </div>
                        )}
                        <button
                            onClick={user ? signOut : signInWithGoogle}
                            className="text-xs text-indigo-300 hover:text-white px-2 py-1 rounded hover:bg-white/10 transition-colors"
                        >
                            {user ? 'Log Out' : 'Sign In'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Column 1: Daily Progress & Hero Stats */}
                    <div className="space-y-6">
                        {/* Daily Protocol Card */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 relative overflow-hidden min-h-[240px] flex flex-col justify-center"
                        >
                            <div className="relative z-10 space-y-6">
                                <div className="flex items-center gap-2 text-emerald-300">
                                    <CheckCircle2 className="w-6 h-6" />
                                    <span className="text-sm font-bold tracking-[0.2em] uppercase">Daily Target</span>
                                </div>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-7xl font-thin text-white font-mono tracking-tighter">{compliance.doneCount}</span>
                                    <span className="text-3xl text-white/40 font-light">/ {compliance.total}</span>
                                </div>
                                <p className="text-sm text-white/50 leading-relaxed max-w-[80%]">
                                    {compliance.completed
                                        ? "Protocol Complete. Excellent work maintaining your rhythm."
                                        : `${compliance.total - compliance.doneCount} more sessions needed to hit your daily target.`}
                                </p>
                            </div>
                            {/* Decorative Blob */}
                            <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-emerald-500/20 blur-3xl rounded-full" />
                        </motion.div>

                        {/* Quick Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                <TrendingUp className="w-5 h-5 text-indigo-400 mb-2" />
                                <div className="text-3xl font-light text-white font-mono">{todayMinutes} <span className="text-sm text-white/40">m</span></div>
                                <div className="text-[10px] text-white/30 uppercase tracking-widest">Today</div>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                                <Calendar className="w-5 h-5 text-orange-400 mb-2" />
                                <div className="text-3xl font-light text-white font-mono">{Object.keys(dailyLog?.techSeconds || {}).length}</div>
                                <div className="text-[10px] text-white/30 uppercase tracking-widest">Techniques</div>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-1 col-span-2 flex items-center justify-between">
                                <div>
                                    <div className="text-3xl font-light text-white font-mono">{userStats.streak}</div>
                                    <div className="text-[10px] text-white/30 uppercase tracking-widest">Day Streak</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-light text-white font-mono">{userStats.totalMinutes}</div>
                                    <div className="text-[10px] text-white/30 uppercase tracking-widest">Total Mins</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Analytics Chart */}
                    <div className="space-y-6">
                        <div className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col">
                            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6">Last 7 Days Activity</h3>
                            <div className="flex-1 min-h-[300px]">
                                <WeeklyChart data={stats} />
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Settings & Preferences */}
                    <div className="space-y-6">
                        <div className="rounded-3xl border border-white/10 overflow-hidden bg-black/20 backdrop-blur-sm">
                            <div className="p-4 bg-white/5 border-b border-white/5">
                                <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">System Preferences</h3>
                            </div>
                            <SettingRow
                                icon={Volume2}
                                label="Soundscape"
                                value={soundMode === 'rich' ? 'Max' : soundMode === 'minimal' ? 'Min' : 'Off'}
                                active={soundMode !== 'silent'}
                                onClick={() => {
                                    const modes = ['silent', 'minimal', 'rich'] as const;
                                    const next = modes[(modes.indexOf(soundMode) + 1) % modes.length];
                                    setSoundMode(next);
                                }}
                            />
                            <SettingRow
                                icon={Smartphone}
                                label="Haptics"
                                value={hapticEnabled ? 'On' : 'Off'}
                                active={hapticEnabled}
                                onClick={() => setHapticEnabled(!hapticEnabled)}
                            />
                            <SettingRow
                                icon={Moon}
                                label="Sleep Mode"
                                value={sleepMode ? 'Auto-Fade' : 'Manual'}
                                active={sleepMode}
                                onClick={() => setSleepMode(!sleepMode)}
                            />
                            <SettingRow
                                icon={Settings}
                                label="Audio Engine"
                                value={audioVariant === 'binaural' ? 'Binaural' : audioVariant === 'noise' ? 'Pink Noise' : 'Standard'}
                                active={audioVariant !== 'standard'}
                                onClick={() => {
                                    const next = audioVariant === 'standard' ? 'binaural' : audioVariant === 'binaural' ? 'noise' : 'standard';
                                    setAudioVariant(next);
                                }}
                            />
                            <SettingRow
                                icon={RotateCcw}
                                label="Reset Data"
                                value="Danger Zone"
                                active={false}
                                onClick={() => { if (confirm('Reset all stats?')) resetData(); }}
                            />
                        </div>

                        <div className="p-6 rounded-3xl border border-white/10 bg-white/5">
                            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Theme Selection</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {['midnight', 'ocean', 'forest', 'fire'].map(t => (
                                    <button
                                        key={t}
                                        onClick={() => setTheme(t as Theme)}
                                        aria-label={`Select ${t} theme`}
                                        className={cn(
                                            "aspect-square rounded-xl border-2 transition-all hover:scale-105",
                                            theme === t ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "border-white/10 opacity-50 hover:opacity-100",
                                            t === 'midnight' ? 'bg-slate-900' :
                                                t === 'ocean' ? 'bg-cyan-900' :
                                                    t === 'forest' ? 'bg-emerald-900' : 'bg-red-900'
                                        )}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
