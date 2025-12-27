import { motion } from 'framer-motion';
import { ProgressRing } from './ProgressRing';

interface OrbProps {
    isActive: boolean;
    phase: string;
    progress: number; // 0-100
    color: string;
    segments?: number[];
    currentStepIndex?: number;
    gradientColors?: readonly string[];
}

export const Orb2 = ({ isActive, phase, progress, color, segments, currentStepIndex, gradientColors }: OrbProps) => {

    const backgroundStyle = gradientColors
        ? { background: `linear-gradient(135deg, ${gradientColors[0]}, ${gradientColors[1]})` }
        : undefined;

    const bgClass = gradientColors ? '' : `bg-gradient-to-br ${color}`;

    return (
        <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
            {/* Restored Circular Progress - The "Beam" */}
            {isActive && <ProgressRing
                radius={160}
                stroke={3} // Thicker stroke
                progress={progress}
                segments={segments}
                activeSegmentIndex={currentStepIndex}
            />}

            {/* Outer Glow - Dynamic Color Support */}
            <motion.div
                animate={{
                    scale: isActive && (phase === 'Inhale' || phase === 'Hold' || phase === 'Hold2') ? [1, 1.4] : [1.4, 1],
                    opacity: [0.2, 0.5],
                }}
                transition={{
                    duration: 4,
                    ease: "easeInOut"
                }}
                className={`absolute inset-0 rounded-full blur-[80px] mix-blend-screen ${bgClass}`}
                style={backgroundStyle}
            />

            {/* Core Mesh - The Physical Orb */}
            <motion.div
                animate={{
                    scale: isActive && (phase === 'Inhale' || phase === 'Hold' || phase === 'Hold2') ? 1.3 : 1,
                    boxShadow: isActive
                        ? `0 0 60px 10px rgba(255,255,255,0.3), inset 0 0 40px rgba(255,255,255,0.8)`
                        : `0 0 30px 5px rgba(255,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.5)`
                }}
                transition={{
                    duration: 4,
                    ease: "easeInOut"
                }}
                className={`relative w-32 h-32 rounded-full z-10 flex items-center justify-center overflow-hidden ${bgClass}`}
                style={backgroundStyle}
            >
                {/* Internal "Liquid" Shine */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent pointer-events-none" />
            </motion.div>

            {/* Text Overlay */}
            <div className="absolute z-20 text-white font-bold tracking-widest text-xl drop-shadow-lg mix-blend-overlay">
                {phase}
            </div>
        </div>
    );
};
