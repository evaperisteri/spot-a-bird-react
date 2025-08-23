import { authFetch } from "./client";

export interface Bird {
  id: number;
  commonName: string;
  scientificName: string;
  familyName?: string;
}

export const birdsService = {
  getAllBirds: async (): Promise<Bird[]> => {
    console.log("Fetching all birds...");
    const response = await authFetch("/api/birds");
    console.log("All birds response status:", response.status);
    if (!response.ok) {
      throw new Error("Failed to fetch birds");
    }
    const data = await response.json();
    console.log("All birds data:", data);
    return data.content ?? [];
  },

  searchBirds: async (query: string): Promise<Bird[]> => {
    console.log("Searching birds with query:", query);
    const url = `/api/birds/search?query=${encodeURIComponent(query)}`;
    console.log("API URL:", url);

    try {
      const response = await authFetch(url);
      console.log("Search response status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to search birds: ${response.status}`);
      }

      const data = await response.json();
      console.log("Search response data:", data);

      // Your backend returns a direct array, not data.content
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error in searchBirds:", error);
      throw error;
    }
  },
};
