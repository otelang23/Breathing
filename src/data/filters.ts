import { Activity, Heart, Moon, Shield, Clock, Brain, User } from 'lucide-react';

export const FILTERS = [
    { id: 'pas', label: 'PAS Score', icon: Activity },
    { id: 'hrv', label: 'HRV', icon: Heart },
    { id: 'sleep', label: 'Sleep', icon: Moon },
    { id: 'stress', label: 'Acute Stress', icon: Shield },
    { id: 'speed', label: 'Speed', icon: Clock },
    { id: 'deepSleep', label: 'Deep/REM', icon: Brain },
    { id: 'discreet', label: 'Discreet', icon: User },
];
