import { type ReactNode, useEffect, useState } from "react";
import { getCookie, setCookie, deleteCookie } from "../utils/cookies";
import { jwtDecode } from "jwt-decode";
import { login, type LoginFields } from "../api/login";
import { AuthContext } from "../context/AuthContext.ts";

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
    const res = await login(fields);
    setCookie("access_token", res.access_token, {
      expires: 1,
      sameSite: "Lax",
      secure: false,
      path: "/",
    });
    setAccessToken(res.access_token);
    try {
      const decoded = jwtDecode<JwtPayload>(res.access_token);
      setUsername(decoded.username ?? null);
    } catch {
      setUsername(null);
    }
  };

  const logoutUser = () => {
    deleteCookie("access_token");
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
