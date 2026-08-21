import { useState } from "react";
import { X } from "lucide-react";

const announcements = [
  "RAKHI's SALE | BUY 2 GET 20% OFF",
  "RAKHI's SALE | BUY 3 GET 30% OFF",
  "Free gift on orders above ₹1,499",
  "Additional 5% off on prepaid orders",
];

export default function AnnouncementBar() {
  const [closed, setClosed] = useState(false);

  if (closed) return null;

  return (
    <div className="relative bg-[#111] text-white">
      <div className="mx-auto flex min-h-[38px] max-w-[1600px] items-center justify-center px-10 text-center">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-[11px] font-medium tracking-[0.12em] sm:text-xs">
          {announcements.map((item, index) => (
            <span key={index} className="whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => setClosed(true)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/70 transition hover:text-white"
        aria-label="Close announcement"
      >
        <X size={16} strokeWidth={1.5} />
      </button>
    </div>
  );
}
