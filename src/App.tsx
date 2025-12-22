import React, { useState, useEffect, useMemo } from 'react';
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Wind,
  Heart,
  Moon,
  Box,
  Activity,
  Info,
  X,
  Zap,
  Mic,
  Volume2,
  Eye,
  EyeOff,
  Smartphone,
  Shield,
  Clock,
  Brain,
  User,
  ListChecks,
  Trash2,
} from 'lucide-react';

/**
 * NEBRA v5.0 – v85-PNS.0
 * Features:
 * - Sound modes: Silent / Minimal / Rich
 * - Breath “glide” tones in Rich mode
 * - Preset routines (Panic / HRV / Sleep / Interview)
 * - Sleep Mode (auto fade audio + haptics)
 * - Office Mode (discreet)
 * - Daily logging + v85-PNS.0 compliance tracker
 * - In-step count overlay (4-7-8, 3:6)
 */

// --- CONFIG DATA ---

const TECHNIQUES = [
  {
    id: 'sigh',
    name: 'Physiological Sigh',
    tagline: 'Panic Button',
    description: 'Double inhale followed by a long exhale. Fastest biological release of stress.',
    strength: 'Fastest stress relief, reduces HR in ~20 sec',
    pas: 9.8,
    ranks: {
      pas: 1,
      stress: 1,
      speed: 1,
      hrv: 7,
      sleep: 6,
      deepSleep: 8,
      discreet: 6,
    },
    meta: {
      stress: '⚡ Calm in 30s',
      speed: '⏱️ 5–20 sec',
      hrv: 'Short duration',
      discreet: 'Visible inhale',
      deepSleep: 'Mainly relief',
    },
    color: 'from-rose-500 via-red-500 to-orange-500',
    steps: [
      { action: 'Inhale', duration: 2500, scale: 1.3, text: 'Deep Inhale', vibration: [80] },
      { action: 'Inhale2', duration: 1000, scale: 1.5, text: 'Top Up', vibration: [40] },
      { action: 'Exhale', duration: 6000, scale: 1.0, text: 'Long Sigh', vibration: [120] },
    ],
  },
  {
    id: 'coherent',
    name: 'Coherent Breathing',
    tagline: 'HRV Builder',
    description: '5.5s rhythm to synchronize heart, lungs, and blood pressure (Resonance).',
    strength: 'Strongest HRV builder, REM stabilizer, best for IQ recovery',
    pas: 9.5,
    ranks: {
      pas: 2,
      stress: 6,
      speed: 6,
      hrv: 1,
      sleep: 5,
      deepSleep: 3,
      discreet: 1,
    },
    meta: {
      hrv: '⭐⭐⭐⭐⭐ Best',
      discreet: 'Invisible',
      deepSleep: 'REM Stabilizer',
      sleep: 'REM Stability',
    },
    color: 'from-emerald-400 via-teal-500 to-cyan-600',
    steps: [
      { action: 'Inhale', duration: 5500, scale: 1.5, text: 'Inhale (5.5s)', vibration: [40] },
      { action: 'Exhale', duration: 5500, scale: 1.0, text: 'Exhale (5.5s)', vibration: [40] },
    ],
  },
  {
    id: 'sleep_478',
    name: '4-7-8 Relax',
    tagline: 'Sedative',
    description: 'Extended breath hold and exhale acts as a tranquilizer for the nervous system.',
    strength: 'Best sleep onset tool, sedative effect',
    pas: 8.9,
    ranks: {
      pas: 3,
      stress: 7,
      speed: 8,
      hrv: 8,
      sleep: 1,
      deepSleep: 2,
      discreet: 5,
    },
    meta: {
      sleep: '⭐⭐⭐⭐⭐ Onset',
      deepSleep: 'Onset + REM',
      discreet: 'Semi-discreet',
      hrv: 'Sedative focus',
    },
    color: 'from-indigo-400 via-violet-500 to-purple-600',
    steps: [
      { action: 'Inhale', duration: 4000, scale: 1.5, text: 'Inhale (4s)', vibration: [40] },
      { action: 'Hold', duration: 7000, scale: 1.5, text: 'Hold (7s)', vibration: [20] },
      { action: 'Exhale', duration: 8000, scale: 1.0, text: 'Whoosh (8s)', vibration: [80] },
    ],
  },
  {
    id: 'diaphragm',
    name: 'Diaphragmatic',
    tagline: 'Belly Breathing',
    description: 'Deep engagement of the lower lung fields to stimulate the vagus nerve.',
    strength: 'Deep vagal stimulation, deep sleep enhancer',
    pas: 7.6,
    ranks: {
      pas: 6,
      stress: 8,
      speed: 7,
      hrv: 2,
      sleep: 2,
      deepSleep: 1,
      discreet: 2,
    },
    meta: {
      deepSleep: '⭐⭐⭐⭐⭐ Deep Stage',
      sleep: 'Deep Relaxation',
      discreet: 'Invisible',
      hrv: '⭐⭐⭐⭐',
    },
    color: 'from-amber-300 via-orange-400 to-red-400',
    steps: [
      { action: 'Inhale', duration: 4000, scale: 1.5, text: 'Belly Out', vibration: [40] },
      { action: 'Exhale', duration: 6000, scale: 1.0, text: 'Belly In', vibration: [40] },
    ],
  },
  {
    id: 'box',
    name: 'Box Breathing',
    tagline: 'Navy SEAL Focus',
    description: 'Equal duration for all phases. Increases CO2 tolerance and mental clarity.',
    strength: 'Cognitive control, interview calmness',
    pas: 8.2,
    ranks: {
      pas: 4,
      stress: 3,
      speed: 3,
      hrv: 5,
      sleep: 8,
      deepSleep: 7,
      discreet: 4,
    },
    meta: {
      stress: '⚡⚡ Focus',
      speed: '⏱️ 30–60 sec',
      discreet: 'Invisible',
      sleep: 'Focus (Not Sedative)',
    },
    color: 'from-blue-400 via-blue-500 to-blue-600',
    steps: [
      { action: 'Inhale', duration: 4000, scale: 1.5, text: 'Inhale (4s)', vibration: [40] },
      { action: 'Hold', duration: 4000, scale: 1.5, text: 'Hold (4s)', vibration: [20] },
      { action: 'Exhale', duration: 4000, scale: 1.0, text: 'Exhale (4s)', vibration: [40] },
      { action: 'Hold', duration: 4000, scale: 1.0, text: 'Hold (4s)', vibration: [20] },
    ],
  },
  {
    id: 'bhramari',
    name: 'Bhramari',
    tagline: 'Humming Bee',
    description: 'Vibrational stimulation of the vagus nerve in the larynx via humming.',
    strength: 'Emotional calming, vagus vibration, improves REM',
    pas: 7.8,
    ranks: {
      pas: 5,
      stress: 4,
      speed: 4,
      hrv: 3,
      sleep: 3,
      deepSleep: 4,
      discreet: 7,
    },
    meta: {
      sleep: 'Calms Amygdala',
      stress: '⚡⚡ Vibration',
      discreet: 'Not Discreet',
    },
    color: 'from-yellow-400 via-amber-500 to-orange-500',
    steps: [
      { action: 'Inhale', duration: 4000, scale: 1.5, text: 'Deep Inhale', vibration: [40] },
      { action: 'Exhale', duration: 10000, scale: 1.0, text: 'Hummmmm...', vibration: [120] },
    ],
  },
  {
    id: 'voo',
    name: 'Voo Chanting',
    tagline: 'Vagal Tone',
    description: 'Low pitched "Voo" sound vibrates the diaphragm and chest.',
    strength: 'Grounding, emotional regulation',
    pas: 7.8,
    ranks: {
      pas: 5,
      stress: 5,
      speed: 5,
      hrv: 4,
      sleep: 4,
      deepSleep: 5,
      discreet: 8,
    },
    meta: {
      discreet: 'Not Discreet',
      hrv: '⭐⭐⭐⭐',
    },
    color: 'from-fuchsia-500 via-pink-600 to-purple-600',
    steps: [
      { action: 'Inhale', duration: 4000, scale: 1.5, text: 'Deep Inhale', vibration: [40] },
      { action: 'Exhale', duration: 10000, scale: 1.0, text: 'Vooooooo...', vibration: [120] },
    ],
  },
  {
    id: 'long_exhale',
    name: 'Long Exhale',
    tagline: '3:6 Ratio',
    description: 'Simple ratio breathing to lower heart rate quickly.',
    strength: 'Lowers HR, improves calmness',
    pas: 7.4,
    ranks: {
      pas: 7,
      stress: 2,
      speed: 2,
      hrv: 6,
      sleep: 7,
      deepSleep: 6,
      discreet: 3,
    },
    meta: {
      stress: '⚡⚡ Fast',
      speed: '⏱️ 20–40 sec',
      discreet: 'Invisible',
    },
    color: 'from-cyan-400 via-sky-500 to-blue-500',
    steps: [
      { action: 'Inhale', duration: 3000, scale: 1.5, text: 'Inhale (3s)', vibration: [40] },
      { action: 'Exhale', duration: 6000, scale: 1.0, text: 'Exhale (6s)', vibration: [40] },
    ],
  },
];

