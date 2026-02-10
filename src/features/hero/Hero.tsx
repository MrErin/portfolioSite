const Hero = () => {
  return (
    <section
      aria-label="Hero Section"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-abyss via-void to-deep"
    >
      <div className="text-center">
        <h1 className="font-display text-gold text-5xl md:text-7xl lg:text-8xl mb-4">Portfolio</h1>
        <div
          className="h-px w-24 bg-gradient-to-r from-transparent via-gold-dark to-transparent mx-auto mb-4"
          aria-hidden="true"
        />
        <p className="font-body text-text-secondary text-xl tracking-wide">
          Falling down the rabbit hole...
        </p>
      </div>
    </section>
  );
};

export default Hero;
