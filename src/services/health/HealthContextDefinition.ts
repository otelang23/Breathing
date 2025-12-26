import { createContext } from 'react';
import type { HealthContextType } from './types';

export const HealthContext = createContext<HealthContextType | null>(null);