const FILTERS = [
  { id: 'pas', label: 'PAS Score', icon: Activity },
  { id: 'hrv', label: 'HRV', icon: Heart },
  { id: 'sleep', label: 'Sleep', icon: Moon },
  { id: 'stress', label: 'Acute Stress', icon: Shield },
  { id: 'speed', label: 'Speed', icon: Clock },
  { id: 'deepSleep', label: 'Deep/REM', icon: Brain },
  { id: 'discreet', label: 'Discreet', icon: User },
];

// Preset routines: duration-based segments
const PRESETS = [
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

// Evening mandatory thresholds (sec) for v85-PNS.0 compliance
const EVENING_MANDATORY_THRESHOLDS = {
  sigh: 40,
  long_exhale: 20,
  coherent: 480,
  diaphragm: 120,
  sleep_478: 15,
};

// --- AUDIO ENGINE ---

const AudioEngine = {
  ctx: null as AudioContext | null,
  droneOsc: null as OscillatorNode | null,
  droneGain: null as GainNode | null,
  masterVolume: 0.5,

  init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const Ctx = (window as any).AudioContext || (window as any).webkitAudioContext;
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

// --- UI HELPERS ---

const getTechniqueIcon = (id: string) => {
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

const ProgressRing = ({ radius, stroke, progress }: { radius: number; stroke: number; progress: number }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90 transition-all duration-100 ease-linear"
      >
        <circle
          stroke="rgba(255,255,255,0.05)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke="white"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.1s linear' }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="opacity-30"
        />
      </svg>
    </div>
  );
};

const BreathingOrb = ({
  scale,
  color,
  isActive,
  action,
  duration,
  progress,
}: {
  scale: number;
  color: string;
  isActive: boolean;
  action: string;
  duration: number;
  progress: number;
}) => (
  <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80">
    {isActive && <ProgressRing radius={160} stroke={2} progress={progress} />}

    <div
      className={`absolute rounded-full blur-3xl opacity-30 bg-gradient-to-tr ${color} transition-all ease-in-out`}
      style={{
        width: '100%',
        height: '100%',
        transform: `scale(${isActive ? scale * 1.1 : 1})`,
        transitionDuration: isActive ? (action === 'Inhale2' ? '0.5s' : `${duration}ms`) : '2s',
      }}
    />

    <div
      className={`absolute rounded-full opacity-60 bg-gradient-to-b ${color} mix-blend-screen transition-all ease-in-out shadow-[0_0_80px_rgba(255,255,255,0.35)]`}
      style={{
        width: '60%',
        height: '60%',
        transform: `scale(${isActive ? scale : 1})`,
        transitionDuration: isActive ? (action === 'Inhale2' ? '0.8s' : `${duration}ms`) : '1s',
      }}
    />

    <div
      className="relative rounded-full bg-white/90 blur-sm transition-all ease-in-out flex items-center justify-center"
      style={{
        width: '22%',
        height: '22%',
        transform: `scale(${isActive ? scale : 1})`,
        transitionDuration: isActive ? (action === 'Inhale2' ? '0.8s' : `${duration}ms`) : '1s',
      }}
    >
      {!isActive && (
        <div className="flex flex-col items-center justify-center gap-1">
          <span className="text-[10px] font-semibold text-slate-900 tracking-[0.2em]">
            READY
          </span>
          <span className="text-[9px] text-slate-500 uppercase tracking-[0.18em]">
            Press Start
          </span>
        </div>
      )}
    </div>

    {isActive && (
      <div className="absolute inset-0 animate-[spin_12s_linear_infinite] opacity-50">
        <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full blur-[1px] shadow-[0_0_10px_white]" />
        <div className="absolute bottom-8 right-8 w-1 h-1 bg-white rounded-full blur-[1px]" />
      </div>
    )}
  </div>
);

const StatCard = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
  <div className="bg-slate-900/70 border border-slate-700/60 backdrop-blur-md p-3 md:p-4 rounded-2xl flex flex-col items-center justify-center w-full">
    <span className="text-slate-400 text-[10px] md:text-xs uppercase tracking-wider font-semibold mb-1">
      {label}
    </span>
    <span className="text-xl md:text-2xl font-bold text-white font-mono">{value}</span>
    {sub && <span className="text-[10px] md:text-xs text-slate-500 mt-1">{sub}</span>}
  </div>
);

const FilterButton = ({
  active,
  label,
  icon: Icon,
  onClick,
}: {
  active: boolean;
  label: string;
  icon: any;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${active
      ? 'bg-slate-200 text-slate-900 shadow-lg shadow-white/10'
      : 'bg-slate-900/70 text-slate-400 hover:bg-slate-800 hover:text-white border border-transparent hover:border-slate-700'
      }`}
  >
    {Icon && <Icon className="w-3 h-3" />}
    {label}
  </button>
);

// --- MAIN APP ---

const App = () => {
  const [selectedTech, setSelectedTech] = useState(TECHNIQUES[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);

  const [filter, setFilter] = useState('pas');
  const [showInfo, setShowInfo] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);

  const [focusMode, setFocusMode] = useState(false);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [officeMode, setOfficeMode] = useState(false);
  const [sleepMode, setSleepMode] = useState(false);

  const [volume, setVolume] = useState(0.5);
  const [soundMode, setSoundMode] = useState<'silent' | 'minimal' | 'rich'>('minimal');

  const [stepProgress, setStepProgress] = useState(0);

  // Log: { [date]: { techSeconds: { [id]: number }, protocolCompleted: boolean } }
  const [dailyLog, setDailyLog] = useState<any>({});

  // Preset state
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [presetSegmentIndex, setPresetSegmentIndex] = useState(0);
  const [presetSegmentStartSec, setPresetSegmentStartSec] = useState(0);

  const currentStep = selectedTech.steps[currentStepIndex];
  const todayKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Load log from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const raw = window.localStorage.getItem('nebraBreathLog');
      if (raw) {
        setDailyLog(JSON.parse(raw));
      }
    } catch {
      // ignore
    }
  }, []);

  const persistLog = (log: any) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem('nebraBreathLog', JSON.stringify(log));
    } catch {
      // ignore
    }
  };

  // Volume & sound mode → Audio volume
  useEffect(() => {
    const effectiveVolume = soundMode === 'silent' ? 0 : volume;
    AudioEngine.setVolume(effectiveVolume);
  }, [soundMode, volume]);

  // Office mode effect: force minimal + softer volume + no haptics
  useEffect(() => {
    if (officeMode) {
      setSoundMode('minimal');
      setVolume((v) => Math.min(v, 0.3));
      setHapticEnabled(false);
    }
  }, [officeMode]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
  };

  // Sound & Haptic on step change
  useEffect(() => {
    if (!isActive) return;

    // Audio
    AudioEngine.playStepSound({
      techId: selectedTech.id,
      action: currentStep.action,
      durationMs: currentStep.duration,
      soundMode,
    });

    // Haptic profiles
    if (hapticEnabled && typeof navigator !== 'undefined' && (navigator as any).vibrate) {
      const pattern = currentStep.vibration || 40;
      (navigator as any).vibrate(pattern);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex]);

  // Drone management
  useEffect(() => {
    if (isActive) {
      AudioEngine.startDrone(soundMode);
    } else {
      AudioEngine.stopDrone();
    }
    return () => {
      AudioEngine.stopDrone();
    };
  }, [isActive, soundMode]);

  // Breathing animation loop
  useEffect(() => {
    if (!isActive) {
      setStepProgress(0);
      return;
    }

    let startTime: number | null = null;
    let animationFrame: number;

    const duration = currentStep.duration;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setStepProgress(progress);

      if (elapsed < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        // Step finished
        if (currentStepIndex < selectedTech.steps.length - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        } else {
          setCurrentStepIndex(0);
          setCycleCount((prev) => prev + 1);
        }
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isActive, currentStep.duration, currentStepIndex, selectedTech.steps.length, currentStep]);

  // Global timer + logging + preset engine + sleep-mode fade
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTotalSeconds((prev) => prev + 1);

      // Log 1s to current technique
      setDailyLog((prev: any) => {
        const day = prev[todayKey] || { techSeconds: {}, protocolCompleted: false };
        const techSec = day.techSeconds || {};
        techSec[selectedTech.id] = (techSec[selectedTech.id] || 0) + 1;
        const updated = {
          ...prev,
          [todayKey]: { ...day, techSeconds: techSec },
        };
        persistLog(updated);
        return updated;
      });

      // Preset management
      if (activePresetId) {
        const preset = PRESETS.find((p) => p.id === activePresetId);
        if (preset) {
          const segment = preset.segments[presetSegmentIndex];
          if (segment) {
            const elapsedInSegment = totalSeconds + 1 - presetSegmentStartSec;
            if (elapsedInSegment >= segment.durationSec) {
              // Move to next or finish
              if (presetSegmentIndex < preset.segments.length - 1) {
                const nextIndex = presetSegmentIndex + 1;
                const nextSeg = preset.segments[nextIndex];
                const nextTech = TECHNIQUES.find((t) => t.id === nextSeg.techId);
                if (nextTech) {
                  setSelectedTech(nextTech);
                  setCurrentStepIndex(0);
                }
                setPresetSegmentIndex(nextIndex);
                setPresetSegmentStartSec(totalSeconds + 1);
                setCycleCount(0);
              } else {
                // Preset finished
                setActivePresetId(null);
                setIsActive(false);
              }
            }
          }
        }
      }

      // Sleep mode: auto fade after ~7–10 mins
      if (sleepMode) {
        if (totalSeconds + 1 >= 420 && soundMode !== 'silent') {
          setSoundMode('silent');
          setHapticEnabled(false);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, activePresetId, presetSegmentIndex, presetSegmentStartSec, sleepMode, soundMode, todayKey, selectedTech.id, totalSeconds]);

  const resetSession = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setCycleCount(0);
    setTotalSeconds(0);
    setStepProgress(0);
    setActivePresetId(null);
    setPresetSegmentIndex(0);
    setPresetSegmentStartSec(0);
  };

  const toggleSession = () => {
    AudioEngine.init();
    setIsActive((prev) => !prev);
    if (!isActive && activePresetId && presetSegmentStartSec === 0) {
      setPresetSegmentStartSec(0);
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setStepProgress(0);
  };

  const changeTechnique = (tech: any) => {
    resetSession();
    setSelectedTech(tech);
  };

  const resetData = () => {
    if (window.confirm('Are you sure you want to reset all daily progress and logs?')) {
      setDailyLog({});
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('nebraBreathLog');
      }
    }
  };

  const startPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const first = preset.segments[0];
    const tech = TECHNIQUES.find((t) => t.id === first.techId);
    if (!tech) return;

    resetSession();
    setActivePresetId(presetId);
    setPresetSegmentIndex(0);
    setPresetSegmentStartSec(0);
    setSelectedTech(tech);
    setIsActive(true);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const sortedTechniques = useMemo(() => {
    return [...TECHNIQUES].sort((a, b) => {
      const rankA = (a.ranks as any)[filter] ?? 99;
      const rankB = (b.ranks as any)[filter] ?? 99;
      return rankA - rankB;
    });
  }, [filter]);

  const selectedFilterLabel =
    FILTERS.find((f) => f.id === filter)?.label || 'PAS Score';

  const todayLog = dailyLog[todayKey] || { techSeconds: {}, protocolCompleted: false };

  // Compute protocol compliance
  const computeCompliance = () => {
    const secs = todayLog.techSeconds || {};
    let doneCount = 0;
    const mandatoryIds = Object.keys(EVENING_MANDATORY_THRESHOLDS);
    mandatoryIds.forEach((id) => {
      const threshold = (EVENING_MANDATORY_THRESHOLDS as any)[id];
      if ((secs[id] || 0) >= threshold) doneCount += 1;
    });
    const total = mandatoryIds.length;
    const completed = doneCount === total;
    return { doneCount, total, completed };
  };

  const compliance = computeCompliance();

  // Persist computed protocolCompleted flag
  useEffect(() => {
    if (todayLog.protocolCompleted === compliance.completed) return;
    setDailyLog((prev: any) => {
      const day = prev[todayKey] || { techSeconds: {}, protocolCompleted: false };
      const updated = {
        ...prev,
        [todayKey]: { ...day, protocolCompleted: compliance.completed },
      };
      persistLog(updated);
      return updated;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [compliance.completed]);

  // In-step counting for ratios (4-7-8 & 3:6)
  const getStepCountLabel = () => {
    const id = selectedTech.id;
    const act = currentStep.action;
    const p = stepProgress;

    if (id === 'sleep_478') {
      if (act === 'Inhale') {
        const count = Math.min(4, Math.max(1, Math.ceil((p / 100) * 4)));
        return `Count: ${count} / 4`;
      }
      if (act === 'Hold') {
        const count = Math.min(7, Math.max(1, Math.ceil((p / 100) * 7)));
        return `Count: ${count} / 7`;
      }
      if (act === 'Exhale') {
        const count = Math.min(8, Math.max(1, Math.ceil((p / 100) * 8)));
        return `Count: ${count} / 8`;
      }
    }

    if (id === 'long_exhale') {
      if (act === 'Inhale') {
        const count = Math.min(3, Math.max(1, Math.ceil((p / 100) * 3)));
        return `Count: ${count} / 3`;
      }
      if (act === 'Exhale') {
        const count = Math.min(6, Math.max(1, Math.ceil((p / 100) * 6)));
        return `Count: ${count} / 6`;
      }
    }

    if (id === 'box') {
      const total = 4;
      const count = Math.min(total, Math.max(1, Math.ceil((p / 100) * total)));
      return `Count: ${count} / 4`;
    }

    return null;
  };

  const stepCountLabel = getStepCountLabel();
  const currentPreset = activePresetId
    ? PRESETS.find((p) => p.id === activePresetId)
    : null;

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-200 font-sans selection:bg-teal-500/30 relative flex flex-col overflow-y-auto">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
      <div
        className={`absolute top-0 left-0 right-0 h-[55vh] bg-gradient-to-b ${selectedTech.color} to-transparent opacity-10 blur-3xl transition-all duration-700 pointer-events-none`}
      />

      {/* HEADER */}
      <header
        className={`w-full p-4 md:p-6 flex justify-between items-center z-20 relative transition-all duration-400 ${focusMode ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
          }`}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white to-slate-400 flex items-center justify-center shadow-lg shadow-white/10">
            <Wind className="text-slate-900 w-5 h-5" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-tight text-white">Nebra</span>
            <span className="text-[10px] text-slate-500 font-mono tracking-widest">
              v5.0 · v85-PNS.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Sound mode selector */}
          <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/10 hover:border-white/20 transition-colors">
            {['silent', 'minimal', 'rich'].map((mode) => (
              <button
                key={mode}
                onClick={() => setSoundMode(mode as any)}
                className={`text-[10px] px-2 py-0.5 rounded-full font-mono uppercase tracking-[0.16em] ${soundMode === mode
                  ? 'bg-white text-slate-900'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
              >
                {mode === 'silent' && 'Off'}
                {mode === 'minimal' && 'Min'}
                {mode === 'rich' && 'Rich'}
              </button>
            ))}
            <div className="flex items-center gap-1 ml-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={soundMode === 'silent' ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-white"
                aria-label="Volume"
              />
            </div>
          </div>

          {/* Haptic toggle */}
          <button
            onClick={() => setHapticEnabled((prev) => !prev)}
            className={`p-2 rounded-full transition-colors hidden md:block ${hapticEnabled
              ? 'text-teal-400 bg-teal-900/20'
              : 'text-slate-500 hover:bg-white/10'
              }`}
            title="Toggle Haptic Feedback"
          >
            <Smartphone className="w-5 h-5" />
          </button>

          {/* Office Mode */}
          <button
            onClick={() => setOfficeMode((p) => !p)}
            className={`p-2 rounded-full transition-colors ${officeMode
              ? 'bg-slate-200 text-slate-900'
              : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800'
              }`}
            title="Office / Discreet Mode"
          >
            <Shield className="w-5 h-5" />
          </button>

          {/* Sleep Mode */}
          <button
            onClick={() => setSleepMode((p) => !p)}
            className={`p-2 rounded-full transition-colors ${sleepMode
              ? 'bg-indigo-500 text-white'
              : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800'
              }`}
            title="Sleep Mode (Auto fade audio)"
          >
            <Moon className="w-5 h-5" />
          </button>

          {/* Evening protocol modal */}
          <button
            onClick={() => setShowProtocol(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-white bg-white/10 border border-white/20 shadow-lg shadow-white/5"
            title="Evening Protocol"
          >
            <ListChecks className="w-5 h-5" />
          </button>

          {/* Focus mode */}
          <button
            onClick={() => setFocusMode(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            title="Enter Focus Mode"
            aria-label="Enter Focus Mode"
          >
            <Eye className="w-5 h-5" />
          </button>

          {/* Reset Data */}
          <button
            onClick={resetData}
            className="p-2 rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-red-400"
            title="Reset All Data"
            aria-label="Reset All Data"
          >
            <Trash2 className="w-5 h-5" />
          </button>

          {/* Info */}
          <button
            onClick={() => setShowInfo(true)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Open Technique Guide"
          >
            <Info className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* FILTER BAR */}
      <div
        className={`w-full z-20 px-4 mb-2 flex justify-center transition-all duration-400 ${focusMode ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
          }`}
      >
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 max-w-full">
          {FILTERS.map((f) => (
            <FilterButton
              key={f.id}
              active={filter === f.id}
              label={f.label}
              icon={f.icon}
              onClick={() => setFilter(f.id)}
            />
          ))}
        </div>
      </div>

      {/* MAIN */}
      <main className="relative z-10 flex-1 flex flex-col items-center p-4 min-h-0">
        <section className="flex-1 flex flex-col items-center justify-center w-full gap-6 md:gap-8">
          {/* Orb + Right Panel */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 items-center gap-6 relative">
            {/* Left Spacer for balance */}
            <div className="hidden md:block" />

            {/* Center: Orb */}
            <div className="flex flex-col items-center justify-center">
              <BreathingOrb
                scale={currentStep.scale}
                color={selectedTech.color}
                isActive={isActive}
                action={currentStep.action}
                duration={currentStep.duration}
                progress={stepProgress}
              />

              {/* Phase labels row */}
              <div className="mt-4 flex gap-2 text-[10px] uppercase tracking-[0.14em]">
                {['Inhale', 'Hold', 'Exhale', 'Hold2'].map((phase, idx) => {
                  const match =
                    (phase === 'Hold' && currentStep.action === 'Hold') ||
                    (phase === 'Inhale' && (currentStep.action === 'Inhale' || currentStep.action === 'Inhale2')) ||
                    (phase === 'Exhale' && currentStep.action === 'Exhale');
                  return (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded-full border text-[10px] font-mono ${match
                        ? 'border-teal-400 text-teal-300 bg-teal-900/20'
                        : 'border-slate-700 text-slate-500'
                        }`}
                    >
                      {phase === 'Hold2' ? 'Hold' : phase}
                    </span>
                  );
                })}
              </div>

              {/* Text + counters */}
              <div className="mt-3 text-center space-y-1">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
                  {currentStep.text}
                </h2>
                <p className="text-xs md:text-sm text-slate-400 font-mono tracking-[0.16em] uppercase">
                  Step {currentStepIndex + 1} / {selectedTech.steps.length} · PAS {selectedTech.pas}
                </p>
                {stepCountLabel && (
                  <p className="text-[11px] text-teal-300 font-mono mt-1">
                    {stepCountLabel}
                  </p>
                )}
                {currentPreset && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Preset:{' '}
                    <span className="text-slate-200 font-semibold">
                      {currentPreset.label}
                    </span>{' '}
                    · Segment {presetSegmentIndex + 1}/{currentPreset.segments.length}
                  </p>
                )}
                {!isActive && !currentPreset && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    Choose a technique or tap a preset below, then press{' '}
                    <span className="font-semibold text-slate-200">Start</span>.
                  </p>
                )}
              </div>

              {focusMode && (
                <button
                  onClick={() => setFocusMode(false)}
                  className="mt-6 p-3 rounded-full bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 backdrop-blur transition-all"
                  aria-label="Exit Focus Mode"
                >
                  <EyeOff className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Right: Current technique panel */}
            <div className="hidden md:flex justify-start">
              <aside className="flex flex-col w-full max-w-xs bg-slate-900/70 border border-slate-800/70 rounded-2xl p-4 gap-3 shadow-lg shadow-black/40">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-slate-800 text-slate-100">
                      {getTechniqueIcon(selectedTech.id)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {selectedTech.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 uppercase tracking-[0.16em]">
                        {selectedTech.tagline}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 uppercase tracking-[0.16em]">
                      PAS
                    </span>
                    <span className="text-lg font-mono font-bold text-teal-300">
                      {selectedTech.pas}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedTech.description}
                </p>
                <div className="flex items-start gap-2 mt-1">
                  <Zap className="w-3 h-3 text-teal-400 mt-[3px]" />
                  <p className="text-xs text-teal-100">{selectedTech.strength}</p>
                </div>
                <div className="mt-2 text-[11px] text-slate-500">
                  <span className="font-mono uppercase tracking-[0.16em] text-slate-500">
                    Sorted by {selectedFilterLabel}
                  </span>
                  <div className="mt-1 text-xs">
                    Rank{' '}
                    <span className="font-mono font-semibold text-slate-100">
                      #{selectedTech.ranks[filter as keyof typeof selectedTech.ranks] ?? '–'}
                    </span>{' '}
                    ·{' '}
                    <span className="text-teal-300">
                      {selectedTech.meta?.[filter as keyof typeof selectedTech.meta] || selectedTech.tagline}
                    </span>
                  </div>
                </div>
              </aside>
            </div>
          </div>

          {/* Controls + Stats + Presets + Grid */}
          <div
            className={`w-full flex flex-col items-center gap-6 pb-4 transition-all duration-400 ${focusMode ? 'opacity-0 translate-y-8 pointer-events-none' : 'opacity-100 translate-y-0'
              }`}
          >
            {/* Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={resetSession}
                className="group p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-all active:scale-95 shadow-md"
                title="Reset Session"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={toggleSession}
                className={`group relative flex items-center justify-center gap-3 w-40 h-14 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl ${isActive
                  ? 'bg-slate-900 text-slate-200 border border-slate-700'
                  : 'bg-white text-slate-900'
                  }`}
                aria-label={isActive ? 'Pause' : 'Start'}
              >
                {isActive ? (
                  <Pause className="w-6 h-6 fill-current" />
                ) : (
                  <Play className="w-6 h-6 fill-current" />
                )}
                <span className="font-bold text-lg">
                  {isActive ? 'Pause' : 'Start'}
                </span>

                {!isActive && (
                  <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-lg animate-pulse" />
                )}
              </button>

              <button
                onClick={stopSession}
                className="group p-3 rounded-full bg-slate-900/80 border border-slate-700 text-slate-400 hover:bg-red-900/40 hover:text-red-300 hover:border-red-800/70 transition-all active:scale-95 shadow-md"
                title="Stop & Center"
              >
                <Square className="w-5 h-5 fill-current" />
              </button>
            </div>

            {/* Stats & Compliance */}
            <div className="w-full max-w-3xl grid grid-cols-3 gap-3">
              <StatCard label="Time" value={formatTime(totalSeconds)} />
              <StatCard label="Cycles" value={cycleCount} sub={`PAS ${selectedTech.pas}`} />
              <StatCard
                label="Evening Protocol"
                value={`${compliance.doneCount}/${compliance.total}`}
                sub={compliance.completed ? 'v85-PNS.0 ✓' : 'In progress'}
              />
            </div>

            {/* Preset Row */}
            <div className="w-full max-w-4xl">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                  Preset Routines
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  const active = activePresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => startPreset(preset.id)}
                      className={`flex items-start gap-2 p-3 rounded-xl border text-left transition-all ${active
                        ? 'bg-teal-900/40 border-teal-400 text-teal-50'
                        : 'bg-slate-900/70 border-slate-800 text-slate-200 hover:border-slate-600 hover:bg-slate-800'
                        }`}
                    >
                      <div
                        className={`p-1.5 rounded-lg ${active ? 'bg-teal-400 text-slate-900' : 'bg-slate-800 text-slate-300'
                          }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold">{preset.label}</div>
                        <div className="text-[11px] text-slate-400 mt-1">
                          {preset.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Technique Grid */}
            <div className="w-full">
              <div className="flex justify-between items-end mb-3 ml-1">
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                  Techniques · Sorted by {selectedFilterLabel}
                </h3>
                <span className="text-[10px] text-slate-600 font-mono">Log: {todayKey}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full max-h-[32vh] overflow-y-auto pr-2 custom-scrollbar">
                {sortedTechniques.map((tech) => {
                  const isSelected = tech.id === selectedTech.id;
                  const metaText = tech.meta?.[filter as keyof typeof tech.meta] || tech.tagline;
                  const todaySeconds = (todayLog.techSeconds || {})[tech.id] || 0;

                  return (
                    <button
                      key={tech.id}
                      onClick={() => changeTechnique(tech)}
                      className={`relative p-3 rounded-xl border transition-all duration-200 flex flex-col items-start gap-2 text-left group ${isSelected
                        ? 'bg-slate-900 border-slate-600 shadow-lg shadow-black/40'
                        : 'bg-slate-900/60 border-slate-800/70 hover:bg-slate-800 hover:border-slate-700'
                        }`}
                      aria-pressed={isSelected}
                    >
                      <div className="flex justify-between w-full items-start gap-1">
                        <div
                          className={`p-1.5 rounded-lg ${isSelected
                            ? 'bg-white text-slate-900'
                            : 'bg-slate-800 text-slate-500 group-hover:text-slate-300'
                            }`}
                        >
                          {getTechniqueIcon(tech.id)}
                        </div>
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-500">
                          #{tech.ranks[filter as keyof typeof tech.ranks]}
                        </span>
                      </div>
                      <div>
                        <div
                          className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-slate-100'
                            }`}
                        >
                          {tech.name}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 truncate w-full">
                          <span className="text-teal-300/90">{metaText}</span>
                        </div>
                      </div>
                      <div className="mt-1 text-[10px] text-slate-500 font-mono">
                        {todaySeconds > 0 && (
                          <span className="text-slate-400">
                            Today: {Math.round(todaySeconds / 60)}m
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-400 via-cyan-400 to-indigo-400 rounded-b-xl" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* INFO MODAL */}
      {showInfo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-white">Technique Guide</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest">
                  Sorted by {selectedFilterLabel}
                </p>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="p-1 hover:bg-slate-800 rounded-full"
                aria-label="Close Technique Guide"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-6">
              {sortedTechniques.map((tech) => (
                <div key={tech.id} className="border-b border-slate-800 pb-4 last:border-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      {getTechniqueIcon(tech.id)}
                      {tech.name}
                    </h4>
                    <div className="flex gap-2 items-center">
                      {tech.meta?.[filter as keyof typeof tech.meta] && (
                        <span className="text-[10px] text-teal-400">
                          {tech.meta[filter as keyof typeof tech.meta]}
                        </span>
                      )}
                      <span className="text-xs font-mono font-bold text-slate-600 bg-slate-950 px-2 py-0.5 rounded">
                        Rank #{tech.ranks[filter as keyof typeof tech.ranks]}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {tech.description}
                  </p>
                  <div className="mt-2 flex items-start gap-2">
                    <Zap className="w-3 h-3 text-teal-400 mt-0.5 shrink-0" />
                    <span className="text-xs text-teal-100 font-medium">
                      {tech.strength}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PROTOCOL MODAL */}
      {showProtocol && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[85vh] overflow-y-auto relative">
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-teal-900/30 to-transparent pointer-events-none" />

            <div className="flex justify-between items-start mb-6 relative">
              <div>
                <h3 className="text-2xl font-bold text-white">Evening Protocol</h3>
                <p className="text-xs text-teal-400 uppercase tracking-widest font-mono mt-1">
                  v85-PNS.0 Daily Recommendation
                </p>
              </div>
              <button
                onClick={() => setShowProtocol(false)}
                className="p-2 hover:bg-white/10 rounded-full"
                aria-label="Close Evening Protocol"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Mandatory */}
            <div className="mb-8 relative">
              <h4 className="flex items-center gap-2 text-sm font-bold text-white mb-4 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                Mandatory Sequence
              </h4>
              <div className="space-y-2">
                {Object.entries(EVENING_MANDATORY_THRESHOLDS).map(([id, threshold], index) => {
                  const item = ([
                    { id: 'sigh', label: 'Physiological Sigh', purpose: 'Instant stress relief', dose: '2 reps (~40s)' },
                    { id: 'long_exhale', label: 'Long Exhale (3:6)', purpose: 'Lower HR quickly', dose: '4 cycles (~20s)' },
                    { id: 'coherent', label: 'Coherent Breathing', purpose: 'HRV maximization', dose: '8 min' },
                    { id: 'diaphragm', label: 'Diaphragmatic', purpose: 'Deep muscle relaxation', dose: '2 min' },
                    { id: 'sleep_478', label: '4-7-8 Relax', purpose: 'Sleep induction', dose: '1–2 cycles' },
                  ] as any[]).find((x) => x.id === id)!;

                  const secs = (todayLog.techSeconds || {})[id] || 0;
                  const done = secs >= (threshold as number);

                  return (
                    <button
                      key={id}
                      onClick={() => {
                        const tech = TECHNIQUES.find((t) => t.id === id);
                        if (tech) changeTechnique(tech);
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/60 hover:bg-slate-800 transition-all group text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-6 h-6 rounded-full ${done ? 'bg-teal-500 text-black' : 'bg-slate-800 text-slate-500'
                            } flex items-center justify-center text-xs font-mono font-bold shrink-0`}
                        >
                          {done ? '✓' : index + 1}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-200 group-hover:text-white">
                            {item.label}
                          </div>
                          <div className="text-xs text-slate-500 group-hover:text-slate-300">
                            {item.purpose}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        <span className="text-[10px] font-mono text-teal-400 border border-teal-900/40 px-2 py-0.5 rounded bg-teal-900/10 whitespace-nowrap">
                          {item.dose}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Today: {Math.round(secs / 60)}m
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conditional */}
            <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-4 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-slate-600" />
                Conditional Add-ons
              </h4>
              <div className="space-y-2">
                {[
                  { id: 'box', label: 'Box Breathing', dose: '2 min', condition: 'Calm focus' },
                  { id: 'bhramari', label: 'Bhramari', dose: '1–2 min', condition: 'Vagus vibration' },
                  { id: 'voo', label: 'Voo Chanting', dose: '1–1.5 min', condition: 'Emotional grounding' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const tech = TECHNIQUES.find((t) => t.id === item.id);
                      if (tech) changeTechnique(tech);
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/70 hover:border-indigo-500/60 hover:bg-slate-800 transition-all group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full border border-slate-700 text-slate-500 flex items-center justify-center text-[10px] font-mono shrink-0">
                        +
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-200 group-hover:text-white">
                          {item.label}
                        </div>
                        <div className="text-xs text-indigo-300">
                          {item.condition}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 border border-slate-800 px-2 py-0.5 rounded ml-2 whitespace-nowrap">
                      {item.dose}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
