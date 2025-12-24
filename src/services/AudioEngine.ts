export const AudioEngine = {
    ctx: null as AudioContext | null,
    droneOsc: null as OscillatorNode | null,
    droneGain: null as GainNode | null,
    masterVolume: 0.5,

    init() {
        if (typeof window === 'undefined') return;
        if (!this.ctx) {
            const Win = window as unknown as { AudioContext: typeof AudioContext; webkitAudioContext: typeof AudioContext };
            const Ctx = Win.AudioContext || Win.webkitAudioContext;
            if (!Ctx) return;
            this.ctx = new Ctx();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    setVolume(val: number) {
        this.masterVolume = val;
        if (this.droneGain && this.ctx) {
            const now = this.ctx.currentTime;
            this.droneGain.gain.setTargetAtTime(0.02 * val, now, 0.1);
        }
    },

    playStepSound({
        techId,
        action,
        durationMs,
        soundMode,
    }: {
        techId: string;
        action: string;
        durationMs: number;
        soundMode: 'silent' | 'minimal' | 'rich';
    }) {
        if (!this.ctx || soundMode === 'silent' || this.masterVolume <= 0) return;
        const ctx = this.ctx;

        // Special Voo chant remains
        if (techId === 'voo' && action === 'Exhale' && soundMode === 'rich') {
            const osc1 = ctx.createOscillator();
            const osc2 = ctx.createOscillator();
            const gainNode = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc1.type = 'sawtooth';
            osc2.type = 'sawtooth';

            const vooPitch = 98;
            osc1.frequency.value = vooPitch;
            osc2.frequency.value = vooPitch * 1.01;

            filter.type = 'lowpass';
            filter.frequency.value = 350;
            filter.Q.value = 1.5;

            osc1.connect(filter);
            osc2.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(ctx.destination);

            const peakGain = 0.18 * this.masterVolume;
            const now = ctx.currentTime;
            const chantDuration = Math.min(durationMs / 1000 + 1, 10);

            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(peakGain, now + 2.0);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + chantDuration);

            osc1.start(now);
            osc2.start(now);
            osc1.stop(now + chantDuration);
            osc2.stop(now + chantDuration);
            return;
        }

        // Technique-specific basic palette
        const baseTypeByTech: Record<string, OscillatorType> = {
            coherent: 'sine',
            diaphragm: 'sine',
            box: 'triangle',
            sleep_478: 'sine',
            sigh: 'sine',
            bhramari: 'sine',
            long_exhale: 'sine',
        };

        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        let baseFreq = 440;
        let gain = 0.06;

        // Map action -> musical contour
        if (action === 'Inhale' || action === 'Inhale2') {
            baseFreq = 330; // E4
        } else if (action === 'Hold') {
            baseFreq = 440; // A4
            gain = 0.03;
        } else if (action === 'Exhale') {
            baseFreq = 220; // A3
        }

        // Slight shifts per technique
        if (techId === 'coherent') baseFreq *= 0.7; // calmer
        if (techId === 'sleep_478') baseFreq *= 0.6;
        if (techId === 'box') baseFreq *= 1.1;

        const waveType = baseTypeByTech[techId] || 'sine';
        osc.type = waveType;

        const now = ctx.currentTime;
        const durSec = Math.min(durationMs / 1000, 10);
        const peakGain = gain * this.masterVolume;

        if (soundMode === 'minimal') {
            // Short notification beep
            osc.frequency.setValueAtTime(baseFreq, now);
            gainNode.gain.setValueAtTime(0, now);
            gainNode.gain.linearRampToValueAtTime(peakGain, now + 0.08);
            gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.5);
            return;
        }

        // Rich mode: gentle glide across step
        const startFreq = baseFreq * (action === 'Inhale' || action === 'Inhale2' ? 0.9 : 1.0);
        const endFreq = baseFreq * (action === 'Exhale' ? 0.6 : 1.05);

        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.linearRampToValueAtTime(endFreq, now + durSec);

        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(peakGain, now + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + durSec);

        osc.start(now);
        osc.stop(now + durSec + 0.2);
    },

    startDrone(soundMode: 'silent' | 'minimal' | 'rich') {
        if (!this.ctx || this.droneOsc || soundMode !== 'rich' || this.masterVolume <= 0) return;
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 55; // low A1

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        const targetGain = 0.02 * this.masterVolume;
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 2);

        osc.start();
        this.droneOsc = osc;
        this.droneGain = gainNode;
    },

    stopDrone() {
        if (!this.droneOsc || !this.droneGain || !this.ctx) return;
        const now = this.ctx.currentTime;
        this.droneGain.gain.cancelScheduledValues(now);
        this.droneGain.gain.linearRampToValueAtTime(0, now + 1);
        this.droneOsc.stop(now + 1);
        this.droneOsc = null;
        this.droneGain = null;
    },
};
