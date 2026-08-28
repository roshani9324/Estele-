const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
import { apiRequest } from "../../services/api";

export const adminLogin = async (credentials) => {
  return await apiRequest("/api/admin/login", {
    method: "POST",
    data: credentials,
  });
};

export const getAdminDashboard = async () => {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    throw new Error("Admin session not found. Please login again.");
  }

  const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Unable to load admin dashboard.");
  }

  return data;
};
