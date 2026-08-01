import useSWRMutation from "swr/mutation";
import { login, signup } from "../api/auth";
import { getUser } from "../api/user";
import useSWR from "swr";

export const useLogin = () => {
  const { trigger, isMutating, error } = useSWRMutation("/auth/login", login);

  return {
    trigger,
    isMutating,
    error,
  };
};

export const useSignup = () => {
  const { trigger, isMutating, error } = useSWRMutation(
    "/auth/register",
    signup,
  );

  return {
    trigger,
    isMutating,
    error,
  };
};

export const useUser = () => {
  const { isLoading, data, error } = useSWR("/users/me", getUser, {
    shouldRetryOnError: false,
  });

  return {
    isLoading,
    data,
    error,
  };
};
