import heroSilhouetteUrl from '@/assets/herosilhouette.svg';
import { ParticleField } from '@/components/core/ParticleField';
import { useWhimsy } from '@/components/whimsy/WhimsyContext';

const Hero = () => {
  const { config } = useWhimsy();

  return (
    <section
      aria-label="Hero Section"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-abyss via-void to-deep"
    >
      <img
        src={heroSilhouetteUrl}
        alt=""
        aria-hidden="true"
        className={`absolute bottom-0 left-0 w-full h-auto pointer-events-none select-none transition-opacity duration-300 ${config.boringImages ? 'opacity-0' : 'opacity-100'}`}
        draggable="false"
      />
      <ParticleField />
      <div className="text-center px-4">
        <h1 className="font-display text-gold text-4xl sm:text-5xl md:text-7xl lg:text-8xl mb-4">
          Portfolio
        </h1>
        <div
          className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-gold-dark to-transparent mx-auto mb-4"
          aria-hidden="true"
        />
        <p className="font-body text-text-secondary text-base sm:text-lg md:text-xl tracking-wide">
          Falling down the rabbit hole...
        </p>
      </div>
    </section>
  );
};

export { Hero };
