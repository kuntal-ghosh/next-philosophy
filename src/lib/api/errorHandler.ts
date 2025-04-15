import { ZodError } from "zod";
import { NextRequest } from "next/server";

// Error types for classification
export enum ErrorType {
  VALIDATION = "validation_error",
  DATABASE = "database_error",
  NOT_FOUND = "not_found",
  CONFLICT = "resource_conflict",
  UNAUTHORIZED = "unauthorized",
  FORBIDDEN = "forbidden",
  INTERNAL = "internal_server_error",
}

// Standardized API response type
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    locale?: string;
    count?: number;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message?: string;
  error?: {
    code: string;
    errors?: any;
    details?: string;
  };
};

// HTTP status code mapping
const errorStatusCodes: Record<ErrorType, number> = {
  [ErrorType.VALIDATION]: 400,
  [ErrorType.DATABASE]: 500,
  [ErrorType.NOT_FOUND]: 404,
  [ErrorType.CONFLICT]: 409,
  [ErrorType.UNAUTHORIZED]: 401,
  [ErrorType.FORBIDDEN]: 403,
  [ErrorType.INTERNAL]: 500,
};

// Create a standardized API response
export function createApiResponse<T>(
  data: T,
  success = true,
  message?: string,
  meta?: Partial<ApiResponse<T>["meta"]>,
  error?: ApiResponse<T>["error"]
): ApiResponse<T> {
  return {
    success,
    data,
    message,
    meta: {
      timestamp: new Date().toISOString(),
      locale: process.env.DEFAULT_LOCALE || "en",
      ...meta,
    },
    ...(error && { error }),
  };
}

// Generic error handler function
export function handleError(
  error: Error | ZodError | unknown,
  type: ErrorType = ErrorType.INTERNAL,
  customMessage?: string
): Response {
  // Determine error message and details
  let message = customMessage || "An unexpected error occurred";
  let code = type;
  let errors = undefined;
  let details = undefined;

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    type = ErrorType.VALIDATION;
    code = ErrorType.VALIDATION;
    message = customMessage || "Invalid data provided";
    errors = error.format();
  }

  // Add debug details in development
  if (process.env.NODE_ENV === "development" && error instanceof Error) {
    details = error.stack || error.message;
  }

  // Build error response
  const errorResponse = createApiResponse(null, false, message, undefined, {
    code,
    ...(errors && { errors }),
    ...(details && { details }),
  });

  return new Response(JSON.stringify(errorResponse), {
    status: errorStatusCodes[type],
    headers: { "Content-Type": "application/json" },
  });
}

// Helper functions for common error scenarios
export function handleValidationError(
  error: ZodError,
  message?: string
): Response {
  return handleError(error, ErrorType.VALIDATION, message);
}

export function handleDatabaseError(error: Error, message?: string): Response {
  return handleError(
    error,
    ErrorType.DATABASE,
    message || "Database operation failed"
  );
}

export function handleNotFoundError(resource?: string): Response {
  const message = resource ? `${resource} not found` : "Resource not found";
  return handleError(new Error(message), ErrorType.NOT_FOUND, message);
}

export function handleConflictError(message: string): Response {
  return handleError(new Error(message), ErrorType.CONFLICT, message);
}

export function handleInternalError(error: Error): Response {
  return handleError(error, ErrorType.INTERNAL, "An unexpected error occurred");
}

// Success response helper
export function createSuccessResponse(
  data: any,
  status = 200,
  message?: string
): Response {
  const response = createApiResponse(data, true, message);

  return new Response(JSON.stringify(response), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Type for API route handlers
export type ApiRouteHandler = (req: NextRequest) => Promise<Response>;

/**
 * Wraps API route handlers with error handling middleware
 * This creates middleware-like error handling for Next.js API routes
 */
export function withErrorHandling(handler: ApiRouteHandler): ApiRouteHandler {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error: any) {
      // Handle Prisma errors
      if (error.code) {
        // Prisma not found error
        if (error.code === "P2025") {
          return handleNotFoundError(error.meta?.cause || "Resource");
        }
        // Prisma unique constraint violation
        if (error.code === "P2002") {
          const field = error.meta?.target?.[0] || "field";
          return handleConflictError(
            `Resource with this ${field} already exists`
          );
        }
      }

      // Handle Zod validation errors
      if (error instanceof ZodError) {
        return handleValidationError(error);
      }

      // Handle any other errors
      console.error("API route error:", error);
      return handleInternalError(error);
    }
  };
}
