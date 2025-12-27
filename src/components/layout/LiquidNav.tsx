import { motion } from 'framer-motion';
import { Wind, Compass, BarChart2 } from 'lucide-react';

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
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <nav className="glass-panel rounded-full p-1.5 flex items-center gap-1 shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                if (navigator.vibrate) navigator.vibrate(5);
                                onChange(tab.id as any);
                            }}
                            className={`
                                relative px-6 py-3 rounded-full text-sm font-medium transition-all duration-500
                                ${isActive ? 'text-black' : 'text-white/60 hover:text-white'}
                            `}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white rounded-full shadow-[0_0_20px_hsla(var(--primary)/0.4)]"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 flex flex-col items-center gap-0.5">
                                <tab.icon className={`w-5 h-5 ${isActive ? 'scale-110' : 'scale-100'} transition-transform`} strokeWidth={2.5} />
                                <span className={`text-[9px] font-bold tracking-wide uppercase ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>{tab.label}</span>
                            </span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};
