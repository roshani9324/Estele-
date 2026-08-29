const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const getToken = () => localStorage.getItem("admin_token");

const request = async (url, options = {}) => {
  const token = getToken();

  const headers = {
    Accept: "application/json",
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");

    throw new Error("Your admin session has expired. Please login again.");
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Something went wrong.");
  }

  return data;
};

/* =========================
   AUTH
========================= */

export const adminLogin = (credentials) =>
  request("/api/admin/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const adminLogout = () =>
  request("/api/admin/logout", {
    method: "POST",
  });

export const getAdminMe = () => request("/api/admin/me");

/* =========================
   DASHBOARD
========================= */

export const getAdminDashboard = () => request("/api/admin/dashboard");

/* =========================
   PRODUCTS
========================= */

export const getProducts = () => request("/api/admin/products");

export const getProduct = (id) => request(`/api/admin/products/${id}`);

export const createProduct = (data) =>
  request("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateProduct = (id, data) =>
  request(`/api/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteProduct = (id) =>
  request(`/api/admin/products/${id}`, {
    method: "DELETE",
  });

/* =========================
   CATEGORIES
========================= */

export const getCategories = () => request("/api/admin/categories");

export const getCategory = (id) => request(`/api/admin/categories/${id}`);

export const createCategory = (data) =>
  request("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCategory = (id, data) =>
  request(`/api/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteCategory = (id) =>
  request(`/api/admin/categories/${id}`, {
    method: "DELETE",
  });

/* =========================
   COLLECTIONS
========================= */

export const getCollections = () => request("/api/admin/collections");

export const getCollection = (id) => request(`/api/admin/collections/${id}`);

export const createCollection = (data) =>
  request("/api/admin/collections", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCollection = (id, data) =>
  request(`/api/admin/collections/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteCollection = (id) =>
  request(`/api/admin/collections/${id}`, {
    method: "DELETE",
  });

/* =========================
   ORDERS
========================= */

export const getOrders = () => request("/api/admin/orders");

export const getOrder = (id) => request(`/api/admin/orders/${id}`);

export const updateOrderStatus = (id, status) =>
  request(`/api/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const updatePaymentStatus = (id, payment_status) =>
  request(`/api/admin/orders/${id}/payment-status`, {
    method: "PATCH",
    body: JSON.stringify({ payment_status }),
  });

/* =========================
   CUSTOMERS
========================= */

export const getCustomers = () => request("/api/admin/customers");

export const getCustomer = (id) => request(`/api/admin/customers/${id}`);

/* =========================
   REVIEWS
========================= */

export const getReviews = () => request("/api/admin/reviews");

export const getReview = (id) => request(`/api/admin/reviews/${id}`);

export const updateReviewStatus = (id, status) =>
  request(`/api/admin/reviews/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

export const deleteReview = (id) =>
  request(`/api/admin/reviews/${id}`, {
    method: "DELETE",
  });

/* =========================
   BLOGS
========================= */

export const getBlogs = () => request("/api/admin/blogs");

export const getBlog = (id) => request(`/api/admin/blogs/${id}`);

export const createBlog = (data) =>
  request("/api/admin/blogs", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateBlog = (id, data) =>
  request(`/api/admin/blogs/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteBlog = (id) =>
  request(`/api/admin/blogs/${id}`, {
    method: "DELETE",
  });

/* =========================
   NEWSLETTER
========================= */

export const getNewsletterSubscribers = () => request("/api/admin/newsletter");

export const exportNewsletter = () => request("/api/admin/newsletter/export");

export const deleteNewsletterSubscriber = (id) =>
  request(`/api/admin/newsletter/${id}`, {
    method: "DELETE",
  });

/* =========================
   CONTACTS
========================= */

export const getContacts = () => request("/api/admin/contacts");

export const getContact = (id) => request(`/api/admin/contacts/${id}`);

export const deleteContact = (id) =>
  request(`/api/admin/contacts/${id}`, {
    method: "DELETE",
  });

/* =========================
   STORES
========================= */

export const getStores = () => request("/api/admin/stores");

export const getStore = (id) => request(`/api/admin/stores/${id}`);

export const createStore = (data) =>
  request("/api/admin/stores", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateStore = (id, data) =>
  request(`/api/admin/stores/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteStore = (id) =>
  request(`/api/admin/stores/${id}`, {
    method: "DELETE",
  });
