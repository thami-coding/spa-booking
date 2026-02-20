import { api } from "./api";

export const getUser = async (...args) => {
  const {data} = await api.get(...args);  
  return data;
};
