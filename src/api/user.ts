import { authFetch } from "./client";
import {
  UserReadOnlyDTO,
  UserUpdateDTO,
  UserInsertDTO,
  UserFilters,
  UserProfile,
} from "../types/userTypes";

export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const response = await authFetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return response.json();
};

export const updateUserProfile = async (
  data: UserUpdateDTO
): Promise<UserReadOnlyDTO> => {
  const response = await authFetch(`/api/users/update-user`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update user profile");
  }

  return response.json();
};

export const getCurrentUserProfile = async (): Promise<UserProfile> => {
  const response = await authFetch("/api/my-info");
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return response.json();
};

export const updateCurrentUserProfile = async (
  data: UserUpdateDTO
): Promise<UserProfile> => {
  const response = await authFetch("/api/update-user", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update user profile");
  }
  return response.json();
};

export const deleteCurrentUserProfile = async (): Promise<void> => {
  const response = await authFetch("/api/my-info/delete", {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete user profile");
  }
};

// Additional utility functions you might need
export const getAllUsers = async (
  filters?: UserFilters
): Promise<UserProfile[]> => {
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
  }

  const response = await authFetch(`/api/users?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
};

export const createUser = async (
  data: UserInsertDTO
): Promise<UserReadOnlyDTO> => {
  const response = await authFetch(`/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
};

export const deactivateUser = async (userId: number): Promise<void> => {
  const response = await authFetch(`/api/users/${userId}/deactivate`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Failed to deactivate user");
  }
};
