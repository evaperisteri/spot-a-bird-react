import { authFetch } from "./client";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  profileDetails?: {
    gender: string;
    dateOfBirth: string;
  };
}

export interface UserUpdateDTO {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
}

export interface UserReadOnlyDTO {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  profileDetails?: {
    gender: string;
    dateOfBirth: string;
  };
}

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
  const response = await authFetch("/api/users/update-user", {
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
