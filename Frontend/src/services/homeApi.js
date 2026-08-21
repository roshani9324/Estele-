import { apiRequest } from "./api";

export const getHomeData = async () => {
  return await apiRequest("/api/home");
};
