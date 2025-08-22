import { authFetch } from "./client";

export interface Bird {
  id: number;
  commonName: string;
  scientificName: string;
  familyName?: string;
  displayText: string;
}

export const birdsService = {
  getAllBirds: async (): Promise<Bird[]> => {
    const response = await authFetch("/api/birds");
    if (!response.ok) {
      throw new Error("Failed to fetch birds");
    }
    const data = await response.json();
    console.log(response);
    console.log(data);
    return data.content ?? [];
  },

  searchBirds: async (query: string): Promise<Bird[]> => {
    const response = await authFetch(
      `/api/birds/search?query=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error("Failed to search birds");
    }
    return response.json();
  },
};
