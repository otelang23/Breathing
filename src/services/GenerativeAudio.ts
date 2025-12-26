/**
 * GenerativeAudio.ts
 * 
 * A procedural audio engine using the Web Audio API.
 * Creates an evolving soundscape that responds to "Tension" (user state/HR)
 * and target "Frequency" (Binaural Beats).
 * 
 * Components:
 * - Drone Layer: 3 Oscillators (Sine/Triangle) creating a consistent chord.
 * - Binaural Layer: 2 Precise Oscillators for Alpha/Theta entrainment.
 * - Noise Layer: Pink noise for texture.
 */

export class GenerativeAudio {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    // Nodes
    private drones: OscillatorNode[] = [];
    private binauralL: OscillatorNode | null = null;
    private binauralR: OscillatorNode | null = null;
    private lfo: OscillatorNode | null = null; // For subtle movement

    private isPlaying: boolean = false;

    // Frequencies for a soothing "Root" chord (e.g., C major-ish or simple 5ths)
    private readonly ROOT_FREQ = 130.81; // C3
    private readonly HARMONICS = [1, 1.5, 2]; // Root, Fifth, Octave

    constructor() {
        // Init context on first gesture usually, but here we prep class
    }

    public async init() {
        if (this.ctx) return;

        // @ts-ignore
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioCtx();

        this.masterGain = this.ctx!.createGain();
        this.masterGain.gain.value = 0.5;
        this.masterGain.connect(this.ctx!.destination);
    }

    public start() {
        if (this.isPlaying || !this.ctx) return;
        this.isPlaying = true;

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        // 1. Create Drone Texture
        this.HARMONICS.forEach((ratio, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();

            osc.type = i === 1 ? 'triangle' : 'sine';
            osc.frequency.value = this.ROOT_FREQ * ratio;

            // Add slight random detune for "width"
            osc.detune.value = (Math.random() * 20) - 10;

            gain.gain.value = 0.1 / (i + 1); // Higher harmonics quieter

            // LFO for breathing effect on volume
            const lfo = this.ctx!.createOscillator();
            lfo.frequency.value = 0.1; // Very slow
            const lfoGain = this.ctx!.createGain();
            lfoGain.gain.value = 0.05;
            lfo.connect(lfoGain);
            lfoGain.connect(gain.gain);
            lfo.start();

            osc.connect(gain);
            gain.connect(this.masterGain!);
            osc.start();
            this.drones.push(osc);
        });

        // 2. Start Binaural (Initially Alpha 10Hz)
        this.setBinaural(10);
    }

    public stop() {
        if (!this.isPlaying) return;

        this.drones.forEach(o => o.stop());
        this.drones = [];
        if (this.binauralL) this.binauralL.stop();
        if (this.binauralR) this.binauralR.stop();

        this.isPlaying = false;
    }

    public setBinaural(targetDiffHz: number) {
        if (!this.ctx) return;

        // Cleanup old
        if (this.binauralL) {
            try {
                // gentle fade could be better but hard stop for now
                this.binauralL.stop();
                this.binauralR.stop();
            } catch (e) { }
        }

        // Base carrier freq (soothing low mid)
        const carrier = 220;

        // Create Left Ear
        this.binauralL = this.ctx.createOscillator();
        this.binauralL.frequency.value = carrier;
        const pannerL = this.ctx.createStereoPanner();
        pannerL.pan.value = -1;
        const gainL = this.ctx.createGain();
        gainL.gain.value = 0.05; // Subtle

        this.binauralL.connect(gainL);
        gainL.connect(pannerL);
        pannerL.connect(this.masterGain!);

        // Create Right Ear (Carrier + Difference)
        this.binauralR = this.ctx.createOscillator();
        this.binauralR.frequency.value = carrier + targetDiffHz;
        const pannerR = this.ctx.createStereoPanner();
        pannerR.pan.value = 1;
        const gainR = this.ctx.createGain();
        gainR.gain.value = 0.05;

        this.binauralR.connect(gainR);
        gainR.connect(pannerR);
        pannerR.connect(this.masterGain!);

        this.binauralL.start();
        this.binauralR.start();
    }

    // Adapt sound to Heart Rate (e.g. Higher HR = Faster/Brighter, Lower = Slower/Darker)
    public updateFromBiofeedback(bpm: number) {
        if (!this.ctx || this.drones.length === 0) return;

        // Map 60-100 BPM to Filter or pitch detune?
        // Let's detune the droning slightly to create "tension" at high BPM
        // > 90bpm -> more detune
        const tension = Math.max(0, (bpm - 60) / 40); // 0 to 1

        this.drones.forEach((osc, i) => {
            // Wobbly pitch if high stress
            const wobble = tension * 50;
            osc.detune.linearRampToValueAtTime(wobble * (i % 2 === 0 ? 1 : -1), this.ctx!.currentTime + 2);
        });
    }

    public setVolume(vol: number) {
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(vol, this.ctx!.currentTime, 0.1);
        }
    }
}
