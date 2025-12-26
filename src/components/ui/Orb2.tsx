import { motion } from 'framer-motion';
import { ProgressRing } from './ProgressRing';

interface OrbProps {
    isActive: boolean;
    phase: string;
    progress: number; // 0-100
    color: string;
    segments?: number[];
    currentStepIndex?: number;
}

export const Orb2 = ({ isActive, phase, progress, color, segments, currentStepIndex }: OrbProps) => {

    return (
        <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
            {/* Restored Circular Progress - The "Beam" */}
            {isActive && <ProgressRing
                radius={160}
                stroke={2}
                progress={progress}
                segments={segments}
                activeSegmentIndex={currentStepIndex}
            />}

            {/* Outer Glow - Dynamic Color Support */}
            <motion.div
                animate={{
                    scale: isActive && (phase === 'Inhale' || phase === 'Hold' || phase === 'Hold2') ? [1, 1.5] : [1.5, 1],
                    opacity: [0.3, 0.6],
                    backgroundColor: color || '#fff'
                }}
                transition={{
                    duration: 4, // Needs to sync with actual duration prop
                    ease: "easeInOut"
                }}
                className={`absolute inset-0 rounded-full blur-3xl opacity-40`}
            />

            {/* Core Mesh */}
            <motion.div
                animate={{
                    scale: isActive && (phase === 'Inhale' || phase === 'Hold' || phase === 'Hold2') ? 1.5 : 1,
                }}
                transition={{
                    duration: 4,
                    ease: "easeInOut"
                }}
                className="w-32 h-32 bg-white rounded-full shadow-[0_0_100px_rgba(255,255,255,0.5)] z-10"
            />

            {/* Text Overlay */}
            <div className="absolute z-20 text-slate-900 font-bold mix-blend-screen text-xl">
                {phase}
            </div>
        </div>
    );
};
