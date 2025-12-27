import { motion } from 'framer-motion';
import { useState } from 'react';
import { X, Volume2, VolumeX, Smartphone, Monitor } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { THEMES } from '../../constants/themes';
import { TECHNIQUES } from '../../data/techniques';
import { type Theme } from '../../context/SettingsContextDefinition';
import { cn } from '../../lib/utils';

import { Activity, Check, Loader2 } from 'lucide-react';
import { useHealth } from '../../services/health/HealthContext';
import type { HealthProvider } from '../../services/health/types';

interface SettingsModalProps {
    onClose: () => void;
}

const HealthToggle = ({ provider }: { provider: HealthProvider }) => {
    const { activeProvider, connect, disconnect, isAvailable } = useHealth();
    const isConnected = activeProvider === provider;
    const [loading, setLoading] = useState(false);

    if (!isAvailable[provider]) return null;

    const toggle = async () => {
        setLoading(true);
        if (isConnected) {
            await disconnect();
        } else {
            await connect(provider);
        }
        setLoading(false);
    };

    return (
        <button
            onClick={toggle}
            disabled={loading}
            className={cn(
                "relative flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all",
                isConnected ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" : "bg-white/5 text-white/40 border border-white/10 hover:bg-white/10"
            )}
        >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : isConnected ? <Check className="w-3 h-3" /> : null}
            {isConnected ? "Connected" : "Connect"}
        </button>
    );
};

