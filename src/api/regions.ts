import { authFetch } from './client';

export interface Region {
  id: number;
  name: string;
  country?: string;
}

export const regionsService = {
  getAllRegions: async (): Promise<Region[]> => {
    const response = await authFetch('/api/regions');
    if (!response.ok) {
      throw new Error('Failed to fetch regions');
    }
    return response.json();
  }
};