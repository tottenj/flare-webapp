import { ActionResult } from "../types/ActionResult";
import { AppError } from "./AppError";

export default function fail<T>(err: AppError, fieldErrors?: Record<string, string[]>): ActionResult<T> {
  return {
    ok: false,
    error: {
      code: err.code,
      message: err.clientMessage,
      ...(fieldErrors ? { fieldErrors } : {}),
    },
  };
}
