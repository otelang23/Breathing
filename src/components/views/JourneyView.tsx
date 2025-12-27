import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp, Calendar, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useAnalytics } from '../../hooks/useAnalytics';
import { WeeklyChart } from '../features/WeeklyChart';

import { type DailyLogEntry, type Technique } from '../../types';

interface JourneyViewProps {
    compliance: { doneCount: number; total: number; completed: boolean; };
    dailyLog: DailyLogEntry;
    onChangeTechnique: (t: Technique) => void;
}

export const JourneyView = ({ compliance, dailyLog }: JourneyViewProps) => {
    const { user, signInWithGoogle, signOut } = useAuth();
    const { stats, userStats } = useAnalytics();

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
                                : `Complete ${compliance.total - compliance.doneCount} more goals to hit your daily target.`}
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

                {/* Streak Stats */}
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

                {/* Account Section - Moved to bottom for cleaner hierarchy */}
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
                                    {user ? 'Data synced' : 'Local storage'}
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

                <div className="text-center pb-8">
                    <p className="text-[10px] text-white/20 uppercase tracking-widest">Version 1.2 Pro</p>
                </div>
            </div>
        </div>
    );
};
