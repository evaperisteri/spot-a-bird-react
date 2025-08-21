import { authFetch } from "./client";

export interface Bird {
  id: number;
  name: string;
  scientificName: string;
  family?: string;
}

export const birdsService = {
  getAllBirds: async (): Promise<Bird[]> => {
    const response = await authFetch("/api/birds");
    if (!response.ok) {
      throw new Error("Failed to fetch birds");
    }
    return response.json();
  },

  searchBirds: async (query: string): Promise<Bird[]> => {
    const response = await authFetch(
      `/api/birds/search?name=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Failed to search birds");
    }
    return response.json();
  },
};
