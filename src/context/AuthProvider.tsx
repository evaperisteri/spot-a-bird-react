import { type ReactNode, useEffect, useState } from "react";
import { getCookie, setCookie, deleteCookie } from "../utils/cookies";
import { jwtDecode } from "jwt-decode";
import { login, type LoginFields } from "../api/login";
import { AuthContext } from "./AuthContext";
import { getCurrentUserProfile, getUserProfile } from "../api/user";
import { Role, UserProfile } from "@/types/userTypes";

type JwtPayload = {
  username?: string;
  userId?: number;
  role?: "SPOTTER" | "ADMIN";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [firstname, setFirstname] = useState<string | null>(null);
  const [lastname, setLastname] = useState<string | null>(null);
  const [role, setRole] = useState<"SPOTTER" | "ADMIN" | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserProfile = async (id: number, role: Role | null) => {
    try {
      let profile: UserProfile;

      if (role === "ADMIN") {
        profile = await getUserProfile(id);
      } else {
        profile = await getCurrentUserProfile();
      }

      setFirstname(profile.firstname ?? null);
      setLastname(profile.lastname ?? null);

      console.log("Profile details:", profile.profileDetails);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setFirstname(null);
      setLastname(null);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const token = getCookie("access_token");
      setAccessToken(token ?? null);

      if (token) {
        try {
          const decoded = jwtDecode<JwtPayload>(token);
          console.log("Decoded JWT:", decoded);

          setUsername(decoded.username ?? null);
          setUserId(decoded.userId ?? null);
          setRole(decoded.role ?? null);
          // Fetch user profile if userId is available
          if (decoded.userId) {
            await fetchUserProfile(decoded.userId, decoded.role ?? null);
          }
        } catch (error) {
          console.error("Failed to decode token:", error);
          setUsername(null);
          setUserId(null);
          setFirstname(null);
          setLastname(null);
        }
      } else {
        setUsername(null);
        setUserId(null);
        setFirstname(null);
        setLastname(null);
      }

      setLoading(false);
    };

    initializeAuth();
  }, []);

  const loginUser = async (fields: LoginFields) => {
    console.log("AuthProvider:login started");
    try {
      const res = await login(fields);
      console.log("Login API response:", res);

      setCookie("access_token", res.token, {
        expires: 1,
        sameSite: "Lax",
        secure: false,
        path: "/",
      });

      setAccessToken(res.token);

      try {
        const decoded = jwtDecode<JwtPayload>(res.token);
        setUsername(decoded.username ?? null);
        setUserId(decoded.userId ?? null);
        setRole(decoded.role ?? null);

        // Fetch user profile after successful login
        if (decoded.userId) {
          await fetchUserProfile(decoded.userId, decoded.role ?? null);
        }
      } catch (decodeError) {
        console.error("Failed to decode token after login:", decodeError);
        setUsername(null);
        setUserId(null);
        setFirstname(null);
        setLastname(null);
        setRole(null);
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Re-throw to handle in the login form
    }
  };

  const logoutUser = () => {
    deleteCookie("access_token"); // Fixed: should be "access_token" not "token"
    setAccessToken(null);
    setUsername(null);
    setUserId(null);
    setFirstname(null);
    setLastname(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        accessToken,
        userId,
        username,
        firstname,
        lastname,
        role,
        loginUser,
        logoutUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
