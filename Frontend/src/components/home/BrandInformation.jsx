import { Gem, MapPin, Sparkles, Award, ShieldCheck } from "lucide-react";

const brandInfo = [
  {
    number: "01",
    icon: Gem,
    title: "24K GOLD-PLATED",
    highlight: "JEWELLERY",
    description:
      "Luxurious 24Kt gold-plated jewellery crafted to bring an elegant gold-like finish to every look.",
  },
  {
    number: "02",
    icon: MapPin,
    title: "DESIGNED IN",
    highlight: "HYDERABAD",
    description:
      "Our designs blend Hyderabad's rich jewellery heritage with contemporary fashion and modern aesthetics.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "HANDCRAFTED",
    highlight: "SKIN FRIENDLY",
    description:
      "Thoughtfully handcrafted pieces designed with comfort, quality and skin-friendly materials in mind.",
  },
  {
    number: "04",
    icon: Award,
    title: "35+ YEARS",
    highlight: "LEGACY",
    description:
      "Since 1989, Estele has built decades of experience around jewellery, craftsmanship and design.",
  },
  {
    number: "05",
    icon: ShieldCheck,
    title: "1 YEAR",
    highlight: "WARRANTY",
    description:
      "A one-year manufacturing warranty reflects Estele's confidence in its craftsmanship and quality.",
  },
];

const BrandInformation = () => {
  return (
    <section className="relative overflow-hidden bg-[#f8f6f2] py-20 sm:py-24 lg:py-32">
      {/* ================= BACKGROUND EFFECTS ================= */}

      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#c9a46c]/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 bottom-10 h-80 w-80 rounded-full bg-[#d9c2a0]/10 blur-3xl" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-3xl" />

      {/* ================= CONTENT ================= */}

      <div className="relative mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-12">
        {/* ================= HEADING ================= */}

        <div className="mx-auto mb-14 max-w-3xl text-center sm:mb-16 lg:mb-20">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#b18a58]" />

            <span className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#9a7548]">
              The Estele Promise
            </span>

            <span className="h-px w-8 bg-[#b18a58]" />
          </div>

          <h2 className="font-serif text-4xl font-normal leading-tight tracking-wide text-[#151515] sm:text-5xl lg:text-[58px]">
            Crafted With
            <span className="ml-2 italic text-[#a47b4b]">Purpose</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-7 text-[#777] sm:text-[15px]">
            Discover what makes every Estele piece special — from thoughtful
            design to craftsmanship built on decades of experience.
          </p>
        </div>

        {/* ================= USP GRID ================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 lg:gap-4">
          {brandInfo.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.number}
                className="
                  group
                  relative
                  min-h-[330px]
                  overflow-hidden
                  rounded-[2px]
                  border
                  border-[#ded7ce]
                  bg-white/70
                  p-7
                  backdrop-blur-sm
                  transition-all
                  duration-500
                  ease-out
                  hover:-translate-y-3
                  hover:border-[#b9996c]
                  hover:bg-white
                  hover:shadow-[0_25px_60px_rgba(65,48,30,0.12)]
                  sm:min-h-[300px]
                  lg:min-h-[365px]
                "
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Decorative Glow */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-40
                    w-40
                    rounded-full
                    bg-[#c5a06c]/10
                    blur-2xl
                    transition-all
                    duration-500
                    group-hover:scale-150
                    group-hover:bg-[#c5a06c]/20
                  "
                />

                {/* Large Background Number */}
                <span
                  className="
                    absolute
                    right-5
                    top-3
                    font-serif
                    text-[72px]
                    font-light
                    leading-none
                    text-[#b79a76]/10
                    transition-all
                    duration-500
                    group-hover:text-[#b79a76]/20
                    group-hover:scale-110
                  "
                >
                  {item.number}
                </span>

                {/* Icon */}
                <div
                  className="
                    relative
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#cbb08a]
                    bg-[#faf7f1]
                    text-[#a47b4b]
                    shadow-[0_8px_25px_rgba(120,90,50,0.08)]
                    transition-all
                    duration-500
                    group-hover:rotate-[-8deg]
                    group-hover:scale-110
                    group-hover:bg-[#a47b4b]
                    group-hover:text-white
                  "
                >
                  <Icon size={23} strokeWidth={1.3} />
                </div>

                {/* Number */}
                <p className="relative mt-8 text-[9px] font-medium tracking-[0.3em] text-[#a47b4b]">
                  {item.number}
                </p>

                {/* Title */}
                <h3 className="relative mt-3 text-[13px] font-medium leading-6 tracking-[0.14em] text-[#1c1c1c]">
                  {item.title}
                  <br />
                  <span className="font-serif text-[18px] font-normal tracking-[0.05em] text-[#a47b4b]">
                    {item.highlight}
                  </span>
                </h3>

                {/* Description */}
                <p className="relative mt-5 text-[11px] font-light leading-6 text-[#777]">
                  {item.description}
                </p>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#a47b4b] transition-all duration-500 group-hover:w-full" />

                {/* Corner Accent */}
                <div className="absolute bottom-5 right-5 h-5 w-5 border-b border-r border-[#cbb08a]/40 opacity-0 transition-all duration-500 group-hover:opacity-100" />
              </div>
            );
          })}
        </div>

        {/* ================= BOTTOM BRAND STATEMENT ================= */}

        <div className="mt-14 flex flex-col items-center justify-center gap-4 text-center sm:mt-16 sm:flex-row">
          <span className="h-px w-12 bg-[#c7b39a]" />

          <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#8a7762]">
            ESTELE · SINCE 1989 · MADE WITH CARE
          </p>

          <span className="h-px w-12 bg-[#c7b39a]" />
        </div>
      </div>
    </section>
  );
};

export default BrandInformation;
