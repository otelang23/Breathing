import { motion } from 'framer-motion';
import { Wind, Compass, BarChart2, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SidebarNavProps {
    activeTab: 'breathe' | 'discover' | 'journey';
    onChange: (tab: 'breathe' | 'discover' | 'journey') => void;
    onToggleSettings?: () => void;
    onLogoClick?: () => void;
}

const TABS = [
    { id: 'breathe', icon: Wind, label: 'Breathe' },
    { id: 'discover', icon: Compass, label: 'Discover' },
    { id: 'journey', icon: BarChart2, label: 'Journey' },
] as const;

export const SidebarNav = ({ activeTab, onChange, onToggleSettings, onLogoClick }: SidebarNavProps) => {
    return (
        <aside className="fixed left-0 top-0 h-full w-24 flex flex-col items-center py-8 z-50 border-r border-white/10 bg-black/20 backdrop-blur-xl">
            {/* Logo / Brand */}
            <div className="mb-12">
                <button
                    onClick={onLogoClick}
                    className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 hover:bg-white/20 transition-colors"
                    aria-label="About & Guide"
                >
                    <Wind className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Nav Items */}
            <div className="flex-1 flex flex-col gap-6 w-full px-4">
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
                                "relative group flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300",
                                isActive ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className={cn("w-6 h-6 mb-1 transition-transform group-hover:scale-110", isActive && "scale-105")} strokeWidth={isActive ? 2.5 : 2} />
                            <span className="text-[10px] font-medium tracking-wide opacity-80">{tab.label}</span>

                            {/* Active Indicator (Left Border) */}
                            {isActive && (
                                <motion.div
                                    layoutId="desktop-active"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-4 w-full px-4">
                <button
                    onClick={onToggleSettings}
                    aria-label="Settings"
                    className="flex flex-col items-center justify-center p-3 rounded-2xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
                >
                    <Settings className="w-6 h-6" />
                </button>
            </div>
        </aside>
    );
};
