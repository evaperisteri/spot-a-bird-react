import { authFetch } from "./client";

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
}

export const getUserProfile = async (userId: number): Promise<UserProfile> => {
  const response = await authFetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch user profile");
  }
  return response.json();
};
