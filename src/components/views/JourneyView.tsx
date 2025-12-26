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

export const JourneyView = ({ compliance, dailyLog }: JourneyViewProps) => {
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

    return (
        <div className="w-full h-full overflow-y-auto pb-32 pt-12 px-6">
            <div className="max-w-md mx-auto space-y-10">

                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-white tracking-tight">Journey</h1>
                    <p className="text-white/40 text-sm">Your path to coherence.</p>
                </div>

                {/* Hero Stat */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-6 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 relative overflow-hidden"
                >
                    <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-emerald-300 mb-2">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm font-bold tracking-wider uppercase">Daily Protocol</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-light text-white">{compliance.doneCount}</span>
                            <span className="text-xl text-white/40">/ {compliance.total}</span>
                        </div>
                        <p className="text-xs text-white/40">
                            {compliance.completed
                                ? "Protocol Complete. Excellent work."
                                : `Complete ${compliance.total - compliance.doneCount} more sessions to hit your daily target.`}
                        </p>
                    </div>
                    {/* Decorative Blob */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full" />
                </motion.div>

                {/* Secondary Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                        <TrendingUp className="w-5 h-5 text-indigo-400" />
                        <div className="text-2xl font-semibold text-white">
                            {Math.floor(Object.values(dailyLog?.techSeconds || {}).reduce((a: number, b: number) => a + b, 0) / 60)} <span className="text-sm text-white/40 font-normal">min</span>
                        </div>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Today's Practice</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                        <Calendar className="w-5 h-5 text-orange-400" />
                        <div className="text-2xl font-semibold text-white">
                            {Object.keys(dailyLog?.techSeconds || {}).length}
                        </div>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest">Techniques</p>
                    </div>
                </div>

                {/* Account Section */}
                <section>
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Cloud Account</h3>
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {user?.photoURL ? (
                                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-white/20" />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                    <UserIcon className="w-5 h-5 text-white/50" />
                                </div>
                            )}
                            <div>
                                <div className="text-sm font-medium text-white">
                                    {user ? user.displayName : 'Guest User'}
                                </div>
                                <div className="text-xs text-white/40">
                                    {user ? 'Progress syncing to cloud' : 'Progress saved locally'}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={user ? signOut : signInWithGoogle}
                            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-medium transition-colors"
                        >
                            {user ? 'Sign Out' : 'Sign In'}
                        </button>
                    </div>
                </section>

                {/* Weekly Analytics */}
            </div>

            {/* All Time & Streak */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="text-2xl font-semibold text-white">
                        {userStats.streak} <span className="text-sm text-white/40 font-normal">days</span>
                    </div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">Current Streak</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <div className="text-2xl font-semibold text-white">
                        {userStats.totalMinutes} <span className="text-sm text-white/40 font-normal">min</span>
                    </div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest">All Time</p>
                </div>
            </div>

            {/* Weekly Analytics */}
            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Last 7 Days</h3>
                </div>
                <WeeklyChart data={stats} />
            </div>

            {/* Settings List */}
            <section>
                <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Preferences</h3>
                <div className="rounded-2xl overflow-hidden border border-white/10">
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
                        label="Reset Progress"
                        value="Clear Data"
                        active={false}
                        onClick={() => { if (confirm('Reset all stats?')) resetData(); }}
                    />
                </div>
            </section>

            {/* Theme Picker (Horizontal) */}
            <section>
                <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-4">Theme</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                    {['midnight', 'ocean', 'forest', 'fire'].map(t => (
                        <button
                            key={t}
                            onClick={() => setTheme(t as Theme)}
                            aria-label={`Select ${t} theme`}
                            title={`Select ${t} theme`}
                            className={cn(
                                "w-12 h-12 rounded-full border-2 transition-all flex-shrink-0",
                                theme === t ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-100",
                                t === 'midnight' ? 'bg-slate-900' :
                                    t === 'ocean' ? 'bg-cyan-900' :
                                        t === 'forest' ? 'bg-emerald-900' : 'bg-red-900'
                            )}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
};
