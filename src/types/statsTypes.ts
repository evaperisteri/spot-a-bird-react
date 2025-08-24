export interface BirdStatisticsDTO {
  totalSpecies: number;
  totalObservations: number;
  totalFamilies: number;
  topFamilies: FamilyCountDTO[];
  regionsWithMostObservations: RegionCountDTO[];
}

export interface UserLogStatisticsDTO {
  totalLogs: number;
  totalSpeciesObserved: number;
  totalRegionsVisited: number;
  mostSpottedBirds: BirdCountDTO[];
}

export interface FamilyStatisticsDTO {
  totalFamilies: number;
  familiesWithMostSpecies: FamilyCountDTO[];
  familiesWithMostObservations: FamilyCountDTO[];
}

export interface FamilyCountDTO {
  id: number;
  familyName: string;
  speciesCount: number;
  observationCount: number;
}

export interface RegionCountDTO {
  regionName: string;
  observationCount: number;
}

export interface BirdCountDTO {
  birdName: string;
  observationCount: number;
}
