import client from "./client";
import type { LoginRequest, RegisterRequest, AuthResponse, User } from "../types";

export async function login(req: LoginRequest): Promise<AuthResponse> {
  const { data } = await client.post("/auth/login", req);
  return data;
}

export async function register(req: RegisterRequest): Promise<AuthResponse> {
  const { data } = await client.post("/auth/register", req);
  return data;
}

export async function fetchMe(): Promise<User> {
  const { data } = await client.get("/auth/me");
  return data;
}
