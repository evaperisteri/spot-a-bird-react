import { type ReactNode, useEffect, useState } from "react";
import { getCookie, setCookie, deleteCookie } from "../utils/cookies";
import { jwtDecode } from "jwt-decode";
import { login, type LoginFields } from "../api/login";
import { AuthContext } from "./AuthContext";

type JwtPayload = {
  username?: string;
  role?: "SPOTTER" | "ADMIN";
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = getCookie("access_token");
    setAccessToken(token ?? null);
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log(decoded);
        setUsername(decoded.username ?? null);
      } catch {
        setUsername(null);
      }
    } else {
      setUsername(null);
    }
    setLoading(false);
  }, []);

  const loginUser = async (fields: LoginFields) => {
    console.log("AuthProvider:login started");
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
    } catch {
      setUsername(null);
    }
  };

  const logoutUser = () => {
    deleteCookie("token");
    setAccessToken(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!accessToken,
        accessToken,
        username,
        loginUser,
        logoutUser,
        loading,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
