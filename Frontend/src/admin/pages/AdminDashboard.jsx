import { useEffect, useState } from "react";
import { Menu, Bell, ArrowUpRight, RefreshCw, AlertCircle } from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";
import StatCard from "../components/StatCard";
import RecentOrders from "../components/RecentOrders";

import { getAdminDashboard } from "../services/adminApi";

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getAdminDashboard();

      if (!response?.success) {
        throw new Error(response?.message || "Unable to load dashboard data.");
      }

      setDashboard(response.data);
    } catch (err) {
      console.error("Admin dashboard error:", err);

      setError(err.message || "Something went wrong while loading dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = dashboard?.stats || {};

  return (
    <div className="min-h-screen bg-[#f7f6f3] text-[#111]">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main */}
        <main className="min-w-0 flex-1">
          {/* Top Header */}
          <header
            className="
              sticky top-0 z-40
              border-b border-black/[0.07]
              bg-white/90
              backdrop-blur-xl
            "
          >
            <div
              className="
                flex h-[72px]
                items-center justify-between
                px-4
                sm:px-6
                lg:px-8
                xl:px-10
              "
            >
              <div className="flex items-center gap-3">
                {/* Mobile menu */}
                <button
                  onClick={() => setMobileOpen(true)}
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-full
                    border border-black/10
                    bg-white
                    lg:hidden
                  "
                  aria-label="Open admin menu"
                >
                  <Menu size={19} strokeWidth={1.5} />
                </button>

                <div>
                  <p className="hidden text-[9px] uppercase tracking-[0.25em] text-gray-400 sm:block">
                    Estele Admin Studio
                  </p>

                  <h1 className="text-lg font-medium sm:mt-1 sm:text-xl">
                    Dashboard
                  </h1>
                </div>
              </div>

              {/* Header actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => loadDashboard(true)}
                  disabled={refreshing}
                  className="
                    flex h-10
                    items-center gap-2
                    rounded-full
                    border border-black/10
                    bg-white
                    px-3
                    text-xs
                    transition
                    hover:bg-black
                    hover:text-white
                    disabled:opacity-50
                    sm:px-4
                  "
                >
                  <RefreshCw
                    size={15}
                    className={refreshing ? "animate-spin" : ""}
                  />

                  <span className="hidden sm:inline">Refresh</span>
                </button>

                <button
                  className="
                    relative
                    flex h-10 w-10
                    items-center justify-center
                    rounded-full
                    border border-black/10
                    bg-white
                    transition
                    hover:bg-black
                    hover:text-white
                  "
                  aria-label="Notifications"
                >
                  <Bell size={17} strokeWidth={1.5} />

                  <span
                    className="
                      absolute right-2 top-2
                      h-1.5 w-1.5
                      rounded-full
                      bg-black
                    "
                  />
                </button>

                {/* Admin avatar */}
                <div
                  className="
                    hidden h-10 w-10
                    items-center justify-center
                    rounded-full
                    bg-[#111]
                    text-xs
                    font-medium
                    text-white
                    sm:flex
                  "
                >
                  A
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div
            className="
              mx-auto
              w-full
              max-w-[1600px]
              p-4
              sm:p-6
              lg:p-8
              xl:p-10
            "
          >
            {/* Hero welcome */}
            <section
              className="
                relative
                mb-7
                overflow-hidden
                rounded-[28px]
                bg-[#111]
                px-6 py-7
                text-white
                shadow-xl
                sm:px-8
                sm:py-9
                lg:px-10
              "
            >
              {/* Decorative shapes */}
              <div
                className="
                  absolute -right-16 -top-24
                  h-64 w-64
                  rounded-full
                  border border-white/10
                "
              />

              <div
                className="
                  absolute -bottom-32 right-24
                  h-64 w-64
                  rounded-full
                  border border-white/[0.06]
                "
              />

              <div className="relative max-w-2xl">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/50">
                  Welcome back
                </p>

                <h2
                  className="
                    mt-3
                    text-2xl
                    font-light
                    tracking-tight
                    sm:text-3xl
                    lg:text-4xl
                  "
                >
                  Manage your Estele store.
                </h2>

                <p className="mt-3 max-w-xl text-xs leading-6 text-white/60 sm:text-sm">
                  Keep track of your products, categories, collections and store
                  activity from one place.
                </p>
              </div>

              <div
                className="
                  absolute
                  bottom-6
                  right-6
                  hidden
                  h-12 w-12
                  items-center justify-center
                  rounded-full
                  border border-white/10
                  sm:flex
                "
              >
                <ArrowUpRight size={19} strokeWidth={1.3} />
              </div>
            </section>

            {/* Error */}
            {error && (
              <div
                className="
                  mb-7
                  flex items-start gap-3
                  rounded-2xl
                  border border-red-200
                  bg-red-50
                  p-4
                  text-red-700
                "
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />

                <div>
                  <p className="text-sm font-medium">
                    Unable to load dashboard
                  </p>

                  <p className="mt-1 text-xs">{error}</p>

                  <button
                    onClick={() => loadDashboard()}
                    className="mt-3 text-xs font-medium underline"
                  >
                    Try again
                  </button>
                </div>
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {Array.from({ length: 7 }).map((_, index) => (
                  <div
                    key={index}
                    className="
                        h-[190px]
                        animate-pulse
                        rounded-[24px]
                        bg-white
                      "
                  />
                ))}
              </div>
            ) : (
              <>
                {/* Stats heading */}
                <div className="mb-5">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">
                    Store overview
                  </p>

                  <h2 className="mt-1 text-xl font-medium">Your numbers</h2>
                </div>

                {/* Stats */}
                <section
                  className="
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                    xl:grid-cols-4
                  "
                >
                  <StatCard
                    type="products"
                    title="Products"
                    value={stats.products ?? 0}
                    description="Total products"
                  />

                  <StatCard
                    type="categories"
                    title="Categories"
                    value={stats.categories ?? 0}
                    description="Product categories"
                  />

                  <StatCard
                    type="collections"
                    title="Collections"
                    value={stats.collections ?? 0}
                    description="Product collections"
                  />

                  <StatCard
                    type="orders"
                    title="Orders"
                    value={stats.orders ?? 0}
                    description="Total orders"
                  />

                  <StatCard
                    type="customers"
                    title="Customers"
                    value={stats.customers ?? 0}
                    description="Registered customers"
                  />

                  <StatCard
                    type="reviews"
                    title="Reviews"
                    value={stats.reviews ?? 0}
                    description="Customer reviews"
                  />

                  <StatCard
                    type="blogs"
                    title="Blogs"
                    value={stats.blogs ?? 0}
                    description="Blog posts"
                  />
                </section>

                {/* Recent orders */}
                <div className="mt-8">
                  <RecentOrders orders={dashboard?.recent_orders || []} />
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
