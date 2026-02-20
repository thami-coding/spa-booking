import type { AuthData } from "../types/types";
import { api } from "./api";

export async function login(url, { arg }: { arg: AuthData }) {
  const res = await api.post(url, arg);

  sessionStorage.setItem("access_token", res.data.access_token);
  return res.data;
}

export async function signup(email, password, username) {
  const res = await api.post("/register", { email, password, username });

  return res.data.access_token;
}
