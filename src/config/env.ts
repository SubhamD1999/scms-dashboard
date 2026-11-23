const baseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

export const env = {
  API_BASE_URL: baseUrl.replace(/\/+$/, ""),
};