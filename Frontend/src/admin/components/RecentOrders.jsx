import { ShoppingBag } from "lucide-react";

export default function RecentOrders({ orders = [] }) {
  return (
    <section
      className="
        overflow-hidden
        rounded-[24px]
        border border-black/[0.08]
        bg-white
        shadow-[0_8px_30px_rgba(0,0,0,0.04)]
      "
    >
      {/* Header */}
      <div
        className="
          flex
          flex-col
          gap-3
          border-b border-black/[0.07]
          px-5 py-5
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:px-6
        "
      >
        <div>
          <p className="text-[9px] uppercase tracking-[0.25em] text-gray-400">
            Store activity
          </p>

          <h2 className="mt-1 text-lg font-medium">Recent Orders</h2>
        </div>

        <a
          href="/admin/orders"
          className="text-xs font-medium text-gray-500 transition hover:text-black"
        >
          View all →
        </a>
      </div>

      {/* Orders */}
      {orders.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-black/[0.06] bg-[#faf9f7]">
                <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-gray-400">
                  Order
                </th>

                <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-gray-400">
                  Customer
                </th>

                <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-gray-400">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-gray-400">
                  Total
                </th>

                <th className="px-6 py-4 text-left text-[9px] uppercase tracking-[0.18em] text-gray-400">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-black/[0.05] transition hover:bg-[#faf9f7] last:border-0"
                >
                  <td className="px-6 py-5 text-sm font-medium">#{order.id}</td>

                  <td className="px-6 py-5">
                    <p className="text-sm">{order.customer || "Guest"}</p>

                    {order.email && (
                      <p className="mt-1 text-xs text-gray-400">
                        {order.email}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex rounded-full bg-[#f3f1ed] px-3 py-1.5 text-[10px] font-medium">
                      {order.status || "Pending"}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm">
                    ₹{Number(order.total || 0).toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-5 text-xs text-gray-400">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString("en-IN")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="px-6 py-16 text-center">
          <div
            className="
              mx-auto flex h-14 w-14
              items-center justify-center
              rounded-full
              bg-[#f5f2ee]
            "
          >
            <ShoppingBag
              size={22}
              strokeWidth={1.3}
              className="text-gray-500"
            />
          </div>

          <h3 className="mt-5 text-sm font-medium">No orders yet</h3>

          <p className="mt-2 text-xs text-gray-400">
            New customer orders will appear here.
          </p>
        </div>
      )}
    </section>
  );
}
