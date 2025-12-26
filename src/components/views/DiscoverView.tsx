import { FilterButton } from '../ui/FilterButton';
import { TechniqueList } from '../features/TechniqueList';
import { FILTERS } from '../../data/filters';
import { PRESETS } from '../../data/presets';
import { InfoModal } from '../modals/InfoModal';
import { useState } from 'react';
import { Info } from 'lucide-react';

export const DiscoverView = ({
    filter,
    setFilter,
    techniques,
    dailyLog,
    onSelectTech,
    activePresetId,
    onRunPreset
}: any) => {
    const [showInfo, setShowInfo] = useState(false);
    const selectedFilterLabel = FILTERS.find((f) => f.id === filter)?.label || 'PAS Score';

    return (
        <div className="flex-1 w-full flex flex-col pt-4 pb-24 px-4 overflow-y-auto custom-scrollbar">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Discover</h1>
                    <p className="text-xs text-text-muted mt-0.5 uppercase tracking-wider">Find your rhythm</p>
                </div>
                <button onClick={() => setShowInfo(true)} className="p-2 rounded-full hover:bg-white/10">
                    <Info className="w-5 h-5 text-white/60" />
                </button>
            </div>

            {/* Filter Bar */}
            <div className="w-full mb-6 overflow-x-auto no-scrollbar pb-2">
                <div className="flex gap-2 min-w-max">
                    {FILTERS.map((f) => (
                        <FilterButton
                            key={f.id}
                            active={filter === f.id}
                            label={f.label}
                            icon={f.icon}
                            onClick={() => setFilter(f.id)}
                        />
                    ))}
                </div>
            </div>

            {/* Presets Carousel */}
            <section className="mb-8">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Quick Presets</h3>
                <div className="flex overflow-x-auto gap-3 pb-4 no-scrollbar -mx-4 px-4 snap-x">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.id}
                            onClick={() => onRunPreset(preset.id)}
                            className={`snap-start min-w-[140px] flex flex-col p-3 rounded-2xl border transition-all ${activePresetId === preset.id
                                    ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10'
                                    : 'bg-surface/60 border-white/5'
                                }`}
                        >
                            <div className={`self-start p-2 rounded-xl mb-2 ${activePresetId === preset.id ? 'bg-primary text-slate-900' : 'bg-white/5 text-white'
                                }`}>
                                <preset.icon className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-sm text-left leading-tight">{preset.label}</span>
                            <span className="text-[10px] text-text-muted text-left mt-1 line-clamp-1 opacity-70">
                                {preset.description}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Technique Grid */}
            <section>
                <div className="flex justify-between items-baseline mb-3">
                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Techniques</h3>
                    <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-white/40">
                        {techniques.length} Available
                    </span>
                </div>

                {/* Reusing existing TechniqueList but limiting height not needed here */}
                <div className="w-full">
                    <TechniqueList
                        techniques={techniques}
                        selectedId={null} // Don't highlight selection here for cleaner browse feel
                        filterId={filter}
                        dailyLog={dailyLog}
                        onSelect={onSelectTech}
                    />
                </div>
            </section>

            {showInfo && <InfoModal techniques={techniques} filterId={filter} filterLabel={selectedFilterLabel} onClose={() => setShowInfo(false)} />}
        </div>
    );
};
