import {
  BirdwatchingLogReadOnlyDTO,
  BirdwatchingLogTableItem,
} from "../types/birdwatchingTypes";

export const transformLogForTable = (
  log: BirdwatchingLogReadOnlyDTO
): BirdwatchingLogTableItem => {
  if (!log) {
    throw new Error("Log is undefined or null");
  }

  return {
    id: log.id,
    commonName: log.bird?.name || "Unknown Bird",
    scientificName: log.bird?.scientificName || "",
    regionName: log.region?.name || "Unknown Region",
    quantity: log.quantity,
    observationDate: log.createdAt,
    user: log.user,
  };
};

export const transformLogsForTable = (
  logs: BirdwatchingLogReadOnlyDTO[]
): BirdwatchingLogTableItem[] => {
  if (!logs || !Array.isArray(logs)) {
    return [];
  }
  return logs.map((log) => transformLogForTable(log));
};
