import { useRef, useEffect } from 'react';

interface ParticleOrbProps {
    isActive: boolean;
    action: 'Inhale' | 'Hold' | 'Exhale' | 'Hold2' | 'Inhale2' | string;
    progress: number; // 0-100
    color: string;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    life: number;
    maxLife: number;
    baseX: number;
    baseY: number;
}

export const ParticleOrb = ({ isActive, action, progress, color }: ParticleOrbProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const reqRef = useRef<number>(0);

    // Extract colors from tailwind class string roughly, or just use white/alpha
    // simplifying to white particles with varying opacity for elegance
    const getColorStyle = () => {
        // We can parse the color prop or just use a dynamic color based on phase
        return 'rgba(255, 255, 255,';
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize handler
        const resize = () => {
            canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const spawnParticles = (count: number, cx: number, cy: number, speedMod: number) => {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 0.5 * speedMod;
                particlesRef.current.push({
                    x: cx,
                    y: cy,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: Math.random() * 2 + 0.5,
                    life: 1.0,
                    maxLife: Math.random() * 60 + 30,
                    baseX: cx,
                    baseY: cy,
                });
            }
        };

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear but maybe keep trails?
            // Optional trails:
            // ctx.fillStyle = 'rgba(0,0,0,0.1)';
            // ctx.fillRect(0,0, canvas.width, canvas.height);

            const cx = canvas.width / 2;
            const cy = canvas.height / 2;

            // Logic based on breathing phase
            let expansion = 0;
            if (action.includes('Inhale')) {
                expansion = 1; // Moving out
            } else if (action === 'Exhale') {
                expansion = -1; // Moving in
            } else {
                expansion = 0; // Floating
            }

            // Spawn particles if active
            if (isActive) {
                if (particlesRef.current.length < 300) {
                    spawnParticles(2, cx, cy, 1);
                }
            }

            // Update & Draw
            particlesRef.current.forEach((p, i) => {
                p.life -= 0.01;

                // Movement logic
                if (expansion === 1) {
                    // Explode outward
                    p.x += p.vx * (1 + (progress / 20));
                    p.y += p.vy * (1 + (progress / 20));
                } else if (expansion === -1) {
                    // Implode or drift back
                    const dx = cx - p.x;
                    const dy = cy - p.y;
                    p.x += dx * 0.02;
                    p.y += dy * 0.02;
                } else {
                    // Hold: Drift slowly
                    p.x += p.vx * 0.2;
                    p.y += p.vy * 0.2;
                }

                // Render
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `${getColorStyle()} ${p.life})`;
                ctx.fill();

                // Reset/Remove
                if (p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
                    particlesRef.current.splice(i, 1);
                }
            });

            reqRef.current = requestAnimationFrame(animate);
        };

        reqRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(reqRef.current);
        };
    }, [isActive, action, progress, color]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0 opacity-60 mix-blend-screen"
        />
    );
};
