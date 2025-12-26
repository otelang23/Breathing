

interface ProgressRingProps {
    radius: number;
    stroke: number;
    progress: number;
    segments?: number[]; // Array of durations relative to total, e.g. [4, 7, 8]
    activeSegmentIndex?: number;
}

export const ProgressRing = ({ radius, stroke, progress, segments, activeSegmentIndex = 0 }: ProgressRingProps) => {
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;

    if (!segments) {
        // Fallback to single continuous ring (Filling)
        const strokeDashoffset = circumference - (progress / 100) * circumference;
        return (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <svg
                    viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                    width="100%"
                    height="100%"
                    className="transform -rotate-90"
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
                        style={{ strokeDashoffset: -strokeDashoffset, transition: 'stroke-dashoffset 0.1s linear' }} // Negative offset to fill
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                        className="opacity-30"
                    />
                </svg>
            </div>
        );
    }

    // Segmented Logic
    const totalDuration = segments.reduce((a, b) => a + b, 0);

    // Pre-calculate rotations
    const { segmentData } = segments.reduce((acc, duration) => {
        const startAngle = acc.currentAngle;
        const newAngle = acc.currentAngle + (duration / totalDuration) * 360;
        acc.segmentData.push({ duration, startAngle });
        acc.currentAngle = newAngle;
        return acc;
    }, { currentAngle: 0, segmentData: [] as { duration: number, startAngle: number }[] });

    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg
                viewBox={`0 0 ${radius * 2} ${radius * 2}`}
                width="100%"
                height="100%"
                className="transform -rotate-90"
            >
                {segmentData.map((seg, i) => {
                    const segmentPercentage = seg.duration / totalDuration;
                    const segmentLength = circumference * segmentPercentage;
                    const gap = 4; // Gap between segments
                    const segmentVisibleLength = Math.max(0, segmentLength - gap);
                    const dashArray = `${segmentVisibleLength} ${circumference - segmentVisibleLength}`;

                    const rotation = seg.startAngle;

                    // For the active segment, we show progress
                    const isActive = i === activeSegmentIndex;
                    const isPast = i < activeSegmentIndex;

                    // FILLING LOGIC:
                    // Active: Fills from 0 to segmentVisibleLength based on progress
                    // Past: Fully filled
                    // Future: Empty

                    const currentVisibleLength = isActive
                        ? segmentVisibleLength * (progress / 100)
                        : (isPast ? segmentVisibleLength : 0);

                    const activeDashArray = `${currentVisibleLength} ${circumference - currentVisibleLength}`;

                    return (
                        <g key={i} style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%' }}>
                            {/* Background Track of Segment (Ghost) */}
                            <circle
                                stroke="rgba(255,255,255,0.1)"
                                fill="transparent"
                                strokeWidth={stroke}
                                strokeDasharray={dashArray}
                                strokeDashoffset={0}
                                strokeLinecap="round"
                                r={normalizedRadius}
                                cx={radius}
                                cy={radius}
                            />

                            {/* Active/Past Fill Layer */}
                            {(isActive || isPast) && (
                                <circle
                                    stroke="white"
                                    fill="transparent"
                                    strokeWidth={stroke}
                                    strokeDasharray={activeDashArray}  // Controls the visible filled length
                                    strokeDashoffset={0}               // Anchored at start
                                    strokeLinecap="round"
                                    r={normalizedRadius}
                                    cx={radius}
                                    cy={radius}
                                    className="opacity-100"
                                />
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};
