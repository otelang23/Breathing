
import { X } from 'lucide-react';
import { EVENING_MANDATORY_THRESHOLDS } from '../../data/thresholds';
import { TECHNIQUES } from '../../data/techniques';

export const ProtocolModal = ({
    todayLog,
    onChangeTechnique,
    onClose,
}: {
    todayLog: any;
    onChangeTechnique: (tech: any) => void;
    onClose: () => void;
}) => {
    return (
        <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-md flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="protocol-modal-title">
            <div className="bg-background border border-surface rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[85vh] overflow-y-auto relative">
                <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-primary-dark/30 to-transparent pointer-events-none" />

                <div className="flex justify-between items-start mb-6 relative">
                    <div>
                        <h3 id="protocol-modal-title" className="text-2xl font-bold text-text-main">Evening Protocol</h3>
                        <p className="text-xs text-primary uppercase tracking-widest font-mono mt-1">
                            v85-PNS.0 Daily Recommendation
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full"
                        aria-label="Close Evening Protocol"
                    >
                        <X className="w-5 h-5 text-text-muted" />
                    </button>
                </div>

                {/* Mandatory */}
                <div className="mb-8 relative">
                    <h4 className="flex items-center gap-2 text-sm font-bold text-text-main mb-4 uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
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

                            const secs = (todayLog?.techSeconds || {})[id] || 0;
                            const done = secs >= (threshold as number);

                            return (
                                <button
                                    key={id}
                                    onClick={() => {
                                        const tech = TECHNIQUES.find((t) => t.id === id);
                                        if (tech) onChangeTechnique(tech);
                                    }}
                                    className="w-full flex items-center justify-between p-3 rounded-xl bg-surface/50 border border-surface hover:border-primary/60 hover:bg-surface transition-all group text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-6 h-6 rounded-full ${done ? 'bg-primary text-background' : 'bg-surface text-text-muted'
                                                } flex items-center justify-center text-xs font-mono font-bold shrink-0`}
                                        >
                                            {done ? '✓' : index + 1}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-text-main group-hover:text-white">
                                                {item.label}
                                            </div>
                                            <div className="text-xs text-text-muted group-hover:text-text-main/80">
                                                {item.purpose}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1 ml-2">
                                        <span className="text-[10px] font-mono text-primary border border-primary/40 px-2 py-0.5 rounded bg-primary/10 whitespace-nowrap">
                                            {Math.round(secs)}s / {threshold as number}s
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
