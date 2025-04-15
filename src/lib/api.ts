import "server-only";
import { ApiResponse, ApiError, Product, Category, Review } from "./api-types";

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, options);

    // Handle HTTP errors
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);

      // Try to get structured error from API response
      if (errorData && !errorData.success) {
        throw new ApiError(
          errorData.message || "An error occurred",
          res.status,
          errorData.error?.code || "unknown_error",
          errorData.error?.details || null
        );
      }

      // Generic error if we can't parse the response
      throw new ApiError(
        `HTTP error ${res.status}`,
        res.status,
        "http_error",
        null
      );
    }

    const data = await res.json();

    // Check if the response matches our expected format
    if (data && typeof data.success === "boolean") {
      return data as ApiResponse<T>;
    }

    // If the API doesn't return our expected format, wrap it in our format
    return {
      success: true,
      data: data as T,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error) {
    // If it's already our ApiError, just rethrow it
    if (error instanceof ApiError) {
      throw error;
    }

    // Otherwise wrap in our ApiError format
    console.error("API request failed:", error);
    throw new ApiError(
      error instanceof Error ? error.message : "An unexpected error occurred",
      500,
      "client_error",
      process.env.NODE_ENV === "development" ? error : null
    );
  }
}

// Re-export types for convenience
export * from "./api-types";

// API functions
export async function getProducts(categoryId?: string) {
  const url = categoryId
    ? `${process.env.API_URL}/products?categoryId=${categoryId}`
    : `${process.env.API_URL}/products`;

  try {
    const response = await fetchAPI<Product[]>(url, {});

    if (!response.success) {
      throw new ApiError(
        response.message || "Failed to fetch products",
        404,
        response.error?.code || "fetch_error",
        response.error?.details
      );
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    // Rethrow for the component to handle or display
    throw error instanceof ApiError
      ? error
      : new ApiError("Failed to fetch products", 500, "unknown_error", null);
  }
}

export async function getProduct(id: string) {
  try {
    const response = await fetchAPI<Product>(
      `${process.env.API_URL}/products/${id}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.success) {
      throw new ApiError(
        response.message || `Failed to fetch product ${id}`,
        404,
        response.error?.code || "fetch_error",
        response.error?.details
      );
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error instanceof ApiError
      ? error
      : new ApiError(
          `Failed to fetch product ${id}`,
          500,
          "unknown_error",
          null
        );
  }
}

export async function getProductReviews(productId: string) {
  try {
    const response = await fetchAPI<Review[]>(
      `${process.env.API_URL}/products/${productId}/reviews`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.success) {
      throw new ApiError(
        response.message || "Failed to fetch reviews",
        404,
        response.error?.code || "fetch_error",
        response.error?.details
      );
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    throw error instanceof ApiError
      ? error
      : new ApiError("Failed to fetch reviews", 500, "unknown_error", null);
  }
}

export async function getRelatedProducts(productId: string) {
  try {
    const response = await fetchAPI<Product[]>(
      `${process.env.API_URL}/products/${productId}/related`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.success) {
      throw new ApiError(
        response.message || "Failed to fetch related products",
        404,
        response.error?.code || "fetch_error",
        response.error?.details
      );
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error instanceof ApiError
      ? error
      : new ApiError(
          "Failed to fetch related products",
          500,
          "unknown_error",
          null
        );
  }
}

export async function getCategories() {
  try {
    const response = await fetchAPI<Category[]>(
      `${process.env.API_URL}/categories`,
      {
        // next: { revalidate: 86400 }, // Cache for a day
      }
    );
    console.log("🚀 ~ getCategories ~ response:", response);

    if (!response.success) {
      throw new ApiError(
        response.message || "Failed to fetch categories",
        404,
        response.error?.code || "fetch_error",
        response.error?.details
      );
    }

    return response.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error instanceof ApiError
      ? error
      : new ApiError("Failed to fetch categories", 500, "unknown_error", null);
  }
}
