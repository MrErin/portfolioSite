import heroSilhouetteUrl from '@/assets/herosilhouette.svg';
import { ParticleField } from '@/components/core/ParticleField';
import { useWhimsy } from '@/components/whimsy/WhimsyContext';

const Hero = () => {
  const { config } = useWhimsy();

  return (
    <section
      aria-label="Hero Section"
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-abyss via-void to-deep ${config.boringImages ? 'min-h-[30vh]' : 'min-h-screen'}`}
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
          {config.boringImages ? 'Portfolio' : "Rabbit Holes I've Fallen Down"}
        </h1>
        {!config.boringImages && (
          <p className="font-display text-gold text-xs sm:text-sm opacity-50 tracking-widest mt-6">
            (scroll down)
          </p>
        )}
      </div>
    </section>
  );
};

export { Hero };
