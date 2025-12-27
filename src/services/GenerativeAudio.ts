/**
 * GenerativeAudio.ts
 * 
 * Next-Generation Bio-Adaptive Audio Engine.
 * Purely procedural audio synthesis using Web Audio API.
 * 
 * Layers:
 * 1. DRONE: Foundation stability (Sine/Triangle oscillators).
 * 2. ATMOSPHERE: Textured noise (Pink/Brown) modulated by breath.
 * 3. BINAURAL: Precise L/R frequency offset for brainwave entrainment.
 * 4. TEXTURE: Stochastic high-frequency events for "sparkle".
 */

export interface BreathingState {
    phase: 'Inhale' | 'Hold' | 'Exhale' | 'Idle';
    progress: number; // 0-1
    techProfile?: { baseFreq: number; binauralBeat: number };
}

export type BinauralTarget = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' | 'custom';

export class GenerativeAudio {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private limiter: DynamicsCompressorNode | null = null;

    // Layer Nodes
    private droneNodes: { osc: OscillatorNode; pan: StereoPannerNode; gain: GainNode }[] = [];
    private atmosphere: { source: AudioBufferSourceNode | null; filter: BiquadFilterNode; gain: GainNode; pan: StereoPannerNode } | null = null;
    private binaural: { left: OscillatorNode; right: OscillatorNode; gain: GainNode } | null = null;
    private textureNodes: (() => void)[] = []; // Cleanup functions for texture loops

    // State
    private isRunning = false;
    private currentProfile: { baseFreq: number; binauralBeat: number } | null = null;
    private baseFreq = 110; // A2
    private targetBinauralFreq = 10; // Alpha default
    private globalVolume = 0.5;
    private mode: 'cosmic' | 'nature' | 'focus' = 'cosmic';

    public async init() {
        if (this.ctx) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const AudioCtx = globalThis.AudioContext || (globalThis as any).webkitAudioContext;
        this.ctx = new AudioCtx({ latencyHint: 'balanced' });

        // Master Chain: Limiter -> Master Gain -> Destination
        this.limiter = this.ctx.createDynamicsCompressor();
        this.limiter.threshold.value = -10;
        this.limiter.ratio.value = 12;

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = this.globalVolume;

        this.limiter.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
    }