export const SettingsModal = ({ onClose }: SettingsModalProps) => {
    const {
        theme, setTheme,
        soundMode, setSoundMode,
        hapticEnabled, setHapticEnabled,
        officeMode, setOfficeMode
    } = useSettings();

    // Use the 15 themes from constants
    const themesList = Object.values(THEMES);
    const { dailyGoal, setDailyGoal } = useSettings();

    const [localGoals, setLocalGoals] = useState(dailyGoal);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveGoals = async () => {
        setIsSaving(true);
        // Simulate a small delay for feedback or await sync if possible (context handles sync effect)
        setDailyGoal(localGoals);
        // Short delay to show feedback
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsSaving(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                className="relative bg-[#0f172a] border-t sm:border border-white/10 w-full sm:max-w-md overflow-hidden rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-light text-white tracking-tight">Preferences</h2>
                    <button onClick={onClose} aria-label="Close Settings" className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Theme Section */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Theme</label>
                        <div className="grid grid-cols-5 gap-2">
                            {themesList.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => setTheme(t.id as Theme)}
                                    // Tooltip/Label on hover could be good, but simple grid is cleaner for mobile
                                    className={cn(
                                        "group flex flex-col items-center gap-1 p-1 rounded-xl transition-all relative",
                                        theme === t.id ? "bg-white/10 ring-1 ring-white/40" : "hover:bg-white/5"
                                    )}
                                    title={t.label}
                                >
                                    <div
                                        className="w-10 h-10 rounded-full border border-white/10 shadow-lg transition-transform group-active:scale-95"
                                        style={{ backgroundColor: t.color }}
                                    >
                                        {theme === t.id && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white drop-shadow-md" />
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-[9px] text-white/40 group-hover:text-white/80 transition-colors truncate w-full text-center">{t.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sound Mode */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Audio Experience</label>
                        <div className="flex bg-white/5 p-1 rounded-xl">
                            <button
                                onClick={() => setSoundMode('rich')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all",
                                    soundMode === 'rich' ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white"
                                )}
                            >
                                <Volume2 className="w-4 h-4" />
                                <span>Rich</span>
                            </button>
                            <button
                                onClick={() => setSoundMode('minimal')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all",
                                    soundMode === 'minimal' ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white"
                                )}
                            >
                                <Volume2 className="w-4 h-4" />
                                <span>Minimal</span>
                            </button>
                            <button
                                onClick={() => setSoundMode('silent')}
                                className={cn(
                                    "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-all",
                                    soundMode === 'silent' ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white"
                                )}
                            >
                                <VolumeX className="w-4 h-4" />
                                <span>Silent</span>
                            </button>
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <Smartphone className="w-5 h-5 text-white/60" />
                                <div>
                                    <div className="text-sm text-white">Haptic Feedback</div>
                                    <div className="text-[10px] text-white/40">Vibrate on inhale/exhale cues</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setHapticEnabled(!hapticEnabled)}
                                aria-label={hapticEnabled ? "Disable Haptics" : "Enable Haptics"}
                                className={cn(
                                    "w-10 h-6 rounded-full transition-colors relative",
                                    hapticEnabled ? "bg-indigo-500" : "bg-white/10"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                                    hapticEnabled ? "translate-x-4" : "translate-x-0"
                                )} />
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <Monitor className="w-5 h-5 text-white/60" />
                                <div>
                                    <div className="text-sm text-white">Office Mode</div>
                                    <div className="text-[10px] text-white/40">Less flashy, more discreet</div>
                                </div>
                            </div>
                            <button
                                onClick={() => setOfficeMode(!officeMode)}
                                aria-label={officeMode ? "Disable Office Mode" : "Enable Office Mode"}
                                className={cn(
                                    "w-10 h-6 rounded-full transition-colors relative",
                                    officeMode ? "bg-indigo-500" : "bg-white/10"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform",
                                    officeMode ? "translate-x-4" : "translate-x-0"
                                )} />
                            </button>
                        </div>
                        {/* Health Integrations */}
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-white/60" />
                                <div>
                                    <div className="text-sm text-white">Google Fit Sync</div>
                                    <div className="text-[10px] text-white/40">Sync minutes & sessions</div>
                                </div>
                            </div>
                            <HealthToggle provider="google" />
                        </div>
                    </div>

                    {/* Daily Goal Configuration */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Daily Protocol</label>
                            <button
                                onClick={() => {
                                    setLocalGoals([
                                        ...localGoals,
                                        { id: Date.now().toString(), techniqueId: 'any', targetMinutes: 5 }
                                    ]);
                                }}
                                className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white transition-colors"
                            >
                                + Add Goal
                            </button>
                        </div>

                        <div className="space-y-2">
                            {localGoals.map((goal, idx) => (
                                <div key={goal.id || idx} className="flex items-center gap-2 bg-white/5 p-2 rounded-lg border border-white/5">
                                    {/* Tech Selector */}
                                    <select
                                        className="bg-transparent text-xs text-white outline-none w-[120px] bg-black/20 rounded px-1 py-1"
                                        value={goal.techniqueId}
                                        onChange={(e) => {
                                            const newGoals = [...localGoals];
                                            newGoals[idx].techniqueId = e.target.value;
                                            setLocalGoals(newGoals);
                                        }}
                                    >
                                        <option value="any">Any Technique</option>
                                        {TECHNIQUES.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>

                                    {/* Duration Input */}
                                    <div className="flex items-center gap-1 bg-black/20 rounded px-2 py-1">
                                        <input
                                            type="number"
                                            min="1"
                                            max="120"
                                            className="w-8 bg-transparent text-xs text-white text-right outline-none"
                                            value={goal.targetMinutes}
                                            onChange={(e) => {
                                                const newGoals = [...localGoals];
                                                newGoals[idx].targetMinutes = parseInt(e.target.value) || 1;
                                                setLocalGoals(newGoals);
                                            }}
                                        />
                                        <span className="text-[10px] text-white/40">min</span>
                                    </div>

                                    {/* Delete */}
                                    <button
                                        onClick={() => {
                                            const newGoals = localGoals.filter((_, i) => i !== idx);
                                            setLocalGoals(newGoals);
                                        }}
                                        className="ml-auto p-1.5 text-white/20 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {localGoals.length === 0 && (
                                <p className="text-xs text-white/30 italic text-center py-2">No active goals.</p>
                            )}
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSaveGoals}
                            disabled={isSaving}
                            className={cn(
                                "w-full py-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2",
                                isSaving ? "bg-white/5 text-white/40" : "bg-indigo-500 hover:bg-indigo-400 text-white shadow-lg shadow-indigo-500/20"
                            )}
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Protocol "
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
