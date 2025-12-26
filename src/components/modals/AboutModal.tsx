import { motion } from 'framer-motion';
import { X, Activity, Brain, Moon, Wind } from 'lucide-react';

interface AboutModalProps {
    onClose: () => void;
}

export const AboutModal = ({ onClose }: AboutModalProps) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-[#0f172a] border border-white/10 w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-3xl p-8 shadow-2xl"
            >
                <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                </button>

                <div className="space-y-8">
                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                            <Wind className="w-6 h-6 text-indigo-300" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-light text-white tracking-tight">The Science of Breath</h2>
                            <p className="text-white/50">Physiological Adaptation Score (PAS)</p>
                        </div>
                    </div>

                    {/* PAS Explanation */}
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-2">What is PAS?</h3>
                        <p className="text-white/60 leading-relaxed text-sm">
                            The **Physiological Adaptation Score (PAS)** rates techniques (0-10) based on their speed and efficacy in shifting your autonomic nervous system state.
                        </p>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                <div className="text-green-400 font-bold mb-1">PAS 9.0+</div>
                                <div className="text-xs text-white/50">Instant state shift (e.g. Panic to Calm) within 60s.</div>
                            </div>
                            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <div className="text-blue-400 font-bold mb-1">PAS 8.0+</div>
                                <div className="text-xs text-white/50">Deep systemic relaxation over 5-10 mins.</div>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CategoryCard
                            icon={Activity} color="text-red-400" bg="bg-red-400/10"
                            title="Stress Relief" desc="Fast exhale-focused techniques to lower heart rate."
                        />
                        <CategoryCard
                            icon={Brain} color="text-teal-400" bg="bg-teal-400/10"
                            title="Focus & Clarity" desc="Rhythmic patterns (Box Breathing) to align brainwaves."
                        />
                        <CategoryCard
                            icon={Moon} color="text-indigo-400" bg="bg-indigo-400/10"
                            title="Sleep & Rest" desc="GABA-stimulating holds to trigger sleep onset."
                        />
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

interface CategoryCardProps {
    icon: React.ElementType;
    color: string;
    bg: string;
    title: string;
    desc: string;
}

const CategoryCard = ({ icon: Icon, color, bg, title, desc }: CategoryCardProps) => (
    <div className={`p-4 rounded-xl border border-white/5 ${bg}`}>
        <Icon className={`w-6 h-6 ${color} mb-3`} />
        <h4 className="text-white font-medium mb-1">{title}</h4>
        <p className="text-xs text-white/50 leading-relaxed">{desc}</p>
    </div>
);
