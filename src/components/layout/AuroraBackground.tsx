import { motion } from 'framer-motion';
import { useSettings } from '../../hooks/useSettings';

import { GRADIENTS } from '../../constants/themes';

interface AuroraBackgroundProps {
    theme?: string;
}

export const AuroraBackground = ({ theme: propTheme }: AuroraBackgroundProps) => {
    const { theme: userTheme } = useSettings();

    // Use prop if provided (active session), otherwise user setting
    const currentTheme = propTheme || userTheme || 'midnight';

    // Fallback to midnight if theme key invalid (safeguard)
    const [primaryColor, secondaryColor] = GRADIENTS[currentTheme] || GRADIENTS.midnight;

    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-[hsl(var(--background))] transition-colors duration-1000">
            {/* Noise Grain Overlay - adds texture to prevent banding */}
            <div className="absolute inset-0 opacity-20 bg-noise mix-blend-overlay z-10" />

            {/* Ambient Glows - purely decorative, high blur */}
            <div className="absolute inset-0 opacity-60">
                {/* Blob 1: Primary - Moves slowly */}
                <motion.div
                    animate={{
                        x: ["-20%", "20%", "-20%"],
                        y: ["-20%", "20%", "-20%"],
                        opacity: [0.4, 0.7, 0.4],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] rounded-full blur-[100px] mix-blend-screen"
                    // We use inline styles for the gradient colors to allowing dynamic theme switching
                    style={{ background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` }}
                />

                {/* Blob 2: Secondary/Surface - Counter movement */}
                <motion.div
                    animate={{
                        x: ["20%", "-20%", "20%"],
                        y: ["30%", "10%", "30%"],
                        opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute top-[20%] right-[-20%] w-[90vw] h-[90vw] rounded-full blur-[120px] mix-blend-screen"
                    style={{ background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)` }}
                />

                {/* Blob 3: Bottom Fill - Anchors the darkness */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-[-40%] left-[10%] w-[100vw] h-[80vw] rounded-full blur-[100px] mix-blend-screen"
                    style={{ background: `radial-gradient(circle, ${primaryColor} 0%, transparent 70%)` }}
                />
            </div>

            {/* Vignette to focus attention center */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.1)_100%)] z-0" />
        </div>
    );
};
