import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Download,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email) return;

    console.log("Newsletter email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-[#171313] text-white">
      {/* Newsletter / App Section */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            {/* Newsletter */}
            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-[#d9b58c]">
                Stay Connected
              </p>

              <h2 className="font-serif text-3xl sm:text-4xl">
                Get the Glow – Exclusive Access Awaits
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/65">
                SUBSCRIBE TO OUR EMAILER AND GET 5% OFF YOUR FIRST PURCHASE
              </p>

              <form
                onSubmit={handleSubscribe}
                className="mt-6 flex max-w-xl overflow-hidden border border-white/20"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm outline-none placeholder:text-white/40"
                />

                <button
                  type="submit"
                  className="flex items-center gap-2 bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-[#d9b58c]"
                >
                  Subscribe
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>

            {/* App */}
            <div className="lg:justify-self-end">
              <div className="border border-white/10 bg-white/[0.03] p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d9b58c] text-black">
                    <Download size={21} />
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Download Our App</h3>

                    <p className="mt-2 text-sm leading-6 text-white/60">
                      Download Our App For Exclusive Collection, Offers &
                      Discounts
                    </p>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <button className="border border-white/20 px-4 py-2 text-xs transition hover:bg-white hover:text-black">
                        Google Play
                      </button>

                      <button className="border border-white/20 px-4 py-2 text-xs transition hover:bg-white hover:text-black">
                        App Store
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Explore */}
          <FooterColumn
            title="Explore"
            links={[
              ["About Estele", "/about"],
              ["Privacy Policy", "/privacy-policy"],
              ["FAQ", "/faq"],
              ["Franchise", "/franchise"],
              ["Sitemap", "/sitemap"],
              ["Blogs", "/blogs"],
            ]}
          />

          {/* Know Your Jewellery */}
          <FooterColumn
            title="Know Your Jewellery"
            links={[
              ["Rose Collection", "/collections/rose-collection"],
              ["Earring", "/collections/earrings"],
              ["Maang Tika", "/collections/maang-tikka"],
              ["Crystal Blooms", "/collections/crystal-blooms"],
            ]}
          />

          {/* Customer Service */}
          <FooterColumn
            title="Customer Service"
            links={[
              ["Find your order", "/track-order"],
              ["Return & Exchange Policy", "/returns"],
              ["Shipping & Delivery", "/shipping"],
              ["Track Order", "/track-order"],
              ["Contact Us", "/contact"],
              ["Store Locator", "/store-locator"],
            ]}
          />

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9b58c]">
              Contact Us
            </h3>

            <div className="mt-6 space-y-5 text-sm text-white/65">
              <div className="flex gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-[#d9b58c]" />

                <p className="leading-6">
                  Estele Accessories Pvt. Ltd.
                  <br />
                  9-47, Keshav Nagar,
                  <br />
                  West Hanuman Nagar,
                  <br />
                  Boduppal, Hyderabad,
                  <br />
                  Telangana 500092
                </p>
              </div>

              <a
                href="tel:+918247476318"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <Phone size={17} className="text-[#d9b58c]" />
                +91 8247476318
              </a>

              <a
                href="mailto:info@estele.co"
                className="flex items-center gap-3 transition hover:text-white"
              >
                <Mail size={17} className="text-[#d9b58c]" />
                info@estele.co
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-6 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p className="text-xs tracking-wide text-white/45">
            COPYRIGHT © 2026 - ESTELE
          </p>

          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="text-white/50 transition hover:text-white"
            >
              <FaInstagram size={18} />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="text-white/50 transition hover:text-white"
            >
              <FaFacebookF size={18} />
            </a>

            <a
              href="#"
              aria-label="YouTube"
              className="text-white/50 transition hover:text-white"
            >
              <FaYoutube size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }) => {
  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#d9b58c]">
        {title}
      </h3>

      <ul className="mt-6 space-y-3">
        {links.map(([label, href]) => (
          <li key={label}>
            <a
              href={href}
              className="group inline-flex items-center text-sm text-white/60 transition hover:text-white"
            >
              <span>{label}</span>

              <ArrowRight
                size={13}
                className="ml-2 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Footer;
