
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Package,
  Eye,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Truck,
  XCircle,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  IndianRupee,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";

import {
  getOrders,
  getOrder,
  updateOrderStatus,
  updatePaymentStatus,
} from "../services/adminApi";

const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
];

const getOrderStatus = (order) =>
  String(
    order?.status ||
      order?.order_status ||
      "pending"
  ).toLowerCase();

const getPaymentStatus = (order) =>
  String(
    order?.payment_status || "pending"
  ).toLowerCase();

const getCustomer = (order) =>
  order?.user ||
  order?.customer ||
  {};

const getItems = (order) =>
  order?.items ||
  order?.order_items ||
  [];

const getTotal = (order) =>
  Number(
    order?.total ??
      order?.grand_total ??
      order?.amount ??
      0
  );

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatStatus = (value) =>
  String(value || "pending")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );

function OrderStatusBadge({ status }) {
  const normalized = String(
    status || "pending"
  ).toLowerCase();

  const config = {
    pending: {
      icon: Clock3,
      className:
        "border-amber-100 bg-amber-50 text-amber-700",
    },
    processing: {
      icon: Package,
      className:
        "border-blue-100 bg-blue-50 text-blue-700",
    },
    shipped: {
      icon: Truck,
      className:
        "border-violet-100 bg-violet-50 text-violet-700",
    },
    delivered: {
      icon: CheckCircle2,
      className:
        "border-emerald-100 bg-emerald-50 text-emerald-700",
    },
    cancelled: {
      icon: XCircle,
      className:
        "border-red-100 bg-red-50 text-red-700",
    },
  };

  const current =
    config[normalized] || config.pending;

  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${current.className}`}
    >
      <Icon size={12} />
      {formatStatus(normalized)}
    </span>
  );
}

function PaymentStatusBadge({ status }) {
  const normalized = String(
    status || "pending"
  ).toLowerCase();

  const config = {
    paid: "border-emerald-100 bg-emerald-50 text-emerald-700",
    pending:
      "border-amber-100 bg-amber-50 text-amber-700",
    failed:
      "border-red-100 bg-red-50 text-red-700",
    refunded:
      "border-violet-100 bg-violet-50 text-violet-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
        config[normalized] || config.pending
      }`}
    >
      <CreditCard size={12} />
      {formatStatus(normalized)}
    </span>
  );
}

