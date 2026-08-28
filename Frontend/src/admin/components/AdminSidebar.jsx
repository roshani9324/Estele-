import {
  LayoutDashboard,
  Package,
  Layers3,
  FolderKanban,
  ShoppingBag,
  Users,
  Star,
  FileText,
  LogOut,
  X,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin/dashboard",
  },
  {
    label: "Products",
    icon: Package,
    path: "/admin/products",
  },
  {
    label: "Categories",
    icon: Layers3,
    path: "/admin/categories",
  },
  {
    label: "Collections",
    icon: FolderKanban,
    path: "/admin/collections",
  },
  {
    label: "Orders",
    icon: ShoppingBag,
    path: "/admin/orders",
  },
  {
    label: "Customers",
    icon: Users,
    path: "/admin/customers",
  },
  {
    label: "Reviews",
    icon: Star,
    path: "/admin/reviews",
  },
  {
    label: "Blogs",
    icon: FileText,
    path: "/admin/blogs",
  },
];

function handleLogout() {
  localStorage.removeItem("admin_token");
  window.location.href = "/admin/login";
}

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="mb-10 flex items-start justify-between">
        <a href="/admin/dashboard">
          <div className="font-serif text-[26px] tracking-[0.22em]">
            ESTE<span className="tracking-normal">L</span>E
          </div>

          <p className="mt-1 text-[9px] uppercase tracking-[0.28em] text-gray-400">
            Admin Studio
          </p>
        </a>

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen(false)}
          className="rounded-full p-2 hover:bg-gray-100 lg:hidden"
          aria-label="Close menu"
        >
          <X size={19} strokeWidth={1.5} />
        </button>
      </div>

      {/* Navigation */}
      <div>
        <p className="mb-3 px-3 text-[9px] uppercase tracking-[0.25em] text-gray-400">
          Management
        </p>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = window.location.pathname === item.path;

            return (
              <a
                key={item.label}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  group flex items-center justify-between
                  rounded-xl px-3.5 py-3
                  text-sm
                  transition-all duration-300
                  ${
                    active
                      ? "bg-[#111] text-white shadow-lg"
                      : "text-gray-600 hover:bg-[#f5f2ee] hover:text-[#111]"
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} strokeWidth={1.5} />

                  <span>{item.label}</span>
                </span>

                <ChevronRight
                  size={14}
                  className={`
                    transition-transform duration-300
                    ${
                      active
                        ? "opacity-100"
                        : "opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
                    }
                  `}
                />
              </a>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="mt-auto pt-8">
        <div className="mb-5 rounded-2xl bg-[#f5f2ee] p-4">
          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400">
            Estele Store
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-600">
            Manage your store from one place.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="
            flex w-full items-center gap-3
            rounded-xl px-3.5 py-3
            text-sm text-gray-500
            transition-all
            hover:bg-red-50
            hover:text-red-600
          "
        >
          <LogOut size={18} strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className="
          hidden
          w-[270px]
          shrink-0
          border-r border-black/[0.07]
          bg-white
          lg:flex
          lg:flex-col
        "
      >
        <div className="sticky top-0 flex h-screen flex-col p-6">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setMobileOpen(false)}
          />

          <aside
            className="
              relative
              flex h-full
              w-[290px]
              max-w-[85vw]
              flex-col
              bg-white
              p-6
              shadow-2xl
            "
          >
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
