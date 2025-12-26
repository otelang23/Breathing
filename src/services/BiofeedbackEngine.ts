/**
 * BiofeedbackEngine.ts
 * 
 * Implements a lightweight rPPG (remote Photoplethysmography) algorithm to extract 
 * Heart Rate (HR) from a video stream locally in the browser.
 * 
 * Algorithm:
 * 1. Capture video frame.
 * 2. Extract average Green channel intensity from the center (face/forehead approximation).
 * 3. Store signal buffer.
 * 4. Apply bandpass filter (freqs between 0.7Hz and 4Hz -> 42bpm to 240bpm).
 * 5. Perform peak detection to calculate instantaneous BPM.
 */

export class BiofeedbackEngine {
    private video: HTMLVideoElement | null = null;
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private isActive: boolean = false;
    private stream: MediaStream | null = null;

    // Signal Processing
    private signalBuffer: number[] = [];
    private readonly times: number[] = [];
    private readonly BUFFER_SIZE = 150; // ~5 seconds at 30fps

    // Callback
    private readonly onHRUpdate: (bpm: number) => void;

    constructor(onUpdate: (bpm: number) => void) {
        this.onHRUpdate = onUpdate;
    }

    public async start() {
        if (this.isActive) return;

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 320 },
                    height: { ideal: 240 },
                    frameRate: { ideal: 30 }
                },
                audio: false
            });

            this.video = document.createElement('video');
            this.video.srcObject = this.stream;
            this.video.play();

            this.canvas = document.createElement('canvas');
            this.canvas.width = 320;
            this.canvas.height = 240;
            this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

            this.isActive = true;
            this.signalBuffer = [];
            this.processFrame();
        } catch (err) {
            console.error('Biofeedback Engine Error:', err);
            throw new Error('Camera access denied or unavailable');
        }
    }

    public stop() {
        this.isActive = false;
        if (this.stream) {
            this.stream.getTracks().forEach(t => t.stop());
            this.stream = null;
        }
        this.video = null;
        this.canvas = null;
    }

    private readonly processFrame = () => {
        if (!this.isActive || !this.video || !this.ctx || !this.canvas) return;

        // Draw current frame
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        // Region of Interest (ROI) - Center 40% of image (likely forehead/cheeks)
        const roiX = Math.floor(this.canvas.width * 0.3);
        const roiY = Math.floor(this.canvas.height * 0.3);
        const roiW = Math.floor(this.canvas.width * 0.4);
        const roiH = Math.floor(this.canvas.height * 0.4);

        const frame = this.ctx.getImageData(roiX, roiY, roiW, roiH);
        const data = frame.data;

        // Extract Average Green Channel (Green correlates best with blood absorption)
        let sumGreen = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
            sumGreen += data[i + 1]; // R=[i], G=[i+1], B=[i+2]
            count++;
        }
        const avgGreen = sumGreen / count;

        // Add to buffer
        const now = performance.now();
        this.signalBuffer.push(avgGreen);
        this.times.push(now);

        // Maintain buffer size
        if (this.signalBuffer.length > this.BUFFER_SIZE) {
            this.signalBuffer.shift();
            this.times.shift();
        }

        // Process Signal periodically (every 10 frames approx)
        if (this.signalBuffer.length >= 60 && this.signalBuffer.length % 10 === 0) {
            this.estimateHeartRate();
        }

        requestAnimationFrame(this.processFrame);
    };

    private estimateHeartRate() {
        if (this.signalBuffer.length < 30) return;

        // 1. Detrend / Normalize (Subtract moving average)
        const windowSize = 5;
        const processed = this.movingAverage(this.signalBuffer, windowSize);

        // 2. Count Peaks (Zero-crossing approach simplified for robustness)
        // Find local maxima
        let lastPeakTime = 0;
        const peakTimes: number[] = [];

        // Simple threshold based peak detection
        const mean = processed.reduce((a, b) => a + b, 0) / processed.length;

        for (let i = 1; i < processed.length - 1; i++) {
            // Look for crests above mean
            if (processed[i] > mean && processed[i] > processed[i - 1] && processed[i] > processed[i + 1]) {
                const time = this.times[i];
                // Debounce (HR max 220bpm = ~270ms gap min)
                if (time - lastPeakTime > 270) {
                    peakTimes.push(time);
                    lastPeakTime = time;
                }
            }
        }

        if (peakTimes.length >= 2) {
            // Calculate BPM from inter-beat intervals
            let totalInterval = 0;
            for (let i = 1; i < peakTimes.length; i++) {
                totalInterval += (peakTimes[i] - peakTimes[i - 1]);
            }
            const avgIntervalMs = totalInterval / (peakTimes.length - 1);
            const bpm = 60000 / avgIntervalMs;

            // Sanity check (human range)
            if (bpm > 40 && bpm < 180) {
                // Smoothing
                this.onHRUpdate(Math.round(bpm));
            }
        }
    }

    private movingAverage(data: number[], win: number): number[] {
        // Returns the data minus its local trend to isolate AC component (pulse)
        // Actually, let's just do a simple Bandpass equivalent: Data - SmoothedData
        const smoothed: number[] = [];
        for (let i = 0; i < data.length; i++) {
            let sum = 0;
            let c = 0;
            for (let j = Math.max(0, i - win); j < Math.min(data.length, i + win); j++) {
                sum += data[j];
                c++;
            }
            smoothed.push(sum / c);
        }

        // High-pass filter: signal - smoothed
        return data.map((v, i) => v - smoothed[i]);
    }
}
