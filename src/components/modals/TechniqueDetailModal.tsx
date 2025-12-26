import { motion } from 'framer-motion';
import { X, BookOpen, Clock, Activity, ArrowRight } from 'lucide-react';

import type { Technique } from '../../types';

interface TechniqueDetailModalProps {
    technique: Technique;
    onClose: () => void;
    onStart: () => void;
    onDelete?: (id: string) => void;
}

export const TechniqueDetailModal = ({ technique, onClose, onStart, onDelete }: TechniqueDetailModalProps) => {
    if (!technique) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
                {/* Header with Gradient */}
                <div className={`relative h-32 bg-gradient-to-r ${technique.color} flex items-end p-6`}>
                    <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="text-white/80 font-mono text-xs uppercase tracking-widest mb-1">{technique.tagline}</div>
                        <h2 className="text-3xl font-bold text-white">{technique.name}</h2>
                    </div>
                </div>

                <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">

                    {/* Science Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-wider text-xs">
                            <BookOpen className="w-4 h-4" />
                            <span>The Science</span>
                        </div>
                        <p className="text-lg text-white/80 leading-relaxed font-light">
                            {technique.science?.mechanism || technique.description}
                        </p>
                        <div className="flex flex-wrap gap-2 pt-2">
                            {technique.science?.benefits?.map((b: string, i: number) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-white/60">
                                    {b}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Optimal Dosage */}
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-xs">
                                <Clock className="w-4 h-4" />
                                <span>Optimal Dosage</span>
                            </div>
                            <div className="text-xl font-medium text-white">
                                {technique.optimalDuration || '5-10 mins'}
                            </div>
                            <div className="text-xs text-white/40"> Recommended for max effect</div>
                        </div>

                        {/* Transition / Next Step */}
                        {technique.transition && (
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
                                    <Activity className="w-4 h-4" />
                                    <span>Next Step</span>
                                </div>
                                <div className="text-sm text-white/80">
                                    Switch to <span className="text-white font-bold">{technique.transition.condition}</span>
                                </div>
                                <div className="text-xs text-white/40">
                                    Transition to: <strong>{technique.transition.nextTechId.toUpperCase()}</strong>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 flex justify-end gap-4 bg-white/5">
                    {technique.isCustom && (
                        <button
                            onClick={() => {
                                if (confirm('Delete this routine?')) {
                                    onDelete?.(technique.id);
                                    onClose();
                                }
                            }}
                            className="px-4 py-3 rounded-xl text-red-400/50 hover:text-red-400 transition-colors text-sm font-medium mr-auto"
                        >
                            Delete
                        </button>
                    )}
                    <button onClick={onClose} className="px-6 py-3 rounded-xl text-white/50 hover:text-white transition-colors text-sm font-medium">
                        Close
                    </button>
                    <button
                        onClick={() => { onStart(); onClose(); }}
                        className="px-8 py-3 rounded-xl bg-white text-black font-bold hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <span>Start Session</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

            </motion.div>
        </div>
    );
};
