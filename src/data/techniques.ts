import type { Technique } from '../types';

export const TECHNIQUES: Technique[] = [
    {
        id: 'sigh',
        name: 'Physiological Sigh',
        tagline: 'Panic Button',
        description: 'Double inhale followed by a long exhale. Fastest biological release of stress.',
        tip: 'Focus on the second inhale—it expands collapsed air sacs. Make the exhale audible.',
        strength: 'Fastest stress relief, reduces HR in ~20 sec',
        pas: 9.8,
        audioProfile: { baseFreq: 146.83, binauralBeat: 6 }, // Theta
        categories: ['panic', 'stress', 'balance'],
        optimalDuration: '1-3 minutes',
        science: {
            mechanism: 'Re-inflates collapsed alveoli (air sacs) in the lungs and maximizes CO2 offload, triggering an immediate parasympathetic reset.',
            benefits: ['Instant Calm', 'Lung Expansion', 'CO2 Offload']
        },
        transition: {
            nextTechId: 'box',
            condition: 'Once calm (2-3 mins)'
        },
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
            { action: 'Inhale', duration: 2500, scale: 1.3, text: 'Double Inhale', vibration: [80] },
            { action: 'Inhale2', duration: 1000, scale: 1.5, text: 'Top Up', vibration: [40] },
            { action: 'Exhale', duration: 6000, scale: 1.0, text: 'Long Sigh', vibration: [120] },
        ],
        entrainmentFreq: 0,
    },
    {
        id: 'coherent',
        name: 'Coherent Breathing',
        tagline: 'HRV Builder',
        description: '5.5s rhythm to synchronize heart, lungs, and blood pressure (Resonance).',
        tip: 'Breathe softly and silently through the nose. Smooth transitions—no pauses.',
        strength: 'Strongest HRV builder, REM stabilizer, best for IQ recovery',
        pas: 9.5,
        audioProfile: { baseFreq: 110, binauralBeat: 10 }, // Alpha
        categories: ['hrv', 'balance', 'focus', 'stress'],
        optimalDuration: '10-20 minutes',
        science: {
            mechanism: 'Aligns respiratory rate with the baroreflex resonance frequency (~0.1Hz), maximizing Heart Rate Variability and emotional regulation.',
            benefits: ['Maximized HRV', 'Emotional Stability', 'Blood Pressure Reg.']
        },
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
        entrainmentFreq: 10, // Alpha
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
        tip: 'Keep the tongue behind upper front teeth. Make a whoosh sound on exhale.',
        strength: 'Best sleep onset tool, sedative effect',
        pas: 8.9,
        audioProfile: { baseFreq: 65.41, binauralBeat: 2 }, // Delta
        categories: ['sleep', 'stress'],
        optimalDuration: '4-8 cycles (approx 2 mins)',
        science: {
            mechanism: 'The long hold allows for increased oxygen absorption, while the extended exhale signals a profound safety state to the vagus nerve.',
            benefits: ['Sedation', 'Sleep Onset', 'Anxiety Redux']
        },
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
        entrainmentFreq: 3, // Delta
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
        tip: 'Place a hand on your belly. Feel it rise on inhale, fall on exhale. Chest stays still.',
        strength: 'Deep vagal stimulation, deep sleep enhancer',
        pas: 7.6,
        audioProfile: { baseFreq: 65.41, binauralBeat: 2 }, // Delta
        categories: ['hrv', 'sleep', 'stress', 'balance'],
        optimalDuration: '5-10 minutes',
        science: {
            mechanism: 'Mechanically stimulates the vagus nerve endings in the lower lungs and diaphragm, promoting a "Rest and Digest" state.',
            benefits: ['Lower Cortisol', 'Core Stability', 'Digestion']
        },
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
        entrainmentFreq: 3, // Delta
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
        tip: 'Visualize drawing a side of a box with each step. Keep the breath smooth.',
        strength: 'Cognitive control, interview calmness',
        pas: 8.2,
        audioProfile: { baseFreq: 110, binauralBeat: 10 }, // Alpha
        categories: ['hrv', 'focus', 'interview', 'stress'],
        optimalDuration: '5-20 minutes',
        science: {
            mechanism: 'The breath holds build CO2 tolerance (hypercapnic training), which calms the amygdala while keeping the cortex alert and focused.',
            benefits: ['Laser Focus', 'Panic Control', 'Alertness']
        },
        transition: {
            nextTechId: 'coherent',
            condition: 'After acute stress passes'
        },
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
        entrainmentFreq: 10, // Alpha
        color: 'from-blue-400 via-blue-500 to-blue-600',
        steps: [
            { action: 'Inhale', duration: 4000, scale: 1.5, text: 'Inhale (4s)', vibration: [40] },
            { action: 'Hold', duration: 4000, scale: 1.5, text: 'Hold (4s)', vibration: [20] },
            { action: 'Exhale', duration: 4000, scale: 1.0, text: 'Exhale (4s)', vibration: [40] },
            { action: 'Hold', duration: 4000, scale: 1.0, text: 'Hold (4s)', vibration: [20] },
        ],
    },
    {
        id: 'tranquility',
        name: 'Tranquility',
        tagline: 'Gentle Sleep',
        description: 'Gentle 3-4-6 rhythm to aid sleep onset without air hunger.',
        tip: 'Allow the longer exhale to soften your muscles. Let gravity do the work.',
        strength: 'Sleep onset, anxiety reduction',
        pas: 8.6,
        audioProfile: { baseFreq: 65.41, binauralBeat: 2 }, // Delta
        categories: ['sleep', 'stress'],
        optimalDuration: '5-10 minutes',
        science: {
            mechanism: 'A gentler variation of 4-7-8, reducing air hunger while still prioritizing a longer exhalation to activate parasympathetic pathways.',
            benefits: ['Sleep Onset', 'Mild Sedation', 'Comfort']
        },
        ranks: {
            pas: 3,
            stress: 4,
            speed: 7,
            hrv: 5,
            sleep: 2,
            deepSleep: 2,
            discreet: 5,
        },
        meta: {
            sleep: '⭐⭐⭐⭐ Onset',
            deepSleep: 'Gentle',
            stress: 'Anxiety',
        },
        entrainmentFreq: 3, // Delta
        color: 'from-indigo-300 via-indigo-400 to-violet-400',
        steps: [
            { action: 'Inhale', duration: 3000, scale: 1.4, text: 'Inhale (3s)', vibration: [30] },
            { action: 'Hold', duration: 4000, scale: 1.4, text: 'Hold (4s)', vibration: [20] },
            { action: 'Exhale', duration: 6000, scale: 1.0, text: 'Exhale (6s)', vibration: [40] },
        ],
    },
    {
        id: 'bhramari',
        name: 'Bhramari',
        tagline: 'Humming Bee',
        description: 'Vibrational stimulation of the vagus nerve in the larynx via humming.',
        tip: 'Close your eyes. Gently block your ears with thumbs. Hum like a bee on exhale.',
        strength: 'Emotional calming, vagus vibration, improves REM',
        pas: 7.8,
        audioProfile: { baseFreq: 110, binauralBeat: 10 }, // Alpha
        categories: ['stress', 'sleep', 'balance'],
        optimalDuration: '5-10 mins',
        science: {
            mechanism: 'The humming sound creates vibration in the larynx and skull, physically stimulating the vagus nerve and producing nitric oxide in sinuses.',
            benefits: ['Nitric Oxide', 'Vagus Stim', 'Silence Mind']
        },
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
        entrainmentFreq: 0
    },
    {
        id: 'voo',
        name: 'Voo Chanting',
        tagline: 'Vagal Tone',
        description: 'Low pitched "Voo" sound vibrates the diaphragm and chest.',
        tip: 'Direct the "Voo" sound down to your belly. Feel the vibration in your gut.',
        strength: 'Grounding, emotional regulation',
        pas: 7.8,
        audioProfile: { baseFreq: 110, binauralBeat: 10 }, // Alpha
        categories: ['panic', 'stress'],
        optimalDuration: '1-3 mins',
        science: {
            mechanism: 'Popularized by Dr. Peter Levine for trauma release. The low frequency sound vibrates the viscera, signaling safety to the deep brain.',
            benefits: ['Trauma Release', 'Grounding', 'Safety']
        },
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
            sleep: 'Grounding',
            stress: 'Trauma',
            speed: 'Fast',
            deepSleep: 'Grounding'
        },
        entrainmentFreq: 4, // Theta/Grounding
        color: 'from-fuchsia-500 via-pink-600 to-purple-600',
        steps: [
            { action: 'Inhale', duration: 4000, scale: 1.5, text: 'Deep Inhale', vibration: [40] },
            { action: 'Exhale', duration: 10000, scale: 1.0, text: 'Vooooooo...', vibration: [120] },
        ],
    },
    {
        id: 'heart_flow',
        name: 'Heart Flow',
        tagline: 'Vagal Tone 4:6',
        description: 'Inhale for 4s, Exhale for 6s. Optimizes Heart Rate Variability by emphasizing the exhale.',
        tip: 'Make the exhale slightly longer than the inhale to trigger the "rest and digest" signal.',
        strength: 'Vagal tone improvement, emotional balance',
        pas: 9.2,
        audioProfile: { baseFreq: 110, binauralBeat: 10 }, // Alpha
        categories: ['hrv', 'balance', 'stress'],
        optimalDuration: '10-20 mins',
        science: {
            mechanism: 'Extending the exhalation stimulates the vagus nerve (parasympathetic), increasing Heart Rate Variability and calming the nervous system.',
            benefits: ['Increase HRV', 'Calm Nerves', 'Balance']
        },
        ranks: {
            pas: 2,
            stress: 5,
            speed: 6,
            hrv: 1, // Top tier
            sleep: 4,
            deepSleep: 4,
            discreet: 3,
        },
        meta: {
            hrv: '⭐⭐⭐⭐⭐ Elite',
            stress: 'Balance',
            discreet: 'Quiet',
            speed: 'Medium'
        },
        entrainmentFreq: 0.1, // Resonance approx
        color: 'from-pink-400 via-rose-400 to-red-400',
        steps: [
            { action: 'Inhale', duration: 4000, scale: 1.5, text: 'Inhale (4s)', vibration: [40] },
            { action: 'Exhale', duration: 6000, scale: 1.0, text: 'Exhale (6s)', vibration: [40] },
        ],
    },
    {
        id: 'manifestation',
        name: 'Quantum Manifestation',
        tagline: 'Visualise & Attract',
        description: 'Focus your intent on the inhale, express gratitude on the exhale. Coherence meets visualization.',
        tip: 'Inhale: Visualize your desire clearly. Exhale: Feel the emotion of already having it.',
        strength: 'Intention setting, positive emotion, goal alignment',
        pas: 9.0,
        audioProfile: { baseFreq: 146.83, binauralBeat: 6 }, // Theta for subconscious access
        categories: ['manifestation', 'focus', 'balance'],
        optimalDuration: '10-20 mins',
        science: {
            mechanism: 'Combines coherent breathing (heart-brain sync) with emotional visualization, which has been shown to prime the Reticular Activating System (RAS) for goal-relevant opportunities.',
            benefits: ['Reticular Activation', 'Emotional Coherence', 'Positive Priming']
        },
        ranks: {
            pas: 3,
            stress: 5,
            speed: 5,
            hrv: 2,
            sleep: 5,
            deepSleep: 5,
            discreet: 2,
        },
        meta: {
            discreet: 'Quiet',
            hrv: '⭐⭐⭐⭐',
            sleep: 'Visualization',
            stress: 'Positive',
            speed: 'Medium',
            deepSleep: 'Dream Prep'
        },
        entrainmentFreq: 6, // Theta
        color: 'from-amber-400 via-purple-500 to-indigo-600',
        steps: [
            { action: 'Inhale', duration: 5500, scale: 1.5, text: 'Receive (5.5s)', vibration: [40] },
            { action: 'Exhale', duration: 5500, scale: 1.0, text: 'Gratitude (5.5s)', vibration: [40] },
        ],
    }
];
