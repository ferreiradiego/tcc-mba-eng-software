import api from "@/lib/api";

export interface LoginPayload {
  email: string;
  password: string;
}

export async function loginUser({
  email,
  password,
}: LoginPayload): Promise<string> {
  const res = await api.post("/auth/login", { email, password });
  const { token, accessToken } = res.data;
  const jwt = token || accessToken;
  if (typeof window !== "undefined" && jwt) {
    sessionStorage.setItem("token", jwt);
  }
  return jwt;
}
