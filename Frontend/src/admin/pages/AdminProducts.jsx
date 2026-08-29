
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Image as ImageIcon,
  Layers3,
  FolderKanban,
  AlertCircle,
  CheckCircle2,
  Loader2,
  MoreVertical,
  Eye,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";

import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getCollections,
} from "../services/adminApi";

const emptyForm = {
  category_id: "",
  name: "",
  slug: "",
  sku: "",
  description: "",
  price: "",
  mrp: "",
  stock: "",
  status: "active",
  images: [],
  variants: [],
  collection_ids: [],
};

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "draft", label: "Draft" },
];

function ProductImage({ product }) {
  const image =
    product?.images?.[0]?.image_url ||
    product?.image_url ||
    product?.image ||
    "";

  if (!image) {
    return (
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f5f2ee] text-gray-400">
        <ImageIcon size={21} strokeWidth={1.4} />
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={product?.name || "Product"}
      className="h-14 w-14 rounded-xl object-cover bg-[#f5f2ee]"
      onError={(e) => {
        e.currentTarget.style.display = "none";
        e.currentTarget.nextElementSibling?.classList.remove("hidden");
      }}
    />
  );
}

function StatusBadge({ status }) {
  const normalized = String(status || "").toLowerCase();

  const styles =
    normalized === "active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : normalized === "draft"
      ? "bg-amber-50 text-amber-700 border-amber-100"
      : "bg-gray-100 text-gray-600 border-gray-200";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${styles}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status || "Unknown"}
    </span>
  );
}

function StockBadge({ stock }) {
  const value = Number(stock || 0);

  if (value === 0) {
    return (
      <span className="text-xs font-medium text-red-600">
        Out of stock
      </span>
    );
  }

  if (value <= 5) {
    return (
      <span className="text-xs font-medium text-amber-600">
        {value} left
      </span>
    );
  }

  return (
    <span className="text-xs font-medium text-gray-700">
      {value} units
    </span>
  );
}

