export type Role = "ADMIN" | "SPOTTER";
export type Gender = "FEMALE" | "MALE" | "NON-BINARY" | "GENDERFLUID" | "OTHER";

export interface UserReadOnlyDTO {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  profileDetails?: ProfileDetailsDTO;
}

export interface ProfileDetailsDTO {
  dateOfBirth?: string;
  gender?: Gender;
}

export interface UserInsertDTO {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  role: Role;
  isActive: boolean;
  dateOfBirth?: string;
  gender?: Gender;
  profileDetailsInsertDTO?: ProfileDetailsInsertDTO;
}

export interface ProfileDetailsInsertDTO {
  dateOfBirth?: string;
  gender?: Gender;
}

export interface UserUpdateDTO {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  gender?: Gender;
}

export interface UserFilters {
  id?: number;
  username?: string;
  email?: string;
  role?: Role;
  isActive?: boolean;
  gender?: Gender;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: string;
}

// For the filters component
export interface UserFilterValues {
  username: string;
  email: string;
  role: Role | "";
  isActive: string; // keep as string if it's a dropdown
}
