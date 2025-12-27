import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Volume2, VolumeX, Sparkles, Zap, Leaf } from 'lucide-react';
import { cn } from '../../lib/utils';
import { GenerativeAudio } from '../../services/GenerativeAudio';

interface SoundMenuProps {
    engine: GenerativeAudio | null;
    isEnabled: boolean;
    onToggle: () => void;
}

export const SoundMenu = ({ engine, isEnabled, onToggle }: SoundMenuProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [mode, setMode] = useState<'cosmic' | 'nature' | 'focus'>('cosmic');
    const menuRef = useRef<HTMLDivElement>(null);

    // Handle outside click to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);



    const handleModeChange = (newMode: 'cosmic' | 'nature' | 'focus') => {
        setMode(newMode);
        engine?.setMode(newMode);
    };

    return (
        <div className="relative" ref={menuRef}>
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border transition-colors z-30 relative",
                    isEnabled ? "bg-indigo-500/20 border-indigo-500 text-indigo-200" : "bg-white/5 border-white/10 text-white/40"
                )}
                title="Soundscapes"
            >
                <Music className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-12 left-0 w-64 glass-panel rounded-2xl p-4 z-50 origin-top-left flex flex-col gap-4"
                    >
                        {/* Header & Toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-white font-medium text-sm">Soundscape</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-white/40">{isEnabled ? 'ON' : 'OFF'}</span>
                                <button
                                    onClick={onToggle}
                                    className={cn(
                                        "w-10 h-6 rounded-full relative transition-colors",
                                        isEnabled ? "bg-indigo-500" : "bg-white/10"
                                    )}
                                >
                                    <div className={cn(
                                        "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all",
                                        isEnabled ? "left-5" : "left-1"
                                    )} />
                                </button>
                            </div>
                        </div>

                        {/* Modes */}
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'cosmic', icon: Sparkles, label: 'Cosmic' },
                                { id: 'nature', icon: Leaf, label: 'Nature' },
                                { id: 'focus', icon: Zap, label: 'Focus' }
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => handleModeChange(m.id as any)}
                                    disabled={!isEnabled}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 p-2 rounded-lg border transition-all text-xs",
                                        mode === m.id && isEnabled
                                            ? "bg-indigo-500/20 border-indigo-500 text-indigo-200"
                                            : "bg-white/5 border-transparent text-white/40 hover:bg-white/10"
                                    )}
                                >
                                    <m.icon className="w-4 h-4" />
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {/* Volume */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-white/60">
                                <VolumeX className="w-3 h-3" />
                                <span>{Math.round(volume * 100)}%</span>
                                <Volume2 className="w-3 h-3" />
                            </div>
                            {/* Custom Slider */}
                            <div
                                className="relative w-full h-4 flex items-center cursor-pointer touch-none group"
                                onPointerDown={(e) => {
                                    const rect = e.currentTarget.getBoundingClientRect();
                                    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                                    setVolume(x);
                                    engine?.setVolume(x);
                                    e.currentTarget.setPointerCapture(e.pointerId);
                                }}
                                onPointerMove={(e) => {
                                    if (e.buttons === 1) { // dragging
                                        const rect = e.currentTarget.getBoundingClientRect();
                                        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                                        setVolume(x);
                                        engine?.setVolume(x);
                                    }
                                }}
                            >
                                {/* Track Background */}
                                <div className="absolute inset-0 h-1.5 my-auto bg-white/10 rounded-full" />

                                {/* Fill Progress */}
                                <div
                                    className="absolute left-0 h-1.5 my-auto bg-white rounded-full transition-all duration-75"
                                    style={{ width: `${volume * 100}%` }}
                                />

                                {/* Thumb */}
                                <div
                                    className="absolute h-3 w-3 bg-white rounded-full shadow-md transform -translate-x-1/2 transition-transform duration-75 group-hover:scale-125"
                                    style={{ left: `${volume * 100}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