    public setVolume(val: number) {
        this.globalVolume = Math.max(0, Math.min(1, val));
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setTargetAtTime(this.globalVolume, this.ctx.currentTime, 0.1);
        }
    }

    public setMode(mode: 'cosmic' | 'nature' | 'focus') {
        this.mode = mode;
        if (this.isRunning) {
            this.teardownLayers();
            this.buildLayers();
            this.startTextureLoop();
        }
    }

    public async start() {
        if (!this.ctx) await this.init();
        if (this.ctx?.state === 'suspended') await this.ctx.resume();
        if (this.isRunning) return;

        this.isRunning = true;
        this.buildLayers();
        this.startTextureLoop();
    }

    public stop() {
        if (!this.isRunning || !this.ctx) return;

        // Ramp down master for smooth exit
        const now = this.ctx.currentTime;
        this.masterGain?.gain.linearRampToValueAtTime(0, now + 1);

        setTimeout(() => {
            this.teardownLayers();
            this.isRunning = false;
            // Restore volume for next start
            if (this.masterGain) this.masterGain.gain.setValueAtTime(this.globalVolume, this.ctx!.currentTime);
        }, 1100);
    }

    private buildLayers() {
        if (!this.ctx || !this.limiter) return;
        const now = this.ctx.currentTime;

        // 1. DRONE LAYER (Three oscillators for "Chorus" effect)
        // Cosmic: Full, Focus: Minimal (base only), Nature: Low
        if (this.mode === 'cosmic' || this.mode === 'focus') {
            this.droneNodes = [];
            const ratios = [1, 1.5, 2]; // Root, Fifth, Octave

            // Focus mode only uses root note for clarity
            const activeRatios = this.mode === 'focus' ? [1] : ratios;

            activeRatios.forEach((ratio, i) => {
                const osc = this.ctx!.createOscillator();
                const panNode = this.ctx!.createStereoPanner();
                const gain = this.ctx!.createGain();

                osc.type = i === 1 ? 'triangle' : 'sine';
                osc.frequency.setValueAtTime(this.baseFreq * ratio, now);
                // Gentle random detune for warmth
                osc.detune.value = (Math.random() * 10) - 5;

                // Spread panorama
                let panVal = 0;
                if (i === 1) panVal = -0.3;
                else if (i === 2) panVal = 0.3;
                panNode.pan.value = panVal;

                gain.gain.value = 0; // Fade in
                const maxGain = this.mode === 'focus' ? 0.1 : (0.15 / (i + 1));
                gain.gain.linearRampToValueAtTime(maxGain, now + 3);

                osc.connect(panNode).connect(gain).connect(this.limiter!);
                osc.start();
                this.droneNodes.push({ osc, pan: panNode, gain });
            });
        }

        // 2. ATMOSPHERE LAYER (Pink Noise) - "Wind/Space"
        // Nature: Prominent, Cosmic: Subtle, Focus: Off
        if (this.mode !== 'focus') {
            const buffer = this.createPinkNoise(5); // 5 sec buffer
            const source = this.ctx.createBufferSource();
            source.buffer = buffer;
            source.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            // Nature uses higher cutoff for "windy" feel
            filter.frequency.value = this.mode === 'nature' ? 400 : 200;

            const panNode = this.ctx.createStereoPanner();
            const gain = this.ctx.createGain();
            gain.gain.value = 0;

            const targetGain = this.mode === 'nature' ? 0.15 : 0.08;
            gain.gain.linearRampToValueAtTime(targetGain, now + 4);

            source.connect(filter).connect(panNode).connect(gain).connect(this.limiter);
            source.start();
            this.atmosphere = { source, filter, gain, pan: panNode };
        }

        // 3. BINAURAL LAYER (Always active for benefits)
        this.updateBinauralFreq(); // Set initial freq
    }

    private teardownLayers() {
        this.droneNodes.forEach(n => { n.osc.stop(); n.osc.disconnect(); });
        this.droneNodes = [];

        if (this.atmosphere) {
            this.atmosphere.source?.stop();
            this.atmosphere.source?.disconnect();
            this.atmosphere = null;
        }

        // Keep binaural running or restart it? 
        // For simplicity, we restart everything on mode switch.
        if (this.binaural) {
            this.binaural.left.stop();
            this.binaural.right.stop();
            this.binaural = null;
        }

        this.textureNodes.forEach(stop => stop());
        this.textureNodes = [];
    }

    // --- ADAPTIVE LOGIC ---

    public updateState(state: BreathingState) {
        if (!this.ctx || !this.atmosphere || !this.isRunning) return;
        const now = this.ctx.currentTime;
        const rampTime = 0.5; // Response latency

        // Tech changed?
        if (state.techProfile &&
            (!this.currentProfile ||
                state.techProfile.baseFreq !== this.currentProfile.baseFreq ||
                state.techProfile.binauralBeat !== this.currentProfile.binauralBeat)) {

            this.currentProfile = state.techProfile;
            this.applyTechProfile(state.techProfile);
        }

        // Breath Modulation
        if (state.phase === 'Inhale') {
            // Brighter, Louder, Wider
            this.atmosphere.filter.frequency.setTargetAtTime(600, now, rampTime);
            this.atmosphere.gain.gain.setTargetAtTime(0.12, now, rampTime);
            this.atmosphere.pan.pan.setTargetAtTime(0.6, now, rampTime); // Pan Right
        } else if (state.phase === 'Exhale') {
            // Darker, Quieter, Symmetric
            this.atmosphere.filter.frequency.setTargetAtTime(150, now, rampTime);
            this.atmosphere.gain.gain.setTargetAtTime(0.05, now, rampTime * 2);
            this.atmosphere.pan.pan.setTargetAtTime(0, now, rampTime); // Center
        } else if (state.phase === 'Hold') {
            // Static tension
            this.atmosphere.filter.frequency.setTargetAtTime(300, now, rampTime);
            this.atmosphere.pan.pan.setTargetAtTime(-0.6, now, rampTime); // Pan Left tension
        }
    }

    private applyTechProfile(profile: { baseFreq: number; binauralBeat: number }) {
        this.baseFreq = profile.baseFreq;
        this.targetBinauralFreq = profile.binauralBeat;
        this.setBinauralBeat(this.targetBinauralFreq);

        // Update Drones smoothly
        if (this.droneNodes.length > 0 && this.ctx) {
            const ratios = [1, 1.5, 2];
            this.droneNodes.forEach((node, i) => {
                node.osc.frequency.setTargetAtTime(this.baseFreq * ratios[i], this.ctx!.currentTime, 2);
            });
        }
    }

    private setBinauralBeat(diffHz: number) {
        if (!this.ctx || !this.limiter) return;

        const carrier = 200; // Good carrier for binaural
        const leftFreq = carrier;
        const rightFreq = carrier + diffHz;

        if (!this.binaural) {
            // Init
            const oscL = this.ctx.createOscillator();
            const oscR = this.ctx.createOscillator();
            const panL = this.ctx.createStereoPanner();
            const panR = this.ctx.createStereoPanner();
            const gain = this.ctx.createGain();

            oscL.frequency.value = leftFreq;
            oscR.frequency.value = rightFreq;
            panL.pan.value = -1;
            panR.pan.value = 1;

            gain.gain.value = 0.04; // Subtle

            oscL.connect(panL).connect(gain);
            oscR.connect(panR).connect(gain);
            gain.connect(this.limiter);

            oscL.start();
            oscR.start();

            this.binaural = { left: oscL, right: oscR, gain };
        } else {
            // Update
            const now = this.ctx.currentTime;
            this.binaural.left.frequency.setTargetAtTime(leftFreq, now, 1);
            this.binaural.right.frequency.setTargetAtTime(rightFreq, now, 1);
        }
    }

    private updateBinauralFreq() {
        if (this.currentProfile) {
            this.applyTechProfile(this.currentProfile);
        }
    }

    // --- TEXTURE LAYER (Random Sparkles) ---
    private startTextureLoop() {
        // Focus mode: No random distractions
        if (this.mode === 'focus') return;

        const loop = () => {
            if (!this.isRunning) return;
            this.playSparkle();
            const nextTime = 2000 + Math.random() * 5000; // 2-7 seconds
            const timeout = setTimeout(loop, nextTime);
            this.textureNodes.push(() => clearTimeout(timeout));
        };
        loop();
    }

    private playSparkle() {
        if (!this.ctx || !this.limiter) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const pan = this.ctx.createStereoPanner();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(this.baseFreq * 4, this.ctx.currentTime); // High harmonic
        // Slide down
        osc.frequency.exponentialRampToValueAtTime(this.baseFreq * 2, this.ctx.currentTime + 0.5);

        pan.pan.value = (Math.random() * 2) - 1;

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 0.1); // Very quiet
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);

        osc.connect(pan).connect(gain).connect(this.limiter);
        osc.start();
        osc.stop(this.ctx.currentTime + 2);
    }

    // --- UTILS ---
    private createPinkNoise(duration: number): AudioBuffer {
        const bufferSize = this.ctx!.sampleRate * duration;
        const buffer = this.ctx!.createBuffer(1, bufferSize, this.ctx!.sampleRate);
        const data = buffer.getChannelData(0);

        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.969 * b2 + white * 0.153852;
            b3 = 0.8665 * b3 + white * 0.3104856;
            b4 = 0.55 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.016898;
            data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            data[i] *= 0.11; // Gain comp
            b6 = white * 0.115926;
        }
        return buffer;
    }
}
