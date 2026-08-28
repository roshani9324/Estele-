import {
  ArrowUpRight,
  Package,
  Layers3,
  FolderKanban,
  ShoppingBag,
  Users,
  Star,
  FileText,
} from "lucide-react";

const icons = {
  products: Package,
  categories: Layers3,
  collections: FolderKanban,
  orders: ShoppingBag,
  customers: Users,
  reviews: Star,
  blogs: FileText,
};

export default function StatCard({ type, title, value, description }) {
  const Icon = icons[type] || Package;

  return (
    <div
      className="
        group relative overflow-hidden
        rounded-[24px]
        border border-black/[0.08]
        bg-white
        p-5 sm:p-6
        shadow-[0_8px_30px_rgba(0,0,0,0.04)]
        transition-all duration-500
        hover:-translate-y-1
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.09)]
      "
    >
      {/* Decorative circle */}
      <div
        className="
          pointer-events-none
          absolute -right-10 -top-10
          h-28 w-28
          rounded-full
          bg-[#f4eee7]
          transition-transform duration-500
          group-hover:scale-150
        "
      />

      <div className="relative">
        {/* Top */}
        <div className="flex items-start justify-between">
          <div
            className="
              flex h-11 w-11
              items-center justify-center
              rounded-2xl
              bg-[#111]
              text-white
              shadow-lg
            "
          >
            <Icon size={19} strokeWidth={1.5} />
          </div>

          <div
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-full
              border border-black/10
              transition-all duration-300
              group-hover:bg-black
              group-hover:text-white
            "
          >
            <ArrowUpRight size={15} strokeWidth={1.5} />
          </div>
        </div>

        {/* Text */}
        <div className="mt-7">
          <p
            className="
              text-[10px]
              font-medium
              uppercase
              tracking-[0.2em]
              text-gray-500
            "
          >
            {title}
          </p>

          <h3
            className="
              mt-2
              text-3xl
              font-light
              tracking-tight
              text-[#111]
              sm:text-4xl
            "
          >
            {value}
          </h3>

          <p className="mt-2 text-xs text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
