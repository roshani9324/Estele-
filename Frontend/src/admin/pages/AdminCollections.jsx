
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Layers3,
  CheckCircle2,
  AlertCircle,
  Package,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from "lucide-react";

import AdminSidebar from "../components/AdminSidebar";

import {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
} from "../services/adminApi";

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  image: "",
  status: "active",
};

const statusOptions = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
];

const makeSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function StatusBadge({ status }) {
  const isActive =
    String(status || "").toLowerCase() === "active";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
        isActive
          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
          : "border-gray-200 bg-gray-100 text-gray-600"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

function CollectionImage({ collection }) {
  const image =
    collection?.image_url ||
    collection?.image ||
    collection?.thumbnail ||
    "";

  if (!image) {
    return (
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#f5f2ee] text-gray-400">
        <ImageIcon size={21} strokeWidth={1.4} />
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={collection?.name || "Collection"}
      className="h-14 w-14 shrink-0 rounded-xl bg-[#f5f2ee] object-cover"
      onError={(event) => {
        event.currentTarget.style.display = "none";
      }}
    />
  );
}

function CollectionModal({
  open,
  onClose,
  form,
  setForm,
  editing,
  saving,
  onSubmit,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <p className="mb-1 text-[10px] uppercase tracking-[0.25em] text-gray-400">
              Catalogue
            </p>

            <h2 className="font-serif text-2xl text-[#111]">
              {editing
                ? "Edit Collection"
                : "Add Collection"}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full p-2.5 text-gray-400 transition hover:bg-gray-100 hover:text-black"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-6 py-6">
          <form
            id="collection-form"
            onSubmit={onSubmit}
            className="space-y-6"
          >
            {/* Name */}
            <div>
              <label className="admin-label">
                Collection Name *
              </label>

              <input
                required
                value={form.name}
                onChange={(event) => {
                  const value = event.target.value;

                  setForm((previous) => ({
                    ...previous,
                    name: value,
                    slug:
                      previous.slug ||
                      makeSlug(value),
                  }));
                }}
                className="admin-input"
                placeholder="e.g. Festive Collection"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="admin-label">
                Slug
              </label>

              <input
                value={form.slug}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    slug: event.target.value,
                  }))
                }
                className="admin-input"
                placeholder="festive-collection"
              />
            </div>

            {/* Description */}
            <div>
              <label className="admin-label">
                Description
              </label>

              <textarea
                rows={4}
                value={form.description}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    description:
                      event.target.value,
                  }))
                }
                className="admin-input resize-none"
                placeholder="Describe this collection..."
              />
            </div>

            {/* Image */}
            <div>
              <label className="admin-label">
                Collection Image URL
              </label>

              <div className="flex gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#f5f2ee]">
                  {form.image ? (
                    <img
                      src={form.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon
                      size={19}
                      className="text-gray-400"
                    />
                  )}
                </div>

                <input
                  type="url"
                  value={form.image}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      image: event.target.value,
                    }))
                  }
                  className="admin-input"
                  placeholder="https://example.com/collection.jpg"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="admin-label">
                Status *
              </label>

              <select
                required
                value={form.status}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    status: event.target.value,
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

            {/* Preview */}
            {form.name && (
              <div className="rounded-2xl border border-gray-100 bg-[#faf9f7] p-4">
                <p className="mb-3 text-[10px] uppercase tracking-wider text-gray-400">
                  Preview
                </p>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white">
                    {form.image ? (
                      <img
                        src={form.image}
                        alt={form.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Layers3
                        size={20}
                        className="text-gray-400"
                      />
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {form.name}
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      /{form.slug || "collection-slug"}
                    </p>
                  </div>

                  <div className="ml-auto">
                    <StatusBadge
                      status={form.status}
                    />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-100 bg-[#fcfbfa] px-6 py-4">
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
            form="collection-form"
            disabled={saving}
            className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-xl bg-[#111] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : editing ? (
              "Save Changes"
            ) : (
              "Create Collection"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({
  collection,
  onClose,
  onConfirm,
  deleting,
}) {
  if (!collection) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <Trash2 size={21} />
        </div>

        <h3 className="font-serif text-2xl text-[#111]">
          Delete collection?
        </h3>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          You are about to delete{" "}
          <span className="font-medium text-gray-800">
            {collection.name}
          </span>
          . This action cannot be undone.
        </p>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="rounded-xl px-5 py-2.5 text-sm text-gray-600 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {deleting && (
              <Loader2
                size={15}
                className="animate-spin"
              />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminCollections() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [collections, setCollections] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  const [toast, setToast] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [page, setPage] =
    useState(1);

  const [pagination, setPagination] =
    useState(null);

  const [modalOpen, setModalOpen] =
    useState(false);

  const [editing, setEditing] =
    useState(null);

  const [form, setForm] =
    useState(emptyForm);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const loadCollections = async (
    currentPage = 1
  ) => {
    try {
      setLoading(true);
      setError("");

      /*
       * Current adminApi.js accepts no filters,
       * so the complete collection list is
       * fetched here.
       */
      const response =
        await getCollections();

      const data = response?.data;

      if (Array.isArray(data)) {
        setCollections(data);
        setPagination(null);
      } else if (
        Array.isArray(response)
      ) {
        setCollections(response);
        setPagination(null);
      } else {
        setCollections(
          data?.data || []
        );

        setPagination(
          data || null
        );
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to load collections."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections(1);
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(
      () => setToast(""),
      3000
    );

    return () => clearTimeout(timer);
  }, [toast]);

  const filteredCollections =
    useMemo(() => {
      return collections.filter(
        (collection) => {
          const searchText =
            search
              .toLowerCase()
              .trim();

          const matchesSearch =
            !searchText ||
            String(
              collection.name || ""
            )
              .toLowerCase()
              .includes(searchText) ||
            String(
              collection.slug || ""
            )
              .toLowerCase()
              .includes(searchText) ||
            String(
              collection.description ||
                ""
            )
              .toLowerCase()
              .includes(searchText);

          const matchesStatus =
            !statusFilter ||
            String(
              collection.status || ""
            ).toLowerCase() ===
              statusFilter.toLowerCase();

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      collections,
      search,
      statusFilter,
    ]);

  const totalCollections =
    pagination?.total ??
    collections.length;

  const activeCount =
    collections.filter(
      (collection) =>
        String(
          collection.status || ""
        ).toLowerCase() === "active"
    ).length;

  const inactiveCount =
    collections.filter(
      (collection) =>
        String(
          collection.status || ""
        ).toLowerCase() !== "active"
    ).length;

  const totalProducts =
    collections.reduce(
      (total, collection) =>
        total +
        Number(
          collection.products_count ||
            collection.product_count ||
            0
        ),
      0
    );

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = async (
    collection
  ) => {
    try {
      setError("");

      const response =
        await getCollection(
          collection.id
        );

      const data =
        response?.data ||
        collection;

      setEditing(data);

      setForm({
        name: data.name || "",
        slug: data.slug || "",
        description:
          data.description || "",
        image:
          data.image_url ||
          data.image ||
          "",
        status:
          data.status || "active",
      });

      setModalOpen(true);
    } catch (err) {
      setError(
        err.message ||
          "Unable to load collection."
      );
    }
  };

  const handleSubmit = async (
    event
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        name: form.name.trim(),
        slug:
          form.slug.trim() ||
          undefined,
        description:
          form.description.trim() ||
          null,
        image:
          form.image.trim() ||
          null,
        status: form.status,
      };

      if (editing) {
        await updateCollection(
          editing.id,
          payload
        );

        setToast(
          "Collection updated successfully."
        );
      } else {
        await createCollection(
          payload
        );

        setToast(
          "Collection created successfully."
        );
      }

      setModalOpen(false);
      setEditing(null);
      setForm(emptyForm);

      await loadCollections(
        page
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to save collection."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      setError("");

      await deleteCollection(
        deleteTarget.id
      );

      setDeleteTarget(null);

      setToast(
        "Collection deleted successfully."
      );

      await loadCollections(
        page
      );
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete collection."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f5] text-[#111]">
      <style>{`
        .admin-label {
          display: block;
          margin-bottom: 7px;
          font-size: 11px;
          font-weight: 500;
          color: #555;
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
      `}</style>

      <AdminSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="min-h-screen lg:ml-[270px]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-gray-100 bg-[#f8f7f5]/90 px-5 py-4 backdrop-blur-xl md:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.25em] text-gray-400">
                Estele / Admin
              </p>

              <h1 className="mt-1 font-serif text-xl md:text-2xl">
                Collections
              </h1>
            </div>

            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-[#111] px-4 py-2.5 text-xs font-medium text-white shadow-sm transition hover:bg-black hover:shadow-lg"
            >
              <Plus size={16} />

              <span className="hidden sm:inline">
                Add Collection
              </span>

              <span className="sm:hidden">
                Add
              </span>
            </button>
          </div>
        </header>

        <div className="px-5 py-6 md:px-8 md:py-8 lg:px-10">
          {/* Intro */}
          <div className="mb-7">
            <h2 className="font-serif text-3xl md:text-4xl">
              Collection Catalogue
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Curate and manage Estele's
              jewellery collections from one
              elegant workspace.
            </p>
          </div>

          {/* Stats */}
          <div className="mb-7 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f2ee]">
                <Layers3
                  size={17}
                  strokeWidth={1.5}
                />
              </div>

              <p className="text-[11px] uppercase tracking-wider text-gray-400">
                Total
              </p>

              <p className="mt-1 text-xl font-semibold">
                {totalCollections}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <CheckCircle2
                  size={17}
                  strokeWidth={1.5}
                />
              </div>

              <p className="text-[11px] uppercase tracking-wider text-gray-400">
                Active
              </p>

              <p className="mt-1 text-xl font-semibold">
                {activeCount}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                <Layers3
                  size={17}
                  strokeWidth={1.5}
                />
              </div>

              <p className="text-[11px] uppercase tracking-wider text-gray-400">
                Inactive
              </p>

              <p className="mt-1 text-xl font-semibold">
                {inactiveCount}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
              <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Package
                  size={17}
                  strokeWidth={1.5}
                />
              </div>

              <p className="text-[11px] uppercase tracking-wider text-gray-400">
                Products
              </p>

              <p className="mt-1 text-xl font-semibold">
                {totalProducts}
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

          {/* Toolbar */}
          <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
            <div className="grid gap-3 md:grid-cols-[1fr_190px]">
              <div className="relative">
                <Search
                  size={17}
                  strokeWidth={1.5}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search collections..."
                  className="h-11 w-full rounded-xl border border-gray-100 bg-[#faf9f7] pl-10 pr-4 text-sm outline-none transition focus:border-gray-300 focus:bg-white"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
                className="h-11 rounded-xl border border-gray-100 bg-[#faf9f7] px-3 text-sm text-gray-600 outline-none focus:border-gray-300"
              >
                <option value="">
                  All Status
                </option>

                {statusOptions.map(
                  (status) => (
                    <option
                      key={status.value}
                      value={status.value}
                    >
                      {status.label}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <div>
                <h3 className="text-sm font-semibold">
                  All Collections
                </h3>

                <p className="mt-1 text-xs text-gray-400">
                  Showing{" "}
                  {filteredCollections.length}{" "}
                  collections
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
                    Loading collections...
                  </p>
                </div>
              </div>
            ) : filteredCollections.length ===
              0 ? (
              <div className="flex min-h-[360px] items-center justify-center px-6">
                <div className="text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5f2ee] text-gray-400">
                    <Layers3
                      size={23}
                      strokeWidth={1.4}
                    />
                  </div>

                  <h3 className="mt-4 font-serif text-xl">
                    No collections found
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-gray-400">
                    Try changing your search
                    or filters, or create a
                    new collection.
                  </p>

                  <button
                    onClick={openCreate}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#111] px-4 py-2.5 text-xs font-medium text-white"
                  >
                    <Plus size={15} />
                    Add Collection
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden overflow-x-auto lg:block">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-[#fcfbfa]">
                        <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Collection
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Slug
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-gray-400">
                          Products
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
                      {filteredCollections.map(
                        (collection) => (
                          <tr
                            key={
                              collection.id
                            }
                            className="border-b border-gray-50 transition hover:bg-[#fcfbfa]"
                          >
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <CollectionImage
                                  collection={
                                    collection
                                  }
                                />

                                <div className="min-w-0">
                                  <p className="max-w-[280px] truncate text-sm font-medium text-[#111]">
                                    {
                                      collection.name
                                    }
                                  </p>

                                  {collection.description && (
                                    <p className="mt-1 max-w-[300px] truncate text-[11px] text-gray-400">
                                      {
                                        collection.description
                                      }
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <span className="rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] text-gray-500">
                                /
                                {collection.slug ||
                                  "—"}
                              </span>
                            </td>

                            <td className="px-4 py-4">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Package
                                  size={14}
                                  className="text-gray-400"
                                />

                                {collection.products_count ??
                                  collection.product_count ??
                                  0}
                              </div>
                            </td>

                            <td className="px-4 py-4">
                              <StatusBadge
                                status={
                                  collection.status
                                }
                              />
                            </td>

                            <td className="px-5 py-4">
                              <div className="flex justify-end gap-1">
                                <button
                                  onClick={() =>
                                    openEdit(
                                      collection
                                    )
                                  }
                                  className="rounded-xl p-2.5 text-gray-400 transition hover:bg-gray-100 hover:text-black"
                                  title="Edit"
                                >
                                  <Pencil
                                    size={16}
                                    strokeWidth={
                                      1.5
                                    }
                                  />
                                </button>

                                <button
                                  onClick={() =>
                                    setDeleteTarget(
                                      collection
                                    )
                                  }
                                  className="rounded-xl p-2.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                                  title="Delete"
                                >
                                  <Trash2
                                    size={16}
                                    strokeWidth={
                                      1.5
                                    }
                                  />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile */}
                <div className="divide-y divide-gray-100 lg:hidden">
                  {filteredCollections.map(
                    (collection) => (
                      <div
                        key={
                          collection.id
                        }
                        className="p-4"
                      >
                        <div className="flex gap-3">
                          <CollectionImage
                            collection={
                              collection
                            }
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p className="truncate text-sm font-medium">
                                  {
                                    collection.name
                                  }
                                </p>

                                <p className="mt-1 text-[11px] text-gray-400">
                                  /
                                  {collection.slug ||
                                    "—"}
                                </p>
                              </div>

                              <StatusBadge
                                status={
                                  collection.status
                                }
                              />
                            </div>

                            <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <Package
                                  size={13}
                                />

                                {collection.products_count ??
                                  collection.product_count ??
                                  0}{" "}
                                products
                              </span>
                            </div>

                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() =>
                                  openEdit(
                                    collection
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-[#f5f2ee] px-3 py-2 text-xs text-gray-700"
                              >
                                <Pencil
                                  size={13}
                                />
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  setDeleteTarget(
                                    collection
                                  )
                                }
                                className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600"
                              >
                                <Trash2
                                  size={13}
                                />
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </>
            )}

            {/* Backend pagination */}
            {!loading &&
              filteredCollections.length > 0 &&
              pagination &&
              pagination.total && (
                <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-gray-400">
                    Showing{" "}
                    <span className="font-medium text-gray-600">
                      {pagination.from ||
                        1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-gray-600">
                      {pagination.to ||
                        filteredCollections.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-600">
                      {pagination.total}
                    </span>
                  </p>

                  <div className="flex items-center gap-2">
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
                      className="rounded-xl border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronLeft
                        size={16}
                      />
                    </button>

                    <span className="min-w-10 text-center text-xs text-gray-500">
                      {pagination.current_page ||
                        page}
                    </span>

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
                      className="rounded-xl border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
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

      {/* Add/Edit */}
      <CollectionModal
        open={modalOpen}
        onClose={() => {
          if (!saving) {
            setModalOpen(false);
            setEditing(null);
          }
        }}
        form={form}
        setForm={setForm}
        editing={editing}
        saving={saving}
        onSubmit={handleSubmit}
      />

      {/* Delete */}
      <DeleteModal
        collection={deleteTarget}
        onClose={() => {
          if (!deleting) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  );
}

