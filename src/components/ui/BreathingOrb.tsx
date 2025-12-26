import { ProgressRing } from './ProgressRing';

export const BreathingOrb = ({
    scale,
    color,
    isActive,
    action,
    segments,
    currentStepIndex,
}: {
    scale: number;
    color: string;
    isActive: boolean;
    action: string;
    duration: number;
    progress: number;
    segments?: number[];
    currentStepIndex?: number;
}) => (
    <div className="relative flex items-center justify-center w-72 h-72 md:w-80 md:h-80">
        {isActive && <ProgressRing radius={160} stroke={2} progress={progress} segments={segments} activeSegmentIndex={currentStepIndex} />}

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
