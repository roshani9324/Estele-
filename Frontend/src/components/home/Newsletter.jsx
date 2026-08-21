import { useState } from "react";
import { ArrowRight, Mail, Sparkles, Check } from "lucide-react";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setSubmitted(true);
    setEmail("");
  };

  return (
    <section className="relative overflow-hidden bg-[#151515] py-20 sm:py-24 lg:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-[#b18a58]/10 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 top-0 h-96 w-96 rounded-full bg-[#d1b27f]/10 blur-3xl" />

      {/* Decorative circles */}
      <div className="pointer-events-none absolute left-[8%] top-[20%] h-20 w-20 rounded-full border border-[#b18a58]/20" />

      <div className="pointer-events-none absolute bottom-[15%] right-[10%] h-32 w-32 rounded-full border border-[#b18a58]/10" />

      <div className="relative mx-auto max-w-[1100px] px-5 text-center sm:px-8">

        {/* Small Label */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-[#b18a58]" />

          <Sparkles
            size={14}
            strokeWidth={1.2}
            className="text-[#c4a06b]"
          />

          <span className="text-[9px] font-medium uppercase tracking-[0.35em] text-[#c4a06b]">
            Exclusive Access
          </span>

          <Sparkles
            size={14}
            strokeWidth={1.2}
            className="text-[#c4a06b]"
          />

          <span className="h-px w-8 bg-[#b18a58]" />
        </div>

        {/* Heading */}
        <h2 className="font-serif text-4xl font-normal tracking-wide text-white sm:text-5xl md:text-6xl">
          Get the Glow
        </h2>

        <p className="mt-2 font-serif text-2xl italic text-[#c4a06b] sm:text-3xl">
          Exclusive Access Awaits
        </p>

        {/* Description */}
        <p className="mx-auto mt-6 max-w-xl text-[11px] leading-6 tracking-[0.08em] text-white/55 sm:text-xs">
          SUBSCRIBE TO OUR EMAILER AND GET 5% OFF
          <br className="sm:hidden" />
          {" "}YOUR FIRST PURCHASE
        </p>

        {/* Newsletter Form */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            className="
              mx-auto
              mt-10
              flex
              max-w-xl
              flex-col
              gap-3
              sm:flex-row
              sm:gap-0
            "
          >
            <div
              className="
                flex
                flex-1
                items-center
                border
                border-white/20
                bg-white/[0.04]
                px-4
                transition-all
                duration-300
                focus-within:border-[#c4a06b]
                focus-within:bg-white/[0.07]
              "
            >
              <Mail
                size={17}
                strokeWidth={1.3}
                className="mr-3 shrink-0 text-[#c4a06b]"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="
                  h-14
                  w-full
                  bg-transparent
                  text-sm
                  text-white
                  outline-none
                  placeholder:text-white/35
                "
              />
            </div>

            <button
              type="submit"
              className="
                group
                flex
                h-14
                items-center
                justify-center
                gap-3
                bg-[#c4a06b]
                px-7
                text-[10px]
                font-medium
                uppercase
                tracking-[0.2em]
                text-[#151515]
                transition-all
                duration-300
                hover:bg-[#d6b77f]
                sm:min-w-[160px]
              "
            >
              Subscribe

              <ArrowRight
                size={16}
                strokeWidth={1.4}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </form>
        ) : (
          <div
            className="
              mx-auto
              mt-10
              flex
              max-w-xl
              items-center
              justify-center
              gap-3
              border
              border-[#c4a06b]/40
              bg-[#c4a06b]/10
              px-6
              py-5
              text-sm
              text-white
            "
          >
            <Check
              size={18}
              className="text-[#c4a06b]"
              strokeWidth={1.5}
            />

            <span>
              Thank you for subscribing to Estele.
            </span>
          </div>
        )}

        {/* Bottom note */}
        <p className="mt-5 text-[9px] tracking-[0.12em] text-white/30">
          By subscribing, you agree to receive updates from Estele.
        </p>

        {/* Decorative bottom */}
        <div className="mx-auto mt-14 h-px w-16 bg-[#b18a58]/50" />
      </div>
    </section>
  );
};

export default Newsletter;