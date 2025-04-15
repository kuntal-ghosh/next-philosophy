import DataLoader from "dataloader";
import { cache } from "react";
import { Category, ApiError } from "./api-types";

/**
 * Type for data loading results that includes status information
 */
export type DataResult<T> = {
  data: T | null;
  error: Error | null;
  status: "idle" | "loading" | "success" | "error";
};

/**
 * Safe data loader for server components
 * This provides consistent error handling for server-side data operations
 *
 * @param loaderFn - The async function that loads data
 * @param fallbackData - Optional data to return if loading fails
 * @returns The loaded data or fallback
 */
export async function safeDataLoader<T>(
  loaderFn: () => Promise<T>,
  fallbackData: T | null = null
): Promise<T> {
  try {
    return await loaderFn();
  } catch (error) {
    // Log server-side for monitoring/debugging
    console.error("Data loading error:", error);

    // Use fallback data if provided
    if (fallbackData !== null) {
      return fallbackData;
    }

    // Re-throw to be handled by error boundaries
    throw error;
  }
}

/**
 * Safe operation handler for server actions
 * This ensures consistent error handling for server actions and mutations
 *
 * @param actionFn - The async function representing the server action
 * @returns A result object with status information
 */
export async function safeServerAction<T>(
  actionFn: () => Promise<T>
): Promise<DataResult<T>> {
  const result: DataResult<T> = {
    data: null,
    error: null,
    status: "loading",
  };

  try {
    result.data = await actionFn();
    result.status = "success";
  } catch (error) {
    console.error("Server action error:", error);
    result.error =
      error instanceof Error
        ? error
        : new ApiError("Operation failed", 500, "server_action_error", error);
    result.status = "error";
  }

  return result;
}

/**
 * Unified error handling for data operations
 * This provides a standard way to handle errors with retries
 *
 * @param error - The error that occurred
 * @param retry - Optional retry function
 * @returns A result object for client-side error handling
 */
export function handleDataError(
  error: unknown,
  retry?: () => Promise<any>
): { message: string; retryable: boolean; code?: string } {
  let message = "An unexpected error occurred";
  let code = "unknown_error";
  let retryable = !!retry;

  if (error instanceof ApiError) {
    message = error.message;
    code = error.code;

    // Network errors and some server errors are retryable
    if (error.statusCode === 0 || error.statusCode >= 500) {
      retryable = true;
    } else if (error.statusCode === 404 || error.statusCode === 403) {
      // Resource not found or forbidden are not retryable
      retryable = false;
    }
  } else if (error instanceof Error) {
    message = error.message;

    // Network errors are typically retryable
    if (error.name === "NetworkError" || error.name === "AbortError") {
      retryable = true;
    }
  }

  return { message, retryable, code };
}

// Batch function to get multiple categories at once
async function batchGetCategories(categoryIds: readonly string[]) {
  console.log("Batch loading categories:", categoryIds);

  // Query that accepts multiple IDs
  const queryString = categoryIds.map((id) => `id=${id}`).join("&");
  const res = await fetch(`${process.env.API_URL}/categories?${queryString}`);

  if (!res.ok) throw new Error("Failed to load categories");

  const categories = (await res.json()) as Category[];

  // Important: Return results in the same order as the input IDs
  return categoryIds.map(
    (id) => categories.find((category) => category.id === id) || null
  );
}

// Create a new loader per request
export const getCategoryLoader = cache(
  () => new DataLoader(batchGetCategories)
);

// Wrapper function to use in components
export async function getCategory(id: string) {
  const loader = getCategoryLoader();
  return loader.load(id);
}
