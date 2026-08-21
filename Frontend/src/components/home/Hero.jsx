import useHome from "../../hooks/useHome";

const Hero = () => {
  const { homeData, loading, error } = useHome();

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-white">
        <p className="text-sm tracking-[0.15em] text-gray-500">
          Loading Estele...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center bg-white">
        <p className="text-sm text-red-500">Unable to load Estele.</p>
      </section>
    );
  }

  const hero = homeData?.hero;

  if (!hero) {
    return null;
  }

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <picture>
        {hero.mobile_image && (
          <source media="(max-width: 767px)" srcSet={hero.mobile_image} />
        )}

        <img
          src={hero.image}
          alt={hero.title || "Estele"}
          className="
            block
            h-auto
            min-h-[420px]
            w-full
            object-cover
            object-center
            md:min-h-0
          "
        />
      </picture>

      {(hero.title || hero.subtitle || hero.button_text) && (
        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            px-6
            text-center
          "
        >
          <div className="max-w-xl">
            {hero.title && (
              <h1
                className="
                  font-serif
                  text-3xl
                  font-medium
                  tracking-wide
                  text-white
                  sm:text-4xl
                  md:text-5xl
                "
              >
                {hero.title}
              </h1>
            )}

            {hero.subtitle && (
              <p
                className="
                  mt-3
                  text-sm
                  tracking-[0.12em]
                  text-white
                  sm:text-base
                "
              >
                {hero.subtitle}
              </p>
            )}

            {hero.button_text && (
              <a
                href={hero.button_url || "#"}
                className="
                  mt-6
                  inline-flex
                  items-center
                  justify-center
                  border
                  border-white
                  px-7
                  py-3
                  text-[10px]
                  font-medium
                  tracking-[0.18em]
                  text-white
                  transition-all
                  duration-300
                  hover:bg-white
                  hover:text-black
                "
              >
                {hero.button_text}
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
