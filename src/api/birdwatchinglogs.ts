import { authFetch } from "./client";
import { transformLogsForTable } from "../utils/logTransform";
import type {
  BirdWatchingLogFilters,
  BirdWatchingLogFiltersWithPagination,
  BirdwatchingLogReadOnlyDTO,
  BirdwatchingLogTableItem,
  CreateLogRequest,
} from "../types/birdwatchingTypes";

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
    sortBy: string = "createdAt",
    sortDirection: string = "DESC"
  ): Promise<PaginatedResponse<BirdwatchingLogReadOnlyDTO>> => {
    const response = await authFetch(
      `/api/bwlogs/paginated?page=${page}&size=${size}&sortBy=${sortBy}&sortDirection=${sortDirection}`
    );
    return response.json();
  },

  getFilteredLogs: async (
    filters: BirdWatchingLogFilters
  ): Promise<BirdwatchingLogTableItem[]> => {
    try {
      const response = await authFetch("/api/bwlogs/filtered", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch filtered logs: ${response.status}`);
      }

      const data: BirdwatchingLogReadOnlyDTO[] = await response.json();
      return transformLogsForTable(data || []);
    } catch (error) {
      console.error("Error fetching filtered logs:", error);
      throw error;
    }
  },

  createLog: async (
    logData: CreateLogRequest
  ): Promise<BirdwatchingLogReadOnlyDTO> => {
    const response = await authFetch("/api/bwlogs/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create log: ${response.status}`
      );
    }

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
      headers: {
        "Content-Type": "application/json",
      },
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
    sortBy: string = "createdAt",
    sortDirection: string = "DESC"
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      }
    );
    console.log(filters);
    const data = await response.json();
    console.log(data);

    return {
      ...data,
      content: transformLogsForTable(data.content || []),
    };
  },

  searchLogs: async (
    searchTerm: string
  ): Promise<BirdwatchingLogTableItem[]> => {
    const filters: BirdWatchingLogFilters = {
      birdName: searchTerm,
      scientificName: searchTerm,
      regionName: searchTerm,
    };

    return birdwatchinglogs.getFilteredLogs(filters);
  },
};
