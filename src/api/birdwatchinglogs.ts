import { authFetch } from "./client";
import { transformLogsForTable } from "../utils/logTransform";
import type {
  BirdWatchingLogFiltersWithPagination,
  BirdwatchingLogReadOnlyDTO,
  BirdwatchingLogTableItem,
  CreateLogRequest,
} from "../types/birdwatching";

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const birdwatchinglogs = {
  getPaginatedLogs: async (
    page: number = 0,
    size: number = 10,
    sortBy: string = "createdAt", // Changed from observationDate to createdAt
    sortDirection: string = "DESC"
  ): Promise<PaginatedResponse<BirdwatchingLogReadOnlyDTO>> => {
    const response = await authFetch(
      `/api/bwlogs/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
    return response.json();
  },

  createLog: async (
    logData: CreateLogRequest
  ): Promise<BirdwatchingLogReadOnlyDTO> => {
    const response = await authFetch("/api/bwlogs/save", {
      method: "POST",
      body: JSON.stringify(logData),
    });
    return response.json();
  },

  getLogById: async (id: number): Promise<BirdwatchingLogReadOnlyDTO> => {
    const response = await authFetch(`/api/bwlogs/${id}`);
    return response.json();
  },

  updateLog: async (
    id: number,
    logData: Partial<CreateLogRequest>
  ): Promise<BirdwatchingLogReadOnlyDTO> => {
    const response = await authFetch(`/api/bwlogs/${id}`, {
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

  getMyLogsPaginated: async (
    page: number = 0,
    size: number = 10,
    sortBy: string = "createdAt", // Add these parameters
    sortDirection: string = "DESC" // Add these parameters
  ): Promise<PaginatedResponse<BirdwatchingLogTableItem>> => {
    const response = await authFetch(
      `/api/bwlogs/my-logs?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );

    const data = await response.json();

    return {
      content: transformLogsForTable(data.content || []),
      totalPages: data.totalPages || 0,
      totalElements: data.totalElements || 0,
      number: data.number || page,
      size: data.size || size,
      first: data.first !== undefined ? data.first : page === 0,
      last: data.last !== undefined ? data.last : false,
      empty:
        data.empty !== undefined
          ? data.empty
          : (data.content || []).length === 0,
    };
  },

  getFilteredPaginatedLogs: async (
    filters: BirdWatchingLogFiltersWithPagination = {},
    page: number = 0,
    size: number = 10,
    sortBy: string = "createdAt",
    sortDirection: string = "DESC"
  ): Promise<PaginatedResponse<BirdwatchingLogTableItem>> => {
    const response = await authFetch(
      `/api/bwlogs/filtered/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`,
      {
        method: "POST",
        body: JSON.stringify(filters),
      }
    );
    const data = await response.json();

    return {
      ...data,
      content: transformLogsForTable(data.content || []),
    };
  },

  searchLogs: async (
    searchTerm: string
  ): Promise<BirdwatchingLogReadOnlyDTO[]> => {
    const response = await authFetch("/api/bwlogs/filtered", {
      method: "POST",
      body: JSON.stringify({ birdName: searchTerm }),
    });
    return response.json();
  },
};