function OrderDetailsModal({
  order,
  onClose,
  onOrderStatusChange,
  onPaymentStatusChange,
  updatingOrder,
  updatingPayment,
}) {
  if (!order) return null;

  const customer = getCustomer(order);
  const items = getItems(order);

  const shippingAddress =
    order?.shipping_address ||
    order?.address ||
    order?.shippingAddress;

  const orderStatus = getOrderStatus(order);
  const paymentStatus = getPaymentStatus(order);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
              Order Details
            </p>

            <h2 className="mt-1 font-serif text-2xl text-[#111]">
              #
              {order.order_number ||
                order.order_no ||
                order.id}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2.5 text-gray-400 transition hover:bg-gray-100 hover:text-black"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          {/* Top information */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-[#faf9f7] p-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                Order Date
              </p>

              <div className="mt-2 flex items-center gap-2 text-sm">
                <CalendarDays
                  size={15}
                  className="text-gray-400"
                />

                {formatDateTime(
                  order.created_at ||
                    order.order_date
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-[#faf9f7] p-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                Order Status
              </p>

              <div className="mt-2">
                <OrderStatusBadge
                  status={orderStatus}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-[#faf9f7] p-4">
              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                Payment
              </p>

              <div className="mt-2">
                <PaymentStatusBadge
                  status={paymentStatus}
                />
              </div>
            </div>
          </div>

          {/* Customer + Shipping */}
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5f2ee]">
                  <User size={15} />
                </div>

                <h3 className="text-sm font-semibold">
                  Customer
                </h3>
              </div>

              <div className="space-y-3 text-sm">
                <p className="font-medium">
                  {customer?.name ||
                    order?.customer_name ||
                    order?.name ||
                    "Guest Customer"}
                </p>

                {(customer?.email ||
                  order?.customer_email ||
                  order?.email) && (
                  <p className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail size={13} />
                    {customer?.email ||
                      order?.customer_email ||
                      order?.email}
                  </p>
                )}

                {(customer?.phone ||
                  order?.customer_phone ||
                  order?.phone) && (
                  <p className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone size={13} />
                    {customer?.phone ||
                      order?.customer_phone ||
                      order?.phone}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 p-5">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#f5f2ee]">
                  <MapPin size={15} />
                </div>

                <h3 className="text-sm font-semibold">
                  Shipping Address
                </h3>
              </div>

              <div className="text-xs leading-5 text-gray-500">
                {typeof shippingAddress ===
                "object"
                  ? (
                      <>
                        {shippingAddress.name && (
                          <p className="font-medium text-gray-700">
                            {
                              shippingAddress.name
                            }
                          </p>
                        )}

                        {shippingAddress.address && (
                          <p>
                            {
                              shippingAddress.address
                            }
                          </p>
                        )}

                        <p>
                          {shippingAddress.city &&
                            `${shippingAddress.city}, `}
                          {shippingAddress.state &&
                            `${shippingAddress.state} `}
                          {shippingAddress.pincode ||
                            shippingAddress.postal_code ||
                            ""}
                        </p>

                        {shippingAddress.country && (
                          <p>
                            {
                              shippingAddress.country
                            }
                          </p>
                        )}
                      </>
                    )
                  : shippingAddress || "—"}
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="mt-5 rounded-2xl border border-gray-100">
            <div className="border-b border-gray-100 px-5 py-4">
              <h3 className="text-sm font-semibold">
                Order Items
              </h3>
            </div>

            {items.length === 0 ? (
              <div className="px-5 py-8 text-center text-xs text-gray-400">
                No item details available.
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {items.map((item, index) => {
                  const product =
                    item?.product || {};

                  const image =
                    product?.image_url ||
                    product?.image ||
                    item?.image ||
                    "";

                  const quantity = Number(
                    item?.quantity || 1
                  );

                  const price = Number(
                    item?.price ??
                      item?.unit_price ??
                      item?.amount ??
                      0
                  );

                  return (
                    <div
                      key={
                        item?.id ||
                        product?.id ||
                        index
                      }
                      className="flex items-center gap-3 px-5 py-4"
                    >
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f5f2ee]">
                        {image ? (
                          <img
                            src={image}
                            alt={
                              product?.name ||
                              item?.name ||
                              "Product"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-gray-400">
                            <Package
                              size={18}
                            />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {product?.name ||
                            item?.name ||
                            "Product"}
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          Qty: {quantity}
                        </p>
                      </div>

                      <p className="text-sm font-medium">
                        {formatCurrency(
                          price * quantity
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="mt-5 rounded-2xl bg-[#111] p-5 text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">
                Order Total
              </span>

              <span className="flex items-center text-xl font-semibold">
                {formatCurrency(
                  getTotal(order)
                )}
              </span>
            </div>
          </div>

          {/* Status controls */}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 p-5">
              <label className="mb-2 block text-[10px] uppercase tracking-wider text-gray-400">
                Update Order Status
              </label>

              <select
                value={orderStatus}
                disabled={updatingOrder}
                onChange={(event) =>
                  onOrderStatusChange(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black disabled:opacity-50"
              >
                {ORDER_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {formatStatus(status)}
                    </option>
                  )
                )}
              </select>

              {updatingOrder && (
                <p className="mt-2 flex items-center gap-2 text-[11px] text-gray-400">
                  <Loader2
                    size={12}
                    className="animate-spin"
                  />
                  Updating...
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-gray-100 p-5">
              <label className="mb-2 block text-[10px] uppercase tracking-wider text-gray-400">
                Update Payment Status
              </label>

              <select
                value={paymentStatus}
                disabled={updatingPayment}
                onChange={(event) =>
                  onPaymentStatusChange(
                    event.target.value
                  )
                }
                className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm outline-none focus:border-black disabled:opacity-50"
              >
                {PAYMENT_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {formatStatus(status)}
                    </option>
                  )
                )}
              </select>

              {updatingPayment && (
                <p className="mt-2 flex items-center gap-2 text-[11px] text-gray-400">
                  <Loader2
                    size={12}
                    className="animate-spin"
                  />
                  Updating...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [toast, setToast] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [paymentFilter, setPaymentFilter] =
    useState("");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [loadingDetails, setLoadingDetails] =
    useState(false);

  const [updatingOrder, setUpdatingOrder] =
    useState(false);

  const [updatingPayment, setUpdatingPayment] =
    useState(false);

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState(null);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await getOrders();

      const data = response?.data;

      if (Array.isArray(data)) {
        setOrders(data);
        setPagination(null);
      } else if (
        Array.isArray(response)
      ) {
        setOrders(response);
        setPagination(null);
      } else if (
        Array.isArray(data?.data)
      ) {
        setOrders(data.data);
        setPagination(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(
      () => setToast(""),
      3000
    );

    return () => clearTimeout(timer);
  }, [toast]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const customer =
        getCustomer(order);

      const orderNumber = String(
        order?.order_number ||
          order?.order_no ||
          order?.id ||
          ""
      ).toLowerCase();

      const customerName =
        String(
          customer?.name ||
            order?.customer_name ||
            order?.name ||
            ""
        ).toLowerCase();

      const customerEmail =
        String(
          customer?.email ||
            order?.customer_email ||
            order?.email ||
            ""
        ).toLowerCase();

      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        orderNumber.includes(
          searchText
        ) ||
        customerName.includes(
          searchText
        ) ||
        customerEmail.includes(
          searchText
        );

      const matchesStatus =
        !statusFilter ||
        getOrderStatus(order) ===
          statusFilter;

      const matchesPayment =
        !paymentFilter ||
        getPaymentStatus(order) ===
          paymentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      );
    });
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
  ]);

  const totalOrders =
    pagination?.total ??
    orders.length;

  const pendingOrders =
    orders.filter(
      (order) =>
        getOrderStatus(order) ===
        "pending"
    ).length;

  const processingOrders =
    orders.filter(
      (order) =>
        getOrderStatus(order) ===
        "processing"
    ).length;

  const deliveredOrders =
    orders.filter(
      (order) =>
        getOrderStatus(order) ===
        "delivered"
    ).length;

  const revenue = orders.reduce(
    (sum, order) =>
      sum + getTotal(order),
    0
  );

  const openOrder = async (order) => {
    try {
      setLoadingDetails(true);
      setError("");

      const response =
        await getOrder(order.id);

      const data =
        response?.data ||
        response ||
        order;

      setSelectedOrder(data);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load order details."
      );
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleOrderStatusChange =
    async (status) => {
      if (!selectedOrder) return;

      try {
        setUpdatingOrder(true);
        setError("");

        await updateOrderStatus(
          selectedOrder.id,
          status
        );

        setSelectedOrder(
          (previous) => ({
            ...previous,
            status,
            order_status: status,
          })
        );

        setOrders((previous) =>
          previous.map((order) =>
            order.id ===
            selectedOrder.id
              ? {
                  ...order,
                  status,
                  order_status: status,
                }
              : order
          )
        );

        setToast(
          "Order status updated successfully."
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to update order status."
        );
      } finally {
        setUpdatingOrder(false);
      }
    };

  const handlePaymentStatusChange =
    async (paymentStatus) => {
      if (!selectedOrder) return;

      try {
        setUpdatingPayment(true);
        setError("");

        await updatePaymentStatus(
          selectedOrder.id,
          paymentStatus
        );

        setSelectedOrder(
          (previous) => ({
            ...previous,
            payment_status:
              paymentStatus,
          })
        );

        setOrders((previous) =>
          previous.map((order) =>
            order.id ===
            selectedOrder.id
              ? {
                  ...order,
                  payment_status:
                    paymentStatus,
                }
              : order
          )
        );

        setToast(
          "Payment status updated successfully."
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to update payment status."
        );
      } finally {
        setUpdatingPayment(false);
      }
    };

  return (
    <div className="min-h-screen bg-[#f8f7f5] text-[#111]">
      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="min-h-screen lg:ml-[270px]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-[#f8f7f5]/90 px-5 py-4 backdrop-blur-xl md:px-8 lg:px-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
              Estele / Admin
            </p>

            <h1 className="mt-1 font-serif text-xl md:text-2xl">
              Orders
            </h1>
          </div>
        </header>

        <div className="px-5 py-6 md:px-8 md:py-8 lg:px-10">
          {/* Intro */}
          <div className="mb-7">
            <h2 className="font-serif text-3xl md:text-4xl">
              Order Management
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Track customer orders, payments
              and fulfilment from one place.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f2ee]">
                <Package size={17} />
              </div>

              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                Total Orders
              </p>

              <p className="mt-1 text-xl font-semibold">
                {totalOrders}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Clock3 size={17} />
              </div>

              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                Pending
              </p>

              <p className="mt-1 text-xl font-semibold">
                {pendingOrders}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Package size={17} />
              </div>

              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                Processing
              </p>

              <p className="mt-1 text-xl font-semibold">
                {processingOrders}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={17} />
              </div>

              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                Delivered
              </p>

              <p className="mt-1 text-xl font-semibold">
                {deliveredOrders}
              </p>
            </div>

            <div className="col-span-2 rounded-2xl border border-gray-100 bg-[#111] p-4 text-white lg:col-span-1">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                <IndianRupee size={17} />
              </div>

              <p className="text-[10px] uppercase tracking-wider text-white/40">
                Order Value
              </p>

              <p className="mt-1 text-lg font-semibold">
                {formatCurrency(revenue)}
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm text-red-700">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0"
              />

              <div className="flex-1">
                <p className="font-medium">
                  Something went wrong
                </p>

                <p className="mt-0.5 text-xs text-red-600">
                  {error}
                </p>
              </div>

              <button
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-700"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
              <div className="relative">
                <Search
                  size={17}
                  strokeWidth={1.5}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(
                      event.target.value
                    );
                    setPage(1);
                  }}
                  placeholder="Search order number or customer..."
                  className="h-11 w-full rounded-xl border border-gray-100 bg-[#faf9f7] pl-10 pr-4 text-sm outline-none focus:border-gray-300 focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(
                    event.target.value
                  );
                  setPage(1);
                }}
                className="h-11 rounded-xl border border-gray-100 bg-[#faf9f7] px-3 text-sm text-gray-600 outline-none focus:border-gray-300"
              >
                <option value="">
                  All Order Status
                </option>

                {ORDER_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {formatStatus(status)}
                    </option>
                  )
                )}
              </select>

              <select
                value={paymentFilter}
                onChange={(event) => {
                  setPaymentFilter(
                    event.target.value
                  );
                  setPage(1);
                }}
                className="h-11 rounded-xl border border-gray-100 bg-[#faf9f7] px-3 text-sm text-gray-600 outline-none focus:border-gray-300"
              >
                <option value="">
                  All Payments
                </option>

                {PAYMENT_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {formatStatus(status)}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Orders */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold">
                  Recent Orders
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  {filteredOrders.length}{" "}
                  orders found
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="text-center">
                  <Loader2
                    size={28}
                    className="mx-auto animate-spin text-gray-400"
                  />

                  <p className="mt-3 text-xs text-gray-400">
                    Loading orders...
                  </p>
                </div>
              </div>
            ) : filteredOrders.length ===
              0 ? (
              <div className="flex min-h-[360px] items-center justify-center px-6">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f2ee] text-gray-400">
                    <Package size={23} />
                  </div>

                  <h3 className="mt-4 font-serif text-xl">
                    No orders found
                  </h3>

                  <p className="mt-2 text-xs text-gray-400">
                    Try changing your search
                    or filters.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-[#fcfbfa]">
                        <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Order
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Customer
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Date
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Total
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Status
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Payment
                        </th>

                        <th className="px-5 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          View
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredOrders.map(
                        (order) => {
                          const customer =
                            getCustomer(
                              order
                            );

                          return (
                            <tr
                              key={
                                order.id
                              }
                              className="border-b border-gray-50 transition hover:bg-[#fcfbfa]"
                            >
                              <td className="px-5 py-4">
                                <p className="text-sm font-semibold">
                                  #
                                  {order.order_number ||
                                    order.order_no ||
                                    order.id}
                                </p>

                                <p className="mt-1 text-[11px] text-gray-400">
                                  {getItems(
                                    order
                                  ).length ||
                                    order.items_count ||
                                    0}{" "}
                                  items
                                </p>
                              </td>

                              <td className="px-4 py-4">
                                <p className="max-w-[180px] truncate text-sm">
                                  {customer?.name ||
                                    order.customer_name ||
                                    order.name ||
                                    "Guest"}
                                </p>

                                <p className="mt-1 max-w-[180px] truncate text-[11px] text-gray-400">
                                  {customer?.email ||
                                    order.customer_email ||
                                    order.email ||
                                    "—"}
                                </p>
                              </td>

                              <td className="px-4 py-4 text-xs text-gray-500">
                                {formatDate(
                                  order.created_at ||
                                    order.order_date
                                )}
                              </td>

                              <td className="px-4 py-4 text-sm font-medium">
                                {formatCurrency(
                                  getTotal(
                                    order
                                  )
                                )}
                              </td>

                              <td className="px-4 py-4">
                                <OrderStatusBadge
                                  status={getOrderStatus(
                                    order
                                  )}
                                />
                              </td>

                              <td className="px-4 py-4">
                                <PaymentStatusBadge
                                  status={getPaymentStatus(
                                    order
                                  )}
                                />
                              </td>

                              <td className="px-5 py-4 text-right">
                                <button
                                  onClick={() =>
                                    openOrder(
                                      order
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#f5f2ee] px-3 py-2 text-xs text-gray-700 transition hover:bg-[#ece8e3]"
                                >
                                  <Eye
                                    size={14}
                                  />
                                  View
                                </button>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="divide-y divide-gray-100 lg:hidden">
                  {filteredOrders.map(
                    (order) => {
                      const customer =
                        getCustomer(
                          order
                        );

                      return (
                        <div
                          key={order.id}
                          className="p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold">
                                #
                                {order.order_number ||
                                  order.order_no ||
                                  order.id}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                {formatDate(
                                  order.created_at ||
                                    order.order_date
                                )}
                              </p>
                            </div>

                            <OrderStatusBadge
                              status={getOrderStatus(
                                order
                              )}
                            />
                          </div>

                          <div className="mt-4 rounded-xl bg-[#faf9f7] p-3">
                            <p className="text-sm font-medium">
                              {customer?.name ||
                                order.customer_name ||
                                order.name ||
                                "Guest Customer"}
                            </p>

                            <p className="mt-1 truncate text-xs text-gray-400">
                              {customer?.email ||
                                order.customer_email ||
                                order.email ||
                                "—"}
                            </p>
                          </div>

                          <div className="mt-4 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] uppercase tracking-wider text-gray-400">
                                Total
                              </p>

                              <p className="mt-1 text-sm font-semibold">
                                {formatCurrency(
                                  getTotal(
                                    order
                                  )
                                )}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <PaymentStatusBadge
                                status={getPaymentStatus(
                                  order
                                )}
                              />

                              <button
                                onClick={() =>
                                  openOrder(
                                    order
                                  )
                                }
                                className="rounded-xl bg-[#111] p-2.5 text-white"
                              >
                                <Eye
                                  size={15}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </>
            )}

            {/* Pagination */}
            {!loading &&
              filteredOrders.length > 0 &&
              pagination?.total && (
                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-4">
                  <p className="text-xs text-gray-400">
                    Page{" "}
                    <span className="font-medium text-gray-600">
                      {pagination.current_page ||
                        page}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-600">
                      {pagination.last_page ||
                        1}
                    </span>
                  </p>

                  <div className="flex gap-2">
                    <button
                      disabled={
                        !pagination.prev_page_url
                      }
                      onClick={() =>
                        setPage(
                          (previous) =>
                            Math.max(
                              1,
                              previous - 1
                            )
                        )
                      }
                      className="rounded-xl border border-gray-200 p-2 text-gray-500 disabled:opacity-30"
                    >
                      <ChevronLeft
                        size={16}
                      />
                    </button>

                    <button
                      disabled={
                        !pagination.next_page_url
                      }
                      onClick={() =>
                        setPage(
                          (previous) =>
                            previous + 1
                        )
                      }
                      className="rounded-xl border border-gray-200 p-2 text-gray-500 disabled:opacity-30"
                    >
                      <ChevronRight
                        size={16}
                      />
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </main>

      {/* Loading details */}
      {loadingDetails && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="rounded-2xl bg-white px-6 py-5 shadow-xl">
            <Loader2
              size={24}
              className="mx-auto animate-spin text-gray-500"
            />

            <p className="mt-2 text-xs text-gray-500">
              Loading order details...
            </p>
          </div>
        </div>
      )}

      {/* Order details */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() =>
          setSelectedOrder(null)
        }
        onOrderStatusChange={
          handleOrderStatusChange
        }
        onPaymentStatusChange={
          handlePaymentStatusChange
        }
        updatingOrder={updatingOrder}
        updatingPayment={updatingPayment}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[120] flex max-w-sm items-center gap-3 rounded-2xl bg-[#111] px-4 py-3.5 text-white shadow-2xl">
          <CheckCircle2 size={18} />

          <div>
            <p className="text-xs font-medium">
              Success
            </p>

            <p className="mt-0.5 text-[11px] text-white/60">
              {toast}
            </p>
          </div>

          <button
            onClick={() => setToast("")}
            className="ml-2 text-white/40 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

