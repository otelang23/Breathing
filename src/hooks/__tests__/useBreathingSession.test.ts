import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useBreathingSession } from '../useBreathingSession';
import { TECHNIQUES } from '../../data/techniques';

// Mock AudioEngine
vi.mock('../../services/AudioEngine', () => ({
    AudioEngine: {
        init: vi.fn(),
        setVolume: vi.fn(),
        playStepSound: vi.fn(),
        startDrone: vi.fn(),
        stopDrone: vi.fn(),
    },
}));

describe('useBreathingSession', () => {
    it('initializes with correct default state', () => {
        const { result } = renderHook(() =>
            useBreathingSession({
                initialTech: TECHNIQUES[0],
                soundMode: 'minimal',
                hapticEnabled: false,
            })
        );

        expect(result.current.isActive).toBe(false);
        expect(result.current.selectedTech.id).toBe(TECHNIQUES[0].id);
        expect(result.current.totalSeconds).toBe(0);
    });

    it('toggles session active state', () => {
        const { result } = renderHook(() =>
            useBreathingSession({
                initialTech: TECHNIQUES[0],
                soundMode: 'minimal',
                hapticEnabled: false,
            })
        );

        act(() => {
            result.current.toggleSession();
        });

        expect(result.current.isActive).toBe(true);

        act(() => {
            result.current.toggleSession();
        });

        expect(result.current.isActive).toBe(false);
    });
});
