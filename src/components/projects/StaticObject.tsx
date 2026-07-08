import type { ObjectSlot } from './objectSlots';

interface StaticObjectProps {
  slot: ObjectSlot;
  isGlowing: boolean;
}

/** Static decoration object with no motion overhead — plain img with CSS transform. */
const StaticObject = ({ slot, isGlowing }: StaticObjectProps) => (
  <div
    className="absolute"
    style={{ left: slot.left, top: slot.top, pointerEvents: 'none' as const }}
  >
    <img
      src={slot.src}
      alt=""
      aria-hidden="true"
      draggable="false"
      className={`${slot.size} h-auto falling-object ${isGlowing ? 'falling-object-glow' : ''} select-none`}
      style={{ transform: `rotate(${slot.rotation}deg)`, opacity: 0.2 }}
    />
  </div>
);

export { StaticObject };
