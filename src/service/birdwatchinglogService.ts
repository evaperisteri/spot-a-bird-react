import { birdwatchinglogs } from "../api/birdwatchinglogs";

export const dashboardService = {
  getMyLogsPaginated: async (page: number = 0, size: number = 5) => {
    return birdwatchinglogs.getMyLogsPaginated(page, size);
  },

  searchLogs: async (searchTerm: string) => {
    return birdwatchinglogs.searchLogs(searchTerm);
  },
};
