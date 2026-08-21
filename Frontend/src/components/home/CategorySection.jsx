const CategorySection = ({ categories = [] }) => {
  return (
    <section className="bg-white py-16 md:py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-[#8a8a8a]">
            Explore
          </p>

          <h2 className="font-serif text-3xl font-normal tracking-wide text-[#111] sm:text-4xl md:text-[42px]">
            Shop by Category
          </h2>

          <div className="mx-auto mt-5 h-px w-10 bg-[#111]" />
        </div>

        {/* Categories */}
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-6">
            {categories.map((category) => (
              <a
                key={category.id}
                href={category.slug ? `/collections/${category.slug}` : "#"}
                className="group block"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-[#f7f7f7]">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name || "Estele category"}
                      loading="lazy"
                      className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-700
                        ease-out
                        group-hover:scale-[1.04]
                      "
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                        {category.name}
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/5" />

                  {/* Explore */}
                  <div className="absolute bottom-4 left-1/2 w-[calc(100%-32px)] -translate-x-1/2 translate-y-3 bg-white px-3 py-3 text-center opacity-0 shadow-sm transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-[#111]">
                      Explore
                    </span>
                  </div>
                </div>

                {/* Category Name */}
                <div className="pt-4 text-center">
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.13em] text-[#222] transition-colors duration-300 group-hover:text-[#a27645] sm:text-xs">
                    {category.name}
                  </h3>

                  {category.products_count !== undefined && (
                    <p className="mt-1.5 text-[10px] text-gray-400">
                      {category.products_count} Products
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-400">No categories available.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
