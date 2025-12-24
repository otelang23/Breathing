import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
    children: React.ReactNode;
    content: string;
    side?: 'right' | 'bottom' | 'top' | 'left';
}

export const Tooltip = ({ children, content, side = 'right' }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef<HTMLDivElement>(null);

    // Update coordinates when visible
    useEffect(() => {
        if (isVisible && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            let top = 0;
            let left = 0;

            // Simple calculation based on side
            // Note: Fixed positioning is relative to viewport
            if (side === 'right') {
                top = rect.top + rect.height / 2;
                left = rect.right + 12; // 12px gap
            } else if (side === 'bottom') {
                top = rect.bottom + 8;
                left = rect.left + rect.width / 2;
            } else if (side === 'top') {
                top = rect.top - 8;
                left = rect.left + rect.width / 2;
            } else if (side === 'left') {
                top = rect.top + rect.height / 2;
                left = rect.left - 12;
            }

            setCoords({ top, left });
        }
    }, [isVisible, side]);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            ref={triggerRef}
        >
            {children}

            {/* Render Tooltip Fixed if Visible */}
            {isVisible && (
                <div
                    className="fixed z-[100] px-3 py-1.5 bg-slate-900/90 text-white text-xs font-medium rounded-lg border border-white/10 shadow-xl backdrop-blur-md whitespace-nowrap pointer-events-none animate-in fade-in zoom-in-95 duration-200"
                    style={{
                        top: coords.top,
                        left: coords.left,
                        transform: side === 'bottom' || side === 'top' ? 'translateX(-50%)' : 'translateY(-50%)'
                    }}
                >
                    {content}

                    {/* Arrow (Visual only, tricky with fixed, maybe skip or approximate) */}
                    {/* We used a simple arrow before. With fixed, we can just keep it simple without arrow for robustness, 
                        or add it back carefully. Let's keep it simple for now to avoid alignment headaches. */}
                </div>
            )}
        </div>
    );
};
