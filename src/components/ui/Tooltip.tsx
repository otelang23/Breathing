import { useState, useRef, useEffect } from 'react';

interface TooltipProps {
    children: React.ReactNode;
    content: string;
    side?: 'right' | 'bottom' | 'top' | 'left';
}

export const Tooltip = ({ children, content, side = 'right' }: TooltipProps) => {
    const [isVisible, setIsVisible] = useState(false);
    const triggerRef = useRef<HTMLDivElement>(null);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            ref={triggerRef}
        >
            {children}

            {isVisible && (
                <div className={`
          absolute z-[100] px-3 py-1.5 
          bg-slate-900/90 text-white text-xs font-medium 
          rounded-lg border border-white/10 shadow-xl backdrop-blur-md
          whitespace-nowrap pointer-events-none
          animate-in fade-in zoom-in-95 duration-200
          ${side === 'right' ? 'left-full ml-3 top-1/2 -translate-y-1/2' : ''}
          ${side === 'bottom' ? 'top-full mt-2 left-1/2 -translate-x-1/2' : ''}
          ${side === 'top' ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' : ''}
          ${side === 'left' ? 'right-full mr-3 top-1/2 -translate-y-1/2' : ''}
        `}>
                    {content}
                    {/* Arrow */}
                    <div className={`
            absolute w-2 h-2 bg-slate-900/90 border-t border-l border-white/10 rotate-45
            ${side === 'right' ? '-left-1 top-1/2 -translate-y-1/2 -translate-x-px border-r-0 border-b-0 border-white/10' : ''}
            ${side === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2' : ''}
            /* Add other sides if needed, mainly right is used for sidebar */
          `} />
                </div>
            )}
        </div>
    );
};
