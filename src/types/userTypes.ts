export interface UserReadOnlyDTO {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  isActive: boolean;
  profileDetails?: ProfileDetailsDTO;
}

export interface ProfileDetailsDTO {
  dateOfBirth?: string;
  gender?: string;
}

export interface UserInsertDTO {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: string;
  isActive: boolean;
  dateOfBirth?: string;
  gender?: string;
  profileDetailsInsertDTO?: ProfileDetailsInsertDTO;
}

export interface ProfileDetailsInsertDTO {
  dateOfBirth?: string;
  gender?: string;
}

export interface UserUpdateDTO {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  gender?: string;
}

export interface UserFilters {
  id?: number;
  username?: string;
  email?: string;
  role?: string;
  isActive?: boolean;
  gender?: string;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
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

// For the filters component
export interface UserFilterValues {
  username: string;
  email: string;
  role: string;
  isActive: string;
}
