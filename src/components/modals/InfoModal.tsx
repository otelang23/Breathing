
import { X, Zap } from 'lucide-react';
import { getTechniqueIcon } from '../../utils/icons';

import type { Technique } from '../../types';

export const InfoModal = ({
    techniques,
    filterId,
    filterLabel,
    onClose,
}: {
    techniques: Technique[];
    filterId: string;
    filterLabel: string;
    onClose: () => void;
}) => {
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="info-modal-title">
            <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h3 id="info-modal-title" className="text-xl font-bold text-white">Technique Guide</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-widest">
                            Sorted by {filterLabel}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-800 rounded-full"
                        aria-label="Close Technique Guide"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>
                <div className="space-y-6">
                    {techniques.map((tech) => (
                        <div key={tech.id} className="border-b border-slate-800 pb-4 last:border-0">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                                    {getTechniqueIcon(tech.id)}
                                    {tech.name}
                                </h4>
                                <div className="flex gap-2 items-center">
                                    {tech.meta?.[filterId] && (
                                        <span className="text-[10px] text-teal-400">
                                            {tech.meta[filterId]}
                                        </span>
                                    )}
                                    <span className="text-xs font-mono font-bold text-slate-600 bg-slate-950 px-2 py-0.5 rounded">
                                        Rank #{tech.ranks[filterId as keyof typeof tech.ranks]}
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
    );
};
