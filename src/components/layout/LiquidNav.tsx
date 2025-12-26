import { motion } from 'framer-motion';
import { Wind, Compass, BarChart2 } from 'lucide-react';
import { cn } from '../../lib/utils'; // Assuming you created this utils file

interface LiquidNavProps {
    activeTab: 'breathe' | 'discover' | 'journey';
    onChange: (tab: 'breathe' | 'discover' | 'journey') => void;
}

const TABS = [
    { id: 'breathe', icon: Wind, label: 'Breathe' },
    { id: 'discover', icon: Compass, label: 'Discover' },
    { id: 'journey', icon: BarChart2, label: 'Journey' },
] as const;

export const LiquidNav = ({ activeTab, onChange }: LiquidNavProps) => {
    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4">
            <motion.div
                layout
                className="flex items-center gap-2 p-2 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full shadow-2xl"
            >
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                if (navigator.vibrate) navigator.vibrate(5);
                                onChange(tab.id);
                            }}
                            className={cn(
                                "relative flex items-center justify-center w-12 h-12 rounded-full transition-colors z-10",
                                isActive ? "text-slate-900" : "text-white/60 hover:text-white"
                            )}
                        >
                            {/* Active Indicator Blob */}
                            {isActive && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-white rounded-full -z-10"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <Icon className="w-5 h-5 relative z-10" strokeWidth={isActive ? 2.5 : 2} />
                        </button>
                    );
                })}
            </motion.div>
        </div>
    );
};
