

export const ProgressRing = ({ radius, stroke, progress }: { radius: number; stroke: number; progress: number }) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
                viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                width="100%"
                height="100%"
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
