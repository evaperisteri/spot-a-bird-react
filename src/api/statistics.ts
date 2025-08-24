import { authFetch } from "./client";
import type {
  BirdStatisticsDTO,
  UserLogStatisticsDTO,
  FamilyStatisticsDTO,
  RegionCountDTO,
  BirdCountDTO,
} from "../types/statsTypes";

export const statistics = {
  getBirdStatistics: async (): Promise<BirdStatisticsDTO> => {
    const response = await authFetch("/api/stats/birds");
    return response.json();
  },

  getUserLogStatistics: async (): Promise<UserLogStatisticsDTO> => {
    const response = await authFetch("/api/stats/user-logs");
    return response.json();
  },

  getRegionStatistics: async (): Promise<RegionCountDTO[]> => {
    const response = await authFetch("/api/stats/regions");
    return response.json();
  },

  getFamilyStats: async (
    topCount: number = 3
  ): Promise<FamilyStatisticsDTO> => {
    const response = await authFetch(
      `/api/stats/families?topCount=${topCount}`
    );
    return response.json();
  },

  getSpeciesDistribution: async (): Promise<Map<string, number>> => {
    const response = await authFetch("/api/stats/species-distribution");
    return response.json();
  },

  getTopObservedBirds: async (count: number = 5): Promise<BirdCountDTO[]> => {
    const response = await authFetch(`/api/stats/top-birds?count=${count}`);
    return response.json();
  },
};
