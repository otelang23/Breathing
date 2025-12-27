import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Calendar, Settings, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAnalytics } from '../../hooks/useAnalytics';
import { WeeklyChart } from '../features/WeeklyChart';
import { Heatmap } from '../features/Heatmap';
import { TECHNIQUES } from '../../data/techniques';

import { type DailyLogEntry, type Technique } from '../../types';

interface JourneyViewProps {
    compliance: { doneCount: number; total: number; completed: boolean; };
    dailyLog: DailyLogEntry;
    onChangeTechnique: (t: Technique) => void;
    onOpenSettings: () => void;
}

export const DesktopJourneyView = ({ compliance, dailyLog, onOpenSettings }: JourneyViewProps) => {
    const { user, signInWithGoogle, signOut } = useAuth();
    const { stats, userStats, techniqueStats, heatmapData } = useAnalytics();


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
                                        : `${compliance.total - compliance.doneCount} more goals needed to hit your daily target.`}
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

                    {/* Column 2: Weekly Activity */}
                    <div className="space-y-6">
                        <div className="h-full p-8 rounded-3xl bg-white/5 border border-white/10 flex flex-col justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest mb-6">Last 7 Days</h3>
                                <div className="h-[200px]">
                                    <WeeklyChart data={stats} />
                                </div>
                            </div>

                            {/* Technique Breakdown */}
                            <div className="pt-6 border-t border-white/5 space-y-4">
                                <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Focus Distribution</h3>
                                <div className="space-y-3">
                                    {Object.entries(techniqueStats)
                                        .sort(([, a], [, b]) => b - a)
                                        .filter(([, mins]) => mins > 0)
                                        .slice(0, 4) // Top 4
                                        .map(([techId, mins]) => {
                                            const tech = TECHNIQUES.find(t => t.id === techId);
                                            const total = Object.values(techniqueStats).reduce((a, b) => a + b, 0) || 1;
                                            const percent = Math.round((mins / total) * 100);

                                            return (
                                                <div key={techId} className="group">
                                                    <div className="flex justify-between items-center text-xs text-white/60 mb-1">
                                                        <span>{tech?.name || techId}</span>
                                                        <span>{mins}m ({percent}%)</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-indigo-500/50 group-hover:bg-indigo-400 transition-all rounded-full"
                                                            style={{ width: `${percent}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    {Object.keys(techniqueStats).length === 0 && (
                                        <div className="text-xs text-white/20 italic">No activity this week.</div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs font-bold text-white/30 uppercase tracking-widest">
                                        <span>Consistency</span>
                                        <span>{stats.filter(s => s.minutes > 0).length} / 7 active days</span>
                                    </div>
                                    <Heatmap data={heatmapData} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Column 3: Stats & Personalization */}
                    <div className="space-y-6 flex flex-col">
                        {/* All Time Card */}
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4 flex-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-full bg-indigo-500/20 text-indigo-300">
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-medium text-white">Lifetime Stats</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="text-4xl font-light text-white">{userStats.totalMinutes}</div>
                                    <div className="text-sm text-white/40">Total Minutes Breathed</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-light text-white">{userStats.streak}</div>
                                    <div className="text-sm text-white/40">Current Day Streak</div>
                                </div>
                            </div>
                        </div>

                        {/* Settings CTA */}
                        <div
                            onClick={onOpenSettings}
                            className="p-6 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors"
                        >
                            <div>
                                <h4 className="text-white font-medium">Personalize</h4>
                                <p className="text-xs text-white/50 mt-1">Themes, Sounds, Haptics</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                <Settings className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
