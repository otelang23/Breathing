import { useState } from 'react';
import { X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { Technique } from '../../types';

interface RoutineCreatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (technique: Technique) => void;
}

export const RoutineCreatorModal = ({ isOpen, onClose, onSave }: RoutineCreatorModalProps) => {
    const [name, setName] = useState('');
    const [tagline, setTagline] = useState('');
    const [inhale, setInhale] = useState(4);
    const [hold1, setHold1] = useState(0);
    const [exhale, setExhale] = useState(4);
    const [hold2, setHold2] = useState(0);

    const totalDuration = inhale + hold1 + exhale + hold2;

    const handleSave = () => {
        if (!name) return;

        const newTechnique: Technique = {
            id: `custom-${Date.now()}`,
            name,
            tagline: tagline || 'Custom Routine',
            description: `Custom ${inhale}-${hold1}-${exhale}-${hold2} pattern.`,
            tip: 'Focus on smooth transitions.',
            strength: 'Customized for you',
            pas: 5, // Neutral default
            color: 'from-fuchsia-500 via-pink-500 to-rose-500',
            steps: [
                { action: 'Inhale', duration: inhale * 1000, scale: 1.5, text: 'Inhale', vibration: [40] },
                ...(hold1 > 0 ? [{ action: 'Hold', duration: hold1 * 1000, scale: 1.5, text: 'Hold', vibration: [20] }] : []),
                { action: 'Exhale', duration: exhale * 1000, scale: 1.0, text: 'Exhale', vibration: [40] },
                ...(hold2 > 0 ? [{ action: 'Hold', duration: hold2 * 1000, scale: 1.0, text: 'Hold', vibration: [20] }] : []),
            ],
            audioProfile: { baseFreq: 110, binauralBeat: 10 }, // Alpha default
            ranks: { pas: 5, stress: 5, speed: 5, hrv: 5, sleep: 5, deepSleep: 5, discreet: 5 },
            meta: { Custom: 'Yes' },
            isCustom: true,
            categories: ['custom']
        };

        onSave(newTechnique);
        onClose();
        // Reset form?
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-sm bg-slate-900 rounded-3xl border border-white/10 overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-4 flex items-center justify-between border-b border-white/10">
                        <h2 className="text-lg font-semibold text-white">Create Routine</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-6">

                        {/* Name Inputs */}
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest pl-1">Name</label>
                                <input
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Morning Calm"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-white/40 uppercase tracking-widest pl-1">Tagline</label>
                                <input
                                    value={tagline}
                                    onChange={e => setTagline(e.target.value)}
                                    placeholder="Short description"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                />
                            </div>
                        </div>

                        {/* Sliders */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-cyan-400">Inhale</span>
                                    <span className="text-white font-mono">{inhale}s</span>
                                </div>
                                <input
                                    type="range" min="1" max="10" step="0.5"
                                    aria-label="Inhale duration"
                                    value={inhale} onChange={e => setInhale(Number.parseFloat(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-cyan-400 cursor-pointer"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Hold</span>
                                    <span className="text-white font-mono">{hold1}s</span>
                                </div>
                                <input
                                    type="range" min="0" max="10" step="0.5"
                                    aria-label="Hold after inhale duration"
                                    value={hold1} onChange={e => setHold1(Number.parseFloat(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-white cursor-pointer"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-blue-400">Exhale</span>
                                    <span className="text-white font-mono">{exhale}s</span>
                                </div>
                                <input
                                    type="range" min="1" max="15" step="0.5"
                                    aria-label="Exhale duration"
                                    value={exhale} onChange={e => setExhale(Number.parseFloat(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-blue-400 cursor-pointer"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-white/60">Hold</span>
                                    <span className="text-white font-mono">{hold2}s</span>
                                </div>
                                <input
                                    type="range" min="0" max="10" step="0.5"
                                    aria-label="Hold after exhale duration"
                                    value={hold2} onChange={e => setHold2(Number.parseFloat(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none accent-white cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Preview Stats */}
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                            <div className="text-xs text-white/40 uppercase tracking-widest">Cycle Duration</div>
                            <div className="text-xl font-mono text-white">{totalDuration}s</div>
                        </div>

                        {/* Actions */}
                        <button
                            onClick={handleSave}
                            disabled={!name}
                            className={cn(
                                "w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                                name ? "bg-emerald-500 hover:bg-emerald-400 text-white" : "bg-white/10 text-white/20 cursor-not-allowed"
                            )}
                        >
                            <Save className="w-5 h-5" />
                            <span>Save Routine</span>
                        </button>

                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
