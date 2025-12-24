import { Zap, Heart, Moon, Box } from 'lucide-react';

export const PRESETS = [
    {
        id: 'panic',
        label: 'Panic 60s',
        description: 'Rapid downshift from acute stress.',
        icon: Zap,
        segments: [
            { techId: 'sigh', durationSec: 40 },
            { techId: 'long_exhale', durationSec: 20 },
        ],
    },
    {
        id: 'hrv10',
        label: 'HRV 10m',
        description: 'Coherent + Diaphragm for HRV rebuild.',
        icon: Heart,
        segments: [
            { techId: 'coherent', durationSec: 480 },
            { techId: 'diaphragm', durationSec: 120 },
        ],
    },
    {
        id: 'sleep7',
        label: 'Sleep 7m',
        description: 'Downshift into deep sleep.',
        icon: Moon,
        segments: [
            { techId: 'diaphragm', durationSec: 240 },
            { techId: 'sleep_478', durationSec: 180 },
        ],
    },
    {
        id: 'interview3',
        label: 'Interview 3m',
        description: 'Calm focus + HR drop.',
        icon: Box,
        segments: [
            { techId: 'box', durationSec: 120 },
            { techId: 'long_exhale', durationSec: 60 },
        ],
    },
];
