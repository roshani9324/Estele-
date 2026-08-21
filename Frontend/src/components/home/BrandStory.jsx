import { ArrowRight, Sparkles } from "lucide-react";

const BrandStory = () => {
  return (
    <section className="relative overflow-hidden bg-[#f7f5f1] py-20 sm:py-24 lg:py-32">
      {/* Decorative background */}
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#b18a58]/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[#d4b98d]/10 blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* ================= TOP LABEL ================= */}

        <div className="mb-6 flex items-center gap-3">
          <span className="h-px w-10 bg-[#b18a58]" />

          <span className="text-[9px] font-medium uppercase tracking-[0.32em] text-[#a0784c]">
            The Estele Story
          </span>
        </div>

        {/* ================= MAIN CONTENT ================= */}

        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Left */}
          <div>
            <h2 className="font-serif text-4xl font-normal leading-[1.15] tracking-wide text-[#171717] sm:text-5xl lg:text-[58px]">
              ESTELE
              <br />
              <span className="italic text-[#a0784c]">
                Sparkle That Stays With You
              </span>
            </h2>

            <div className="mt-7 h-px w-14 bg-[#b18a58]" />

            <p className="mt-7 max-w-lg text-sm font-light leading-7 text-[#666] sm:text-[15px]">
              Estele is an Indian fashion jewellery brand established in 1989,
              bringing together elegance, craftsmanship and quality through
              thoughtfully designed jewellery.
            </p>

            <p className="mt-5 max-w-lg text-sm font-light leading-7 text-[#666] sm:text-[15px]">
              With a strong in-house manufacturing presence in Hyderabad, Estele
              combines India's rich jewellery heritage with contemporary design.
            </p>

            {/* Stats */}
            <div className="mt-9 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 border-t border-[#d8d0c5] pt-7 sm:grid-cols-3">
              <div>
                <p className="font-serif text-2xl text-[#a0784c]">1989</p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#777]">
                  Established
                </p>
              </div>

              <div>
                <p className="font-serif text-2xl text-[#a0784c]">100K+</p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#777]">
                  Designs
                </p>
              </div>

              <div>
                <p className="font-serif text-2xl text-[#a0784c]">95%</p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.18em] text-[#777]">
                  In-house
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            {/* Main Story Card */}
            <div className="relative overflow-hidden border border-[#ded6ca] bg-white p-7 shadow-[0_25px_70px_rgba(70,50,30,0.08)] sm:p-10 lg:p-12">
              {/* Decorative corner */}
              <div className="absolute right-0 top-0 h-20 w-20 border-l border-b border-[#c5a477]/30" />

              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c7a574] bg-[#faf7f1]">
                  <Sparkles
                    size={20}
                    strokeWidth={1.2}
                    className="text-[#a0784c]"
                  />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#a0784c]">
                    Our Philosophy
                  </p>

                  <p className="mt-1 font-serif text-xl text-[#222]">
                    Jewellery With Meaning
                  </p>
                </div>
              </div>

              <p className="text-sm font-light leading-7 text-[#666]">
                Estele's jewellery is designed to bring together the beauty of
                traditional Indian craftsmanship and modern fashion. From
                gold-plated designs to everyday pieces, the focus is on creating
                jewellery that feels elegant, comfortable and made to last.
              </p>

              <div className="my-8 h-px bg-[#e5dfd6]" />

              {/* Highlight points */}
              <div className="space-y-5">
                <div className="flex gap-4">
                  <span className="font-serif text-lg text-[#b18a58]">01</span>

                  <div>
                    <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#222]">
                      24Kt Gold-Plated Jewellery
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#777]">
                      A luxurious gold-plated finish designed to elevate
                      everyday and occasion wear.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="font-serif text-lg text-[#b18a58]">02</span>

                  <div>
                    <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#222]">
                      Designed in Hyderabad
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#777]">
                      Designs inspired by India's jewellery heritage and
                      contemporary fashion.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="font-serif text-lg text-[#b18a58]">03</span>

                  <div>
                    <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#222]">
                      Handcrafted & Skin Friendly
                    </h3>

                    <p className="mt-1 text-xs leading-5 text-[#777]">
                      Carefully crafted jewellery focused on comfort and
                      skin-friendly wear.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                type="button"
                className="group mt-9 flex items-center gap-3 border-b border-[#222] pb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#222] transition-colors hover:border-[#a0784c] hover:text-[#a0784c]"
              >
                Discover Estele
                <ArrowRight
                  size={15}
                  strokeWidth={1.3}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            {/* Floating decorative element */}
            <div className="absolute -bottom-5 -right-3 hidden h-24 w-24 border border-[#c7a574]/30 sm:block" />
          </div>
        </div>

        {/* ================= BOTTOM STATEMENT ================= */}

        <div className="mt-16 flex items-center justify-center gap-4">
          <span className="h-px w-8 bg-[#c6aa82]" />

          <p className="text-center text-[9px] uppercase tracking-[0.28em] text-[#8a7762]">
            Crafted in India · Designed in Hyderabad · Since 1989
          </p>

          <span className="h-px w-8 bg-[#c6aa82]" />
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
