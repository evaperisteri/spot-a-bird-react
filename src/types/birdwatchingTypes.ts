export interface BirdwatchingLogReadOnlyDTO {
  id: number;
  bird: BirdReadOnlyDTO;
  quantity: number;
  region: RegionReadOnlyDTO;
  user: UserReadOnlyDTO;
  createdAt: string;
  updatedAt: string;
}

export interface BirdReadOnlyDTO {
  id: number;
  name: string;
  scientificName: string;
  family: string;
}

export interface RegionReadOnlyDTO {
  id: number;
  name: string;
}

export interface UserReadOnlyDTO {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
}

export interface BirdwatchingLogTableItem {
  id: number;
  commonName: string;
  scientificName: string;
  regionName: string;
  quantity: number;
  observationDate?: string;
  user: UserReadOnlyDTO;
}

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

export interface BirdWatchingLogFilters {
  birdName?: string;
  scientificName?: string;
  birdId?: number;
  regionName?: string;
  regionId?: number;
  username?: string;
  userId?: number;
  familyName?: string;
  familyId?: number;
  date?: string;
  searchTerm?: string;
}

export interface CreateLogRequest {
  birdName: string;
  quantity: number;
  regionName: string;
}

export interface BirdwatchingLogReadOnlyDTO {
  id: number;
  bird: BirdReadOnlyDTO;
  quantity: number;
  region: RegionReadOnlyDTO;
  user: UserReadOnlyDTO;
  createdAt: string;
  updatedAt: string;
}

export interface GenericFilters {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface BirdWatchingLogFiltersWithPagination
  extends BirdWatchingLogFilters,
    GenericFilters {}
