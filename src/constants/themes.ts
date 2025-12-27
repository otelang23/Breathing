export const THEMES = {
    midnight: { id: 'midnight', label: 'Midnight', color: '#6366f1' },
    ocean: { id: 'ocean', label: 'Ocean', color: '#06b6d4' },
    forest: { id: 'forest', label: 'Forest', color: '#22c55e' },
    fire: { id: 'fire', label: 'Fire', color: '#ef4444' },
    sunset: { id: 'sunset', label: 'Sunset', color: '#ec4899' },
    lavender: { id: 'lavender', label: 'Lavender', color: '#c084fc' },
    charcoal: { id: 'charcoal', label: 'Charcoal', color: '#94a3b8' },
    aurora: { id: 'aurora', label: 'Aurora', color: '#2dd4bf' },
    gold: { id: 'gold', label: 'Gold', color: '#fbbf24' },
    arctic: { id: 'arctic', label: 'Arctic', color: '#bae6fd' },
    nebula: { id: 'nebula', label: 'Nebula', color: '#d946ef' },
    earth: { id: 'earth', label: 'Earth', color: '#a16207' },
    zen: { id: 'zen', label: 'Zen', color: '#84cc16' },
    plasma: { id: 'plasma', label: 'Plasma', color: '#22d3ee' },
    void: { id: 'void', label: 'Void', color: '#525252' },
} as const;

// 15 Custom Gradients for AuroraBackground
export const GRADIENTS: Record<string, string[]> = {
    midnight: ['#4f46e5', '#9333ea'], // Indigo/Purple
    ocean: ['#0ea5e9', '#2dd4bf'],   // Sky/Teal
    forest: ['#16a34a', '#a3e635'],  // Green/Lime
    fire: ['#dc2626', '#f59e0b'],    // Red/Amber
    sunset: ['#db2777', '#f97316'],  // Pink/Orange
    lavender: ['#7e22ce', '#c084fc'], // Purple/Lavender
    charcoal: ['#475569', '#94a3b8'], // Slate
    aurora: ['#0d9488', '#8b5cf6'],   // Teal/Violet
    gold: ['#d97706', '#fcd34d'],     // Amber/Gold
    arctic: ['#0284c7', '#e0f2fe'],   // Light Blue/White
    nebula: ['#c026d3', '#4f46e5'],   // Fuchsia/Indigo
    earth: ['#854d0e', '#a16207'],    // Brown
    zen: ['#3f6212', '#bef264'],      // Dark Green/Light Lime
    plasma: ['#ef4444', '#06b6d4'],   // Red/Cyan (Cyberpunk)
    void: ['#171717', '#404040'],     // Black/Dark Grey
};
