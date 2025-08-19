import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFields = z.infer<typeof loginSchema>;

export type LoginResponse = {
  token: string;
  token_type: string;
  firstname: string;
  lastname: string;
  userId: number;
  username: string;
};

export async function login({
  username,
  password,
}: LoginFields): Promise<LoginResponse> {
  const form = new URLSearchParams();
  form.append("username", username);
  form.append("password", password);

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    let detail = "Login Failed";
    try {
      const data = await res.json();
      if (typeof data?.detail == "string") detail = data.detail;
    } catch (error) {
      console.error(error);
    }
    throw new Error(detail);
  }
  return await res.json();
}
