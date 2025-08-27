export type Role = "ADMIN" | "SPOTTER";
export type Gender = "FEMALE" | "MALE" | "NON-BINARY" | "GENDERFLUID" | "OTHER";

export interface ProfileDetailsDTO {
  dateOfBirth?: string;
  gender?: Gender;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  role: Role;
  isActive: boolean;
  profileDetails?: ProfileDetailsDTO;
}

export interface ProfileDetailsInsertDTO {
  dateOfBirth?: string;
  gender?: Gender | "";
}

export interface UserInsertDTO {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  role: Role;
  isActive: boolean;
  dateOfBirth?: string;
  gender?: Gender;
  profileDetailsInsertDTO?: ProfileDetailsInsertDTO;
}
export interface UserUpdateDTO {
  firstname: string;
  lastname: string;
  email: string;
  dateOfBirth?: string;
  gender?: Gender | "";
}

export interface UserReadOnlyDTO {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  role: Role;
  isActive: boolean;
  profileDetails?: ProfileDetailsDTO;
}

export interface UserFilters {
  id?: number;
  username?: string;
  email?: string;
  role?: Role;
  isActive?: boolean;
  gender?: Gender;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
}

export interface UserFilterValues {
  username: string;
  email: string;
  role: Role | "";
  isActive: string;
}
