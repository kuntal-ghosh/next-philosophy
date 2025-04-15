"use client";

import { useState, useCallback } from "react";
import { useError } from "@/app/context/ErrorContext";
import { ApiError, ApiResponse } from "@/lib/api-types";

type RequestState = "idle" | "loading" | "success" | "error";

export function useClientAction<T, P = any>(
  action: (params: P) => Promise<ApiResponse<T>>,
  options?: {
    onSuccess?: (data: T) => void;
    onError?: (error: Error | ApiError) => void;
    showGlobalError?: boolean;
  }
) {
  const [state, setState] = useState<RequestState>("idle");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | ApiError | null>(null);
  const { setError: setGlobalError } = useError();

  const execute = useCallback(
    async (params: P) => {
      setState("loading");
      setError(null);

      try {
        const response = await action(params);

        if (!response.success) {
          // Handle unsuccessful responses
          const apiError = new ApiError(
            response.message || "Operation failed",
            400, // Default status code
            response.error?.code || "unknown_error",
            response.error?.details
          );

          throw apiError;
        }

        setState("success");
        setData(response.data);

        if (options?.onSuccess) {
          options.onSuccess(response.data);
        }

        return response.data;
      } catch (err) {
        setState("error");

        const errorObject =
          err instanceof Error ? err : new Error("Unknown error occurred");
        setError(errorObject);

        // Show in global error display if enabled
        if (options?.showGlobalError !== false) {
          setGlobalError(errorObject);
        }

        if (options?.onError) {
          options.onError(errorObject as Error | ApiError);
        }

        throw err;
      }
    },
    [action, options, setGlobalError]
  );

  return {
    execute,
    state,
    data,
    error,
    isLoading: state === "loading",
    isSuccess: state === "success",
    isError: state === "error",
    reset: useCallback(() => {
      setState("idle");
      setData(null);
      setError(null);
    }, []),
  };
}
