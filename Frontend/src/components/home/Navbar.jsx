import { useState } from "react";
import {
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  MapPin,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const menuItems = [
  {
    label: "HASLI COLLECTION",
    href: "/collections/hasli-collection",
  },
  {
    label: "CRYSTAL BLOOMS",
    href: "/collections/crystal-blooms",
  },
  {
    label: "NEW ARRIVALS",
    href: "/collections/new-arrivals",
  },
  {
    label: "SITARA COLLECTION",
    href: "/collections/sitara",
  },
  {
    label: "WEDDING SEASON",
    href: "/collections/wedding-season",
  },
  {
    label: "ROSE COLLECTION",
    href: "/collections/rose-collection",
  },
  {
    label: "NECKLACES",
    href: "/collections/necklace-festive",
  },
  {
    label: "CATEGORIES",
    href: "/collections",
    dropdown: true,
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();

    const query = searchValue.trim();

    if (!query) return;

    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-white">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="relative flex h-[72px] items-center justify-between">
            {/* ================= MOBILE MENU BUTTON ================= */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex items-center justify-center text-[#111] transition-colors hover:text-[#a27645] lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={23} strokeWidth={1.5} />
            </button>

            {/* ================= LOGO ================= */}
            <a
              href="/"
              aria-label="Estele Home"
              className="
                absolute
                left-1/2
                -translate-x-1/2
                lg:static
                lg:translate-x-0
              "
            >
              <span
                className="
                  font-serif
                  text-[28px]
                  font-medium
                  tracking-[0.22em]
                  text-[#111]
                  sm:text-[31px]
                "
              >
                ESTE<span className="tracking-[0.05em]">L</span>E
              </span>
            </a>

            {/* ================= DESKTOP NAVIGATION ================= */}
            <nav className="hidden flex-1 items-center justify-center lg:flex">
              <div className="flex items-center gap-4 xl:gap-6">
                {menuItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="
                      group
                      flex
                      items-center
                      gap-1
                      whitespace-nowrap
                      text-[9px]
                      font-medium
                      tracking-[0.09em]
                      text-[#222]
                      transition-all
                      duration-300
                      hover:text-[#a27645]
                      xl:text-[10px]
                    "
                  >
                    {item.label}

                    {item.dropdown && (
                      <ChevronDown
                        size={12}
                        strokeWidth={1.5}
                        className="
                          transition-transform
                          duration-300
                          group-hover:rotate-180
                        "
                      />
                    )}
                  </a>
                ))}
              </div>
            </nav>

            {/* ================= RIGHT ACTIONS ================= */}
            <div className="ml-auto flex items-center gap-4 sm:gap-5">
              {/* Search */}
              <button
                type="button"
                onClick={() => setSearchOpen((prev) => !prev)}
                aria-label="Search"
                className="
                  text-[#111]
                  transition-colors
                  duration-300
                  hover:text-[#a27645]
                "
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* Account */}
              <a
                href="/login"
                aria-label="Account"
                className="
                  hidden
                  text-[#111]
                  transition-colors
                  duration-300
                  hover:text-[#a27645]
                  sm:block
                "
              >
                <UserRound size={20} strokeWidth={1.5} />
              </a>

              {/* Wishlist */}
              <a
                href="/a/wishlist"
                aria-label="Wishlist"
                className="
                  hidden
                  text-[#111]
                  transition-colors
                  duration-300
                  hover:text-[#a27645]
                  sm:block
                "
              >
                <Heart size={20} strokeWidth={1.5} />
              </a>

              {/* Cart */}
              <a
                href="/cart"
                aria-label="Cart"
                className="
                  relative
                  text-[#111]
                  transition-colors
                  duration-300
                  hover:text-[#a27645]
                "
              >
                <ShoppingBag size={20} strokeWidth={1.5} />

                <span
                  className="
                    absolute
                    -right-2
                    -top-2
                    flex
                    h-4
                    min-w-4
                    items-center
                    justify-center
                    rounded-full
                    bg-black
                    px-1
                    text-[8px]
                    text-white
                  "
                >
                  0
                </span>
              </a>

              {/* Store Locator */}
              <a
                href="#stores"
                className="
                  hidden
                  items-center
                  gap-1.5
                  text-[10px]
                  font-medium
                  tracking-[0.08em]
                  text-[#111]
                  transition-colors
                  duration-300
                  hover:text-[#a27645]
                  xl:flex
                "
              >
                <MapPin size={18} strokeWidth={1.5} />
                STORE LOCATOR
              </a>
            </div>
          </div>
        </div>

        {/* ================= SEARCH BAR ================= */}
        <div
          className={`
            overflow-hidden
            border-t
            border-black/10
            bg-white
            transition-all
            duration-300
            ${searchOpen ? "max-h-24 opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <form
            onSubmit={handleSearch}
            className="mx-auto flex max-w-2xl items-center px-4 py-4"
          >
            <Search size={18} strokeWidth={1.5} />

            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for products"
              autoFocus={searchOpen}
              className="
                ml-3
                w-full
                bg-transparent
                text-sm
                text-[#111]
                outline-none
                placeholder:text-gray-400
              "
            />

            <button
              type="button"
              onClick={() => {
                setSearchOpen(false);
                setSearchValue("");
              }}
              aria-label="Close search"
              className="
                text-[#111]
                transition-colors
                hover:text-[#a27645]
              "
            >
              <X size={18} strokeWidth={1.5} />
            </button>
          </form>
        </div>
      </header>

      {/* ================= MOBILE DRAWER ================= */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeMobileMenu}
            className="
              absolute
              inset-0
              h-full
              w-full
              cursor-default
              bg-black/40
            "
          />

          {/* Drawer */}
          <aside
            className="
              relative
              flex
              h-full
              w-[86%]
              max-w-[390px]
              flex-col
              overflow-y-auto
              bg-white
              px-6
              py-6
              shadow-2xl
            "
          >
            {/* Drawer Header */}
            <div className="mb-8 flex items-center justify-between">
              <a
                href="/"
                onClick={closeMobileMenu}
                className="
                  font-serif
                  text-2xl
                  tracking-[0.18em]
                  text-[#111]
                "
              >
                ESTE<span className="tracking-normal">L</span>E
              </a>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close menu"
                className="
                  text-[#111]
                  transition-colors
                  hover:text-[#a27645]
                "
              >
                <X size={23} strokeWidth={1.5} />
              </button>
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-black/10
                    py-4
                    text-xs
                    font-medium
                    tracking-[0.1em]
                    text-[#111]
                    transition-colors
                    hover:text-[#a27645]
                  "
                >
                  <span>{item.label}</span>

                  {item.dropdown && <ChevronDown size={15} strokeWidth={1.5} />}
                </a>
              ))}
            </nav>

            {/* Mobile Actions */}
            <div className="mt-8 space-y-5 border-t border-black/10 pt-6">
              {/* Search */}
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  text-left
                  text-sm
                  text-[#111]
                  transition-colors
                  hover:text-[#a27645]
                "
              >
                <Search size={19} strokeWidth={1.5} />
                Search
              </button>

              {/* Account */}
              <a
                href="/login"
                onClick={closeMobileMenu}
                className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-[#111]
                  transition-colors
                  hover:text-[#a27645]
                "
              >
                <UserRound size={19} strokeWidth={1.5} />
                My Account
              </a>

              {/* Wishlist */}
              <a
                href="/a/wishlist"
                onClick={closeMobileMenu}
                className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-[#111]
                  transition-colors
                  hover:text-[#a27645]
                "
              >
                <Heart size={19} strokeWidth={1.5} />
                Wishlist
              </a>

              {/* Cart */}
              <a
                href="/cart"
                onClick={closeMobileMenu}
                className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-[#111]
                  transition-colors
                  hover:text-[#a27645]
                "
              >
                <ShoppingBag size={19} strokeWidth={1.5} />
                Cart
              </a>

              {/* Store Locator */}
              <a
                href="#stores"
                onClick={closeMobileMenu}
                className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-[#111]
                  transition-colors
                  hover:text-[#a27645]
                "
              >
                <MapPin size={19} strokeWidth={1.5} />
                Store Locator
              </a>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
