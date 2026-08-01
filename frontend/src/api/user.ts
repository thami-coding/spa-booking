
import { api } from "./api";

export const getUser = async (url: string) => { //TODO type return
  const { data } = await api.get(url);
  return data;
};
