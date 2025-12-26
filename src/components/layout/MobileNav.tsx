import { Wind, Compass, BarChart2 } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';

type TabId = 'breathe' | 'discover' | 'journey';

interface MobileNavProps {
    activeTab: TabId;
    onChange: (tab: TabId) => void;
}

export const MobileNav = ({ activeTab, onChange }: MobileNavProps) => {
    const { theme } = useSettings();

    const getGlowColor = () => {
        switch (theme) {
            case 'midnight': return 'bg-indigo-500';
            case 'ocean': return 'bg-cyan-500';
            case 'forest': return 'bg-emerald-500';
            case 'sunset': return 'bg-orange-500';
            default: return 'bg-primary';
        }
    };

    const navItems = [
        { id: 'breathe' as TabId, icon: Wind, label: 'Breathe' },
        { id: 'discover' as TabId, icon: Compass, label: 'Discover' },
        { id: 'journey' as TabId, icon: BarChart2, label: 'Journey' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe-area">
            {/* Glassmorphic Background */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-xl border-t border-white/10" />

            <div className="relative flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = activeTab === item.id;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onChange(item.id)}
                            className={`relative flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 ${isActive ? 'text-white' : 'text-white/40 hover:text-white/70'
                                }`}
                        >
                            {/* Active Indicator Glow */}
                            <div
                                className={`absolute top-0 w-12 h-1 rounded-b-full transition-all duration-300 ${isActive ? `${getGlowColor()} shadow-[0_0_10px_2px_currentColor] opacity-100` : 'opacity-0'
                                    }`}
                            />

                            <div className={`p-1 rounded-xl transition-all duration-300 ${isActive ? 'scale-110 mb-1' : ''}`}>
                                <Icon className={`w-6 h-6 ${isActive ? 'drop-shadow-lg' : ''}`} />
                            </div>
                            <span className={`text-[10px] font-medium tracking-wide transition-all ${isActive ? 'opacity-100' : 'opacity-0 scale-90 hidden'}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};
