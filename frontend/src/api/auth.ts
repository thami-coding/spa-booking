import type { LoginData, SignupData } from "../types/types";
import { api } from "./api";

export const login = async (url: string, { arg }: { arg: LoginData }) => {
  const res = await api.post(url, arg);
  return res.data;
};

export const signup = async (url: string, { arg }: { arg: SignupData }) => {
  const res = await api.post(url, arg);
  return res.data;
};

export const logout = async (url: string) => {
  await api.post(url);
};
