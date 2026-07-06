import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useWhimsy } from './WhimsyContext';
import type { WhimsyLevel } from './WhimsyContext';

const STOP_NAMES: Record<WhimsyLevel, string> = {
  0: 'Quarterly Review',
  1: 'Sensibly Strange',
  2: 'Curiouser and Curiouser',
};

const COLLAPSE_DELAY_MS = 2000;
const AUTO_COLLAPSE_DELAY_MS = 3000;

const WhimsySlider = () => {
  const { level, setLevel } = useWhimsy();
  const [expanded, setExpanded] = useState(true);
  const collapseTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const scheduleCollapse = useCallback(() => {
    clearTimeout(collapseTimer.current);
    collapseTimer.current = setTimeout(() => setExpanded(false), COLLAPSE_DELAY_MS);
  }, []);

  useEffect(() => {
    collapseTimer.current = setTimeout(() => setExpanded(false), AUTO_COLLAPSE_DELAY_MS);
    return () => clearTimeout(collapseTimer.current);
  }, []);

  const expand = () => {
    clearTimeout(collapseTimer.current);
    setExpanded(true);
  };

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLevel(Number(e.target.value) as WhimsyLevel);
    scheduleCollapse();
  };

  return (
    <div
      data-whimsy={level}
      className={`whimsy-slider z-30${expanded ? '' : ' whimsy-slider--collapsed'}`}
      onPointerDown={expand}
      onPointerUp={scheduleCollapse}
      role="group"
      aria-label="Whimsy controls"
    >
      <p className="whimsy-slider__label">Whimsy</p>

      <input
        type="range"
        className="whimsy-range"
        min={0}
        max={2}
        step={1}
        value={level}
        onChange={handleSliderChange}
        onFocus={expand}
        onBlur={scheduleCollapse}
        aria-label="Whimsy level"
        aria-valuetext={STOP_NAMES[level]}
      />

      <p aria-live="polite" className="whimsy-slider__stop-name">
        {STOP_NAMES[level]}
      </p>
    </div>
  );
};

export { WhimsySlider };
