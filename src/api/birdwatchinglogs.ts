import { authFetch } from "../api/client";
import type {
  BirdwatchingLog,
  CreateLogRequest,
  PaginatedResponse,
} from "../types/birdwatching";

export const birdwatchinglogs = {
  getPaginatedLogs: async (
    page: number = 0,
    size: number = 10,
    sortBy: string = "observationDate",
    sortDirection: string = "DESC"
  ): Promise<PaginatedResponse<BirdwatchingLog>> => {
    const response = await authFetch(
      `/api/bwlogs/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
    return response.json();
  },

  createLog: async (logData: CreateLogRequest): Promise<BirdwatchingLog> => {
    const response = await authFetch("/api/bwlogs/save", {
      method: "POST",
      body: JSON.stringify(logData),
    });
    return response.json();
  },

  // Optional: Add more methods with proper types
  getLogById: async (id: number): Promise<BirdwatchingLog> => {
    const response = await authFetch(`/api/bwlogs/${id}`);
    return response.json();
  },

  updateLog: async (
    id: number,
    logData: Partial<CreateLogRequest>
  ): Promise<BirdwatchingLog> => {
    const response = await authFetch(`/api/bwlogs/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(logData),
    });
    return response.json();
  },

  deleteLog: async (id: number): Promise<void> => {
    await authFetch(`/api/bwlogs/${id}`, {
      method: "DELETE",
    });
  },
};
