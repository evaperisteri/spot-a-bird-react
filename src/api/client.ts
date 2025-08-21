import { getCookie } from "../utils/cookies";

// Add base URL configuration
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export async function authFetch(url: string, options: RequestInit = {}) {
  const token = getCookie("access_token");

  // Prepend base URL to the endpoint
  const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  } as Record<string, string>;

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log("Making API call to:", fullUrl); // Debug log

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token might be expired, redirect to login
      window.location.href = "/login";
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response;
}
