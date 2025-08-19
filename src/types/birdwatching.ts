export interface BirdwatchingLog {
  id?: number;
  birdName: string;
  regionName: string;
  quantity: number;
  observationDate?: string;
  notes?: string;
  // Add other fields based on your backend model
}

export interface CreateLogRequest {
  birdName: string;
  regionName: string;
  quantity: number;
  observationDate?: string;
  notes?: string;
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
