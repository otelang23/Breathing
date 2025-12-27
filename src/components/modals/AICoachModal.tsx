import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, X, Loader2, Play, AlertCircle, Key, Activity, Heart } from 'lucide-react';
import { GeminiCoach } from '../../services/ai/GeminiCoach';
import type { Technique } from '../../types';
import { useSettings } from '../../hooks/useSettings';

interface AICoachModalProps {
    onClose: () => void;
    onStartTechnique: (tech: Technique) => void;
}

export const AICoachModal = ({ onClose, onStartTechnique }: AICoachModalProps) => {
    // Input State
    const [hr, setHr] = useState<string>('75');
    const [hrv, setHrv] = useState<string>('50');
    const [goal, setGoal] = useState<string>('Relaxation');

    // Access Global Settings
    const { geminiApiKey, setGeminiApiKey } = useSettings();

    // Process State
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedTech, setGeneratedTech] = useState<Technique | null>(null);

    const handleGenerate = async () => {
        if (!geminiApiKey) {
            setError("Please provide a valid Google Gemini API Key.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const coach = new GeminiCoach(geminiApiKey);
            const tech = await coach.generateSession(Number(hr), Number(hrv), goal);

            // Add required frontend props if missing
            const finalTech: Technique = {
                ...tech,
                id: `ai_${Date.now()}`, // Ensure unique ID
                color: 'from-fuchsia-500 to-cyan-500' // Default AI Theme
            };

            setGeneratedTech(finalTech);
        } catch (err) {
            console.error(err);
            setError("Failed to generate plan. Please check your API Key and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white tracking-wide">AI Breathing Coach</h2>
                            <p className="text-xs text-white/50">Powered by Google Gemini</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">

                    {!generatedTech ? (
                        <>
                            {/* Inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                                        <Heart className="w-3 h-3 text-rose-500" /> Heart Rate (BPM)
                                    </label>
                                    <input
                                        type="number"
                                        value={hr}
                                        onChange={(e) => setHr(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                                        <Activity className="w-3 h-3 text-emerald-500" /> HRV (ms)
                                    </label>
                                    <input
                                        type="number"
                                        value={hrv}
                                        onChange={(e) => setHrv(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Goal</label>
                                <select
                                    value={goal}
                                    onChange={(e) => setGoal(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none transition-colors appearance-none"
                                >
                                    <option value="Relaxation">Deep Relaxation & Stress Relief</option>
                                    <option value="Energy">Energy & Wakefulness</option>
                                    <option value="Focus">Mental Clarity & Focus</option>
                                    <option value="Sleep">Sleep Onset</option>
                                    <option value="Balance">Nervous System Balance</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-2">
                                    <Key className="w-3 h-3 text-yellow-500" /> Gemini API Key
                                </label>

                                {geminiApiKey && !error?.includes("API Key") ? (
                                    <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                                        <div className="flex items-center gap-2 text-white/60">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                            <span className="font-mono text-sm">••••••••••••••••</span>
                                        </div>
                                        <button
                                            onClick={() => setGeminiApiKey('')} // Clear to edit
                                            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider transition-colors"
                                        >
                                            Change
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <input
                                            type="password"
                                            value={geminiApiKey || ''}
                                            onChange={(e) => {
                                                setGeminiApiKey(e.target.value);
                                                if (error) setError(null);
                                            }}
                                            placeholder="Enter your Gemini API Key"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none transition-colors placeholder:text-white/20"
                                        />
                                        <p className="text-[10px] text-white/30">
                                            Key is stored securely on your device/account.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            {/* Action */}
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-bold text-white tracking-wide hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing Biometrics...
                                    </>
                                ) : (
                                    <>
                                        <Bot className="w-5 h-5" />
                                        Generate AI Plan
                                    </>
                                )}
                            </button>
                        </>
                    ) : (
                        // Result View
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-light text-white">{generatedTech.name}</h3>
                                <p className="text-sm text-white/60 leading-relaxed">{generatedTech.description}</p>
                            </div>

                            {/* Pattern Preview */}
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-center gap-2">
                                {generatedTech.steps.map((s, i) => (
                                    <div key={i} className="flex-1 text-center p-2 bg-white/5 rounded-lg">
                                        <div className="text-[10px] text-white/40 uppercase mb-1">{s.action}</div>
                                        <div className="text-lg font-mono font-bold text-white">{s.duration}s</div>
                                    </div>
                                ))}
                            </div>

                            {/* Benefits */}
                            <div className="flex flex-wrap gap-2 justify-center">
                                {generatedTech.benefits?.map((b) => (
                                    <span key={b} className="px-2 py-1 rounded bg-indigo-500/10 text-indigo-300 text-xs border border-indigo-500/20">
                                        {b}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={() => onStartTechnique(generatedTech)}
                                className="w-full py-4 rounded-xl bg-white text-black font-bold tracking-widest uppercase hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                            >
                                <Play className="w-5 h-5" />
                                Start Session
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
