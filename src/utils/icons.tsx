
import { Activity, Wind, Heart, Moon, Zap, Mic, Box } from 'lucide-react';

export const getTechniqueIcon = (id: string) => {
    switch (id) {
        case 'sigh':
            return <Wind className="w-5 h-5" />;
        case 'coherent':
            return <Heart className="w-5 h-5" />;
        case 'box':
            return <Box className="w-5 h-5" />;
        case 'sleep_478':
            return <Moon className="w-5 h-5" />;
        case 'bhramari':
            return <Zap className="w-5 h-5" />;
        case 'voo':
            return <Mic className="w-5 h-5" />;
        default:
            return <Activity className="w-5 h-5" />;
    }
};
