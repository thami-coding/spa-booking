import type { ApiErrorPayload } from "../types/types";

interface ErrorDetails {
  loc: string[];
  msg: string;
}

export const formatErrors = (errors: ApiErrorPayload | undefined) => {
  if (!errors) return;

  const isDetails = errors && "detail" in errors;
  const validationErrors: Record<string, string> = {};

  if (!isDetails) {
    const field = errors.error.field;
    validationErrors[field] = errors.error.message;
    return validationErrors;
  }

  for (const error of errors.detail as ErrorDetails[]) {
    const { loc, msg } = error;
    const key = loc[1];
    validationErrors[key] = msg;
  }

  return validationErrors;
};
