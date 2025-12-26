import { motion } from 'framer-motion';
import { THEMES, GRADIENTS } from '../../constants/themes';

interface AuroraBackgroundProps {
    theme?: keyof typeof THEMES;
    // intensity unused, removed
}

export const AuroraBackground = ({ theme = 'default' }: AuroraBackgroundProps) => {
    const baseColor = THEMES[theme] || THEMES.default;
    const [color1, color2] = GRADIENTS[theme] || GRADIENTS.default;

    return (
        <div className={`fixed inset-0 z-0 overflow-hidden pointer-events-none ${baseColor} transition-colors duration-1000`}>

            {/* Primary Blob */}
            <motion.div
                animate={{
                    x: [0, 100, -100, 0],
                    y: [0, -50, 50, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] rounded-full mix-blend-screen opacity-40 blur-[100px]"
                style={{ backgroundColor: color1 }}
            />

            {/* Secondary Blob */}
            <motion.div
                animate={{
                    x: [0, -70, 70, 0],
                    y: [0, 60, -60, 0],
                    scale: [1.2, 1, 1.2],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-[-20%] right-[-20%] w-[70vw] h-[70vw] rounded-full mix-blend-screen opacity-30 blur-[120px]"
                style={{ backgroundColor: color2 }}
            />

            {/* Static Ambient Fill */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />

            {/* Texture */}
            <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>
    );
};
