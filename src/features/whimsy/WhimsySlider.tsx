import { useWhimsy } from './WhimsyContext';
import type { WhimsyLevel } from './WhimsyContext';

const STOP_NAMES: Record<WhimsyLevel, string> = {
  0: 'Curiouser and Curiouser',
  1: 'Sensibly Strange',
  2: 'Quarterly Review',
};

const WhimsySlider = () => {
  const { level, setLevel } = useWhimsy();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLevel(Number(e.target.value) as WhimsyLevel);
  };

  return (
    <div
      className="fixed top-4 left-4 z-30"
      style={{
        padding: 'max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-left))',
      }}
    >
      <p className="font-body text-xs text-text-muted mb-1">Whimsy</p>

      <div className="whimsy-pulse rounded-full px-3 py-2">
        <input
          type="range"
          className="whimsy-range"
          min={0}
          max={2}
          step={1}
          value={level}
          onChange={handleChange}
          aria-label="Whimsy level"
          aria-valuetext={STOP_NAMES[level]}
          list="whimsy-ticks"
        />

        <datalist id="whimsy-ticks">
          <option value={0} />
          <option value={1} />
          <option value={2} />
        </datalist>

        <div className="flex justify-between px-1 mt-1" aria-hidden="true">
          <span className="h-px w-2 bg-text-dim" />
          <span className="h-px w-2 bg-text-dim" />
          <span className="h-px w-2 bg-text-dim" />
        </div>
      </div>

      <p aria-live="polite" className="font-body text-xs text-text-secondary mt-1">
        {STOP_NAMES[level]}
      </p>
    </div>
  );
};

export { WhimsySlider };