function ProductModal({
  open,
  onClose,
  form,
  setForm,
  categories,
  collections,
  editing,
  saving,
  onSubmit,
}) {
  if (!open) return null;

  const addImage = () => {
    setForm((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          image_url: "",
          sort_order: prev.images.length,
        },
      ],
    }));
  };

  const removeImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateImage = (index, value) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((image, i) =>
        i === index
          ? {
              ...image,
              image_url: value,
            }
          : image
      ),
    }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          name: "",
          sku: "",
          price: "",
          stock: 0,
        },
      ],
    }));
  };

  const removeVariant = (index) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const updateVariant = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant
      ),
    }));
  };

  const toggleCollection = (id) => {
    setForm((prev) => ({
      ...prev,
      collection_ids: prev.collection_ids.includes(Number(id))
        ? prev.collection_ids.filter(
            (collectionId) => collectionId !== Number(id)
          )
        : [...prev.collection_ids, Number(id)],
    }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-gray-400">
              Product Studio
            </p>
            <h2 className="font-serif text-2xl text-[#111]">
              {editing ? "Edit Product" : "Add New Product"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto px-6 py-6">
          <form
            id="product-form"
            onSubmit={onSubmit}
            className="space-y-7"
          >
            {/* Basic Information */}
            <section>
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#111]">
                  Basic Information
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Enter the main details of your jewellery product.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="admin-label">
                    Product Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                        slug:
                          prev.slug ||
                          e.target.value
                            .toLowerCase()
                            .trim()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, ""),
                      }))
                    }
                    className="admin-input"
                    placeholder="e.g. Gold Plated Pearl Necklace"
                  />
                </div>

                <div>
                  <label className="admin-label">
                    SKU *
                  </label>
                  <input
                    required
                    value={form.sku}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        sku: e.target.value,
                      }))
                    }
                    className="admin-input"
                    placeholder="EST-NEC-001"
                  />
                </div>

                <div>
                  <label className="admin-label">
                    Slug
                  </label>
                  <input
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        slug: e.target.value,
                      }))
                    }
                    className="admin-input"
                    placeholder="gold-plated-pearl-necklace"
                  />
                </div>

                <div>
                  <label className="admin-label">
                    Category *
                  </label>

                  <select
                    required
                    value={form.category_id}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        category_id: e.target.value,
                      }))
                    }
                    className="admin-input"
                  >
                    <option value="">Select category</option>

                    {categories.map((category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="admin-label">
                    Status *
                  </label>

                  <select
                    required
                    value={form.status}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="admin-input"
                  >
                    {statusOptions.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="admin-label">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="admin-input resize-none"
                    placeholder="Describe the product..."
                  />
                </div>
              </div>
            </section>

            {/* Pricing & Inventory */}
            <section className="border-t border-gray-100 pt-7">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#111]">
                  Pricing & Inventory
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Manage product pricing and available stock.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="admin-label">
                    Selling Price *
                  </label>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      ₹
                    </span>

                    <input
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      className="admin-input pl-8"
                      placeholder="2499"
                    />
                  </div>
                </div>

                <div>
                  <label className="admin-label">
                    MRP
                  </label>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.mrp}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          mrp: e.target.value,
                        }))
                      }
                      className="admin-input pl-8"
                      placeholder="2999"
                    />
                  </div>
                </div>

                <div>
                  <label className="admin-label">
                    Stock *
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        stock: e.target.value,
                      }))
                    }
                    className="admin-input"
                    placeholder="50"
                  />
                </div>
              </div>
            </section>

            {/* Images */}
            <section className="border-t border-gray-100 pt-7">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#111]">
                    Product Images
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    Add image URLs for this product.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addImage}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium transition hover:border-black hover:bg-black hover:text-white"
                >
                  <Plus size={15} />
                  Add Image
                </button>
              </div>

              <div className="space-y-3">
                {form.images.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-[#faf9f7] px-5 py-8 text-center">
                    <ImageIcon
                      size={28}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    <p className="text-xs text-gray-400">
                      No product images added yet.
                    </p>
                  </div>
                )}

                {form.images.map((image, index) => (
                  <div
                    key={index}
                    className="flex gap-3 rounded-2xl border border-gray-100 bg-[#faf9f7] p-3"
                  >
                    {image.image_url ? (
                      <img
                        src={image.image_url}
                        alt=""
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                        onError={(e) => {
                          e.currentTarget.style.opacity = "0.25";
                        }}
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-300">
                        <ImageIcon size={20} />
                      </div>
                    )}

                    <input
                      value={image.image_url}
                      onChange={(e) =>
                        updateImage(index, e.target.value)
                      }
                      className="admin-input flex-1"
                      placeholder="https://example.com/product-image.jpg"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="rounded-xl px-3 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Collections */}
            <section className="border-t border-gray-100 pt-7">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-[#111]">
                  Collections
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  Assign this product to one or more collections.
                </p>
              </div>

              {collections.length === 0 ? (
                <div className="rounded-2xl bg-[#faf9f7] p-5 text-xs text-gray-400">
                  No collections available.
                </div>
              ) : (
                <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto rounded-2xl border border-gray-100 bg-[#faf9f7] p-3 md:grid-cols-3">
                  {collections.map((collection) => {
                    const selected = form.collection_ids.includes(
                      Number(collection.id)
                    );

                    return (
                      <button
                        type="button"
                        key={collection.id}
                        onClick={() =>
                          toggleCollection(collection.id)
                        }
                        className={`rounded-xl border px-3 py-2.5 text-left text-xs transition ${
                          selected
                            ? "border-black bg-black text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                        }`}
                      >
                        {collection.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Variants */}
            <section className="border-t border-gray-100 pt-7">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-[#111]">
                    Variants
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    Optional product variants.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addVariant}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3.5 py-2 text-xs font-medium transition hover:border-black hover:bg-black hover:text-white"
                >
                  <Plus size={15} />
                  Add Variant
                </button>
              </div>

              <div className="space-y-3">
                {form.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="grid gap-3 rounded-2xl border border-gray-100 bg-[#faf9f7] p-4 md:grid-cols-4"
                  >
                    <input
                      value={variant.name}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className="admin-input"
                      placeholder="Variant name"
                    />

                    <input
                      value={variant.sku}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "sku",
                          e.target.value
                        )
                      }
                      className="admin-input"
                      placeholder="Variant SKU"
                    />

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "price",
                          e.target.value
                        )
                      }
                      className="admin-input"
                      placeholder="Price"
                    />

                    <div className="flex gap-2">
                      <input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) =>
                          updateVariant(
                            index,
                            "stock",
                            e.target.value
                          )
                        }
                        className="admin-input"
                        placeholder="Stock"
                      />

                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="rounded-xl px-3 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-[#fcfbfa] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl px-5 py-2.5 text-sm text-gray-600 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="product-form"
            disabled={saving}
            className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#111] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                {editing ? "Save Changes" : "Create Product"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ product, onClose, onConfirm, deleting }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <Trash2 size={21} />
        </div>

        <h3 className="font-serif text-2xl text-[#111]">
          Delete product?
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          You are about to delete{" "}
          <span className="font-medium text-gray-800">
            {product.name}
          </span>
          . This action cannot be undone.
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
          >
            {deleting && (
              <Loader2 size={15} className="animate-spin" />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProducts() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [deleteTarget, setDeleteTarget] = useState(null);

  const loadProducts = async (currentPage = page) => {
    try {
      setLoading(true);
      setError("");

      const response = await getProducts({
        search,
        category_id: categoryFilter,
        status: statusFilter,
        page: currentPage,
        per_page: 15,
      });

      const data = response?.data;

      setProducts(data?.data || []);
      setPagination(data || null);
    } catch (err) {
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  const loadFilters = async () => {
    try {
      const [categoryResponse, collectionResponse] =
        await Promise.all([
          getCategories(),
          getCollections(),
        ]);

      const categoryData = categoryResponse?.data;
      const collectionData = collectionResponse?.data;

      setCategories(
        Array.isArray(categoryData)
          ? categoryData
          : categoryData?.data || []
      );

      setCollections(
        Array.isArray(collectionData)
          ? collectionData
          : collectionData?.data || []
      );
    } catch (err) {
      console.error("Unable to load filters:", err);
    }
  };

  useEffect(() => {
    loadFilters();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts(1);
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search, categoryFilter, statusFilter]);

  useEffect(() => {
    if (page !== 1) {
      loadProducts(page);
    }
  }, [page]);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = async (product) => {
    try {
      setError("");

      const response = await getProduct(product.id);
      const data = response?.data || product;

      setEditing(data);

      setForm({
        category_id: data.category_id || data.category?.id || "",
        name: data.name || "",
        slug: data.slug || "",
        sku: data.sku || "",
        description: data.description || "",
        price: data.price ?? "",
        mrp: data.mrp ?? "",
        stock: data.stock ?? "",
        status: data.status || "active",

        images: (data.images || []).map((image, index) => ({
          image_url: image.image_url || "",
          sort_order: image.sort_order ?? index,
        })),

        variants: (data.variants || []).map((variant) => ({
          name: variant.name || "",
          sku: variant.sku || "",
          price: variant.price ?? "",
          stock: variant.stock ?? 0,
        })),

        collection_ids: (data.collections || []).map((collection) =>
          Number(collection.id)
        ),
      });

      setModalOpen(true);
    } catch (err) {
      setError(err.message || "Unable to load product.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        category_id: Number(form.category_id),
        name: form.name.trim(),
        slug: form.slug.trim() || undefined,
        sku: form.sku.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
        mrp: form.mrp === "" ? null : Number(form.mrp),
        stock: Number(form.stock),
        status: form.status,

        images: form.images
          .filter((image) => image.image_url.trim())
          .map((image, index) => ({
            image_url: image.image_url.trim(),
            sort_order: index,
          })),

        variants: form.variants
          .filter((variant) => variant.name.trim())
          .map((variant) => ({
            name: variant.name.trim(),
            sku: variant.sku?.trim() || null,
            price:
              variant.price === ""
                ? null
                : Number(variant.price),
            stock: Number(variant.stock || 0),
          })),

        collection_ids: form.collection_ids.map(Number),
      };

      if (editing) {
        await updateProduct(editing.id, payload);
        setToast("Product updated successfully.");
      } else {
        await createProduct(payload);
        setToast("Product created successfully.");
      }

      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);

      await loadProducts(page);
    } catch (err) {
      setError(err.message || "Unable to save product.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setError("");

      await deleteProduct(deleteTarget.id);

      setDeleteTarget(null);
      setToast("Product deleted successfully.");

      const currentCount = products.length;

      if (currentCount === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await loadProducts(page);
      }
    } catch (err) {
      setError(err.message || "Unable to delete product.");
    } finally {
      setDeleting(false);
    }
  };

  const totalProducts = pagination?.total ?? products.length;

  const activeProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          String(product.status).toLowerCase() === "active"
      ).length,
    [products]
  );

  const lowStockProducts = useMemo(
    () =>
      products.filter(
        (product) => Number(product.stock || 0) > 0 && Number(product.stock || 0) <= 5
      ).length,
    [products]
  );

  const outOfStockProducts = useMemo(
    () =>
      products.filter(
        (product) => Number(product.stock || 0) === 0
      ).length,
    [products]
  );

  return (
    <div className="min-h-screen bg-[#f8f7f5] text-[#111]">
      <style>{`
        .admin-label {
          display: block;
          margin-bottom: 7px;
          font-size: 11px;
          font-weight: 500;
          color: #555;
          letter-spacing: .01em;
        }

        .admin-input {
          width: 100%;
          border: 1px solid #e8e5e1;
          background: white;
          border-radius: 12px;
          padding: 11px 13px;
          font-size: 13px;
          color: #171717;
          outline: none;
          transition: all .2s ease;
        }

        .admin-input:focus {
          border-color: #111;
          box-shadow: 0 0 0 3px rgba(17,17,17,.06);
        }

        .admin-input::placeholder {
          color: #b0aca7;
        }

        .admin-input:disabled {
          background: #f7f6f4;
          cursor: not-allowed;
        }
      `}</style>

      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="min-h-screen lg:ml-[270px]">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-[#f8f7f5]/90 px-5 py-4 backdrop-blur-xl md:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
                Estele / Admin
              </p>
              <h1 className="mt-1 font-serif text-xl md:text-2xl">
                Products
              </h1>
            </div>

            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-[#111] px-4 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-black hover:shadow-lg"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">
                Add Product
              </span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </header>

        <div className="px-5 py-6 md:px-8 md:py-8 lg:px-10">
          {/* Intro */}
          <div className="mb-7">
            <h2 className="font-serif text-3xl md:text-4xl">
              Product Catalogue
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage your jewellery catalogue, pricing, inventory,
              collections and product visibility from one place.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f2ee]">
                <Package size={17} strokeWidth={1.5} />
              </div>
              <p className="text-[11px] uppercase tracking-wider text-gray-400">
                Total
              </p>
              <p className="mt-1 text-xl font-semibold">
                {totalProducts}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 size={17} strokeWidth={1.5} />
              </div>
              <p className="text-[11px] uppercase tracking-wider text-gray-400">
                Active
              </p>
              <p className="mt-1 text-xl font-semibold">
                {activeProducts}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <AlertCircle size={17} strokeWidth={1.5} />
              </div>
              <p className="text-[11px] uppercase tracking-wider text-gray-400">
                Low Stock
              </p>
              <p className="mt-1 text-xl font-semibold">
                {lowStockProducts}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Package size={17} strokeWidth={1.5} />
              </div>
              <p className="text-[11px] uppercase tracking-wider text-gray-400">
                Out of Stock
              </p>
              <p className="mt-1 text-xl font-semibold">
                {outOfStockProducts}
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
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

          {/* Toolbar */}
          <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_190px_160px]">
              <div className="relative">
                <Search
                  size={17}
                  strokeWidth={1.5}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by product name or SKU..."
                  className="h-11 w-full rounded-xl border border-gray-100 bg-[#faf9f7] pl-10 pr-4 text-sm outline-none transition focus:border-gray-300 focus:bg-white"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
                className="h-11 rounded-xl border border-gray-100 bg-[#faf9f7] px-3 text-sm text-gray-600 outline-none focus:border-gray-300"
              >
                <option value="">All Categories</option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="h-11 rounded-xl border border-gray-100 bg-[#faf9f7] px-3 text-sm text-gray-600 outline-none focus:border-gray-300"
              >
                <option value="">All Status</option>

                {statusOptions.map((status) => (
                  <option
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold">
                  All Products
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Showing {products.length} products on this page
                </p>
              </div>

              <div className="hidden items-center gap-2 text-xs text-gray-400 sm:flex">
                <Package size={14} />
                Catalogue
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
                    Loading products...
                  </p>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex min-h-[360px] items-center justify-center px-6">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f2ee] text-gray-400">
                    <Package size={23} strokeWidth={1.4} />
                  </div>

                  <h3 className="mt-4 font-serif text-xl">
                    No products found
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-gray-400">
                    Try changing your search or filters, or create
                    your first product.
                  </p>

                  <button
                    onClick={openCreate}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#111] px-4 py-2.5 text-xs font-medium text-white"
                  >
                    <Plus size={15} />
                    Add Product
                  </button>
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
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Stock
                        </th>
                        <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Status
                        </th>
                        <th className="px-5 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-b border-gray-50 transition hover:bg-[#fcfbfa]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <ProductImage product={product} />

                              <div className="min-w-0">
                                <p className="max-w-[260px] truncate text-sm font-medium text-[#111]">
                                  {product.name}
                                </p>

                                <p className="mt-1 text-[11px] text-gray-400">
                                  SKU: {product.sku || "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Layers3
                                size={14}
                                className="text-gray-400"
                              />
                              {product.category?.name || "—"}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm font-medium">
                                ₹
                                {Number(
                                  product.price || 0
                                ).toLocaleString("en-IN")}
                              </p>

                              {product.mrp &&
                                Number(product.mrp) >
                                  Number(product.price) && (
                                  <p className="mt-0.5 text-[11px] text-gray-400 line-through">
                                    ₹
                                    {Number(
                                      product.mrp
                                    ).toLocaleString("en-IN")}
                                  </p>
                                )}
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <StockBadge
                              stock={product.stock}
                            />
                          </td>

                          <td className="px-4 py-4">
                            <StatusBadge
                              status={product.status}
                            />
                          </td>

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() =>
                                  openEdit(product)
                                }
                                className="rounded-xl p-2.5 text-gray-400 transition hover:bg-gray-100 hover:text-black"
                                title="Edit"
                              >
                                <Pencil
                                  size={16}
                                  strokeWidth={1.5}
                                />
                              </button>

                              <button
                                onClick={() =>
                                  setDeleteTarget(product)
                                }
                                className="rounded-xl p-2.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                title="Delete"
                              >
                                <Trash2
                                  size={16}
                                  strokeWidth={1.5}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="divide-y divide-gray-100 lg:hidden">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="p-4"
                    >
                      <div className="flex gap-3">
                        <ProductImage product={product} />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {product.name}
                              </p>

                              <p className="mt-1 text-[11px] text-gray-400">
                                {product.sku || "No SKU"}
                              </p>
                            </div>

                            <StatusBadge
                              status={product.status}
                            />
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                            <span className="font-medium">
                              ₹
                              {Number(
                                product.price || 0
                              ).toLocaleString("en-IN")}
                            </span>

                            <span className="text-gray-400">
                              {product.category?.name ||
                                "Uncategorized"}
                            </span>

                            <StockBadge
                              stock={product.stock}
                            />
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button
                              onClick={() =>
                                openEdit(product)
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg bg-[#f5f2ee] px-3 py-2 text-xs text-gray-700"
                            >
                              <Pencil size={13} />
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                setDeleteTarget(product)
                              }
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600"
                            >
                              <Trash2 size={13} />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            {!loading &&
              products.length > 0 &&
              pagination && (
                <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-400">
                    Showing{" "}
                    <span className="font-medium text-gray-600">
                      {pagination.from || 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-600">
                      {pagination.to || products.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-600">
                      {pagination.total || products.length}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={!pagination.prev_page_url}
                      onClick={() =>
                        setPage((prev) =>
                          Math.max(1, prev - 1)
                        )
                      }
                      className="rounded-xl border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <span className="min-w-10 text-center text-xs text-gray-500">
                      {pagination.current_page || page}
                    </span>

                    <button
                      disabled={!pagination.next_page_url}
                      onClick={() =>
                        setPage((prev) => prev + 1)
                      }
                      className="rounded-xl border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-[120] flex max-w-sm items-center gap-3 rounded-2xl bg-[#111] px-4 py-3.5 text-white shadow-2xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
            <CheckCircle2 size={17} />
          </div>

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

      {/* Product Modal */}
      <ProductModal
        open={modalOpen}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setEditing(null);
          }
        }}
        form={form}
        setForm={setForm}
        categories={categories}
        collections={collections}
        editing={editing}
        saving={saving}
        onSubmit={handleSubmit}
      />

      {/* Delete Modal */}
      <DeleteModal
        product={deleteTarget}
        onClose={() => {
          if (!deleting) setDeleteTarget(null);
        }}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  );
}

